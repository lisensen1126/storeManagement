<!--选择商品弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 选择养护卡
        .close-button(@click="modalClose")
      .modal-body
        .section-filter.is-horizontal
          .field-group.is-horizontal
            .field.is-narrow
              label.label 养护卡类型
              custom-select(v-model="choose_classify", :list="classify_list", nameField="name", :show-search="true")
            .field.is-keyword
              label.label 关键字搜索
              custom-input(v-model="filter_data.keywords", placeholder="请输入养护卡名称", @keyupEnter="searchFilter(1)")
            .field
              a.button.primary(@click="searchFilter(1)") 搜索
            .field
              a.button(@click="resetFilter") 重置
        empty-page(v-if="!data_list.length && is_initiated", :tip="'暂无养护卡'")
        .table-wrapper(v-if="data_list && data_list.length")
          table.table
            thead
              tr
                td(width="80")
                td(width="100") 卡面
                td(width="200") 养护卡名称
                td(width="70") 养护卡类型
            tbody
              tr(v-for="item in data_list",@click="setChecked(item)")
                td
                  .simple-td
                    .radio(:class="{'no-check':!item.checked,'is-check': item.checked}")
                td
                  .simple-td
                    img.img(:src="item.image_url")
                    //- img.img(:src="item.pic")
                td
                  .simple-td(v-text="item.name")
                td
                  .simple-td.max-100(v-text="item.category_name")
        //- .tfoot
          //- pagination(:pagination-data="pagination_data", @input="paging")
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

  export default {
    name: 'ChooseCard',
    components: {
      ModalDialog,
      CustomSelect,
      CustomInput,
      EmptyPage,
      Pagination,
    },
    mixins: [ModalInteractions, Api, ImageScale, FilterTools],
    props: {
      id: {
        type: [String, Number],
      },
    },
    data () {
      return {
        is_initiated: false,
        filter_data: { // 搜索条件
          id: '',
          keywords: '',
        },
        classify_list: [],
        choose_classify: null, // 已选分类
        data_list: [],
        pagination_data: { // 分页
          current_page: 1,
          per_page: 1000000000,
          last_page: 1,
          total: 0,
        },
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
      // 搜索按钮
      searchFilter (tab) {
        if (this.choose_classify) {
          this.filter_data.id = this.choose_classify.id
        }
        if (tab === 1) this.pagination_data.current_page = 1
        this.selected_item = null
        this.getCardList()
      },
      // 重置
      resetFilter () {
        this.choose_classify = null
        this.selected_item = null
        this.filter_data.keywords = ''
        this.filter_data.id = ''
        this.getCardList()
      },
      // 获取养护卡分类列表
      async getClassifyList () {
        try {
          const { response, result } = await this.upkeepCategoryApi()
          if (response.status === 200 && result.code === 0) {
            this.classify_list = result.data
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
      // 获取养护卡列表
      async getCardList () {
        try {
          const { response, result } = await this.upkeepListApi({
            name: this.filter_data.keywords ? this.filter_data.keywords : '',
            category_id: this.choose_classify ? this.choose_classify.id : '',
            status: 1,
            page: this.pagination_data.current_page,
            per_page: this.pagination_data.per_page,
          })
          if (response.status === 200 && result.code === 0) {
            this.data_list = result.data.map(item => {
              item.checked = false
              return item
            })
            // this.pagination_data = result.meta
            this.is_initiated = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error('养护卡列表', err)
        }
      },
      // 分页
      paging (state, evt) {
        this.pagination_data = state
        this.searchFilter()
      },
      // 完成
      complete () {
        console.log(this.id, this.selected_item)
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
    },
    created () {
      this.getClassifyList() // 获取品牌列表
      this.getCardList() // 获取商品列表
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .max-100
    max-width 100px !important
  .modal-header
    padding 20px 24px
  .modal-footer
    padding 12px 16px
  .modal-body
    position relative
    height 420px
    display flex
    flex-direction column
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
