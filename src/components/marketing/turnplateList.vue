<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.staff-wrapper
          label.label 状态查询
          custom-select(v-model="filterData.status", :list="statusList")
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filterData.keyword", placeholder="活动名称", @keyupEnter="applyFilter")
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
              td(width="150") 活动名称
              td(width="90") 活动起止时间
              td(width="100") 参与人数/人次
              td(width="90") 中奖数
              td(width="120") 状态
              td(width="80") 操作
          tbody(v-if="list.length")
            tr(v-for="(coupon, index) in list")
              td
                .simple-td(v-text="coupon.name")
              td
                .simple-td(v-if='coupon.end_time', v-text="coupon.start_time+'~'+coupon.end_time")
                .simple-td(v-if='!coupon.end_time', v-text="'长期'")
              td
                .simple-td(v-text="coupon.join_people+'/'+coupon.join_nums")
              td
               .simple-td(v-text="coupon.store_prize_nums")
              td
                .simple-td
                  span(v-if="coupon.status === 'READYING'") 准备中
                  span(v-if="coupon.status === 'PROGRESSING'") 进行中
                  span(v-if="coupon.status === 'OFF_SHELVES'") 已下架
                  span(v-if="coupon.status === 'FINISHED'") 已结束
              td
                .operation-td
                  span.operation-link(v-if='(coupon.status === "FINISHED" || coupon.status === "OFF_SHELVES") || (coupon.status === "READYING" && coupon.is_join === 1) || (coupon.status === "PROGRESSING" && coupon.is_join === 1)', @click="lookDetail(coupon.activity_id)") 查看
                  span.operation-link(v-if='(coupon.status === "PROGRESSING" || coupon.status === "READYING") && coupon.is_join === 1', @click="deleteConfirm(coupon)") 下架
                  span.operation-link(v-if='(coupon.status === "READYING" || coupon.status === "PROGRESSING") && coupon.is_join === 0', @click="editTurnplate(coupon.activity_id)") 参与
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

export default {
  name: 'turnplateList',
  mixins: [marketingMixin, filterTools, imageScale],
  components: {
    CustomInput,
    CustomSelect,
    StorePicker,
    EmptyPage,
    Pagination,
  },
  data: _ => {
    const schema = {
      isInitiated: false,
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
        id: 'READYING',
        name: '准备中',
      }, {
        id: 'PROGRESSING',
        name: '进行中',
      }, {
        id: 'OFF_SHELVES',
        name: '已下架',
      }, {
        id: 'FINISHED',
        name: '已结束',
      }],
      // 搜索对象
      filterData: {
        keyword: '',
        status: {
          id: '',
          name: '全部',
        },
      },
      // 活动列表
      list: [],
      query_data: {},
      is_first_enter: false, // 是否第一次进入页面
      is_back: false, // 是否返回
    }
    return schema
  },
  methods: {
    // 获取活动列表接口
    async fetchData () {
      try {
        const { response, result } = await this.activeList({
          keyword: this.query_data.keyword,
          status: this.query_data.status.id ? this.query_data.status.id : '',
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
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
            title: '获取活动列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        console.log(err)
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取活动列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 搜索按钮
    applyFilter () {
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
      this.filterData.status = this.statusList[0]
      this.query_data = JSON.parse(JSON.stringify(this.filterData))
      this.paginationData.current_page = 1
      this.fetchData()
    },
    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
    /**
     * 活动下架提示
     * @coupon  活动对象
     */
    deleteConfirm (coupon) {
      this.$store.dispatch('showMessage', {
        type: 'warning',
        title: '提示',
        content: `活动一旦下架，将不能再恢复！确定要将“${coupon.name}”活动下架吗?`,
        isRejectable: 1,
        resolve: () => {
          this.remove(coupon)
        },
      })
    },
    /**
     * 查看活动详情
     * @couponId  活动id
     */
    lookDetail (couponId) {
      this.$router.push({
        name: 'turnplateDetail',
        params: {
          id: couponId,
        },
      })
    },
    /**
     * 编辑活动
     * @couponId  活动id
     */
    editTurnplate (couponId) {
      // 记录列表页数
      this.$store.dispatch('setCurrentPageStorage', this.paginationData.current_page)
      this.$router.push({
        name: 'turnplateAdd',
        params: {
          id: couponId,
        },
      })
    },
    /**
     * 下架活动
     * @coupon  活动对象
     */
    async remove (coupon) {
      try {
        const { response, result } = await this.activeOff({
          activity_id: coupon.activity_id,
        })
        if (response.status === 200) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '下架成功',
          })
          this.fetchData()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '下架失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '下架失败',
          content: `出错啦！错误码：${err}`,
        })
      }
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
  },
  mounted () {
    this.is_first_enter = true
  },
  // keep-alive 激活
  activated () {
    let save = this.$route.query.save
    if (save) this.is_back = true
    if (!this.is_back || this.is_first_enter) this.resetFilter()
    this.is_back = false
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
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
</style>

