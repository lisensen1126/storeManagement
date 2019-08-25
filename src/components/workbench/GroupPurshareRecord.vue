<template lang="pug">
  .section-layout
    .reserve-operation-wrapper
      reservation-write-off(@success='refreshList', :string="'团购核销'")
    empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有核销列表数据")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.write_off_at")
              td
                .simple-td(v-text="item.store_name")
              td
                .simple-td(v-text="item.tuan_gou.name")
              td
                .simple-td(v-text="item.tuan_gou_order.deal_group_id")
              td
                .simple-td(v-text="'¥'+item.tuan_gou.sell_price/100")
              td
                .simple-td(v-text="item.order_id")
              td
                .simple-td(v-text="item.tuan_gou_order.mobile_no")
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import ReservationWriteOff from './ReservationWriteOff'
import EmptyPage from '@/components/generics/EmptyPage'
import Api from '@/mixins/modules/workbench'
import Pagination from '@/components/generics/Pagination'
import imageScale from '@/mixins/utilities/imageScale'

export default {
  name: 'GroupPurshareRecord',
  mixins: [Api, imageScale],
  components: {
    ReservationWriteOff,
    EmptyPage,
    Pagination,
  },
  data () {
    return {
      isInitiated: false,
      theadConfig: [
        {
          name: '时间',
          width: '120',
        },
        {
          name: '商户名称',
          width: '120',
        },
        {
          name: '团单名称',
          width: '160',
        },
        {
          name: '团单编号',
          width: '100',
        },
        {
          name: '核销金额',
          width: '120',
        },
        {
          name: '订单编号',
          width: '90',
        },
        {
          name: '手机号',
          width: '140',
        },
      ],
      list: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
    }
  },
  methods: {
    // 获取核销列表数据
    async getList () {
      try {
        const {response, result} = await this.getGroupPurchaseApi({
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
          keyword: '',
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(element => {
            element.write_off_at = this.changeDateTime(element.write_off_at)
          })
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取团购核销列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取团购核销列表失败',
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
    /**
     * 时间戳转年月日
     * @val  时间戳
     */
    changeDateTime (val) {
      if (!val) {
        return ''
      }
      let date = new Date(val * 1000)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = this.judgeTime(date.getDate()) + ' '
      // let h = this.judgeTime(date.getHours()) + ':'
      // let m = this.judgeTime(date.getMinutes())
      return Y + M + D
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
    this.getList() // 获取核销列表数据
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp';

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
</style>
