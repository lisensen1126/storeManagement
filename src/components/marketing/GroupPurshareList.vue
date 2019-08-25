<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filterData.keyword", placeholder="活动名称/活动ID/门店名称", @keyupEnter="applyFilter")
        .field.staff-wrapper
          label.label 状态查询
          custom-select(v-model="filterData.status", :list="statusList")
        .field
          label.label 创建时间
          .field.is-horizontal
            date-picker(type="single", placeholder="选择开始时间", v-model="filterData.start_time")
            span.margin 至
            date-picker(type="single", placeholder="选择结束时间", v-model="filterData.end_time")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有活动'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="150") 团购活动名称
              td(width="90") 团购活动ID
              td(width="100") 活动创建时间
              td(width="90") 活动时间
              td(width="120") 状态
              td(width='150') 门店名称
              td(width='80') 团单数量
                a.icons-help(@mouseover="showCommentModal(1)", @mouseleave="hideCommentModal(1)", @mouseout="CommentModalOut(1)")
                  .modaltips(v-if="isVisible1")
                    transition(name="fade")
                      p 团单数量=团单核销数量/团单销售数量
                    .sanjiao
              td(width='80') 团单金额
                a.icons-help(@mouseover="showCommentModal(2)", @mouseleave="hideCommentModal(2)", @mouseout="CommentModalOut(2)")
                  .modaltips.modaltips2(v-if="isVisible2")
                    transition(name="fade")
                      p 团单金额=团单核销金额/团单销售金额
                    .sanjiao
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.name")
              td
                .simple-td(v-text="item.id")
              td
                .simple-td(v-text='item.created_at')
              td
                .multi-content-td
                  .content-item {{item.sale_begin_date}}<br/>{{item.sale_end_date}}
              td
                .simple-td
                  span(v-if="item.status == '0'") 审核中
                  span(v-if="item.status == '1'") 待发布
                  span(v-if="item.status == '2'") 团购中
                  span(v-if="item.status == '3'") 已拒绝
                  span(v-if="item.status == '4'") 已结束
                  span(v-if="item.status == '5'") 已终止
              td
                .simple-td(v-text='item.store_name')
              td
                .simple-td(v-text='item.write_off_count + "/" + item.sell_count')
              td
                .simple-td(v-text='item.write_off_amount/100 + "/" + item.sell_amount/100')
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import StorePicker from '@/components/generics/form/StorePicker'
import Pagination from '@/components/generics/Pagination'
import marketingMixin from '@/mixins/modules/marketing'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import DatePicker from '@/components/generics/form/DatePicker'

export default {
  name: 'GroupPurshareList',
  mixins: [marketingMixin, filterTools, imageScale],
  components: {
    CustomInput,
    CustomSelect,
    StorePicker,
    EmptyPage,
    Pagination,
    DatePicker,
  },
  data: _ => {
    const schema = {
      isInitiated: false,
      isVisible1: false,
      isVisible2: false,
        // 分页的数据
      paginationData: {
        current_page: 1, // 当前页
        per_page: 15, // 每页的数据
        last_page: 2, // 最后一页
        total: 31, // 总数据
      },
      // 活动状态
      statusList: [{
        id: '',
        name: '全部',
      }, {
        id: '0',
        name: '审核中',
      }, {
        id: '1',
        name: '待发布',
      }, {
        id: '2',
        name: '团购中',
      }, {
        id: '3',
        name: '已拒绝',
      }, {
        id: '4',
        name: '已结束',
      }, {
        id: '5',
        name: '已终止',
      }],
      // 搜索对象
      filterData: {
        keyword: '',
        status: {
          id: '',
          name: '全部',
        },
        start_time: '',
        end_time: '',
      },
      // 活动列表
      list: [],
      is_true: true, // 开始是否大于结束
      query_data: {},
      is_first_enter: false, // 是否第一次进入页面
      is_back: false, // 是否返回
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
        const {response, result} = await this.getTuanDanListApi({
          keyword: this.query_data.keyword,
          status: this.query_data.status.id,
          end_time: this.query_data.end_time.length > 0 ? new Date(this.query_data.end_time + ' 23:59:59').getTime() / 1000 : '',
          start_time: this.query_data.start_time.length > 0 ? new Date(this.query_data.start_time + ' 00:00').getTime() / 1000 : '',
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200) {
          result.data.forEach(element => {
            element.sale_begin_date = this.changeDateTime(element.sale_begin_date, 'data')
            element.sale_end_date = this.changeDateTime(element.sale_end_date, 'data')
            element.created_at = this.changeDateTime(element.created_at)
          })
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取活动列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取活动列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 鼠标在上面
    showCommentModal (type) {
      window.clearTimeout(this.hideTimeout)
      if (type === 1) {
        this.isVisible1 = true
      } else {
        this.isVisible2 = true
      }
    },
    // 鼠标离开
    hideCommentModal (type) {
      if (type === 1) {
        this.isVisible1 = false
      } else {
        this.isVisible2 = false
      }
    },
    // 鼠标进入
    CommentModalOut (type) {
      window.clearTimeout(this.hideTimeout)
      if (type === 1) {
        this.hideTimeout = setTimeout(() => {
          this.isVisible1 = false
        }, 200)
      } else {
        this.hideTimeout = setTimeout(() => {
          this.isVisible2 = false
        }, 200)
      }
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
      this.is_first_enter = false
      this.filterData.keyword = ''
      this.filterData.status = {
        id: '',
        name: '全部',
      }
      this.filterData.end_time = ''
      this.filterData.start_time = ''
      this.query_data = JSON.parse(JSON.stringify(this.filterData))
      this.paginationData.current_page = 1
      this.is_true = true
      this.fetchData()
    },
    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.paginationData = state
      this.recallFilter()
      this.fetchData()
    },
    formatTime (date) {
      return date.slice(0, 10)
    },
    /**
     * 时间戳转年月日
     * @val  时间戳
     */
    changeDateTime (val, type) {
      if (!val) {
        return ''
      }
      let date = new Date(val * 1000)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = this.judgeTime(date.getDate()) + ' '
      let h = this.judgeTime(date.getHours()) + ':'
      let m = this.judgeTime(date.getMinutes())
      if (type === 'data') {
        return Y + M + D
      } else if (type === 'datetime') {
        return Y + M + D + h + m
      } else {
        return Y + M + D + h + m
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
    this.is_first_enter = true
  },
  // keep-alive进入
  activated () {
    let save = this.$route.query.save
    if (save) this.is_back = true
    if (!this.is_back || this.is_first_enter) this.resetFilter()
    this.is_back = false
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.section-filter {
    display: flex;
    justify-content: space-between;
}

.keyword-wrapper {
    width: 244px;
}

.staff-wrapper {
  width 120px
}

.button {
    align-items: center;
}

.add-icon {
    display: inline-flex;
    width: 16px;
    height: 16px;
    background: url('~@/assets/icons/button-add.svg') no-repeat center center;
    background-size: cover;
    margin-right: 6px;
}

.td-with-tip {
    position: relative;
    display: flex;
    align-items: center;
}

.help-tip-icon {
    position: relative;
    display: inline-block;
    width: 12px;
    height: 12px;
    background: url('~@/assets/icons/help.svg') no-repeat center center;
    background-size: cover;
    margin-left: 4px;

    &:hover {
        .help-tip {
            display: block;
        }
    }
}

.help-tip {
    display: none;
    z-index: 213;
    position: absolute;
    top: 22px;
    left: -76px;
    width: 160px;
    padding: 4px 6px;
    border-radius: 2px;
    background-color: #121212;
    color: #fff;
    font-size: 12px;
    line-height: 18px;

    &::after {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        left: 50%;
        top: -4px;
        margin-left: -2px;
        transform: rotate(45deg);
        background-color: #121212;
    }
}
.icons-help
  position relative
  background center no-repeat url('~@/assets/icons/icons_help.svg')
  background-size 100% 100%
  display inline-block
  width 14px
  height 14px
  margin-top -2px
  margin-left 5px
  vertical-align middle
.modaltips
  width 172px
  box-sizing border-box
  background rgba(0,0,0,0.8)
  border-radius 2px
  box-shadow 0 0 0 0 rgba(0, 0, 0, .05), 0 2px 12px -1px rgba(0, 0, 0, .10)
  padding 5px 8px
  font-size 12px
  line-height 18px
  color #fff
  position absolute
  z-index 11
  bottom -60px
  left calc(50% -6px)
  transform translateX(calc(-50% + 6px))
  .sanjiao
    width 8px
    position absolute
    left 0
    right 0
    margin auto
    top -8px
    border-width 0 8px 8px
    border-style solid
    border-color #f0f1f2 #f0f1f2 rgba(0,0,0,0.8)
.modaltips2
  left calc(50% - 50px)
  .sanjiao
    left 90px
.margin
  margin 0 8px
  font-size 14px
</style>

