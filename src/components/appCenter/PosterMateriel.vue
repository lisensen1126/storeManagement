<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slide_visible", :is-slim="true", @input="toggleSidePannel")
      how-used
    .nav-back-btn(@click="goBack")
    empty-page(v-if="empty", tip="当前没有宣传海报物料")
    down-url(v-if="show_down", v-model="show_down" :default-value="down_url")
    .poster-wrapper(v-if="!empty")
      .item-name
        .label  线下宣传海报
      .poster-down.poster-box
        .down-poster
          .down-content
            //- 商品的信息
            .product-info(v-if="product_info")
              .top-box
                img.tip(:src="product_info.type === 1 ? good_icon : product_info.type === 2 ? serve_icon : card_icon")
                img.top-img(:src="product_info.img")
              .bottom-box
                .product-name {{product_info.name}}
                .price
                  .red 秒杀价：{{product_info.limit_price}}
                  .gray {{product_info.sell_price}}
            .store-info
              .left-box
                .store-name(v-if="down_poster.store") {{currentStore.store_name}}
                .store-address(v-if="down_poster.address")
                  img.icon(src="https://oss1.chedianai.com/php-poster/black-address.png")
                  .text {{currentStore.address}}
                .store-phone(v-if="down_poster.phone") 
                  img.icon(src="https://oss1.chedianai.com/php-poster/black-phone.png")
                  .text {{currentStore.reservation_phone}}
              img.right-qr(v-if="qr_code_down", :src="qr_code_down")
            img.down-img(:src="down_poster_img", v-if="down_poster_img")
        .setting-box
          .form-box
            .label 海报内容：
            .select-box.checkbox-td
              .checkbox
                input(type="checkbox", id="store-down", :checked="down_poster.store", @input="changeDown(1)")
                label(for="store-down") 门店名称 {{currentStore.store_name}}
              .checkbox
                input(type="checkbox", id="address-down", :checked="down_poster.address", @input="changeDown(2)")
                label(for="address-down") 门店地址 {{currentStore.address}}
              .checkbox
                input(type="checkbox", id="phone-down", :checked="down_poster.phone", @input="changeDown(3)")
                label(for="phone-down",) 门店电话 {{currentStore.reservation_phone}}
          .form-box
            .label 海报规格：
            .select-box.checkbox-td
              .checkbox(v-if="down_poster.show_big")
                input(type="checkbox", id="big", :checked="down_poster.big", @input="changeType(1)")
                label(for="big") 【易拉宝海报】80cm*180cm
              .checkbox(v-if="down_poster.show_normal")
                input(type="checkbox", id="normal", :checked="down_poster.normal", @input="changeType(2)")
                label(for="normal") 【常规海报】50cm*70cm
              .checkbox(v-if="down_poster.show_a4")
                input(type="checkbox", id="a4", :checked="down_poster.a4", @input="changeType(3)")
                label(for="a4",) 【A4海报】210mm*297mm
          .form-box(v-if="count > 1")
            .label 海报模板：
            .button-box
              a.button.primary(@click="changePoster") 切换海报模板
          .form-box
            .label 下载链接：
            .button-box
              a.button(:class="can_click ? 'primary' : 'no-click'", v-if="down_poster.status === 1", @click="makePoster(1)") 生成海报链接
              a.button(v-if="down_poster.status === 2") 海报链接生成中
              a.button.primary(v-if="down_url", @click="showDown") 查看海报链接
          .form-box
            .red-tip 注：小程序二维码扫描后将跳到智慧门店小程序对应“秒杀商品”页面。
          .form-box.tip 温馨提示：
          .form-box.padding-50.tip 1、易拉宝80cm*180cm海报电商平台制作价格为100元左右，展架价格为50元左右。
      .item-name(v-if="up_poster_img")
        .label  线上宣传海报
      .poster-up.poster-box(v-if="up_poster_img")
        .up-poster
          .up-content
            //- 商品信息 1 商品 2 服务 3-5 卡片
            .product-info(v-if="product_info")
              .left-box
                img.tip(:src="product_info.type === 1 ? good_icon : product_info.type === 2 ? serve_icon : card_icon")
                img.left-img(v-if="product_info.img", :src="product_info.img")
              .right-content
                .product-name {{product_info.name}}
                .price
                  .red 秒杀价：{{product_info.limit_price}}
                  .gray(v-if="product_info.sell_price") {{product_info.sell_price}}
            //- 门店信息
            .store-info
              .left-box
                .store-name(v-if="up_poster.store") {{currentStore.store_name}}
                .store-address(v-if="up_poster.address")
                  img.icon(src="https://oss1.chedianai.com/php-poster/black-address.png")
                  .text {{currentStore.address}}
                .store-phone(v-if="up_poster.phone") 
                  img.icon(src="https://oss1.chedianai.com/php-poster/black-phone.png")
                  .text {{currentStore.reservation_phone}}
              img.right-qr(v-if="qr_code_up", :src="qr_code_up")
            img.up-img(:src="up_poster_img", v-if="up_poster_img")
        .setting-box
          .form-box
            .label 海报内容：
            .select-box.checkbox-td
              .checkbox
                input(type="checkbox", id="store-up", :checked="up_poster.store", @input="changeUp(1)")
                label(for="store-up") 门店名称  {{currentStore.store_name}}
              .checkbox
                input(type="checkbox", id="address-up", :checked="up_poster.address", @input="changeUp(2)")
                label(for="address-up") 门店地址  {{currentStore.address}}
              .checkbox
                input(type="checkbox", id="phone-up", :checked="up_poster.phone", @input="changeUp(3)")
                label(for="phone-up",) 门店电话  {{currentStore.reservation_phone}}
          .form-box
            .label 海报规格：
            .content 345px*490px
          .form-box
            .label 
            .button-box
              a.button.primary(@click="makePoster(2)") 生成线上宣传海报到企业微信
          .form-box
            .red 生成后的海报可在企业微信查看分享
            .blue(@click="toggleSidePannel") 查看使用方法
          .form-box
            .red-tip 注：小程序二维码扫描后将跳到智慧门店小程序对应“秒杀商品”页面。
</template>

<script>
  import ProductServiceMixin from '@/mixins/modules/productService'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import EmptyPage from '@/components/generics/EmptyPage'
  import Api from '@/mixins/modules/AppCenter'
  import DownUrl from '@/components/appCenter/model/DownPosterUrl'
  import HowUsed from '@/components/appCenter/model/HowUsed'
  import { mapGetters } from 'vuex'
  import spikeApi from '@/mixins/modules/Spike'
  export default {
    name: 'PosterList',
    mixins: [Api, spikeApi, ProductServiceMixin],
    components: {
      DownUrl,
      EmptyPage,
      HowUsed,
      SlideOutModal,
    },
    computed: {
      ...mapGetters({
        currentStore: 'currentStore',
      }),
    },
    data () {
      return {
        slide_visible: false, // 是否显示侧边弹框
        can_click: true, // 是否可以点击生产海报
        count: '', // 海报模板的数量
        empty: false, // 是否展示空页面
        now_id: 0, // 当前模板id
        qr_code_up: '', // 线上二维码
        qr_code_down: '', // 线下二维码
        down_url: '', // 下载链接
        show_down: false, // 是否显示下载弹框
        phone_icon: 'https://oss1.chedianai.com/phone-icon.png',
        serve_icon: 'https://oss1.chedianai.com/images/assets/service-icon.png',
        good_icon: 'https://oss1.chedianai.com/images/assets/goods-icon.png',
        card_icon: 'https://oss1.chedianai.com/images/assets/card-icon.png',
        down_poster: { // 控制线下海报的选择状态
          store: true, // 门店
          address: true, // 地址
          phone: true, // 电话
          big: true, // 易拉宝是否选中
          a4: true, // a4是否选中
          normal: true, // 正常是否选中
          status: 1, // 海报状态 1 生成 2 生成中
          show_big: true, // 易拉宝是否展示
          show_a4: true, // a4是否展示
          show_normal: true, // 正常是否展示
        },
        up_poster: { // 控制线上海报的选择状态
          store: true,
          address: true,
          phone: true,
        },
        params: {},
        product_info: null, // 商品的信息
        down_poster_img: '', // 线下海报背景
        up_poster_img: '', // 线上海报背景
      }
    },
    methods: {
      // 预览
      toggleSidePannel () {
        this.slide_visible = !this.slide_visible
      },
      /**
       * 生成参数
       * type 1 线下 2线上
       */
      makePoster (type) {
        let params = {
          post_id: this.now_id,
          obj_id: this.$route.query.spike_id,
          type: 1,
        }
        // 商品
        if (this.product_info.type === 1) {
          params.sku_id = this.product_info.sku_id
          params.spu_id = this.product_info.spu_id
          params.serve_type = 1
          params.path = 'pages/spilkeGroup/timeLimitGoodsDetail/timeLimitGoodsDetail'
        }
        // 服务
        if (this.product_info.type === 2) {
          params.spu_id = this.product_info.spu_id
          params.serve_type = 2
          params.path = 'pages/spilkeGroup/timeLimitServiceDetail/timeLimitServiceDetail'
        }
        // 养护卡
        if (this.product_info.type > 2) {
          params.card_id = this.product_info.card_id
          params.serve_type = 3
          params.path = 'pages/spilkeGroup/timeLimitPurchaseDetail/timeLimitPurchaseDetail'
        }
        // 商品的信息
        let productInfo = {
          name: this.product_info.name,
          img: this.product_info.img,
          limit_price: '秒杀价：' + this.product_info.limit_price,
          sell_price: '原价：' + this.product_info.sell_price,
        }
        if (this.product_info.type === 1) {
          productInfo.icon = this.good_icon
        } else if (this.product_info.type === 2) {
          productInfo.icon = this.serve_icon
        } else {
          productInfo.icon = this.card_icon
        }
        params.product_info = JSON.stringify(productInfo)
        // 线上海报选择状态
        if (type === 2) {
          let text = {}
          if (this.up_poster.store) text.name = this.currentStore.store_name
          if (this.up_poster.address) text.add = this.currentStore.address
          if (this.up_poster.phone) text.tel = this.currentStore.reservation_phone
          params.text = JSON.stringify(text)
          params.post_type = [5]
          this.makeUp(params)
        } else {
          if (!this.can_click) {
            return
          }
          // 线下海报选择状态
          let text = {}
          if (this.down_poster.store) text.name = this.currentStore.store_name
          if (this.down_poster.address) text.add = this.currentStore.address
          if (this.down_poster.phone) text.tel = this.currentStore.reservation_phone
          params.text = JSON.stringify(text)
          // 线下海报选中的类型
          let postType = []
          if (this.down_poster.big) postType.push(2)
          if (this.down_poster.normal) postType.push(3)
          if (this.down_poster.a4) postType.push(4)
          params.post_type = postType
          params.hide_loading = false
          this.makeDown(params)
        }
      },
      /**
       * 生成海报
       * index 次数
       */
      async getUrl (index) {
        let self = this
        try {
          const {response, result} = await this.getDownUrlApi({
            post_id: this.now_id,
            type: 1,
            obj_id: this.$route.query.spike_id,
            hide_loading: false,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              if (result.data.status) {
                this.down_url = result.data.download
                this.qr_code_down = result.data.qr_code
                this.down_poster.status = 1
              } else {
                index += 1
                if (index < 8) {
                  setTimeout(function () {
                    self.getUrl(index)
                  }, 5000)
                } else {
                  this.down_poster.status = 1
                }
              }
              // 获取包的接口
            } else {
              this.down_poster.status = 1
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '生成海报打包链接失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.down_poster.status = 1
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '生成海报打包链接失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.down_poster.status = 1
          console.error(err, '生成海报打包链接失败')
        }
      },
      // 生成海报
      async makeDown (params) {
        this.down_url = ''
        try {
          const {response, result} = await this.makeDownPosterApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              this.down_poster.status = 2
              // 获取包的接口
              this.getUrl(1)
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '下载海报失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '下载海报失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '下载海报')
        }
      },
      // 线上海报制作makeUpPosterApi
      async makeUp (params) {
        try {
          const {response, result} = await this.makeUpPosterApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              this.qr_code_up = result.data.qr_code
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '下载海报失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '下载海报失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '下载海报')
        }
      },
      // 切换海报模板
      async changePoster () {
        let params = {
          obj_id: this.$route.query.spike_id,
          type: 1,
          id: this.now_id,
        }
        try {
          const {response, result} = await this.changePosterApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              if (Array.isArray(result.data)) {
                this.empty = true
                return
              }
              this.can_click = true
              this.count = result.data.count
              this.now_id = result.data.id
              this.down_poster.status = 1
              this.down_poster_img = result.data.preview
              this.up_poster_img = result.data.online
              this.qr_code_up = result.data.online_qr_code
              this.qr_code_down = result.data.offline_qr_code
              this.down_url = result.data.offline_download
              let arr = result.data.offline
              // 是否有易拉宝
              if (arr.indexOf(2) !== -1) {
                this.down_poster.big = true
                this.down_poster.show_big = true
              } else {
                this.down_poster.big = false
                this.down_poster.show_big = false
              }
              // 是否有正常
              if (arr.indexOf(3) !== -1) {
                this.down_poster.normal = true
                this.down_poster.show_normal = true
              } else {
                this.down_poster.normal = false
                this.down_poster.show_normal = false
              }
              // 是否有a4
              if (arr.indexOf(4) !== -1) {
                this.down_poster.a4 = true
                this.down_poster.show_a4 = true
              } else {
                this.down_poster.a4 = false
                this.down_poster.show_a4 = false
              }
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '海报模板详情获取失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '海报模板详情获取失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '秒杀详情')
        }
      },
      // z展示弹框
      showDown () {
        this.show_down = true
      },
      changeUp (index) {
        if (index === 1) this.up_poster.store = !this.up_poster.store
        if (index === 2) this.up_poster.address = !this.up_poster.address
        if (index === 3) this.up_poster.phone = !this.up_poster.phone
        console.log(this.up_poster, '线上')
      },
      changeDown (index) {
        if (index === 1) this.down_poster.store = !this.down_poster.store
        if (index === 2) this.down_poster.address = !this.down_poster.address
        if (index === 3) this.down_poster.phone = !this.down_poster.phone
        console.log(this.up_poster, '线下')
      },
      changeType (index) {
        if (index === 1) this.down_poster.big = !this.down_poster.big
        if (index === 2) this.down_poster.normal = !this.down_poster.normal
        if (index === 3) this.down_poster.a4 = !this.down_poster.a4
        if (!this.down_poster.a4 && !this.down_poster.normal && !this.down_poster.big) {
          this.can_click = false
        } else {
          this.can_click = true
        }
      },
      // 返回海报列表
      goBack () {
        this.$router.push({
          name: 'spikePosterList',
        })
      },
      async getData () {
        try {
          const {response, result} = await this.spikeDetailApi({
            id: this.$route.query.spike_id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              let data = result.data.product
              let name = data.name
              var productInfo = {
                seckill_id: data.id,
                spu_id: data.basic_spu_id,
                card_id: data.basic_spu_id,
                type: data.type,
                sku_id: data.sku[0].basic_sku_id,
                limit_price: (data.sku[0].limit_price / 100).toFixed(2),
                name: data.type === 1 ? name + data.sku[0].name : name,
              }
              if (data.type < 3) {
                productInfo.img = data.type === 1 ? data.sku[0].pic : data.pic
                productInfo.sell_price = data.type === 1 ? (data.sku[0].sell_price / 100).toFixed(2) : (data.sell_price / 100).toFixed(2)
              }
              this.product_info = productInfo
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '秒杀详情获取失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '秒杀详情获取失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '秒杀详情')
        }
      },
      async getDetail () {
        let id = this.$route.query.id - 0
        try {
          const {response, result} = await this.upkeepDetailApi({id: id})
          if (response.status === 200 && result.code === 0) {
            let data = result.data.info
            let productInfo = this.product_info
            this.product_info = null
            productInfo.img = data.image_url
            productInfo.sell_price = (data.origin_price / 100).toFixed(2)
            this.product_info = productInfo
            console.log(this.product_info, '商品')
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '养护卡详情获取失败',
              content: result.data,
            })
          }
        } catch (err) {
          console.error(err, '养护卡详情')
        }
      },
    },
    mounted () {
      // 获取模板信息
      this.changePoster()
      // 获取秒杀信息
      this.getData()
      // 如果养护卡获取养护卡详情
      if (this.$route.query.good_type - 0 > 2) {
        this.getDetail()
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  .no-click
    cursor not-allowed
  .button
    margin-right 20px !important
  .down-poster
    width 200px
    height 450px
    margin-right 30px
    position relative
    .down-content
      -webkit-transform scale(0.29,0.29)
      width 690px
      height 1553px
      position absolute
      top: -553px
      left: -243px
      .store-info
        width 690px
        min-height 168px
        position absolute
        top 425px
        left 0
        z-index 999
        box-sizing border-box
        padding 23px 94px 32px 98px
        display flex
        justify-content space-between
        .left-box
          width 413px
          hieght 158px
          display flex
          flex-flow column
          justify-content center
          .store-name
            font-size 24px
            font-weight 600
            color #4B4C4F
            line-height 34px
            margin-bottom 11px
          .store-phone
            display flex
            justify-content start
            font-size 15px
            font-weight 400
            color #4B4C4F
            line-height 21px
            .icon
              width 15px
              height 15px
              margin-top 2px
          .store-address
            display flex
            justify-content start
            font-size 15px
            font-weight 400
            color #4B4C4F
            line-height 21px
            margin-bottom 6px
            .icon
              width 15px
              height 15px
              margin-top 2px
        .right-qr
          width 122px
          height 122px
      .product-info
        width 555px
        min-height 465px
        background white
        box-sizing border-box
        padding 26px 25px 30px
        position absolute
        bottom 198px
        left 67px
        z-index 999
        pos
        .top-box
          width 506px
          height 315px
          margin-bottom 20px
          position relative
          .top-img
            width 506px
            height 315px
          .tip
            width 136px
            height 46px
            position absolute
            top -4px
            right -4px
        .bottom-box
          .product-name
            width 100%
            text-align center
            color #4f4e4d
            line-height 26px
            font-size 26px
            margin-bottom 20px
           .price
              width 100%
              text-align center
              .red
                display inline-block
                font-size 26px
                font-weight 500
                color #cc352e
                line-height 26px
                margin-right 16px
              .gray
                display inline-block
                font-size 18px
                color #4f4e4d
                line-height 26px
                text-decoration line-through
                vertical-align top      
      .down-img
        width 690px
        height 1553px
        position absolute
        top 0
        left 0
        z-index 99
  .up-poster
    width 200px
    height 284px
    margin-right 30px
    position relative
    .up-content
      -webkit-transform scale(0.29,0.29)
      width 690px
      height 980px
      position absolute
      top: -337px;
      left: -250px;
      .product-info
        width 610px
        height 190px
        box-sizing border-box
        padding 30px 13px 26px 30px
        position absolute
        top 277px
        left 30px
        z-index 999
        display flex
        justify-content start
        .right-content
          display flex
          justify-content space-between
          flex-flow column
          margin-left 16px
          height 134px
          width 356px
          .product-name
            font-size 22px
            font-weight 500
            color rgba(64,64,64,1)
            line-height 33px
          .price
            display flex
            justify-content start
            .red
              font-size 26px
              font-weight 500
              color rgba(229,1,19,1)
              line-height 26px
              margin-right 16px
            .gray
              font-size 18px
              font-weight 500
              color rgba(166,166,166,1)
              line-height 26px
              text-decoration line-through
        .left-box
          width 214px
          height 134px
          position relative
          .left-img
            width 214px
            height 134px
          .tip
            width 61px
            height 22px
            position absolute
            top -2px
            right -2px
      .store-info
        width 690px
        min-height 180px
        position absolute
        bottom 0
        left 0
        z-index 999
        box-sizing border-box
        padding 30px
        display flex
        justify-content space-between
        .left-box
          width 488px
          hieght 120px
          display flex
          flex-flow column
          justify-content center
          .store-name
            font-size 32px
            font-weight 500
            color #4B4C4F
            line-height 45px
            margin-bottom 8px
          .store-phone
            display flex
            justify-content start
            font-size 20px
            font-weight 400
            color #4B4C4F
            line-height 28px
            .icon
              width 24px
              height 24px
              margin-top 2px
          .store-address
            display flex
            justify-content start
            font-size 20px
            font-weight 400
            color #4B4C4F
            line-height 28px
            margin-bottom 6px
            .icon
              width 24px
              height 24px
              margin-top 2px
        .right-qr
          width 120px
          height 120px
      .up-img
        width 690px
        height 980px
        position absolute
        top 0
        left 0
        z-index 99
  .select-box
  &.checkbox-td
    display flex
    justify-content start
    flex-flow column
    padding-top 14px
    .checkbox
      margin-bottom 15px
  .poster-box
    display flex
    justify-content start
    padding 20px
    .setting-box
      width 600px
      box-sizing border-box
      padding 20px 0
      .form-box
        display flex
        justify-content start
        font-size 15px
        line-height 36px
        .red-tip
          color red
          font-size 12px
        .label
          font-weight bold
        .content
          color #666666
        .red 
          color red
          font-size 12px
        .blue
          color #2fabdd
          font-size 12px
          cursor pointer
      .tip
        color #666666
        font-size 13px
        line-height 15px
      .padding-50
        padding-left 50px
  .item-name
    box-sizing border-box
    padding 20px
    border-bottom: 1px solid #f1f1f1;
    display flex
    justify-content start
    .label
      font-size 16px
      font-weight bold
      color black
      padding-right 20px
    .name
      font-size  15px
      font-weight 400
      color #666
  .section-layout
    height 92%
    .poster-wrapper
      background white
      height 100%
      overflow auto
      margin 25px 40px
      border-radius 5px
      padding-bottom 60px
  .nav-back-btn
    position absolute
    top -39px
    left 16px
    width 32px
    height 32px
    border-radius 100%
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
    cursor pointer
    z-index 111
</style>
