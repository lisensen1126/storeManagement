<template lang="pug">
  .columns.is-horizontal(:class="{'height-35':is_show_open_store == 1 || is_show_tip == 1}")
    major-nav
    keep-alive
      router-view.column.manage-layout(v-if="$route.meta.keepAlive")
    router-view.column.manage-layout(v-if="!$route.meta.keepAlive")
</template>

<script>
import MajorNav from './generics/MajorNav'

export default {
  name: 'ManagementLayout',
  components: {
    MajorNav,
  },
  data () {
    return {
      is_show_open_store: 0, // 门店开通信息完善提醒展开，下面的高度需要修改
      is_show_tip: 0, // 门店活动提醒，下面的高度需要修改
    }
  },
  watch: {
    '$route.meta.module': function (newVal, oldVal) {
      // 监听路由，间接获取到门店开通信息完善提醒是否展开，然后动态修改高度
      this.is_show_open_store = sessionStorage.getItem('is_show_open_store')
      this.is_show_tip = sessionStorage.getItem('is_show_tip')
    },
  },
  mounted () {
    this.is_show_open_store = sessionStorage.getItem('is_show_open_store')
    this.is_show_tip = sessionStorage.getItem('is_show_tip')
  },
}
</script>

<style lang="stylus" scoped>
  .manage-layout
    overflow hidden
    background #f0f1f2
  .height-35
    height calc(100vh - 35px)
</style>
