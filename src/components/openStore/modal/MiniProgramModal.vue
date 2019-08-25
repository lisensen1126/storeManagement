<!--选择品牌馆弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 注册确认
        .close-button(@click="modalClose")
      .modal-body
        .form-wrapper
          .field-group
            .field.is-horizontal
              label.label 法人姓名
              .field-content {{name}}
            .field.is-horizontal
              label.label 法人微信号
              .field-content {{wechat}}
            .field.is-horizontal 
              .text 请确认该微信号为已绑法人本人银行卡的微信号，否则将无法注册小程序！
      .modal-footer.level
        .level-left
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(@click="complete") 确认
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  export default {
    name: 'miniProgramModal',
    components: {
      ModalDialog,
    },
    mixins: [ModalInteractions],
    props: {
      name: {
        type: String,
        default: '',
      },
      wechat: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
      }
    },
    methods: {
      complete () {
        this.$emit('resolve')
      },
    },
    mounted () {},
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .text
    font-weight 700
    color #FE0000
  .modal-header
    padding 20px 24px
  .modal-footer
    padding 12px 16px
  .modal-body
    padding 20px
    min-height 110px
    line-height 22px
    font-size 15px
    color #888
</style>

