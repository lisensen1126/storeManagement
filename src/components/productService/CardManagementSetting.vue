<template lang="pug">
  div.content
    service-tab.top-nav( v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changePage")
    router-view.view-content
</template>

<script>
  import ServiceTab from '@/components/generics/ServiceTab'
  import { mapGetters } from 'vuex'
  export default {
    name: 'cardManagementSetting',
    components: {
      ServiceTab,
    },
    data () {
      return {
        tabList: [
          {
            name: '管理卡片',
            type: 'cardManagementList',
            urlName: 'cardManagementList',
          },
          {
            name: '数据统计',
            type: 'statisticalList',
            urlName: 'statisticalList',
          },
        ],
        tab: {
          name: '管理卡片',
          type: 'cardManagementList',
          urlName: 'cardManagementList',
        },
        enterpriseName: '',
        enterpriseId: '',
      }
    },
    computed: {
      ...mapGetters({
        currentUser: 'currentUser',
      }),
    },
    methods: {
      changePage (params) {
        for (let key in this.$global) {
          delete this.$global[key]
        }
        this.$router.push({
          name: params.urlName,
          query: {
            name: params.name,
            type: params.type,
            urlName: params.urlName,
          },
        })
      },
    },
    watch: {
      '$route' () {
        let tabs = this.$route.query
        if (tabs.urlName) {
          this.tab = tabs
        } else {
          this.changePage(this.tabList[0])
        }
      },
    },
    mounted () {
      for (let key in this.$global) {
        delete this.$global[key]
      }
      let tabs = this.$route.query
      if (tabs.urlName) {
        this.tab = tabs
      } else {
        this.changePage(this.tabList[0])
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


