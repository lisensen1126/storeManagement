<template lang="pug">
  .section-layout
    .content-wrapper(:class="{'paddingb0':log_list.length===0}")
      service-tab.top-nav(v-model="currt_type", :tabs="pay_type", :have-icon="false", :have-quantity="false", class="status-list", @input="changeTab($event)")
      .field-group.is-horizontal.section-filter
        .field
          label.label 关键字搜索
          custom-input.fl.w-160(placeholder="用户手机号", type="tel",need-type='number', v-model="searchData.keywords",@keyupEnter="search")
        .field
          label.label 起止时间
          .field.is-horizontal
            date-picker.w-160(type="single", placeholder="选择开始时间", v-model="searchData.start_time")
            span.margin 至
            date-picker.w-160(type="single", placeholder="选择结束时间", v-model="searchData.end_time")
        .field.is-narrow
          label.label 收款码类型
          custom-select(v-model="searchData.code_classification", :list="code_classification", nameField="name")
        .field.is-narrow
          label.label 开单员工姓名
          custom-select(v-model="searchData.staff_classification", :list="staff_classification", nameField="mem_username", :showSearch="true")
        .field.is-narrow
          label.label 所属门店
          custom-select(v-model="searchData.store_classification", :list="store_list_modify", nameField="store_name")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset") 重置          
      .empty-page-wrapper(v-if="log_list.length===0 && has_load")
        empty-page(tip="暂无收款记录")
      .content-wrapper.list-wrapper.margin0(v-if="log_list.length>0")
        .table-wrapper
          table.table
            thead
              tr
                td(width="15%") 客户信息
                td(width="15%") 付款时间
                td(width="10%") 订单应付金额
                td(width="7%") 优惠金额
                td(width="7%") 实付金额
                td(width="10%") 
                  span  交易手续费
                  el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'该交易手续费统计数据来源于微信支付或美团支付产生的交易手续费，由微信支付或美团支付收取。'")
                    .el-icon-question(slot="reference")
                td(width="10%") 收款码类型
                td(width="10%") 开单员工姓名
                td(width="10%") 所属门店
                td(width="10%") 订单号
            tbody
              tr(v-for="rec in log_list")
                td.simple-td
                  .user-info
                    img.icon(:src="rec.customer.avatar")
                    div
                      .name {{rec.customer.real_name}}
                      .tel {{rec.customer.mobile}}
                td.simple-td  {{rec.paid_at}}
                td.simple-td  ￥ {{rec.total_amount/100 | fix2}}
                td.simple-td  ￥ {{rec.preferential_price/100 | fix2}}
                td.simple-td  ￥ {{rec.final_amount/100 | fix2}}
                td.simple-td  ￥ {{rec.rate_price/100 | fix2}}
                td.simple-td  
                  span(v-show='rec.order_type===6') 门店收款码
                  span(v-show='rec.order_type===7') 开单收款码
                td.simple-td 
                  span(v-if="rec.mem_username") {{rec.mem_username}}
                  span(v-if="!rec.mem_username")  --
                td.simple-td.max-w200 {{rec.store_name}}
                td.simple-td  
                  span(@click="goDetail(rec)").order-num {{rec.trade_order_no}}  
      .tfoot(v-if="log_list.length>0")
        pagination(:pagination-data="paginationData", @input="paging")      
</template>

<script>
import ServiceTab from '@/components/generics/ServiceTab'
import Tab from '@/components/appCenter/model/PublicTabs'
import EmptyPage from '@/components/generics/EmptyPage'
import DatePicker from '@/components/generics/form/DatePicker'
import CustomInput from '@/components/generics/form/CustomInput'
import Pagination from '@/components/generics/Pagination'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Api from '@/mixins/modules/AppCenter'
export default {
  mixins: [Tab, Api],
  components: {
    ServiceTab,
    DatePicker,
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
  },
  data () {
    return {
      currt_type: { name: '收款记录', type: 5 },
      is_click: null,
      searchData: {                     // 搜索数据（原始）
        keywords: '',
        start_time: '',
        end_time: '',
        code_classification: {},
        staff_classification: {},
        store_classification: {},
      },
      query: {},                        // 搜索数据（处理过的）
      code_classification: [            // 收款码类型列表
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
      paginationData: {
        current_page: 1,
        per_page: 1,
        last_page: 1,
        total: 1,
      },
      staff_classification: [],              // 员工列表
      log_list: [],                          // 列表数据
      has_load: true,                        // 是否已载入数据
      store_list_modify: [],                 // 修饰过的门店列表
    }
  },
  async mounted () {
    this.is_click = 5
    this.currt_type = { name: '收款记录', type: 5 }
    this.fetchData()
    this.getStaffList()
    this.getStoreList()
  },
  methods: {
    search () {
      this.paginationData.current_page = 1
      this.formatQuery()
      let query = this.query
      if (query.start_time && query.end_time && Number(query.start_time) > Number(query.end_time)) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '温馨提示',
          content: '开始时间不能大于结束时间',
        })
        return
      }
      this.fetchData()
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
    // 格式化数据
    formatQuery () {
      let data = {
        mobile: this.searchData.keywords,
        start_time:
            new Date(this.searchData.start_time + ' 00:00:00').getTime() / 1000,
        end_time:
            new Date(this.searchData.end_time + ' 23:59:59').getTime() / 1000,
        order_type: this.searchData.code_classification.value,
        store_id: this.searchData.store_classification.store_id,
        date_type: this.time_type,
        mem_uid: this.searchData.staff_classification.mem_uid,
        page: this.paginationData.current_page,
      }
      let query = {}
      Object.keys(data).forEach(item => {
        if (data[item]) {
          query[item] = data[item]
        }
      })
      this.query = query
    },
    // 重置搜索数据
    reset () {
      this.searchData = {
        keywords: '',
        start_time: '',
        end_time: '',
        code_classification: {},
        staff_classification: {},
        store_classification: {},
      }
      this.paginationData.current_page = 1
      this.formatQuery()
      this.fetchData()
    },
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
    // 查看订单详情
    goDetail (rec) {
      this.$router.push({name: 'orderDetail', params: {id: rec.trade_order_id}})
    },
    // 获取员工列表
    async getStaffList () {
      try {
        const { result, response } = await this.getStaffListApi({hide_loading: true})
        if (response.status === 200 && result.code === 0) {
          this.staff_classification = [...[{mem_username: '全部', mem_uid: 0}], ...result.data]
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 拉取列表数据
    async fetchData () {
      try {
        this.query.page = this.paginationData.current_page
        this.query.hide_loading = false
        const { result, response } = await this.gatherLogApi(this.query)
        if (response.status === 200 && result.code === 0) {
          this.log_list = result.data
          this.paginationData = result.meta
          this.has_load = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取收款记录失败',
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
      } finally {
        if (document.getElementsByClassName('table-wrapper')[0]) {
          document.getElementsByClassName('table-wrapper')[0].scrollTop = 0
        }
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

.margint20 {
  margin-top: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin-right: 5px;
  }

  .name, .tel {
    line-height: 20px;
    text-overflow: ellipsis;
    width: 84px;
    overflow: hidden;
  }
}

.margin0 {
  margin: 0;
  background: #f0f1f2;
  padding-bottom: 5px;
}

.order-num {
  color: #2fabdd;
  cursor: pointer;
}

.paddingb0 {
  padding-bottom: 0;
}

.empty-page-wrapper {
  padding: 50px 0;
  background: #f0f1f2;
}
.content-wrapper{
  flex-grow: 1;
  padding-bottom: 15px !important;
  background: transparent;
}
.max-w200{
  max-width: 200px;
}
</style>
