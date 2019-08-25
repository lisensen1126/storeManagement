<template lang="pug">
  .authorization-wrapper
    .content-container
      template(v-if="serviceInfo.installed")
        .corp-icon-wrapper
          .corp-icon
          | 微信服务号授权
        ul.corp-info-list
          li
            .label 授权服务号
            .content(v-text="serviceInfo.name")
          li
            .label 授权状态
            .content
              .status-dot.green
              | 已授权
          li
            .label 授权时间
            .content(v-text="serviceInfo.auth_at")
          li
            .label 推荐公众号
            .content
              .switch
                input(type="checkbox", id="is_top", v-model="is_open",@click="swichRecommend")
                label(for="is_top")
              .radio.open-type(v-if="is_open") 开启
              .radio.open-type(v-if="!is_open") 关闭
        .button-wrapper
          a.button.primary.large(@click="tongbu") 一键同步菜单
          router-link.button.primary.large(:to="{name: 'authorizations'}") 返回
      template(v-if="initialized && !serviceInfo.installed")
        .corp-icon-wrapper.error-wrapper
          .corp-icon
            .error-icon
          div 微信服务号授权失败
          div.error-info(v-text="serviceInfo.error_message")

        .button-wrapper.error-button-wrapper
          router-link.button.large(:to="{name: 'authorizations'}") 返回
          a.button.primary.large(:href="serviceInfo.auth_url") 重试
</template>

<script>
import userMixin from '@/mixins/modules/user'

export default {
  name: 'AuthorizationService',
  mixins: [userMixin],
  data () {
    return {
      serviceInfo: {},
      is_open: false, // 推荐公众号开关默认值
      initialized: false,
    }
  },
  methods: {
    async getAuthorization () {
      try {
        const {response, result} = await this.fetchServiceAuthorization({
          back_url: `${location.href}`,
        })

        if (response.status === 200 && result.code === 0) {
          this.serviceInfo = result
          this.initialized = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务号授权信息失败',
            content: `${response.status} ${result.code} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取服务号授权信息失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    tongbu () {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '菜单同步后,将会覆盖现有服务号菜单功能,请谨慎操作!',
        isRejectable: 1,
        resolve: () => {
          this.setMenu()
          console.log('一键同步')
        },
      })
    },
    async setMenu () {
      try {
        const {response, result} = await this.fetchMenuSet()
        if (response.status === 200) {
          if (result.code === 0) {

          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '菜单同步失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '菜单同步失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '菜单同步失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    swichRecommend () {
      setTimeout(() => {
        this.setOfficial()
      }, 200)
    },
    // 控制推荐公众号功能
    async setOfficial () {
      let txt = this.is_open ? '已开启' : '已关闭'
      try {
        const {response, result} = await this.setOfficialVal({
          is_open: this.is_open ? 1 : 0,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '推荐公众号功能' + txt,
            resolve: () => {
              this.getOfficial()
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '推荐公众号接口调用失败',
            content: `${result.message}`,
            resolve: () => {
              this.getOfficial()
            },
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '推荐公众号接口调用失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          resolve: () => {
            this.getOfficial()
          },
        })
      }
    },
    // 获取公众号推荐功能是否开启
    async getOfficial () {
      try {
        const {response, result} = await this.getOfficialVal()
        if (response.status === 200 && result.code === 0) {
          this.is_open = result.data.is_open
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取推荐公众号功能状态失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取推荐公众号功能状态失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    this.getAuthorization()
    this.getOfficial()
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
  top 40px
  transform translateX(-50%)
  width 64px
  height 64px
  border-radius 64px
  background center no-repeat
  background-size 32px
  background-color #22A340
  background-image url('~@/assets/settings/wechat-service.svg')
  box-shadow 0 0 0 0 rgba(0,0,0,0.05), 0 6px 16px 0 rgba(0,0,0,0.05), 0 2px 20px 0 rgba(34,163,64,0.05)
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
    min-width 124px
    width auto
    margin-right 15px
    &:last-child
      margin-right 0
  &.error-button-wrapper
    .button:first-child
      margin-right 8px
.open-type
  padding-left 7px
  font-size 13px
  color darker
  margin-right: 20px
</style>

