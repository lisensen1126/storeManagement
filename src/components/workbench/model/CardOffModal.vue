<!--优惠券核销详情弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 优惠券信息
        .close-button(@click="modalClose")
      .modal-body
        .service-ticket-wrapper
          .serivce-main-info-wrapper
            .label 优惠券名称： {{cardInfo.coupon_name}}
          .serivce-main-info-wrapper
            .label 客户名称： {{cardInfo.nick_name	}}
        .service-ticket-wrapper
          .serivce-main-info-wrapper
            .label(v-if="cardInfo.coupon_use_type == 0") 使 用 范 围： ---
            .label(v-if="cardInfo.coupon_use_type == 1") 使 用 范 围： 小程序商城通用
            .label(v-if="cardInfo.coupon_use_type == 2") 使 用 范 围： 指定分类
            .label(v-if="cardInfo.coupon_use_type == 3") 使 用 范 围： 指定商品/服务
          .serivce-main-info-wrapper
            .label 手机号码： {{cardInfo.mobile}}
        .service-ticket-wrapper
          .serivce-main-info-wrapper
            .label(v-if="cardInfo.coupon_type == 1") 优惠券类型： 代金券
            .label(v-if="cardInfo.coupon_type == 2") 优惠券类型： 兑换券
            .label(v-if="cardInfo.coupon_type == 3") 优惠券类型： 满减券
            .label(v-if="cardInfo.coupon_type == 4") 优惠券类型： 折扣券
          .serivce-main-info-wrapper
            .label 车牌号： {{cardInfo.license_plates}}
        .service-ticket-wrapper
          .serivce-main-info-wrapper
            .label(v-if="cardInfo.coupon_type == 4") 优惠券金额： {{cardInfo.discount_amount/100}}折
            .label(v-else) 优惠券金额： ￥{{cardInfo.discount_amount/100}}
          .serivce-main-info-wrapper
            .label 车辆型号： {{cardInfo.car_names}}
        .service-ticket-wrapper(v-if="cardInfo.start_time == 0")
          .serivce-main-info-wrapper
            .label 有  效  期：不限期
        .service-ticket-wrapper(v-if="cardInfo.start_time != 0")
          .serivce-main-info-wrapper
            .label(v-if="cardInfo.end_time > 0") 有  效  期：{{formateDate(cardInfo.start_time,false,2)}} 至 {{formateDate(cardInfo.end_time,false,2)}}
            .label(v-if="cardInfo.end_time === 0") 有  效  期：无限制
        .service-ticket-wrapper
          .serivce-main-info-wrapper
            .label(v-if="cardInfo.condition_value === 0") 使用条件：不限制
            .label(v-else) 使用条件：满{{cardInfo.condition_value/100}}元可用
      .modal-footer
        button.button.large.primary(@click="finishService", :class="{'disabled': isLoading}") 确认核销
        span.cancel-button(@click="modalClose") 取消
</template>

<script>
import ModalDialog from '@/components/generics/ModalDialog'
import modalInteractions from '@/mixins/utilities/modalInteractions'
import workbenchMixin from '@/mixins/modules/workbench'
import imageScale from '@/mixins/utilities/imageScale'
import FormateDate from '@/mixins/utilities/formateDate'

export default {
  name: 'CardOffModal',
  mixins: [modalInteractions, workbenchMixin, imageScale, FormateDate],
  components: {
    ModalDialog,
  },
  props: {
    cardInfo: Object,
    checkCode: String,
  },
  data () {
    return {
      isLoading: false,
    }
  },
  methods: {
    // 核销操作
    async finishService () {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      try {
        const {response, result} = await this.writeOffCard({
          checkCode: this.cardInfo.coupon_code,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '核销成功',
              resolve: () => {
                this.modalClose()
                this.$emit('success')
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '核销失败',
              content: result.message,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '核销失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '核销失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isLoading = false
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins.styl'
.service-ticket-wrapper
  line-height 40px
  padding 0 10px
.serivce-main-info-wrapper
  width 290px
  margin-bottom 0
.serivce-main-info-wrapper::before
  border none
.serivce-main-info-wrapper .label
  font-size 14px
.tip-item
  position relative
  min-height 64px
  &::before
    content ''
    display inline-block
    vertical-align top
    margin-right 15px
    width 16px
    height 16px
    background center no-repeat url('~@/assets/icons/info-yellow.svg')
.orderList
  padding-top: 0px
  padding-bottom: 10px
  overflow-y: auto
  height: 215px
  .service-item-detail
    line-height: 40px
    height: 40px
  .content
    border-bottom: 1px solid #f0f0f0
    padding: 5px 0;
    .price-info
      line-height 40px
      border-left: none
  .content:last-child
    border-bottom: none
</style>
