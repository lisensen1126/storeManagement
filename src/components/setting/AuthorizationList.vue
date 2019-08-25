<template lang="pug">
  .authorization-wrapper
    .content-container
      .page-title 完成微信授权，开通更多服务
      .authorization-section-info - 完成微信服务号授权，开通服务号相关服务 -
      .authorization-list
        .authorization-item
          .type-info
            .icon.icon-mp
            .heading
              | 微信服务号授权
              span.tip *
            .content 完成微信服务号授权，开通微信商城和服务预约
          .state-info
            template(v-if="!service.installed")
              .status-dot.grey
              span.state 未授权
              a.button.primary.large(v-if="isLoaded", :href="service.auth_url") 前往授权
            template(v-if="service.installed")
              .status-dot.green
              span.state 已授权
              router-link.button.large(:to="{name: 'authorizationService'}") 查看详情
        a.handle-text(href="https://shimo.im/docs/FcYFJsV58tE21DSR/", target="_bank") 微信服务号及小程序认证流程
      .authorization-section-info(v-if="false") - 完成企业微信授权，开通相关应用 -
      .authorization-list(v-if="false")
        .authorization-item
          .type-info
            .icon.icon-mechanic
            .heading 客户管理
            .content 完成企业微信授权，开通客户管理服务
          .state-info
            //- installed  1 未授权   2未关联  3成功
            template(v-if="mechanic.installed == 1")
              .status-dot.grey
              span.state 未授权
              a.button.primary.large(v-if="isLoaded", :href="mechanic.auth_url") 前往授权
            template(v-if="mechanic.installed == 2")
              .status-dot.grey
              span.state 未关联
              router-link.button.primary.large(:to="{name: 'authorizationSecret'}") 立即关联
            template(v-if="mechanic.installed == 3")
              .status-dot.green
              span.state 已授权
              router-link.button.large(:to="{name: 'authorizationMechanic'}") 查看详情
      .authorization-section-info - 完成微信小程序授权，开通相关应用 -
      .authorization-list
        div
          .authorization-item.without-border
            .type-info
              .icon.icon-inspection
              .heading 壳保养智慧门店小程序
              .content 完成微信小程序授权，开通壳保养智慧门店小程序
            .state-info
              template(v-if="shop.is_audit === 2")
                .status-dot.grey
                span.state 未自动提审
              template(v-if="!shop.installed")
                .status-dot.grey
                span.state 未授权
                a.button.primary.large(v-if="isLoaded", :href="shop.auth_url") 前往授权
              template(v-if="shop.installed")
                .status-dot.green
                span.state 已授权
                router-link.button.large(:to="{name: 'authorizationShop'}") 查看详情
          a.handle-text(href="https://shimo.im/docs/FcYFJsV58tE21DSR/", target="_bank") 微信服务号及小程序认证流程
      .authorization-section-info - 完成企业微信授权，开通相关应用 -
      .authorization-list
        .authorization-item
          .type-info
            .icon.icon-enterprice
            .heading 企业微信
            .content 完成企业微信授权，开通客户管理服务
          .state-info
            .status-dot.status-dot-circle.grey
            span.state 未授权({{enterprice.unauthorized||0}})
            .status-dot.status-dot-circle.green
            span.state 已授权({{enterprice.have_authorized||0}})

            template(v-if="enterprice.authorization_status===2")
              router-link.button.primary.large(v-if="isEnterpriceLoaded", :to="{name: 'authorizationEnterprice'}") 前往授权
            template(v-if="enterprice.authorization_status===1")
              router-link.button.large(v-if="isEnterpriceLoaded", :to="{name: 'authorizationEnterprice'}") 查看详情
        a.handle-text(href="https://shimo.im/docs/2Fpj6NUaktQMaqgf/", target="_bank") 企业微信认证流程
</template>

<script>
import userMixin from '@/mixins/modules/user'
import { mapGetters } from 'vuex'

export default {
  name: 'AuthorizationList',
  mixins: [userMixin],
  data () {
    return {
      modalVisible: false,
      showInputSecret: false,
      isLoaded: false,
      service: {},
      corp: {},
      mechanic: {},
      enterprice: {},
      maintenance: {},
      inspection: {},
      washing: {},
      shop: {},
      isEnterpriceLoaded: false,
    }
  },
  computed: {
    ...mapGetters({
      currentEnterprise: 'currentEnterprise',
    }),
  },
  methods: {
    async getAuthorizations () {
      console.log(location.href)
      try {
        const {response, result} = await this.fetchAuthorizations({
          mp_back_url: `${location.href}/service`,
          // ai_maintenance_back_url: `${location.href}/maintenance`,
          // car_inspection_back_url: `${location.href}/inspection`,
          // washing_back_url: `${location.href}/washing`,
          shop_back_url: `${location.href}/shop`,
        })
        if (response.status === 200 && result.code === 0) {
          this.isLoaded = true
          this.service = result.data.mp
          this.mechanic = result.data.work
          this.shop = result.data.shop
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取授权信息失败',
            content: `${response.status} ${result.code} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取授权信息失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    async getEnterpriceAuthorization () {
      try {
        const {response, result} = await this.fetchEnterpriceAuthorization({})
        if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
          this.isEnterpriceLoaded = true
          this.enterprice = result
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取授权信息失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取授权信息失败',
          content: `服务异常，请稍后再试 ${err}`,
        })
      }
    },
  },
  mounted () {
    this.getAuthorizations()
    this.getEnterpriceAuthorization()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'

.authorization-wrapper
  // firefox flex bug
  min-height 0
  flex 1 1 auto
  display flex
  flex-direction column
  margin 16px 40px
  border-radius 3px
  background-color #fff
  align-items center
.content-container
  position relative
  width 100%
  overflow-y auto
.page-title
  position relative
  margin-top 48px
  margin 48px auto 32px
  text-align center
  font-size 24px
  line-height 32px
  padding-bottom 26px
  &::after
    content ''
    position absolute
    bottom 0
    left 50%
    transform translateX(-50%)
    display block
    border-top 2px solid primary
    width 32px
.authorization-tip
  margin 24px auto
  text-align center
  font-size 13px
  line-height 20px
  color lightGrey
.authorization-section-info
  text-align center
  font-size 14px
  line-height 16px
  color lightGrey
.authorization-list
  position relative
  margin 20px auto 24px
  width 720px
  border 1px solid #ddd
  border-radius 3px
  &:last-child
    margin-bottom 52px
  .handle-text
    position absolute
    right 0
    bottom -27px
    color blue
    font-size 13px
.authorization-item
  position relative
  display flex
  justify-content space-between
  align-items center
  height 100px
  padding 0 24px
  &::after
    content ''
    position absolute
    left 0
    bottom 0
    width 100%
    // border-top 1px solid rgba(0, 0, 0, .08)
  &:last-child::after
    display none
  &.without-border
    &::after
      display none

.type-info
  position relative
  height 64px
  padding 7px 0
  padding-left 88px
  .icon
    position absolute
    left 0
    top 0
    width 60px
    height 60px
    border-radius 60px
    background #e4e4e4 center no-repeat
    background-size contain
    box-shadow 0 0 0 0 rgba(0, 0, 0, .05), 0 6px 16px 0 rgba(0, 0, 0, .05)
    &.icon-mp
      background-size 32px
      background-color #22A340
      background-image url('~@/assets/settings/wechat-service.svg')
      box-shadow 0 0 0 0 rgba(0,0,0,0.05), 0 6px 16px 0 rgba(0,0,0,0.05), 0 2px 20px 0 rgba(34,163,64,0.05)
    &.icon-corp
      background-image url('~@/assets/settings/store-assistant.png')
      box-shadow 0 0 0 0 rgba(0,0,0,0.05), 0 6px 16px 0 rgba(0,0,0,0.05), 0 2px 20px 0 rgba(81,156,255,0.05)
    &.icon-mechanic
      background-image url('~@/assets/settings/vehicle-ent.png')
      box-shadow 0 0 0 0 rgba(0,0,0,0.05), 0 6px 16px 0 rgba(0,0,0,0.05), 0 2px 20px 0 rgba(81,156,255,0.05)
    &.icon-enterprice
      background-image url('~@/assets/settings/vehicle-ent.png')
      box-shadow 0 0 0 0 rgba(0,0,0,0.05), 0 6px 16px 0 rgba(0,0,0,0.05), 0 2px 20px 0 rgba(81,156,255,0.05)
    &.icon-maintenance
      background-image url('~@/assets/settings/maintenance-mini.png')
      box-shadow 0 0 0 0 rgba(0,0,0,0.05), 0 6px 16px 0 rgba(0,0,0,0.05), 0 2px 20px 0 rgba(255,189,19,0.05)
    &.icon-inspection
      background-image url('~@/assets/settings/vehicle-mini.png')
      box-shadow 0 0 0 0 rgba(0,0,0,0.05), 0 6px 16px 0 rgba(0,0,0,0.05), 0 2px 20px 0 rgba(255,189,19,0.05)
    &.icon-washing
      background-image url('~@/assets/settings/car-wash-mini.png')
      box-shadow 0 0 0 0 rgba(0,0,0,0.05), 0 6px 16px 0 rgba(0,0,0,0.05), 0 2px 20px 0 rgba(255,189,19,0.05)
    &.icon-entrance
      background-image url('~@/assets/settings/entrance-mini.png')
      box-shadow 0 0 0 0 rgba(0,0,0,0.05), 0 6px 16px 0 rgba(0,0,0,0.05), 0 2px 20px 0 rgba(255,189,19,0.05)
  .heading
    font-size 18px
    line-height 24px
    margin-bottom 7px
    .tip
      padding 0 3px
      color placeholder
  .content
    font-size 13px
    line-height 18px
    color lightGrey
.state
  display inline-block
  vertical-align middle
  padding-right 24px
  font-size 13px
  line-height 40px

.state-info
  position relative
  .tips
    position absolute
    font-size 12px
    line-height 17px
    color error
    right 0
    bottom -23px
  .status-dot-circle
    border-radius 4px


.authorization-sub-item
  height 56px
  margin-left 108px
  padding-right 24px
  display flex
  align-items center
  border-top 1px solid rgba(0, 0, 0, .08)

.seat-tag
  padding 4px 8px
  background #FFFFFF
  border 1px solid #ededf0
  border-radius 2px
  line-height 16px
  font-size 12px
  color lightGrey
  margin-left 8px
</style>

