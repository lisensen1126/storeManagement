<template lang="pug">
  .section-layout
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .field.is-narrow
            label.label 全部分类
            custom-select(v-model="filterData.firstState", :list="firstClassList", nameField="category_name")
        .field.is-narrow
          custom-select(v-model="filterData.secondState", :list="secondClassList", nameField="category_name")
        .field.is-keyword
          label.label 关键字搜索
          custom-input(v-model="filterData.keyword", placeholder="请输入服务名称", @keyupEnter="applyFilter")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="batchCreateService")
            span.add-icon
            span 批量添加服务
    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有服务'")
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
              td(width="300") 服务名称
              td(width="80") 服务分类
              td(width="80") 服务简述
              td(width="80") 更新日期
              td(width="60") 状态
              td(width="100") 操作
          tbody(v-if="list.length")
            tr(v-for="(item) in list")
              td
                checkbox(:value="item", :list="list", checkoutType="unit", @isCheckboxFun="isCheckout")
              td
                .multi-content-td.has-image
                  .left-image
                    img(:src="scaleImage(item.product_pic, 1, 36, 36)")
                  .content-item.item-title(v-text="item.product_name")
              td
                .simple-td(v-text="item.category_name")
              td
                .multi-content-td(v-if="item.summary === ''") - -
                .multi-content-td(v-text="item.summary", v-else)
              td
                .simple-td(v-text="item.updated_at")
              td
                .simple-td
                  .status-dot(:class="{'green': item.use == '2','grey': item.use == '1'}")
                  span(v-if="item.use == '1'") 未添加
                  span(v-else) 已添加
              td
                .operation-td
                  a.operation-link(@click="viewInfo(item)") 查看
                  span.operation-link(@click="commitData(item)", v-if="item.use == '1'") 添加服务
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
  name: 'serviceLibrary',
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
      isInitiated: false,
      firstClassList: [],
      secondClassList: [],
      currentId: '',
      filterData: {
        firstState: null,
        secondState: null,
        keyword: '',
      },
      is_search: false,
      queryData: {},
      list: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      // 是否全选
      is_all_select: false,
      // 选中项的id集合
      checkout_ids: [],
    }
      // initialize conditions
      ;[schema.filterData, schema.queryData].forEach(conditions => {
        conditions.keyword = ''
      })
    return schema
  },
  methods: {
    // 获取服务库列表数据
    async fetchData (type) {
      if (this.queryData.secondState && this.queryData.secondState.category_id) {
        this.currentId = this.queryData.secondState.category_id
      } else if (this.queryData.firstState && this.queryData.firstState.category_id) {
        this.currentId = this.queryData.firstState.category_id
      } else {
        this.currentId = ''
      }
      try {
        const { response, result } = await this.fetchServiceLibrary({
          hide_loading: type === 'update',
          product_name: this.queryData.keyword,
          category_id: this.currentId,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            result.data.forEach(function (item) {
              item.is_select = false
            })
            this.list.splice(0, this.list.length, ...result.data)
            this.paginationData = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取服务库列表失败',
              content: `出错啦！${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务库列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
        // 初始化全选，默认false
        this.is_all_select = false
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取服务库列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 获取分类数据
    async getClassifyList (parentId) {
      try {
        const { response, result } = await this.fetchCategory({
          type: 2,
          parent_id: parentId,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            // 根据返回的分类级别组装数据
            if (result.data.length <= 0) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取服务分类失败',
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
              title: '获取服务分类失败',
              content: `出错啦！${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务分类失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取服务分类失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 查看详情
    viewInfo (item) {
      this.$router.push({
        name: 'serviceLibraryDetail',
        params: {
          id: item.product_id,
        },
      })
    },
    // 翻页操作
    paging (state) {
      this.paginationData = state
      // this.recallFilter()
      this.fetchData()
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
      this.queryData = JSON.parse(JSON.stringify(this.filterData))
      this.paginationData.current_page = 1
      this.fetchData()
    },
    // 重置部分参数不请求数据
    resetParams () {
      this.filterData.firstState = null
      this.filterData.secondState = null
      this.filterData.keyword = ''
      this.queryData = JSON.parse(JSON.stringify(this.filterData))
    },
    // 添加服务操作
    async commitData (item) {
      this.getParams = {
        basic_spu_id: item.product_id, // 服务库id
        brand_id: item.brand_id, // 服务品牌id
        name: item.product_name, // 服务库名称
        category_id: item.category_id, // 服务分类id
        desc: item.summary, // 服务简述
        pic: item.product_pic, // 服务图示
        mini_price: 0,            // 服务价格
        content: item.content,    // 特色服务
      }
      try {
        this.isLoading = true
        const { response, result } = await this.serviceCreate(this.getParams)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$router.push({
              name: 'serviceEdit',
              params: {
                id: result.data.basic_spu_id,
                isEdit: 1,
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '服务添加失败',
              content: `出错啦！${result.message}`,
            })
            this.isLoading = false
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '服务添加失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '服务添加失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isLoading = false
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
    // 批量添加服务
    async batchCreateService () {
      if (this.checkout_ids.length <= 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '添加服务失败',
          content: '请选择需要添加的服务',
        })
        return false
      }
      // 整理批量添加服务的参数
      let params = {
        basic_spu_id: this.checkout_ids,
      }
      try {
        this.isLoading = true
        const { response, result } = await this.batchAddService(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true,
              type: 'success',
              title: '成功',
              content: '服务已添加成功,请继续编辑服务价格,方可上架',
              resolve: () => {
                this.$router.push({
                  path: 'service',
                })
              },
            })
            this.fetchData('update')
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '服务添加失败',
              content: `出错啦！${result.message}`,
            })
            this.isLoading = false
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '服务添加失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '服务添加失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
  watch: {
    // 选择一级分类，赋值二级分类
    async 'filterData.firstState' () {
      this.filterData.secondState = null
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
  // keep-alive进入
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
@import '~@/stylus/mixins';

.prior-conditions {
  background-color: #fcfcfc;
}

.field {
  &.is-keyword {
    width: 300px;
  }

  &.is-narrow {
    width: 110px;
  }
}

.package-content {
  display: flex;
  padding-right: 18px;
  flex-direction: column;
  justify-content: center;
  line-height: 18px;
  height: 36px;
  overflow: hidden;
}

.section-filter {
  display: flex;
  justify-content: space-between;
}

.button {
  align-items: center;
}

.page-selector {
  label {
    z-index: 5;
  }
}

.tfoot {
  overflow: hidden;
}

.batched-operations {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  width: 100%;
  height: 36px;
  background-color: #fff;
  box-shadow: 0 -1px 12px 0 rgba(0, 0, 0, 0.08);
}

.sliding-enter-active {
  transition: top ease-in 0.2s;
}

.sliding-leave-active {
  transition: top ease-out 0.2s;
}

.sliding-enter, .sliding-leave-to {
  top: 100%;
}

.batched-operation-segment, .batched-operation-divider {
  margin-left: 16px;
  cursor: default;
}

.batched-operation-segment {
  line-height: 16px;
  font-size: 13px;
  color: lightGrey;
}

.batched-operation-divider {
  height: 13px;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

.selected-item-count {
  margin: 0 2px;
  color: standblack;
}

.batched-operation {
  color: #2fabdd;
  cursor: pointer;

  &.is-secondary {
    color: lightGrey;
  }

  &.is-danger {
    color: error;
  }
}

.item-title {
  line-height: 35px;
}

td, .multi-content-td {
  vertical-align: middle;
  word-break: break-all;
}
</style>

