<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title 优惠券详情
        .field-group.is-horizontal
          .field.bord 基本信息
        .field-group
          .field.child-box
            span.left 优惠券名称
            span.right {{coupon.coupon_name}}
        .field-group
          .field.child-box
            span.left 优惠{{coupon.coupon_type === 4 ? '折扣' : '金额'}}
            span.right {{coupon.coupon_type === 4 ? `${coupon.discount_amount / 100} 折` : `${coupon.discount_amount / 100} 元`}}
        .field-group
          .field.child-box
            span.left 类型
            span.right(v-if="coupon.coupon_type === 1") 代金券
            span.right(v-if="coupon.coupon_type === 2") 兑换券
            span.right(v-if="coupon.coupon_type === 3") 满减券
            span.right(v-if="coupon.coupon_type === 4") 折扣券
        .field-group
          .field.child-box
            span.left 使用范围
            span.right {{use_type_list[coupon.coupon_use_type]}}
        .field-group
          .field.child-box
            span.left 使用条件
            span.right(v-if="coupon.coupon_type === 4") 满{{coupon.condition_value/100}}元可用
            span.right(v-if="coupon.coupon_type === 1 || coupon.coupon_type === 3")
              span.use-scope(v-if="coupon.condition_value === 0") 不限制
              span.use-scope(v-else) 满{{coupon.condition_value/100}}减{{coupon.discount_amount/100}}
            span.right(v-if="coupon.coupon_type === 2") 不限制
        .field-group
          .field.child-box
            span.left 有效时间
            span.right
              span(v-if="coupon.end_time==0") 无有效期限制
              span(v-else) {{formateDate(coupon.start_time)}} ~ {{formateDate(coupon.end_time)}}
        .field-group
          .field.child-box
            span.left 状态
            span.right(v-if="coupon.status - 0 === 1") 待使用
            span.right(v-if="coupon.status - 0 === 2") 已使用
            span.right(v-if="coupon.status - 0 === 3") 已过期
        .field-group
          .field.child-box
            span.left 获取方式
            span.right {{way_list[coupon.obtain_type]}}
        .field-group.is-horizontal(v-if="coupon.status - 0 === 2")
          .field.bord 使用信息
        .field-group(v-if="coupon.status - 0 === 2")
          .field.child-box
            span.left 使用时间
            span.right(v-text="formateDate(coupon.created_at, true)")
        .field-group(v-if="coupon.status - 0 === 2")
          .field.child-box
            span.left 使用渠道
            span.right(v-if="coupon.write_off_type - 0 === 1") 订单核销
            span.right(v-if="coupon.write_off_type - 0 === 2") 线下核销
        .field-group(v-if="coupon.write_off_type === 1")
          .field.child-box
            span.left 订单编号
            span.right {{coupon.order_no}}
        .field-group(v-if="coupon.write_off_type === 1")
          .field.child-box
            span.left 订单金额
            span.right ￥{{coupon.total_amount / 100}}
        .field-group(v-if="coupon.write_off_type === 1")
          .field.child-box
            span.left 实收款
            span.right ￥{{coupon.final_amount / 100}}
</template>

<script>
  import FormateDate from '@/mixins/utilities/formateDate'
  import MarketingMixin from '@/mixins/modules/marketing'
  export default {
    name: 'CouponUsedDetail',
    mixins: [FormateDate, MarketingMixin],
    components: {
    },
    props: {
      id: {
        type: [String, Number],
      },
    },
    data () {
      return {
        coupon: {
          coupon_name: '1233', // 优惠券名字
          coupon_type: 1, // 类型
          condition_value: '', // 使用条件
          discount_amount: 1000, // 优惠金额
          use_range: '', // 使用范围
          start_time: '', // 有效开始时间
          end_time: '', // 结束时间
          order_no: 111111, // 订单编号
          write_off_type: 1, // 核销方式
          created_at: '', // 使用时间
          total_amount: 1111, // 优惠前金额
          final_amount: 2222, // 优惠后金额
          status: 1, // 使用状态
        },
        way_list: ['', '定向推送', '活动中奖', '营销配置', '领券中心', '商品详情页'],
        use_type_list: ['- -', '小程序商城通用', '指定分类', '指定商品/服务'],
      }
    },
    methods: {
      // 优惠券详情
      async getDetail () {
        try {
          const {response, result} = await this.getCouponDetail({
            cc_id: this.id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              console.log(result.data)
              this.coupon = result.data
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取优惠券详情失败',
                content: `错误：${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取优惠券详情失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取优惠券详情失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      console.log(this.id)
      this.getDetail()
    },
  }
</script>

<style lang="stylus" scoped>
  .slide-layout .cus-box .field-group .field
    width 100% !important
  .bord
    font-size 16px
    border-bottom 1px solid #e8e9eb
  .child-box
    font-size 14px
    // margin-top 0
    .left
      display inline-block
      width 100px
</style>
