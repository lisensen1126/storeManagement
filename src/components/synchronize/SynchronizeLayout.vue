<template lang="pug">
  div
    major-tab(moduleName="同步管理")
      router-link.tab-item(:to="{name: 'syncEmployeeList'}",@click.native="deleGlobal") 员工信息同步
      router-link.tab-item(:to="{name: 'cvpSync'}",@click.native="deleGlobal") CVP功能同步
    router-view
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  export default {
    name: 'synchronizeLayout',
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

