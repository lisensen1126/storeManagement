<!--选择品牌馆弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 选择品牌馆
        .close-button(@click="modalClose")
      .modal-body
        .section-filter.is-horizontal
          .field-group.is-horizontal
            .field.is-narrow
              label.label 品牌
              custom-select(v-model="brand", :list="brand_list", nameField="brand_name", :show-search="true")
            .field.is-keyword
              label.label 品牌馆名称
              custom-input(v-model="filter_data.keywords", placeholder="请输入名称关键词", @keyupEnter="searchFilter(1)")
            .field
              a.button.primary(@click="searchFilter(1)") 搜索
            .field
              a.button(@click="resetFilter") 重置
        empty-page(v-if="!data_list.length && is_initiated", :tip="'暂无品牌馆'")
        .table-wrapper(v-if="data_list && data_list.length")
          table.table
            thead
              tr
                td(width="80")
                td(width="100")
                td(width="200") 品牌馆名称
                td(width="70") 品牌
            tbody
              tr(v-for="item in data_list", @click="setChecked(item)")
                td
                  .simple-td
                    .radio(:class="{'no-check':!item.checked,'is-check': item.checked}")
                      <!--input(type="radio", :id="item.brand_id", :value="item", name="modal" v-model="item.checked")-->
                      <!--label.sepcific-setting(:for="item.brand_id")-->
                td
                  .simple-td
                    img.img(:src="item.cover")
                td
                  .simple-td(v-text="item.name")
                td
                  .simple-td(v-text="item.brand_name")
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
  import ProductServiceMixin from '@/mixins/modules/productService'
  import ImageScale from '@/mixins/utilities/imageScale'
  import FilterTools from '@/mixins/utilities/filterTools'
  import Pagination from '@/components/generics/Pagination'

  export default {
    name: 'ChooseBrand',
    components: {
      ModalDialog,
      CustomSelect,
      CustomInput,
      EmptyPage,
      Pagination,
    },
    mixins: [ModalInteractions, ProductServiceMixin, ImageScale, FilterTools],
    props: {
      id: {
        type: [String, Number],
      },
    },
    data () {
      return {
        is_initiated: false,
        filter_data: { // 搜索条件
          brand_id: '',
          keywords: '',
        },
        brand: null,
        brand_list: [],
        data_list: [],
        pagination_data: { // 分页
          current_page: 1,
          per_page: 20,
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
        if (this.brand) {
          this.filter_data.brand_id = this.brand.brand_id
        }
        if (tab === 1) this.pagination_data.current_page = 1
        this.selected_item = null
        this.getBrandData()
      },
      // 重置
      resetFilter () {
        this.brand = null
        this.selected_item = null
        this.filter_data.keywords = ''
        this.filter_data.brand_id = ''
        this.getBrandData()
      },
      // 获取品牌列表
      async getBrandList () {
        let _this = this
        try {
          const {response, result} = await this.fetchBrand({
            is_store: 2,
            source_type: 1,
            is_page: 2,
          })
          if (response.status === 200) {
            _this.brand_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取品牌列表出错',
              content: `出错啦！错误码：${response.status}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表失败',
            content: `出错啦！错误码：${err}`,
          })
        }
      },
      // 获取品牌馆列表
      async getBrandData () {
        try {
          const {response, result} = await this.fetchBrandHouse({
            brand_id: this.filter_data.brand_id,
            keyword: this.filter_data.keywords,
            page: this.pagination_data.current_page,
            per_page: this.pagination_data.per_page,
          })
          if (response.status === 200 && result.code === 0) {
            result.data.forEach(v => {
              v.checked = false
            })
            this.data_list = result.data
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
        this.searchFilter()
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
    },
    mounted () {
      this.getBrandList() // 获取品牌列表
      this.getBrandData() // 获取品牌馆列表
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
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
