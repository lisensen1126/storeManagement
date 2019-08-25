<!--养护卡 使用记录-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 分享记录
        .close-button(@click="modalClose")
      .modal-body
        .table-wrapper(v-if="list.length !== 0")
          table.table
            thead
              tr
                td(width="120") 分享日期
                td(width="120") 分享项目数
                td(width="120") 分享状态
            tbody
              tr(v-for="item in list")
                td
                  .multi-content-td(v-if="item.created_at") {{item.created_at | date('yyyy-MM-dd', 'cn')}}
                td
                  .multi-content-td(v-if="item.item_num") {{item.item_num}}
                td
                  .simple-td(v-if="item.is_received === 1") 已领取
                  .simple-td(v-if="item.is_received === 2") 未领取
                  .simple-td(v-if="item.is_received === 3") 已退还
        empty-page(v-if="list.length === 0", tip="当前没有分享记录")
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Api from '@/mixins/modules/customer'
  import FormateDate from '@/mixins/utilities/formateDate'
  export default {
    name: 'CardShareRecordModal',
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
      // 获取养护卡详情
      async fetchCardUserList () {
        try {
          const { response, result } = await this.fetchCardShareApi({
            id: this.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡分享记录失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡分享记录失败',
            content: err,
          })
        }
      },
    },
    mounted () {
      this.fetchCardUserList()
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
