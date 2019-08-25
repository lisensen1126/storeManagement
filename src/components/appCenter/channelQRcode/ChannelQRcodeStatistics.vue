<template lang="pug">
  //- 渠道二维码数据统计页面
  .section-layout.content
    .section-filter.field-group.is-horizontal
      .field.keyword-wrapper
        label.label 关键字搜索
        custom-input(v-model.trim="keyword", placeholder="请输入二维码名称", @keyupEnter="search")
      .field
        label.label 时间查询
        date-picker(type="single", placeholder="选择开始时间", v-model="start_time")
      .field
        date-picker(type="single", placeholder="选择结束时间", v-model="end_time")
      .field
        a.button.primary(@click="search") 搜索
      .field
        a.button(@click="reset") 重置
      .field
        a.button(@click="exportTable") 导出
      .time
        div.day(:class="[date_type===1? 'active' : '']", @click="changeTime(1)") 今日
        div.month(:class="[date_type===2? 'active' : '']", @click="changeTime(2)") 本月
    empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有海报统计数据")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td.line-ellipsis-2(
                  :style="'overflow: hidden;text-overflow: ellipsis;display: -webkit-box !important;-webkit-line-clamp: 2;-webkit-box-orient: vertical;width:280px !important;white-space: normal !important;padding-right: 12px;'"
                  v-text="item.name")
              td
                .simple-td(v-if="item.cid === 1") 线上渠道
                .simple-td(v-if="item.cid === 2") 线下渠道
              td
                .simple-td(v-text="item.qr_code_pv")
              td
                .simple-td(v-text="item.qr_code_uv")
              td
                .simple-td(v-text="item.register_num")
              td
                .simple-td(v-text="item.register_num")
              td
                .simple-td(v-text="item.order_num")
              td
                .simple-td ￥ {{accDiv(item.order_amount, 100) | money}}
              td
                .operation-td
                  a.operation-link(@click="viewDetail(item.id)") 查看明细
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
import AppCenterApi from '@/mixins/modules/AppCenter'
var enterPath = '' // 临时 path 变量

export default {
  name: 'PosterStatisticsList', // 应用中心 -->  海报统计页面
  mixins: [Api, imageScale, MathFun, AppCenterApi],
  components: {
    EmptyPage,
    CustomInput,
    Pagination,
    DatePicker,
  },
  data () {
    return {
      root,
      date_type: 1, // 本月-今日
      isInitiated: false,    // 页面初始状态
      theadConfig: [
        {
          name: '二维码名称',
          width: '300',
        }, {
          name: '分类',
          width: '150',
        },
        {
          name: '扫码人数',
          width: '80',
        }, {
          name: '扫码次数',
          width: '80',
        }, {
          name: '新增注册用户',
          width: '120',
        }, {
          name: '下单人数',
        }, {
          name: '订单笔数',
        }, {
          name: '订单金额',
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
  filters: {
    money (val) {
      if (!val) {
        return '0.00'
      } else {
        return val.toFixed(2)
      }
    },
  },
  computed: {
    ...mapGetters({
      currentEnterprise: 'currentEnterprise',
    }),
  },
  methods: {
    // 获取二维码统计数据列表
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
        const { response, result } = await this.channelQRcodeStatistics(data)
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
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
        // 今日或搜索
    changeTime (type) {
      if (this.date_type === type || this.date_type === 3) {
        return
      }
      if (type === 1) {
        this.date_type = 1
      } else {
        this.date_type = 2
      }
      this.search()
    },
    // 搜索
    search () {
      if (this.start_time || this.end_time) {
        this.date_type = 3 // 如果选了起止时间，则今日本月按钮不可点，置灰。
        // this.sendData.start_time = this.start_time ? parseInt(new Date(this.start_time + ' 00:00').getTime() / 1000) : ''
        // this.sendData.end_time = this.end_time ? parseInt(new Date(this.end_time + ' 23:59:59').getTime() / 1000) : ''
      }
      this.is_search = true
      this.paginationData.current_page = 1
      this.queryData.keyword = this.keyword
      this.queryData.start_time = this.start_time
      this.queryData.end_time = this.end_time
      this.getList()
    },
    // 重置
    reset () {
      this.date_type = 1 // 每次重置需要将今日-本月重置为可点
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
      // 查看二维码明细
      this.$store.dispatch('setCurrentPageStorage', this.paginationData.current_page)
      this.$router.push({
        name: 'channelQRcodeDetail',
        query: {
          qrCodeId: id,
        },
      })
    },
  },
  created () {
  },
  mounted () {
    this.reset()
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
.line-ellipsis-2 {
     overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
      width:170px !important;
    white-space normal !important;
  }
.time {
  position: absolute;
  right: 40px;
  bottom: 20px;
  border-radius: 3px;
  border: 1px solid #D9D9D9;
  box-sizing: border-box;
}
.time .day, .time .month{
  display: inline-block;
  width: 78px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  font-size: 14px;
  border-radius: 3px;
  background: #D9D9D9;
  color: #9A9B9A;
  cursor: pointer;
}
.active {
  color: #121212!important;
  background: #FFFFFF!important;
}
</style>
