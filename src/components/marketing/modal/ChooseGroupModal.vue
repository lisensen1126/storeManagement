<!--选择服务弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 选择拼团
        .close-button(@click="modalClose")
      .modal-body
        .section-filter.is-horizontal
          .field-group.is-horizontal
            .field.is-narrow
              label.label 拼团名称
              custom-input(v-model="query_data.keyword", placeholder="商品/服务/养护卡名称", @keyupEnter="applyFilter")
            .field.staff-wrapper(v-if="show_tab")
              label.label 全部分类
              choose-tab(@success="getClassify" ref="child", :default="search_classify")
            .field
              a.button.primary(@click="applyFilter") 搜索
            .field
              a.button(@click="resetFilter") 重置
        empty-page(v-if="!data_list.length && is_initiated", :tip="'暂无拼团'")
        .table-wrapper(v-if="data_list && data_list.length")
          table.table
            thead
              tr
                td(width="80")
                td(width="200") 服务/服务/养护卡名称
                td(width="100") 分类
                td(width="80") 成团人数
                td(width="80") 成团价
                td(width="80") 活动状态
            tbody
              tr(v-for="(item, index) in data_list",@click="setChecked(index, item)")
                td
                  .simple-td
                    .radio(:class="{'no-check':!item.checked,'is-check': item.checked}")
                td
                  .simple-td(v-text="item.product_name")
                td
                  .simple-td(v-text="item.category_name")
                td
                  .simple-td(v-text="item.num")
                td
                  .simple-td(v-text="item.mini_price")
                td
                  .simple-td 已开启
        .tfoot
          pagination(:pagination-data="pagination_data", @input="paging")
      .modal-footer.level
        .level-left
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(v-if="selected_item", @click="complete") 确定
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import CustomInput from '@/components/generics/form/CustomInput'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Api from '@/mixins/modules/productService'
  import GroupApi from '@/mixins/modules/Group'
  import ImageScale from '@/mixins/utilities/imageScale'
  import FilterTools from '@/mixins/utilities/filterTools'
  import Pagination from '@/components/generics/Pagination'
  import ChooseTab from '@/components/marketing/modal/ChooseTab'
  export default {
    name: 'ChooseGood',
    components: {
      ModalDialog,
      CustomSelect,
      CustomInput,
      EmptyPage,
      Pagination,
      ChooseTab,
    },
    mixins: [ModalInteractions, Api, ImageScale, FilterTools, GroupApi],
    props: {
      id: {
        type: [String, Number],
      },
      type: {
        type: String,
        default: 'spike',
      },
    },
    data () {
      return {
        current_id: '',
        search_classify: [], // 选择分类的数据
        is_initiated: false,
        pagination_data: {
          current_page: 1,
          per_page: 5,
          last_page: 1,
          total: 0,
        },
        query_data: {
          keyword: '',
        },
        data_list: [],
        show_tab: false,
        selected_item: null, // 选中的
      }
    },
    watch: {
      data_list: {
        handler: function (val) {
          let _this = this
          val.forEach(item => {
            if (item.checked) {
              _this.selected_item = item
            }
          })
        },
        deep: true,
      },
    },
    methods: {
      // 获取分类
      getClassify (val) {
        this.search_classify = val
      },
      applyFilter () {
        this.pagination_data.current_page = 1
        this.selected_item = null
        this.fetchList()
      },
      // 重置
      resetFilter () {
        this.selected_item = null
        this.$refs.child.parentMsg()
        this.search_classify = []
        this.query_data = {
          keyword: '',
        }
        this.pagination_data.current_page = 1
        this.fetchList()
      },
      // 获取拼团列表
      async fetchList () {
        let params = {
          product_name: this.query_data.keyword,
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
          status: 1,
        }
        if (this.search_classify.length > 1) {
          params.type = this.search_classify[0]
          if (params.type > 2 && this.search_classify[1] !== 0) {
            params.parent_category_id = this.search_classify[1]
          } else {
            if (this.search_classify.length > 2) {
              params.parent_category_id = this.search_classify[1]
              if (this.search_classify[2] !== 0) {
                params.category_id = this.search_classify[2]
              }
            }
          }
        }
        try {
          const {response, result} = await this.groupListApi(params)
          if (response.status === 200 && result.code === 0) {
            this.data_list.splice(0, this.data_list.length, ...result.data)
            this.data_list.forEach(function (v) {
              v.mini_price = (v.mini_price / 100).toFixed(2)
              v.checked = false
            })
            this.pagination_data = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取拼团列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.err(err, '拼团列表失败')
        }
        this.is_initiated = true
      },
      // 分页
      paging (state, evt) {
        this.pagination_data = state
        this.fetchList()
      },
      // 完成
      complete () {
        this.modalResolve(this.selected_item, this.id)
      },
      /**
       * 选中数据
       * @param i
       */
      setChecked (index, item) {
        let list = this.data_list
        this.data_list = []
        list.forEach(v => {
          v.checked = false
        })
        list[index].checked = true
        this.data_list = list
      },
    },
    created () {
      this.fetchList() // 获取服务列表
      this.show_tab = true
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .simple-td
    max-width 160px !important
    text-overflow ellipsis
  .modal-card
    width 700px !important
  .modal-header
    padding 20px 24px
  .modal-footer
    padding 12px 16px
  .modal-body
    position relative
    height 420px
    display flex
    flex-direction column
    padding-bottom 36px
  .table-wrapper
    padding 8px 16px
    flex-grow 1
    background standBackground
    .items
      + .items
        margin-top 8px
      display flex
      height 48px
      align-items center
      background #ffffff
      padding 0 16px
    .checkbox
      flex-shrink 0
      margin-right 16px
    .image
      width 32px
      height 32px
      flex-shrink 0
      margin-right 16px
    .item-content
      max-width 343px
      margin-right 16px
      font-size 13px
      line-height 16px
      flex-grow 1
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
    .price-content
      font-weight bold
      width 100px
      flex-shrink 0
      font-size 13px
      line-height 16px
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
  .simple-td
    height 32px
    line-height 32px
    display flex
    align-items center
  .limit-info
    font-size 13px
    color darker
    align-items center
    .count
      color mediumYellow
      margin-left 10px
  .filter-wrapper
    flex-shrink 0
    box-sizing border-box
    background #e8e9eb
    padding 12px 16px
    display flex
    flex-direction row
  .custom-select
    width 128px
    margin-right 8px
    flex-shrink 0
  .custom-input
    flex-grow 1
    margin-right 8px
  .filter-wrapper
    .button + .button
      margin-left 8px
  .pagination
    flex-shrink 0
    height 36px
    display flex
    justify-content space-between
    align-items center
    padding 0 16px
    background #ffffff
    box-shadow 0 -1px 12px 0 rgba(0, 0, 0, 0.08)
  .pagination-info
    font-size 13px
    line-height 16px
    color lightGrey
  .page-turning
    font-size 13px
    line-height 16px
    color lightGrey
    height 100%
    display flex
    align-items center
    cursor pointer
    &.is-disabled
      opacity .2
      pointer-events none
    &:hover
      color mediumYellow
      .pre-icon
        background-image url('~@/assets/prev-hover.svg')
      .next-icon
        background-image url('~@/assets/next-hover.svg')
  .pre-icon
  .next-icon
    display inline-block
    width 16px
    height 16px
    background url('~@/assets/prev.svg') no-repeat center center
    background-size 14px
  .next-icon
    background-image url('~@/assets/next.svg')
  .img
    width 32px
    height 32px
  .tfoot
    z-index 3

  .radio
    width 16px
  .is-check::before
    content: ''
    display: block
    background: #fff
    width: 16px
    height: 16px
    border-radius: 100%
    position: absolute
    z-index: 1
    left: 0
    top: 0
    box-sizing: border-box
    border: 5px solid #ffbb29;
  .no-check::before
    content: ''
    display: block
    background: #fff
    width: 16px
    height: 16px
    border: 1px solid #ccc
    border-radius: 100%
    position: absolute
    z-index: 1
    left: 0
    top: 0
    box-sizing: border-box
</style>
