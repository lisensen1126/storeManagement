<!--优惠券选择关联商品&服务-->
<template lang="pug">
  modal-dialog(modal-scale="card")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 选择优惠券
        .close-button(@click="modalClose")
      .modal-body
        .main-left
          .section-filter.is-horizontal
            .field-group.is-horizontal
              .field.is-keyword
                label.label 输入关键字
                custom-input(v-model="keywords", placeholder="请输入关键字", @keyupEnter="search")
              .field.is-keyword
                label.label 类型
                custom-select(v-model="type", :list="coupon_type")
              .field.is-keyword
                label.label 使用范围
                custom-select(v-model="scope", :list="use_scope")
              .field
                a.button.primary(@click="search") 搜索
              .field
                a.button(@click="reset") 重置
          .modal-tip 小提示：为了保证车主用券体验，有效期为固定时间段的优惠券无法进行添加！
          empty-page(v-if="!list.length", :tip="'暂无内容'")
          .table-wrapper(v-if="list && list.length")
            table.table
              thead
                tr
                  td(width="30")
                  td(width="150") 优惠券名称
                  td(width="150") 优惠券金额(折扣)
                  td(width="150") 优惠券类型
                  td(width="150") 使用范围
              tbody
                tr(v-for="(item, index) in list")
                  td
                    .simple-td
                      .checkbox
                        input(:class="item.effective_type === 1 ? 'not-click' : ''", type="checkbox", :id="item.coupon_id", :value="item", name="modal", v-model="selected_item", :checked="item.selected", :disabled="item.effective_type === 1")
                        label.sepcific-setting(:for="item.coupon_id")
                  td
                    .simple-td
                      .content-item(v-text="item.coupon_name")
                  td(v-if="item.coupon_type != 4")
                    .simple-td
                      .content-item(v-text="item.discount_amount/100 + '元'")
                  td(v-if="item.coupon_type == 4")
                    .simple-td
                      .content-item(v-text="item.discount_amount/100 + '折'")
                  td
                    .simple-td
                      .content-item(v-text="item.coupon_type_name")
                  td
                    .simple-td
                      .content-item(v-text="item.coupon_use_type_name")
        .main-right
          .right-title 选中内容
          .right-content
            .item-box(v-for="(item, index) in selected_item")
              input(type="checkbox", :id="item.coupon_id" hidden="true" :value="item", name="modal", v-model="selected_item", :checked="item.selected")
              .item-name(v-text="item.coupon_name")
              label.item-delete(:for="item.coupon_id")
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

  export default {
    name: 'ChooseCoupon',
    components: {
      ModalDialog,
      CustomSelect,
      CustomInput,
      EmptyPage,
    },
    mixins: [Api, ModalInteractions],
    props: {
      array: {
        type: Array,
        default: () => [],
      },
      params: {
        type: [String, Number],
        default: 1,
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
        coupon_type: [
          {name: '代金券', type: 1},
          {name: '兑换券', type: 2},
          {name: '满减券', type: 3},
          {name: '折扣券', type: 4},
        ],
        type: null,
        use_scope: [
          {id: 1, name: '小程序商城通用'},
          {id: 2, name: '指定分类'},
          {id: 3, name: '指定商品/服务'},
          {id: 4, name: '指定养护卡'},
        ],
        scope: null,
        keywords: '',               // 关键字
        list: [],
        checked_all: false,         // 全选状态
        selected_item: [],          // 选中的
      }
    },
    methods: {
      // 一级分类改变
      changeFirst () {
        this.second_state = null
      },
      // 搜索按钮
      search () {
        this.getInfoList()
      },
      // 重置
      reset () {
        this.keywords = ''
        this.type = null
        this.scope = null
        this.getInfoList()
      },
      // 获取数据
      async getInfoList () {
        try {
          const { response, result } = await this.fetchCouponAPi({
            type: this.params,
            use_type: this.scope ? this.scope.id : '',
            coupon_type: this.type ? this.type.type : '',
            keyword: this.keywords,
          })
          if (response.status === 200 && result.code === 0) {
            this.list.splice(0, this.list.length, ...result.data)
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
              title: '提示',
              content: '获取优惠券列表发生错误，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: `服务异常，请稍后再试（${
              err.response ? err.response.status : err
            }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },

      // 全选操作
      checkedAllFnc () {
        let self = this
        if (!this.checked_all) {
          self.list.forEach(item => {
            let has = self.selected_item.some(obj => obj.coupon_id === item.coupon_id)
            if (!has) {
              self.selected_item.push(item)
            }
          })
        } else {
          self.list.forEach(item => {
            let index = 0
            let has = self.selected_item.some((obj, i) => {
              index = i
              return obj.coupon_id === item.coupon_id
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
  .modal-tip
    background #e8e9eb
    color red
    font-size 12px
    padding-left 30px
    padding-bottom 19px
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
      height 450px
      display flex
      flex-direction column
    .main-right
      width 350px
      padding 0 15px
      .right-title
        font-size 14px
        line-height 40px
        border-bottom 1px solid #f0f1f2
      .right-content
        height 410px
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
      .not-click
        cursor not-allowed
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
