<template lang="pug">
  .section-layout
    agreement
    .reserve-operation-wrapper
      write-off-all(@success='refreshList', :string="'请输入核销码'" ref="reservation")
    .content
      service-tab.top-nav(v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changePage")
      router-view.view-content(:key="activeDate")
</template>

<script>
import WriteOffAll from './WriteOffAll'
import Api from '@/mixins/modules/workbench'
import ServiceTab from '@/components/generics/ServiceTab'
import Agreement from '@/components/generics/agreementModel'
export default {
  name: 'WriteOffAllList',
  mixins: [Api],
  components: {
    WriteOffAll,
    ServiceTab,
    Agreement,
  },
  data () {
    return {
      tabList: [
        {
          name: '订单核销',
          type: 'writeOffRecord',
          urlName: 'writeOffRecord',
        },
        {
          name: '卡核销',
          type: 'record-card',
          urlName: 'record-card',
        },
        {
          name: '优惠券核销',
          type: 'record-coupon',
          urlName: 'record-coupon',
        },
      ],
      tab: {
        name: '订单核销',
        type: 'bannersPage',
        urlName: 'bannersPage',
      },
      activeDate: 1,
    }
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
    refreshList (data) {
      let _this = this
      switch (data.type) {
        case 1:
          _this.tab = _this.tabList[0]
          break
        case 2:
          _this.tab = _this.tabList[2]
          break
        case 3:
          _this.tab = _this.tabList[1]
          break
        default:
          _this.tab = _this.tabList[0]
          break
      }
      this.activeDate = new Date().getTime()
    },
  },
  mounted () {
    this.activeDate = new Date().getTime()
    let tabs = this.$route.query
    if (tabs.urlName) {
      this.tab = tabs
    } else {
      this.changePage(this.tabList[0])
    }
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
    'activeDate' () {
      this.$router.push({
        name: this.tab.urlName,
        query: {
          name: this.tab.name,
          type: this.tab.type,
          urlName: this.tab.urlName,
        },
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp';
.content
  height calc(100% - 72px) !important
.reserve-operation-wrapper {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
  background-color: #fff;
}

.bottom-image {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;

  img {
    height: 100%;
    width: 100%;
  }
}

.m-r-5 {
  margin-right: 5px;
}
.view-content{
  height calc(100% - 76px) !important
  overflow-y auto 
}
</style>
