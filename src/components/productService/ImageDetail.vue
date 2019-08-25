<template lang="pug">
  .slide-layout
    img(v-for="item in currentImageArray",:src="item")
</template>

<script>

export default {
  name: 'ImageDetail',
  props: {
    currentImageArray: {
      type: Array,
    },
  },
  data () {
    return {
      detail: {},
      modalShow: false,
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

.slide-layout
  padding 0
  img
    display block
    width 100%
</style>

