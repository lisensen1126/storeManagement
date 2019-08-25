<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slide_visible", :is-slim="true", @input="toggleSidePannel")
      image-detail(v-if="true", :current-image-array="current_array")
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 拼团信息
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 服务名称
            .field-content(v-text="item.name")
          .field.is-horizontal
            label.label 服务图示
            open-image(v-if="item.pic",img-type="1",:img-url="item.pic",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="0", border-radius="5")
          .field.is-horizontal
            label.label 服务品牌
            .field-content(v-text="(item.brands && item.brands.brand_name)?item.brands.brand_name:'- -'")
          .field.is-horizontal
            label.label 服务分类
            .field-content(v-text="item.category_name")
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
            label.label 服务价格
            .field-content(v-text="item.sell_price + '元'")
          .field.is-horizontal
            label.label 拼团价格
            .sku-price
              .field-content(v-text="group_price + '元'")
          .field.is-horizontal
            label.label 服务详情
            .control(v-if="item.content.length === 0") - -
            .control.image-wrapper(v-else, @click="toggleSidePannel(item.content)")
              img.img-detail(v-for="(cell, index) in item.content",:src="item.content[index]")
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
                tr(v-for="cell in list")
                  td
                    .multi-content-td.has-image
                      .left-image.round
                        img(v-if="cell.avatar", :src="scaleImage(cell.avatar, 1, 36, 36)")
                        img(v-if="!cell.avatar", src="../../../assets/user-avatar.png")
                  td
                    span {{cell.nick_name}}
                    span(v-if="cell.type === 1") (团长)
                  td {{cell.mobile}}
                  td(v-text="formateDate(cell.created_at, true, 2)")
                  td {{item.name}}
                  td {{cell.number}}
                  td ￥{{cell.sku_price * cell.number}}
                  td
                    .operation-td
                      a.operation-link(@click="goOrder(cell)") {{cell.order_no}}
                  td
                    span(v-if="cell.pay_status === 1") 已付款
                    span(v-if="cell.pay_status === 2") 待付款
      .btn-wrapper
        .button-group
          a.button.large(@click="goBack") 返回
</template>

<script>
  import productServiceMixin from '@/mixins/modules/productService'
  import OpenImage from '@/components/generics/OpenImage'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import ImageDetail from '@/components/productService/ImageDetail'
  import GroupApi from '@/mixins/modules/Group'
  import FormateDate from '@/mixins/utilities/formateDate'
  import imageScale from '@/mixins/utilities/imageScale'
  import MathFun from '@/mixins/utilities/math'
  export default {
    name: 'groupServeEdit',
    mixins: [productServiceMixin, GroupApi, FormateDate, imageScale, MathFun],
    components: {
      OpenImage,
      ImageDetail,
      SlideOutModal,
    },
    data () {
      return {
        list: [],
        slide_visible: false, // 左边弹框
        history_product_id: '',
        current_array: [],
        num: null,
        time: null,
        status: '', // 拼团是否开启结束
        group_price: '', // 成团价
        item: {
          product_name: '', // 服务库名称
          name: '', // 名称
          category: null, // 分类
          mini_price: '', // 服务价格
          desc: '', // 服务简述
          pic: '', // 服务图示
          content: [],
        },
      }
    },
    methods: {
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
      // 去订单详情
      goOrder (item) {
        this.$router.push({
          name: 'orderDetail',
          params: {
            id: item.order_id,
          },
        })
      },
      // 获取服务详情
      async getData () {
        let self = this
        try {
          const {response, result} = await this.eventDetailApi({
            history_product_id: self.history_product_id,
            type: 2,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              result.data.mini_price = self.accDiv(result.data.mini_price, 100)
              result.data.sell_price = self.accDiv(result.data.sell_price, 100)
              this.item = result.data
              this.current_array = result.data.content
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
      // 获取拼团服务详情
      async getServe () {
        try {
          const {response, result} = await this.groupDetailApi({
            id: this.$route.query.group_product_id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.num = result.data.num
              this.time = result.data.time
              this.group_price = (result.data.product_sku[0].group_price / 100).toFixed(2)
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
      // 查看sku详情
      toggleSidePannel (imgs) {
        this.slide_visible = !this.slide_visible
        this.current_array = imgs
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
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取记录详情失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      this.history_product_id = this.$route.query.history_product_id
      this.status = this.$route.query.status - 0
      this.id = this.$route.query.id
      if (this.history_product_id) {
        this.getData() // 获取服务详情
        this.getServe() // 获取拼团服务详情
        this.getUserList() // 获取拼团记录详情
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
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
  .sku-price
    width 200px
  .field-content
    font-size: 13px
    line-height: 16px
    color: #353535
  .field-textarea
    width 300px
  .img-detail
    display inline-block
    width 60px
    height 60px
    border-radius 5px
    cursor pointer
    margin-right 10px
</style>

