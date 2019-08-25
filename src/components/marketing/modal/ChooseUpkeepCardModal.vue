<!--优惠券选择关联养护卡-->
<template lang="pug">
  modal-dialog(modal-scale="card")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 指定养护卡
        .close-button(@click="modalClose")
      .modal-body
        .main-left
          .section-filter.is-horizontal
            .field-group.is-horizontal              
              .field.is-narrow
                label.label 养护卡分类
                custom-select(v-model="card_category", :list="card_list", nameField="name")           
              .field.is-keyword
                label.label 请输入养护卡名称
                custom-input(v-model="keywords", placeholder="请输入关键字", @keyupEnter="search")
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
                      label.sepcific-setting(for="nb", v-text="'全选'")
                  td(width="150") 养护卡名称
              tbody
                tr(v-for="item in list")
                  td
                    .simple-td
                      .checkbox
                        input(type="checkbox", :id="item.upkeep_id", :value="item", name="modal", v-model="selected_item", :checked="item.selected")
                        label.sepcific-setting(:for="item.upkeep_id")
                  td
                    .simple-td
                      .content-item(v-text="item.name")
        .main-right
          .right-title 选中内容
          .right-content
            .item-box(v-for="(item, index) in selected_item")
              input(type="checkbox", :id="item.upkeep_id" hidden="true" :value="item", name="modal", v-model="selected_item", :checked="item.selected")
              .item-name(v-text="item.name")
              label.item-delete(:for="item.upkeep_id")
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
  import Api from '@/mixins/modules/marketing'
  import ImageScale from '@/mixins/utilities/imageScale'
  import FilterTools from '@/mixins/utilities/filterTools'
  import Pagination from '@/components/generics/Pagination'

  export default {
    name: 'ChooseGoods',
    components: {
      ModalDialog,
      CustomSelect,
      CustomInput,
      EmptyPage,
      Pagination,
    },
    mixins: [Api, ModalInteractions, ImageScale, FilterTools],
    props: {
      array: {
        type: Array,
        default: () => [],
      },
    },
    watch: {
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
    },
    data () {
      return {
        keywords: '',                               // 关键字
        card_category: {id: 0, name: '全部'},        // 选择的分类,默认全部
        card_list: [
          {id: 0, name: '全部'},
          {id: 1, name: '壳养护卡'},
          {id: 2, name: '养护卡'},
          {id: 3, name: '次卡'},
        ],
        list: [],
        checked_all: false,        // 全选状态
        selected_item: [],        // 选中的
      }
    },
    methods: {
      // 错误信息函数
      errorMessage (message) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: message,
          content: `${message}获取分类发生错误，请稍后再试`,
        })
      },
      // 搜索按钮
      search () {
        this.getInfoList()
      },
      // 重置
      reset () {
        this.keywords = ''
        this.card_category = {category_id: 0, name: '全部'}
        this.getInfoList()
      },
      // 获取养护卡列表的数据
      async getInfoList () {
        try {
          const { response, result } = await this.getUpkeepCardList({
            name: this.keywords,
            upkeep_category: this.card_category.id,
          })
          if (response.status === 200 && result.code === 0) {
            // 列表数据赋值
            this.list.splice(0, this.list.length, ...result.data)
            console.log(this.list)
            this.pagination_data = result.meta
            this.checked_all = false
            let length = 0
            let src = JSON.stringify(this.list)
            this.selected_item.forEach(item => {
              if (src.indexOf(JSON.stringify(item)) !== -1) {
                length += 1
              }
            })
            if (length === this.list.length) this.checked_all = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡列表失败',
              content: '获取商品列表发生错误，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡列表失败',
            content: `服务异常，请稍后再试（${
              err.response ? err.response.status : err
            }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 全选 or 取消
      checkedAllFnc () {
        let self = this
        if (!this.checked_all) {
          // 多选
          self.list.forEach(item => {
            let has = self.selected_item.some(obj => obj.upkeep_id === item.upkeep_id)
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
              return obj.upkeep_id === item.upkeep_id
            })
            if (has) {
              self.selected_item.splice(index, 1)
            }
          })
        }
      },
      // 完成
      complete () {
        this.modalResolve(this.selected_item)
      },
      cancle () {
        this.$emit('callback')
      },
    },
    mounted () {
      this.selected_item = [...this.array]
      this.getInfoList()
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
</style>
