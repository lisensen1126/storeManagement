<!--选择案例弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 填写案例
          span.tip （以下案例仅供参考，实际填写场景并不限于案例）
        .close-button(@click="modalClose")
      .modal-body
        .top-case-tip
          //- 打卡
          span(v-if="id === 'AT0407'") 打卡提醒适用于活动提醒，方便门店将策划好的活动触达给更多用户，例如店庆活动、洗车优惠活动等。请注意推送频次，不建议频繁推送活动提醒，以免用户设置拒收或向微信官方投诉。
          //- 保养到期
          span(v-if="id === 'AT2124'") 保养到期提醒适用于门店对达到保养里程的用户进行保养提醒，引导用户到店保养。
          //- 拼团
          span(v-if="id === 'AT0911'") 拼团待参团提醒适用于门店推广爆款单品，将爆款单品加入拼团，推送给更多用户，提升参团率和成单率。请注意推送频次，不建议频繁推送活动提醒，以免用户设置拒收或向微信官方投诉。
          //- 信息完善
          span(v-if="id === 'AT0871'") 信息完善通知适用于门店对尚未完善车辆信息的客户发送提醒，以促进客户完善车辆车型信息，使客户信息更加立体化。
        .case-title
          .title(v-text="id === 'AT0407' ? '案例一：店庆三周年活动' : id === 'AT2124' ? '案例一：用户二次保养提醒' : id === 'AT0911' ? '案例一：普洗+打蜡' : '案例一：车辆完善信息提醒'")
          .title(v-text="id === 'AT0407' ? '案例二：1元洗车活动' : id === 'AT2124' ? '案例二：推荐购买保养卡提醒' : id === 'AT0911' ? '案例二：壳牌喜力HX8标准养护服务' : '案例二：车辆完善信息提醒'")
        .case-warpper
          .case-item.left
            .store-info
              .info
                img.store-img(:src="store.image")
                .store-name {{store.name}}
              .dot
                .dot-item
                .dot-item
                .dot-item
            .content
              .title {{name}}
              .form-item
                .label(v-text="id === 'AT0407' ? '活动名称' : id === 'AT2124' ? '保养提醒' : id === 'AT0911' ? '商品名称' : '温馨提示'") 
                .value(v-text="id === 'AT0407' ? '庆店三周年，换油买一送一' : id === 'AT2124' ? '爱车已到保养时间，建议尽快到店保养，保障爱车永久如新' : id === 'AT0911' ? '普洗+打蜡' : '您好，十分感谢您使用壳保养智慧门店小程序。为了方便您顺利出行，减少爱车修理次数，我们推荐您尽快完善车辆信息，系统会根据您的爱车进行智能保养规划。点击进入快速完善。'")
              .form-item
                .label(v-text="id === 'AT0407' ? '活动日期' : id === 'AT2124' ? '保养项目' : id === 'AT0911' ? '商品价格' : '服务地址'")
                .value(v-text="id === 'AT0407' ? '2019-06-20至2019-08-30' : id === 'AT2124' ? '推荐换油小保养套餐、更换刹车皮' : id === 'AT0911' ? '118.00元' : '西安市光泰路财富中心二期'")
              .form-item(v-if="id !== 'AT0871' || id !== 'AT0407'")
                .label(v-text="id === 'AT0407' ? '打卡主题' : id === 'AT2124' ? '门店名称' : '拼团价格'")
                .value(v-text="id === 'AT0407' ? '来店保养，送免费洗车；线下买单，抽iPad大奖' : id === 'AT2124' ? '西安车多多养护门店' : '9.90元'")
              .form-item(v-if="id !== 'AT0871'")
                .label(v-text="id === 'AT0407' ? '温馨提示' : id === 'AT2124' ? '门店地址' : '拼团人数'")
                .value(v-text="id === 'AT0407' ? '门店地址：西安市光泰路财富中心二期' : id === 'AT2124' ? '西安市光泰路财富中心二期' : '2人'")
              .form-item(v-if="id === 'AT0911'")
                .label 拼团结束时间
                .value 2019-06-18   23：59：59
              .form-item(v-if="id === 'AT0911'")
                .label 温馨提示
                .value 只要9块9，即可呵护爱车，赶快行动吧
            .f-item
              .item-name 进入小程序查看
              img.icon(src="https://oss1.chedianai.com/mange/arrow_right.png")
            .f-item  
              .item-name 拒收通知
              img.icon(src="https://oss1.chedianai.com/mange/arrow_right.png")
          .case-item.left
            .store-info
              .info
                img.store-img(:src="store.image")
                .store-name {{store.name}}
              .dot
                .dot-item
                .dot-item
                .dot-item
            .content
              .title {{name}}
              .form-item
                .label(v-text="id === 'AT0407' ? '活动名称' : id === 'AT2124' ? '保养提醒' : id === 'AT0911' ? '商品名称' : '温馨提示'") 
                .value(v-text="id === 'AT0407' ? '一元洗车，就是这么任性' : id === 'AT2124' ? '您的爱车又需要保养了，我们推荐您购买养护卡，只需99元，持卡保养立省399元' : id === 'AT0911' ? '壳牌喜力HX8标准养护服务' : '您好，系统推荐您尽快完善车辆信息，以给您的爱车更好的呵护。完善爱车有礼包哦，快来看看吧。'")
              .form-item
                .label(v-text="id === 'AT0407' ? '活动日期' : id === 'AT2124' ? '保养项目' : id === 'AT0911' ? '商品价格' : '服务地址'")
                .value(v-text="id === 'AT0407' ? '2019-06-07至2019-06-29' : id === 'AT2124' ? '卡内包含4次免费洗车，2次9折保养，更多项目请进入小程序查看' : id === 'AT0911' ? '499.00元' : '西安市光泰路财富中心二期'")
              .form-item(v-if="id !== 'AT0871'")
                .label(v-text="id === 'AT0407' ? '打卡主题' : id === 'AT2124' ? '门店名称' : '拼团价格'")
                .value(v-text="id === 'AT0407' ? '端午节大酬宾，凡持有养护卡会员来店洗车只收1元。' : id === 'AT2124' ? '西安车多多养护门店' : '299.00元'")
              .form-item(v-if="id !== 'AT0871' || id !== 'AT0407'")
                .label(v-text="id === 'AT0407' ? '温馨提示' : id === 'AT2124' ? '门店地址' : '拼团人数'")
                .value(v-text="id === 'AT0407' ? '门店地址：西安市光泰路财富中心二期' : id === 'AT2124' ? '西安市光泰路财富中心二期' : '2人'")
              .form-item(v-if="id === 'AT0911'")
                .label 拼团结束时间
                .value 2019-06-18   23：59：59
              .form-item(v-if="id === 'AT0911'")
                .label 温馨提示
                .value 详情请进入小程序查看，换油保养更省钱
            .f-item
              .item-name 进入小程序查看
              img.icon(src="https://oss1.chedianai.com/mange/arrow_right.png")
            .f-item  
              .item-name 拒收通知
              img.icon(src="https://oss1.chedianai.com/mange/arrow_right.png")
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'

  export default {
    name: 'SendCase',
    components: {
      ModalDialog,
    },
    mixins: [ModalInteractions],
    props: {
      obj: {
        type: Object,
      },
      store: {
        type: Object,
      },
    },
    data () {
      return {
        id: '',
        name: '',
      }
    },
    watch: {
    },
    methods: {
    },
    mounted () {
      this.id = this.obj.id
      this.name = this.obj.name
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-card-title
    padding-left 357px
  .tip
    color gray
    font-size 12px
  .modal-card
    width 850px !important 
  .modal-header
    padding 20px 24px
  .modal-footer
    padding 12px 16px
  .modal-body
    position relative
    height 500px
    padding 15px
  .top-case-tip
    font-size 14px
    line-height 16px
    margin-bottom 20px
  .case-title
    display flex
    justify-content space-between
    .title
      width 400px
      line-height 36px
      font-size 16px
      font-weight bolder
  .case-warpper
    display flex
    justify-content space-between
  .case-item
    width 400px
    background white
    border 2px solid #f3f3f3
    font-size 12px
    .f-item
      background white
      border-top 1px solid #f3f3f3
      display flex
      justify-content space-between
      box-sizing border-box
      padding 0 10px
      color black
      font-size 12px
      line-height 35px
      .icon
        margin-top 11px
        width 8px
        height 13px
    .content
      background white
      border-top 1px solid #f3f3f3
      padding 5px
      .title
        font-size 16px
        color black
        line-height 30px
        font-weight 500
        margin-bottom 10px
      .form-item
        display flex
        justify-content start
        margin-bottom 15px
        .label
          width 110px
          color gray
          font-size 14px
          box-sizing border-box
          padding-left 4px
        .value
          width 240px
          color black
          font-size 12px
          box-sizing border-box
          line-height 16px
          white-space normal
          word-break break-all
    .top-warp
      display flex
      justify-content space-between
      margin-bottom 20px
      .title
        font-size 16px
        color black
    .store-info
      display flex
      justify-content space-between
      background white
      box-sizing border-box
      padding 10px
      .info
        display flex
        justify-content start
        .store-img
          width 30px
          height 30px
          border-radius 30px
          margin-right 10px
        .store-name
          font-size 14px
          color black
          line-height 30px
      .dot
        .dot-item
          width 3px
          height 3px
          border-radius 3px
          background gray
          margin-top 5px
</style>

