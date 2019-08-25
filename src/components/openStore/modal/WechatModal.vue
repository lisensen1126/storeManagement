<!--选择品牌馆弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 注册操作提示
        .close-button(@click="modalClose")
      .modal-body
        div 
          span 请在新打开的页面进行企业微信注册，注册完成前请不要关闭此窗口，
          span.red 如果新窗口未能自动打开
          span ，
          a.blur(@click="jump") 请点击这里继续完成企业微信的注册
          span ，注册完毕后请点击下面的“已完成注册”按钮进入授权通讯录，并使用“企业微信登录”方式进入系统。
      .modal-footer.level
        .level-left
          a.button(@click="modalClose") 取消
        .level-right
          a.button(@click="complete") 已完成注册
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  export default {
    name: 'wechatModal',
    components: {
      ModalDialog,
    },
    mixins: [ModalInteractions],
    props: {
      url: {
        type: String,
        default: '',
      },
    },
    data () {
      return {}
    },
    methods: {
      // 跳转
      jump () {
        window.open(this.url)
      },
      complete () {
        this.$emit('resolve')
      },
    },
    mounted () {},
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .red
    color #FE0000
  .blur
    color #0000FF
  .modal-header
    padding 20px 24px
  .modal-footer
    padding 12px 16px
  .modal-body
    padding 20px
    height 110px
    line-height 22px
    font-size 15px
    color #888
  .modal-footer 
    padding 0
    .button
      margin-left 0
      border 0
      box-shadow 0 0 0 0
    .level-left
      padding 10px
      width 50%
      border-right 1px solid #F7F7F7
      a
        width 100%
        border 0
    .level-right
      padding 10px
      width 50%
      a
        width 100%
</style>

