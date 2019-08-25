<!--养护卡 卡内项目-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 项目
        .close-button(@click="modalClose")
      .modal-body
        .content-box(v-if="list.length > 0")
          .h2 卡内项目
          .div-cell.cell-head
            .cell-name 项目名称
            .cell-desc 项目描述
            .cell-num 次数
            .cell-end(v-if="type === 1") 是否为最终项目
          .div-cell.cell-body(v-for="item in list")
            .cell-name.cell {{item.name}}
            .cell-desc.cell {{item.description}}
            .cell-num.cell
              span(v-if="item.num == 0") 无限次
              span(v-if="item.num != 0") {{item.num}}次
            .cell-end.cell(v-if="type === 1")
              span(v-if="item.is_end && item.is_end == 1") 是
              span(v-if="item.is_end && item.is_end == 2") 否
        .content-box(v-if="item.length > 0 && type === 1")
          .h2 免激活项目
          .div-cell.cell-head
            .cell-name 项目名称
            .cell-desc 项目描述
            .cell-num 有效期
            .cell-end 次数
          .div-cell.cell-body(v-for="cell in item")
            .cell-name.cell {{cell.name}}
            .cell-desc.cell {{cell.description}}
            .cell-num.cell {{cell.expiry}} 月
            .cell-end.cell
              span(v-if="cell.num == 0") 无限次
              span(v-if="cell.num != 0") {{cell.num}}次
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Api from '@/mixins/modules/customer'
  export default {
    name: 'CardProjectModal',
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
        let params = {id: this.id}
        try {
          const { response, result } = this.is_iso - 0 === 1 ? await this.fetchCardDetailApi(params) : this.is_iso - 0 === 2 ? await this.fetchCardDetailTwoApi(params) : await this.fetchCardCountDetailApi(params)
          if (response.status === 200 && result.code === 0) {
            this.type = result.data.info.type
            if (this.type === 1) {
              let arr = []
              let brr = []
              result.data.item.forEach(cell => {
                if (cell.type === 1) {
                  arr.push(cell)
                } else {
                  brr.push(cell)
                }
              })
              this.list = arr
              this.item = brr
            } else {
              this.list = result.data.item
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡卡内项目失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡卡内项目失败',
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
