<template lang="pug">
  .section-layout
    timer-shaft(:high-light="7", :status="miniStatus")
    .content-wrapper
      open-store-title(title="已完成")
      .form-wrapper
        .warn-box
          img.warn-icon(src="../../assets/modal/success.svg")
          .warn-content
            .warn-title(v-if="currentUser.step === 7 && (wxStatus === 2 || currentUser.nearby_status !== 3)") 已完成基础开通流程，您还可以完成以下功能
            .warn-title(v-else) 已完成全部开通流程
        .btn-wrapper
          .button-group(v-if="currentUser.step === 7 && (wxStatus === 2 || currentUser.nearby_status !== 3)")
            a.button.primary.mini(v-if="wxStatus === 2", @click="jump(1)") 企业微信注册
            a.button.primary.mini(v-if="currentUser.nearby_status !== 3", @click="jump(2)") 附近小程序
          .button-group(v-else)
            router-link.button.primary.mini(:to="{path: '/'}") 去首页

</template>

<script type="text/ecmascript-6">
import TimerShaft from '@/components/openStore/modal/TimerShaft'
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import Api from '@/mixins/modules/OpenStore'
import { mapGetters } from 'vuex'
export default {
  name: 'completePage',
  mixins: [Api],
  components: {
    TimerShaft,
    OpenStoreTitle,
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      wxStatus: 'wxStatus',
      miniStatus: 'miniStatus',
    }),
  },
  methods: {
    /**
     * 跳转
     * @type 1: 企业微信, 2:附近小程序
     */
    jump (type) {
      if (type === 1) {
        this.$router.push({
          name: 'enterpriseWeChatRegister',
          query: {
          },
        })
      } else {
        this.$router.push({
          name: 'nearbyMiniProgramCategoryRedirect',
          query: {
          },
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
  async mounted () {
    this.$store.dispatch('syncAuthorizeStatus')
    this.updateUserInfo()
    await this.$store.dispatch('syncMiniStatus')
  },
}
</script>

<style scoped lang="stylus">
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
  margin-bottom 24px
  .warn-icon
    height 50px
    width 50px
    display inline-block
  .warn-content
    display inline-block
    margin-left 15px
    .warn-title
      font-size 20px
      font-weight 600
    .warn-text
      font-size 12px
      margin-top 10px
.btn-wrapper
  text-align center
</style>
