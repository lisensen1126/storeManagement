<template lang="pug">
  #app.sans
    loading(v-show="fetchLoading")
    //- 系统消息页面顶部强提醒
    MassageTip
    //  新的门店开通，信息完善提醒
    OpenStoreWarn()
    //- 公告内容页面右下角提醒
    MessageNotice
    router-view
    message-stack
    notification-stack
    //- announcer
</template>

<script>
import store from './vuex/store'
import filters from './filters'
import router from './router'
import MessageStack from './components/generics/MessageStack'
import NotificationStack from '@/components/generics/NotificationStack'
// import Announcer from '@/components/generics/Announcer'
import Loading from './components/generics/Loading'
import { mapGetters } from 'vuex'
import MassageTip from './components/generics/MessageTip'
import OpenStoreWarn from './components/openStore/modal/OpenStoreWarn'
import MessageNotice from './components/generics/MessageNotice'

export default {
  name: 'app',
  store,
  router,
  filters: filters,
  components: {
    MessageStack,
    NotificationStack,
    // Announcer,
    Loading,
    MassageTip,
    OpenStoreWarn,
    MessageNotice,
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      fetchLoading: 'fetchLoading',
      wxStatus: 'wxStatus',
    }),
  },
}
</script>
