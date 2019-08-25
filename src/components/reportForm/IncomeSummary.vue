<template lang="pug">
  .section-layout
    service-tab.top-nav(v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changePage")
    .section-filter
      .field-group.is-horizontal
        .field(v-if="parseInt(default_value)===2")
          label.label 关键字
          custom-input.fl.w-160(placeholder="请输入订单编号/手机号", type="text",need-type='number', v-model="filterData.keywords",@keyupEnter="search")
        .field
          label.label 起止时间
          .field.is-horizontal
            date-picker.w-160(type="single", placeholder="选择开始时间", v-model="filterData.start_time")
            span.margin 至
            date-picker.w-160(type="single", placeholder="选择结束时间", v-model="filterData.end_time")
        .field.is-narrow(v-if="parseInt(default_value)===2")
          label.label 订单分类
          custom-select(v-model="filterData.classification", :list="goods_classification", nameField="name")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset") 重置
        .field.fr(v-if="parseInt(default_value)===2")
          a.button.fr(@click="exportExcel") 导出
      .time(v-if="parseInt(default_value)===1")
        div.day(:class="[date_type===1? 'active' : '']", @click="changeTime(1)") 今日
        div.month(:class="[date_type===2? 'active' : '']", @click="changeTime(2)") 本月
    empty-page(v-if="list.length === 0 && isInitiated && parseInt(default_value)!==1", :tip="'暂无数据'")
    //- 收入汇总
    .content-wrapper.revenue(v-if="parseInt(default_value)===1")
      //- 商品总额
      div
        div.income
          div.statistics
            div 商品总额
            div(v-if="goods_statistical_data.sum") ￥{{goods_statistical_data.sum.total_amount}}
          div.statistics
            div 实收金额
            div(v-if="goods_statistical_data.sum") ￥{{goods_statistical_data.sum.final_amount}}
          div.statistics
            div 订单数量
            div(v-if="goods_statistical_data.sum") {{goods_statistical_data.sum.count}}
      div.order-statistics
        div
          ul.order-income
            li 订单类型
            li 商品总额
            li 实收金额
            li
        div(v-for="item in goods_statistical_data.goods_type_list")
          ul.order-income-content          
            li(v-if="item.type===1")
              span  商品服务订单
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'包含直接下单、拼团、秒杀、智能保养+工时、平台小程序下单'")
                .el-icon-question(slot="reference")
            li(v-if="item.type===2")
              span 养护卡订单
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'包含直接下单、拼团、秒杀下单'")
                .el-icon-question(slot="reference")
            li(v-if="item.type === 3")
              span 线下买单订单
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'包含门店收款码和开单收款码付款订单'")
                .el-icon-question(slot="reference")
            li ￥{{item.total_amount}}
            li ￥{{item.final_amount}}
            li
              a(class="cursor: pointer;color: #2fabdd", @click="seeDetailed(item.type)") 查看明细
      //- 营销总额  
      div
        div.income
          div.statistics
            div 营销商品总额
            div(v-if="order_statistical_data.sum") ￥{{order_statistical_data.sum.total_amount}}
          div.statistics
            div 营销实收金额
            div(v-if="order_statistical_data.sum") ￥{{order_statistical_data.sum.final_amount}}
          div.statistics
            div 营销订单数量
            div(v-if="order_statistical_data.sum") {{order_statistical_data.sum.count}}
      div.order-statistics
        div
          ul.order-income
            li 营销订单类型
            li 商品总额
            li 实收金额
            //- li
        div(v-for="item in order_statistical_data.order_type_list")
          ul.order-income-content          
            li(v-if="item.order_type===3") 
              span  拼团订单
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'包含商品、服务、养护卡的拼团订单'")
                .el-icon-question(slot="reference")
            li(v-if="item.order_type===4")
              span  秒杀订单
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'包含商品、服务、养护卡的秒杀订单'")
                .el-icon-question(slot="reference")
            li(v-if="item.order_type===2") 
              span  智能保养订单
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'包含商品+工时'")
                .el-icon-question(slot="reference")
            li ￥{{item.total_amount}}
            li ￥{{item.final_amount}}
            //- li
            //-   a(class="cursor: pointer;color: #2fabdd", @click="seeDetailed()") 查看明细
    //- 流水明细
    .content-wrapper.list-wrapper(v-if="list.length && list.length > 0 && parseInt(default_value)===2")
      .table-wrapper
        table.table
          thead
            tr
              td(width="16%") 订单时间
              td(width="9%") 订单编号
              td(width="18%") 订单项目
              td(width="9%") 金额
              td(width="9%") 订单分类
              td(width="15%") 客户信息
              td(width="12%") 门店名称
              td(width="10%") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .multi-content-td.textzh {{item.turnover_time}}
              td
                .multi-content-td.textzh {{item.trade_order_no}}
              td
                .multi-content-td.textzh {{item.trade_order_item.length>11?(item.trade_order_item).slice(0, 11)+'...':item.trade_order_item}}
              td
                .simple-td(v-if="item.type===1") +￥{{item.amount}}
                .simple-td(v-if="item.type===2") -￥{{item.amount}}
              td
                .simple-td(v-if="item.goods_type === 1 && item.order_type <= 4") 商品服务订单
                .simple-td(v-if="item.goods_type === 2 && item.order_type <= 4") 养护卡订单
                .simple-td(v-if="item.order_type === 7 || item.order_type === 6") 线下买单订单
              td
                .simple-td {{item.nick_name}}/{{item.mobile}}
              td
                .multi-content-td.textzh {{item.store_name}}
              td
                .operation-td
                 a.operation-link.left(@click="goGoodsDetail(item)") 订单详情
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import ServiceTab from '@/components/generics/ServiceTab'
import CustomInput from '@/components/generics/form/CustomInput'
import Pagination from '@/components/generics/Pagination'
import EmptyPage from '@/components/generics/EmptyPage'
import CustomSelect from '@/components/generics/form/CustomSelect'
import DatePicker from '@/components/generics/form/DatePicker'
import drawApi from '@/mixins/modules/draw'
import reportFormApi from '@/mixins/modules/reportForm'
import {root} from '@/plugins/Fetch'
import FormateDate from '@/mixins/utilities/formateDate'
export default {
  name: 'PageSetting',
  mixins: [drawApi, reportFormApi, FormateDate],
  components: {
    ServiceTab,
    CustomInput,
    Pagination,
    EmptyPage,
    CustomSelect,
    DatePicker,
  },
  data () {
    return {
      root,
      date_type: 1, // 本月-今日
      default_value: '1',  // 页面tab初始值
      isInitiated: false,    // 页面初始状态
      tabList: [
        {
          name: '收入汇总',
          type: '1',
        },
        {
          name: '流水明细',
          type: '2',
        },
      ],
      tab: {               // 默认选中tab
        name: '收入汇总',
        type: '1',
      },
      order_classification: [ // 订单分类
        {name: '全部', value: '0'},
        {name: '普通订单', value: '1'},
        {name: '智能保养', value: '2'},
        {name: '拼团订单', value: '3'},
        {name: '秒杀订单', value: '4'},
        {name: '养护卡', value: '5'},
      ],
      goods_classification: [   // 订单分类 v3.8.5修改
        {name: '全部', value: '0'},
        {name: '商品服务订单', value: '1'},
        {name: '养护卡订单', value: '2'},
        {name: '线下买单订单', value: '3'},
      ],
      classify_list: [
        {
          type: '普通订单',
          order_money: 300,
          order_pay: 200,
        },
        {
          type: '拼团订单',
          order_money: 300,
          order_pay: 200,
        },
        {
          type: '秒杀订单',
          order_money: 300,
          order_pay: 200,
        },
        {
          type: '普通订单',
          order_money: 300,
          order_pay: 200,
        },
      ], // 订单分类统计数据
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 2,
        total: 0,
      },
      is_true: true, // 开始是否大于结束
      list: [],
      sendData: {},
      filterData: {
        keywords: '', // 门店名称搜索字段
        start_time: '',
        end_time: '',
        classification: {
          value: '',
          name: '',
        }, // 订单分类搜索字段
      },
      goods_statistical_data: {}, // 商品总额收入汇总的数据
      order_statistical_data: {}, // 营销商品总额收入汇总的数据
    }
  },
  watch: {
    'filterData.start_time': function (newVal, oldVal) {
      let start = 0
      let end = 0
      if (newVal === '') {
        newVal = 0
      } else {
        start = this.filterData.start_time.replace(/-/g, '') - 0
        this.filterData.end_time === '' ? end = 0 : end = this.filterData.end_time.replace(/-/g, '') - 0
      }
      (start - end > 0 && end !== 0) ? this.is_true = false : this.is_true = true
    },
    'filterData.end_time': function (newVal, oldVal) {
      let start = 0
      let end = 0
      if (newVal === '') {
        newVal = 0
      } else {
        this.filterData.start_time === '' ? start = 0 : start = this.filterData.start_time.replace(/-/g, '') - 0
        end = this.filterData.end_time.replace(/-/g, '') - 0
      }
      (start - end > 0 && start !== 0) ? this.is_true = false : this.is_true = true
    },
    default_value (val) {
      this.tab = this.tabList[val - 1]
    },
  },
  methods: {
    // 今日或搜索
    changeTime (type) {
      if (this.date_type === type || this.date_type === 3) {
        return
      }
      if (type === 1) {
        this.date_type = 1
      } else {
        this.date_type = 2
      }
      this.getIncomeSummary()
    },
    // 搜索
    search () {
      this.dataFilter()
      if (!this.is_true && this.filterData.end_time !== '') {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'failure',
          title: '开始时间不能大于结束时间',
          resolve: () => this.$emit('failure'),
        })
        return false
      }
      this.paginationData.current_page = 1
      if (parseInt(this.default_value) === 1) {
        this.getIncomeSummary()
      } else if (parseInt(this.default_value) === 2) {
        this.fetchList()
      }
    },
    // 重置所有参数
    reset () {
      this.date_type = 1
      this.filterData = {
        keywords: '', // 门店名称搜索字段
        start_time: '',
        end_time: '',
        classification: {
          value: '',
          name: '',
        }, // 订单分类搜索字段
      }
      if (parseInt(this.default_value) === 1) {
        this.getIncomeSummary()
      } else {
        this.fetchList()
      }
    },
    // 分页操作
    paging (state) {
      this.paginationData = state
      this.fetchList()
    },
    // 查看明细
    seeDetailed (orderType) {
      this.tab = {               // 默认选中tab
        name: '流水明细',
        type: orderType,
      }
      this.default_value = '2'
      if (this.filterData.start_time === '' && this.filterData.end_time === '') {
        if (parseInt(this.date_type) === 1) {
          let day = parseInt(new Date().getTime() / 1000)
          this.filterData.start_time = this.formateDate(day, false, 2)
          this.filterData.end_time = this.filterData.start_time
        } else if (parseInt(this.date_type) === 2) {
          let day = new Date()
          day.setDate(1)
          let start = parseInt(new Date(day.setDate(1)).getTime() / 1000)
          let end = parseInt(new Date().getTime() / 1000)
          this.filterData.start_time = this.formateDate(start, false, 2)
          this.filterData.end_time = this.formateDate(end, false, 2)
        }
      } else {
        this.filterData.start_time = this.filterData.start_time
        this.filterData.end_time = this.filterData.end_time
      }
      this.filterData.classification.value = orderType
      let type = ''
      switch (this.filterData.classification && parseInt(this.filterData.classification.value)) {
        case 0: type = '全部'; break
        case 1: type = '商品服务订单'; break
        case 2: type = '养护卡订单'; break
        case 3: type = '线下买单订单'; break
      }
      this.filterData.classification.name = type
      this.filterData.classification.value = orderType
      this.fetchList()
    },
    // 去订单详情
    goGoodsDetail (params) {
      this.$global.paginationData = this.paginationData
      this.$global.tab = this.tab
      this.$global.filterData = this.filterData
      // 记录列表页数
      this.$store.dispatch('setCurrentPageStorage', this.paginationData.current_page)
      this.$router.push({
        name: 'orderDetail',
        params: {
          id: params.trade_order_id,
        },
      })
    },
    // tab切换
    changePage (params) {
      if (params.type === this.default_value) return   // 已是选中状态不再请求接口
      this.default_value = params.type
      this.reset()
    },
    // 数据格式格式化
    dataFilter () {
      this.sendData = {}
      if (parseInt(this.default_value) !== 1) {
        this.sendData.start_time = this.filterData.start_time ? parseInt(new Date(this.filterData.start_time + ' 00:00').getTime() / 1000) : ''
        this.sendData.end_time = this.filterData.end_time ? parseInt(new Date(this.filterData.end_time + ' 23:59:59').getTime() / 1000) : ''
      }
      if (parseInt(this.default_value) === 1) {
        if (this.filterData.start_time || this.filterData.end_time) {
          this.date_type = 3
          this.sendData.start_time = this.filterData.start_time ? parseInt(new Date(this.filterData.start_time + ' 00:00').getTime() / 1000) : ''
          this.sendData.end_time = this.filterData.end_time ? parseInt(new Date(this.filterData.end_time + ' 23:59:59').getTime() / 1000) : ''
        } else {
          if (parseInt(this.date_type) === 1 || parseInt(this.date_type) === 2) {
            this.sendData.date_type = this.date_type
          } else if (parseInt(this.date_type) === 3) {
            this.sendData.date_type = 1
            this.date_type = 1
          }
        }
      } else if (parseInt(this.default_value) === 2) {
        let type = 0
        this.sendData.page = this.paginationData.current_page
        this.sendData.per_page = this.paginationData.per_page
        this.sendData.keyword = this.filterData.keywords
        switch (this.filterData.classification && parseInt(this.filterData.classification.value)) {
          case 0: type = 0; break
          case 1: type = 1; break
          case 2: type = 2; break
          case 3: type = 3; break
        }
        this.sendData.type = type
      }
    },

    // 导出按钮点击
    exportExcel () {
      this.dataFilter()
      let url = `${root}/order/turnover_export?start_time=${this.sendData.start_time}&end_time=${this.sendData.end_time}&page=1&keyword=${this.sendData.keyword}&type=${this.sendData.type}`
      console.log(url)
      window.open(url)
    },
    // 获取收入汇总
    async getIncomeSummary () {
      this.dataFilter()
      try {
        const {response, result} = await this.IncomeSummaryApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          // 格式订单金额
          result.data.goods.sum.total_amount = (result.data.goods.sum.total_amount / 100).toFixed(2)
          result.data.order.sum.total_amount = (result.data.order.sum.total_amount / 100).toFixed(2)
          // 格式实收金额
          result.data.goods.sum.final_amount = (result.data.goods.sum.final_amount / 100).toFixed(2)
          result.data.order.sum.final_amount = (result.data.order.sum.final_amount / 100).toFixed(2)
          // 商品总额列表格式化金额
          result.data.goods.goods_type_list.forEach(function (e) {
            // 格式订单金额
            e.total_amount = (e.total_amount / 100).toFixed(2)
            // 格式实收金额
            e.final_amount = (e.final_amount / 100).toFixed(2)
          })
          // 营销商品总额列表格式化金额
          result.data.order.order_type_list.forEach(function (e) {
            // 格式订单金额
            e.total_amount = (e.total_amount / 100).toFixed(2)
            // 格式实收金额
            e.final_amount = (e.final_amount / 100).toFixed(2)
          })
          this.goods_statistical_data = result.data.goods
          this.order_statistical_data = result.data.order
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取收入汇总数据失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取收入汇总数据失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取流水明细数据
    async fetchList () {
      this.dataFilter()
      let _self = this
      try {
        const {response, result} = await this.FlowDetailsApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(function (e) {
            e.turnover_time = _self.formateDate(e.turnover_time, true, 2)
            e.amount = (e.amount / 100).toFixed(2)
          })
          _self.list = result.data
          _self.paginationData = result.meta
          _self.isInitiated = true
        } else {
          _self.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取流水明细列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取流水明细列表失败',
          content: `错误：${err}`,
        })
      }
    },
    /**
     * 时 分 格式化
     * @t  时分
     */
    judgeTime (t) {
      if (t < 10) {
        return '0' + t
      } else {
        return t
      }
    },
  },
  mounted () {
    if (this.$global.paginationData) {
      this.paginationData = this.$global.paginationData
      this.filterData = this.$global.filterData
      this.tab = this.$global.tab
      this.queryData = this.$global.filterData
    }
    if (parseInt(this.tab.type) === 1) {
      this.default_value = 1
      this.getIncomeSummary()
    } else {
      this.default_value = 2
      this.fetchList()
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.field-group {
  position: relative;
}
.time {
  position: absolute;
  right: 40px;
  bottom: 20px;
  border-radius: 3px;
  border: 1px solid #D9D9D9;
  box-sizing: border-box;
}
.time .day, .time .month{
  display: inline-block;
  width: 78px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  font-size: 14px;
  border-radius: 3px;
  background: #D9D9D9;
  color: #9A9B9A;
  cursor: pointer;
}
.active {
  color: #121212!important;
  background: #FFFFFF!important;
}
.revenue {
  padding-top: 0;
  box-sizing: border-box;
  overflow: auto;
}
.income {
  background: #ffffff;
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.statistics {
  width: 33%;
  text-align: left;
  padding-left: 30px;
  border-left: 1px solid #D9D9D9;
  box-sizing: border-box;
}
.statistics:first-child {
  border: none;
}
.statistics div:first-child {
  font-size: 16px !important;
  color: #999999 !important;
  font-weight: 500 !important;
}
.statistics div:last-child {
  margin-top: 10px;
  font-size: 30px;
  color: #404040;
  font-weight: 500;
}
.order-statistics {
  background: #ffffff;
  margin-top: 5px;
  margin-bottom: 20px;
  box-sizing: border-box;
}
.order-income, .order-income-content {
  background: #ffffff;
  display: flex;
  height: 40px;
  line-height: 40px;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #F1F1F1;
  box-sizing: border-box;
}
.order-income-content {
  border-bottom: none;
  height: 46px;
  line-height: 46px;
}
.order-income li, .order-income-content li {
  width: 33%;
  font-size: 14px;
  color: #999999;
  font-weight: 500;
  padding-left: 30px;
}
.order-income-content li {
  color: #353535;
  font-weight: 400;
}
td {
  vertical-align: middle !important;
}
.multi-content-td{
  vertical-align: middle;
}
.textzh {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  padding-right: 40px;
}
.section-layout
  height calc(100% - 56px)
.top-nav {
  display: flex;
  flex: 0 0 48px;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 48px;
  padding-left: 64px;
  padding-right: 64px;
  background-color: #fcfcfc;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  z-index: 8;
}
.fr{
  float: right;
}
.w-100{
  width: 100px;
}
.w-160{
  width: 160px;
}
.margin{
  margin: 0 8px;
  font-size: 14px;
}

</style>


