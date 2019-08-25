<template lang="pug">
  .section-layout
    //- agreement
    //- .reserve-operation-wrapper
    //-   reservation-write-off(@success='refreshList', :string="'请输入核销码'" ref="reservation")
    .section-filter
      .field-group.is-horizontal
        .field.name_keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="search_key" placeholder="按手机号查询", need-type='number', @keyupEnter="applyFilter")
        .field.name_keyword-wrapper
          label.label
          custom-input(v-model="order_code" placeholder="按订单号查询", need-type='number' @keyupEnter="applyFilter")
        .field.name_keyword-wrapper
          label.label 订单来源
          custom-select(:list="write_from" v-model="write_state" nameField="name")
        .field
          label.label 起止时间
          .field.is-horizontal
            date-picker.w-160(type="single", placeholder="选择开始时间", v-model="start")
            span.margin 至
            date-picker.w-160(type="single", placeholder="选择结束时间", v-model="end")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
        .field
          a.button(@click="exportTable") 导出
    empty-page.m-t-40(v-if="!(list && list.length) && isInitiated", tip="当前没有核销列表数据")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.trade_order_no")
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
                .simple-td.overflow-ellipsis(v-text="item.write_off_store_name", :title="item.write_off_store_name")
              td
                .simple-td(v-text="item.operator ? item.operator : '--'")
              td
                .simple-td(v-text="item.mileage + 'km'")
              td
                .simple-td.m-r-5(v-text="item.write_off_at")
              td
                .simple-td.m-r-5(v-if="item.purchase_type == 1", v-text="'门店'")
                .simple-td.m-r-5(v-if="item.purchase_type == 2", v-text="'平台'")
              td
                .operation-td
                  span.operation-link(@click="viewInfo(item)") 订单详情
                  span.operation-link(@click="showWriteOff(item)") 核销详情
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
    write-off-record-modal(v-if="is_show", :writeOffData="write_off_data" @input="close")
</template>

<script>
import ReservationWriteOff from './ReservationWriteOff'
import EmptyPage from '@/components/generics/EmptyPage'
import Api from '@/mixins/modules/workbench'
import Pagination from '@/components/generics/Pagination'
import imageScale from '@/mixins/utilities/imageScale'
import Agreement from '@/components/generics/agreementModel'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import DatePicker from '@/components/generics/form/DatePicker'
import WriteOffRecordModal from '@/components/workbench/model/WriteOffRecordModal'
import MathFun from '@/mixins/utilities/math'
import {root} from '@/plugins/Fetch'

export default {
  name: 'WriteOffRecord',
  mixins: [Api, imageScale, MathFun],
  components: {
    ReservationWriteOff,
    EmptyPage,
    Pagination,
    Agreement,
    CustomInput,
    CustomSelect,
    DatePicker,
    WriteOffRecordModal,
  },
  data () {
    return {
      root,
      is_show: false, // 是否显示核销记录模态框
      isInitiated: false,
      search_key: '',
      order_code: '', // 订单号
      theadConfig: [
        {
          name: '订单号',
          width: '160',
        },
        {
          name: '车主信息',
          width: '160',
        },
        {
          name: '订单价格',
          width: '160',
        },
        {
          name: '核销门店',
          width: '160',
        },
        {
          name: '核销人',
          width: '100',
        },
        {
          name: '上次保养里程',
          width: '120',
        },
        {
          name: '核销时间',
          width: '100',
        },
        {
          name: '核销来源',
          width: '90',
        },
        {
          name: '操作',
          width: '150',
        }],
      list: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
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
      is_search: false, // 是否搜索(翻页判断时用)
      write_state: {
        id: '',
        name: '',
      },
      write_off_data: null, // 核销详情数据
      start: '', // 开始时间
      end: '', // 结束时间
    }
  },
  methods: {
    // 导出
    exportTable () {
      let time = this.start
      time = time && (new Date(time.replace(/-/g, '/'))).getTime() / 1000
      let time2 = this.end
      time2 = time2 && ((new Date(time2.replace(/-/g, '/'))).getTime() / 1000) + 3600 * 24 - 1
      if (time > time2 && this.start && this.end) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          content: '开始时间不能大于结束时间',
        })
        return false
      }
      let url = `${root}/export/export_write_off_order_list?mobile=${this.search_key}&order_no=${this.order_code}&start=${time}&end=${time2}&purchase_type=${this.write_state.id}`
      console.log(url)
      window.open(url)
    },
    // 搜索按钮
    applyFilter () {
      let time = this.start
      time = time && (new Date(time.replace(/-/g, '/'))).getTime() / 1000
      let time2 = this.end
      time2 = time2 && ((new Date(time2.replace(/-/g, '/'))).getTime() / 1000) + 3600 * 24 - 1
      if (time > time2 && this.start && this.end) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          content: '开始时间不能大于结束时间',
        })
        return false
      }
      this.time = time
      this.time2 = time2
      this.is_search = true
      this.paginationData.current_page = 1
      this.getList()
    },
    // 重置
    resetFilter () {
      this.is_search = false
      this.paginationData.current_page = 1
      this.search_key = ''
      this.order_code = ''
      this.write_state = {
        id: '',
        name: '',
      }
      this.start = ''
      this.end = ''
      this.getList()
    },
    // 获取核销列表数据
    async getList () {
      // 去除搜索条件空格
      this.search_key = this.search_key.trim()
      this.order_code = this.order_code.trim()
      try {
        const { response, result } = await this.checkList({
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
          search: this.is_search ? this.search_key : '',
          order_no: this.is_search ? this.order_code : '',
          purchase_type: this.write_state.id,
          start: this.is_search && this.time ? this.time : '',
          end: this.is_search && this.time2 ? this.time2 : '',
        })
        if (response.status === 200 && result.code === 0) {
          this.list.splice(0, this.list.length, ...result.data)
          // console.log(this.list)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取核销列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取核销列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 查看详情
    viewInfo (item) {
      // 记录列表页数
      this.$store.dispatch('setCurrentPageStorage', this.paginationData.current_page)
      this.$router.push({
        name: 'orderDetail',
        params: {
          id: item.trade_order_id,
        },
      })
    },
    // 核销记录
    showWriteOff (item) {
      this.write_off_data = item.write_off_item.map(item => {
        if (item.item.item_type === 1) { // 1: 商品, 2: 服务
          if (item.item.sku_attribute.length > 0) {
            var obj = JSON.parse(item.item.sku_attribute)
            var str = ''
            obj.forEach(cell => {
              str += (cell.attribute_item_value + ' ')
            })
            item.item.sku_name = str
          } else {
            item.item.sku_name = ''
          }
        } else {
          item.item.sku_name = ''
        }
        return item
      })
      this.is_show = true
    },
    close () {
      this.is_show = false
    },
    // 分页跳转
    paging (state) {
      this.paginationData = state
      this.getList()
    },
    // 确认核销完成的回调方法
    refreshList () {
      this.getList()
    },
  },
  mounted () {
    this.getList()
  },
}
</script>

<style lang="stylus" scoped>
// @import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp'
.max-160
  max-width 160px !important
.reserve-operation-wrapper
  display flex
  align-items center
  flex-shrink 0
  justify-content center
  background-color #fff
.section-layout
  height calc(100% - 52px) !important
.bottom-image
  display inline-block
  width 20px
  height 20px
  margin-right 4px
  img
    height 100%
    width 100%
.margin
  margin 0 8px
  font-size 14px
.m-r-5
  margin-right 5px
.m-t-40
  margin-top 40px
.list-wrapper
  height calc(100% - 48px) !important
.operation-td
  width 150px
.overflow-ellipsis
  overflow: hidden
  text-overflow: ellipsis
  width: 160px !important 
</style>
