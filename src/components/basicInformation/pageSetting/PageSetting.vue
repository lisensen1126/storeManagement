<template lang="pug">
  div.content
    service-tab.top-nav( v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changePage")
    router-view.view-content
</template>

<script>
  import ServiceTab from '@/components/generics/ServiceTab'
  import { mapGetters } from 'vuex'
  export default {
    name: 'pageSetting',
    components: {
      ServiceTab,
    },
    data () {
      return {
        tabList: [
          {
            name: '轮播图',
            type: 'bannersPage',
            urlName: 'bannersPage',
          },
          {
            name: '爆品推荐',
            type: 'hotBannerPage',
            urlName: 'hotBannersPage',
          },
          // {
          //   name: '超级品牌日',
          //   type: 'superBannersPage',
          //   urlName: 'superBannersPage',
          // },
          {
            name: '品牌专区',
            type: 'brandArea',
            urlName: 'brandArea',
          },
        ],
        tab: {
          name: '轮播图',
          type: 'bannersPage',
          urlName: 'bannersPage',
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
      let tabs = this.$route.query
      if (tabs.urlName) {
        this.tab = tabs
      } else {
        this.changePage(this.tabList[0])
      }
      // C版小程序隐藏爆品推荐，并将超级品牌日改成本店内容，先删后改；mini_type=1：B版（综合版），2：C版（保养版），3：定制版
      if (parseInt(this.currentUser.store.mini_type) === 2) {
        this.tabList.splice(1, 1)
        this.tabList[1].name = '本店活动'
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


