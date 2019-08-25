<template lang="pug">
  .section-layout
    choose-good(v-model="show_product", v-if="show_product", @resolve="getProduct",:type="type")
    choose-serve(v-model="show_serve", v-if="show_serve", @resolve="getServe", :type="type")
    choose-card(v-model="show_card", v-if="show_card", @resolve="getCard", :type="type")
    .section-filter
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="query_data.keyword", placeholder="商品/服务/养护卡名称", @keyupEnter="applyFilter")
        .field.staff-wrapper(v-if="is_show")
          label.label 全部分类
          choose-tab(@success="getClassify" ref="child", :default="search_classify")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="openModel(3)")
            span.add-icon
            span 添加拼团养护卡
        .field
          label.label &nbsp;
          a.button.primary(@click="openModel(2)")
            span.add-icon
            span 添加拼团服务
        .field
          label.label &nbsp;
          a.button.primary(@click="openModel(1)")
            span.add-icon
            span 添加拼团商品
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前没有拼团管理'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="120") 商品/服务/养护卡
              td(width="60") 分类
              td(width="80") 成团人数
              td(width="80") 成团价
              td(width="100") 活动状态
              td(width="100") 排序
                span(v-if="is_search") (不可用)
              td(width="100") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.product_name}}
              td
                .simple-td {{item.category_name}}
              td
                .simple-td {{item.num}}
              td
                .simple-td {{item.mini_price}}
              td
                .simple-td(v-if="item.status === 1") 已开始
                .simple-td(v-if="item.status === 2") 已结束
              td.tr-p
                div(v-if="!is_search")
                  .up(v-if="index !== 0", @click="sortItem(item.id, index, 'up')")
                  .down(v-if="index !== list.length - 1", @click="sortItem(item.id, index, 'down')" )
              td
                .operation-td
                  span.operation-link(@click="goDetail(item)") 查看
                  span.operation-link(v-if="item.status === 2", @click="changeStatus(item)") 开始
                  span.operation-link.danger(v-if="item.status === 1", @click="changeStatus(item)") 结束
      .tfoot(v-if="true")
        pagination(:pagination-data="pagination_data", @input="paging")
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import Pagination from '@/components/generics/Pagination'
  import GroupApi from '@/mixins/modules/Group'
  import filterTools from '@/mixins/utilities/filterTools'
  import EmptyPage from '@/components/generics/EmptyPage'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import ChooseGood from '@/components/marketing/modal/ChooseGood'
  import ChooseServe from '@/components/marketing/modal/ChooseServe'
  import ChooseCard from '@/components/marketing/modal/ChooseCardModal'
  import ChooseTab from '@/components/marketing/modal/ChooseTab'
  import ProductServiceMixin from '@/mixins/modules/productService'
  export default {
    name: 'GroupMangeList',
    mixins: [GroupApi, filterTools, ProductServiceMixin],
    components: {
      CustomInput,
      EmptyPage,
      Pagination,
      CustomSelect,
      ChooseGood,
      ChooseTab,
      ChooseServe,
      ChooseCard,
    },
    data: _ => {
      const schema = {
        show_card: false, // 选择卡片
        type: 'group', // 选择图片的类型
        is_show: false, // 选择分类展示（不加回显分类时回出现问题）
        show_product: false,    // 控制商品
        show_serve: false, // 控制服务
        search_classify: [], // 选择分类的数据
        is_initiated: false,
        pagination_data: {
          current_page: 1,
          per_page: 999,
          last_page: 1,
          total: 0,
        },
        query_data: {
          keyword: '',
        },
        list: [],
        is_search: false, // 是否搜索(隐藏排序用)
      }
      return schema
    },
    methods: {
      /**
       * 排序
       * @id 拼团id
       * @index {int} 序列号
       * @type {string} up or down
       */
      sortItem (id, index, type) {
        let arr = [...this.list]
        this.list = []
        let temp = arr[index]
        // 向上移动
        if (type === 'up') {
          arr[index] = arr[index - 1]
          arr[index - 1] = temp
          this.groupSort({id, sort: 1})
        }
        // 向下移动
        if (type === 'down') {
          arr[index] = arr[index + 1]
          arr[index + 1] = temp
          this.groupSort({id, sort: 2})
        }
        this.list = [...arr]
      },
      /**
       * 拼团列表排序
       * @params {id: 拼团id, sort: 1 向上排序，2 向下排序}
       *  */
      async groupSort (params) {
        try {
          const {response, result} = await this.groupSortApi(params)
          if (response.status === 200 && result.code === 0) {
  
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '拼团排序失败',
              content: `${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '拼团排序失败',
            content: `错误: ${err}`,
          })
        }
      },
      // 选择卡片弹框
      getCard (e) {
        this.$router.push({
          name: 'groupCardAdd',
          query: {
            id: e.id,
          },
        })
      },
      // 获取分类
      getClassify (val) {
        this.search_classify = val
      },
      // 获取详情 1 商品 2 服务 3-5 卡片
      async getDetail (item) {
        let type = item.type
        try {
          const {response, result} = type > 2 ? await this.upkeepDetailApi({id: item.basic_spu_id}) : type === 1 ? await this.fetchProductDetail(item.basic_spu_id) : await this.fetchServiceDetail(item.basic_spu_id)
          if (response.status === 200 && result.code === 0) {
            if ((result.data.name && result.data.is_sale === 1) || (result.data.info && result.data.info.name && result.data.info.status === 1)) {
              this.editGroup(item)
            } else {
              let txt = type === 1 ? '商品' : type === 2 ? '服务' : '养护卡'
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '拼团开始失败',
                content: '该' + txt + '已下架或删除，请确保上架后再开始拼团活动！',
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '商品服务养护卡详情获取失败',
              content: result.data,
            })
          }
        } catch (err) {
          console.error(err, '商品服务养护卡详情')
        }
      },
      /*
      *  去详情
      *  item {obj}
      * */
      goDetail (item) {
        this.$global.query_data = this.query_data
        this.$global.pagination_data = this.pagination_data
        this.$global.search_classify = this.search_classify
        let query = {
          id: item.id,
          history_product_id: item.history_product_id,
        }
        if (item.type > 2) {
          query = {
            id: item.history_product_id,
            group_id: item.id,
          }
        }
        this.$router.push({
          name: item.type === 2 ? 'groupServeDetail' : item.type === 1 ? 'groupDetail' : 'groupCardDetail',
          query: query,
        })
      },
      /*
      * 结束开始参团商品
      * item {obj}
      * */
      changeStatus (item) {
        if (item.status === 1) {
          this.$store.dispatch('showMessage', {
            title: `确认${item.status === 1 ? '结束' : '开始'}吗？`,
            isRejectable: 1,
            resolve: () => {
              this.changeApi(item.id, 2)
            },
          })
        } else {
          this.getDetail(item)
        }
      },
      /*
      * 开始关闭接口
      * id 拼团id
      * status 拼团状态
      * */
      async changeApi (id, status) {
        let params = {id: id}
        try {
          const {response, result} = await this.statusChangeApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              if (result.message === 'success') {
                this.$store.dispatch('showMessage', {
                  type: 'success',
                  title: `${parseInt(status) === 1 ? '开始' : '结束'}成功`,
                  autoClose: true,
                })
                this.fetchData()
              } else {
                this.$store.dispatch('showMessage', {
                  type: 'failure',
                  title: `${parseInt(status) === 1 ? '开始' : '结束'}失败`,
                })
                return false
              }
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: `${parseInt(status) === 1 ? '开始' : '结束'}失败`,
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: `${parseInt(status) === 1 ? '开始' : '结束'}失败`,
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '开始结束失败')
        }
      },
      // 成功选择商品的回调
      getProduct (e) {
        this.$router.push({
          name: 'groupAdd',
          query: {
            id: e.product_id,
          },
        })
      },
      // 成功选择服务的回调
      getServe (e) {
        this.$router.push({
          name: 'groupServeAdd',
          query: {
            id: e.basic_spu_id,
          },
        })
      },
      // 打开选择商品的弹框
      openModel (type) {
        if (type - 0 === 1) {
          this.show_product = true
        } else if (type - 0 === 2) {
          this.show_serve = true
        } else {
          this.show_card = true
        }
      },
      // 列表
      async fetchData () {
        let params = {
          product_name: this.query_data.keyword.trim(),
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
        }
        if (this.search_classify.length > 1) {
          params.type = this.search_classify[0]
          if (params.type > 2 && this.search_classify[1] !== 0) {
            params.parent_category_id = this.search_classify[1]
          } else {
            if (this.search_classify.length > 2) {
              params.parent_category_id = this.search_classify[1]
              if (this.search_classify[2] !== 0) {
                params.category_id = this.search_classify[2]
              }
            }
          }
        }
        if (params.product_name || params.type) {
          this.is_search = true
        } else {
          this.is_search = false
        }
        try {
          const {response, result} = await this.groupListApi(params)
          if (response.status === 200 && result.code === 0) {
            this.list.splice(0, this.list.length, ...result.data)
            this.list.forEach(function (v) {
              v.mini_price = (v.mini_price / 100).toFixed(2)
            })
            this.pagination_data = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取拼团列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取拼团列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.is_initiated = true
      },
      // 重置
      applyFilter () {
        this.pagination_data.current_page = 1
        this.fetchData()
      },
      // 重置
      resetFilter () {
        this.$refs.child.parentMsg()
        this.search_classify = []
        this.query_data = {
          keyword: '',
        }
        this.pagination_data.current_page = 1
        this.is_search = false
        this.fetchData()
      },
      // 上下页
      paging (state) {
        this.pagination_data = state
        this.fetchData()
      },
      /*
      * 去编辑页面
      * item {obj}
      * */
      editGroup (item) {
        this.$global.query_data = this.query_data
        this.$global.pagination_data = this.pagination_data
        this.$global.search_classify = this.search_classify
        let query = {
          id: item.id,
          basic_spu_id: item.basic_spu_id,
        }
        if (item.type > 2) {
          query = {
            id: item.basic_spu_id,
            group_id: item.id,
          }
        }
        this.$router.push({
          name: item.type === 2 ? 'groupServeEdit' : item.type === 1 ? 'groupEdit' : 'groupCardEdit',
          query: query,
        })
      },
    },
    mounted () {
      if (this.$global.pagination_data) {
        this.pagination_data = this.$global.pagination_data
        this.query_data = this.$global.query_data
        this.search_classify = this.$global.search_classify
      }
      this.is_show = true
      this.fetchData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .section-filter
    display flex
    justify-content space-between
  .keyword-wrapper
    width 244px
  .button
    align-items center
  .add-icon
    display inline-flex
    width 16px
    height 16px
    background url('~@/assets/icons/button-add.svg') no-repeat center center
    background-size cover
    margin-right 6px
  .td-with-tip
    position relative
    display flex
    align-items center
  .help-tip-icon
    position relative
    display inline-block
    width 12px
    height 12px
    background url('~@/assets/icons/help.svg') no-repeat center center
    background-size cover
    margin-left 4px
    &:hover
      .help-tip
        display block
  .help-tip
    display none
    z-index 213
    position absolute
    top 22px
    left -76px
    width 160px
    padding 4px 6px
    border-radius 2px
    background-color #121212
    color #fff
    font-size 12px
    line-height 18px
    &::after
      content ''
      position absolute
      width 8px
      height 8px
      left 50%
      top -4px
      margin-left -2px
      transform rotate(45deg)
      background-color #121212
  .section-layout
    height calc(100% - 48px)
  .list-wrapper
    height calc(100% - 90px) !important
  .tr-p
    position relative
    .up
    .down
      position absolute
      top 17px
      width 20px
      height 30px
      opacity .5
      cursor pointer
      &.is-disable
        opacity .2
        pointer-events none
      &:hover
        opacity 1
    .up
      left 0
      background center no-repeat url('~@/assets/icons/move-up.svg')
      background-size 20px 30px
    .down
      left 25px
      background center no-repeat url('~@/assets/icons/move-down.svg')
      background-size 20px 30px
    .delete
      position absolute
      top 8px
      right 8px
      width 16px
      height 16px
      background center no-repeat url('~@/assets/icons/trash.svg')
      cursor pointer
</style>

