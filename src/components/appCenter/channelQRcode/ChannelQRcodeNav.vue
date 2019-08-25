<template lang="pug">
  div.content
    service-tab.top-nav( v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changeTab")
    Channel-list(v-if="tab.type === 'channelQRcodeList'")
    Channel-Statistics(v-if="tab.type === 'channelQRcodeStatistics'")
</template>

<script>
  import ServiceTab from '@/components/generics/ServiceTab'
  import ChannelList from '@/components/appCenter/channelQRcode/ChannelQRcodeList'
  import ChannelStatistics from '@/components/appCenter/channelQRcode/ChannelQRcodeStatistics'
  // import ChannelEdit from '@/components/appCenter/ChannelQRcodeEdit'
  export default {
    name: 'ChannelQRcodeNav',
    components: {
      ServiceTab,
      ChannelList,
      ChannelStatistics,
    },
    data () {
      return {
        tabList: [{
          name: '二维码列表',
          type: 'channelQRcodeList',
        }, {
          name: '数据统计',
          type: 'channelQRcodeStatistics',
        }],
        tab: {
          name: '二维码列表',
          type: 'channelQRcodeList',
        },
        enterpriseName: '',
        enterpriseId: '',
      }
    },
    methods: {
      // 切换顶部tab
      changeTab (params) {
        this.tab = params
      },
    },
    // watch: {
    //   '$route' () {
    //     let tabs = this.$route.query
    //     if (tabs.urlName) {
    //       this.tab = tabs
    //     } else {
    //       this.changePage(this.tabList[0])
    //     }
    //   },
    // },
    mounted () {
      // this.changeTab(this.tabList[0])
    },
    // 导航守卫
    beforeRouteEnter (to, from, next) {
      /**
       * 判断是否属于同级页面
       * (由切换tab进入)
       */
      to.meta.isOutside = false
      if (!from.meta.isSlibing) {
        to.meta.isOutside = true
      }
      /**
       * 是添加 且 不是返回(保存)
       * @save: 1(返回)
       */
      // if ((from.name === 'authorityMgr' && to.query.save !== 1)) {
      //   to.meta.isPreserve = true
      // }
      next()
    },
    activated () {
      console.log('activated')
      if (this.$route.meta.isOutside) {
        this.changeTab(this.tabList[0])
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
  .content
    height calc(100% - 56px)
  .top-nav
    display: flex;
    flex: 0 0 48px;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 48px;
    padding-left: 64px;
    padding-right: 64px;
    background-color: #fcfcfc;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,.08);
    z-index: 8;
</style>
