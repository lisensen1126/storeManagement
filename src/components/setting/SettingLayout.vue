<template lang="pug">
  div
    major-tab(moduleName="设置")
      router-link.tab-item(:to="{name: 'authorizations'}") 微信授权
      router-link.tab-item(:to="{name: 'dataOpenSetting'}") 数据开放设置
      router-link.tab-item(:to="{name: 'passWordSetting'}") 修改密码
    router-view
</template>

<script>
import { mapGetters } from 'vuex'
import MajorTab from '@/components/generics/MajorTab'

export default {
  name: 'settingLayout',
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
