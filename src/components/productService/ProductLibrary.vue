<template lang="pug">
  .section-layout
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .field.is-narrow
          label.label 全部分类
          custom-select(v-model="filterData.firstState", :list="firstClassList", nameField="category_name")
        .field.is-narrow
          custom-select(v-model="filterData.secondState", :list="secondClassList", nameField="category_name")
        .field.is-narrow
          label.label 品牌
          custom-select(v-model="filterData.selectBrand", :list="brandArr", nameField="brand_name", :show-search="true")
        .field.is-keyword
          label.label 关键字搜索
          custom-input(v-model="filterData.keyword", placeholder="请输入商品名称", @keyupEnter="applyFilter")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      //- 批量添加商品
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="addProduct")
            span.add-icon
            span 批量添加商品
    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有商品'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="50")
                // 全选按钮
                // checkoutType 类型：all标识全选，默认unit某一项
                // list：当前列表数据
                // is_all_select: 是否全选
                // value: 当前项数据
                checkbox(checkoutType="all", :list="list", :is_all_select="is_all_select", @isCheckboxFun="isCheckout")
              td(width="300") 商品名称
              td(width="80") 品牌
              td(width="60") 所属分类
              td(width="80") 更新日期
              td(width="60") 状态
              td(width="100") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                checkbox(:value="item", :list="list", checkoutType="unit", @isCheckboxFun="isCheckout")
              td
                .simple-td.has-image
                  .left-image
                    img(:src="scaleImage(item.product_pic, 1, 36, 36)")
                  .content-item(v-text="item.product_name")
              td
                .simple-td.max-100(v-text="item.brand_name")
              td
                .simple-td(v-text="item.category_name")
              td
                .simple-td(v-text="item.updated_at")
              td
                .simple-td
                  .status-dot(:class="{'green': item.add_type == '2','grey': item.add_type == '1'}")
                  span(v-if="item.add_type == '1'") 未添加
                  span(v-else) 已添加
              td
                .operation-td
                  span.operation-link(@click="viewInfo(item)") 查看
                  router-link.operation-link(v-if="item.add_type == '1'", :to="{name: 'productLibraryEdit', params: {id: item.product_id}}") 添加商品
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import Checkbox from '@/components/generics/form/Checkbox'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import productServiceMixin from '@/mixins/modules/productService'
import EmptyPage from '@/components/generics/EmptyPage'
import imageScale from '@/mixins/utilities/imageScale'
import filterTools from '@/mixins/utilities/filterTools'

export default {
  name: 'productLibrary',
  mixins: [productServiceMixin, filterTools, imageScale],
  components: {
    Checkbox,
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
    filterTools,
  },
  data: _ => {
    const schema = {
      is_search: false, // 是否点击搜索按钮，返回时需要此值
      isInitiated: false,
      brandArr: [],
      firstState: null,
      firstClassList: [],
      secondState: null,
      secondClassList: [],
      thirdClassList: [],
      filterData: {
        firstState: null,
        secondState: null,
        keyword: '',
        selectBrand: null,
      },
      queryData: {},
      list: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      // 选中列表项的id集合
      checkout_ids: [],
      // 是否全选
      is_all_select: false,
    }
      // initialize conditions
      ;[schema.filterData, schema.queryData].forEach(conditions => {
        conditions.keyword = ''
        conditions.selectBrand = schema.brandArr[0]
      })
    return schema
  },
  methods: {
    // 查看
    viewInfo (item) {
      this.$router.push({
        name: 'productLibraryDetail',
        params: {
          id: item.product_id,
        },
      })
    },
    // 复选框选中列表项
    isCheckout (params) {
      // 当前项的选中
      if (params.type === 'unit') {
        this.is_all_select = params.is_all_select
        // 选中项的id集合
        let ids = []
        this.list.forEach(function (item) {
          if (item.is_select) {
            ids.push(item.product_id)
          }
        })
        this.checkout_ids = ids
      }
      // 全选操作
      if (params.type === 'all') {
        let ids = []
        this.is_all_select = params.is_all_select
        // 更新列表 list 数据
        this.list.forEach(function (item) {
          if (params.is_all_select) {
            item.is_select = true
            ids.push(item.product_id)
          } else {
            item.is_select = false
          }
        })
        this.checkout_ids = ids
      }
    },
    // 获取分类数据
    async getClassifyList (parentId) {
      try {
        const { response, result } = await this.fetchCategory({
          type: 1,
          parent_id: parentId,
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
              this.firstClassList = result.data
            } else if (result.data[0].level === 2) {
              this.secondClassList = result.data
            } else if (result.data[0].level === 3) {
              this.thirdClassList = result.data
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
    // 获取商品库列表数据
    async fetchData () {
      if (this.queryData.secondState && this.queryData.secondState.category_id) {
        this.currentId = this.queryData.secondState.category_id
      } else if (this.queryData.firstState && this.queryData.firstState.category_id) {
        this.currentId = this.queryData.firstState.category_id
      } else {
        this.currentId = ''
      }
      try {
        const { response, result } = await this.fetchProductLibrary({
          product_name: this.queryData.keyword,
          category_id: this.currentId,
          brand_id: this.queryData.selectBrand ? this.queryData.selectBrand.brand_id : '',
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200) {
          if (parseInt(result.code) === 0) {
            result.data.forEach(function (item) {
              item.is_select = false
            })
            this.list.splice(0, this.list.length, ...result.data)
            this.paginationData = result.meta
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品库列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取商品库列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 获取品牌数据
    async getBrand () {
      try {
        const { response, result } = await this.fetchBrand({
          is_store: 2,
          source_type: 1,
        })
        if (response.status === 200) {
          let brandArr = result.data
          let item = {
            'brand_id': '',
            'brand_name': '全部品牌',
            'english_name': '',
            'brand_logo': '',
          }
          brandArr.unshift(item)
          this.brandArr = brandArr
          this.filterData.selectBrand = this.brandArr[0]
          this.queryData.selectBrand = this.brandArr[0]
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 翻页操作
    paging (state) {
      this.paginationData = state
      this.fetchData()
      this.is_all_select = false
    },
    // 搜索
    applyFilter () {
      this.is_search = true
      for (let key in this.filterData) {
        if (this.queryData.hasOwnProperty(key)) {
          this.queryData[key] = this.filterData[key]
        }
      }
      this.paginationData.current_page = 1
      this.fetchData()
    },
    // 重置
    resetFilter () {
      this.is_search = false
      this.filterData.firstState = null
      this.filterData.secondState = null
      this.filterData.keyword = ''
      this.filterData.selectBrand = this.brandArr[0]
      this.queryData = JSON.parse(JSON.stringify(this.filterData))
      this.paginationData.current_page = 1
      this.fetchData()
    },
    // 重置
    resetParams () {
      this.filterData.firstState = null
      this.filterData.secondState = null
      this.filterData.keyword = ''
      this.filterData.selectBrand = this.brandArr[0]
      this.queryData = JSON.parse(JSON.stringify(this.filterData))
    },
    // 批量添加商品
    async addProduct () {
      if (this.checkout_ids.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '添加商品失败',
          content: '请选择需要添加的商品',
        })
        return false
      }
      try {
        const { response, result } = await this.fetchSyncProduct({
          ids: this.checkout_ids,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              type: 'success',
              title: '批量添加成功',
              autoClose: true,
              resolve: () => {
                this.$router.replace({
                  name: 'productList',
                })
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '批量添加商品失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '批量添加商品失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '批量添加商品失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
  watch: {
    // 选择一级分类，赋值二级分类
    async 'filterData.firstState' () {
      this.filterData.secondState = null
      // this.thirdState = null
      this.secondClassList = []
      this.thirdClassList = []
      if (!this.filterData.firstState) {
        return
      }
      await this.getClassifyList(this.filterData.firstState.category_id)
    },
  },
  async mounted () {
    this.getClassifyList(0) // 获取分类数据
    this.getBrand() // 获取品牌数据
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    /**
     * 由查看详情页面返回，直接取缓存
     */
    to.meta.isBack = false
    if (from.meta.isSlibing) {
      to.meta.isBack = true
    }
    next()
  },
  // keep-alive 进入
  activated () {
    // 不点击搜索按钮后点查看详情 从订单详情页面返回，
    if (this.$route.meta.isBack && !this.is_search) {
      this.resetParams() // 重置部分参数
      return
    }
    // 点击搜索按钮后点查看详情 从订单详情页面返回，
    if (this.$route.meta.isBack && this.is_search) {
      return
    }
    // 当前页面为第一次进入,重置搜索条件搜索
    this.resetFilter()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.max-100
  max-width 100px !important
.prior-conditions
  background-color #fcfcfc
.field
  &.is-keyword
    width 300px
  &.is-narrow
    width 110px
  &.classify
    width 360px
.package-content
  display flex
  padding-right 18px
  flex-direction column
  justify-content center
  line-height 18px
  height 36px
  overflow hidden
.section-filter
  display flex
  justify-content space-between
.button
  align-items center
.page-selector
  label
    z-index 5
.tfoot
  overflow hidden
.batched-operations
  display flex
  align-items center
  position absolute
  top 0
  width 100%
  height 36px
  background-color #fff
  box-shadow 0 -1px 12px 0 rgba(0, 0, 0, 0.08)
.sliding-enter-active
  transition top ease-in 0.2s
.sliding-leave-active
  transition top ease-out 0.2s
.sliding-enter, .sliding-leave-to
  top 100%
.batched-operation-segment, .batched-operation-divider
  margin-left 16px
  cursor default
.batched-operation-segment
  line-height 16px
  font-size 13px
  color lightGrey
.batched-operation-divider
  height 13px
  border-left 1px solid rgba(0, 0, 0, 0.08)
.selected-item-count
  margin 0 2px
  color standblack
.batched-operation
  color #2fabdd
  cursor pointer
  &.is-secondary
    color lightGrey
  &.is-danger
    color error
</style>

