<template lang="pug">
  div.content
    service-tab.top-nav( v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changePage")
    router-view.view-content
</template>

<script>
  import ServiceTab from '@/components/generics/ServiceTab'
  export default {
    name: 'SpikeNav',
    components: {
      ServiceTab,
    },
    data () {
      return {
        spike_type: this.$route.query.spike_type,
        id: this.$route.query.id,
        tabList: [{
          name: '秒杀详情',
          type: 'spikeDetail',
          urlName: 'spikeDetail',
        }, {
          name: '交易记录',
          type: 'spikeTrade',
          urlName: 'spikeTrade',
        }],
        tab: {
          name: '秒杀详情',
          type: 'spikeDetail',
          urlName: 'spikeDetail',
        },
      }
    },
    methods: {
      changePage (params) {
        let _this = this
        this.$router.push({
          name: params.urlName,
          query: {
            name: params.name,
            type: params.type,
            urlName: params.urlName,
            id: _this.id,
            spike_type: _this.spike_type,
            spike_id: _this.$route.query.spike_id,
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
          this.$router.push({
            name: 'spikeList',
          })
        }
      },
    },
    mounted () {
      if (this.$route.query.spike_type > 2) {
        this.tabList = [{
          name: '秒杀详情',
          type: 'spikeCardDetail',
          urlName: 'spikeCardDetail',
        }, {
          name: '交易记录',
          type: 'spikeTrade',
          urlName: 'spikeTrade',
        }]
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
