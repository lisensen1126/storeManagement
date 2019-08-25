<template lang="pug">
  .section-layout
    .content-wrapper
      open-store-title(title="企业微信授权", :isShowBack="true")
      .form-wrapper
        .title 授权企业微信通讯录
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="authorize") 授权
</template>

<script>
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import Api from '@/mixins/modules/OpenStore'
import { mapGetters } from 'vuex'
export default {
  name: 'enterpriseWeChatAuthorization',
  mixins: [Api],
  components: {
    OpenStoreTitle,
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      wxStatus: 'wxStatus',
    }),
  },
  data () {
    return {
      url: '',
      authorize_app: {},
    }
  },
  methods: {
    // 授权
    authorize () {
      if (this.authorize_app.authorization_status === 1) {
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
          this.getAuthorizeAppStatus()
        }
        return { response, result }
      } catch (err) {
        throw err
      }
    },
  },
  mounted () {
    this.updateUserInfo()
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
.field-group
  border-bottom none
.form-wrapper, .btn-wrapper
  display flex
  justify-content center
.form-wrapper
  padding-left 0
  border-bottom none
  .title
    margin 24px 0
    font-size 24px
    font-weight 600
</style>
