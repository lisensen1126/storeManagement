<template lang="pug">
  .section-layout
    timer-shaft(:high-light="2")
    .content-wrapper
      open-store-title(title="小程序申请一：小程序注册等待")
      .form-wrapper
        .warn-box
          img.warn-icon(v-if="status != 0",src="../../assets/modal/warning.svg")
          img.warn-icon(v-if="status == 0", src="../../assets/modal/success.svg")
          .warn-content(v-if="status != 0")
            .warn-title(v-if="status == 89251 || status == 89252") 资料已提交成功，您的门店资料正在审核中，请联系法人是否收到微信审核通知。
            .warn-text(v-if="status == 89251 || status == 89252") 正在审核，请耐心等待，审核成功后可进行下一步操作。
            .warn-text(v-if="status == 89251 || status == 89252") 注：1、若您想更快的看到审核结果，可刷新当前页面。
              p(style="margin-top: 10px; text-indent: 24px") 2、若您30分钟内未收到人脸识别信息，或您在完成人脸识别认证后30分钟后小程序注册未显示成功，您可点击“重新注册”重新提交注册资料。
            .warn-text(v-if="status != 89251 && status != 89252 && status != 0") 审核失败，请重新提交资料再次注册。
            .warn-text.err(v-if="status != 89251 && status != 89252 && status != 0") 失败原因: {{err_info}}
            
          .warn-content(v-if="status == 0")
            .warn-title 小程序已注册成功
      .btn-wrapper
        .button-group
          a.button.primary.large(v-if="status != 89251 && status != 89252 && status != 0",@click="againRegister") 重新注册
          button.button.primary.large(v-if="(status === 89251 || status === 89252)", :disabled="!is_show", :class="{ disabled: !is_show }", @click="againRegister") 重新注册
          p(v-if="(status === 89251 || status === 89252) && !is_show") {{this.date}}
          a.button.primary.large(v-if="status == 0",@click="goNext") 下一步
      .explain-box
        .explain-title 小程序申请说明：
        .explain-text 1、第三方收集法人微信、法人姓名、企业名称、信用代码四个商户信息外加第三方客服电话，方便商家与第三方联系（建议填写第三方客服电话）；
        .explain-text 2、企业名称需与工商部门登记信息一致；法人姓名与绑定微信银行卡的姓名一致。信息收集时要确保四个信息的对应关系，否则接口无法成功调用；
        .explain-text 3、通过法人&企业主体校验，平台向法人微信下发模板消息。法人需在24小时内点击消息，进行身份证信息与人脸识别信息收集；
        img.explain-img(src="https://oss1.chedianai.com/images/assets/openMini-img.png")
        .explain-text 4、信息收集完毕，验证通过后，即可创建已认证的小程序。
</template>

<script>
import TimerShaft from '@/components/openStore/modal/TimerShaft'
import OpenStoreMixin from '@/mixins/modules/OpenStore'
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import { mapGetters } from 'vuex'
import Utils from '@/mixins/utilities/utils'
export default {
  name: 'miniProgramFirstWait',
  mixins: [OpenStoreMixin, Utils],
  components: {
    TimerShaft,
    OpenStoreTitle,
  },
  data () {
    return {
      status: 999, // 小程序创建状态 0 成功 89251, 89252 审核中 其他code代表失败
      timer: null, // 倒计时对象
      date: null, // 倒计时时间
      is_show: false, // 是否显示重新注册按钮
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
    // 点击重新注册按钮
    againRegister () {
      this.$router.replace({
        name: 'miniProgramFirst',
        query: {},
      })
    },
    // 点击下一步
    goNext () {
      this.$router.push({
        name: 'miniProgramSecond',
        query: {},
      })
    },
    // 获取小程序创建状态
    async getStatus () {
      let _this = this
      try {
        const { response, result } = await _this.getMiniStatusApi()
        if (response.status === 200 && result.code === 0) {
          this.status = result.code
        } else if (result.code === 89251 || result.code === 89252) {
          this.status = result.code
          this.resetTime(Number(result.message) + 1800 - Math.round(new Date().getTime() / 1000))
        } else {
          this.err_info = result.message
        }
      } catch (err) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取小程序创建状态失败',
          content: `错误：${err}`,
        })
      }
    },
    // 倒计时
    resetTime (time) {
      if (time < 0) {
        this.is_show = true
        return
      }
      let _this = this
      let t = time
      let m = 0
      let s = 0
      m = Math.floor(t / 60 % 60)
      m < 10 && (m = '0' + m)
      s = Math.floor(t % 60)
      function countDown () {
        s--
        s < 10 && (s = '0' + s)
        if (s.length >= 3) {
          s = 59
          m = Number(m) - 1
        }
        if (m < 0) {
          m = '00'
          s = '00'
          _this.is_show = true
          clearInterval(_this.timer)
        }
        _this.date = m + ':' + s
      }
      _this.timer = setInterval(countDown, 1000)
    },
   // 更新step字段
    async updateUserInfo () {
      try {
        const { response, result } = await this.fetchUserInfoApi()
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('updateUser', result.data)
          this.redirectFun()
          // this.getStatus() // 获取小程序创建状态
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
            this.getStatus() // 获取小程序创建状态
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
    // // 10分钟调用一次接口刷新小程序创建状态
    // if (this.timer) {
    //   clearInterval(this.timer)
    // } else {
    //   this.getStatus() // 获取小程序创建状态
    //   this.timer = setInterval(() => {
    //     this.getStatus() // 获取小程序创建状态
    //   }, 1000 * 60 * 10)
    // }
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
.explain-box
  padding 15px 30px
  margin-top 30px
  .explain-title
    font-size 14px
    line-height 25px
  .explain-text
    font-size 12px
    line-height 20px
  .explain-img
    display block
    margin-top 10px
    margin-bottom 10px
.button-group
  display flex
  justify-content center
  align-items center
  p 
    margin-left 12px
.err 
  color #f00
</style>
