<template lang="pug">
  div
    major-tab(moduleName="基本信息维护")
      router-link.tab-item(:to="{name: 'basicInformationNav'}") 基本信息维护
      router-link.tab-item(:to="{name: 'pageSetting'}") 页面管理
      router-link.tab-item(:to="{name: 'organizationList'}") 组织管理
      router-link.tab-item(:to="{name: 'postList'}") 岗位管理
      router-link.tab-item(:to="{name: 'employeeList'}") 员工管理
    keep-alive(include="EmployeeList, BasicInformationNav")
      router-view
</template>

<script>
import {mapGetters} from 'vuex'
import MajorTab from '@/components/generics/MajorTab'

export default {
  name: 'basicInformationLayout',
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

