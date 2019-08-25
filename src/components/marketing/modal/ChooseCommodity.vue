<!--优惠券选择关联商品&服务-->
<template lang="pug">
  modal-dialog(modal-scale="card")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 商品/服务
        .close-button(@click="modalClose")
      .modal-body
        .main-left
          .section-filter.is-horizontal
            .field-group.is-horizontal
              .field.is-narrow
                label.label 商品/服务
                custom-select(v-model="type", :list="type_list", nameField="name")
              .field.is-narrow
                label.label 一级分类
                custom-select(v-model="first_state", :list="first_list", nameField="category_name", @input="changeFirst")
              .field.is-narrow
                label.label 二级分类
                custom-select(v-model="second_state", :list="second_list", nameField="category_name")
              .field.is-keyword
                label.label 请输入商品/服务名称
                custom-input(v-model="keywords", placeholder="请输入关键字", @keyupEnter="search")
              .field
                a.button.primary(@click="search") 搜索
              .field
                a.button(@click="reset") 重置

          empty-page(v-if="!list.length", :tip="'暂无内容'")
          
          .table-wrapper(v-if="list && list.length")
            table.table
              thead
                tr
                  td(width="30")
                    .checkbox
                      input(type="checkbox", id="nb", v-model="checked_all", @click="checkedAllFnc")
                      label.sepcific-setting(for="nb", v-text="'全选'")
                  td(width="150", v-if="type.id == 1") 商品名称
                  td(width="150", v-if="type.id == 2") 服务名称
              tbody
                tr(v-for="item in list")
                  td
                    .simple-td
                      .checkbox
                        input(type="checkbox", :id="item.product_id", :value="item", name="modal", v-model="selected_item")
                        label.sepcific-setting(:for="item.product_id")
                  td
                    .simple-td
                      .content-item(v-text="item.name")
        .main-right
          .right-title 选中内容
          .right-content
            .item-box(v-for="(item, index) in selected_item")
              input(type="checkbox", :id="item.product_id" hidden="true" :value="item", name="modal", v-model="selected_item", :checked="item.selected")
              .item-name(v-text="item.name")
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
  import ImageScale from '@/mixins/utilities/imageScale'
  import FilterTools from '@/mixins/utilities/filterTools'
  import Pagination from '@/components/generics/Pagination'

  export default {
    name: 'ChooseGoods',
    components: {
      ModalDialog,
      CustomSelect,
      CustomInput,
      EmptyPage,
      Pagination,
    },
    mixins: [Api, ModalInteractions, ImageScale, FilterTools],
    props: {
      array: {
        type: Array,
        default: () => [],
      },
    },
    watch: {
      type (val) {
        this.first_list = []
        this.second_list = []
        this.first_state = null
        this.second_state = null
        this.fetchClassify(0, 'first')
        this.getInfoList()
      },
      selected_item () {
        this.checked_all = false
        let length = 0
        let src = JSON.stringify(this.list)
        this.selected_item.forEach(item => {
          if (src.indexOf(JSON.stringify(item)) !== -1) {
            length += 1
          }
        })
        if (length === this.list.length) this.checked_all = true
      },
    },
    data () {
      return {
        type_list: [
          {name: '商品', id: 1},
          {name: '服务', id: 2},
        ],
        type: {name: '商品', id: '1'},
        keywords: '',             // 关键字
        first_state: null,        // 一级分类
        first_list: [],
        second_state: null,       // 二级分类
        second_list: [],
        list: [],
        // pagination_data: {        // 分页
        //   current_page: 1,
        //   per_page: 20,
        //   last_page: 1,
        //   total: 0,
        // },
        checked_all: false,        // 全选状态
        selected_item: [],        // 选中的
      }
    },
    methods: {
      /**
       * 获取分类数据
       * id {Number, String} 父级id
       * hierarchy {String}  分类层级标识
       */
      async fetchClassify (id, hierarchy) {
        try {
          const { response, result } = await this.fetchCategory({
            type: this.type.id,
            parent_id: id,
          })
          if (response.status === 200 && result.code === 0) {
            // 根据返回的分类级别组装数据
            hierarchy === 'first' ? this.first_list = result.data : this.second_list = result.data
          } else {
            this.errorMessage('获取分类发生错误')
          }
        } catch ({ response, result }) {
          this.errorMessage('获取分类发生错误')
        }
      },
      // 错误信息函数
      errorMessage (message) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: message,
          content: `${message}获取分类发生错误，请稍后再试`,
        })
      },
      // 一级分类改变
      changeFirst () {
        this.second_list = []
        this.second_state = null
        this.fetchClassify(this.first_state.category_id, 'second')
      },
      // 搜索按钮
      search () {
        this.getInfoList()
      },
      // 重置
      reset () {
        this.keywords = ''
        this.first_state = null
        this.second_state = null
        this.type = {name: '商品', id: '1'}
        this.getInfoList()
      },
      // 获取数据
      async getInfoList () {
        try {
          const { response, result } = await this.getCouponRelationApi({
            category_one: this.first_state ? this.first_state.category_id : '',
            category_two: this.second_state ? this.second_state.category_id : '',
            keyword: this.keywords,
            type: this.type.id,
          })
          if (response.status === 200 && result.code === 0) {
            // 列表数据赋值
            // if (this.selected_item.length > 0) {
            //   result.data.forEach(item => {
            //     this.selected_item.forEach(param => {
            //       if (item.product_id === param.product_id) {
            //         item.is_select = true
            //       }
            //     })
            //   })
            // }
            this.list.splice(0, this.list.length, ...result.data)
            this.pagination_data = result.meta
            this.checked_all = false
            let length = 0
            let src = JSON.stringify(this.list)
            this.selected_item.forEach(item => {
              if (src.indexOf(JSON.stringify(item)) !== -1) {
                length += 1
              }
            })
            if (length === this.list.length) this.checked_all = true
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
      // 全选 or 取消
      checkedAllFnc () {
        let self = this
        if (!this.checked_all) {
          // 多选
          self.list.forEach(item => {
            let has = self.selected_item.some(obj => obj.product_id === item.product_id)
            if (!has) {
              self.selected_item.push(item)
            }
          })
        } else {
          // 取消
          self.list.forEach(item => {
            let index = 0
            let has = self.selected_item.some((obj, i) => {
              index = i
              return obj.product_id === item.product_id
            })
            if (has) {
              self.selected_item.splice(index, 1)
            }
          })
        }
      },
      // 完成
      complete () {
        this.modalResolve(this.selected_item)
      },
      cancle () {
        this.$emit('callback')
      },
    },
    mounted () {
      this.selected_item = [...this.array]
      this.getInfoList()
      this.fetchClassify(0, 'first')
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
