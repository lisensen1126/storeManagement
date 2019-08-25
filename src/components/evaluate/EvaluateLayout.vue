<template lang="pug">
  div
    major-tab(moduleName="业务功能")
      router-link.tab-item(:to="{name: 'storeEvaluate'}",  @click.native="deleGlobal") 门店评价
      router-link.tab-item(:to="{name: 'VehicleNav'}",  @click.native="deleGlobal") 车检设置
      router-link.tab-item(:to="{name: 'intelligentMaintenance'}",  @click.native="deleGlobal") 智能保养
      //- router-link.tab-item(:to="{name: 'serviceEvaluate'}") 服务评价
      //- router-link.tab-item(:to="{name: 'productEvaluate'}") 商品评价
    router-view
</template>

<script>
import {mapGetters} from 'vuex'
import MajorTab from '@/components/generics/MajorTab'

export default {
  name: 'evaluateLayout',
  components: {
    MajorTab,
  },
  computed: {
    ...mapGetters({
      currentEnterprise: 'currentEnterprise',
    }),
  },
  methods: {
    deleGlobal () {
      for (let key in this.$global) {
        delete this.$global[key]
      }
    },
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

