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
          custom-input(v-model="filterData.keyword", placeholder="请输入服务名称", @keyupEnter="applyFilter")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="createService")
            span.add-icon
            span 添加服务
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
              td(width="150") 服务名称
              td(width="80") 服务价格
              td(width="60") 服务分类
              td(width="60") 来源
              td(width="80") 上架状态
              td(width="90") 操作时间
              td(width="60") 操作人
              td(width="100") 备注
              td(width="120") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                checkbox(:value="item", :list="list", checkoutType="unit", @isCheckboxFun="isCheckout")
              td
                .simple-td.has-image
                  .left-image
                    img(:src="scaleImage(item.pic, 1, 36, 36)")
                  .content-item(v-text="item.name")
              td
                .simple-td(v-if="item.mini_price == '0'",v-text="'—'")
                .simple-td(v-else, v-text="'¥' + item.mini_price")
              td
                .simple-td(v-text="item.category_name")
              td
                .simple-td(v-if="item.source =='1'",v-text="'同步'")
                .simple-td(v-if="item.source =='2'",v-text="'创建'")
              td
                .simple-td(v-if="item.is_sale =='1'")
                  .status-dot.green
                  span 已上架
                .simple-td(v-if="item.is_sale =='2'")
                  .status-dot.grey
                  span 已下架
              td
                .simple-td(v-text="item.updated_at")
              td
                .simple-td(v-text="item.operator_name")
              td
                .simple-td(v-text="item.remark")
              td
                .operation-td
                  span.operation-link(@click="viewInfo(item)") 查看
                  span.operation-link(v-if="item.is_sale === 2", @click="editInfo(item)") 编辑
                  span.operation-link(v-if="item.is_sale =='1'", @click="toggleSellingState(item)") 下架
                  span.operation-link(v-if="item.is_sale =='2'", @click="toggleSellingState(item)") 上架
                  span.operation-link(v-if="item.is_sale =='2'",@click="deleteService(item)") 删除
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
        transition(name="sliding")
          .batched-operations(v-if="checkout_ids.length>0")
            .batched-operation-segment.batched-operation.is-secondary(@click="deselected") 取消选择
            .batched-operation-divider
            .batched-operation-segment
              | 已选择
              span.selected-item-count(v-text="checkout_ids.length")
              | 件服务
            .batched-operation-segment.batched-operation.btn-up.btn-cover(@click="toggleState(1)") 批量上架
            .batched-operation-segment.batched-operation.btn-down.btn-cover(@click="toggleState(2)") 批量下架
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
  name: 'serviceList',
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
      categoryList: [],
      firstClassList: [],
      secondClassList: [],
      filterData: {
        firstState: null,
        secondState: null,
        keyword: '',
        selectedSellingState: null,
      },
      is_search: false,
      queryData: {},
      list: [],
      sellingStates: [
        {name: '全部', value: 'ALL'},
        {name: '已上架', value: 1},
        {name: '已下架', value: 2},
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
      is_all_select: false,
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
    // 获取分类数据
    async getClassifyList (parentId) {
      try {
        const {response, result} = await this.fetchCategory({
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
    // 获取服务列表数据
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
        const {response, result} = await this.fetchService({
          hide_loading: (type === 'update'),
          name: this.queryData.keyword,
          is_sale: this.queryData.selectedSellingState.value === 'ALL' ? undefined : this.queryData.selectedSellingState.value,
          category_id: this.currentId,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200) {
          if (parseInt(result.code) === 0) {
            result.data.forEach(function (item) {
              if (item.mini_price) {
                // 返回的数据为分，需要格式化为元
                item.mini_price = self.accDiv(item.mini_price, 100).toFixed(2)
              }
              item.remark = item.remark.replace(/[\r\n]/g, '')
              item.is_select = false
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
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取服务列表失败',
              content: `出错啦！${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取服务列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 翻页操作
    paging (state) {
      this.paginationData = state
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
    // 添加服务
    createService () {
      this.$router.push({
        name: 'serviceAdd',
      })
    },
    // 上、下架操作
    toggleSellingState (item) {
      this.checkout_ids = []
      this.is_all_select = false
      this.list.forEach(ele => {
        ele.is_select = false
      })
      if (item.mini_price === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请先编辑好服务价格，再进行上/下架操作',
        })
        return false
      }
      this.$store.dispatch('showMessage', {
        title: `确认${item.is_sale === 1 ? '下架' : '上架'}该服务？`,
        content: item.is_sale === 1 ? '下架后服务将不在商城售卖' : '上架后即可在商城购买该服务',
        isRejectable: 1,
        resolve: () => {
          this.setSellingState(item.basic_spu_id)
        },
      })
    },
    async setSellingState (id) {
      try {
        const {response, result} = await this.serviceShelves(id)
        if (response.status === 200) {
          if (result.code === 0) {
            await this.fetchData()
          } else if (result.code === 1006) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改服务上下架状态失败',
              content: '失败原因：服务信息不完整',
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改服务上下架状态失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改服务上下架状态失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '修改服务上下架状态失败',
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
    // 删除服务项
    deleteService (item) {
      if (parseInt(item.is_sale) === 1) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请先下架该服务，再进行删除操作',
        })
        return false
      } else {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '确认删除该项服务？',
          isRejectable: 1,
          resolve: () => {
            this.deleteServiceFun(item.basic_spu_id)
          },
        })
      }
    },
    // 查看详情
    viewInfo (item) {
      this.$router.push({
        name: 'serviceDetail',
        params: {
          id: item.basic_spu_id,
          isEdit: 0,
        },
        query: {
          from: 'serviceList',
        },
      })
    },
    // 编辑详情
    editInfo (item) {
      this.$router.push({
        name: 'serviceEdit',
        params: {
          id: item.basic_spu_id,
          isEdit: 1,
        },
      })
    },
    // 删除服务项请求接口
    async deleteServiceFun (id) {
      // 如果未点击过搜索按钮
      if (!this.is_search) {
        this.resetParams() // 重置部分参数
      }
      // 如果当前页只剩一条数据 且 当前页不是第一页
      if (this.list.length === 1 && this.paginationData.current_page > 1) {
        this.paginationData.current_page--
      }
      let _this = this
      try {
        const {response, result} = await this.serviceDelete({
          basic_spu_id: id,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              type: 'success',
              title: '删除成功',
              autoClose: true,
            })
            // 获取列表数据，update类型隐藏接口loading
            _this.fetchData('update')
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除失败',
              content: `出错啦！${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除失败',
            content: `${result.message}${result && result.code ? ',错误码：' + result.code : ''}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '删除失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
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
            ids.push(item.basic_spu_id)
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
            ids.push(item.basic_spu_id)
          } else {
            item.is_select = false
          }
        })
        this.checkout_ids = ids
      }
    },
    // 批量上下架弹窗提醒
    toggleState (type) {
      // 无符合条件的id存在时，向用户抛错
      if (this.checkout_ids <= 0) {
        this.$store.dispatch('showMessage', {
          title: '提示',
          content: `确认所选服务支持批量${type === 1 ? '上架' : '下架'}？`,
        })
        return false
      }
      this.$store.dispatch('showMessage', {
        title: `确认批量${type === 1 ? '上架' : '下架'}所选服务？`,
        content: type === 2 ? '下架后服务将不在商城售卖' : '上架后即可在商城购买该服务',
        isRejectable: 1,
        resolve: () => {
          this.servicesBatch(type)
        },
      })
    },
    // 批量上下架 type 1:上架 2：下架
    async servicesBatch (type) {
      let _this = this
      // type 1:上架 2：下架;   basic_spu_id: 基础库spu_id
      let params = {
        basic_spu_id: _this.checkout_ids,
        type: type,
      }
      try {
        const {response, result} = await this.batchShelves(params)
        if (response.status === 200) {
          if (result.code === 0) {
            // 存在失败项，展示弹窗提示
            if (result.data.failure.length > 0) {
              if (type - 0 === 1) {
                _this.$store.dispatch('showMessage', {
                  type: 'failure',
                  title: `${result.data.failure.length}件服务${parseInt(type) === 1 ? '上架' : '下架'}失败`,
                  content: '失败原因：服务信息不完整',
                })
              } else {
                this.$store.dispatch('showMessage', {
                  type: 'failure',
                  title: `${result.data.failure.length}件服务${parseInt(type) === 1 ? '上架' : '下架'}失败`,
                  content: '该商品正在参与营销活动不能下架',
                })
              }
            } else {
              _this.$store.dispatch('showMessage', {
                type: 'success',
                title: `批量操作${parseInt(type) === 1 ? '上架' : '下架'}成功`,
                autoClose: true,
              })
            }
            await _this.fetchData('update')
            let ids = []
            // 整理列表项的选中状态
            _this.list.forEach(function (item) {
              if (result.data.failure.indexOf(item.basic_spu_id) === -1) {
                item.is_select = false
                _this.is_all_select = false
              } else {
                ids.push(item.basic_spu_id)
                item.is_select = true
              }
            })
            _this.checkout_ids = ids
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: `批量${parseInt(type) === 1 ? '上架' : '下架'}操作失败`,
              content: `出错啦！${result.message}`,
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
    console.log(from.name, from.query)
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
    if ((from.name === 'serviceAdd' && to.query.save !== 1)) {
      to.meta.isPreserve = true
    }
    next()
  },
/**
   * keep-alive 进入
   * @isOutside 是不是从tab切换进入
   * @isPreserve 是不是保存
   */
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

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
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
    box-shadow 0 -1px 12px 0 rgba(0, 0, 0, .08)
  .sliding-enter-active
    transition top ease-in .2s
  .sliding-leave-active
    transition top ease-out .2s
  .sliding-enter
  .sliding-leave-to
    top 100%
  .batched-operation-segment
  .batched-operation-divider
    margin-left 16px
    cursor default
  .batched-operation-segment
    line-height 16px
    font-size 13px
    color lightGrey
  .batched-operation-divider
    height 13px
    border-left 1px solid rgba(0,0,0,.08)
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
  .up-down
    margin-right 10px
    /* 批量上下 样式*/
  .btn-up
    position: absolute
    right: 108px
  .btn-down
    position: absolute
    right: 16px
  .btn-cover
    color: #121212
    background: #ffbb29
    border: none
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.08)
    padding: 6px 14px
    border-radius 3px
</style>

