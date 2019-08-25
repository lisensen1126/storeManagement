<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slide_visible", :is-slim="true", @input="toggleSidePannel")
      image-detail(v-if="true", :current-image-array="current_array")
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 查看拼团商品
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 商品名称
            .field-content(v-text="info.name")
          .field.is-horizontal
            label.label 商品品牌
            .field-content(v-text="info.brand_name")
          .field.is-horizontal
            label.label 商品图片
            .control.cus_imgs(v-if="info.product_pics.length>0")
              open-image(img-type="2",:img-url="info.product_pics",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="5", border-radius="5")
          .field.toggle-group.is-horizontal.custom-select
            label.label 商品分类
            .field-content(v-text="info.category_name")
          .field.is-horizontal.custom-select
            label.label 成团人数
            .field-content(v-text="num + '人'")
          .field.is-horizontal.custom-select
            label.label 团状态
            .field-content(v-if="status === 1") 进行中
            .field-content(v-if="status === 2") 已成团
            .field-content(v-if="status === 3") 已失败
          .field.is-horizontal.custom-select
            label.label 成团有效期
            .field-content(v-text="time + '小时'")
          .field.is-horizontal
        .field-group(v-if="sku_data.length>0")
          .field.is-horizontal.width-100
            label.label SKU设置
            .control
              .sku-title.clearfix
                .title.fl SKU名称
                .title.fl SKU图
                .title.fl.p-l-40 详情图
                .title.fl.p-l-40 SKU原价
                .title.fl.p-l-40 成团价格
                .title.fl.width-80.m-l-60 禁用/启用
              <!--禁用的sku隐藏掉 -->
              .sku-box(v-for="(sku, index) in sku_data")
                .sku-txt(v-text="sku.value")
                .sku-img.width-150.m-r-0
                  upload-pic(v-if='info.source_type === 2',v-model="sku.sku_pics[0]", :img-id="index", :default-img="default_img_src", img-type="sku")
                  .upload-pic-default(v-if='info.source_type === 1')
                    img(:src='sku.sku_pics[0]')
                .sku-txt.p-l-40
                  .fl.m-r-20(:class="{'a-text': sku.content && sku.content.length > 0}",@click="toggleSidePannel(sku.content)",v-text="sku.content && sku.content.length > 0 ? '查看':'暂无内容'")
                .sku-txt.p-l-40(v-text="'￥'+sku.sell_price")
                .sku-txt.p-l-40 ￥{{sku.group_price}}
                .sku-txt.width-200.p-l-60
                  .simple-td
                    .switch
                      input(type="checkbox", :id="'display' + index", v-model="sku.is_selected", disabled)
                      label(:for="'display' + index")
        .field-group(v-if="list.length > 0")
          .field.is-horizontal
            label.label 拼团信息
          .table-wrapper(style={'margin-bottom':'13px'},)
            table.table.table_detail
              thead
                tr
                  td(width="60") 头像
                  td(width="120") 微信昵称
                  td(width="100") 手机号
                  td(width="140") 参团时间
                  td(width="140") 名称
                  td(width="60") 数量
                  td(width="60") 总价
                  td(width="100") 订单号
                  td(width="80") 状态
              tbody
                tr(v-for="(item) in list")
                  td
                    .multi-content-td.has-image
                      .left-image.round
                        img(v-if="item.avatar", :src="scaleImage(item.avatar, 1, 36, 36)")
                        img(v-if="!item.avatar", src="../../../assets/user-avatar.png")
                  td
                    span {{item.nick_name}}
                    span(v-if="item.type === 1") (团长)
                  td {{item.mobile}}
                  td(v-text="formateDate(item.created_at, true, 2)")
                  td {{item.sku_name}}
                  td {{item.number}}
                  td ￥{{item.sku_price * item.number}}
                  td
                    .operation-td
                      a.operation-link(@click="goOrder(item)") {{item.order_no}}
                  td
                    span(v-if="item.pay_status === 1") 已付款
                    span(v-if="item.pay_status === 2") 待付款
      .btn-wrapper
        .button-group
          a.button.large( @click="goBack") 返回
</template>

<script>
  import ImageDetail from '@/components/productService/ImageDetail'
  import productServiceMixin from '@/mixins/modules/productService'
  import OpenImage from '@/components/generics/OpenImage'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import GroupApi from '@/mixins/modules/Group'
  import FormateDate from '@/mixins/utilities/formateDate'
  import imageScale from '@/mixins/utilities/imageScale'
  import MathFun from '@/mixins/utilities/math'
  export default {
    name: 'GroupGoodAdd',
    mixins: [productServiceMixin, FormateDate, GroupApi, imageScale, MathFun],
    components: {
      OpenImage,
      ImageDetail,
      SlideOutModal,
    },
    data () {
      return {
        num: '',
        time: '',
        info: {
          name: '',
          history_product_id: '',
          product_name: '',
          brand_name: '',
          category_id: '',
          product_pics: [], // 主图
          sku_data: [],
        },
        sku_data: [],
        default_img_src: '',
        current_array: [],
        slide_visible: false,
        status: '',
        list: [],
      }
    },
    methods: {
      // 去订单详情
      goOrder (item) {
        this.$router.push({
          name: 'orderDetail',
          params: {
            id: item.order_id,
          },
        })
      },
      // 获取商品详情
      async getData () {
        let self = this
        try {
          const {response, result} = await this.eventDetailApi({
            history_product_id: self.history_product_id,
            type: 1,
          })
          if (response.status === 200) {
            if (result.code && result.code !== 0) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '商品详情获取失败',
                content: `${result.message}`,
              })
              return false
            }
            var filterData = []
            result.data.sku_data.forEach(function (v) {
              if (v.is_enabled === 1) {
                v.is_selected = true
                v.group_price = ''
                v.sell_price = self.accDiv(v.sell_price, 100)
                filterData.push(v)
              }
            })
            result.data.sku_data = filterData
            result.data.product_pics = [result.data.pic]
            this.info = result.data
            this.getGood(this.info.sku_data)
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '商品详情获取失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '商品详情获取失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 返回
      goBack () {
        this.$router.push({
          name: 'recordList',
          query: {
            name: '拼团记录',
            type: 'recordList',
            urlName: 'recordList',
          },
        })
      },
      // 查看sku详情
      toggleSidePannel (imgs) {
        if (imgs.length === 0) return
        this.slide_visible = !this.slide_visible
        this.current_array = imgs
      },
      /*
      * 获取拼团服务详情
      * data sku数据
      * */
      async getGood (data) {
        try {
          const {response, result} = await this.groupDetailApi({
            id: this.$route.query.group_product_id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.num = result.data.num
              this.time = result.data.time
              this.status = result.data.status
              let arr = []
              data.forEach(item => {
                arr.push(item.basic_sku_id)
              })
              result.data.product_sku.forEach(item => {
                if (arr.indexOf(item.basic_sku_id) !== -1) {
                  data[arr.indexOf(item.basic_sku_id)].group_price = (item.group_price / 100).toFixed(2)
                  data[arr.indexOf(item.basic_sku_id)].enable = item.enable
                  if (item.enable === 2) {
                    data[arr.indexOf(item.basic_sku_id)].is_selected = false
                  }
                }
              })
              this.sku_data = data
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '服务详情获取失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '服务详情获取失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '服务详情获取失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 交易记录详情
      async getUserList () {
        try {
          const {response, result} = await this.groupRecordDetailApi({
            id: this.id,
          })
          if (response.status === 200 && result.code === 0) {
            result.data.forEach(item => {
              item.sku_price = (item.sku_price / 100).toFixed(2)
            })
            this.list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取记录详情失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '拼团记录')
        }
      },
    },
    mounted () {
      this.history_product_id = this.$route.query.history_product_id
      this.id = this.$route.query.id
      if (this.history_product_id) {
        this.getData()
        this.getUserList()
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal';
  .nav-back-btn
    position absolute
    top 36px
    left 16px
    width 32px
    height 32px
    border-radius 100%
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
    cursor pointer
    z-index 2
  .field-content {
    font-size: 13px;
    line-height: 16px;
    color: #353535;
  }
  .service-status {
    padding-left: 7px;
    font-size: 13px;
    color: darker;
    margin-right: 20px;
  }

  .radio + .radio {
    margin-left: 28px;
  }
  .cus_imgs {
    display: flex;
    .img {
      width: 60px;
      height: 60px;
      margin-right: 5px;
    }
  }

  .sku-box {
    display: flex;
    align-items: center;
    margin-top: 20px;

    .sku-txt {
      width: 150px;
      font-size: 12px;
      color: #888;
      padding-right: 20px;
    }

    .sku-img {
      width: 60px;
      height: 60px;
      margin-right: 20px;
    }

    .sku-price {
      width: 160px;
    }
  }

  .sku-img>.upload-pic {
    width: 60px !important;
    height: 60px !important;
  }

  .upload-pic-default{
    width: 60px !important;
    height: 60px !important;
    img{
      width: 100%;
      height: 100%;
    }
  }

  .picture-description {
    font-size: 12px;
    line-height: 16px;
    color: lightGrey;
    white-space: nowrap;
    margin-top: 8px;
  }

  .rich-eidtor-description {
    margin-bottom: 8px;
  }
  .contentcc
    width 100%
    .cc
      float left
      margin-bottom 10px
      margin-left 10px
      width auto
  .gray
    color #666 !important
  /*new*/
  .m-l-0
    margin-left 0 !important
  .m-r-0
    margin-right 0 !important
  .m-r-20
    margin-right 20px
  .p-l-60
    padding-left 60px
  .m-l-60
    margin-left 60px
  .p-l-40
    padding-left 40px
  .fl
    float left
  .clearfix:after
    display block
    content ''
    clear both
    height 0
  .sku-title
    padding-top 8px
    width 900px
    .title
      float left
      width 150px
      font-size 12px
      line-height 16px
      color #666
  .width-100
    width 100% !important
  .width-200
    width 200px !important
  .width-150
    width 150px !important
  .width-160
    width 160px !important
  .width-80
    width 80px !important
  .a-text
    color #3a8ee6 !important
    cursor pointer
</style>
