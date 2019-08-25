<template lang="pug">
  .wrapper
    span.comment(@mouseover="showCommentModal", @mouseleave="hideCommentModal", @mouseout="CommentModalOut")
      .has-comment(v-text="message")
    .modal(v-if="isVisible")
      transition(name="fade")
        p(v-text="message")
</template>

<script>
  export default {
    name: 'ToolTip',
    props: {
      message: {
        type: String,
        default: '测试测试测大大实打实大苏打测试测试测大大实打实大苏打测试测试测大大实打实大苏打',
      },
    },
    data () {
      return {
        isVisible: false,
        hideTimeout: null,
      }
    },
    methods: {
      showCommentModal () {
        window.clearTimeout(this.hideTimeout)
        this.isVisible = true
      },
      hideCommentModal () {
        this.isVisible = false
      },
      CommentModalOut () {
        window.clearTimeout(this.hideTimeout)
        this.hideTimeout = setTimeout(() => {
          this.isVisible = false
        }, 200)
      },
    },
  }
</script>

<style lang="stylus" scoped>
.wrapper
  position relative
  display inline-block
.modal
  width 172px
  box-sizing border-box
  background #fff
  border-radius 2px
  box-shadow 0 0 0 0 rgba(0, 0, 0, .05), 0 2px 12px -1px rgba(0, 0, 0, .10)
  padding 5px 8px
  font-size 12px
  line-height 18px
  color #353535
  position absolute
  z-index 11
  bottom 35px
  left calc(50% -13px)
  transform translateX(calc(-50% + 13px))
.comment
  width 78px
  display inline-flex
  div
    width 100%
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
    &.has-comment
      color #353535
.fade-enter-active,
.fade-leave-active
  transition: opacity .5s
.fade-enter,
.fade-leave-to
  opacity: 0
</style>
