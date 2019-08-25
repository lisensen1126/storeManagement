<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="query_data.keyword", placeholder="请输入商品/服务名称/养护卡", @keyupEnter="applyFilter")
        .field.staff-wrapper
          label.label 状态查询
          custom-select(v-model="query_data.status", :list="status_list")
        .field
          label.label 开团时间
          .field.is-horizontal
            date-picker(type="single", placeholder="选择开团时间", v-model="query_data.start_time", @input="changeStart")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前没有拼团记录'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="80") 开团时间
              td(width="120") 名称
              td(width="60") 成团有效期
              td(width="80") 团长
              td(width="60") 参团/成团人数
              td(width="60") 成团时间
              td(width="60") 状态
              td(width="100") 操作
          tbody(v-if="list.length")
            tr(v-for="item in list")
              td
                .simple-td(v-text="formateDate(item.start_time, true, 2)")
              td
                .simple-td {{item.product_name}}
              td
                .simple-td {{item.time}}时
              td
                .simple-td {{item.nick_name}}
              td
                .simple-td
                  span {{item.order_num}}/{{item.num}}
              td
                .simple-td(v-if="item.status === 2",v-text="formateDate(item.end_time, true, 2)")
                .simple-td(v-else) --
              td
                .simple-td(v-if="item.status === 1") 拼团中
                .simple-td(v-if="item.status === 2") 已成团
                .simple-td(v-if="item.status === 3") 已失败
              td
                .operation-td
                  span.operation-link(@click="goRecord(item)") 查看详情
      .tfoot(v-if="true")
        pagination(:pagination-data="pagination_data", @input="paging")
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import Pagination from '@/components/generics/Pagination'
  import filterTools from '@/mixins/utilities/filterTools'
  import EmptyPage from '@/components/generics/EmptyPage'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import DatePicker from '@/components/generics/form/DatePicker'
  import GroupApi from '@/mixins/modules/Group'
  import FormateDate from '@/mixins/utilities/formateDate'
  export default {
    name: 'GroupRecordsList',
    mixins: [GroupApi, filterTools, FormateDate],
    components: {
      CustomInput,
      EmptyPage,
      Pagination,
      CustomSelect,
      DatePicker,
    },
    data: _ => {
      const schema = {
        is_initiated: false,
        pagination_data: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        query_data: {
          keyword: '',
          start_time: '',
          status: {
            id: '',
            name: '全部',
          },
        },
        status_list: [{
          id: '',
          name: '全部',
        }, {
          id: 1,
          name: '拼团中',
        }, {
          id: 2,
          name: '已成团',
        }, {
          id: 3,
          name: '已失败',
        }],
        list: [],
      }
      return schema
    },
    methods: {
      /*
      * 搜索时间
      * @time 时间
      * */
      changeStart (time) {
        this.query_data.start_time = time
      },
      /*
      * 去详情
      * item {obj}
      * */
      goRecord (item) {
        this.$global.query_data = this.query_data
        this.$global.pagination_data = this.pagination_data
        let query = {
          id: item.id,
          history_product_id: item.history_product_id,
          status: item.status,
          group_product_id: item.group_product_id,
        }
        this.$router.push({
          name: item.type === 1 ? 'groupRecord' : item.type === 2 ? 'serveRecord' : 'cardRecord',
          query: query,
        })
      },
      async fetchData () {
        let params = {
          product_name: this.query_data.keyword,
          status: this.query_data.status.id,
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
        }
        if (this.query_data.start_time) {
          let startTime = new Date(this.query_data.start_time).getTime() / 1000
          params.created_at = startTime
        }
        try {
          const {response, result} = await this.groupRecordListApi(params)
          if (response.status === 200 && result.code === 0) {
            this.list.splice(0, this.list.length, ...result.data)
            this.list.forEach(function (v) {
              v.is_show === 1 ? v.is_selecteed = true : v.is_selecteed = false
            })
            this.pagination_data = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取拼团记录列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取拼团记录列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.is_initiated = true
      },
      applyFilter () {
        this.pagination_data.current_page = 1
        this.fetchData()
      },
      // 重置
      resetFilter () {
        this.query_data = {
          keyword: '',
          start_time: '',
          status: {
            id: '',
            name: '全部',
          },
        }
        this.pagination_data.current_page = 1
        this.fetchData()
      },
      paging (state) {
        this.pagination_data = state
        this.fetchData()
      },
      formatTime (date) {
        return date.slice(0, 10)
      },
    },
    mounted () {
      console.log(122333)
      if (this.$global.pagination_data) {
        this.pagination_data = this.$global.pagination_data
        this.query_data = this.$global.query_data
      }
      console.log(3333333)
      this.fetchData()
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
  .button
    align-items center
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
  .section-layout
    height calc(100% - 48px)
  .list-wrapper
    height calc(100% - 90px) !important
</style>
