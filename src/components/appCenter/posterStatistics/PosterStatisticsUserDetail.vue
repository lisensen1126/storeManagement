<template lang="pug">
  //- 此页面为从拼团，秒杀，养护卡海报的查看明细操作跳入
  .section-layout
    .section-filter.field-group.is-horizontal
      .field.keyword-wrapper
        label.label 关键字搜索
        custom-input(v-model.trim="keywords", placeholder="请输入微信昵称/手机号", @keyupEnter="search")
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
    empty-page(v-if="!(list && list.length)", tip="当前没有用户明细数据")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              //- td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
              td(width="100") 微信昵称
              td 头像
              td 手机号
              td 最新扫码时间
              td 下单数
              td 订单号
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td.line-ellipsis-2(
                  :style="'overflow: hidden;text-overflow: ellipsis;display: -webkit-box !important;-webkit-line-clamp: 1;-webkit-box-orient: vertical;width:180px !important;white-space: normal !important;padding-right: 12px;'"
                  v-text="item.nickname")
              td
                .multi-content-td.has-image
                  .left-image.round
                    img(v-if="item.avatar", :src="scaleImage(item.avatar, 1, 36, 36)")
                    img(v-if="!item.avatar", src="../../../assets/user-avatar.png")
              td
                .simple-td(v-text="item.mobile")
              //- 最新扫码时间
              td
                .simple-td {{(item.created_at - 0) | date("yyyy-MM-dd HH:mm:ss", "cn")}}
              //- 下单量
              td
                .simple-td {{item.order_count}}
              //- 订单号
              td
                .simple-td {{formatOrderNum(item.order_no)}}
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
import filterTools from '@/mixins/utilities/filterTools'

export default {
  name: 'posterStatisticsDetail', // 应用中心 -->  海报统计 -- >海报详情页面
  mixins: [Api, imageScale, MathFun, AppCenterApi, filterTools],
  components: {
    EmptyPage,
    CustomInput,
    Pagination,
    DatePicker,
  },
  data () {
    return {
      root,
      isInitiated: false, // 在请求数据的时候先不显示暂无数据页面
      from_type: null,
      from_id: null,
      list: [],
      queryData: {
        keywords: '',
        end_time: '',
        start_time: '',
      }, // 搜索条件取这里边的值，每次点击搜索之后，将搜索条件更新再去请求，否则不更新搜索条件
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      keywords: '',
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
    formatOrderNum (orderNum) {
      // 如果订单号不止一个则需显示为123/123
      if (orderNum.length === 1) {
        return '' + orderNum[0]
      } else {
        let str = ''
        for (let i = 0; i < orderNum.length; i++) {
          str = str + orderNum[i] + '/'
        }
        return str.slice(0, str.length - 1)
      }
    },
    // 获取当前用户明细列表
    async getList () {
      try {
        let data = {
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        }
        if (this.queryData.start_time) {
          data.start_time = new Date(this.queryData.start_time + ' 00:00:00').getTime() / 1000
        }
        if (this.queryData.end_time) {
          data.end_time = new Date(this.queryData.end_time + ' 23:59:59').getTime() / 1000
        }
        if (this.queryData.keywords) {
          data.keywords = this.queryData.keywords
        }
        data.from_type = this.$route.query.type - 0
        data.from_id = this.$route.query.id - 0
        data.relation_id = this.$route.query.relation_id - 0
        const { response, result } = await this.getPosterStatisticsUserDetailListApi(data)
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取用户明细失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取用户明细失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 搜索
    search () {
      this.is_search = true
      this.paginationData.current_page = 1
      this.queryData.start_time = this.start_time
      this.queryData.end_time = this.end_time
      this.queryData.keywords = this.keywords
      this.getList()
    },
    // 重置
    reset () {
      this.is_search = false
      this.queryData.keywords = ''
      this.queryData.start_time = ''
      this.queryData.end_time = ''
      this.keywords = ''
      this.start_time = ''
      this.end_time = ''
      this.paginationData.current_page = 1

      this.getList()
    },
    // 重置参数但不发送请求
    resetParams () {
      // this.is_search = false
      this.keywords = ''
      this.start_time = ''
      this.end_time = ''
    },
    // 导出表格
    exportTable () {
      let params = ''
      if (this.start_time) {
        let startTime = new Date(this.start_time + ' 00:00:00').getTime() / 1000
        params = params + `start_time=${startTime}&`
      }
      if (this.end_time) {
        let endTime = new Date(this.end_time + ' 23:59:59').getTime() / 1000
        params = params + `end_time=${endTime}&`
      }
      params = params + `keywords=${this.queryData.keywords}&`
      params = params + `relation_id=${this.$route.query.relation_id}&`
      params = params + `from_type=${this.from_type}&`
      params = params + `from_id=${this.from_id}`
      window.open(`${this.root}/poster/poster_customer_detail_export?${params}`)
    },
    // 分页跳转
    paging (state) {
      this.paginationData = state
      this.getList()
    },
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
  mounted () {
    this.getList()
    this.from_type = this.$route.query.type
    this.from_id = this.$route.query.id
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
.center{
  text-align: center;
}
</style>
