<template lang="pug">
  div
    major-tab(moduleName="订单管理")
      router-link.tab-item(:to="{name: 'orderList'}") 订单管理
    keep-alive
      router-view(v-if="$route.meta.keepAlive")
    router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
import { mapGetters } from 'vuex'
import MajorTab from '@/components/generics/MajorTab'

export default {
  name: 'orderLayout',
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
.outlink-icon {
  display: inline-block;
  vertical-align: middle;
  margin-left: 3px;
  margin-top: -4px;
  width: 16px;
  height: 16px;
  background: center no-repeat url('~@/assets/menu/outlink.svg');
}
</style>

