<!--养护卡 关联商品-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 关联商品
        .close-button(@click="modalClose")
      .modal-body
        .table-wrapper(v-if="list.length !== 0")
          table.table
            thead
              tr
                td(width="40") 图片
                td(width="150") 名称
                td(width="50") 类型
                td(width="50") 分类
            tbody
              tr(v-for="item in list")
                td
                  .simple-td(v-if="item.image_url")
                    img.img(:src="item.image_url")
                td
                  .multi-content-td(v-if="item.name") {{item.name}}
                td
                  .simple-td(v-if="item.type && item.type == 1") 商品
                  .simple-td(v-if="item.type && item.type == 2") 服务
                td
                  .simple-td(v-if="item.category_name_one") {{item.category_name_one}}/{{item.category_name_two}}
        empty-page(v-if="list.length === 0", tip="当前没有商品")
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Api from '@/mixins/modules/Group'
  export default {
    name: 'CardGoodsModal',
    components: {
      ModalDialog,
      EmptyPage,
    },
    mixins: [ModalInteractions, Api],
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
          const { response, result } = await this.getCardIsoDetailApi({
            id: this.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data.condition
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡关联商品失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡关联商品失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
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
