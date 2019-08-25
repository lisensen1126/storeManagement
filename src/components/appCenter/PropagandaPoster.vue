
<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slide_visible", :is-slim="true", @input="toggleSidePannel")
      how-used
    down-url(v-if="show_down", v-model="show_down" :default-value="down_url")
    empty-page(v-if="!(list && list.length)", tip="当前没有海报")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        .content-box.table(v-for="(item, index) in list")
          .item-box
            .item-name
              .label  海报名称：
              .name {{item.name}}
            .content-poster
              .left-down
                .down-poster
                  .down-content
                    //- 门店的信息
                    .store-info
                      .left-box
                        .store-name(v-if="item.down_store") {{currentStore.store_name}}
                        .store-address(v-if="item.down_address")
                          img.icon(src="https://oss1.chedianai.com/php-poster/black-address.png")
                          .text {{currentStore.address}}
                        .store-phone(v-if="item.down_phone") 
                          img.icon(src="https://oss1.chedianai.com/php-poster/black-phone.png")
                          .text {{currentStore.reservation_phone}}
                      img.right-qr(v-if="item.offline_qr_code",:src="item.offline_qr_code")
                    img.down-img(:src="item.preview")
                .setting-box
                  .form-box
                    .label 海报类型：
                    .content 线下宣传海报
                  .form-box
                    .label 海报内容：
                    .select-box.checkbox-td
                      .checkbox
                        input(type="checkbox", :id="'store' + index", :checked="item.down_store", @input="changeStatus('down_store', index)")
                        label(:for="'store' + index") 门店名称 {{currentStore.store_name}}
                      .checkbox
                        input(type="checkbox", :id="'address' + index", :checked="item.down_address", @input="changeStatus('down_address', index)")
                        label(:for="'address' + index") 门店地址 {{currentStore.address}}
                      .checkbox
                        input(type="checkbox", :id="'phone' + index", :checked="item.down_phone", @input="changeStatus('down_phone', index)")
                        label(:for="'phone' + index",) 门店电话 {{currentStore.reservation_phone}}
                  .form-box
                    .label 海报规格：
                    .select-box.checkbox-td
                      .checkbox(v-if="item.show_big")
                        input(type="checkbox", :id="'big' + index", :checked="item.down_big", @input="changeStatus('down_big', index)")
                        label(:for="'big' + index") 【易拉宝海报】80cm*180cm
                      .checkbox(v-if="item.show_normal")
                        input(type="checkbox", :id="'normal' + index", :checked="item.down_normal", @input="changeStatus('down_normal', index)")
                        label(:for="'normal' + index") 【常规海报】50cm*70cm
                      .checkbox(v-if="item.show_a4")
                        input(type="checkbox", :id="'a4' + index", :checked="item.down_a4", @input="changeStatus('down_a4', index)")
                        label(:for="'a4' + index",) 【A4海报】210mm*297mm
                  .form-box
                    .label 下载链接：
                    .button-box
                      a.button(:class="item.can_click ? 'primary' : 'no-click'", v-if="item.status === 1" @click="makeDown(index, item)") 生成海报链接
                      a.button(v-if="item.status === 2" ) 海报链接生成中
                      a.button.primary(v-if="item.offline_download" @click="showDown(index, item)") 查看海报链接
              .right-up(v-if="item.online")
                .up-poster
                  .up-content
                    //- 门店信息
                    .store-info
                      .left-box
                        .store-name(v-if="item.up_store") {{currentStore.store_name}}
                        .store-address(v-if="item.up_address")
                          img.icon(src="https://oss1.chedianai.com/php-poster/black-address.png")
                          .text {{currentStore.address}}
                        .store-phone(v-if="item.up_phone")
                          img.icon(src="https://oss1.chedianai.com/php-poster/black-phone.png")
                          .text {{currentStore.reservation_phone}}
                      img.right-qr(v-if="item.online_qr_code",:src="item.online_qr_code")
                    img.up-img(:src="item.online")
                .setting-box
                  .form-box
                    .label 海报类型：
                    .content 线上宣传海报
                  .form-box
                    .label 海报内容：
                    .select-box.checkbox-td
                      .checkbox
                        input(type="checkbox", :id="'store-up' + index", :checked="item.up_store",  @input="changeStatus('up_store', index)")
                        label(:for="'store-up' + index") 门店名称 {{currentStore.store}}
                      .checkbox
                        input(type="checkbox", :id="'address-up' + index", :checked="item.up_address", @input="changeStatus('up_address', index)")
                        label(:for="'address-up' + index") 门店地址 {{currentStore.address}}
                      .checkbox
                        input(type="checkbox", :id="'phone-up' + index", :checked="item.up_phone", @input="changeStatus('up_phone', index)")
                        label(:for="'phone-up' + index",) 门店电话 {{currentStore.reservation_phone}}
                  .form-box
                    .label 海报规格：
                    .content 345px*490px
                  .form-box
                    .label 
                    .button-box
                      a.button.primary(@click="makeUp(index, item)") 生成线上宣传海报到企业微信
                  .form-box
                    .red 生成后的海报可在企业微信查看分享
                    .blue(@click="toggleSidePannel") 查看使用方法
            .foot-tip
              .top-txt 温馨提示：
              .bottom-content
                .first 1、小程序二维码扫描后将跳到智慧门店小程序首页。
                .second 2、易拉宝80cm*180cm海报电商平台制作价格为100元左右，展架价格为50元左右。  
        .tfoot(v-if="list.length")
      pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
  import HowUsed from '@/components/appCenter/model/HowUsed'
  import CustomInput from '@/components/generics/form/CustomInput'
  import EmptyPage from '@/components/generics/EmptyPage'
  import Api from '@/mixins/modules/AppCenter'
  import Pagination from '@/components/generics/Pagination'
  import imageScale from '@/mixins/utilities/imageScale'
  import { mapGetters } from 'vuex'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import DownUrl from '@/components/appCenter/model/DownPosterUrl'
  export default {
    name: 'PosterList',
    mixins: [Api, imageScale],
    components: {
      EmptyPage,
      CustomInput,
      Pagination,
      HowUsed,
      DownUrl,
      SlideOutModal,
    },
    computed: {
      ...mapGetters({
        currentStore: 'currentStore',
      }),
    },
    data () {
      return {
        slide_visible: false,
        down_url: '',
        show_down: false, // 展示弹框
        list: [],
        paginationData: {
          current_page: 1,
          per_page: 3,
          last_page: 1,
          total: 0,
        },
      }
    },
    methods: {
      // 预览
      toggleSidePannel () {
        this.slide_visible = !this.slide_visible
      },
      /**
       * 获取海报打包地址
       * num 次数
       * id 海报id
       * index 下标
       */
      async getUrl (num, id, index) {
        let self = this
        try {
          const {response, result} = await this.getDownPropagateUrlApi({
            post_id: id,
            hide_loading: false,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              if (result.data.status) {
                this.list[index].status = 1
                this.list[index].offline_qr_code = result.data.qr_code
                this.list[index].offline_download = result.data.download
              } else {
                num += 1
                if (num < 8) {
                  setTimeout(function () {
                    self.getUrl(num, id, index)
                  }, 5000)
                } else {
                  this.list[index].status = 1
                }
              }
              // 获取包的接口
            } else {
              this.list[index].status = 1
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '生成海报打包链接失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.list[index].status = 1
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '生成海报打包链接失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.list[index].status = 1
          console.error(err, '生成海报打包链接失败')
        }
      },
      /**
       * 制作线下海报
       * index 下标
       * item 对象
       */
      async makeDown (index, item) {
        if (!item.can_click) {
          return
        }
        this.list[index].offline_download = ''
        let params = {
          path: 'pages/index/index',
          post_id: item.id,
        }
        let text = {}
        if (item.down_store) text.name = this.currentStore.store_name
        if (item.down_address) text.add = this.currentStore.address
        if (item.down_phone) text.tel = this.currentStore.reservation_phone
        params.text = JSON.stringify(text)
        let postType = []
        if (item.down_big) postType.push(2)
        if (item.down_normal) postType.push(3)
        if (item.down_a4) postType.push(4)
        params.post_type = postType
        params.hide_loading = false
        try {
          const {response, result} = await this.makeDownPropagateApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              this.list[index].status = 2
              // 获取包的接口
              this.getUrl(1, params.post_id, index)
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
      showDown (index, item) {
        this.show_down = true
        this.down_url = this.list[index].offline_download
      },
      // 生成海报到企业微信
      async makeUp (index, item) {
        let params = {
          post_type: [5],
          path: 'pages/index/index',
          post_id: item.id,
        }
        let text = {}
        if (item.up_store) text.name = this.currentStore.store_name
        if (item.up_address) text.add = this.currentStore.address
        if (item.up_phone) text.tel = this.currentStore.reservation_phone
        params.text = JSON.stringify(text)
        try {
          const {response, result} = await this.makeUpPropagateApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              this.list[index].online_qr_code = result.data.qr_code
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '生成海报到企业微信失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '生成海报到企业微信海报失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '下载海生成海报到企业微信报')
        }
      },
      // 改变选择状态
      changeStatus (type, index) {
        this.list[index][type] = !this.list[index][type]
        if (!this.list[index].down_big && !this.list[index].down_a4 && !this.list[index].down_normal) {
          this.list[index].can_click = false
        } else {
          this.list[index].can_click = true
        }
      },
      // 获取列表数据
      async getList () {
        try {
          const { response, result } = await this.getPropagateListApi({
            page: this.paginationData.current_page,
            per_page: this.paginationData.per_page,
          })
          if (response.status === 200 && result.code === 0) {
            result.data.forEach(item => {
              item.can_click = true
              item.up_store = true
              item.up_address = true
              item.up_phone = true
              item.down_store = true
              item.down_address = true
              item.down_phone = true
              item.status = 1
              // 是否有易拉宝
              if (item.offline.indexOf(2) !== -1) {
                item.down_big = true
                item.show_big = true
              } else {
                item.down_big = false
                item.show_big = false
              }
              // 是否有正常
              if (item.offline.indexOf(3) !== -1) {
                item.down_normal = true
                item.show_normal = true
              } else {
                item.down_normal = false
                item.show_normal = false
              }
              // 是否有a4
              if (item.offline.indexOf(4) !== -1) {
                item.down_a4 = true
                item.show_a4 = true
              } else {
                item.down_a4 = false
                item.show_a4 = false
              }
            })
            this.list = result.data
            console.log(this.list, '列表')
            this.paginationData = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取海报列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '海报列表')
        }
      },
      // 搜索
      search () {
        this.paginationData.current_page = 1
        this.getList()
      },
      // 重置
      reset () {
        this.paginationData.current_page = 1
        this.getList()
      },
      // 分页跳转
      paging (state) {
        this.paginationData = state
        this.getList()
      },
    },
    mounted () {
      this.getList()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  .no-click
    cursor not-allowed
  .button
    margin-right 20px !important
  .up-poster
    width 160px
    height 227px
    margin-right 30px
    position relative
    .up-content
      -webkit-transform scale(0.23,0.23)
      width 690px
      height 980px
      position absolute
      top: -378px;
      left: -261px;
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
  .down-poster
    width 160px
    height 360px
    margin-right 30px
    position relative
    .down-content
      -webkit-transform scale(0.23,0.23)
      width 690px
      height 1553px
      position absolute
      top: -599px
      left: -266px      
      .down-img
        width 690px
        height 1553px
        position absolute
        top 0
        left 0
        z-index 99
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
  .foot-tip
    color #666666
    font-size 12px
    padding 10px 20px
    .bottom-content
      padding-left 75px
  .select-box
  &.checkbox-td
    display flex
    justify-content start
    flex-flow column
    padding-top 14px
    .checkbox
      margin-bottom 15px
  .table-wrapper
    margin-top 30px
  .item-box
    height: 500px
    margin-bottom 10px
    background white
    border-radius 4px
    .content-poster
      display flex
      justify-content start
      box-sizing border-box
      padding 5px 20px
      .left-down
        display flex
        justify-content start
        .setting-box
          width 400px
          box-sizing border-box
          padding 20px 0
          .form-box
            display flex
            justify-content start
            font-size 15px
            line-height 36px
            .label
              font-weight bold
            .content
              color #666666
      .right-up
        display flex
        justify-content start
        .setting-box
          width 350px
          box-sizing border-box
          padding 20px 0
          padding-right 30px
          .form-box
            display flex
            justify-content start
            font-size 15px
            line-height 36px
            .red 
              color red
              font-size 12px
            .blue
              color #2fabdd
              font-size 12px
              cursor pointer
            .label
              font-weight bold
            .content
              color #666666
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
</style>
