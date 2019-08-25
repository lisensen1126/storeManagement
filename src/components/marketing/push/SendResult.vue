<template lang="pug">
  .section-layout
    .content-wrapper
      .steps-box
        .step-item.step-is-active
          div.step-right
          span.no-icon 1
          span.text 发给谁
        .step-item.step-is-active
          div.step-right
          span.no-icon 2
          span.text 发什么
        .step-item.step-is-active
          div.step-right
          div.step-right-last
          span.no-icon 3
          span.text 完成创建
      div.center
        img.img(src="../../../assets/send-push.svg")
        .header-title 发送中
      p.label 因微信官方要求，此次发送只包含7天内和门店小程序有互动的用户。剩余未发送用户，建议在发送记录导出表格后发送短信通知。
      a.button.primary(@click="goList") 返回列表

</template>


<script>

export default {
  name: 'sendResult',
  components: {
  },
  data: _ => {
    return {
      step_num: 2,
    }
  },
  methods: {
    goList () {
      this.$router.push({
        name: 'pushList',
      })
    },
  },
  mounted () {
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.steps-box
  width 100%
  height 50px
  display flex
  justify-content start
  background #2fabdd
  .step-item
    width 33.3%
    line-height 50px
    height 50px
    color white
    margin-right 30px
    font-size 16px
    box-sizing border-box
    padding-left 30px
    position relative
    .no-icon
      float: left
      width 20px
      height 20px
      border 1px solid white
      border-radius 20px
      line-height 20px
      text-align center
      margin 16px 6px 0 0
    .text
      float: left
  .step-is-active
    background #2fabdd
  .step-item:after
    content: ""
    border-top 25px solid transparent
    border-bottom 25px solid transparent
    border-left 25px solid #d3d3d3
    position absolute
    top 0
    right -25px
  .step-is-active:after
    content: ""
    border-top 25px solid transparent
    border-bottom 25px solid transparent
    border-left 25px solid #2fabdd
    position absolute
    top 0
    right -25px
  .step-right
    border-top 25px solid transparent
    border-bottom 25px solid transparent
    border-left 25px solid white
    position absolute
    top 0
    right -26px
  .step-right-last
    width: 29px
    height: 50px
    position: absolute
    background: white
    top: 0
    right: -30px
.primary
  margin 0 auto 
  width 200px
.content-wrapper
  display flex
  background white
  justify-content start
  box-sizing border-box
  text-align center
  margin-top 20px
  padding-top 0
.header-title
  font-weight bold
  color #333
.label
  font-size 12px
  color #666
  margin-top 20px
  margin-bottom 40px
.img
  width 120px
  margin-bottom 10px
.center
  text-align center
  padding-top 80px
</style>
