<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .section-filter
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="query_data.keyword", placeholder="搜索用户/手机号/名称", @keyupEnter="applyFilter")
        .field.staff-wrapper
          label.label 交易时间
          date-picker(type="range", placeholder="请选择交易区间", v-model="query_data.time",)
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前没有交易记录'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="120") 用户
              td(width="80") 手机号
              td(width="100") 交易时间
              td(width="60") 交易数量
              td(width="100") 名称
              td(width="100") 交易订单
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .multi-content-td.has-image
                  .left-image.round
                    img(v-if="item.avatar", :src="scaleImage(item.avatar, 1, 36, 36)")
                    img(v-if="!item.avatar", src="../../../assets/user-avatar.png")
                  .right-txt {{item.nick_name}}
              td
                .simple-td {{item.mobile}}
              td
                .simple-td(v-text="formateDate(item.paid_at, true, 2)")
              td
                .simple-td {{item.quantity}}
              td {{item.item_title}}
              td
                .operation-td
                  span.operation-link(@click="goOrder(item)") {{item.trade_order_no}}
      .tfoot(v-if="true")
        pagination(:pagination-data="pagination_data", @input="paging")
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import Pagination from '@/components/generics/Pagination'
  import SpikeApi from '@/mixins/modules/Spike'
  import filterTools from '@/mixins/utilities/filterTools'
  import imageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import DatePicker from '@/components/generics/form/DatePicker'
  import FormateDate from '@/mixins/utilities/formateDate'
  export default {
    name: 'GroupMangeList',
    mixins: [SpikeApi, filterTools, imageScale, FormateDate],
    components: {
      CustomInput,
      EmptyPage,
      Pagination,
      CustomSelect,
      DatePicker,
    },
    data: _ => {
      const schema = {
        show_product: false,    // 控制商品
        show_serve: false, // 控制服务
        is_initiated: false,
        pagination_data: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        query_data: {
          keyword: '',
          time: '',
        },
        list: [],
      }
      return schema
    },
    methods: {
      // 返回操作
      goBack () {
        this.$router.push({
          name: 'spikeList',
          query: {
            save: 1,
          },
        })
      },
      // 去订单详情
      goOrder (item) {
        this.$router.push({
          name: 'orderDetail',
          params: {
            id: item.trade_order_id,
          },
        })
      },
      async fetchData () {
        let params = {
          type: this.$route.query.spike_type,
          seckill_id: this.$route.query.id,
          keyword: this.query_data.keyword,
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
        }
        if (params.type - 0 > 2) params.seckill_id = this.$route.query.spike_id
        if (this.query_data.time) {
          let startTime = new Date(this.query_data.time.split(' 至 ')[0] + ' 00:00').getTime() / 1000
          let endTime = new Date(this.query_data.time.split(' 至 ')[1] + ' 23:59:59').getTime() / 1000
          params.start_time = startTime
          params.end_time = endTime
        }
        try {
          const {response, result} = await this.spikeOrderListApi(params)
          if (response.status === 200 && result.code === 0) {
            this.list.splice(0, this.list.length, ...result.data)
            this.pagination_data = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取交易记录失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取交易记录失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.is_initiated = true
      },
      // 搜索
      applyFilter () {
        this.pagination_data.current_page = 1
        this.fetchData()
      },
      // 重置
      resetFilter () {
        this.query_data = {
          keyword: '',
          time: '',
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
      this.fetchData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .right-txt
    line-height 36px
  .nav-back-btn
    position absolute
    top -36px
    left 16px
    width 32px
    height 32px
    border-radius 100%
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
    cursor pointer
    z-index 999
  .section-filter
    display flex
    justify-content space-between
  .keyword-wrapper
    width 244px
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
  .section-layout
    height calc(100% - 48px)
  .list-wrapper
    height calc(100% - 90px) !important
</style>
