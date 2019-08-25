<template lang="pug">
  .section-layout
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
          a.button.primary(@click="createCard")
            span.add-icon
            span 选择壳养护卡
        .field
          label.label &nbsp;
          a.button.primary(@click="createStoreBoss")
            span.add-icon
            span 添加养护卡
        .field
          label.label &nbsp;
          a.button.primary(@click="selfBuild")
            span.add-icon
            span 添加次卡
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前没有养护卡'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="80") 名称
              td(width="50") 卡面
              td(width="100") 分类
              td(width="50") 来源
              td(width="50") 项目数量
              td(width="50") 使用次数
              td(width="70") 关联商品数
              td(width="70") 有效期（月）
              td(width="80") 价格
              td(width="50") 状态
              td(width="70") {{search_button ? '排序(不可用)' : '排序'}}
              td(width="100") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.name}}
              td
                .multi-content-td.has-image
                  a.left-image(@click="showCardFace(item.image_url)")
                    img(:src="item.image_url")
              td
                .simple-td {{item.category_name}}
              td
                .simple-td {{item.from == 1 ? (item.type === 1 ? '养护卡' : '次卡') :'壳养护卡'}}
              td
                .simple-td {{item.item_count}}
              td
                .simple-td(v-if="item.type === 1") {{item.num}}
                .simple-td(v-if="item.type === 2") --
              td
                .simple-td(v-if="item.type === 1") {{item.product_count}}
                .simple-td(v-if="item.type === 2") --
              td
                .simple-td {{item.expiry == 0 ? '无限制': item.expiry}}
              td
                .simple-td ￥{{item.price}}
              td
                .simple-td
                  .status-dot(:class="{ 'green': item.status == '1', 'grey': item.status == '2'}")
                  span(v-if="item.status == '1'") 上架中
                  span(v-if="item.status == '2'") 已下架
              td.tr-p
                .up(:class="search_button ? 'active' : ''", v-if="index !== 0 && !search_button", @click="sortItem(index, 'up')")
                .down(:class="search_button ? 'active' : ''", v-if="index !== list.length-1 && !search_button", @click="sortItem(index, 'down')" )
              td
                .operation-td
                  span.operation-link(@click="goCardDetail(item.id, item.type)") 查看
                  span.operation-link(v-if="item.status == 2",@click="shelfCard(item.id,1)") 上架
                  span.operation-link(v-if="item.status == 1",@click="shelfCard(item.id,2)") 下架
                  span.operation-link(v-if="item.status == 2",@click="editCard(item)") 编辑
                  span.operation-link(v-if="item.status == 2",@click="deleteCard(item)") 删除
      //- .tfoot
        pagination(:pagination-data="pagination_data", @input="paging")
    card-face(:url="image_url", v-if="show_card_face", @callback="modalHide")
</template>

<script>
  import Pagination from '@/components/generics/Pagination'
  import filterTools from '@/mixins/utilities/filterTools'
  import imageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import productServiceMixin from '@/mixins/modules/productService'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import CardFace from '@/components/productService/modal/CardFace'

  export default {
    name: 'cardManagementList',
    mixins: [filterTools, productServiceMixin, imageScale],
    components: {
      EmptyPage,
      Pagination,
      CustomInput,
      CustomSelect,
      CardFace,
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
          per_page: 10000000,
          last_page: 1,
          total: 0,
        },
        list: [],
        is_initiated: false,
        show_card_face: false,    // 是否展示卡面弹框
        image_url: null,    // 查看卡面弹框需要的参数
        search_button: false,   // 判断排序按钮是否可用
      }
      return schema
    },
    methods: {
      createStoreBoss () {
        this.$router.push({
          name: 'cardManagementAdd',
          query: {
            edit: 0,
          },
        })
      },
      // 自建养护卡操作
      selfBuild () {
        this.$router.push({
          name: 'cardSelfBuild',
          query: {
            edit: 0,
          },
        })
      },
      // 搜索按钮
      applyFilter () {
        this.pagination_data.current_page = 1
        this.search_button = true
        this.getCardList()
      },
      // 重置
      resetFilter () {
        this.pagination_data.current_page = 1
        this.filter_data.keyword = ''
        this.choose_classify = null
        this.search_button = false
        this.getCardList()
      },
      // 新建养护卡，跳到选择壳养护卡页面
      createCard () {
        this.$router.push({
          name: 'chooseShellCard',
          query: {
            edit: 1,
          },
        })
      },
      /**
       * 编辑养护卡操作
       * item 选中的item
       * */
      editCard (item) {
        // 1：门店后台，2：BOSS后台
        if (item.from === 1) {
          if (item.type === 1) {
            this.$router.push({
              name: 'cardManagementAdd',
              query: {
                edit: 2,
                id: item.id,
              },
            })
          } else {
            this.$router.push({
              name: 'cardSelfBuild',
              query: {
                edit: 2,
                id: item.id,
              },
            })
          }
        } else {
          this.$router.push({
            name: 'cardManagementAddShell',
            query: {
              edit: 2,
              id: item.id,
            },
          })
        }
      },
      // 查看养护卡操作
      goCardDetail (id, type) {
        this.$router.push({
          name: 'cardManagementDetail',
          query: {
            id: id,
            type: type - 1,
          },
        })
      },
      /*
      * 查看养护卡卡面
      * url 养护卡的卡面
      * */
      showCardFace (url) {
        this.image_url = url
        this.show_card_face = true
      },
      // 关闭查看卡面
      modalHide () {
        this.show_card_face = false
      },
      // 删除养护卡操作
      deleteCard (item) {
        // 判断是否有交易
        // if (item.is_sale === 1) {
        //   this.$store.dispatch('showMessage', {
        //     title: '提示',
        //     content: '养护卡已经产生交易，不能进行此操作',
        //     isRejectable: 1,
        //     resolve: () => {
        //       console.log('确定')
        //     },
        //   })
        //   return false
        // }

        this.$store.dispatch('showMessage', {
          title: '提示',
          content: '确认删除该养护卡？',
          isRejectable: 1,
          resolve: () => {
            this.deleteApi(item.id)
          },
        })
      },
      /**
       * 删除接口
       * @id {int} 删除的id
       */
      async deleteApi (id) {
        let _this = this
        try {
          const { response, result } = await this.upkeepDeleteApi({
            id: id,
          })
          if (response.status === 200) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '删除成功',
              resolve: () => {
                _this.getCardList()
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
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
      // 上下架养护卡操作
      shelfCard (id, type) {
        this.$store.dispatch('showMessage', {
          title: '提示',
          content: '确认上下架养护卡？',
          isRejectable: 1,
          resolve: () => {
            this.shelfApi(id, type)
          },
        })
      },
      /**
       * 上下架接口
       * @id {int} 上下架的id
       */
      async shelfApi (id, type) {
        let _this = this
        let txt = (type === 1 ? '上' : '下')
        try {
          const { response, result } = await this.upkeepStatusApi({
            id: id,
            status: type,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: txt + '架成功',
                resolve: () => {
                  _this.getCardList()
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: txt + '架失败',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: txt + '架失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: txt + '架失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      paging (state) {
        this.pagination_data = state
        this.getCardList()
      },
      /**
       * 排序
       * @index {int} 序列号
       * @type {string} up or down
       */
      sortItem (index, type) {
        if (this.search_button) {
          return
        }
        // 向上移动
        if (type === 'up') {
          this.saveList(this.list[index].id, this.list[index - 1].id)
        }
        // // 向下移动
        if (type === 'down') {
          this.saveList(this.list[index].id, this.list[index + 1].id)
        }
      },
      // 排序保存
      async saveList (first, second) {
        // console.log(111)
        let params = {
          first_id: first,
          second_id: second,
        }
        try {
          const {response, result} = await this.updateSortTotalApi(params)
          if (response.status === 200 && result.code === 0) {
            this.getCardList()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '养护卡排序失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.log(err, '保养卡排序')
        }
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
            name: this.filter_data.keyword ? this.filter_data.keyword : '',
            category_id: this.choose_classify ? this.choose_classify.id : '',
            page: this.pagination_data.current_page,
            per_page: this.pagination_data.per_page,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data.map(item => {
              item.price = item.price / 100
              return item
            })
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
    },
    mounted () {
      this.getClassifyList() // 获取养护卡分类列表
      this.getCardList() // 获取养护卡列表
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  td,.simple-td {
    vertical-align middle
  }
  .section-filter-none.is-horizontal {
    height: 0;
    padding: 0;
  }

  .section-filter .add-button {
    bottom: initial;
  }

  .section-filter {
    display: flex;
    justify-content: space-between;
  }

  .button {
    align-items: center;
  }

  .add-icon {
    display: inline-flex;
    width: 16px;
    height: 16px;
    background: url('~@/assets/icons/button-add.svg') no-repeat center center;
    background-size: cover;
    margin-right: 6px;
  }

  .section-layout {
    height: calc(100% - 48px);
  }

  .list-wrapper {
    height: calc(100% - 92px) !important;
    padding-bottom: 20px !important;
  }
  .tr-p
    position relative
    .up
    .down
      position absolute
      top 16px
      width 20px
      height 30px
      opacity .5
      cursor pointer
      &.is-disable
        opacity .2
        pointer-events none
      &:hover
        opacity 1
      &.active:hover
        opacity .5
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
