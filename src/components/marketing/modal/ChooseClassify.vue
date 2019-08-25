<!--优惠券选择关联商品&服务-->
<template lang="pug">
  modal-dialog(modal-scale="card")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 商品分类/服务分类
        .close-button(@click="modalClose")
      .modal-body
        .main-left
          el-tree(
            :data="list"
            show-checkbox
            ref="tree"
            node-key="category_id"
            :props="default_props"
            default-expand-all
            @check="getCheckedKeys"
          )
        .main-right
          .right-title 选中内容
          .right-content
            .item-box(v-for="(item, index) in selected_item") {{item.category_name}}
      .modal-footer.level
        .level-left
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(@click="complete") 确定
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Api from '@/mixins/modules/marketing'

  export default {
    name: 'ChooseGoods',
    components: {
      ModalDialog,
    },
    mixins: [Api, ModalInteractions],
    props: {
      array: {
        type: Array,
        default: () => [],
      },
    },
    data () {
      return {
        list: [
          {
            category_id: 'product',
            category_name: '商品分类',
            list: [],
          },
          {
            category_id: 'service',
            category_name: '服务分类',
            list: [],
          },
        ],
        default_props: {
          children: 'list',
          label: 'category_name',
        },
        classify_list: [],
        selected_item: [],
        temp_arr: [],
      }
    },
    methods: {
      async fetchClassify () {
        try {
          const { response, result } = await this.categoryList()
          if (response.status === 200 && result.code === 0) {
            this.list[0].list = result.data.product
            this.list[1].list = result.data.service
            let self = this
            setTimeout(() => {
              self.$refs.tree.setCheckedKeys(self.classify_list)
            }, 500)
            this.classify_list = this.array
            this.temp_arr = [...result.data.product, ...result.data.service]
            if (this.array.length === 0) return
            this.filterData()
          } else {
            this.errorMessage('获取分类发生错误')
          }
        } catch ({ response, result }) {
          this.errorMessage('获取分类发生错误')
        }
      },
      // 错误信息函数
      errorMessage (message) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: message,
          content: `${message}获取分类发生错误，请稍后再试`,
        })
      },
      // 数据筛选过滤
      filterData () {
        let self = this
        let arr = []
        self.temp_arr.forEach(v => {
          v.list.forEach(m => {
            if (self.classify_list.indexOf(m.category_id) > -1) {
              arr.push(m)
            }
          })
        })
        self.selected_item = arr
      },
      // getCheckedKeys
      getCheckedKeys (e) {
        this.classify_list = this.$refs.tree.getCheckedKeys()
        console.log('***')
        console.log(this.classify_list)
        this.filterData()
      },
      // 完成
      complete () {
        this.modalResolve(this.classify_list)
      },
      cancle () {
        this.$emit('callback')
      },
    },
    mounted () {
      this.fetchClassify()
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
      padding-top 10px
      overflow-y scroll
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
