<template lang="pug">
  .bg-box
    img.bg(:src="imgUrl")
</template>

<script>
  export default {
    name: 'HowUsed',
    components: {
    },
    props: {
    },
    data () {
      return {
        imgUrl: 'https://oss1.chedianai.com/mange/poster-used02.png',
      }
    },
    methods: {
    },
    mounted () {
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .bg-box
    height 100vh
    overflow auto
  .bg
    width 320px
</style>
