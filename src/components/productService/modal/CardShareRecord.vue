<!--养护卡 关联商品-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 购买记录
        .close-button(@click="modalClose")
      .modal-body
        empty-page(v-if="list.length === 0", :tip="'暂无记录'")
        .table-wrapper(v-if="list.length !== 0")
          table.table
            tbody
              tr(v-for="item in list")
                td
                  .simple-td(v-text="formateDate(item.operation_at, true, 2)")
                td
                  //- 1:购买，2:赠送，3:收回(自领)，4:领取(被赠送人)
                  .simple-td(v-if="item.type == 1") 直接购买
                  .simple-td(v-if="item.type == 2") 养护卡赠送
                  .simple-td(v-if="item.type == 3") 卡退回自用
                  .simple-td(v-if="item.type == 4") 养护卡领取
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Api from '@/mixins/modules/productService'
  import FormateDate from '@/mixins/utilities/formateDate'
  export default {
    name: 'CardGoodsModal',
    components: {
      ModalDialog,
      EmptyPage,
    },
    mixins: [ModalInteractions, Api, FormateDate],
    props: {
      id: {
        type: [String, Number],
      },
    },
    data () {
      return {
        list: [],
      }
    },
    methods: {
      // 拼团养护卡详情
      async fetchList () {
        try {
          const { response, result } = await this.getUpkeepHistoryApi({
            upkeep_customer_id: this.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡来源失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '获取养护卡来源失败getUpkeepHistoryApi')
        }
      },
    },
    mounted () {
      console.log(this.id, '养护卡id')
      this.fetchList()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .img
    width 32px
    height 32px
  td,.multi-content-td
    vertical-align: middle
  .modal-header
    padding 20px 24px
  .modal-body
    position relative
    height 420px
    display flex
    flex-direction column
  .table-wrapper
    padding 8px 16px
    flex-grow 1
    background standBackground
    .item-content
      max-width 343px
      margin-right 16px
      font-size 13px
      line-height 16px
      flex-grow 1
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
  .simple-td
    height 32px
    line-height 32px
    display flex
    align-items center
</style>