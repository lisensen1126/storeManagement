<template lang="pug">
  .section-layout
    .content-wrapper
      h2.header-title 订单详情
      .order-box(v-if="info.store")
        .title 订单信息
        dl
          dt 订单编号
          dd(v-text="info.trade_order_no")
        dl
          dt 支付方式
          dd(v-text="info.payment_channel ? info.payment_channel : '—'")
        dl
          dt 下单时间
          dd(v-text="info.created_at")
        dl
          dt 交易流水号
          dd(v-text="info.payment_no ? info.payment_no : '—'")
        dl
          dt 支付时间
          dd(v-text="info.paid_at ? info.paid_at : '—'")
        dl
          dt 核销时间
          dd(v-text="info.write_off_at ? info.write_off_at : '—'")
        dl
          dt 订单状态
          dd(v-if="info.status == '1'") 待付款
          dd(v-if="info.status == '2' && (!info.reserve || info.reserve.status != '2')") 待核销
          dd(v-if="info.status == '3'") 已完成
          dd(v-if="info.status == '4'") 已关闭
          dd(v-if="info.status == '2' && info.reserve && info.reserve.status == '2' && info.reserve.reserve_status == '0'") 已预约
          dd(v-if="info.status == '2' && info.reserve && info.reserve.status == '2' && info.reserve.reserve_status == '1'") 已过期
          dd(v-if="info.status == '6'") 拼团中
          dd(v-if="info.status == '7'") 正在退款
          dd(v-if="info.status == '8' || info.status == '5'") 退款成功
          dd(v-if="info.status == '9'") 退款失败
        dl
          dt 实付金额
          dd(v-text="accDiv(info.final_amount,100) + '元'")
        dl(v-if="info.reserve && info.reserve.reserve_time")
          dt 预约到店时间
          dd {{info.reserve.reserve_time}}
        dl
          dt 订单类型
          dd
            span(v-if="info.goods_type === 0") 全部
            span(v-if="info.goods_type === 1 && info.order_type <= 4") 商品服务订单
            span(v-if="info.goods_type === 2 && info.order_type <= 4") 养护卡订单
            span(v-if="info.goods_type === 1 && info.order_type === 6") 线下买单订单
            span(v-if="(info.goods_type === 1 || info.goods_type === 2) && info.order_type === 7") 线下买单(快速开单)订单
        dl(v-if="info.order_type === 3")
          dt 团单编号
          dd {{info.object_id}}
        dl
          dt 订单来源
          dd {{order_source_list[info.purchase_type-1]}}
        dl
          dt 下单门店
          dd {{info.store.store_name}}
        dl(v-if="info.random_coupon")
          dt 门店立减金
          dd ￥{{info.random_coupon * 2}}
        dl(v-if="true")
          dt  营销活动
          dd  {{getMarketing(info.order_type)}}
      .order-box
        .title 客户信息
        dl
          dt 客户昵称
          dd(v-text="info.customer.name")
        dl
          dt 品牌车系
          dd(v-text="info.customer.vehicle.brand_info ? info.customer.vehicle.brand_info : '暂无数据'")
        dl
          dt 手机号
          dd(v-text="info.customer.mobile")
        dl
          dt 车牌号码
          dd(v-text="info.customer.vehicle.license_plate ? info.customer.vehicle.license_plate : '暂无数据'")
      .order-box(v-if="is_show")
        .title.table(style="text-align: left") 核销记录
        .write-off-box(v-for="(x, index) in info.write_off_record" :key="x.write_off_record_id")
          .write-off-item
            span 核销人: {{x.operator}}
            span 核销门店: {{x.write_off_store_name}}
            span 核销时间: {{x.write_off_at}}
          table.table
            thead
              tr
                td(width="150") 商品服务信息
                td(width="150") 核销数量
                td(width="150") 本次核销后剩余
            tbody
              tr(v-for="(y, index) in x.write_off_item" :key="index")
                td
                  .multi-content-td.has-image
                    .left-image
                      img(v-if="y.item.image_url", :src="scaleImage(y.item.image_url, 1, 40, 40)")
                    .simple-td.good-name {{y.item.item_title}} <br/> {{y.item.sku_name}}
                td
                  .simple-td.good-name(v-text="y.write_off_count")
                td
                  .simple-td(v-text="y.remain_count")
      .order-box
        .title.table(style="text-align: left") 商品/服务信息
        table.table
          thead
            tr
              td(width="120") 商品/服务
              td(width="90")
                span(v-if="info.order_type < 3 || info.order_type > 4") 单价
                span(v-if="info.order_type === 3 || info.order_type === 4 ")
                  span(v-if="info.item && info.item[0]", v-text="info.item[0].item_type")
                  span 原价
              td(width="80") 数量
              td(width="80")
                span(v-if="info.order_type < 3 || info.order_type > 4") 金额
                span(v-if="info.order_type === 3 || info.order_type === 4 ") 实付金额
              td(width="80") 类型
              td(width="60") 分类
          tbody
            tr(v-for="item in info.item")
              td
                .multi-content-td.has-image
                  .left-image
                    img(:src="scaleImage(item.image_url, 1, 36, 36)")
                  .content-item.content-first
                    span(v-if="item.item_title")  {{item.item_title}} <br> {{item.sku_name}}
                    span(v-if="info.order_type === 6 && !item.item_title")  线下商品/服务 <br> {{item.sku_name}}
              td
                .simple-td(v-if="info.order_type === 3 || info.order_type === 4 ")
                  span(v-text="'￥' + accDiv(item.unit_price,100)")
                .simple-td(v-if="info.order_type < 3 || info.order_type > 4")
                  span(v-text="'￥' + accDiv(item.activity_price,100)")
              td
                .simple-td  {{item.quantity}}
              td
                .simple-td(v-text="'￥' + accDiv(item.sub_activity_price,100)")
              td
                .simple-td
                  span(v-if="info.order_type === 6 && !item.item_type") 线下商品/服务
                  span(v-if="item.item_type || info.order_type !== 6") {{item.item_type?item.item_type:'- -'}}
              td
                .simple-td
                  span(v-if="info.order_type === 6 && !item.category") 线下商品/服务
                  span(v-if="item.category || info.order_type !== 6") {{item.category ? item.category : '- -'}}
      .order-box
        dl.cleft
        dl.cright
          dt.ctd
            div 商品总额：
            div(v-if="info.order_type==2&&info.maintenance_fee!=0") 工时费用：
            div 优惠券：
            div(v-if="info.random_coupon") 用户立减金：
            div 实付金额：
            div(v-if="cancelled_by > 4 && info.purchase_type - 1 === 1") 退款金额：
          dt.t-r
            div ￥{{accDiv(info.total_amount,100)}}
            div(v-if="info.order_type==2&&info.maintenance_fee!=0") ￥{{(accDiv(info.maintenance_fee,100)).toFixed(2)}}
            div -￥{{accDiv(info.preferential_price,100)}}
            div(v-if="info.random_coupon") -￥{{info.random_coupon}}
            div ￥{{accDiv(info.final_amount,100)}}
            div(v-if="cancelled_by > 4 && info.purchase_type - 1 === 1") ￥{{accDiv(info.final_amount,100)}}
      .btn-wrapper
        .button-group
          a.button.large(@click="goBack") 返回
          a.button.primary.large(v-if="info.status == 2 || info.status == 3",@click="statement(info)") 打印结算单

</template>

<script>
import Api from '@/mixins/modules/order'
import imageScale from '@/mixins/utilities/imageScale'
import { root } from '@/plugins/Fetch'
import MathFun from '@/mixins/utilities/math'

export default {
  name: 'OrderDetail',
  mixins: [Api, imageScale, MathFun],
  computed: {
    order_source_list () { // 订单来源列表：1 门店，2 平台， 3 第三方
      return ['门店', '平台', '第三方']
    },
  },
  data () {
    return {
      is_show: false, // 是否显示核销记录
      isInitiated: false,
      tradeOrderId: '',
      info: {
        trade_order_id: '',
        trade_order_no: '',
        'status': '',
        'created_at': '',
        'payment_channel': '',
        'payment_no': '',
        'write_off_at': '',
        'paid_at': '',
        object_id: '',
        'customer': {
          'name': '',
          'mobile': '',
          'avatar': '',
          'vehicle': {
            'license_plate': '',
            'brand_name': '',
            'series_name': '',
            'model_name': '',
            'vehicle_name': '',
            'product_year': '',
            'output_volume': '',
          },
        },
        items: [],
      },
      name: '', // 记录上次路由name
      query: {}, // 记录上次路由query
      cancelled_by: 0,
      root,
    }
  },
  methods: {
    // 获取订单详情
    async getInfo () {
      let self = this
      try {
        const { response, result } = await this.fetchOrderDetail(this.tradeOrderId)
        if (response.status === 200 && result.code === 0) {
          let temp = ''
          temp += result.data.customer.vehicle.brand_name ? result.data.customer.vehicle.brand_name + ' ' : ''
          temp += result.data.customer.vehicle.model_name ? result.data.customer.vehicle.model_name + ' ' : ''
          temp += result.data.customer.vehicle.series_name ? result.data.customer.vehicle.series_name + ' ' : ''
          temp += result.data.customer.vehicle.vehicle_name ? result.data.customer.vehicle.vehicle_name + ' ' : ''
          temp += result.data.customer.vehicle.product_year ? result.data.customer.vehicle.product_year + ' ' : ''
          temp += result.data.customer.vehicle.output_volume ? result.data.customer.vehicle.output_volume + ' ' : ''
          result.data.customer.vehicle.brand_info = temp
          result.data.item.forEach(item => {
            if (item.sub_price) {
              item.sub_price = self.accDiv(item.sub_price, 100).toFixed(2)
            }
            if (item.item_type === '商品') {
              if (item.sku_attribute.length > 0) {
                var obj = JSON.parse(item.sku_attribute)
                var str = ''
                obj.forEach(cell => {
                  str += (cell.attribute_item_value + ' ')
                })
                item.sku_name = str
              } else {
                item.sku_name = ''
              }
            } else {
              item.sku_name = ''
            }
          })
          result.data.write_off_record.forEach(x => {
            x.write_off_item.forEach(y => {
              if (y.item.item_type === 1) {
                if (y.item.sku_attribute.length > 0) {
                  var obj = JSON.parse(y.item.sku_attribute)
                  var str = ''
                  obj.forEach(cell => {
                    str += (cell.attribute_item_value + ' ')
                  })
                  y.item.sku_name = str
                } else {
                  y.item.sku_name = ''
                }
              } else {
                y.item.sku_name = ''
              }
            })
          })
          if (result.data.random_coupon) result.data.random_coupon = (result.data.random_coupon / 100).toFixed(2)
          this.info = result.data
          this.cancelled_by = result.data.cancelled_by
          if (this.info.write_off_record.length) {
            this.is_show = true
          } else {
            this.is_show = false
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取订单详情失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        console.error(err, '订单详情')
      }
      this.isInitiated = true
    },
    goBack () {
      this.$router.back(-1)
    },
    // 结算单下载
    statement (params) {
      let url = `${root}/order/pdf/${params.trade_order_no}`
      window.open(url)
    },
    /**
     * @description 获取营销名称
     * @params {Number} type 营销类型
     * @return {String} 营销名称的字段
     */
    getMarketing (type) {
      let name = ''
      switch (type) {
        case 2:
          name = '智能保养'
          break
        case 3:
          name = '拼团'
          break
        case 4:
          name = '秒杀'
          break
        default:
          name = '无'
          break
      }
      return name
    },
  },
  mounted () {
    this.tradeOrderId = this.$route.params.id
    this.cancelled_by = this.$route.query.cancelled_by
    if (this.tradeOrderId) {
      this.getInfo() // 获取订单详情
    }
  },
  /**
   * 组件内守卫(进入组件时调用)
   */
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (Object.keys(from.query).length > 0 && from.query.constructor === Object) {
        vm.query = from.query
      }
      vm.name = from.name
    })
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
@import '~@/stylus/modules/creation-modal'
.content-first
  line-height 16px
.header-title
  border-bottom 1px solid #eee
.order-box
  padding 20px 30px
  font-size 14px
  line-height 25px
  border-bottom 1px solid #eee
  .title
    width 15%
    text-align right
    font-weight bold
    padding-top 10px
    padding-bottom 5px
  dl
    float left
    padding-top 10px
    width 50%
    overflow hidden
    dt
      float left
      width 30%
      color #222
      text-align right
    dd
      float left
      width 70%
      color #747474
      box-sizing border-box
      padding-left 20px
  .cright
    padding-left 250px
    .ctd
      width: 35%
  .t-r
    text-align left
  .write-off-box
    margin-bottom 24px
    &:last-child
      margin-bottom 0
    .write-off-item span
      margin-right 24px
      font-size 13px
</style>
