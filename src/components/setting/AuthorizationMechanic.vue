<template lang="pug">
  .authorization-wrapper
    .content-container
      template
        .corp-icon-wrapper
          .corp-icon(:style="backgroundDiv")
          | 客户管理授权
        ul.corp-info-list
          li
            .label 授权企业微信
            .content(v-text="corpInfo.corpName")
          li
            .label 授权状态
            .content
              .status-dot.green
              | 已授权
          li
            .label 企业微信二维码
            .content.qr-code-wrapper
              img.qr-code(:src="corpInfo.corpWxqrcode")
              a.button.download-btn(:href="corpInfo.corpWxqrcode", download) 下载
          li
            .label 授权时间
            .content(v-text="corpInfo.epCreated")
        .button-wrapper
          router-link.button.primary.large(:to="{name: 'authorizations'}") 返回
</template>

<script>
import userMixin from '@/mixins/modules/user'

/**
 * @vue
 */
export default {
  name: 'AuthorizationMechanic',
  mixins: [userMixin],
  data () {
    return {
      corpInfo: {},
      backgroundDiv: {},
    }
  },
  methods: {
    async getCorpAuthorization () {
      try {
        const {response, result} = await this.fetchBackendAuthorization()

        if (response.status === 200 && result.code === 0) {
          this.corpInfo = result
          this.backgroundDiv = {
            backgroundImage: 'url(' + this.corpInfo.corpSquareLogo + ')',
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取车检助理授权信息失败',
            content: `${response.status} ${result.code} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取车检助理授权信息失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    this.getCorpAuthorization()
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
  box-shadow 0 0 0 0 rgba(0,0,0,0.05), 0 6px 16px 0 rgba(0,0,0,0.05), 0 2px 20px 0 rgba(81,156,255,0.05)
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

.qr-code
  width 250px
  height 250px
  margin-top 104px
  margin-bottom 24px
  padding 8px
  border 1px solid disableBorderColor
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
  .qr-code-wrapper
    margin-top -8px
    display flex
  .qr-code
    margin 0
    margin-right 16px
    padding 3px
    width 88px
    height 88px
  .download-btn
    width 80px

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

