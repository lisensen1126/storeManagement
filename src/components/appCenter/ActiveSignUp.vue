<template lang="pug">
  .section-layout
    .content-wrapper
      h2 小程序智慧支付红包活动报名
      .form-wrapper
        p.title 小程序智慧支付红包活动报名
        .box
          .field.is-horizontal
            label.label 活动主题：
            .field-content 小程序智慧支付每周瓜分万元红包，车主百分百中奖（最高88元），门店可获双重奖励
          .field.is-horizontal
            label.label 车主活动机制：
            .field-content 活动期间，智慧门店需在店内展示“小程序线下收款码”立牌；车主通过小程序支付时（线下扫码或线上支付皆可），可随机获得立减红包；活动期间同一车主（以微信号为准）仅限获得一次红包；
          .field.is-horizontal
            label.label 门店奖励机制：
            .field-content 活动结束后，壳牌将计算店内车主获得的支付红包累计金额，并给到智慧门店同等金额的奖励；
          .field.is-horizontal
            label.label 活动报名时间：
            .field-content 2019年7月8日 - 2019年7月21日
          .field.is-horizontal
            label.label 活动进行时间：
            .field-content 2019年7月22日 - 2019年9月29日（共10周）
          .field.is-horizontal
            label.label 参与门店：
            .field-content 800家（按报名顺序，先报先得）
          a.more(@click="goDetail()") 更多活动详情
      p.tip-info 点击下方“立即报名”，4步快速参与活动
      p.option-info 吸引新客；连接车主；发券复购；门店双重奖励
      el-steps.step(:active="4", align-center)
        el-step(title="确认报名信息")
        el-step(title="确认收到物料")
        el-step(title="物料拍照")
        el-step(title="优惠券配置")
      el-button.btnsize(type="primary", size="medium", @click="fetchStep()") 立即报名
      
</template>

<script>
import Api from '@/mixins/modules/AppCenter'
export default {
  name: 'activeSignUp',
  components: {
  },
  mixins: [Api],
  data () {
    return {
      step: 0,
    }
  },
  mounted () {
  },
  methods: {
    goDetail () {
      this.$router.push({
        name: 'ActiveSignUpDetail',
      })
    },
    // 获取报名到哪一步了，步骤
    async fetchStep () {
      try {
        const {result, response} = await this.getActiveCurstepAPi()
        if (response.status === 200 && result.code === 0) {
          this.step = result.data.step
          if (result.data.isStart === 1) {
            this.$store.dispatch('showMessage', {
              title: '温馨提示',
              content: '活动已经开始了，抓紧时间报名！',
              isRejectable: 1,
              resolve: () => {
                this.goStep()
              },
            })
          } else {
            this.goStep()
          }
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
    // 更新报名步骤，开始下一步
    async goStep () {
      try {
        const {result, response} = await this.createActiveAPi()
        if (response.status === 200 && result.code === 0) {
          this.$router.replace({
            name: 'ActiveSignUpStep',
            query: {
              step: 1,
            },
          })
        } else if (response.status === 200 && result.code === 41232) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '温馨提示',
            content: result.message,
            resolve: () => {
              this.$router.push({name: 'ActiveSignUpStep', query: {step: this.step}})
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '温馨提示',
            content: result.message,
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.header-title
  border-bottom 1px solid #eee
.title
  text-align center
  font-size 24px
  line-height 60px
  margin-bottom 40px
.form-wrapper
  padding-bottom 20px
.box
  width 520px
  height 100%
  margin 0 auto
  .field
    margin-bottom 20px
    .label
      font-size 14px
      color #333333
      margin 0
      font-weight 600
      flex 0 0 100px
    .field-content
      font-size 14px
      color #666666
      line-height 1.4
  .more
    color #409EFF
  .more:hover
    text-decoration underline
.tip-info
  font-size 20px
  text-align center
  padding-top 30px
.option-info
  font-size 14px
  text-align center
  padding-top 12px
  color #666666
.step
  width 520px
  margin 0 auto
  padding-top 50px
.btnsize
  width 160px
  margin 0 auto
  margin-top 60px
</style>
