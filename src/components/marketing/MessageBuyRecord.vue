<template lang="pug">
  .section-layout
    .nav-title 购买记录
      .nav-back-btn(@click="goBack")
    .section-filter
      .field-group.is-horizontal
        .field
          label.label 起止时间
          .field.is-horizontal
            date-picker.w-160(type="single", placeholder="选择开始时间", v-model="start_time")
            span.margin 至
            date-picker.w-160(type="single", placeholder="选择结束时间", v-model="end_time")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset") 重置
    empty-page(v-if="list.length === 0 && isInitiated", :tip="'暂无数据'")
    .content-wrapper.list-wrapper(v-if="list.length && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="300") 购买时间
              td(width="300") 购买数量
              td(width="300") 购买金额
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.paid_at")
              td
                .simple-td(v-text="item.count")
              td
                .multi-content-td.textzh(v-text="item.price/100+'元'")
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
</template>


<script>
import Pagination from '@/components/generics/Pagination'
import EmptyPage from '@/components/generics/EmptyPage'
import DatePicker from '@/components/generics/form/DatePicker'
import Api from '@/mixins/modules/marketing'
import FormateDate from '@/mixins/utilities/formateDate'
export default {
  name: 'MessageBuyRecord',
  mixins: [Api, FormateDate],
  components: {
    Pagination,
    EmptyPage,
    DatePicker,
  },
  data () {
    return {
      paginationData: {
        current_page: 1,
        per_page: 50,
        last_page: 2,
        total: 0,
      },
      start_time: '',
      end_time: '',
      is_true: true, // 开始是否大于结束
      list: [
        {
          name: 1,
        },
        {
          name: 1,
        },
      ],
    }
  },
  watch: {
    'start_time': function (newVal, oldVal) {
      let start = 0
      let end = 0
      if (newVal === '') {
        newVal = 0
      } else {
        start = this.start_time.replace(/-/g, '') - 0
        this.end_time === '' ? end = 0 : end = this.end_time.replace(/-/g, '') - 0
      }
      (start - end > 0 && end !== 0) ? this.is_true = false : this.is_true = true
    },
    'end_time': function (newVal, oldVal) {
      let start = 0
      let end = 0
      if (newVal === '') {
        newVal = 0
      } else {
        this.start_time === '' ? start = 0 : start = this.start_time.replace(/-/g, '') - 0
        end = this.end_time.replace(/-/g, '') - 0
      }
      (start - end > 0 && start !== 0) ? this.is_true = false : this.is_true = true
    },
  },
  methods: {
    // 搜索
    search () {
      if (!this.is_true) {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'failure',
          title: '开始时间不能大于结束时间',
          resolve: () => {
            this.$emit('failure')
          },
        })
        return false
      }
      this.paginationData.current_page = 1
      this.fetchList()
    },
    // 重置
    reset () {
      this.start_time = ''
      this.end_time = ''
      this.paginationData.current_page = 1
      this.fetchList()
    },
    // 分页操作
    paging (state) {
      this.paginationData = state
      this.fetchList()
    },
    // 获取购买记录列表
    async fetchList () {
      let start = ''
      let end = ''
      if (this.start_time !== '' || this.end_time !== '') {
        start = new Date(this.start_time.replace(/-/g, '/'))
        end = new Date(this.end_time.replace(/-/g, '/'))
        start = start.getTime() || 0
        end = end.getTime() || 0
      }
      try {
        const {response, result} = await this.getPurchaseListApi({
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
          start_time: (start - 0) / 1000,
          end_time: (end - 0) / 1000,
        })
        if (response.status === 200 && result.code === 0) {
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取短信详情失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取短信详情失败',
          content: '服务异常，请稍后再试',
        })
      }
      this.isInitiated = true
    },
    // 返回上一页
    goBack () {
      this.$router.go(-1)
    },
  },
  mounted () {
    this.fetchList()
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins';
td
  vertical-align middle !important
.multi-content-td
  vertical-align middle
.textzh
  text-overflow ellipsis
  overflow hidden
  white-space normal
  padding-right 40px
.nav-title
  width 100%
  height 48px
  background-color #ffffff
  line-height 48px
  padding-left 60px
.nav-back-btn
  position absolute
  top 9px
  left 16px
  width 32px
  height 32px
  border-radius 100%
  background #CED3DC center no-repeat url('~@/assets/back.svg')
  background-size 16px
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
  cursor pointer
  z-index 2
</style>

