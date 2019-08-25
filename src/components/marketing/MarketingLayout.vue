<template lang="pug">
  div
    major-tab(moduleName="营销助手")
      router-link.tab-item(:to="{name: 'list'}", @click.native="deleGlobal") 优惠券
      router-link.tab-item(:to="{name: 'turnplateList'}", @click.native="deleGlobal") 转盘抽奖
      router-link.tab-item(:to="{name: 'tools'}", @click.native="deleGlobal") 营销配置
      router-link.tab-item(:to="{name: 'group'}", @click.native="deleGlobal") 拼团
      router-link.tab-item(:to="{name: 'spikeList'}", @click.native="deleGlobal") 秒杀
      router-link.tab-item(:to="{name: 'messageNav'}", @click.native="deleGlobal") 营销短信
      router-link.tab-item(:to="{name: 'pushList'}", @click.native="deleGlobal") 小程序推送
      <!--router-link.tab-item(:to="{name: 'marketingAllocation'}") 营销配置-->
    keep-alive
      router-view(v-if="$route.meta.keepAlive")
    router-view(v-if="!$route.meta.keepAlive")
</template>


<script>
import MajorTab from '@/components/generics/MajorTab'

export default {
  name: 'MarketingLayout',
  components: {
    MajorTab,
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
