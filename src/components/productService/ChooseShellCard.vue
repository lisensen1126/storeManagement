<template lang="pug">
  .section-layout
    .page-title 选择壳牌养护卡
    .section-filter
      .field-group.is-horizontal
        .field
          label.label 关键字搜索
          custom-input(v-model="filter_data.keyword", placeholder="搜索名称", @keyupEnter="applyFilter")
        .field.is-narrow
          label.label 分类
          custom-select(v-model="choose_classify", :list="classify_list", nameField="name")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button(@click="goBack")
            span 返回
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前暂无可用壳牌养护卡'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="80") 名称
              td(width="50") 卡面
              td(width="100") 分类
              td(width="50") 项目数量
              td(width="50") 使用次数
              td(width="80") 价格
              td(width="100") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.name}}
              td
                .multi-content-td.has-image
                  .left-image
                    img(:src="item.image_url")
              td
                .simple-td {{item.category_name}}
              td
                .simple-td {{item.item_count}}
              td
                .simple-td {{item.num}}
              td
                .simple-td ￥{{item.price}}
              td
                .operation-td
                  span.operation-link(@click="goCardDetail(item.id)") 查看
                  span.operation-link(v-if="item.is_exist === 2" @click="goEdit(item.id)") 添加
      .tfoot
        pagination(:pagination-data="pagination_data", @input="paging")
      slide-out-modal(v-if="slide_visible", @input="toggleSidePannel")
        shell-card-detail(:id="current_id")
</template>

<script>
  import Pagination from '@/components/generics/Pagination'
  import filterTools from '@/mixins/utilities/filterTools'
  import imageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import productServiceMixin from '@/mixins/modules/productService'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import ShellCardDetail from '@/components/productService/modal/ShellCardDetail'
  import SlideOutModal from '@/components/generics/SlideOutModal'

  export default {
    name: 'chooseShellCard',
    mixins: [filterTools, productServiceMixin, imageScale],
    components: {
      Pagination,
      EmptyPage,
      CustomInput,
      CustomSelect,
      ShellCardDetail,
      SlideOutModal,
    },
    data: _ => {
      const schema = {
        filter_data: {
          keyword: '',
        },
        choose_classify: null, // 已选分类
        classify_list: [], // 分类列表
        pagination_data: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        list: [],
        is_initiated: false,
        choose_id: null, // 已选项的养护卡id
        current_id: null, // 传入卡片详情模态框的养护卡id
        slide_visible: false, // 控制卡片详情模态框显隐
      }
      return schema
    },
    methods: {
      // 返回
      goBack () {
        this.$router.go(-1)
      },
      // 控制卡片详情模态框显隐
      toggleSidePannel () {
        this.slide_visible = !this.slide_visible
      },
      // 选好了，继续设置壳养护卡
      goEdit (id) {
        this.$router.push({
          name: 'cardManagementAddShell',
          query: {
            id: id,
            need_pid: 2, // 查看pid
          },
        })
      },
      // 跳过选择壳养护卡，新建养护卡操作
      goCreate () {
        this.$router.push({
          name: 'cardManagementAdd',
          query: {
            edit: 1,
            type: 2, // 清空数据
          },
        })
      },
      // 搜索按钮
      applyFilter () {
        this.pagination_data.current_page = 1
        this.choose_id = null
        this.getCardList()
      },
      // 重置
      resetFilter () {
        this.pagination_data.current_page = 1
        this.filter_data.keyword = ''
        this.choose_id = null
        this.choose_classify = null
        this.getCardList()
      },
      // 查看养护卡
      goCardDetail (id) {
        this.current_id = id
        this.toggleSidePannel()
      },
      paging (state) {
        this.pagination_data = state
        this.choose_id = null
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
      // 获取壳牌养护卡列表
      async getCardList () {
        try {
          const { response, result } = await this.upkeepDepotListApi({
            name: this.filter_data.keyword ? this.filter_data.keyword : '',
            category_id: this.choose_classify ? this.choose_classify.id : '',
            page: this.pagination_data.current_page,
            per_page: this.pagination_data.per_page,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data.map(item => {
              item.price = parseInt(item.price) / 100
              return item
            })
            this.pagination_data = result.meta
            this.is_initiated = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch ({ response, result }) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      this.getClassifyList() // 获取养护卡分类列表
      this.getCardList() // 获取养护卡列表
    },
  }
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.page-title
  font-size 18px
  height 60px
  line-height 60px
  padding-left 24px
.simple-td
  &.checkbox-td
    display flex
    height 36px
    align-items center
td,.simple-td
  vertical-align middle
.section-filter-none.is-horizontal
  height 0
  padding 0
.section-filter .add-button
  bottom initial
.section-filter
  display flex
  justify-content space-between
.button
  align-items: center
.add-icon
  display inline-flex
  width 16px
  height:16px
  background url('~@/assets/icons/button-add.svg') no-repeat center center
  background-size cover
  margin-right 6px
.section-layout
  height: calc(100% - 48px)
.list-wrapper
  height: calc(100% - 90px) !important
.batched-operations
  display flex
  align-items center
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
.btn-cover
  color: #121212
  background: #ffbb29
  border: none
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.08)
  padding: 6px 14px
  border-radius 3px
.btn-back
  background: #ffffff
  border: solid 1px #cccccc
</style>
