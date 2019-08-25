<template lang="pug">
  .section-layout
    .content-wrapper(v-if="authorize_app.data")
      open-store-title(title="企业微信注册", :isShowBack="true")
      .form-wrapper
        .remind-wrapper
          .title 企业微信申请
          .radio-wrapper(v-if="authorize_app.data.register_status === 2")
            .type-item
              .radio
                input(type="radio", id="no", :value="1", v-model="is_yes", @change="radioChange")
                label(for="no") 我要申请企业微信
          .text(v-if="authorize_app.data.register_status === 2") 完成申请后，申请企业微信的管理员请用微信扫描二维码。

          .radio-wrapper(v-if="authorize_app.data.authorize_status === 2")
            .type-item
              .radio
                input(type="radio", id="yes", :value="2", v-model="is_yes", @change="radioChange")
                label(for="yes") 我已有企业微信
          .text(v-if="authorize_app.data.authorize_status === 2") 企业微信的管理员请用微信扫描二维码。

      .btn-wrapper(v-if="authorize_app.data.register_status === 2 || authorize_app.data.authorize_status === 2")
        .button-group
          button.button.primary.large.w-350(@click="goNext", :disabled="is_disabled", :class="{ disabled: is_disabled}") 下一步
    wechat-modal(v-if="is_show", :url="registerUrl", @resolve="success", @input="close")
</template>

<script>
import WechatModal from '@/components/openStore/modal/WechatModal'
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import Api from '@/mixins/modules/OpenStore'
import { mapGetters } from 'vuex'
export default {
  name: 'enterpriseWeChatRegister',
  mixins: [Api],
  components: {
    WechatModal,
    OpenStoreTitle,
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
  },
  data () {
    return {
      is_show: false, // 是否显微信注册提醒模态框
      is_yes: null, // 1: 注册, 2: 授权
      registerUrl: '', // 企业微信注册url
      is_disabled: true, // 控制按钮点击
      url: '', // 企业微信授权url
      authorize_app: {}, // 企业微信授权列表
    }
  },
  methods: {
    radioChange () {
      if (this.is_yes) {
        this.is_disabled = false
      } else {
        this.is_disabled = true
      }
    },
    // 下一步
    goNext () {
      if (this.is_yes === 1) { // 注册
        this.registerWx()
      } else if (this.is_yes === 2) { // 授权
        this.authorize()
      }
    },
    // 已完成注册
    success () {
      this.is_yes = null
      this.is_show = false
      this.is_disabled = true
      this.authorize()
      this.getAuthorizeAppStatus()
      this.updateUserInfo()
    },
    // 关闭弹框
    close () {
      this.is_yes = null
      this.is_show = false
      this.is_disabled = true
      this.getAuthorizeAppStatus()
      this.updateUserInfo()
    },
    // 注册企业微信
    async registerWx () {
      try {
        let { response, result } = await this.spreadRegisterApi()
        if (response.status === 200 && result.code === 0) {
          this.is_show = true
          this.registerUrl = result.data.url
          window.open(this.registerUrl)
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取企业微信链接失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取企业微信链接失败',
          content: `错误: ${err}`,
        })
      }
    },
    // 授权
    authorize () {
      if (this.authorize_app.authorize_status === 1) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '企业微信通讯录已授权',
        })
      } else {
        window.open(this.url)
      }
    },
    // 获取企业微信应用列表
    async getAppList () {
      try {
        const { response, result } = await this.workWechatListApi({ type: 2 })
        if (response.status === 200 && result.length > 0) {
          this.url = result[0].groupList[0].installUrl
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取授权信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取授权信息失败',
          content: `错误: ${err}`,
        })
      }
    },
    // 获取企业微信授权信息
    async getAuthorizeAppStatus () {
      try {
        const { response, result } = await this.newAuthorizeAppStatusApi()
        if (response.status === 200 && result) {
          this.authorize_app = result
          if (this.authorize_app.data.authorize_status === 2) {
            this.getAppList()
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取企业微信授权状态失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取企业微信授权状态失败',
          content: `错误: ${err}`,
        })
      }
    },
    // 更新step字段
    async updateUserInfo () {
      try {
        const { response, result } = await this.fetchUserInfoApi()
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('updateUser', result.data)
        }
        return { response, result }
      } catch (err) {
        throw err
      }
    },
  },
  mounted () {
    this.updateUserInfo()
    this.getAuthorizeAppStatus()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.section-layout
  height calc(100% - 56px)
  overflow-y auto
.content-wrapper
  height calc(100% - 106px)
  overflow-y auto
  .w-350
    width 350px
.field-group
  border-bottom none
.form-wrapper, .btn-wrapper
  display flex
  justify-content center
  text-align left
.form-wrapper
  padding-left 0
  border-bottom none
  .title
    margin 24px 0
    font-size 24px
    font-weight 600
.text
  font-size 13px
  text-align left
  color #f00
.remind-wrapper
  margin 24px auto 0 auto
  width 350px
  min-height 120px
  text-align center
  .title
    font-size 20px
    font-weight 600
  .radio-wrapper
    display flex
    align-items center
    height 50px
</style>
