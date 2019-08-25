<template lang="pug">
  .wrapper(v-if="(is_show_tip || is_show_open_store) && (is_store || is_tip)")
    .message(v-if="is_store && currentUser && currentUser.mini_from_type === 2 && (currentUser.step !== 7 || currentUser.nearby_status !== 3 || wxStatus === 2) && is_show_open_store === 1")
      span.can-click(@click.stop="openStorePage") 您的门店开通信息暂未完善，请点击继续完成。
      //- status 门店是否报过名 1 报过 2 没有
    .p-r-box(v-if="store_apply && store_apply.status - 0 === 2 && is_tip && is_show_tip")
      span 「壳保养支付100%立减，最高减88，客户门店双重奖励」活动火热进行中，
      span.blue(@click="goEventPage") 赶紧报名参加
    .p-r-box(v-if="store_apply && store_apply.status - 0 === 1 && is_show_tip")
      span 「昨日立减{{store_apply.num}}笔交易，客户减免{{store_apply.customer}}元，门店获得{{store_apply.panel}}元奖励」
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/mixins/modules/OpenStore'
import AppApi from '@/mixins/modules/AppCenter'
export default {
  name: 'openStoreWarn',
  mixins: [Api, AppApi],
  props: {
    message: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      step: '',
      overdue: '',
      initiation: '',
      is_show_open_store: 0, // 控制是否展示门店开通信息完善提醒（接口）
      is_show_tip: 0, // 控制是否展示活动报名提示（接口）
      store_apply: null,
      is_tip: 1, // 控制是否展示活动报名提示：本地
      is_store: 1, // 控制是否展示门店开通信息完善提醒：本地
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      wxStatus: 'wxStatus',
    }),
  },
  watch: {
    // 监听路由控制显隐
    '$route': async function (newVal, oldVal) {
      // 监听路由，间接获取到门店开通信息完善提醒是否展开，然后动态修改高度
      sessionStorage.setItem('is_show_open_store', 1)
      sessionStorage.setItem('is_show_tip', 1)
      // 监听路由和门店信息参数判断，是否展示门店开通信息完善提醒，mini_from_type：门店来源：1.授权，2.快速开通；step: 开通门店页面步骤的具体定位，跟开通门店的顶部步骤导航相对应
      if (this.currentUser && parseInt(this.currentUser.mini_from_type) === 2 && (this.currentUser.step >= 1 && this.currentUser.step <= 7)) {
        this.is_show_open_store = 1
      } else {
        sessionStorage.setItem('is_show_open_store', 0)
      }
      // 如果从在报名活动出来
      if (oldVal.name === 'ActiveSignUpStep') {
        await this.updateUserInfo()
        this.fetchStep()
      }
      // 如果从在开通门店出来
      if (oldVal.meta.module === 'openStore') {
        await this.updateUserInfo()
      }
      // 点击开通流程
      if (newVal.meta.module === 'openStore') {
        this.is_store = 0
        this.is_show_open_store = 0
        sessionStorage.setItem('is_show_open_store', 0)
      } else if (newVal.meta.module === 'login') {
        this.is_tip = 0
        this.is_store = 0
        this.is_show_open_store = 0
        this.is_show_tip = 0
      } else {
        this.is_store = 1
      }
      // 如果是点击报名活动
      if (newVal.name === 'ActiveSignUpStep') {
        sessionStorage.setItem('is_show_tip', 0)
        this.is_tip = 0
        this.is_show_tip = 0
      } else {
        this.is_tip = 1
      }
      let apply = ''
      if (this.currentUser && this.currentUser.store_apply) {
        apply = JSON.parse(JSON.stringify(this.currentUser.store_apply))
      }
      if (apply) {
        apply.customer = (apply.customer / 100).toFixed(2)
        apply.panel = (apply.panel / 100).toFixed(2)
      }
      this.store_apply = apply
      this.is_show_tip = 1
      // 接口判断是否展示活动提示
      if (apply.display === 2) {
        this.is_show_tip = 0
        this.is_tip = 0
        sessionStorage.setItem('is_show_tip', 0)
      }
      if (newVal.name === 'login') {
        this.is_show_tip = 0
        this.is_show_open_store = 0
      }
      // console.log(this.is_show_tip, this.is_tip, this.is_show_open_store, this.is_store, 'XXXXX')
    },
  },
  methods: {
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
    // 去开通门店的相应页面
    openStorePage () {
      // mini_status: 1未提交, 2审核, 3成功, 4失败
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
    // 去开通活动页面
    goEventPage () {
      if (this.overdue) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '温馨提示',
          content: '活动过期',
        })
      } else if (this.initiation) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '温馨提示',
          content: '活动报名将于2019年7月8日开启，敬请期待！',
        })
      } else {
        if (this.step === 0) this.$router.push({name: 'ActiveSignUp', query: {step: this.step}})
        if (this.step !== 0) this.$router.push({name: 'ActiveSignUpStep', query: {step: this.step}})
      }
    },
    // 获取报名到哪一步了，步骤
    async fetchStep () {
      try {
        const {result, response} = await this.getActiveCurstepAPi()
        if (response.status === 200 && result.code === 0) {
          this.step = result.data.step
        } else if (response.status === 200 && result.code === 41231) {
          this.overdue = true
        } else if (response.status === 200 && result.code === 41230) {
          this.initiation = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取报名步骤失败',
            content: `服务异常，请稍后再试（${result.message}）`,
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
  },
  mounted () {
    this.$store.dispatch('syncAuthorizeStatus') // 更新企业微信
    this.updateUserInfo()
    this.fetchStep()
  },
}
</script>

<style lang="stylus" scoped>
.wrapper
  width 100%
  height 35px
  display flex
  justify-content center
  position relative
  border-top solid 1px #ffffff
  background-color #fdf6ec
  .message
    display block
    height 35px
    color #e6a23c
    text-align center
    line-height 35px
    .can-click
      cursor pointer
  .p-r-box
    line-height 35px
  .blue
    color #2fabdd
    cursor pointer
</style>
