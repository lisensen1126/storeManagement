<template lang="pug">
  .section-layout
    .content-wrapper.paddingb0
      service-tab.top-nav(v-model="currt_type", :tabs="pay_type", :have-icon="false", :have-quantity="false", class="status-list", @input="changeTab($event)")
      .flex-between 
        .field-group.is-horizontal.section-filter        
          .field
            label.label 起止时间
            .field.is-horizontal
              date-picker.w-160(type="single", placeholder="选择开始时间", v-model="searchData.start_time")
              span.margin 至
              date-picker.w-160(type="single", placeholder="选择结束时间", v-model="searchData.end_time")
          .field.is-narrowr.w-160
            label.label 收款码类型
            custom-select(v-model="searchData.code_classification", :list="code_classification", nameField="name")       
          .field.is-narrowr.w-160
            label.label 所属门店
            custom-select(v-model="searchData.store_classification", :list="store_list_modify", nameField="store_name")
          .field
            a.button.primary(@click="search") 搜索
          .field
            a.button(@click="reset") 重置
        .month-day
          .md-item(:class="{'active-md-item':time_type===1}", @click="changeMD(1)")  今日
          .md-item(:class="{'active-md-item':time_type===2}", @click="changeMD(2)")  本月
      .statistic-form
        .data-box
          .type-name  应付金额汇总
          .type-value  ￥{{statisticData.total_amount_sum/100 | fix2}}
        .data-box
          .type-name  优惠金额汇总
          .type-value  ￥{{statisticData.preferential_sum/100 | fix2}}
        .data-box
          .type-name  实付金额汇总
          .type-value  ￥{{statisticData.final_amount_sum/100 | fix2}}
        .data-box
          .type-name
            span  手续费金额汇总
            el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'该交易手续费统计数据来源于微信支付或美团支付产生的交易手续费，由微信支付或美团支付收取。'")
              .el-icon-question(slot="reference")
          .type-value  ￥{{statisticData.rate_price_sum/100 | fix2}}
        .data-box
          .type-name  付款订单汇总
          .type-value  {{statisticData.count}}
        .data-box
          .type-name  付款人数汇总
           el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'汇总线下买单付款用户数，同一用户多次付款，只统计一次。'")
              .el-icon-question(slot="reference")
          .type-value  {{statisticData.customer_count}}      
      .content-wrapper.list-wrapper.margin0(v-if="statisticList.length>0")
        .table-wrapper
          table.table
            thead
              tr
                td(width="12%") 收款码类型
                td(width="12%") 所属门店
                td(width="12%") 订单应付金额
                td(width="12%") 优惠金额
                td(width="12%") 实付金额
                td(width="12%") 交易手续费
                td(width="12%") 付款订单数
                td(width="12%") 付款人数
            tbody
              tr(v-for="item in statisticList")
                td.simple-td  
                  span(v-show="item.order_type===6") 门店收款码
                  span(v-show="item.order_type===7") 开单收款码
                td.simple-td  {{item.store_name}}
                td.simple-td  ￥ {{item.total_amount_sum/100 | fix2}}
                td.simple-td  ￥ {{item.preferential_sum/100 | fix2}}
                td.simple-td  ￥ {{item.final_amount_sum/100 | fix2}}
                td.simple-td  ￥ {{item.rate_price_sum/100 | fix2}}
                td.simple-td  {{item.count}}
                td.simple-td  {{item.customer_count}}
    .empty-page-wrapper(v-if="statisticList.length===0 && has_load")
        empty-page(tip="暂无收款统计")            
</template>

<script>
import ServiceTab from '@/components/generics/ServiceTab'
import Tab from '@/components/appCenter/model/PublicTabs'
import DatePicker from '@/components/generics/form/DatePicker'
import CustomInput from '@/components/generics/form/CustomInput'
import EmptyPage from '@/components/generics/EmptyPage'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Api from '@/mixins/modules/AppCenter'
export default {
  name: 'DataStatistics',
  mixins: [Tab, Api],
  components: {
    ServiceTab,
    DatePicker,
    CustomInput,
    CustomSelect,
    EmptyPage,
  },
  data () {
    return {
      currt_type: { name: '收款记录', type: 5 },
      is_click: null,
      isInitiated: true,
      time_type: 1,
      searchData: {
        // 搜索数据（暂存）
        start_time: '',
        end_time: '',
        code_classification: {},
        store_classification: {},
      },
      query: {}, // 搜索数据（最终）
      code_classification: [
        // 收款码类型列表
        {
          name: '全部',
          value: 0,
        },
        {
          name: '门店收款码',
          value: 6,
        },
        {
          name: '开单收款码',
          value: 7,
        },
      ],
      statisticData: {}, // 统计数据汇总
      statisticList: [], // 统计数据列表
      has_load: false, // 是否已载入数据
      store_list_modify: [],    // 修饰过的门店列表
    }
  },
  mounted () {
    this.is_click = 4
    this.currt_type = { name: '收款统计', type: 4 }
    this.getStoreList()
    this.search()
  },
  methods: {
    reset () {
      this.searchData = {
        start_time: '',
        end_time: '',
        code_classification: {},
        store_classification: {},
      }
      this.time_type = 1
      // this.formatData()
      this.search()
    },
    // 获取门店列表
    async getStoreList () {
      try {
        const {result, response} = await this.getLinkStoreListAPi()
        if (response.status === 200 && result.code === 0) {
          this.store_list = result.data
          this.store_list_modify = [...[{store_name: '全部', store_id: 0}], ...this.store_list]
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店列表失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取门店列表失败',
          content: `服务异常，请稍后再试（${
            err.response ? err.response.status : err
          }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 改变本月和本日
    changeMD (type) {
      if (this.time_type !== type && this.time_type !== 3) {
        this.time_type = type
        this.searchData = {
          start_time: '',
          end_time: '',
          code_classification: {},
          store_classification: {},
        }
        // this.getStatistic()
        this.search()
      }
    },
    search () {
      this.formatData()
      let query = this.query
      if (
        query.start_time &&
        query.end_time &&
        Number(query.start_time) > Number(query.end_time)
      ) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '温馨提示',
          content: '开始时间不能大于结束时间',
        })
        return
      }
      if (query.start_time || query.end_time) {
        this.time_type = 3
      } else if (this.time_type === 3) {
        this.time_type = 1
      }
      this.getStatistic()
    },
    // 格式化搜索数据
    formatData () {
      let data = {
        start_time:
          new Date(this.searchData.start_time + ' 00:00:00').getTime() / 1000,
        end_time:
          new Date(this.searchData.end_time + ' 23:59:59').getTime() / 1000,
        order_type: this.searchData.code_classification.value,
        store_id: this.searchData.store_classification.store_id,
        date_type: this.time_type <= 2 ? this.time_type : '',
        hide_loading: false,
      }
      let query = {}
      Object.keys(data).forEach(item => {
        if (data[item]) {
          query[item] = data[item]
        }
      })
      console.log(query)
      this.query = query
    },
    async getStatistic () {
      try {
        const { result, response } = await this.gatherStatisticsApi(this.query)
        if (response.status === 200 && result.code === 0) {
          this.statisticData = result.data.all
          this.statisticList = result.data.group
          this.has_load = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取收款统计失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '设置失败！',
          content: `服务异常，请稍后再试（${
            err.response ? err.response.status : err
          }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
  filters: {
    fix2 (val) {
      if (!val) {
        return '0.00'
      } else {
        return val.toFixed(2)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';

.section-layout >>>.status-list ul {
  justify-content: left;
  padding-left: 20px;
  background-color: #ffffff;
}

.section-filter {
  height: auto;
  padding: 14px 32px 20px;
}

.margin0 {
  margin: 0;
  background: #f0f1f2;
  padding-bottom: 5px;
}

.paddingb0 {
  padding-bottom: 0;
}

.statistic-form {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 25px 0;

  .data-box {
    text-align: center;

    .type-name {
      font-size: 16px;
      color: #999;
    }

    .type-value {
      color: #404040;
      font-size: 30px;
      font-weight: 500;
      margin-top: 15px;
    }
  }
}

.w-160 {
  width: 160px;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e8e9eb;
}

.month-day {
  margin: 14px 15px 0 0;
  display: flex;
  justify-content: center;

  .md-item {
    background: #d9d9d9;
    width: 80px;
    line-height: 28px;
    border-radius: 3px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    color: #9a9b9a;
  }

  .active-md-item {
    color: #121212;
    background: #fff;
  }
}
.content-wrapper{
  padding-bottom: 0 !important;
}
</style>
