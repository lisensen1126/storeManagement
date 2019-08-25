<template lang="pug">
  div
    major-tab(moduleName="统计管理")
      router-link.tab-item(:to="{name: 'incomeSummary'}") 财务管理
      router-link.tab-item(:to="{name: 'orderSplitList'}") 订单分账
    router-view
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  export default {
    name: 'reportFormLayout',
    components: {
      MajorTab,
    },
  }
</script>
