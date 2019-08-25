<template lang="pug">
  .section-layout
    .content-wrapper
      open-store-title(title="附近小程序: 门店服务类目审核", :isShowBack="true")
      .form-wrapper
        .warn-box
          img.warn-icon(v-if="status === 3", src="../../assets/modal/success.svg")
          img.warn-icon(v-if="status !== 3",src="../../assets/modal/warning.svg")
          .warn-content(v-if="status === 3")
            .warn-title 附近的小程序已开通成功
          .warn-content(v-if="status === 1")
            .warn-title 资料已提交成功，您的附近的小程序信息正在审核中，请耐心等待。
            .warn-text 正在审核，审核时间需要一个工作日，请耐心等待，审核成功后可进行下一步操作。
          .warn-content(v-if="status === 2")
            .warn-text 审核失败，请重新提交资料。
            .warn-text.err 失败原因: {{err_info}}
      .btn-wrapper
        .button-group
          a.button.primary.large(v-if="status === 2", @click="resubmit") 重新提交
          a.button.primary.large(v-if="status === 3", @click="goSotreList") 完成
</template>

<script>
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import Api from '@/mixins/modules/OpenStore'
import { mapGetters } from 'vuex'
export default {
  name: 'nearbyMiniProgramCategoryWait',
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
      status: null, // 审核状态: 1 审核中 2 审核失败 3 审核通过
      err_info: '', // 失败信息
    }
  },
  methods: {
    // 去附近门店列表
    goSotreList () {
      this.$router.replace({
        name: 'nearbyMiniProgramSotreList',
      })
    },
    // 获取小程序服务类目审核状态
    async miniGetNearbyStatus () {
      try {
        let { response, result } = await this.getMerchantCategoryApi()
        if (response.status === 200 && result.code === 0) {
          if (result.data.audit_status === 1 || result.data.audit_status === 2 || result.data.audit_status === 3) {
            this.status = result.data.audit_status
            this.err_info = result.data.audit_status === 2 ? result.data.errmsg : ''
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取附近小程序审核状态失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取附近小程序审核状态失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 重新提交
    resubmit () {
      this.$router.replace({
        name: 'nearbyMiniProgramCategory',
      })
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
    // 10分钟调用一次接口刷新
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.$store.dispatch('syncAuthorizeStatus')
      this.updateUserInfo()
      this.miniGetNearbyStatus()
      this.timer = setInterval(() => {
        this.$store.dispatch('syncAuthorizeStatus')
        this.updateUserInfo()
        this.miniGetNearbyStatus()
      }, 1000 * 60 * 10)
    }
  },
  destroyed () {
    clearInterval(this.timer)
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
.form-wrapper
  padding-left 0
  border-bottom none
.warn-box
  display flex
  align-items center
  justify-content center
  margin-top 30px
  margin-bottom 40px
  .warn-icon
    height 50px
    width 50px
    display inline-block
  .warn-content
    display inline-block
    margin-left 15px
    .warn-title
      font-size 16px
    .warn-text
      font-size 12px
      margin-top 10px
.btn-wrapper
  text-align center
.err 
  color #f00
</style>

