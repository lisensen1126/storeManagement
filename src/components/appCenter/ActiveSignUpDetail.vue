<template lang="pug">
  .section-layout
    .content-wrapper
      h2 活动详情介绍
      .form-wrapper
        p.title Part1. 活动详情
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
            .field-content 2019年7月22日 - 9月29日（共10周）
          .field.is-horizontal
            label.label 参与门店：
            .field-content 800家（按报名顺序，先报先得）
        p.title Part2. Q&A
        .box
          .line
            .questions Q1: 小程序线下支付对智慧门店的好处是什么？
            .answers A1: 车主首次扫码付款时需要注册门店小程序，帮助门店最小成本连接车主和集客；门店可在小程序后台清楚看到每位车主的交易时间，订单信息，车辆信息，会员卡信息和车检报告（部分信息需维护才可见）；
          .line
            .questions Q2: 车主如何进行小程序线下支付，什么时候获得立减红包？
            .answers A2: 车主打开微信扫一扫即可，与正常微信支付流程一致；支付环节时车主会获得随机红包，可在本次消费金额里抵扣；
          .line
            .questions Q3: 本次支付后如何拉动车主下次到店复购？
            .answers A3: 门店可在小程序后台设置“支付有礼”营销活动。车主支付后除了获得本次活动的立减红包，还可获得门店自主设置的小程序优惠券（洗车/换油/轮胎/美容/贴膜等），可供下次消费时使用，拉动车主下次到店复购；
          .line
            .questions Q4: 门店是否一定要配置“支付有礼”和“评价有礼”营销功能的优惠券，才可参加本次活动？
            .answers A4: 不是，门店不配置优惠券也可参加活动。我们建议门店在本次活动中加上这些活动，是为了提升车主下次到店复购/转化率，以及增加门店优质评价。
          .line
            .questions Q5: 门店双重奖励的机制介绍？
            .answers A5: 活动期间，车主所得立减红包将由门店暂时承担，门店每天可从企业微信工作台看到本店车主的累计红包金额。同时，门店所获的奖励等于该店车主累计红包金额（例：A门店的车主累计红包金额为1000元，则A门店的奖励金额为1000元。活动结束后门店将获得2000元）。
          .line
            .questions Q6: 门店活动奖励如何兑现？
            .answers A6: 活动结束后（9月29日），壳牌将统计所有参与门店的奖励金额，并通过进货抵扣方式给到所属经销商；经销商将从10月起，通过进货抵扣的方式，把对应的活动奖励金额给到门店；
          .line
            .questions Q7: 小程序线下支付的手续费是多少？到账周期？
            .answers A7: 小程序线下支付与小程序在线支付无区别，手续费为0.38%，T+1天到门店银行账户；
          .line
            .questions Q8: 活动报名后，壳牌会发哪些线下物料？
            .answers A8: 1. 小程序支付立牌；2. 活动海报；3. 活动指导手册；以上物料都印制了该智慧门店二维码
      el-button.btnsize(type="primary", size="medium" @click="goBack") 我知道了
      
</template>

<script>
export default {
  name: 'activeSignUpDetail',
  data () {
    return {
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
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
  width 620px
  margin 0 auto
  .field
    margin-bottom 20px
    width 620px
    .label
      font-size 14px
      color #333333
      margin 0
      font-weight 600
      flex 0 0 100px
    .field-content
      font-size 14px
      color #666666
      line-height 1.5
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
  width 600px
  margin 0 auto
  padding-top 50px
.btnsize
  width 160px
  margin 0 auto
  margin-top 60px
.line
  padding-bottom 20px
  font-size: 14px
  line-height: 1.5
  .questions
    color #333333
  .answers
    color #999999

</style>
