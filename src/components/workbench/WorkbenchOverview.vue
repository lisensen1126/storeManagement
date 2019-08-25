<template lang="pug">
  .section-layout
    prior-conditions
      service-tab(v-model="currentOrderStatus", :tabs="orderStatusList", :have-icon="false", :have-quantity="false", @input="changeOrderStatus")
    .section-filter
      .field-group.is-horizontal
        .field.name_keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="search_data.search_key" placeholder="按手机号、订单号查询", need-type='number', @keyupEnter="applyFilter")
        .field.is-narrow
          label.label 门店
          custom-select(:list="chain_list" v-model="search_data.search_store" nameField="store_name")
        .field.is-narrow
          label.label 预约来源
          custom-select(:list="write_from" v-model="write_state" nameField="name")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有预约数据'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="150") 订单信息
              td(width="150") 预约门店
              td(width="80") 预约时间
              td(width="60") 车主信息
              td(width="80") 订单价格
              td(width="80") 状态
              td(width="80") 预约来源
              td(width="100") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .multi-content-td
                  .content-item(v-text="item.trade_order_no")
                  .content-item
                    span.bottom-image(v-for="(img,index) in item.item" v-if="index < 4")
                      img(v-if="img", :src="scaleImage(img, 1, 36, 36)")
              td
                .simple-td.max-160(v-text="item.reserve.reserve_store_name")
              td
                .simple-td(v-text="item.reserve && item.reserve.reserve_time")
              td
                .multi-content-td
                  .content-item
                    span.left-image.inline
                      img(v-if="item.customer.avatar", :src="scaleImage(item.customer.avatar, 1, 16, 16)")
                      img(v-if="!item.customer.avatar", src="../../assets/user-avatar.png")
                    span(v-text="item.customer && item.customer.name")
                  .content-item
                    span(v-text="item.customer && item.customer.mobile")
                    span.content-divider.inline(v-if="item.customer && item.customer.vehicle && item.customer.vehicle.license_plate")
                    span(v-text="item.customer && item.customer.vehicle && item.customer.vehicle.license_plate || ''")
              td
                .simple-td(v-text="'￥' + accDiv(item.final_amount,100)")
              td
                .simple-td
                  .status-dot(:class="{'primary': (item.status == '2' && (!item.reserve || item.reserve.status != '2')), 'green': item.status == '3', 'blue': (item.status == '2' && item.reserve && item.reserve.status == '2'), 'grey': item.status == '4', 'red': item.status == '1'}")
                  span(v-if="item.status == '1'") 待付款
                  span(v-if="item.status == '2' && (!item.reserve || item.reserve.status != '2')") 待核销
                  span(v-if="item.status == '3'") 已完成
                  span(v-if="item.status == '4'") 已关闭
                  span(v-if="item.status == '2' && item.reserve && item.reserve.status == '2' && item.reserve.reserve_status == '0'") 已预约
                  span(v-if="item.status == '2' && item.reserve && item.reserve.status == '2' && item.reserve.reserve_status == '1'") 已过期
              td
                .simple-td(v-if="item.purchase_type == 1", v-text="'门店'")
                .simple-td(v-if="item.purchase_type == 2", v-text="'平台'")
              td
                .operation-td
                  router-link.operation-link(:to="{name: 'orderDetail', params: {id: item.trade_order_id}}") 查看
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import EmptyPage from '@/components/generics/EmptyPage'
import workbenchMixin from '@/mixins/modules/workbench'
import imageScale from '@/mixins/utilities/imageScale'
import Pagination from '@/components/generics/Pagination'
import ServiceTab from '@/components/generics/ServiceTab'
import PriorConditions from '@/components/generics/PriorConditions'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import MathFun from '@/mixins/utilities/math'
import { mapGetters } from 'vuex'

export default {
  name: 'WorkBenchOverview',
  mixins: [workbenchMixin, imageScale, MathFun],
  components: {
    EmptyPage,
    Pagination,
    ServiceTab,
    PriorConditions,
    CustomInput,
    CustomSelect,
  },
  data () {
    return {
      is_search: false, // 是否点击搜索按钮
      currentOrderStatus: {
        type: '7',
        name: '已预约',
      },
      orderStatusList: [
        {
          type: '7',
          name: '已预约',
        },
        {
          type: '8',
          name: '已过期',
        },
      ],
      write_from: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 1,
          name: '门店',
        },
        {
          id: 2,
          name: '平台',
        },
      ],
      isInitiated: false,
      list: [],
      chain_list: [],
      search_key: '',
      search_store: null,
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      search_data: {
        search_key: '',
        search_store: null,
      },
      query_data: {},
      write_state: {
        id: '',
        name: '',
      },
    }
  },
  computed: {
    ...mapGetters({
      current_store: 'currentStore',
      stores_list: 'stores',
    }),
  },
  methods: {
    // 搜索按钮
    applyFilter () {
      this.is_search = true
      for (let key in this.search_data) {
        if (this.query_data.hasOwnProperty(key)) {
          this.query_data[key] = this.search_data[key]
        }
      }
      this.paginationData.current_page = 1
      this.fetchData()
    },
    // 重置
    resetFilter () {
      this.is_search = false
      this.paginationData.current_page = 1
      this.search_data.search_key = ''
      this.search_data.search_store = null
      this.write_state = {
        id: '',
        name: '',
      }
      this.query_data = JSON.parse(JSON.stringify(this.search_data))
      this.fetchData()
    },
    // 重置
    resetParams () {
      this.is_search = false
      this.search_data.search_key = ''
      this.search_data.search_store = null
      this.write_state = {
        id: '',
        name: '',
      }
      this.query_data = JSON.parse(JSON.stringify(this.search_data))
    },
    // 获取预约列表数据
    async fetchData () {
      try {
        const {response, result} = await this.workbenchReserve({
          status: this.currentOrderStatus.type ? this.currentOrderStatus.type : '',
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
          search: this.query_data.search_key,
          store_id: this.query_data.search_store ? this.query_data.search_store.store_id : '',
          purchase_type: this.write_state.id,
        })
        if (response.status === 200 && result.code === 0) {
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取预约列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取预约列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // tabs 跳转
    changeOrderStatus () {
      this.resetFilter()
    },
    // 翻页操作
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
  },
  mounted () {
    this.current_store.is_chain === 2
      ? this.chain_list = [{store_name: this.current_store.store_name, store_id: this.current_store.store_id}]
      : this.chain_list = this.stores_list
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    /**
     * 由查看详情页面返回，直接取缓存
     */
    to.meta.isBack = false
    if (from.name === 'orderDetail') {
      to.meta.isBack = true
    }
    next()
  },
  // keep-alive 进入
  activated () {
    /**
     * 未点搜索按钮 或
     * 是添加 且 不是返回(保存) 或
     * 由切换tab进入
     */
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
    this.currentOrderStatus = {
      type: '7',
      name: '已预约',
    }
    this.resetFilter()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
@import '~@/stylus/modules/table-sp'
.max-160
  max-width 160px !important
.workbench-table
  padding 0
.list-header
  display flex
  align-items center
  justify-content space-between
  flex 0 0 64px
  height 64px
  padding 0 24px
  background-color #fff
  border-bottom 1px solid line
  border-radius 3px 3px 0 0
.tab-container
  position relative
  height 100%
.tab-item
  position relative
  display inline-block
  margin-right 30px
  font-size 18px
  line-height 64px
  color lightGrey
  cursor pointer
  &::after
    display none
    content ''
    position absolute
    bottom 0
    left 0
    height 0
    width 100%
    border 1px solid primary
  &.active
    color standblack
    .tag
      background-color primary
    &::after
      display block
      background-color primary
.load-more
  position relative
  height 50px
  padding 0 24px
  line-height 50px
  font-size 14px
  text-align center
  background-color #fff
  border-radius 0 0 3px 3px
  color placeholder
  &::before
    content ''
    position absolute
    top 0
    left 0
    width 100%
    border-top 1px solid line
.expired
  color error
.bottom-image
  display inline-block
  width: 20px
  height: 20px
  margin-right: 4px
  img
    height 100%
    width 100%
</style>
