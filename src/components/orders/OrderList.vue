<template lang="pug">
  .section-layout
    big-img.bigImg(v-if="showImg", @clickit="viewImg", :imgSrc="imgsrc")
    prior-conditions
      service-tab(v-model="currentOrderStatus", :tabs="orderStatusList", :have-icon="false", :have-quantity="false", @input="changeOrderStatus")
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filterData.keyword", need-type='number', placeholder="按订单号或手机号查询", @keyupEnter="search")
        .field.is-narrow
          label.label 订单类型
          custom-select(v-model="filterData.search_goods_type", :list="goods_type_list", nameField="goods_type_name")
        .field
          label.label 按时间筛选
          .field.is-horizontal
            date-picker(type="single", placeholder="选择开始时间", v-model="filterData.start_time")
            span.margin 至
            date-picker(type="single", placeholder="选择结束时间", v-model="filterData.end_time")
        .field.is-narrow
          label.label 订单来源
          custom-select(v-model="filterData.order_source", :list="order_source_list")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset") 重置
        .field.fr
          a.button.fr(target="_blank", @click="exportExcel()") 导出
      //- span.add-button(@click="goAddCustomer")
    empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有订单")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .multi-content-td
                  .content-item(v-text="item.trade_order_no")
                  //  (@click="clickImg(item.item)")
                  .content-item(v-if="item.goods_type === 2")
                    span.bottom-image
                      img(:src="scaleImage('https://oss2.chedianai.com/images/assets/upkeep_bg.png', 1, 36, 36)")
                  .content-item(v-else)
                    span.bottom-image(v-for="(img,index) in item.item" v-if="index < 4")
                      img(v-if="img", :src="scaleImage(img, 1, 36, 36)")
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
                .simple-td(v-if="item.goods_type === 1 && item.order_type <= 4") 商品服务订单
                .simple-td(v-if="item.goods_type === 2 && item.order_type <= 4") 养护卡订单
                .simple-td(v-if="item.order_type === 7 || item.order_type === 6") 线下买单订单
              td
                .simple-td
                  .status-dot(:class="{'primary': (item.status == '2' && (!item.reserve || item.reserve.status != '2')), 'green': item.status == '3' || item.status == '6' || item.status == '5' || item.status == '8', 'blue': (item.status == '2' && item.reserve && item.reserve.status == '2') || item.status == '7', 'grey': item.status == '4', 'red': item.status == '1' || item.status == '9'}")
                  span(v-if="item.status == '1'") 待付款
                  span(v-if="item.status == '2' && (!item.reserve || item.reserve.status != '2')") 待核销
                  span(v-if="item.status == '3'") 已完成
                  span(v-if="item.status == '4'") 已关闭
                  span(v-if="item.status == '2' && item.reserve && item.reserve.status == '2' && item.reserve.reserve_status == '0'") 已预约
                  span(v-if="item.status == '2' && item.reserve && item.reserve.status == '2' && item.reserve.reserve_status == '1'") 已过期
                  span(v-if="item.status == '6'") 拼团中
                  span(v-if="item.status == '7'") 正在退款
                  span(v-if="item.status == '5' || item.status == '8'") 退款成功
                  span(v-if="item.status == '9'") 退款失败
              td
                .simple-td(v-if="item.purchase_type - 1 === 1")
                  span(v-if="item.cancelled_by === 5") ￥{{accDiv(item.final_amount,100)}}(自动)
                  span(v-if="item.cancelled_by === 6") ￥{{accDiv(item.final_amount,100)}}(手动)
                  span(v-if="item.cancelled_by < 5") --
                .simple-td(v-if="item.purchase_type - 1 !== 1") --
              td
                .simple-td(v-text="item.store_name")
              td
                .simple-td(v-text="item.created_at")
              td
                .simple-td {{(order_source_list[item.purchase_type-1]||'').name||''}}
              td
                .operation-td
                  router-link.operation-link(:to="{name: 'orderDetail', params: {id: item.trade_order_id}, query: {cancelled_by: item.cancelled_by}}") 查看
                  span.operation-link(@click="statement(item)" v-if="item.status == 2 || item.status == 3") 结算单
                  span.operation-link(@click="refund(item)",v-if="item.refund_status == '2'") 手动退款
                    el-popover.tips-text(placement="left-start", width="200", trigger="hover", :content="text", style="padding-left: 5px")
                      .el-icon-question(slot="reference")
                  span.operation-link(@click="cancel(item)",v-if="item.is_effective == 1 && (item.goods_type === 2 && item.status == 3 || (item.goods_type === 1 && item.order_type <= 4) && item.status == 2)") 订单撤销
                    el-popover.tips-text(placement="left-start", width="200", trigger="hover", :content="tips_text", style="padding-left: 5px")
                      .el-icon-question(slot="reference")
        .tfoot(v-if="list.length")
      pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import PriorConditions from '@/components/generics/PriorConditions'
import ServiceTab from '@/components/generics/ServiceTab'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import EmptyPage from '@/components/generics/EmptyPage'
import Api from '@/mixins/modules/order'
import Pagination from '@/components/generics/Pagination'
import imageScale from '@/mixins/utilities/imageScale'
import BigImg from '@/components/generics/ImageEnlarge'
import DatePicker from '@/components/generics/form/DatePicker'
import Utils from '@/mixins/utilities/utils'
import { root } from '@/plugins/Fetch'
import MathFun from '@/mixins/utilities/math'
export default {
  name: 'OrderList',
  mixins: [Api, imageScale, Utils, MathFun],
  components: {
    PriorConditions,
    ServiceTab,
    EmptyPage,
    CustomInput,
    CustomSelect,
    Pagination,
    BigImg,
    DatePicker,
  },
  computed: {
    order_source_list () { // 订单来源列表：1 门店，2 平台， 3 第三方
      return [
        { name: '门店', value: '1' },
        { name: '平台', value: '2' },
        { name: '第三方', value: '3' },
      ]
    },
  },
  data () {
    return {
      root,
      is_search: false, // 是否点击了搜索按钮
      showImg: false,
      imgsrc: '',
      isInitiated: false,
      // 搜索对象
      filterData: {
        search_goods_type: null,
        search_order_type: null,
        start_time: '',
        end_time: '',
        keyword: '',
        order_source: null, // 订单来源
      },
      // 开始时间戳
      start_time: 0,
      // 结束时间戳
      end_time: 0,
      // 已废弃(v3.8.5)
      order_type_list: [
        {
          order_type_name: '全部',
          value: '0',
        },
        {
          order_type_name: '普通订单',
          value: '1',
        },
        {
          order_type_name: '智能保养',
          value: '2',
        },
        {
          order_type_name: '拼团订单',
          value: '3',
        },
        {
          order_type_name: '秒杀订单',
          value: '4',
        },
        {
          order_type_name: '养护卡',
          value: '5',
        },
        {
          order_type_name: '线下买单',
          value: '6',
        },
      ],
      goods_type_list: [
        {
          goods_type_name: '全部',
          value: '0',
        },
        {
          goods_type_name: '商品服务订单',
          value: '1',
        },
        {
          goods_type_name: '养护卡订单',
          value: '2',
        },
        {
          goods_type_name: '线下买单订单',
          value: '3',
        },
      ],
      currentOrderStatus: {
        type: '',
        name: '全部',
      },
      orderStatusList: [
        {
          type: '',
          name: '全部',
        },
        {
          type: '2',
          name: '待核销',
        },
        {
          type: '6',
          name: '已预约',
        },
        {
          type: '3',
          name: '已完成',
        },
        {
          type: '4',
          name: '已关闭',
        },
      ],
      theadConfig: [
        {
          name: '订单内容/订单号',
          width: '180',
        },
        {
          name: '客户信息',
          width: '160',
        },
        {
          name: '实付金额',
          width: '100',
        },
        {
          name: '订单类型',
          width: '90',
        },
        {
          name: '订单状态',
          width: '90',
        },
        {
          name: '退款金额',
          width: '80',
        },
        {
          name: '下单门店',
          width: '100',
        },
        {
          name: '下单时间',
          width: '160',
        },
        {
          name: '订单来源',
          width: '90',
        },
        {
          name: '操作',
          width: '160',
        }],
      list: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      query_data: {},
      text: '手动退款：这个拼团失败的订单，系统不会自动退款！请自行将车主支付款项进行退还，然后点击“手动退款”完成操作。',
      tips_text: '订单撤销：需要订单作废取消？请自行将车主支付款项进行退还，然后点击“订单撤销”完成操作（核销过的订单和养护卡是无法撤销的）。',
    }
  },
  methods: {
    // 撤销订单
    cancel (item) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '确认撤销订单吗？',
        isRejectable: 1,
        resolve: () => {
          this.cancelOrder(item)
        },
      })
    },
    // 撤销订单接口
    async cancelOrder (item) {
      try {
        const { response, result } = await this.revokeApi({
          trade_order_id: item.trade_order_id,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            type: 'success',
            title: '订单撤销成功',
            autoClose: true,
          })
          this.getList()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '订单撤销失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '订单撤销失败',
          content: `错误: ${err}`,
        })
      }
      this.isInitiated = true
    },
    /*
    * 退款提醒
    * item 订单
    * */
    refund (item) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: `确认要退款￥${this.accDiv(item.final_amount, 100)}给${item.customer.mobile}吗？`,
        isRejectable: 1,
        resolve: () => {
          this.refundOrder(item)
        },
      })
    },

    /*
    * 退款接口
    * item 订单
    * */
    async refundOrder (item) {
      try {
        const { response, result } = await this.refundApi({
          trade_order_id: item.trade_order_id,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              type: 'success',
              title: '退款成功',
              autoClose: true,
            })
            this.getList()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '退款失败',
              content: `出错了: ${result.message}`,
              autoClose: true,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '手动退款失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '手动退款失败失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 获取订单列表数据
    async getList () {
      try {
        const { response, result } = await this.fetchOrderList({
          status: this.currentOrderStatus.type ? this.currentOrderStatus.type : undefined,
          search: this.query_data.keyword,
          purchase_type: (this.query_data.order_source || {}).value || null,
          order_type: this.query_data.search_order_type ? parseInt(this.query_data.search_order_type.value) : '',
          goods_type: this.query_data.search_goods_type ? parseInt(this.query_data.search_goods_type.value) : '',
          start_time: this.query_data.start_time ? this.start_time : '',
          end_time: this.query_data.end_time ? this.end_time : '',
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取订单列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取订单列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    exportExcel () {
      let query = this.filterData
      let startTime = this.timeStamp(query.start_time)
      let endTime = this.timeStamp(query.end_time)
      let url = `${root}/order/export?status=${this.currentOrderStatus.type ? this.currentOrderStatus.type : 0}&search=${query.keyword ? query.keyword : ''}&goods_type=${query.search_goods_type ? query.search_goods_type.value : ''}&purchase_type=${query.order_source && query.order_source.value ? query.order_source.value : ''}&start_time=${startTime}&end_time=${endTime}`
      window.open(url)
    },
    // 搜索
    search () {
      this.is_search = true
      // 判断开始时间是否大于结束时间
      let start = this.filterData.start_time
      let end = this.filterData.end_time
      if (start && end) {
        start = new Date(start + ' 00:00:00').getTime()
        end = new Date(end + ' 23:59:59').getTime()
        if (start > end) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '开始时间不能大于结束时间',
          })
          return false
        }
      }
      for (let key in this.filterData) {
        if (this.query_data.hasOwnProperty(key)) {
          this.query_data[key] = this.filterData[key]
        }
      }
      this.paginationData.current_page = 1
      this.getList()
    },
    // 重置
    reset () {
      this.is_search = false
      this.filterData = {
        search_order_type: null,
        search_goods_type: null,
        start_time: '',
        end_time: '',
        keyword: '',
        order_source: null,
      }
      this.query_data = JSON.parse(JSON.stringify(this.filterData))
      this.getList()
    },
    // 重置部分参数
    resetParams () {
      this.filterData = {
        search_order_type: null,
        search_goods_type: null,
        start_time: '',
        end_time: '',
        keyword: '',
        order_source: null,
      }
      this.query_data = JSON.parse(JSON.stringify(this.filterData))
    },
    // 分页跳转
    paging (state) {
      this.paginationData = state
      this.getList()
    },
    // tabs 跳转
    changeOrderStatus () {
      this.$set(this.paginationData, 'current_page', 1)
      this.filterData = {
        search_order_type: null,
        search_goods_type: null,
        start_time: '',
        end_time: '',
        keyword: '',
        order_source: null,
      }
      this.query_data = JSON.parse(JSON.stringify(this.filterData))
      this.getList()
    },
    clickImg (e) {
      this.showImg = true
      // 获取当前图片地址
      this.imgsrc = e
    },
    viewImg () {
      this.showImg = false
    },
    // 结算单下载
    statement (params) {
      let url = `${root}/order/pdf/${params.trade_order_no}`
      window.open(url)
    },
  },
  mounted () {
  },
  watch: {
    'filterData.start_time': function () {
      this.start_time = this.filterData.start_time ? parseInt(new Date(this.filterData.start_time + ' 00:00:00').getTime() / 1000) : ''
    },
    'filterData.end_time': function () {
      this.end_time = this.filterData.end_time ? parseInt(new Date(this.filterData.end_time + ' 23:59:59').getTime() / 1000) : ''
    },
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
    this.currentOrderStatus = {
      type: '',
      name: '全部',
    }
    this.reset()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
@import '~@/stylus/modules/table-sp'
.simple-td
  max-width 160px !important
.bottom-image
  display inline-block
  width 20px
  height 20px
  margin-right 4px
  img
    height 100%
    width 100%
.money
  width 82px
  height 36px
.fccc
  width 100px
  height 200px
  background red
.bigImg
  z-index 9999
.section-filter
  display flex
  justify-content space-between
  align-items flex-end
.margin
  margin 0 8px
  font-size 14px
</style>
