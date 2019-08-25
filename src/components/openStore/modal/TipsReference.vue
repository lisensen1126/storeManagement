<!--常用银行账户位数参考-->
<template lang="pug">
  .look-pic
      img.close(src="../../../assets/openImage/open-image-close.png",@click="closeModal()")
      .pic-con
        img(:src="imgUrl")
</template>

<script>
  export default {
    name: 'accountReference',
    props: {
      imgUrl: String,
      required: true,
    },
    methods: {
      closeModal () {
        this.$emit('close')
      },
    },
    mounted () {
    },
  }
</script>

<style scoped lang="stylus">
  @import '~@/stylus/mixins'
  .look-pic
    position: fixed
    z-index: 9999
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: rgba(255,255,255,0.9)
    overflow: auto
    .close
      position: fixed
      width: 40px
      height: 40px
      right: 20px
      top: 12px
      text-align: center
      line-height: 40px
      color: #bbb
      cursor: pointer
      z-index: 99991
      .iconfont
        font-size: 40px
      &:hover
        color: #2976ea
    .pic-con
      display: flex
      margin: 40px auto
      position: relative
      max-width: 1010px
      min-height: calc(100vh - 80px)
      justify-content: center
      align-items: center
      img
        display block
</style>
