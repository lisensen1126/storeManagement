<!--选择商品弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 选择商品
        .close-button(@click="modalClose")
      .modal-body
        .section-filter.is-horizontal
          .field-group.is-horizontal
            .field.is-narrow
              label.label 商品名称
              custom-input(v-model="filter_data.keywords", placeholder="请输入名称", @keyupEnter="searchFilter(1)")
            .field.is-narrow
              label.label 全部分类
              custom-select(v-model="filter_data.first_state", :list="first_class_list", nameField="category_name")
            .field.is-narrow
              label.label
              custom-select(v-model="filter_data.second_state", :list="second_class_list", nameField="category_name")
            .field
              a.button.primary(@click="searchFilter(1)") 搜索
            .field
              a.button(@click="resetFilter") 重置
        empty-page(v-if="!data_list.length && is_initiated", :tip="'暂无商品'")
        .table-wrapper(v-if="data_list && data_list.length")
          table.table
            thead
              tr
                td(width="80")
                td(width="100") 商品图片
                td(width="200") 商品名称
            tbody
              tr(v-for="item in data_list",@click="setChecked(item)")
                td
                  .simple-td
                    .radio(:class="{'no-check':!item.checked,'is-check': item.checked}")
                      <!--input(type="radio", v-if="item.product_id" :id="item.product_id", value="true", name="modal" :checked="item.checked" @click="setChecked(item)")-->
                      <!--label.sepcific-setting(:for="item.product_id" v-if="item.product_id")-->
                td
                  .simple-td
                    img.img(:src="item.pic")
                td
                  .simple-td(v-text="item.name")
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
  import ImageScale from '@/mixins/utilities/imageScale'
  import FilterTools from '@/mixins/utilities/filterTools'
  import Pagination from '@/components/generics/Pagination'
  import SpikeApi from '@/mixins/modules/Spike'
  import MathFun from '@/mixins/utilities/math'

  export default {
    name: 'ChooseGood',
    components: {
      ModalDialog,
      CustomSelect,
      CustomInput,
      EmptyPage,
      Pagination,
    },
    mixins: [ModalInteractions, Api, ImageScale, FilterTools, SpikeApi, MathFun],
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
        first_class_list: [], // 商品一级分类
        second_class_list: [], // 商品二级分类
        current_id: '',
        is_initiated: false,
        is_search: false, // 是否点击搜索
        filter_data: { // 搜索条件
          brand_id: '',
          keywords: '',
          first_state: null, // 选择的一级分类
          second_state: null, // 选择的二级分类
        },
        query_filter_data: { // 搜索条件
          brand_id: '',
          keywords: '',
          first_state: null, // 选择的一级分类
          second_state: null, // 选择的二级分类
        },
        brand: null,
        data_list: [],
        pagination_data: { // 分页
          current_page: 1,
          per_page: 5,
          last_page: 1,
          total: 0,
        },
        selected_item: null, // 选中的
      }
    },
    watch: {
      'filter_data.first_state': function () {
        if (!this.filter_data.first_state) return
        let _this = this
        this.second_class_list = []
        this.filter_data.second_state = null
        this.getClassifyList(_this.filter_data.first_state.category_id)
      },
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
      // 搜索按钮
      searchFilter () {
        this.is_search = true
        this.query_filter_data = JSON.parse(JSON.stringify(this.filter_data))
        this.pagination_data.current_page = 1
        this.getProductData()
      },
      // 重置
      resetFilter () {
        this.selected_item = null
        this.filter_data.keywords = ''
        this.filter_data.brand_id = ''
        this.filter_data.first_state = null
        this.filter_data.second_state = null
        this.query_filter_data = JSON.parse(JSON.stringify(this.filter_data))
        this.second_class_list = [] // 商品二级分类
        this.getProductData()
      },
      // 获取商品列表
      async getProductData () {
        this.selected_item = null
        if (this.query_filter_data.second_state && this.query_filter_data.second_state.category_id) {
          this.current_id = this.query_filter_data.second_state.category_id
        } else if (this.first_state && this.first_state.category_id) {
          this.current_id = this.query_filter_data.first_state.category_id
        } else {
          this.current_id = ''
        }
        let params = {
          keyword: this.query_filter_data.keywords,
          is_sale: 1,  // 只展示已上架的商品
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
          category_id: this.current_id,
        }
        try {
          const {response, result} = this.type === 'group' ? await this.groupGoodApi(params) : await this.goodsListApi(params)
          if (response.status === 200 && result.code === 0) {
            result.data.forEach(v => {
              v.checked = false
              v.mini_price = this.accDiv(v.mini_price, 100)
              this.data_list.push(v)
            })
            this.pagination_data = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取列表失败',
              content: '获取列表发生错误，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.is_initiated = true
      },
      // 分页
      paging (state, evt) {
        this.pagination_data = state
        this.getProductData()
      },
      // 完成
      complete () {
        this.modalResolve(this.selected_item, this.id)
      },
      /**
       * 选中数据
       * @param i
       */
      setChecked (i) {
        this.data_list.forEach(v => {
          v.checked = false
        })
        i.checked = true
      },
      // 获取分类数据
      async getClassifyList (parentId) {
        try {
          const {response, result} = await this.fetchCategory({
            type: 1,
            parent_id: parentId,
            hide_loading: true,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              // 根据返回的分类级别组装数据
              if (result.data.length <= 0) {
                this.$store.dispatch('showMessage', {
                  type: 'failure',
                  title: '获取商品分类失败',
                  content: '该分类下未创建子级分类',
                })
                return false
              }
              if (result.data[0].level === 1) {
                this.first_class_list = result.data
              } else if (result.data[0].level === 2) {
                this.second_class_list = result.data
              }
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取商品分类失败',
                content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取商品分类失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品分类失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    created () {
      this.getClassifyList(0) // 获取分类列表
      this.getProductData() // 获取商品列表
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
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

