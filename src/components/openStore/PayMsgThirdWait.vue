<template lang="pug">
  .section-layout
    timer-shaft(:high-light="6", :status="miniStatus")
    .content-wrapper
      open-store-title(title="支付申请三：支付配置申请审核")
      .form-wrapper
        .warn-box
          img.warn-icon(v-if="is_pay === 3",src="../../assets/modal/warning.svg")
          img.warn-icon(v-if="is_pay !== 3", src="../../assets/modal/success.svg")
          .warn-content(v-if="is_pay === 3")
            .warn-title 美团支付已开通成功
          .warn-content(v-if="is_pay === 1")
            .warn-title 您还未提交验证，请提交支付配置申请。
          .warn-content(v-if="is_pay === 2")
            .warn-title 资料已提交成功，您的美团支付信息正在审核中，请耐心等待。
            .warn-text 正在审核，请耐心等待，审核成功后可进行下一步操作。
            .warn-text 注：若您想更快的看到审核结果，可刷新当前页面。
          .warn-content(v-if="is_pay === 4")
            .warn-title 审核失败，请重新提交资料。
            .warn-text.err 失败原因: {{reason}}
      .btn-wrapper
        .button-group
          a.button.primary.large(v-if="is_pay === 1", @click="againSubmit") 支付配置申请
          a.button.primary.large(v-if="is_pay === 3", @click="goNext") 完成
          a.button.primary.large(v-if="is_pay === 4", @click="resetPayment") 重新提交
</template>

<script>
import TimerShaft from '@/components/openStore/modal/TimerShaft'
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import Api from '@/mixins/modules/OpenStore'
import { mapGetters } from 'vuex'
export default {
  name: 'payMsgThirdWait',
  mixins: [Api],
  components: {
    TimerShaft,
    OpenStoreTitle,
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      wxStatus: 'wxStatus',
      miniStatus: 'miniStatus',
    }),
  },
  data () {
    return {
      is_pay: null, // 是否开通支付：1 等待提交支付审核，2 支付审核中，3 审核完成/已开通支付，4 支付审核失败
      reason: '', // 失败原因
    }
  },
  methods: {
    // 获取美团支付信息
    async merchantStore () {
      try {
        const { response, result } = await this.getMerchantApi()
        if (response.status === 200 && result.code === 0 && (result.data.is_pay === 1 || result.data.is_pay === 2 || result.data.is_pay === 3 || result.data.is_pay === 4)) {
          this.is_pay = result.data.is_pay
          this.reason = result.data.reason ? result.data.reason : ''
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取美团支付信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取美团支付信息失败',
          content: `错误：${err}`,
        })
      }
    },
    // 支付配置申请
    againSubmit () {
      this.$router.replace({
        name: 'payMsgThird',
      })
    },
    // 重置门店美团支付信息
    async resetPayment () {
      this.$store.dispatch('showMessage', {
        isRejectable: 1,
        title: '警告',
        content: '确认重置支付信息并返回"支付申请一"',
        resolve: () => {
          this.resetPaymentFun()
        },
      })
    },
    async resetPaymentFun () {
      try {
        const { response, result } = await this.resetPaymentApi()
        if (response.status === 200 && result.code === 0) {
          this.$router.replace({
            name: 'payMsgFirst',
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '重置门店美团支付信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '重置门店美团支付信息失败',
          content: `错误：${err}`,
        })
      }
    },
    // 下一步
    goNext () {
      this.$router.replace({
        name: 'completePage',
      })
    },
    // 更新step字段
    async updateUserInfo () {
      try {
        const { response, result } = await this.fetchUserInfoApi()
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('updateUser', result.data)
          this.redirectFun()

          // this.merchantStore()
        }
        return { response, result }
      } catch (err) {
        throw err
      }
    },
    // 重定向
    redirectFun () {
      let type = this.currentUser.step // 主流程
      let wxStatus = this.wxStatus // 企业微信
      let nearbyStatus = this.currentUser.nearby_status // 附近小程序
      let flag = this.currentUser.mini_status === 1 // 未提交
      switch (type) {
        case 1:
          this.$router.push({
            name: 'storeAptitude',
          })
          break
        case 2:
          if (flag) {
            this.$router.push({
              name: 'miniProgramFirst',
            })
          } else {
            this.$router.push({
              name: 'miniProgramFirstWait',
            })
          }
          break
        case 3:
          if (flag) {
            this.$router.push({
              name: 'miniProgramSecond',
            })
          } else {
            this.$router.push({
              name: 'miniProgramSecondWait',
            })
          }
          break
        case 4:
          this.$router.push({
            name: 'payMsgFirstWait',
          })
          break
        case 5:
          if (flag) {
            this.$router.push({
              name: 'payMsgSecond',
            })
          } else {
            this.$router.push({
              name: 'payMsgSecondWait',
            })
          }
          break
        case 6:
          if (flag) {
            this.$router.push({
              name: 'payMsgThird',
            })
          } else {
            this.merchantStore()
          }
          break
        case 7:
          if (wxStatus === 2) {
            this.$router.push({
              name: 'enterpriseWeChatRegister',
            })
          } else if (nearbyStatus !== 3) {
            this.$router.push({
              name: 'nearbyMiniProgramCategoryRedirect',
            })
          }
          break
        default:
          break
      }
    },
  },
  async mounted () {
    this.$store.dispatch('syncAuthorizeStatus')
    this.updateUserInfo()
    await this.$store.dispatch('syncMiniStatus')
    // 10分钟调用一次接口刷新
    // if (this.timer) {
    //   clearInterval(this.timer)
    // } else {
    //   this.merchantStore()
    //   this.timer = setInterval(() => {
    //     this.merchantStore()
    //   }, 1000 * 60 * 10)
    // }
  },
  // destroyed () {
  //   clearInterval(this.timer)
  // },
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
.btn-wrapper .button
  width 130px
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

