<template lang="pug">
  .section-layout
    //- 选择优惠券弹框
    choose-coupon(v-if="show_coupon", v-model="show_coupon", :array="coupon_list", :params="'1'" @resolve="getCouponList")
    .content-wrapper
      .section-setting
        h2.level.header-wrapper
          .level-left
            .icon.new-commer-icon-wrapper
              .new-commer-icon
            .header-title 注册有礼
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 功能状态
                  .switch
                    input(type="checkbox", id="h", v-model="register_gift.enabled")
                    label(for="h")
              .field-group
                .field.is-horizontal
                  label.label 优惠券配置
                  .button.small(@click="showCoupon(1)") 添加优惠券
                .field.is-horizontal(v-if="register_list.length > 0")
                  label.label 配置信息
                  .box
                    ul.clearfix.coupon
                      li.fl 优惠券名称
                      li.fl 优惠券金额(折扣)
                      li.fl.w-80 优惠券类型
                      li.fl 使用范围
                      li.fl 操作
                    ul.clearfix.coupon-list(v-for="(item, index) in register_list")
                      li.fl {{item.coupon_name}}
                      li.fl(v-if="item.coupon_type != 4") {{item.discount_amount/100}}元
                      li.fl(v-if="item.coupon_type == 4") {{item.discount_amount/100}}折
                      li.fl.w-80 {{item.coupon_type_name}}
                      li.fl {{item.coupon_use_type_name}}
                      li.fl
                        a.operation-link(@click="deleteCoupon(index, 1)") 删除
                .field.is-horizontal
                  label.label
                  .button.large.primary(@click="save(register_gift, 1)") 保存

      .section-setting
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .package-icon
            .header-title 评价有礼
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 功能状态
                  .switch
                    input(type="checkbox", id="h2", v-model="evaluate_gift.enabled")
                    label(for="h2")
              .field-group
                .field.is-horizontal
                  label.label 优惠券配置
                  .button.small(@click="showCoupon(2)") 添加优惠券
                .field.is-horizontal(v-if="evaluate_list.length > 0")
                  label.label 配置信息
                  .box
                    ul.clearfix.coupon
                      li.fl 优惠券名称
                      li.fl 优惠券金额(折扣)
                      li.fl.w-80 优惠券类型
                      li.fl 使用范围
                      li.fl 操作
                    ul.clearfix.coupon-list(v-for="(item, index) in evaluate_list")
                      li.fl {{item.coupon_name}}
                      li.fl(v-if="item.coupon_type != 4") {{item.discount_amount/100}}元
                      li.fl(v-if="item.coupon_type == 4") {{item.discount_amount/100}}折
                      li.fl.w-80 {{item.coupon_type_name}}
                      li.fl {{item.coupon_use_type_name}}
                      li.fl
                        a.operation-link(@click="deleteCoupon(index, 2)") 删除
                .field.is-horizontal
                  label.label
                  .button.large.primary(@click="save(evaluate_gift, 2)") 保存

      .section-setting
        h2.level.header-wrapper
          .level-left
            .icon.invite-icon-wrapper
              .user-info-icon
            .header-title 完善车辆信息有礼
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 功能状态
                  .switch
                    input(type="checkbox", id="h3", v-model="perfect_gift.enabled")
                    label(for="h3")
              .field-group
                .field.is-horizontal
                  label.label 优惠券配置
                  .button.small(@click="showCoupon(3)") 添加优惠券
                .field.is-horizontal(v-if="perfect_list.length > 0")
                  label.label 配置信息
                  .box
                    ul.clearfix.coupon
                      li.fl 优惠券名称
                      li.fl 优惠券金额(折扣)
                      li.fl.w-80 优惠券类型
                      li.fl 使用范围
                      li.fl 操作
                    ul.clearfix.coupon-list(v-for="(item, index) in perfect_list")
                      li.fl {{item.coupon_name}}
                      li.fl(v-if="item.coupon_type != 4") {{item.discount_amount/100}}元
                      li.fl(v-if="item.coupon_type == 4") {{item.discount_amount/100}}折
                      li.fl.w-80 {{item.coupon_type_name}}
                      li.fl {{item.coupon_use_type_name}}
                      li.fl
                        a.operation-link(@click="deleteCoupon(index, 3)") 删除
                .field.is-horizontal
                  label.label
                  .button.large.primary(@click="save(perfect_gift, 3)") 保存
      .section-setting
        h2.level.header-wrapper
          .level-left
            .icon.package-icon-wrapper
              .invite-icon
            .header-title 小程序首单有礼
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 功能状态
                  .switch
                    input(type="checkbox", id="h4", v-model="order_gift.enabled")
                    label(for="h4")
              .field-group
                .field.is-horizontal
                  label.label 优惠券配置
                  .button.small(@click="showCoupon(4)") 添加优惠券
                .field.is-horizontal(v-if="order_list.length > 0")
                  label.label 配置信息
                  .box
                    ul.clearfix.coupon
                      li.fl 优惠券名称
                      li.fl 优惠券金额(折扣)
                      li.fl.w-80 优惠券类型
                      li.fl 使用范围
                      li.fl 操作
                    ul.clearfix.coupon-list(v-for="(item, index) in order_list")
                      li.fl {{item.coupon_name}}
                      li.fl(v-if="item.coupon_type != 4") {{item.discount_amount/100}}元
                      li.fl(v-if="item.coupon_type == 4") {{item.discount_amount/100}}折
                      li.fl.w-80 {{item.coupon_type_name}}
                      li.fl {{item.coupon_use_type_name}}
                      li.fl
                        a.operation-link(@click="deleteCoupon(index, 4)") 删除
                .field.is-horizontal
                  label.label
                  .button.large.primary(@click="save(order_gift, 4)") 保存
      .section-setting
        h2.level.header-wrapper
          .level-left
            .icon.package-icon-wrapper1
              .package-icon1
            .header-title 线下支付首单有礼
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 功能状态
                  .switch
                    input(type="checkbox", id="h6", v-model="payoffline_gift.enabled")
                    label(for="h6")
              .field-group
                .field.is-horizontal
                  label.label 优惠券配置
                  .button.small(@click="showCoupon(6)") 添加优惠券
                .field.is-horizontal(v-if="payoffline_list.length > 0")
                  label.label 配置信息
                  .box
                    ul.clearfix.coupon
                      li.fl 优惠券名称
                      li.fl 优惠券金额(折扣)
                      li.fl.w-80 优惠券类型
                      li.fl 使用范围
                      li.fl 操作
                    ul.clearfix.coupon-list(v-for="(item, index) in payoffline_list")
                      li.fl {{item.coupon_name}}
                      li.fl(v-if="item.coupon_type != 4") {{item.discount_amount/100}}元
                      li.fl(v-if="item.coupon_type == 4") {{item.discount_amount/100}}折
                      li.fl.w-80 {{item.coupon_type_name}}
                      li.fl {{item.coupon_use_type_name}}
                      li.fl
                        a.operation-link(@click="deleteCoupon(index, 6)") 删除
                .field.is-horizontal
                  label.label
                  .button.large.primary(@click="save(payoffline_gift, 6)") 保存
</template>

<script>
import imageScale from '@/mixins/utilities/imageScale'
import marketingMixin from '@/mixins/modules/marketing'
import ChooseCoupon from '@/components/marketing/modal/ChooseCoupon'

export default {
  name: 'WashingMarketing',
  mixins: [imageScale, marketingMixin],
  components: {
    ChooseCoupon,
  },
  data () {
    return {
      coupon_list: [],                       // 选择的优惠券列表
      show_coupon: false,                    // 控制选择优惠券弹框变量
      gift_type: null,                       // 有礼的类型
      register_list: [],
      evaluate_list: [],
      perfect_list: [],
      order_list: [],
      payoffline_list: [],
      // 注册有礼
      register_gift: {
        status: '',
        enabled: false,
      },
      // 评价有礼
      evaluate_gift: {
        status: '',
        enabled: false,
        coupon_ids: [],
      },
      // 完善车辆信息有礼
      perfect_gift: {
        status: '',
        enabled: false,
        coupon_ids: [],
      },
      // 小程序首单有礼
      order_gift: {
        status: '',
        enabled: false,
        coupon_ids: [],
      },
      // 线下支付有礼
      payoffline_gift: {
        status: '',
        enabled: false,
        coupon_ids: [],
      },
      send_data: {},                         // 需要保存的数据
    }
  },
  watch: {
    register_list (val) {
      let temparr = []
      val.forEach(v => {
        temparr.push(v.coupon_id)
      })
      this.register_gift.coupon_ids = [...temparr]
    },
    evaluate_list (val) {
      let temparr = []
      val.forEach(v => {
        temparr.push(v.coupon_id)
      })
      this.evaluate_gift.coupon_ids = [...temparr]
    },
    perfect_list (val) {
      let temparr = []
      val.forEach(v => {
        temparr.push(v.coupon_id)
      })
      this.perfect_gift.coupon_ids = [...temparr]
    },
    order_list (val) {
      let temparr = []
      val.forEach(v => {
        temparr.push(v.coupon_id)
      })
      this.order_gift.coupon_ids = [...temparr]
    },
    payoffline_list (val) {
      let temparr = []
      val.forEach(v => {
        temparr.push(v.coupon_id)
      })
      this.payoffline_gift.coupon_ids = [...temparr]
    },
  },
  methods: {
    /**
     * 控制优惠券显隐弹框
     * @param type {Number} 有礼类型
     */
    showCoupon (type) {
      this.show_coupon = !this.show_coupon
      this.gift_type = type
      switch (this.gift_type) {
        case 1: this.coupon_list = [...this.register_list]
          break
        case 2: this.coupon_list = [...this.evaluate_list]
          break
        case 3: this.coupon_list = [...this.perfect_list]
          break
        case 4: this.coupon_list = [...this.order_list]
          break
        default: this.coupon_list = [...this.payoffline_list]
      }
    },

    /**
     * 选中优惠券的回调
     * @param list {Array} 优惠券列表
     */
    getCouponList (list) {
      switch (this.gift_type) {
        case 1: this.register_list = [...list]
          break
        case 2: this.evaluate_list = [...list]
          break
        case 3: this.perfect_list = [...list]
          break
        case 4: this.order_list = [...list]
          break
        default: this.payoffline_list = [...list]
      }
    },

    /**
     * 删除已选优惠券
     * @param index {Number} 要删除已选优惠券下标
     * @param type {Number} 礼券类型
     */
    deleteCoupon (index, type) {
      switch (type) {
        case 1: this.register_list.splice(index, 1)
          break
        case 2: this.evaluate_list.splice(index, 1)
          break
        case 3: this.perfect_list.splice(index, 1)
          break
        case 4: this.order_list.splice(index, 1)
          break
        default: this.payoffline_list.splice(index, 1)
      }
    },

    /**
     * 保存设置前的数据校验
     * @param type {Object} 礼券类型
     */
    save (item, type) {
      this.send_data.coupon_ids = item.coupon_ids
      item.enabled ? this.send_data.status = 1 : this.send_data.status = 2
      this.send_data.type = type
      if (this.send_data.coupon_ids.length === 0 && this.send_data.status === 1) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请选择优惠券',
        })
        return false
      }
      if (this.send_data.coupon_ids.length > 5) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '友情提示',
          content: '最多只能选择五张优惠券！',
        })
        return false
      }
      this.setMarketings()
    },

    // 保存接口
    async setMarketings () {
      try {
        const {response, result} = await this.setMarketing(this.send_data)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'success',
            title: '成功',
            content: '保存设置成功',
            resolve: () => {
              this.fetchList()
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取优惠券信息失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },

    /**
     * 获取营销配置列表
     */
    async fetchList () {
      let self = this
      try {
        const {response, result} = await this.marketingAllocation()
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(function (v) {
            v.status === 1 ? v.enabled = true : v.enabled = false
            switch (v.type - 0) {
              case 1:
                self.register_gift = v
                self.register_list = [...v.coupon]
                break
              case 2:
                self.evaluate_gift = v
                self.evaluate_list = [...v.coupon]
                break
              case 3:
                self.perfect_gift = v
                self.perfect_list = [...v.coupon]
                break
              case 4:
                self.order_gift = v
                self.order_list = [...v.coupon]
                break
              default:
                self.payoffline_gift = v
                self.payoffline_list = [...v.coupon]
            }
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取营销配置信息失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取营销配置信息失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    this.fetchList()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'

.section-layout
  overflow-y auto

.section-setting
  + .section-setting
    margin-top 16px
  background #ffffff
  padding-bottom 24px

.header-wrapper
  height 56px
  align-items center
  border-bottom 1px solid line

.header-title
  font-size 18px
  line-height 24px
  color darker
  position relative

.level-left
  align-items center

.switch-title
  margin-left 8px
  font-size 13px
  line-height 18px
  word-break keep-all

.icon
  width 32px
  height 32px
  display flex
  justify-content center
  align-items center
  margin 0 12px
  box-shadow 0 2px 4px 0 rgba(0,0,0,0.05)
  border-radius 3px
  &.user-info-icon-wrapper
    background-image linear-gradient(39deg, #38b3e8 1%, #6ec5ff 100%)
  .user-info-icon
    width 16px
    height 16px
    background url('~@/assets/washing/icons/user-info.svg') no-repeat center center
    background-size cover
  &.invite-icon-wrapper
    background-image linear-gradient(44deg, #fe6782 0%, #ff728c 100%)
  .invite-icon
    width 16px
    height 16px
    background url('~@/assets/washing/icons/invite.svg') no-repeat center center
    background-size cover
  &.new-commer-icon-wrapper
    background-image  linear-gradient(-135deg, #FF8639 0%, #FF9C62 100%)
  .new-commer-icon
    width 16px
    height 16px
    background url('~@/assets/washing/icons/gift.svg') no-repeat center center
    background-size cover
  &.gift-icon-wrapper
    background-image linear-gradient(44deg, #fe6666 0%, #ff5959 100%)
  .gift-icon
    width 16px
    height 16px
    background url('~@/assets/washing/icons/open-redpack.svg') no-repeat center center
    background-size cover
  &.package-icon-wrapper
    background-image linear-gradient(44deg, #41d0c5 0%, #6fe3d0 100%)
  .package-icon
    width 16px
    height 16px
    background url('~@/assets/washing/icons/package.svg') no-repeat center center
    background-size cover
  &.package-icon-wrapper1
    background-image linear-gradient(44deg, #ffbb29 0%, #ffc723 100%)
  .package-icon1
    width 16px
    height 16px
    background url('~@/assets/washing/icons/package1.svg') no-repeat center center
    background-size cover

.form-wrapper
  padding 0
  padding-left 24px
  padding-top 32px
  width 280px
  &.disabled
    opacity .5

.field-group
  + .field-group
    margin-top 24px
    width 900px

.custom-input
  width 150px

.has-tips
  position relative
  &::after
    content '自领取日起计算有效期'
    display block
    font-size: 12px
    color: lightGrey
    position absolute
    right -8px
    top 50%
    transform translateX(100%) translateY(-50%)

.service-title
  line-height 16px
  font-size 13px
  color darker
  font-weight bold
  margin-bottom 8px

.service-content
  font-size 12px
  color lightGrey
  line-height 20px
  + .service-content
    margin-top 8px

.service-description
  width 305px
  margin-top 42px
  padding-left 16px
  border-left 1px solid line
  flex-shrink 0

.level-content
  align-items flex-start

.showcase
  width 180px
  height 320px
  margin -32px 31px 0 44px
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .05), 0 6px 18px 0 rgba(0, 0, 0, .10)
  border-radius 3px
  &.complete-information-image
    background url('~@/assets/washing/complete-info.png') no-repeat center center
    background-size cover
  &.invite-share-image
    background url('~@/assets/washing/invite-gift.png') no-repeat center center
    background-size cover
  &.washing-share-image
    background url('~@/assets/washing/share-gift.png') no-repeat center center
    background-size cover
  &.order-recommend-image
    background url('~@/assets/washing/recommenad.png') no-repeat center center
    background-size cover
  &.new-commer-image
    background url('~@/assets/washing/newbie-gift.png') no-repeat center center
    background-size cover

.wide-form-wrapper
  width 320px
  .custom-input
    flex-grow 0
    width 95px
  .field.is-horizontal.has-tips::after
    right 50px
.field.is-horizontal .label
  flex 0 0 106px
.width
  width 80px
.p-l-4
  padding-left 4px
.p-r-4
  padding-right 4px
.m-l-20
  margin-left 20px
.setting-type-wrapper
  height 74px
.condition-setting
  display inline-flex
  align-items center
.type-item
  display inline-flex
  min-width 88px
/*.type-item*/
  /*display flex*/
  /*align-items center*/
  /*height 32px*/
  /*&:last-child*/
    /*margin-top 10px*/
.radio label
  padding-left 32px
.sepcific-setting
  display flex
  align-items center
  .number-input
    margin 0 8px
    width 64px
  .price-input
    margin 0 8px
    width 95px

.gift-package-wrapper
  width 272px
.coupon-item
  display flex
  align-items center
  margin-bottom 8px
  cursor pointer
  &:hover
    .delete-icon
      display block
    .coupon-detail
      box-shadow 0 2px 8px -2px rgba(0,0,0,0.08)
.coupon-detail
  display flex
  justify-content space-between
  align-items center
  padding 12px
  width 240px
  height 40px
  border 1px solid #e5e5e5
  border-radius 2px
  font-size 13px
  line-hight 16px
  color #353535
.delete-icon
  display none
  margin 0 8px
  width 16px
  height 16px
  background center no-repeat url('~@/assets/icons/trash.svg')
.select-button
  margin-top 16px
  display flex
  align-items center
  font-size 13px
  line-height 16px
  color #353535
  cursor pointer
  .add-icon
    width 24px
    height 24px
    background #ffbb29 center no-repeat url('~@/assets/plus-l.svg')
    border-radius 24px
    margin-right 8px
.f-14
  font-size 13px
  line-height 15px
.field.is-horizontal .m
  margin -8px 8px
.small
  height 28px
  line-height 28px
  font-size 12px
  padding 0 10px
.coupon
  background-color #f0f1f2
  padding-left 8px
  .w-80
    width 60px
  li
    width 120px
    margin-right 20px
    line-height 36px
    float left
    font-size 12px
  li:last-child
    margin-right 0
    width 46px
    text-align center
.coupon-list
  padding-left 8px
  border-bottom 1px solid #eee
  cursor pointer
  border-left 2px solid transparent
  .w-80
    width 60px
  li
    width 120px
    margin-right 20px
    line-height 34px
    white-space nowrap
    text-overflow ellipsis
    height 34px
    overflow hidden
    color #666
    float left
    font-size 12px
  li:last-child
    margin-right 0
    width 46px
    text-align center
.coupon-list:hover
  border-left 2px solid #ffc723
  box-shadow 0 2px 8px 0 rgba(0,0,0,.08)
</style>
