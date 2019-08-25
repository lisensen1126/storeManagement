<template lang="pug">
  .section-layout
    .section-filter.field-group.is-horizontal
      .field.keyword-wrapper
        label.label 关键字搜索
        custom-input(v-model.trim="keyword", placeholder="姓名/手机号/车牌号/车辆品牌", @keyupEnter="search")
      .field
        label.label 注册时间
        date-picker(type="single", placeholder="选择开始时间", v-model="start_time")
      .field
        date-picker(type="single", placeholder="选择结束时间", v-model="end_time")
      .field
        a.button.primary(@click="search") 搜索
      .field
        a.button(@click="reset") 重置
      .field
        a.button(@click="exportTable") 导出
    empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有客户档案")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(customer, index) in list")
              td
                .multi-content-td.has-image
                  .left-image.round
                    img(v-if="customer.avatar", :src="scaleImage(customer.avatar, 1, 36, 36)")
                    img(v-if="!customer.avatar", src="../../assets/user-avatar.png")
                  .content-item(v-text="customer.name")
                  .content-item(v-text="customer.mobile")
              td
                .simple-td(v-if="customer.vehicle.license_plate", v-text="customer.vehicle.license_plate")
                .simple-td.null(v-else) 暂无数据
              td
                .simple-td.m-r-5.td-special(v-if="customer.brand_info", v-text="customer.brand_info")
                .simple-td.null(v-else) 暂无数据
              td
                .simple-td(v-text="customer.latest_consume_date ? customer.latest_consume_date : '—'")
              td
                .simple-td
                  span(v-text="!customer.consume_amount ? '￥0.00' : '￥' + accDiv(customer.consume_amount,100)")
                  .content-divider.inline
                  span(v-text="!customer.consume_times ? '0 次' : customer.consume_times +' 次'")
              td
                .simple-td
                  span  {{customer.created_at}}
              td
                .operation-td
                  a.operation-link(@click="viewDetail(customer.customer_id)") 查看
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>

import CustomInput from '@/components/generics/form/CustomInput'
import EmptyPage from '@/components/generics/EmptyPage'
import Api from '@/mixins/modules/customer'
import Pagination from '@/components/generics/Pagination'
import imageScale from '@/mixins/utilities/imageScale'
import DatePicker from '@/components/generics/form/DatePicker'
import { mapGetters } from 'vuex'
import {root} from '@/plugins/Fetch'
import MathFun from '@/mixins/utilities/math'
var enterPath = '' // 临时 path 变量

export default {
  name: 'CustomerList',
  mixins: [Api, imageScale, MathFun],
  components: {
    EmptyPage,
    CustomInput,
    Pagination,
    DatePicker,
  },
  data () {
    return {
      root,
      isInitiated: false,
      theadConfig: [
        {
          name: '姓名/手机号',
          width: '200',
        }, {
          name: '车牌信息',
          width: '150',
        },
        {
          name: '品牌车系',
          width: '200',
        }, {
          name: '上次消费日期',
        }, {
          name: '消费贡献',
        }, {
          name: '注册日期',
        }, {
          name: '操作',
          width: '100',
        }],
      list: [],
      queryData: {}, // 搜索条件取这里边的值，每次点击搜索之后，将搜索条件更新再去请求，否则不更新搜索条件
      enterPath: enterPath,
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      keyword: '',
      is_search: false, // 是否搜索(翻页判断时用)
      is_back: false, // 是否返回
      start_time: '',
      end_time: '',
    }
  },
  computed: {
    ...mapGetters({
      currentEnterprise: 'currentEnterprise',
    }),
  },
  methods: {
    // 获取客户列表
    async getList () {
      try {
        let data = {
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        }
        if (this.queryData.keyword) {
          data.keyword = this.queryData.keyword
        }
        if (this.queryData.start_time) {
          data.start_time = new Date(this.queryData.start_time + ' 00:00:00').getTime() / 1000
        }
        if (this.queryData.end_time) {
          data.end_time = new Date(this.queryData.end_time + ' 23:59:59').getTime() / 1000
        }
        const { response, result } = await this.fetchCustomerList(data)
        if (response.status === 200 && result.code === 0) {
          this.list = result.data.map(res => {
            let temp = ''
            temp += res.vehicle.brand_name ? res.vehicle.brand_name + ' ' : ''
            temp += res.vehicle.model_name ? res.vehicle.model_name + ' ' : ''
            temp += res.vehicle.series_name ? res.vehicle.series_name + ' ' : ''
            temp += res.vehicle.vehicle_name ? res.vehicle.vehicle_name + ' ' : ''
            temp += res.vehicle.product_year ? res.vehicle.product_year + ' ' : ''
            temp += res.vehicle.output_volume ? res.vehicle.output_volume + ' ' : ''
            return {
              ...res,
              brand_info: temp,
            }
          })
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取客户列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取客户列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 搜索
    search () {
      this.is_search = true
      this.paginationData.current_page = 1
      this.queryData.keyword = this.keyword
      this.queryData.start_time = this.start_time
      this.queryData.end_time = this.end_time
      this.getList()
    },
    // 重置
    reset () {
      this.is_search = false
      this.queryData.keyword = ''
      this.queryData.start_time = ''
      this.queryData.end_time = ''
      this.keyword = ''
      this.start_time = ''
      this.end_time = ''
      this.paginationData.current_page = 1

      this.getList()
    },
    // 重置参数但不发送请求
    resetParams () {
      // this.is_search = false
      this.keyword = ''
      this.start_time = ''
      this.end_time = ''
    },
    exportTable () {
      let params = ''
      if (this.keyword) {
        params = params + `keyword=${this.keyword}&`
      }
      if (this.start_time) {
        let startTime = new Date(this.start_time + ' 00:00:00').getTime() / 1000
        params = params + `start_time=${startTime}&`
      }
      if (this.end_time) {
        let endTime = new Date(this.end_time + ' 23:59:59').getTime() / 1000
        params = params + `end_time=${endTime}`
      }
      window.open(`${this.root}/customer/export?${params}`)
    },
    // 分页跳转
    paging (state) {
      this.paginationData = state
      this.getList()
    },
    // 查看详情
    viewDetail (id) {
      // 记录列表页数
      this.$store.dispatch('setCurrentPageStorage', this.paginationData.current_page)
      this.$router.push({
        name: 'customerDetail',
        query: {
          customerId: id,
        },
      })
    },
  },
  created () {
  },
  mounted () {
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    /**
     * 由查看详情页面返回，直接取缓存
     */
    to.meta.isBack = false
    if (from.meta.isSlibing) {
      to.meta.isBack = true
    }
    next()
  },
  // keeplive  进入
  activated () {
    // 不点击搜索按钮后点查看详情 从订单详情页面返回，
    if (this.$route.meta.isBack && !this.is_search) {
      this.resetParams() // 重置部分参数
      return
    }
    // 点击搜索按钮后点查看详情 从订单详情页面返回，
    if (this.$route.meta.isBack && this.is_search) {
      return
    }
    // 当前页面为第一次进入,重置搜索条件搜索
    this.reset()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
@import '~@/stylus/modules/table-sp'
.carinfo
  position relative
  padding-left 8px
  padding-right 8px
  &::after
    position absolute
    left 0
    top 50%
    content ''
    width 1px
    height 20px
    background #f2f2f2
    margin-top -10px
  &:first-child
    padding-left 0
  &:first-child::after
    width 0
.carmore
  font-size 20px
  line-height 20px
  padding 0 10px
  color #999
  display inline-block
.m-r-5
  margin-right 5px
tr td .td-special
  max-width 180px !important
.keyword-wrapper
  width 222px
</style>
