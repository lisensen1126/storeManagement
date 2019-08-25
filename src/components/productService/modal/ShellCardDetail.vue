<template lang="pug">
  .slide-layout
    .slide-title 查看卡片
      .form-wrapper
        h2.title-info 基本信息
        .field-group
          .field.is-horizontal
            label.label 名称
            .field-content {{detail.info.name}}
          .field.is-horizontal
            label.label 卡面
            .field-content
              open-image(v-if="detail.info.image_url", img-type="1",:img-url="detail.info.image_url",key-name="",mini-width="161",mini-height="100",margin-bottom="0", margin-right="5", border-radius="5")
          .field.is-horizontal
            label.label 分类
            .field-content {{detail.info.category_name}}
          .field.is-horizontal
            label.label 使用次数
            .field-content {{detail.info.num}}次
          .field.is-horizontal
            label.label 销售价格
            .field-content {{detail.info.price}}元
          .field.is-horizontal
            label.label 卡片原价
            .field-content {{detail.info.origin_price}}元
          .field.is-horizontal
            label.label 图文详情
            .field-content
              open-image(v-if="detail.info.content",img-type="1",:img-url="detail.info.content",key-name="",mini-width="161",mini-height="100",margin-bottom="0", margin-right="5", border-radius="5")
      .form-wrapper
        h2.title-info 使用须知
        .field-group
          .field.is-horizontal
            label.label 有效期
            .field-content {{detail.info.expiry}}月
          .field.is-horizontal
            label.label 使用规则
            .field-content(v-html="detail.info.description")
      .form-wrapper
        .field-group.is-horizontal
          a.button.primary(@click="showItem") 查看卡内项目
          a.button.primary(@click="showGoods") 查看关联商品
    card-project-modal(v-model="show_card_project" v-if="show_card_project", :id="id", is_iso="1")
    card-goods-modal(v-model="show_card_goods" v-if="show_card_goods", type="1" :id="id")
</template>

<script>
  import imageScale from '@/mixins/utilities/imageScale'
  import ProductServiceMixin from '@/mixins/modules/productService'
  import OpenImage from '@/components/generics/OpenImage'
  import CardProjectModal from '@/components/customer/CardProjectModal'
  import CardGoodsModal from '@/components/customer/CardGoodsModal'

  export default {
    name: 'CardManagementDetail',
    mixins: [imageScale, ProductServiceMixin],
    components: {
      OpenImage,
      CardProjectModal,
      CardGoodsModal,
    },
    props: {
      id: [String, Number],
    },
    data () {
      return {
        detail: {
          info: {
            id: null,
            name: '',
            image_url: '',
            category_id: null,
            category_name: '',
            num: null,
            price: null,
            max_price: null,
            origin_price: null,
            content: '',
            expiry: null,
            begin_time: '',
            end_time: '',
            description: '',
          },
          item: [],
        },
        show_card_project: false, // 控制卡内项目列表弹框显隐
        show_card_goods: false, // 控制关联商品列表弹框显隐
      }
    },
    computed: {
    },
    methods: {
      // 获取卡片内容
      async getCardDetail () {
        try {
          const {response, result} = await this.upkeepDetailApi({
            id: this.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.detail = result.data
            this.detail.info.price = (this.detail.info.price / 100).toFixed(2)
            this.detail.info.origin_price = (this.detail.info.origin_price / 100).toFixed(2)
            this.detail.info.max_price = (this.detail.info.max_price / 100).toFixed(2)
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡详情失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡详情失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 查看卡内项目
      showItem () {
        this.show_card_project = true
      },
      // 查看关联商品
      showGoods () {
        this.show_card_goods = true
      },
    },
    async mounted () {
      this.getCardDetail()
    },
  }
</script>

<style lang="stylus" scoped>
.field-content
  font-size 14px
  color #666
.field.is-horizontal .label
  flex 0 0 50px
.title-info
  font-size 16px
.slide-layout .field
  margin-top 12px
.form-wrapper
  border-top 1px solid #ddd
  padding 8px 0
  .button
    margin-right 20px
    margin-top 15px
</style>

