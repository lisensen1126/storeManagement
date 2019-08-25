<template lang="pug">
  div
    major-tab(moduleName="应用管理")
      router-link.tab-item(:to="{name: 'allApp'}") 全部应用
    keep-alive
      router-view(v-if="this.$route.meta.keepAlive")
    router-view(v-if="!this.$route.meta.keepAlive")
</template>

<script>
  import {mapGetters} from 'vuex'
  import MajorTab from '@/components/generics/MajorTab'

  export default {
    name: 'appCenterLayout',
    components: {
      MajorTab,
    },
    computed: {
      ...mapGetters({
        currentEnterprise: 'currentEnterprise',
      }),
    },
  }
</script>

<style lang="stylus" scoped>
  .outlink-icon
    display inline-block
    vertical-align middle
    margin-left 3px
    margin-top -4px
    width 16px
    height 16px
    background center no-repeat url('~@/assets/menu/outlink.svg')
</style>
