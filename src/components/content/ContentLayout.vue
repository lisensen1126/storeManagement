<template lang="pug">
  div
    major-tab(moduleName="内容管理")
      router-link.tab-item(:to="{name: 'contentList'}",@click.native="deleGlobal") 活动内容
      router-link.tab-item(:to="{name: 'contentListBoss'}",@click.native="deleGlobal") 平台活动内容
    keep-alive
      router-view(v-if="$route.meta.keepAlive")
    router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  export default {
    name: 'contentLayout',
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

