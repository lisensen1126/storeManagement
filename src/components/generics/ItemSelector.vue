<template lang="pug">
  modal-dialog(modal-scale="large", v-if="value")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 选择商品
        .close-button(@click="modalClose")
      .modal-body
        .filter-wrapper
          shop-category-picker.custom-select(v-model="filterData.shopCategory")
          custom-input.custom-input(placeholder="搜索商品", v-model="filterData.keyword", @keyupEnter="applyFilter")
          a.button.primary(@click="applyFilter") 搜索
          a.button(@click="resetFilter") 重置
        empty-page(v-if="!dataList.length && isInitiated", :tip="'暂无商品'")
        .table-wrapper(v-if="dataList.length")
          .items(v-for="item in dataList")
            .checkbox(:class="{'disabled': item.isDisabled}")
              input(type="checkbox", :id="item.id", :checked="item.isSelected", @click="toggleItem(item)")
              label(:for="item.id")
            .image
              img(:src="scaleImage(item.image_url, 1, 32, 32)")
            .item-content
              span.has-removed(v-if="!item.is_selling") 已下架
              span(v-text="item.title")
            .price-content(v-text="'￥' + item.sale_price")
        .pagination
          .page-turning(:class="{'is-disabled': prevDisable}", @click="prePage")
            span.pre-icon
            span 上一页
          .pagination-info {{paginationData.current_page}}/{{paginationData.last_page}}
          .page-turning(:class="{'is-disabled': nextDisable}", @click="nextPage")
            span 下一页
            span.next-icon
      .modal-footer.level
        .level-left.limit-info(v-if="limit")
          span 已选
          .count {{allLength}} / {{limit}}
        .level-left.limit-info(v-else)
          span 已选
          .count {{allLength}}
        .level-right
          span.cancel-button(@click="modalClose") 取消
          a.button.large.primary(@click="compelete") 确定
</template>

<script>
import ModalDialog from '@/components/generics/ModalDialog'
import CustomInput from '@/components/generics/form/CustomInput'
import EmptyPage from '@/components/generics/EmptyPage'
import modalInteractions from '@/mixins/utilities/modalInteractions'
import modalApi from '@/mixins/modules/mall'
import imageScale from '@/mixins/utilities/imageScale'
import ShopCategoryPicker from '@/components/generics/form/ShopCategoryPicker'
import filterTools from '@/mixins/utilities/filterTools'

export default {
  name: 'ItemSelector',
  components: {
    ModalDialog,
    CustomInput,
    ShopCategoryPicker,
    EmptyPage,
  },
  mixins: [modalInteractions, modalApi, imageScale, filterTools],
  props: {
    limit: {type: Number},
    // both item list and id list are acceptable
    existedItems: {
      type: Array,
      default: () => [],
    },
    queries: {
      type: Object,
      default: () => ({}),
    },
    selectedBranchId: {
      type: [Number, Array],
    },
    disabledTab: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      list: [],
      dataList: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      filterData: {
        keyword: '',
        shopCategory: null,
      },
      queryData: {
        keyword: '',
        shopCategory: null,
      },
      // results
      selectedItems: [],
      selectedIds: new Set(),
      isLoading: true,
      isSelectedAll: false,
      isSelectedAllDisable: false,
      isInitiated: false,
    }
  },
  computed: {
    allLength () {
      return parseInt(this.selectedItems.length) + parseInt(this.existedItems.length)
    },
    isMax () {
      return this.limit ? this.limit <= this.allLength : false
    },
    existedIds () {
      return new Set(this.existedItems.map(candidate =>
        candidate instanceof Object
          ? candidate.id
          : candidate
      ))
    },
    prevDisable () {
      return this.paginationData.current_page === 1
    },
    nextDisable () {
      return this.paginationData.last_page ? this.paginationData.current_page === this.paginationData.last_page : true
    },
  },
  methods: {
    prePage () {
      this.paginationData.current_page--
      this.getFullItems()
    },
    nextPage () {
      this.paginationData.current_page++
      this.getFullItems()
    },
    // 获取对应商品
    async getFullItems () {
      this.isLoading = true
      try {
        const {response, result} = await this.fetchItems({
          keyword: this.queryData.keyword,
          category_id: this.queryData.shopCategory ? this.queryData.shopCategory.id : undefined,
          is_selling: true,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
          ...this.queries,
        })
        if (response.status === 200) {
          this.dataList = this.processItemOptions(result.data)
          this.paginationData = result.meta
          this.processLimitItemOptions()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取商品列表失败',
          content: `错误：${err}`,
        })
      }
      this.isInitiated = true
      this.isLoading = false
    },
    // 初始化数据
    processItemOptions (items) {
      items.forEach(item => {
        item.isSelected = false
        item.isDisabled = false
        if (this.existedIds.has(item.id)) {
          item.isSelected = true
          item.isDisabled = true
        }
        if (this.selectedIds.has(item.id)) {
          item.isSelected = true
          const $index = this.selectedItems.findIndex(el => el.id === item.id)
          if ($index >= 0) {
            this.selectedItems.splice($index, 1, item)
          } else {
            this.selectedItems.push(item)
            this.selectedIds.add(item.id)
          }
        }
      })
      return items
    },
    // 选中/取消 商品
    toggleItem (item) {
      if (this.isLoading || item.isDisabled) {
        return
      }
      if (item.isSelected) {
        if (!this.existedIds.has(item.id)) {
          item.isSelected = false
          this.selectedItems.splice(this.selectedItems.findIndex(el => el.id === item.id), 1)
          this.selectedIds.delete(item.id)
        }
      } else {
        if (!this.existedIds.has(item.id)) {
          item.isSelected = true
          const $index = this.selectedItems.findIndex(el => el.id === item.id)
          if ($index >= 0) {
            this.selectedItems.splice($index, 1, item)
          } else {
            this.selectedIds.add(item.id)
            this.selectedItems.push(item)
          }
        }
      }
      this.processLimitItemOptions()
    },
    // 选中全部
    toggleAll () {
      const toBeSelected = this.dataList.filter(item => !item.isSelected)
      if (!toBeSelected || this.limit || this.isLoading || this.isSelectedAllDisable) {
        return
      }
      this.isSelectedAll = !this.isSelectedAll
      if (this.isSelectedAll) {
        toBeSelected.forEach(item => {
          this.toggleItem(item)
        })
      } else {
        this.dataList.forEach(item => {
          this.toggleItem(item)
        })
      }
    },
    // 根据limit数量判断是否可选
    processLimitItemOptions () {
      if (this.limit) {
        this.dataList.forEach(item => {
          if (this.isMax) {
            if (!item.isSelected) {
              item.isDisabled = true
            }
          } else {
            if (this.existedIds.has(item.id)) {
              item.isDisabled = true
            } else {
              item.isDisabled = false
            }
          }
        })
      }
    },
    compelete () {
      this.modalResolve(this.selectedItems, [...this.selectedIds])
    },
    applyFilter () {
      this.paginationData.current_page = 1
      this.switchFilterData(this.filterData, this.queryData)
      this.getFullItems()
    },
    resetFilter () {
      this.queryData.keyword = ''
      this.queryData.shopCategory = null
      this.recallFilter()
      this.paginationData.current_page = 1
      this.getFullItems()
    },
    recallFilter () {
      this.switchFilterData(this.queryData, this.filterData)
    },
  },
  mounted () {
    this.getFullItems()
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
    height 511px
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
</style>
