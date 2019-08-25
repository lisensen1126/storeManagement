<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filter_data.keyword", placeholder="搜索名称", @keyupEnter="search")
        .field
          label.label 养护卡分类
          custom-select(v-model="filter_data.ways", :list="get_ways")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="resetFilter") 重置
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'暂无数据'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="120") 名称
              td(width="100") 卡面
              td(width="50") 分类
              td(width="100") 来源
              td(width="100") 价格
              td(width="70") 已售出
              td(width="140") 实收金额
              td(width="70") 状态
              td(width="70") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.name}}
              td
                .simple-td
                  img.img(:src="item.image_url")
              td
                .simple-td {{item.category_name}}
              td
                .simple-td {{item.from == 1 ? (item.type === 1 ? '养护卡' : '次卡') :'壳养护卡'}}
              td
                .simple-td ￥{{item.price / 100}}
              td
                .simple-td {{item.sale}}
              td
                .simple-td ￥{{item.sale_money}}
              td
                .simple-td(v-if="item.status == 1") 已上架
                .simple-td(v-if="item.status == 2") 已下架
              td
                .operation-td
                  span.operation-link(@click="goDetail(item.id)") 查看
      .tfoot(v-if="true")
        pagination(:pagination-data="pagination_data", @input="paging")
</template>

<script>
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import CouponUsedDetail from '@/components/marketing/modal/CouponUsedDetail'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import Pagination from '@/components/generics/Pagination'
  import FilterTools from '@/mixins/utilities/filterTools'
  import ImageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import Api from '@/mixins/modules/productService'
  export default {
    name: 'CouponRecordList',
    mixins: [Api, FilterTools, ImageScale],
    components: {
      CustomInput,
      CustomSelect,
      EmptyPage,
      Pagination,
      SlideOutModal,
      CouponUsedDetail,
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
        get_ways: [],
        filter_data: {
          keyword: '',
          ways: {
            id: '',
            name: '全部',
          },
        },
        query_data: {
          keyword: '',
          ways: {
            id: '',
            name: '全部',
          },
        },
        list: [],
      }
        // 初始化搜索条件
      ;[schema.filter_data, schema.query_data].forEach(conditions => {
        conditions.keyword = ''
      })
      return schema
    },
    methods: {
      async fetchData () {
        try {
          const {response, result} = await this.upkeepDataList({
            page: this.pagination_data.current_page,
            per_page: this.pagination_data.per_page,
            name: this.query_data.keyword,
            category_id: this.query_data.ways.id ? this.query_data.ways.id : '',
          })
          if (response.status === 200 && result.code === 0) {
            result.data.forEach(item => {
              item.sale_money = (item.sale_money / 100).toFixed(2)
            })
            this.list.splice(0, this.list.length, ...result.data)
            this.pagination_data = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡统计列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡统计列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.is_initiated = true
      },
      // 获取养护卡分类列表
      async getClassifyList () {
        try {
          const { response, result } = await this.upkeepCategoryApi()
          if (response.status === 200 && result.code === 0) {
            this.get_ways = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡分类列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch ({ response, result }) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡分类列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      },
      search () {
        this.pagination_data.current_page = 1
        this.switchFilterData(this.filter_data, this.query_data)
        this.fetchData()
      },
      resetFilter () {
        this.query_data.keyword = ''
        this.query_data.ways = {
          id: '',
          name: '全部',
        }
        this.recallFilter()
        this.pagination_data.current_page = 1
        this.fetchData()
      },
      recallFilter () {
        this.switchFilterData(this.query_data, this.filter_data)
      },
      paging (state) {
        this.pagination_data = state
        this.recallFilter()
        this.fetchData()
      },
      // 去详情
      goDetail (id) {
        this.$global.paginationData = this.paginationData
        this.$global.filterData = this.filterData
        this.$router.push({
          name: 'statisticalDetail',
          query: {
            id: id,
          },
        })
      },
    },
    async mounted () {
      if (this.$global.paginationData) {
        this.paginationData = this.$global.paginationData
        this.filterData = this.$global.filterData
        this.queryData = this.$global.filterData
      }
      this.getClassifyList()
      this.fetchData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .img
    width 32px
    height 32px
  .simple-td
    max-width 130px !important
  .section-layout
    height calc(100% - 48px)
  .list-wrapper
    height calc(100% - 90px) !important
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
</style>
