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
                td(width="80", v-if="type && type == 1") 商品状态
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
                td(v-if="type && type == 1 && !need_type")
                  .simple-td(v-if="item.status == 1") 已经上架
                  .simple-td(v-if="item.status == 2") 未入库
                  .simple-td(v-if="item.status == 3") 已入库未上架
                  .simple-td(v-if="item.status == 4") 已入库未开启
                td(v-if="need_type")
                  .simple-td(v-if="item.status == 1") 已经上架
                  .simple-td(v-if="item.status == 2") 已经下架
        empty-page(v-if="list.length === 0", tip="当前没有商品")
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Api from '@/mixins/modules/customer'
  import ProductApi from '@/mixins/modules/productService'
  export default {
    name: 'CardGoodsModal',
    components: {
      ModalDialog,
      EmptyPage,
    },
    mixins: [ModalInteractions, Api, ProductApi],
    // 传入参数type = 1  需要请求关于壳牌商品的接口
    props: {
      id: {
        type: [String, Number],
      },
      type: {
        type: [String, Number],
        default: '',
      },
      is_iso: {
        type: [Number, String],
        default: 2,
      },
      need_type: {
        type: [Boolean, Number],
        default: false,
      },
    },
    data () {
      return {
        list: [],
      }
    },
    methods: {
      // 获取养护卡详情区分客户还是非客户
      async fetchDetail () {
        let params = {id: this.id}
        try {
          const { response, result } = this.is_iso - 0 === 1 ? await this.fetchCardDetailApi(params) : this.is_iso - 0 === 2 ? await this.fetchCardDetailTwoApi(params) : await this.fetchCardCountDetailApi(params)
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
      // 基础库养护卡关联商品
      async fetchGoodsList () {
        try {
          const { response, result } = await this.fetchCardGoodsApi({
            id: this.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
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
      // 编辑壳牌养护卡时pid = 0
      async fetchList () {
        try {
          const { response, result } = await this.getTwoApi({
            id: this.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
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
      if (this.need_type) {
        this.fetchList()
      } else {
        (this.type && this.type - 0 === 1) ? this.fetchGoodsList() : this.fetchDetail()
      }
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
