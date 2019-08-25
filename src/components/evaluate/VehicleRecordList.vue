<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slide_visible", @input="toggleSidePannel")
      client-car-modal(:id="vehicle_id")
    .section-filter
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filterData.keyword", placeholder="搜索技师/车牌号", @keyupEnter="applyFilter")
        .field
          label.label 按时间筛选
          .field.is-horizontal
            date-picker(type="single", placeholder="选择开始时间", v-model="filterData.start_time")
            span.margin 至
            date-picker(type="single", placeholder="选择结束时间", v-model="filterData.end_time")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有车检记录'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="150") 车检时间
              td(width="90") 车牌号
              td(width="150") 品牌车型
              td(width="90") 正常点
              td(width="90") 异常点
              td(width="90") 需关注
              td(width="90") 未检测
              td(width="70") 技师
              td(width="80") 操作
          tbody(v-if="list.length")
            tr(v-for="(vehicle, index) in list")
              td
                .simple-td(v-text="changeDateTime(vehicle.inspect_time)")
              td
                .simple-td {{vehicle.license_plate}}
              td
                .simple-td {{vehicle.vehicle_name}}
              td
                .simple-td {{vehicle.normal}}
              td
                .simple-td {{vehicle.exception}}
              td
                .simple-td {{vehicle.pending}}
              td
                .simple-td {{vehicle.noninspect}}
              td
                .simple-td {{vehicle.technician_name}}
              td
                .operation-td
                  a.operation-link(@click="vehicleDetail(vehicle.id)") 详情
                  a.operation-link(:href="root + '/inspect/pdf/' + vehicle.id", target="_blank") 打印
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import Pagination from '@/components/generics/Pagination'
import EvaluateMixin from '@/mixins/modules/evaluate'
import filterTools from '@/mixins/utilities/filterTools'
import EmptyPage from '@/components/generics/EmptyPage'
import SlideOutModal from '@/components/generics/SlideOutModal'
import ClientCarModal from '@/components/customer/ClientCarModal'
import DatePicker from '@/components/generics/form/DatePicker'
import {root} from '@/plugins/Fetch'

export default {
  name: 'VehicleRecordList',
  mixins: [EvaluateMixin, filterTools],
  components: {
    CustomInput,
    SlideOutModal,
    EmptyPage,
    Pagination,
    ClientCarModal,
    DatePicker,
  },
  data: _ => {
    const schema = {
      root,
      isInitiated: false,
      // 分页的数据
      paginationData: {
        current_page: 1, // 当前页
        per_page: 15, // 每页的数据
        last_page: 2, // 最后一页
        total: 31, // 总数据
      },
      slide_visible: false,
      // 搜索对象
      filterData: {
        keyword: '',
        start_time: '',
        end_time: '',
      },
      query_data: {},
      // 活动列表
      list: [],
      is_true: true,
    }
    return schema
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
  },
  methods: {
    // 获取活动列表接口
    async fetchData () {
      try {
        const { response, result } = await this.fetchVehicleListApi({
          keywords: this.query_data.keyword,
          start_time: this.query_data.start_time,
          end_time: this.query_data.end_time,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        // console.log(this.queryData.status)
        if (response.status === 200) {
          result.data.forEach(item => {
            item.start_time = this.changeDateTime(item.start_time)
            item.end_time = this.changeDateTime(item.end_time)
          })
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取车检列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取车检列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
    // 搜索按钮
    applyFilter () {
      if (!this.is_true) {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'failure',
          title: '开始时间不能大于结束时间',
          resolve: () => {
            this.$emit('failure')
          },
        })
        return
      }
      for (let key in this.filterData) {
        if (this.query_data.hasOwnProperty(key)) {
          this.query_data[key] = this.filterData[key]
        }
      }
      this.paginationData.current_page = 1
      this.fetchData()
    },
    // 重置按钮
    resetFilter () {
      this.filterData.keyword = ''
      this.filterData.end_time = ''
      this.filterData.start_time = ''
      this.is_true = true
      this.query_data = JSON.parse(JSON.stringify(this.filterData))
      this.paginationData.current_page = 1
      this.fetchData()
    },
    /**
     * 查看活动详情
     * @couponId  活动id
     */
    lookDetail (couponId) {
      // this.$global.filterData = this.filterData
      // this.$global.paginationData = this.paginationData
      // // 记录列表页数
      // this.$store.dispatch('setCurrentPageStorage', this.paginationData.current_page)
      this.$router.push({
        name: 'turnplateDetail',
        params: {
          id: couponId,
        },
      })
    },
    formatTime (date) {
      return date.slice(0, 10)
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
      let h = this.judgeTime(date.getHours()) + ':'
      let m = this.judgeTime(date.getMinutes())
      return Y + M + D + h + m
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
    // 车检详情
    vehicleDetail (id) {
      this.vehicle_id = id
      this.toggleSidePannel()
    },
    toggleSidePannel () {
      this.slide_visible = !this.slide_visible
    },
  },
  mounted () {
    this.query_data = JSON.parse(JSON.stringify(this.filterData))
    this.fetchData()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.section-layout
  height calc(100% - 56px)
.section-filter
  display flex
  justify-content space-between
.keyword-wrapper
  width 244px
.staff-wrapper
  width 120px
.button
  align-items center
.add-icon
  display inline-flex
  width 16px
  height 16px
  background url('~@/assets/icons/button-add.svg') no-repeat center center
  background-size cover
  margin-right 6px
.td-with-tip
  position relative
  display flex
  align-items center
.help-tip-icon
  position relative
  display inline-block
  width 12px
  height 12px
  background url('~@/assets/icons/help.svg') no-repeat center center
  background-size cover
  margin-left 4px
  &:hover
    .help-tip
      display block
.help-tip
  display none
  z-index 213
  position absolute
  top 22px
  left -76px
  width 160px
  padding 4px 6px
  border-radius 2px
  background-color #121212
  color #fff
  font-size 12px
  line-height 18px
  &::after
    content ''
    position absolute
    width 8px
    height 8px
    left 50%
    top -4px
    margin-left -2px
    transform rotate(45deg)
    background-color #121212
.margin
  margin 0 8px
  font-size 14px
</style>


