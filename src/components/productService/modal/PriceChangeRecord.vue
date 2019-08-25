<!--养护卡 卡内项目-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 售价变更记录
        .close-button(@click="modalClose")
      .modal-body
        .content-box(v-if="list.length > 0")
          .div-cell.cell-head
            .cell-name 变更时间
            .cell-desc 操作人
            .cell-num 销售价格
          .div-cell.cell-body(v-for="item in list")
            .cell-name.cell {{item.created_at | date('yyyy-MM-dd HH:mm', 'cn')}}
            .cell-desc.cell {{item.operator}}
            .cell-num.cell
              span {{item.after_price / 100}}
        empty-page(v-if="list.length === 0", tip="当前没有变更记录")
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Api from '@/mixins/modules/customer'
  export default {
    name: 'PriceChangeRecord',
    components: {
      ModalDialog,
      EmptyPage,
    },
    mixins: [ModalInteractions, Api],
    props: {
      id: {
        type: [String, Number],
      },
      is_iso: {
        type: [Number, String],
        default: 2,
      },
    },
    data () {
      return {
        list: [],
        type: 1,
        item: [],
      }
    },
    methods: {
      // 获取养护卡详情
      async fetchDetail () {
        let params = {upkeep_info_id: this.id}
        try {
          const { response, result } = await this.fetchCardPriceRecordApi(params)
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡价格变更记录失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡价格变更记录失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      this.fetchDetail()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  td,.multi-content-td
    vertical-align: middle
  .modal-header
    padding 20px 24px
  .modal-body
    position relative
    height 420px
    display flex
    flex-direction column
    overflow-x hidden
    overflow-y scroll
  .border-b
    padding-bottom 20px
    border-bottom 1px solid #72767a
  .h2
    width 100%
    font-size 16px
    font-weight bolder
    margin 10px 10px
    color #353535
    margin-left -10px
  .div-cell
    width 100%
    display flex
    justify-content start
    padding 0 15px
    line-height 40px
    font-size 13px
    .cell
      box-sizing border-box
      padding-right 10px
      min-height 40px
      line-height 20px
    .cell-name
      width 25%
    .cell-desc
      width 45%
    .cell-end
      width 20%
    .cell-num
      width 10%
  .cell-head
    background #f0f1f2
    color #999999
  .cell-body
    box-sizing border-box
    font-size 12px
    padding 8px 15px
  .l-h-20
    line-height 20px
  .content-box
    width 95%
    margin 0 auto
</style>
