
<!--选择平台内容弹框-->
<template lang="pug">
  modal-dialog(modal-scale="card")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 服务
        .close-button(@click="modalClose")
      .modal-body
        .main-left
          .section-filter.is-horizontal
            .field-group.is-horizontal
              .field.is-keyword
                label.label 名称
                custom-input(v-model="filter_data.keywords", placeholder="请输入名称关键词", @keyupEnter="searchFilter(1)")
              .field.is-narrow
                label.label 一级分类
                custom-select(v-model="first_state", :list="first_class_list", @input="changefirst_state", nameField="category_name")
              .field.is-narrow
                label.label 二级分类
                custom-select(v-model="second_state", :list="second_class_list", nameField="category_name")
              .field
                a.button.primary(@click="searchFilter(1)") 搜索
              .field
                a.button(@click="resetFilter") 重置
          empty-page(v-if="!data_list.length", :tip="'暂无内容'")
          .table-wrapper(v-if="data_list && data_list.length")
            table.table
              thead
                tr
                  td(width="30")
                    .checkbox
                      input(type="checkbox", id="all01", v-model="checkedAll", @click="checkedAllFnc")
                      label.sepcific-setting(for="all01", v-text="'全选'")
                  td(width="150") 商品
                  td(width="150") 分类
              tbody
                tr(v-for="item in data_list")
                  td
                    .simple-td
                      .checkbox
                        input(type="checkbox", :id="item.product_id", :value="item", name="modal", v-model="selected_item", @change="testingCheckAll")
                        label.sepcific-setting(:for="item.product_id")
                  td
                    .simple-td.has-image
                      .left-image
                        img(v-if="item.product_pic", :src="item.product_pic")
                      .content-item(v-text="item.product_name")
                  td
                    .simple-td(v-text="item.category_name")
          .tfoot
            pagination(:pagination-data="pagination_data", @input="paging")
        .main-right
          .right-title 选中内容
          .right-content
            .item-box(v-for="(item, index) in selected_item")
              input(type="checkbox"
                :id="item.product_id"
                :value="item", name="modal",
                v-model="selected_item",
                :checked='item.selected'
                style="width:0px;height:0px;opacity:0")
              .item-name(v-text="item.product_name")
              label.item-delete(:for="item.product_id")
      .modal-footer.level
        .level-left
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(@click="complete") 确定
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import CustomInput from '@/components/generics/form/CustomInput'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Api from '@/mixins/modules/productService'
  // import productServiceMixin from '@/mixins/modules/productService'
  import ImageScale from '@/mixins/utilities/imageScale'
  import FilterTools from '@/mixins/utilities/filterTools'
  import Pagination from '@/components/generics/Pagination'

  export default {
    name: 'ChooseServe',
    components: {
      ModalDialog,
      CustomSelect,
      CustomInput,
      EmptyPage,
      Pagination,
    },
    mixins: [ModalInteractions, Api, ImageScale, FilterTools],
    props: {
      array: {
        type: Array,
        default: () => [],
      },
    },
    data () {
      return {
        filter_data: { // 搜索条件
          keywords: '',
        },
        first_state: null, // 一级分类
        first_class_list: [],
        second_state: null, // 二级分类
        second_class_list: [],
        data_list: [], // 数据列表
        pagination_data: { // 分页
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        checkedAll: false, // 全选状态
        selected_item: [], // 选中的
      }
    },
    methods: {
      // 搜索按钮
      searchFilter () {
        this.pagination_data.current_page = 1
        this.getInfoList()
      },
      // 重置
      resetFilter () {
        this.filter_data.keywords = ''
        this.first_state = null
        this.second_state = null
        this.searchFilter()
      },
      // 获取数据
      async getInfoList () {
        try {
          const { response, result } = await this.getProductServiceListApi({
            type: 2, // 1:商品，2:服务
            category_id_one: this.first_state ? this.first_state.category_id : '',
            category_id_two: this.second_state ? this.second_state.category_id : '',
            name: this.filter_data.keywords
              ? this.filter_data.keywords
              : '',
            page: this.pagination_data.current_page,
            per_page: this.pagination_data.per_page,
          })
          if (response.status === 200 && result.code === 0) {
            // 列表数据赋值
            this.data_list = result.data.map(item => {
              let obj = {
                type: 2,
                product_id: item.sku_id,
                product_name: item.name,
                product_pic: item.image_url,
                category_name: item.category_name_one + '/' + item.category_name_two,
              }
              return obj
            })
            // 分页器数据更新
            this.pagination_data = result.meta
            // 检测全选
            this.testingCheckAll()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取商品列表失败',
              content: '获取商品列表发生错误，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品列表失败',
            content: `服务异常，请稍后再试（${
              err.response ? err.response.status : err
            }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 分页
      paging (state, evt) {
        this.pagination_data = state
        this.getInfoList()
      },
      /**
       * 分类列表
       * parentId 父级 id 判断一级分类 二级分类
       */
      async getClassifyList (parentId) {
        let params = {
          type: 2,
          parent_id: parentId,
        }
        try {
          let { response, result } = await this.fetchCategory(params)
          if (response.status === 200 && result.code === 0) {
            // 根据返回的分类级别组装数据
            if (result.data[0].level === 1) {
              this.first_class_list = result.data
            } else if (result.data[0].level === 2) {
              this.second_class_list = result.data
            } else if (result.data[0].level === 3) {
              this.third_classList = result.data
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取商品分类失败',
              content: '获取商品分类发生错误，请稍后再试',
            })
          }
        } catch ({ response, result }) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取分类列表失败',
            content: `服务异常，请稍后再试（${response.status}${
              result && result.code ? ' ' + result.code : ''
            }）`,
          })
        }
      },
      // 选择一级分类，赋值二级分类
      changefirst_state () {
        this.second_state = null
        this.second_class_list = []
        this.getClassifyList(this.first_state.category_id)
      },
      // 全选 or 取消
      checkedAllFnc () {
        let _this = this
        if (!this.checkedAll) {
          // 多选
          this.data_list.forEach(item => {
            let has = _this.selected_item.some(obj => obj.product_id === item.product_id)
            if (!has) {
              _this.selected_item.push(item)
            }
          })
        } else {
          // 取消
          this.data_list.forEach(item => {
            let index = 0
            let has = _this.selected_item.some((obj, i) => {
              index = i
              return obj.product_id === item.product_id
            })
            if (has) {
              _this.selected_item.splice(index, 1)
            }
          })
        }
      },
      // 检测是否全选
      testingCheckAll () {
        let checkNum = 0
        this.data_list.forEach(item => {
          let has = this.selected_item.some(sel => {
            return sel.product_id === item.product_id
          })
          if (has) {
            checkNum = checkNum + 1
          }
        })
        this.checkedAll = this.data_list.length === checkNum
      },
      // 完成
      complete () {
        this.modalResolve(this.selected_item)
      },
      // 取消
      cancle () {
        this.$emit('callback')
      },
    },
    mounted () {
      this.getClassifyList(0) // 获取分类
      this.getInfoList() // 获取内容列表
      this.selected_item = [...this.array]
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-header
    padding 20px 24px
  .modal-card
    width 1150px !important
  .modal-card-title
    overflow hidden
    .shop
      float left
      margin-right 20px
      color #353535
    .active
      border-bottom 2px solid #ffbb29
  .modal-footer
    padding 12px 16px
  .modal-body
    display flex
    justify-content space-between
    .main-left
      position relative
      width 800px
      height 520px
      display flex
      flex-direction column
      padding-bottom 36px
    .main-right
      width 350px
      padding 0 15px
      .right-title
        font-size 14px
        line-height 40px
        border-bottom 1px solid #f0f1f2
      .right-content
        height 479px
        overflow-y auto
        .item-box
          display flex
          justify-content space-between
          align-items center
          height 40px
          padding 0 5px
          border-bottom 1px solid #f0f1f2
          // background #f0f1f2
          margin-bottom 5px
          font-size 12px
          .item-name
            width 300px
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          .item-delete
            width 20px
            height 20px
            background center no-repeat url('~@/assets/modal/close.svg')
            cursor pointer
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
    height 16px
    label
      width 16px
      height 16px
      padding-left 14px
    input[type="radio"]
      width 16px
      height 16px
</style>
