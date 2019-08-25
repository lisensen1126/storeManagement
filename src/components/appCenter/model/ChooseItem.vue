<!--优惠券选择关联商品&服务-->
<template lang="pug">
  modal-dialog(modal-scale="card")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 选择项目
          span.tip 从门店当前已上架的服务/商品/养护卡列表中选择项目作为开单收款项目。
        .close-button(@click="modalClose")
      .modal-body
        .main-left
          .section-filter.is-horizontal
            .field-group.is-horizontal
              .choose-card(:class="{'selected-card':choose_type===1}", @click="chooseType(1)") 商品
              .choose-card(:class="{'selected-card':choose_type===2}", @click="chooseType(2)") 服务
              .choose-card(:class="{'selected-card':choose_type===3}", @click="chooseType(3)") 养护卡
            .field-group.is-horizontal
              .field.is-keyword
                label.label 关键字搜索
                custom-input(v-model="keywords", placeholder="请输入关键字", @keyupEnter="search")
              .field.is-narrow(v-if="choose_type!==3")
                label.label 一级分类
                custom-select(v-model="first_state", :list="first_list", nameField="category_name", @input="changeFirst")
              .field.is-narrow(v-if="choose_type!==3")
                label.label 二级分类
                custom-select(v-model="second_state", :list="second_list", nameField="category_name")
              .field.is-narrow(v-if="choose_type===3")
                label.label 养护卡分类
                custom-select(v-model="card_cate", :list="card_cate_list", nameField="name")
              .field
                a.button.primary(@click="search") 搜索
              .field
                a.button(@click="reset") 重置

          empty-page(v-if="!list.length", :tip="'暂无内容'")
          
          .table-wrapper(v-if="list && list.length")
            table.table
              thead
                tr
                  td(width="30")
                    .checkbox
                      input(type="checkbox", id="nb", v-model="checked_all", @click="checkedAllFnc")
                      label.sepcific-setting(for="nb")
                  td(width="150", v-if="choose_type === 1") 商品名称
                  td(width="150", v-if="choose_type !== 1") 服务名称
                  td(width="150", v-if="choose_type === 1") 商品分类
                  td(width="150", v-if="choose_type !== 1") 服务分类
                  td(width="150", v-if="choose_type === 1") 
                    span 商品价格
                    el-popover.tips-text(placement="top-start", popper-class="mypop", width="200", trigger="hover", :content="'商品价格默认展示该商品其中一个SKU的价格。'")
                      .el-icon-question(slot="reference")
                  td(width="150", v-if="choose_type !== 1") 服务价格
              tbody
                tr(v-for="item in list")
                  td
                    .simple-td
                      .checkbox
                        input(type="checkbox", :id="item.product_id", :value="item", name="modal", v-model="selected_item", :checked="item.selected")
                        label.sepcific-setting(:for="item.product_id")
                  td
                    .simple-td
                      .content-item.flex
                        img(:src="item.pic")
                        span {{item.name}}
                  td
                    .simple-td
                      .content-item(v-text="item.category_name")
                  td
                    .simple-td
                      .content-item() ￥{{item.price/100}}
          .foot-wrapper(v-show='choose_type!==3')
            .tfoot
              pagination(:pagination-data="paginationData", @input="paging")                  
        .main-right
          .right-title 选中内容
          .right-content
            .item-box(v-for="(item, index) in selected_item")
              input(type="checkbox", :id="item.product_id" hidden="true" :value="item", name="modal", v-model="selected_item", :checked="item.selected")
              img.select-pic(:src="item.pic")
              .item-name(v-text="item.name")
              label.item-delete(:for="item.product_id")
      .modal-footer.level
        .level-left
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(@click="complete") 确定
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import CustomInput from '@/components/generics/form/CustomInput'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Api from '@/mixins/modules/OpenBillItem'
  import ImageScale from '@/mixins/utilities/imageScale'
  import FilterTools from '@/mixins/utilities/filterTools'
  import Pagination from '@/components/generics/Pagination'

  export default {
    name: 'ChooseItem',
    components: {
      ModalDialog,
      CustomSelect,
      CustomInput,
      EmptyPage,
      Pagination,
    },
    mixins: [Api, ModalInteractions, ImageScale, FilterTools],
    props: ['index'],

    data () {
      return {
        keywords: '',             // 关键字
        first_state: {},        // 一级分类
        first_list: [{}],
        second_state: {},       // 二级分类
        second_list: [{}],
        list: [],
        checked_all: false,        // 全选状态
        selected_item: [],        // 选中的
        choose_type: 0,
        card_cate_list: [{      // 养护卡分类
          name: ' 壳保养卡',
          id: 1,
        }, {
          name: '保养卡',
          id: 2,
        }, {
          name: '次卡',
          id: '3',
        }],
        card_cate: {},
        paginationData: {
          current_page: 1,
          per_page: 1,
          last_page: 1,
          total: 1,
        },
        query: {},
      }
    },
    watch: {
      // 当selected_item改变时，检查是否处于check_all
      selected_item () {
        this.checked_all = false
        let length = 0
        let src = JSON.stringify(this.list)
        this.selected_item.forEach(item => {
          if (src.indexOf(JSON.stringify(item)) !== -1) {
            length += 1
          }
        })
        if (length === this.list.length) this.checked_all = true
      },
      // 当list改变时，检查是否处于check_all
      list () {
        this.checked_all = true
        let src = JSON.stringify(this.selected_item)
        for (let item of this.list) {
          if (src.indexOf(JSON.stringify(item)) === -1) {
            this.checked_all = false
            break
          }
        }
      },
    },
    methods: {
      formatQuery () {
        let data = {}
        let query = {}
        if (this.choose_type !== 3) {
          data = {
            quick_bill_category_id: this.index,     // 快速开单项目分类
            name: this.keywords,
            type: this.choose_type,                 // 商品/服务/养护卡分类
            category_one: this.first_state.category_id, // 一级分类
            category_two: this.second_state.category_id, // 二级分类
          }
          query = {}
          Object.keys(data).forEach(item => {
            if (data[item]) {
              query[item] = data[item]
            }
          })
        } else {
          data = {
            quick_bill_category_id: this.index,
            name: this.keywords,
            upkeep_category: this.card_cate.id,
          }
          query = {}
          Object.keys(data).forEach(item => {
            if (data[item]) {
              query[item] = data[item]
            }
          })
        }
  
        this.query = query
      },
      search () {
        this.paginationData.current_page = 1
        this.formatQuery()
        this.fetchGoodsList()
      },
      // 获取商品数据，商品服务 与 养护卡 ，调用不同的接口，用choose_type判断
      async fetchGoodsList () {
        this.query.page = this.paginationData.current_page
        // choose_type==1 || 2 商品和服务
        if (this.choose_type !== 3) {
          try {
            this.query.hide_loading = false
            let {result, response} = await this.getGoodsServeListApi(this.query)
            if (response.status === 200 && result.code === 0) {
              this.list = result.data
              this.paginationData = result.meta
            } else {
              this.errorMessage('获取商品列表失败')
            }
          } catch (err) {
            this.errorMessage('获取商品列表失败')
          }
        } else {
      // choose_type = 3为养护卡
          try {
            let {result, response} = await this.getCardListApi(this.query)
            if (response.status === 200 && result.code === 0) {
              this.list = result.data.map(item => {
                item.pic = item.image_url
                item.product_id = item.id
                item.type = 3
                return item
              })
            } else {
              this.errorMessage('获取养护卡列表失败')
            }
          } catch (err) {
            console.log(err)
            this.errorMessage('获取养护卡列表失败')
          }
        }
      },
      // 改变choose_type
      async chooseType (type) {
        if (this.choose_type !== type) {
          this.choose_type = type
          // 清空筛选数据
          this.clearFilter()
          this.paginationData.current_page = 1
          this.formatQuery()
          // 获取分类数据
          await this.fetchClassify(0, 'first')
          // 获取列表数据
          await this.fetchGoodsList()
        }
      },
      paging (state) {
        this.paginationData = state
        this.fetchGoodsList()
      },
      // 清空筛选的数据
      clearFilter () {
        this.keywords = ''
        this.first_list = []
        this.first_state = {}
        this.second_list = []
        this.second_state = {}
      },
      /**
       * 获取分类数据
       * @params {Number, String}  id 父级id
       * @params  {String}  hierarchy 分类层级标识
       */
      async fetchClassify (id, hierarchy) {
        if (this.choose_type === 3) {
          return
        }
        try {
          const { response, result } = await this.getGoodServeCateListApi({
            type: this.choose_type,
            parent_id: id,
          })
          if (response.status === 200 && result.code === 0) {
            // 根据返回的分类级别组装数据
            hierarchy === 'first' ? this.first_list = result.data : this.second_list = result.data
          } else {
            this.errorMessage('获取分类发生错误')
          }
        } catch ({ response, result }) {
          this.errorMessage('获取分类发生错误')
        }
      },
      // 创建快速开单项目
      async createQuickBill () {
        try {
          let itemArr = this.selected_item.map(item => {
            // 如果有product_id，则是商品或者服务，否则为养护卡
            return {
              obj_id: item.product_id ? item.product_id : item.id,
              obj_type: item.type,
            }
          })
          const { response, result } = await this.createQuickBillApi({
            quick_bill_category_id: this.index,
            data_items: itemArr,
          })
          if (response.status === 200 && result.code === 0) {
            // 根据返回的分类级别组装数据
  
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '创建项目发生错误',
              content: result.message,
            })
          }
        } catch (e) {
          this.errorMessage('创建项目发生错误')
        }
      },
      // 错误信息函数
      errorMessage (message) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: message,
          content: `${message}，请稍后再试`,
        })
      },
      // 一级分类改变
      changeFirst () {
        this.second_list = []
        this.second_state = {}
        this.fetchClassify(this.first_state.category_id, 'second')
      },

      // 重置
      reset () {
        this.keywords = ''
        this.first_state = {}
        this.second_list = []
        this.second_state = {}
        this.card_cate = {}
        this.paginationData.current_page = 1
        this.formatQuery()
        this.fetchGoodsList()
      },
      // 全选 or 取消
      checkedAllFnc () {
        let self = this
        if (!this.checked_all) {
          // 多选
          self.list.forEach(item => {
            let has = self.selected_item.some(obj => obj.product_id === item.product_id)
            if (!has) {
              self.selected_item.push(item)
            }
          })
        } else {
          // 取消
          self.list.forEach(item => {
            let index = 0
            let has = self.selected_item.some((obj, i) => {
              index = i
              return obj.product_id === item.product_id
            })
            if (has) {
              self.selected_item.splice(index, 1)
            }
          })
        }
      },
      // 完成
      async complete () {
        if (this.selected_item.length === 0) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '温馨提示',
            content: '请至少选择一个项目',
          })
          return
        }
        // 1、请求添加快速开单的接口
        // 2、让父级刷新页面
        await this.createQuickBill()
        this.modalResolve(this.selected_item)
      },
      cancle () {
        this.$emit('callback')
      },
    },
    mounted () {
      this.chooseType(1)
      //  this.fetchClassify(0, 'first')
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-header
    padding 20px 24px
  .modal-card
    width 1150px !important
  .modal-card-title
    overflow hidden
    .tip
      font-size 12px
      margin-left 20px
    .shop
      float left
      margin-right 20px
      color #353535
    .active
      border-bottom 2px solid #ffbb29
  .modal-footer
    padding 12px 16px
  .modal-body
    display flex
    justify-content space-between
    .main-left
      position relative
      width 800px
      height 520px
      display flex
      flex-direction column
      padding-bottom 36px
    .main-right
      width 350px
      padding 0 15px
      .right-title
        font-size 14px
        line-height 40px
        border-bottom 1px solid #f0f1f2
      .right-content
        height 479px
        overflow-y auto
        .item-box
          display flex
          justify-content space-between
          align-items center
          height 40px
          padding 0 5px
          border-bottom 1px solid #f0f1f2
          // background #f0f1f2
          margin-bottom 5px
          font-size 12px
          .item-name
            width 300px
          .item-delete
            width 20px
            height 20px
            background center no-repeat url('~@/assets/modal/close.svg')
            cursor pointer
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
    height 16px
    label
      width 16px
      height 16px
      padding-left 14px
    input[type="radio"]
      width 16px
      height 16px
.choose-card
  background #fff
  line-height 38px
  font-size 14px
  text-align center
  margin-bottom 15px
  width 100px
  border-bottom 2px solid #fff
  cursor pointer
  color #999
.selected-card
  border-bottom 2px solid #ffc723
  color #121212
.section-filter 
  height auto
.flex
  display flex  
  align-items center
  img
    width 30px
    height 30px
    margin-right 10px
  span
    width 285px
    overflow hidden
    text-overflow ellipsis
.select-pic
  width 30px
  height 30px
  margin-right 10px
.mypop
  z-index 9999 !important
  position absolute
  right 0
</style>
