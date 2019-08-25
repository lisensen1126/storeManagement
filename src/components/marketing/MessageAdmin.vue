<template lang="pug">
  .section-layout.height-100(ref="scrolls")
    .content-wrapper.p-b-0
      .section-filter.height-auto
        .field-group.is-horizontal
          .field
            a.button.primary(@click="topUp") 短信充值
          .field
            a.button(@click="buyRecord") 查看购买记录
      .section-filter.height-auto.display-block
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 企业短信账户
        .field-group.is-horizontal
          .field.message-send
            .message-send-title
              label.label 短信余量
            .message-send-data(v-text="(statistical.surplus ? statistical.surplus : 0) + '条'") 223451条
          .field.message-send
            .message-send-title
              label.label 本月发送
            .message-send-data(v-text="(statistical.month_total ? statistical.month_total : 0) + '条'") 223451条
          .field.message-send
            .message-send-title
              label.label 累计发送
            .message-send-data(v-text="(statistical.use_total ? statistical.use_total : 0) + '条'") 223451条
    .content-wrapper
      .section-filter.height-auto
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 发送记录
      .section-filter
        .field-group.is-horizontal
          .field.keyword-wrapper.keywords
            label.label 关键字搜索
            custom-input(v-model.trim="filterData.keyword", placeholder="按发送内容/模版名称搜索", @keyupEnter="applyFilter")
          .field.staff-wrapper.store-list
            label.label 按门店筛选
            custom-select(v-model="filterData.store_status", :list="store_list", nameField="store_name")
          .field.staff-wrapper
            label.label 按分类筛选
            custom-select(v-model="filterData.calssify_status", :list="calssifyList")
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
      empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有发送记录'")
      .list-wrapper(v-if="list && list.length")
        .table-wrapper
          table.table
            thead
              tr
                td(width="150") 模版名称
                td(width="90") 模版分类
                td(width="100") 发送内容
                td(width="80") 发送时间
                td(width="80") 发送目标数
                td(width='80') 送达目标数
                td(width='120') 操作门店
                td(width='60') 操作
            tbody(v-if="list.length")
              tr(v-for="(item, index) in list")
                td
                  .simple-td(v-text="item.module_name")
                td
                  .simple-td(v-text="item.module_category_name")
                td
                  .simple-td.width-fixed(v-text='item.content')
                td
                  .simple-td(v-text='item.created_at')
                td
                  .simple-td(v-text='item.mobile_number')
                td
                  .simple-td(v-text='item.success_of_bars')
                td
                  .simple-td(v-text='item.store_name')
                td
                  .operation-td
                    span.operation-link(@click="lookDetail(item.id)") 查看
        .tfoot(v-if="list.length")
          pagination(:pagination-data="paginationData", @input="paging")
</template>


<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import StorePicker from '@/components/generics/form/StorePicker'
import Pagination from '@/components/generics/Pagination'
import marketingMixin from '@/mixins/modules/marketing'
import { mapGetters } from 'vuex'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import DatePicker from '@/components/generics/form/DatePicker'

export default {
  name: 'MessageAdmin',
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
      calssifyList: [],
      // 搜索对象
      filterData: {
        keyword: '',
        store_status: {
          store_id: '',
          store_name: '全部',
        },
        calssify_status: {
          id: '',
          name: '全部',
        },
        start_time: '',
        end_time: '',
      },
      // 活动列表
      list: [1, 2],
      statistical: {},
      is_true: true, // 开始是否大于结束
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
  computed: {
    ...mapGetters({
      store_list: 'stores',
    }),
  },
  methods: {
    // 获取短信发送列表接口
    async fetchData () {
      try {
        let search = {
          keyword: this.filterData.keyword,
          store_id: this.filterData.store_status.store_id,
          module_category_id: this.filterData.calssify_status.id,
          end_time: this.filterData.end_time.length > 0 ? new Date(this.filterData.end_time + ' 23:59:59').getTime() / 1000 : '',
          start_time: this.filterData.start_time.length > 0 ? new Date(this.filterData.start_time + ' 00:00').getTime() / 1000 : '',
        }
        const {response, result} = await this.getSmsSendList({
          search: JSON.stringify(search),
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200) {
          // result.data.forEach(element => {
          //   element.created_at = this.changeDateTime(element.created_at, 'datetime')
          // })
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取发送列表失败',
            content: `${result && result.code ? ' ' + result.code + result.message : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取发送列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 获取短信统计
    async getStatistical () {
      try {
        const {response, result} = await this.getStatisticalApi()
        if (response.status === 200) {
          if (result.code === 0) {
            this.statistical = result.data
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取统计列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        console.log(err)
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取统计列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 获取分类统计
    async getClassfiyList () {
      try {
        const {response, result} = await this.getSmsTemplateApi()
        if (response.status === 200) {
          if (result.code === 0) {
            this.calssifyList = result.data
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取分类列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        console.log(err)
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取分类列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 搜索按钮
    applyFilter () {
      if (!this.is_true && this.filterData.end_time !== '') {
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
      this.paginationData.current_page = 1
      this.fetchData()
    },
    // 重置按钮
    resetFilter () {
      this.filterData.keyword = ''
      this.filterData.store_status = {
        store_id: '',
        store_name: '全部',
      }
      this.filterData.calssify_status = {
        id: '',
        name: '全部',
      }
      this.filterData.end_time = ''
      this.filterData.start_time = ''
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
    /**
     * @{params} item 点击的条数
     * 跳转到相对应的详情
     */
    lookDetail (id) {
      this.$global.filterData = this.filterData
      this.$global.paginationData = this.paginationData
      this.$router.push({
        name: 'smsdetail',
        query: {
          id: id,
        },
      })
    },
    // 查看购买记录
    buyRecord () {
      this.$router.push({
        name: 'messageBuyRecord',
      })
    },
    // 充值
    topUp () {
      console.log(11)
      this.$router.push({
        name: 'messagePay',
      })
    },
  },
  mounted () {
    if (this.$global.paginationData) {
      this.paginationData = this.$global.paginationData
      this.filterData = this.$global.filterData
    }
    this.getClassfiyList()
    this.fetchData()
    this.getStatistical()
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
.margin
  margin 0 8px
  font-size 14px
.p-b-0
  padding-bottom 0
.display-block
  display block
.height-auto
  height auto
.section-filter
  background #fff
.message-send
  display flex
  width 300px
  height 120px
  padding 15px 20px
  margin-top 20px
  flex-direction column
  justify-content space-between
  border 1px solid #eeeeee
.message-send-data
  text-align right
.height-100
  height calc(100% - 56px)
  display block
  overflow-y auto
.tfoot
  bottom initial
.empty-page-wrapper
  margin-top 50px
.width-fixed
  width 400px !important
.store-list
  width 240px !important
.keywords
  width 180px !important
</style>
