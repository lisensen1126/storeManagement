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
          label.label 上下架状态
          custom-select(v-model="filterData.selectedSellingState", :list="sellingStates")
        .field.is-keyword
          label.label 关键字搜索
          custom-input(v-model="filterData.keyword", placeholder="请输入商品名称", @keyupEnter="applyFilter")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="createProduct")
            span.add-icon
            span 添加商品
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
              td(width="150") 商品名称
              //- td(width="80") 价格
              td(width="60") 所属分类
              td(width="60") 来源
              td(width="80") 上架状态
              td(width="90") 操作时间
              td(width="80") 操作人
              td(width="100") 备注
              td(width="80") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                checkbox(:value="item", :list="list", checkoutType="unit", @isCheckboxFun="isCheckout")
              td
                .simple-td.has-image
                  .left-image
                    img(:src="scaleImage(item.pic, 1, 36, 36)")
                  .content-item(v-text="item.name")
              //- td
              //-   .simple-td(v-text="'¥' + item.mini_price")
              td
                .simple-td(v-text="item.category_name")
              td
                .simple-td(v-text="item.source === 1? '同步':'创建'")
              td
                .simple-td(v-if="item.is_sale ===1")
                  .status-dot.green
                  span 已上架
                .simple-td(v-if="item.is_sale === 2")
                  .status-dot.grey
                  span 已下架
              td
                .simple-td(v-text="item.updated_at")
              td
                .simple-td(v-text="item.operator_name")
              td
                .simple-td.width-160(v-text="item.remark")
              td
                .operation-td
                  span.operation-link(@click="viewInfo(item)") 查看
                  span.operation-link(v-if="item.is_sale == '2'", @click="editInfo(item)") 编辑
                  span.operation-link(v-if="item.is_sale =='1'", @click="toggleSellingState(item)") 下架
                  span.operation-link(v-if="item.is_sale =='2'", @click="toggleSellingState(item)") 上架
                  span.operation-link(v-if="item.is_sale =='2'", @click="deleteOperate(item.product_id)") 删除
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
        transition(name="sliding")
          .batched-operations(v-if="checkout_ids.length>0")
            .batched-operation-segment.batched-operation.is-secondary(@click="deselected") 取消选择
            .batched-operation-divider
            .batched-operation-segment
              | 已选择
              span.selected-item-count(v-text="checkout_ids.length")
              | 件商品
            .batched-operation-segment.batched-operation.btn-up.btn-cover(@click="productUp()") 批量上架
            .batched-operation-segment.batched-operation.btn-down.btn-cover(@click="productDown()") 批量下架
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
import MathFun from '@/mixins/utilities/math'
export default {
  name: 'productList',
  mixins: [productServiceMixin, filterTools, imageScale, MathFun],
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
      // thirdState: null,
      // thirdClassList: [],
      filterData: {
        firstState: null,
        secondState: null,
        keyword: '',
        selectedSellingState: null,
      },
      queryData: {},
      list: [],
      is_search: false,
      sellingStates: [
        { name: '全部', value: 'ALL' },
        { name: '已上架', value: 1 },
        { name: '已下架', value: 2 },
      ],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      // 选中列表项的id集合
      checkout_ids: [],
      // 是否全选
      is_all_select: false, // 是否全选
      is_first_enter: false, // 是否第一次进入页面
      is_back: false, // 是否返回
    }
      // initialize conditions
      ;[schema.filterData, schema.queryData].forEach(conditions => {
        conditions.keyword = ''
        conditions.selectedSellingState = schema.sellingStates[0]
      })
    return schema
  },
  methods: {
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
    // 批量上架
    productUp () {
      if (this.checkout_ids.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请先选中至少一项服务，再进行批量上架操作',
        })
        return false
      }
      this.$store.dispatch('showMessage', {
        title: '确认批量上架所选商品？',
        content: '上架后即可在商城购买该商品',
        isRejectable: 1,
        resolve: () => {
          this.batchState(this.checkout_ids, 1)
        },
      })
    },
    // 批量下架
    productDown () {
      if (this.checkout_ids.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请先选中至少一项服务，再进行批量下架操作',
        })
        return false
      }
      this.$store.dispatch('showMessage', {
        title: '确认批量下架所选商品？',
        content: '下架后商品将不在商城售卖',
        isRejectable: 1,
        resolve: () => {
          this.batchState(this.checkout_ids, 2)
        },
      })
    },
    // 批量上下架
    async batchState (ids, type) {
      let _this = this
      let id = []
      try {
        const { response, result } = await this.productShelves({
          product_ids: ids,
          is_sale: type,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            if (result.data.error_number === 0) {
              this.$store.dispatch('showMessage', {
                type: 'success',
                title: `批量操作${parseInt(type) === 1 ? '上架' : '下架'}成功`,
                autoClose: true,
              })
            } else {
              if (type - 0 === 1) {
                this.$store.dispatch('showMessage', {
                  type: 'failure',
                  title: `${result.data.error_number}件商品${parseInt(type) === 1 ? '上架' : '下架'}失败`,
                  content: '失败原因：商品sku配置不全',
                })
              } else {
                this.$store.dispatch('showMessage', {
                  type: 'failure',
                  title: `${result.data.error_number}件商品${parseInt(type) === 1 ? '上架' : '下架'}失败`,
                  content: '该商品正在参与营销活动不能下架',
                })
              }
            }
            await this.fetchData('update')
            // 添加显示失败后的商品
            _this.list.forEach(function (item) {
              if (result.data.error_ids.indexOf(item.product_id) === -1) {
                item.is_select = false
                _this.is_all_select = false
              } else {
                id.push(item.product_id)
                item.is_select = true
              }
            })
            _this.checkout_ids = id
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: `批量${parseInt(type) === 1 ? '上架' : '下架'}操作失败`,
              content: `出错啦！错误码：${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: `批量${parseInt(type) === 1 ? '上架' : '下架'}操作失败`,
            content: `操作失败，错误状态码：（${response.status}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: `批量${parseInt(type) === 1 ? '上架' : '下架'}操作失败`,
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 取消选择
    deselected () {
      this.checkout_ids = []
      this.is_all_select = false
      this.list.forEach(item => {
        item.is_select = false
      })
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
    // 获取商品列表数据
    async fetchData (type) {
      this.checkout_ids = []
      if (this.queryData.secondState && this.queryData.secondState.category_id) {
        this.currentId = this.queryData.secondState.category_id
      } else if (this.queryData.firstState && this.queryData.firstState.category_id) {
        this.currentId = this.queryData.firstState.category_id
      } else {
        this.currentId = ''
      }
      let self = this
      try {
        const { response, result } = await this.fetchProduct({
          hide_loading: (type === 'update'),
          keyword: this.queryData.keyword,
          is_sale: this.queryData.selectedSellingState.value === 'ALL' ? undefined : this.queryData.selectedSellingState.value,
          category_id: this.currentId,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200) {
          if (parseInt(result.code) === 0) {
            result.data.forEach(function (item) {
              item.remark = item.remark.replace(/[\r\n]/g, '')
              item.is_select = false
              item.mini_price = self.accDiv(item.mini_price, 100).toFixed(2)
              if (item.updated_at === 0) {
                item.updated_at = '--'
              } else {
                item.updated_at = self.changeDateTime(item.updated_at)
              }
            })
            this.list.splice(0, this.list.length, ...result.data)
            this.paginationData = result.meta

            // 初始化全选，默认false
            this.is_all_select = false
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取商品列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 翻页操作
    paging (state) {
      this.paginationData = state
      this.fetchData()
      this.is_all_select = false
    },
    // 查看详情
    viewInfo (item) {
      this.$router.push({
        name: 'productDetail',
        params: {
          id: item.product_id,
        },
        query: {
          from: 'productList',
        },
      })
    },
    // 编辑商品
    editInfo (item) {
      // 记录列表页数
      this.$router.push({
        name: 'productEdit',
        params: {
          id: item.product_id,
        },
      })
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
    resetFilter (page) {
      this.is_search = false
      this.paginationData.current_page = page || 1
      this.is_first_enter = false
      this.filterData.firstState = null
      this.filterData.secondState = null
      this.filterData.keyword = ''
      this.filterData.selectedSellingState = this.sellingStates[0]
      this.queryData = JSON.parse(JSON.stringify(this.filterData))
      this.fetchData()
    },
    // 重置部分参数，不发送请求
    resetParams () {
      this.is_first_enter = false
      this.filterData.firstState = null
      this.filterData.secondState = null
      this.filterData.keyword = ''
      this.filterData.selectedSellingState = this.sellingStates[0]
      this.queryData = JSON.parse(JSON.stringify(this.filterData))
    },
    // 添加商品
    createProduct () {
      this.$router.push({
        name: 'productAdd',
      })
    },
    // 上、下架操作
    toggleSellingState (item) {
      this.checkout_ids = []
      this.is_all_select = false
      this.list.forEach(ele => {
        ele.is_select = false
      })
      let type = item.is_sale === 1 ? 2 : 1
      this.$store.dispatch('showMessage', {
        title: `确认${item.is_sale === 1 ? '下架' : '上架'}该商品？`,
        content: item.is_sale === 1 ? '下架后商品将不在商城售卖' : '上架后即可在商城购买该商品',
        isRejectable: 1,
        resolve: () => {
          this.setSellingState(item.product_id, type)
        },
      })
    },
    async setSellingState (id, type) {
      let ids = []
      ids.push(id)
      let params = {
        product_ids: ids,
        is_sale: type,
      }
      try {
        const { response, result } = await this.productShelves(params)
        if (response.status === 200) {
          if (result.code === 0) {
            if (result.data.error_number === 0) {
              this.$store.dispatch('showMessage', {
                type: 'success',
                title: `操作${parseInt(type) === 1 ? '上架' : '下架'}成功`,
                autoClose: true,
              })
            } else {
              if (type - 0 === 1) {
                this.$store.dispatch('showMessage', {
                  type: 'failure',
                  title: '修改商品上架状态失败',
                  content: '失败原因：商品sku配置不全',
                })
              } else {
                this.$store.dispatch('showMessage', {
                  type: 'failure',
                  title: '修改商品下架状态失败',
                  content: '该商品正在参与营销活动不能下架',
                })
              }
              return false
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: `修改商品${parseInt(type) === 1 ? '上架' : '下架'}状态失败`,
              content: result.message,
            })
          }
          await this.fetchData()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: `修改商品${parseInt(type) === 1 ? '上架' : '下架'}状态失败`,
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: `修改商品${parseInt(type) === 1 ? '上架' : '下架'}状态失败`,
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 删除操作
    deleteOperate (id) {
      this.$store.dispatch('showMessage', {
        title: '删除提示？',
        content: '确认删除该商品？',
        isRejectable: 1,
        resolve: () => {
          this.deleteProduct(id)
        },
      })
    },
    // 删除商品
    async deleteProduct (id) {
      // 如果未点击过搜索按钮
      if (!this.is_search) {
        this.resetParams() // 重置部分参数
      }
      // 如果当前页只剩一条数据 且 当前页不是第一页
      if (this.list.length === 1 && this.paginationData.current_page > 1) {
        this.paginationData.current_page--
      }
      try {
        const { response, result } = await this.productDelete(id)
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除商品失败',
              content: `${result.message}`,
            })
            return false
          }
          await this.fetchData()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除商品失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '删除商品失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    /**
     * 时间戳转年月日
     * @val  时间戳
     */
    changeDateTime (val) {
      if (!val) {
        return ''
      }
      let date = new Date(val * 1000)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = this.judgeTime(date.getDate()) + ' '
      let h = this.judgeTime(date.getHours()) + ':'
      let m = this.judgeTime(date.getMinutes())
      return Y + M + D + h + m
    },
    /**
     * 时 分 格式化
     * @t  时分
     */
    judgeTime (t) {
      if (t < 10) {
        return '0' + t
      } else {
        return t
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
    this.is_first_enter = true
    this.getClassifyList(0) // 获取分类数据
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
   /**
     * 判断是否属于同级页面
     * (由切换tab进入)
     */
    if (!from.meta.isSlibing) {
      to.meta.isOutside = true
    }
    /**
     * 是添加 且 不是返回(保存)
     * @save: 1(返回)
     */
    if ((from.name === 'productAdd' && to.query.save !== 1)) {
      to.meta.isPreserve = true
    }
    next()
  },
  // keep-alive进入
  activated () {
    /**
     * 未点搜索按钮
     */
    if (!this.is_search) {
      this.resetParams() // 重置部分参数
    }
    /**
     * 由切换tab进入 或
     * 是添加 且 不是返回(保存)
     */
    if (this.$route.meta.isOutside || this.$route.meta.isPreserve) {
      this.resetFilter() // 重置全部参数
      this.$route.meta.isPreserve = false
      this.$route.meta.isOutside = false
      return
    }
    /**
     * 如果是返回不请求接口
     * @save: 1(返回)
     */
    if (Number(this.$route.query.save) !== 1) {
      this.fetchData()
      this.$route.meta.isPreserve = false
      this.$route.meta.isOutside = false
    }
  },
}
</script>

<style lang='stylus' scoped>
@import '~@/stylus/mixins'
.width-160
  width 160px !important
.content-item, .simple-td
  word-break break-all !important
  white-space pre-wrap !important
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
/* 批量上下 样式 */
.btn-up
  position absolute
  right 108px
.btn-down
  position absolute
  right 16px
.btn-cover
  color #121212
  background #ffbb29
  border none
  box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.08)
  padding 6px 14px
  border-radius 3px
</style>

