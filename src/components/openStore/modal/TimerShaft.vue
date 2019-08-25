<!--顶部步骤导航栏-->
<template lang="pug">
  .timer-shaft-box
    .item-time(v-for="(item, index) in time_list",:class="{'width-15': index == time_list.length-1}")
      .item-dot(:class="{'high-light': highLight == index +1, 'active': status !== 0 && status !== 1 && status !== null && index + 1 === 3 && highLight > 3}", @click="goMiniWait(status !== 0 && status !== 1 && status !== null && index + 1 === 3 && highLight > 3)")
        .item-line(v-if="index !== time_list.length-1")
      .item-title(v-text="item.name",:class="{'left-1': item.name.length == 1 ,'left-2': item.name.length == 2 ,'left-3': item.name.length == 3 ,'left-4': item.name.length == 4 ,'left-5': item.name.length == 5,'left-6': item.name.length == 6,'left-7': item.name.length == 7,'left-8': item.name.length == 8}")
      span.tips-text.wait(v-if="status === 1 && index + 1 === 3 && highLight > 3") 审核中
      span.tips-text(v-if="status !== 0 && status !== 1 && status !== null && index + 1 === 3  && highLight > 3") 审核失败
</template>

<script>
export default {
  name: 'timerShaft',
  props: {
    highLight: {
      type: Number,
      default: 0,
    },
    // 0 成功 1 审核中 , 其余code 审核失败
    status: {
      type: Number,
      default: null,
    },
  },
  data () {
    return {
      time_list: [
        {
          name: '门店资质',
          type: 0,
          status: 0,
        }, {
          name: '小程序申请一',
          type: 1,
          status: 1,
        }, {
          name: '小程序申请二',
          type: 2,
          status: 0,
        }, {
          name: '支付申请一',
          type: 3,
          status: 0,
        }, {
          name: '支付申请二',
          type: 4,
          status: 0,
        }, {
          name: '支付申请三',
          type: 5,
          status: 0,
        }, {
          name: '已完成',
          type: 6,
          status: 0,
        },
      ],
      tab: {
        name: '门店资质',
        type: '0',
      },
    }
  },
  methods: {
    // 去小程序申请二等待页面
    goMiniWait (flag) {
      if (flag) {
        this.$router.push({
          name: 'miniProgramSecondWait',
        })
      }
    },
  },
  mounted () {
    console.log('status', this.status)
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.timer-shaft-box
  width 100%
  height 90px
  background-color #ffffff
  display flex
  align-items center
  justify-content center
  .item-time
    float left
    width 100px
    height 28px
    position relative
    .item-dot
      width 15px
      height 15px
      border-radius 50%
      background-color #e4e7ed
      position relative
      .item-line
        height 2px
        width 85px
        background-color #e4e7ed
        position absolute
        right -85px
        top 0
        bottom 0
        margin auto
    .high-light
      background-color #ffbb29
    .active
      cursor pointer
      background #f00
    .item-title
      position absolute
      top: 20px
      font-size 12px
      white-space nowrap
    .left-1
      left: 0px
    .left-2
      left: -6px
    .left-3
      left: -11px
    .left-4
      left: -16px
    .left-5
      left: -23px
    .left-6
      left: -30px
    .left-7
      left: -36px
    .left-8
      left: -41px
    .tips-text
      position absolute
      top 38px
      left -17px
      font-size 12px
      &.wait
        left -11px
  .width-15
    width 15px
</style>
