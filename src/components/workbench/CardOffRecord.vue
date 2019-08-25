<template lang="pug">
  .section-layout
    //- .reserve-operation-wrapper
    //-   reservation-write-off(@success='refreshList', :string="'优惠券核销'")
    .section-filter
      .field-group.is-horizontal
        .field.name_keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="query_data.search_key" placeholder="按手机号查询", need-type='number', @keyupEnter="applyFilter")
        .field
          label.label 起止时间
          .field.is-horizontal
            date-picker.w-160(type="single", placeholder="选择开始时间", v-model="query_data.start")
            span.margin 至
            date-picker.w-160(type="single", placeholder="选择结束时间", v-model="query_data.end")
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
                .simple-td(v-text="item.nick_name")
              td
                .simple-td(v-text="item.mobile")
              td
                .simple-td(v-text="item.coupon_name")
              td
                .simple-td(v-text="item.coupon_type_name")
              td
                .simple-td(v-text="item.coupon_type_name === '折扣券' ? item.discount_amount/100 + '折' : '¥ ' + item.discount_amount/100")
              td
                .simple-td(v-if="item.condition_value === 0") 无限制
                .simple-td(v-else, v-text="'满'+item.condition_value/100+'元可用'")
              td
                .simple-td(v-text="item.coupon_use_type_name")
              td
                .simple-td(v-text="item.time")
              td
                .simple-td(v-text="(item.write_off_type === 2 && item.operator) ? item.operator : '-'")
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import ReservationWriteOff from './ReservationWriteOff'
import EmptyPage from '@/components/generics/EmptyPage'
import Api from '@/mixins/modules/workbench'
import Pagination from '@/components/generics/Pagination'
import imageScale from '@/mixins/utilities/imageScale'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import DatePicker from '@/components/generics/form/DatePicker'
import {root} from '@/plugins/Fetch'
import { mapGetters } from 'vuex'

export default {
  name: 'WorkBenchOverview',
  mixins: [Api, imageScale],
  components: {
    ReservationWriteOff,
    EmptyPage,
    Pagination,
    CustomInput,
    CustomSelect,
    DatePicker,
  },
  data () {
    return {
      root,
      isInitiated: false,
      theadConfig: [
        {
          name: '客户名称',
          width: '14%',
        },
        {
          name: '手机号',
          width: '12%',
        },
        {
          name: '优惠券名称',
          width: '10%',
        },
        {
          name: '优惠券类型',
          width: '10%',
        },
        {
          name: '金额(折扣)',
          width: '8%',
        },
        {
          name: '使用条件',
          width: '12%',
        },
        {
          name: '使用范围',
          width: '12%',
        },
        {
          name: '核销时间',
          width: '14%',
        },
        {
          name: '核销人',
          width: '12%',
        },
      ],
      list: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      query_data: {
        search_key: '',
        start: '', // 开始时间
        end: '', // 结束时间
      },
      filter_data: {
        search_key: '',
        start: '', // 开始时间
        end: '', // 结束时间
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
    // 导出
    exportTable () {
      let time = this.query_data.start
      time = time && (new Date(time.replace(/-/g, '/'))).getTime() / 1000
      let time2 = this.query_data.end
      time2 = time2 && ((new Date(time2.replace(/-/g, '/'))).getTime() / 1000) + 3600 * 24 - 1
      if (time > time2 && this.query_data.start && this.query_data.end) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          content: '开始时间不能大于结束时间',
        })
        return false
      }
      let url = `${root}/export/export_write_off_coupon_list?mobile=${this.query_data.search_key}&start=${time}&end=${time2}`
      console.log(url)
      window.open(url)
    },
    // 搜索按钮
    applyFilter () {
      for (let key in this.query_data) {
        if (this.query_data.hasOwnProperty(key)) {
          this.filter_data[key] = this.query_data[key]
        }
      }
      this.paginationData.current_page = 1
      this.getList()
    },
    // 重置
    resetFilter () {
      this.query_data.search_key = ''
      this.query_data.start = ''
      this.query_data.end = ''
      this.filter_data = { ...this.query_data }
      this.paginationData.current_page = 1
      this.getList()
    },
    // 获取核销列表数据
    async getList () {
      let time = this.filter_data.start
      time = time && (new Date(time.replace(/-/g, '/'))).getTime() / 1000
      let time2 = this.filter_data.end
      time2 = time2 && ((new Date(time2.replace(/-/g, '/'))).getTime() / 1000) + 3600 * 24 - 1
      if (time > time2 && this.query_data.start && this.query_data.end) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          content: '开始时间不能大于结束时间',
        })
        return false
      }
      try {
        const {response, result} = await this.cardOffList({
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
          mobile: this.filter_data.search_key ? this.filter_data.search_key : '',
          start: time,
          end: time2,
        })
        if (response.status === 200 && result.code === 0) {
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取优惠券核销列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取优惠券核销列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 分页跳转
    paging (state) {
      this.paginationData = state
      this.getList()
    },
    // 确认核销完成的回调方法
    refreshList: function () {
      this.getList()
    },
  },
  mounted () {
    this.getList() // 获取核销列表数据
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp';
.section-layout
  height: calc(100% - 52px) !important
.reserve-operation-wrapper
  display flex
  align-items center
  flex-shrink 0
  justify-content center
  background-color #fff
.bottom-image
  display inline-block
  width: 20px
  height: 20px
  margin-right: 4px
  img
    height 100%
    width 100%
.m-r-5
  margin-right 5px
.m-t-40
  margin-top 40px
.list-wrapper
  height calc(100% - 48px) !important
.margin {
  margin: 0 8px;
  font-size: 14px;
}
</style>
