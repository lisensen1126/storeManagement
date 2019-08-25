<template lang="pug">
  .section-layout
    timer-shaft(:high-light="3", :status="status", v-if="status !== null")
    .content-wrapper
      open-store-title(title="小程序申请二：小程序信息完善审核")
      .form-wrapper
        .warn-box(:class="{'m-t-110': status == 1}")
          img.warn-icon(v-if="status != 0",src="../../assets/modal/warning.svg")
          img.warn-icon(v-if="status == 0", src="../../assets/modal/success.svg")
          .warn-content(v-if="status == 1")
            .warn-title 资料已提交成功，您的小程序正在审核中，请耐心等待。
            .warn-text 正在审核，请耐心等待，审核成功后可进行下一步操作。
            .warn-text 注：若您想更快的看到审核结果，可刷新当前页面。
          .warn-content(v-if="status !== 0 && status !== 1")
            .warn-title 审核失败，请重新提交资料再次提交资料。
            .warn-text.err 失败原因: {{err_info}}
          .warn-content(v-if="status == 0")
            .warn-title 小程序信息已审核完成
      .btn-wrapper
        .button-group
          a.button.primary.large(v-if="status !== 0 && status !== 1",@click="againRegister") 重新提交
          a.button.primary.large(@click="goNext") 下一步
</template>

<script>
import TimerShaft from '@/components/openStore/modal/TimerShaft'
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import OpenStoreMixin from '@/mixins/modules/OpenStore'
import { mapGetters } from 'vuex'
export default {
  name: 'miniProgramSecondWait',
  mixins: [OpenStoreMixin],
  components: {
    TimerShaft,
    OpenStoreTitle,
  },
  data () {
    return {
      status: null, // 0 成功 1 审核中 , 其余code 审核失败
      err_info: '', // 失败信息
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      wxStatus: 'wxStatus',
    }),
  },
  methods: {
    // 点击重新提交按钮
    againRegister () {
      this.$router.replace({
        name: 'miniProgramSecond',
        query: {},
      })
    },
    // 点击下一步
    goNext () {
      if (this.currentUser.step === 3 || this.currentUser.step === 4) {
        this.$router.push({
          name: 'payMsgFirst',
          query: {},
        })
      } else {
        this.redirectFun()
      }
    },
    // 获取小程序审核状态
    async getStatus () {
      let _this = this
      try {
        const { response, result } = await _this.getUpdateMiniStatusApi()
        if (response.status === 200 && (result.code === 0 || result.code === 1)) {
          this.status = result.code
        } else {
          this.status = result.code
          this.err_info = result.message
        }
      } catch (err) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取小程序审核状态失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 更新step字段
    async updateUserInfo () {
      try {
        const { response, result } = await this.fetchUserInfoApi()
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('updateUser', result.data)
          // this.redirectFun()
          if (this.currentUser.step >= 3) {
            this.getStatus() // 获取小程序基本信息审核
          } else {
            this.redirectFun()
          }
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
            this.getStatus() // 获取小程序审核状态
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
            this.$router.push({
              name: 'payMsgThirdWait',
            })
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
  mounted () {
    this.$store.dispatch('syncAuthorizeStatus')
    this.updateUserInfo()
    // 5分钟调用一次接口刷新小程序审核状态
    // if (this.timer) {
    //   clearInterval(this.timer)
    // } else {
    //   this.getStatus() // 获取小程序审核状态
    //   this.timer = setInterval(() => {
    //     this.getStatus() // 获取小程序审核状态
    //   }, 1000 * 60 * 5)
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
.m-t-110
  margin-top 110px
.err
  color #f00
</style>
