<template lang="pug">
  div
    major-tab(moduleName="工作台")
      router-link.tab-item(:to="{name: 'writeOffAllList'}") 核销记录
      router-link.tab-item(:to="{name: 'workbenchOverview'}") 预约
      //- router-link.tab-item(:to="{name: 'cardManagementOffRecord'}") 卡核销
      //- router-link.tab-item(:to="{name: 'CardOffRecord'}") 优惠券核销
      //- router-link.tab-item(:to="{name: 'groupPurshareRecord'}") 新美大团单核销
      router-link.tab-item(:to="{name: 'JoinPlatform'}") 加入平台
    keep-alive
      router-view(v-if="$route.meta.keepAlive")
    router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
import {mapGetters} from 'vuex'
import MajorTab from '@/components/generics/MajorTab'

export default {
  name: 'WorkBenchLayout',
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

