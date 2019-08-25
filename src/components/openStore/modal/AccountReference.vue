<!--常用银行账户位数参考-->
<template lang="pug">
  .box
    .content
      img.img(:src="imgUrl",@click="closeModal")
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
  .box
    width 100%
    height 100%
    position fixed
    top 0
    left 0
    background-color rgba(0,0,0,.5)
    z-index 999
    display: flex;
    align-items: center;
    .content
      width 600px
      height 90%
      background-color #ffffff
      margin auto
      padding 0 30px
  .img
    width 100%
    height 100%
</style>
