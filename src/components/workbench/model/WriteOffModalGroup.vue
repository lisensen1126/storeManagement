<!--团购核销详情弹框，待重构-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 点评团购核销
        .close-button(@click="modalClose")
      .modal-body
        .service-ticket-wrapper
          .serivce-ticket-item
            .serivce-main-info-wrapper
              .label 核销门店
              .content
                custom-select(is-disabled=true,v-model="store_info", :list="store_list",nameField="store_name",)
          .serivce-ticket-item.tuangou
            .tuangou-item
              .label 团单名称
              .content(v-text='orderInfo.tuan_gou.name')
            .tuangou-item
              .label 团单编号
              .content(v-text='orderInfo.tuan_gou_order.deal_group_id')
            .tuangou-item
              .label 客户手机号
              .content(v-text='orderInfo.tuan_gou_order.mobile_no')
            .tuangou-item
              .label 订单号
              .content(v-text='orderInfo.order_id')
          .serivce-ticket-item
            .label.service 服务项目
            .content(v-if="orderInfo.tuan_gou.items && orderInfo.tuan_gou.items.length" v-for="(item,index) in orderInfo.tuan_gou.items")
              .service-item-detail
                .title(v-text="item.title")
              span.price-info(v-text="'￥' + item.sell_price/100")
          .serivce-ticket-item
            .total
              span 团购价
              span.price(v-text="'￥' + orderInfo.tuan_gou.sell_price/100")
            .total
              span 实付款
              span.price(v-text="'￥' + orderInfo.tuan_gou.sell_price/100")
      .modal-footer
        button.button.large.primary(@click="finishCoupon", :class="{'disabled': isLoading}") 确认核销
        span.cancel-button(@click="modalClose") 取消
</template>

<script>
import ModalDialog from '@/components/generics/ModalDialog'
import modalInteractions from '@/mixins/utilities/modalInteractions'
import workbenchMixin from '@/mixins/modules/workbench'
import imageScale from '@/mixins/utilities/imageScale'
import * as suitableTypes from '@/constants/terms/suitable-types'
import { mapGetters } from 'vuex'
import CustomSelect from '@/components/generics/form/CustomSelect'

export default {
  name: 'WriteOffModalGroup',
  mixins: [modalInteractions, workbenchMixin, imageScale],
  components: {
    ModalDialog,
    CustomSelect,
  },
  props: {
    orderInfo: Object,
  },
  data () {
    return {
      detail: {},
      suitableTypes,
      isLoading: false,
      isExpanded: false,
      store_list: [],
      store_info: {},
    }
  },
  methods: {
    async finishCoupon () {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      try {
        const {response, result} = await this.getGroupPurchaseCouponApi({
          order_id: this.orderInfo.order_id, // 订单号
          write_off_code: this.orderInfo.writeOffCode, // 核销码
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
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '核销失败',
            content: `出错啦！${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '核销失败',
          content: `出错啦！错误码：${err}`,
        })
      }
      this.isLoading = false
    },
  },
  computed: {
    ...mapGetters({
      currentStore: 'currentStore',
      list: 'stores',
    }),
  },
  mounted () {
    // console.log(this.orderInfo)
    let obj = [{
      store_name: this.orderInfo.store_name,
      store_id: this.orderInfo.store_id,
    }]
    this.store_list = [...obj]
    this.store_info = {
      store_name: this.orderInfo.store_name,
      store_id: this.orderInfo.store_id,
    }
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins.styl'

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
.service-item-detail
  padding-left: 0
  padding-bottom: 5px
.total
  text-align: right
  span.price
    display: inline-block
    text-align: left
    margin-left: 16px
    width: 88px
    padding-left: 16px
    border-left: 1px solid #f0f0f0
    color: #F4381E
.multi-content-td
  float right
  margin-top 6px
.serivce-ticket-item
  min-height 62px
.select
  position relative
  min-width 150px
  padding-right 16px
  font-size 14px
  line-height 24px
  color darker
  span
    position relative
    display block
    cursor pointer
.tuangou
  display flex
  flex-wrap wrap
  .tuangou-item
    width 50%
    margin-bottom 15px
    .label
      color #666
      margin-bottom 4px
</style>
