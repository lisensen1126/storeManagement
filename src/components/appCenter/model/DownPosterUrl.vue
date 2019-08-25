<!--选择品牌馆弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 链接地址
        .close-button(@click="modalClose")
      .modal-body
        input#input(:value="down_url")
        .form-content {{down_url}}
        a.button.primary.w-100(@click="copyUrl") 复制
      .modal-footer.level
        .level-left
        .level-right
          a.button.large.primary(@click="complete") 确定
</template>

<script>
  import { root } from '@/plugins/Fetch'
  import ModalDialog from '@/components/generics/ModalDialog'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  export default {
    name: 'addTypeModal',
    components: {
      ModalDialog,
    },
    mixins: [ModalInteractions],
    props: {
      defaultValue: {
        type: String,
      },
    },
    validations: {
    },
    data () {
      return {
        down_url: '',
      }
    },
    methods: {
      // 复制
      copyUrl () {
        let input = document.getElementById('input')
        input.select() // 选中文本
        document.execCommand('copy') // 执行浏览器复制命令
      },
      complete () {
        this.modalResolve()
      },
    },
    mounted () {
      this.down_url = root + this.defaultValue
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-header
    padding 20px 24px
  .modal-footer
    padding 12px 16px
  .modal-body
    position relative
    height 180px
    display flex
    flex-direction column
    padding 30px 30px
    #input
      position fixed
      top -1000px
      left -1000px
    .w-100
      margin-top 30px
      width 100px
  .form-content
    display flex
    justify-content start
    padding 0px
    span
      line-height 32px
      padding-right 40px
    input
      width 200px
</style>