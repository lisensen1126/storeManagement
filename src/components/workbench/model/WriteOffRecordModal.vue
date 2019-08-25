<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 核销详情
        .close-button(@click="modalClose")
      empty-page(v-if="!writeOffData.length", tip="当前没有核销详情数据", style="margin: 24px 0")
      .modal-body(v-if="writeOffData.length")
        .table-wrapper
          table.table
            thead
              tr
                td.good-info 商品服务信息
                td 核销数量
                td 本次核销后剩余
            tbody
              tr(v-for="(item, index) in writeOffData")
                td
                  .service-item-detail
                    .item-image
                      img(v-if="item.item.image_url", :src="scaleImage(item.item.image_url, 1, 40, 40)")
                    .simple-td.good-name {{item.item.item_title}} <br/> {{item.item.sku_name}}
                td
                  .simple-td(v-text="item.write_off_count")
                td
                  .simple-td(v-text="item.remain_count")
</template>

<script>
import ModalInteractions from '@/mixins/utilities/modalInteractions'
import ModalDialog from '@/components/generics/ModalDialog'
import EmptyPage from '@/components/generics/EmptyPage'
import imageScale from '@/mixins/utilities/imageScale'
export default {
  name: 'writeOffRecordModal',
  components: {
    ModalDialog,
    EmptyPage,
  },
  mixins: [ModalInteractions, imageScale],
  props: {
    writeOffData: Array,
  },
  data () {
    return {}
  },
  methods: {},
  mounted () {},
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.table-wrapper
  max-height 300px
.modal-header
  padding 20px 24px
.modal-footer
  padding 12px 16px
.modal-body
  padding 20px
  min-height 110px
  line-height 22px
  font-size 15px
  color #888
.good-info
  width 300px
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
.service-item-detail
  height 40px
  line-height 40px
  .simple-td.good-name
    padding-top 2px
    width 300px !important
    line-height 18px
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
</style>

