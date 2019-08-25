<template lang="pug">
  div
    major-tab(moduleName="商品服务管理")
      router-link.tab-item(:to="{name: 'productLibrary'}", @click.native="deleGlobal") 公共商品库
      router-link.tab-item(:to="{name: 'serviceLibrary'}",  @click.native="deleGlobal") 公共服务库
      router-link.tab-item(:to="{name: 'productList'}",  @click.native="deleGlobal") 门店商品管理
      router-link.tab-item(:to="{name: 'serviceList'}",  @click.native="deleGlobal") 门店服务管理
      router-link.tab-item(:to="{name: 'cardManagementSetting'}",  @click.native="deleGlobal") 养护卡管理
    keep-alive
      router-view(v-if="this.$route.meta.keepAlive")
    router-view(v-if="!this.$route.meta.keepAlive")
</template>

<script>
import {mapGetters} from 'vuex'
import MajorTab from '@/components/generics/MajorTab'

export default {
  name: 'productService',
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

