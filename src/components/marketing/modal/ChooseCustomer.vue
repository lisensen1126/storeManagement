<template lang="pug">
  modal-dialog(modal-scale="card")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 选择客户
        .close-button(@click="modalClose")
      .modal-body
        .main-left
          .section-filter.is-horizontal
            .field-group.is-horizontal
              .field.is-keyword
                label.label 输入关键字
                custom-input(v-model="keywords", placeholder="请输入手机号码", need-type='number', @keyupEnter="search")
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
                  td(width="80") 微信昵称
                  td(width="120") 手机号码
                  td(width="250") 小程序累计下单数
                    span(@click="orderSort")
                  td(width="250") 小程序累计消费金额
                    span(@click="consumeSort")
                  td(width="250") 小程序注册天数
                    span(@click="registerSort")
              tbody
                tr(v-for="item in list")
                  td
                    .simple-td
                      .checkbox
                        input(type="checkbox", :id="item.customer_id", :value="item", name="modal", v-model="selected_item", :checked="item.selected")
                        label.sepcific-setting(:for="item.customer_id")
                  td
                    .simple-td
                      .content-item(v-text="item.nick_name == '' ? '--' : item.nick_name")
                  td
                    .simple-td
                      .content-item(v-text="item.mobile")
                  td
                    .simple-td
                      .content-item(v-text="item.count_amount")
                  td
                    .simple-td
                      .content-item(v-text="item.total_amount")
                  td
                    .simple-td
                      .content-item(v-text="item.register_days")

        .main-right
          .right-title 选中客户 （已选{{selected_item.length}}）
          .right-content
            .item-box(v-for="(item, index) in selected_item")
              input(type="checkbox", :id="item.customer_id" hidden="true" :value="item", name="modal", v-model="selected_item", :checked="item.selected")
              .item-name(v-text="(item.nick_name == '' ? '--' : item.nick_name) + '  (' + item.mobile + ')'")
              label.item-delete(:for="item.customer_id")

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

  export default {
    name: 'ChooseCoupon',
    components: {
      ModalDialog,
      CustomSelect,
      CustomInput,
      EmptyPage,
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
        keywords: '',               // 关键字
        list: [],
        checked_all: false,         // 全选状态
        selected_item: [],          // 选中的
        order_type: false,
        consume_type: false,
        register_type: false,
        nb_list: [],
      }
    },
    methods: {
      // 搜索按钮
      search () {
        let self = this
        this.list = this.nb_list.filter(v => {
          return v.mobile.indexOf(self.keywords) !== -1
        })
      },

      // 重置
      reset () {
        this.keywords = ''
        this.getInfoList()
      },

      // 获取数据
      async getInfoList () {
        try {
          const { response, result } = await this.fetchCustomerApi()
          if (response.status === 200 && result.code === 0) {
            this.list.splice(0, this.list.length, ...result.data)
            this.list.forEach(item => {
              item.total_amount = (item.total_amount / 100).toFixed(2)
            })
            this.checked_all = false
            let length = 0
            let src = JSON.stringify(this.list)
            this.selected_item.forEach(item => {
              if (src.indexOf(JSON.stringify(item)) !== -1) {
                length += 1
              }
            })
            if (length === this.list.length) this.checked_all = true
            this.nb_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '提示',
              content: '获取用户列表发生错误，请稍后再试',
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

      // 小程序下单排序
      orderSort () {
        this.order_type
          ? this.list = this.list.sort((n, m) => { return n.count_amount - m.count_amount })
          : this.list = this.list.sort((n, m) => { return m.count_amount - n.count_amount })
        this.order_type = !this.order_type
      },

      // 消费排序
      consumeSort () {
        this.consume_type
          ? this.list = this.list.sort((n, m) => { return n.total_amount - m.total_amount })
          : this.list = this.list.sort((n, m) => { return m.total_amount - n.total_amount })
        this.consume_type = !this.consume_type
      },

      // 注册天数排序
      registerSort () {
        this.register_type
          ? this.list = this.list.sort((n, m) => { return n.register_days - m.register_days })
          : this.list = this.list.sort((n, m) => { return m.register_days - n.register_days })
        this.register_type = !this.register_type
      },

      // 全选操作
      checkedAllFnc () {
        let self = this
        if (!this.checked_all) {
          self.list.forEach(item => {
            let has = self.selected_item.some(obj => obj.customer_id === item.customer_id)
            if (!has) {
              self.selected_item.push(item)
            }
          })
        } else {
          self.list.forEach(item => {
            let index = 0
            let has = self.selected_item.some((obj, i) => {
              index = i
              return obj.customer_id === item.customer_id
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
      // this.selected_item = [...this.array]
      this.selected_item = []
      this.getInfoList()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .simple-td
    max-width 110px !important
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  td
    span
      display inline-block
      cursor pointer
      width 20px
      height 12px
      background url('~@/assets/order-default.png') no-repeat center
    span:hover
      background url('~@/assets/order-active.png') no-repeat center
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
