<template lang="pug">
  .authorization-wrapper
    .content-container
      template(v-if="appInfo.installed")
        .corp-icon-wrapper
          .corp-icon
          | 壳保养智慧门店小程序授权
        ul.corp-info-list
          li
            .label 授权小程序
            .content(v-text="appInfo.name")
          li
            .label 授权状态
            .content
              .status-dot.green
              | 已授权
          li
            .label 授权时间
            .content(v-text="appInfo.auth_at")
        .button-wrapper
          router-link.button.primary.large(:to="{name: 'authorizations'}") 返回
      template(v-if="initialized && !appInfo.installed")
        .corp-icon-wrapper.error-wrapper
          .corp-icon
            .error-icon
          div 壳保养智慧门店小程序授权失败
          div.error-info(v-text="appInfo.error_message")

        .button-wrapper.error-button-wrapper
          router-link.button.large(:to="{name: 'authorizations'}") 返回
          a.button.primary.large(:href="appInfo.auth_url") 重试
</template>

<script>
import userMixin from '@/mixins/modules/user'

export default {
  name: 'AuthorizationShop',
  mixins: [userMixin],
  data () {
    return {
      appInfo: {},
      errorInfo: '',
      initialized: false,
    }
  },
  methods: {
    async getAuthorization () {
      try {
        const {response, result} = await this.fetchShopAuthorization({
          back_url: `${location.href}`,
        })

        if (response.status === 200 && result.code === 0) {
          this.appInfo = result
          this.initialized = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取入口小程序信息失败',
            content: `${response.status} ${result.code} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取入口小程序信息失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    this.getAuthorization()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'

.authorization-wrapper
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

.corp-icon-wrapper
  margin 0 auto
  width 640px
  padding 120px 0 24px
  text-align center
  font-size 18px
  line-height 24px
  border-bottom 1px solid rgba(0, 0, 0, .08)
  &.error-wrapper
    padding 200px 0 50px
  .error-info
    margin-top 7px
    font-size 14px
    line-height 20px
    color #999
.corp-icon
  position absolute
  left 50%
  top 42px
  transform translateX(-50%)
  width 60px
  height 60px
  border-radius 60px
  background #e4e4e4 center no-repeat
  background-size contain
  background-image url('~@/assets/settings/entrance-mini.png')
  box-shadow 0 0 0 0 rgba(0,0,0,0.05), 0 6px 16px 0 rgba(0,0,0,0.05), 0 2px 20px 0 rgba(255,189,19,0.05)
  .error-icon
    position absolute
    right -2px
    bottom -2px
    width 24px
    height 24px
    border-radius 24px
    background #ff553d center no-repeat url('~@/assets/settings/auth-alert.svg')
    background-size 16px
    box-shadow 0 2px 8px 0 rgba(255, 0, 0, .10)
    z-index 2
  .error-wrapper &
    top 120px

.corp-info-list
  margin 0 auto
  width 640px
  padding 48px 0
  border-bottom 1px solid rgba(0, 0, 0, .08)
  li
    display flex
    justify-content center
    font-size 13px
    line-height 16px
    + li
      margin-top 40px
  .content
  .label
    width 50%
  .label
    padding-left 146px

.button-wrapper
  margin 32px auto 86px
  width 640px
  text-align center
  .button
    width 124px
  &.error-button-wrapper
    .button:first-child
      margin-right 8px
</style>

