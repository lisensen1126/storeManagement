<template lang="pug">
  .section-layout
    .content-wrapper
      .top-wrapper
        img(src="../../assets/offlineBuyIntro/tag.png")
        .breif-intro  
        //- 限时免费开放， 月交易流水达50笔且流水总额超过5000元，次月可申请获取交易手续费费率补贴，详情请咨询智慧门店客服。
      .padding-wrapper
        .underline-title
          .title  简介
            .underline
        .normal-text.margint10  智慧门店收款码是壳保养智慧门店官方推出的门店收款经营工具，门店一键开通，即刻拥有丰富的线下买单收款经营能力，并支持顾客使用信用卡支付。
        .border-line
        .underline-title.margint20
          .title  “收款码”已成智慧门店“数字化”转型的标配
        .second-title-wrapper.margint20
          .yellow-square     
          .second-title 提升用户体验及门店效率     
          .normal-text.margint10.marginl20  常规收银台，平均每个顾客收银时间约2分钟，而收款码平均收银时间仅需1分钟，收银时间节省50%。
        .second-title-wrapper
          .yellow-square     
          .second-title 线下流量转化到线上     
          .normal-text.margint10.marginl20  到店流量通过小程序转化成门店线上小程序流量，门店集客更加轻松。
          .normal-text.marginl20  简单的微信注册流程让会员注册的门槛也进一步降低，门店还能够通过小程序服务通知、短信等方式，与顾客保持有效沟通和提供优质服务。
        .second-title-wrapper
          .yellow-square     
          .second-title 增量模式探索     
          .normal-text.margint10.marginl20  通过小程序，结合个性化优惠券及拼团、秒杀等促销运营模式，提高客单价、增加线上复购率。
        .underline-title.margint30
          .title  门店场景
            .underline
        .margint15
        .normal-text.inline-block 门店场景一：
        .normal-text.inline-block.bold  扫码买单
        .flex-around.margint15
          .align-center
            img.intro-img(src="../../assets/offlineBuyIntro/intro-1-1.png")
            .align-center.intro-text 门店收银台张贴收款码                        
          .align-center
            img.intro-img(src="../../assets/offlineBuyIntro/intro-1-2.png")
            .align-center.intro-text 顾客扫码输入金额                        
          .align-center
            img.intro-img(src="../../assets/offlineBuyIntro/intro-1-3.png")
            .align-center.intro-text 完成支付，注册门店小程序                        
        .margint15
        .normal-text.inline-block 门店场景二：
        .normal-text.inline-block.bold  开单收款
        .flex-around.margint15
          .align-center
            img.intro-img(src="../../assets/offlineBuyIntro/intro-2-1.png")
            .align-center.intro-text 门店员工确认开单项目                        
          .align-center
            img.intro-img(src="../../assets/offlineBuyIntro/intro-2-2.png")
            .align-center.intro-text 生成开单收款码                        
          .align-center
            img.intro-img(src="../../assets/offlineBuyIntro/intro-2-3.png")
            .align-center.intro-text 顾客扫码完成支付    
        .underline-title
          .title 功能特点
            .underline    
             
        .flex-between
          .func-char.align-center
            .text 顾客扫描收款码
            .text 门店企业微信开单收款    
            img.corner-img(src="../../assets/offlineBuyIntro/corner1.png")   
          .func-char.align-center
            .text 多门店经营
            .text 店长/店员管理    
            img.corner-img(src="../../assets/offlineBuyIntro/corner2.png")   
          .func-char.align-center
            .text 收款通知
            .text 语音播报    
            img.corner-img(src="../../assets/offlineBuyIntro/corner3.png")   
          .func-char.align-center
            .text 精准查账
            .text 经营分析    
            img.corner-img(src="../../assets/offlineBuyIntro/corner4.png")   
          .func-char.align-center
            .text 会员管理
            .text 会员营销    
            img.corner-img(src="../../assets/offlineBuyIntro/corner5.png")   
        .underline-title
          .title  使用方式
            .underline
        .use-way
          .normal-text 1. 点击页面“开始使用”按钮，开通智慧门店收款码。
          .normal-text 2. 可在“应用中心——线下买单”中，进入线下买单功能页面。
          .normal-text &nbsp;&nbsp;&nbsp;2.1 可下载门店收款二维码；
          .normal-text &nbsp;&nbsp;&nbsp;2.2 可设置企业微信快速开单项目；
          .normal-text &nbsp;&nbsp;&nbsp;2.3 员工在企业微信——生意工具可以选择项目一键开单；
          .normal-text 3. 下载门店收款二维码后，请打印物料，张贴到收银台，替换个人微信收款码。
          .normal-text 4. 顾客微信扫描二维码完成付款，门店后台和企微端都会收到线下买单通知。
          .normal-text 5. 门店老板可以在后台或企微业绩看板查看线下买单收款记录。
    .bottom-wrapper.flex-between
        .back-btn(@click="goBack")  
        .right-op
          span.tip(v-show="has_read===3")  *小程序未审核通过，待小程序审核通过后可开始使用
          button.button.primary(:class="{'disabled':has_read===3}", @click="startUse") 开始使用
</template>
<script>
import Api from '@/mixins/modules/user'
export default {
  mixins: [Api],
  data () {
    return {
      is_disabled: false,
      has_read: 1,
    }
  },
  mounted () {
    this.has_read = this.$route.params.has_read
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    async startUse () {
      if (this.has_read === 3) {
        return
      }
      if (this.has_read === 2) {
        await this.markHasRead()
      }
      this.$router.replace({name: 'bill'})
    },
    async markHasRead () {
      try {
        await this.setHasReadApi()
        // 这个地方没有写提醒的原因是，此处用户应该是无感知的，即使失败也不应该提醒用户
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '设置已读信息失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
}
</script>


<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.section-layout
  position relative
.bottom-wrapper
  position absolute
  right 0
  bottom 0
  left 0
  height 56px
  background #fff
  padding 0 44px
  .tip
    font-size 10px
    color #D53136
    margin-right 10px
  button
    width 128px
    height 32px
    font-size 12px
  .disabled
    background rgb(217,217,217)
    box-shadow 0px 1px 5px 0px rgba(0,0,0,0.05)
    color #fff
    &:hover
      color #fff
  .back-btn
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, 0.08)
    cursor pointer
    width 32px
    height 32px
    border-radius: 100%
.content-wrapper
  background #fff
  margin 16px 25px 57px 25px
.padding-wrapper
  padding 0 20px
  overflow-y scroll
  overflow-x hidden
  margin-right -17px
.align-center
  text-align center
.intro-text
  font-size 12px
  margin-top 10px
  color #404040
.top-wrapper
  position relative
  background #fff
  padding-bottom 40px
  img
    width 130px
    height 40px
    position absolute
    left -5px
  .breif-intro
    line-height 36px
    background linear-gradient(270deg,rgba(221,29,33,0.3) 0%,rgba(221,29,33,1) 100%)
    color #fff
    margin-right 20px
    font-size 12px
    margin-left 125px
    text-indent 15px  
.underline-title
  margin-top 15px
  .title
    position relative
    display inline-block
    line-height 24px
    font-size 16px
    font-weight bold
    color #404040
    .underline
      position absolute
      left 0
      right 0
      bottom 2px
      height 6px
      background linear-gradient(360deg,rgba(221,29,33,0) 0%,rgba(221,29,33,1) 100%)
.normal-text
  line-height 18px
  color #7f7f7f
  font-size 12px
.normal-text.bold
  font-weight bold
  color #404040
.border-line
  margin-top 20px
  height 1px
  background #303030
  opacity 0.1
.margint10
  margin-top 10px
.margint15
  margin-top 15px
.margint20
  margin-top 20px
.marginl20
  margin-left 20px
.margint30
  margin-top 30px
.inline-block
  display inline-block
.flex-around
  display flex
  justify-content space-around
  align-items center
.flex-between
  display flex
  justify-content space-between
  align-items center
.yellow-square
  display inline-block
  margin-left 2px
  width 7px
  height 7px
  background #FBCE07
  vertical-align middle
  transform rotate(45deg)
.second-title-wrapper
  margin-top 15px
  .second-title
    vertical-align middle
    display inline-block
    margin-left 10px
    color #404040
    font-weight bolder
    font-size 14px
.intro-img
  width 176px
  height 186px
.func-char:first-child
  margin 10px 17px 0 0 
.func-char:last-child
  margin 10px 0 0 17px
.func-char
  height 114px
  flex 1
  margin 10px 17px 0 17px
  box-shadow 0px 0px 9px 0px rgba(240,240,240,0.5)
  padding-top 22px
  position relative
  &:hover
    box-shadow 0px 0px 9px 0px rgba(230,230,230,1)
  .corner-img
    position absolute
    right 0
    bottom 0
    width 53px
    height 50px
  .text
    font-size 14px
    color #7f7f7f
    margin-bottom 4px
.use-way
  margin-top 10px
  display flex
  flex-direction column
  justify-content space-between
  height 221px  
</style>