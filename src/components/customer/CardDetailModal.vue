<template lang="pug">
  .slide-layout
    card-goods-modal(v-model="show_card_goods" v-if="show_card_goods", :id="card_id")
    .slide-title 查看卡片
      .tab-content
        .tab-content-item
          .tab-content-block 基本信息
            .item-content
              .profiled.flex
                .labeltitle 名称:
                .question-list
                  .question-li(v-if="detail.info") {{detail.info.name}}

              .profiled.flex
                .labeltitle 卡号:
                .question-list
                  .question-li(v-if="detail.info") {{upkeep}}****

              .profiled.flex
                .labeltitle 卡面:
                .question-list
                  .question-li(v-if="detail.info")
                    open-image(img-type="2",:img-url="detail.info.image_url",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="5", border-radius="5")
              .profiled.flex
                .labeltitle 分类:
                .question-list
                  .question-li(v-if="detail.info") {{detail.info.category_name}}

              .profiled.flex(v-if="detail.info && detail.info.type === 1")
                .labeltitle 使用次数:
                .question-list
                  .question-li(v-if="detail.info") {{detail.info.num}}次

              .profiled.flex
                .labeltitle 销售价格:
                .question-list
                  .question-li(v-if="detail.info") {{detail.info.price / 100}}元

              .profiled.flex
                .labeltitle 卡片原价:
                .question-list
                  .question-li(v-if="detail.info") {{detail.info.origin_price / 100}}元
                  //- .question-li 4675元={{origin_price}}元 X 5次

              .profiled.flex
                .labeltitle 图文详情:
                .question-list(v-if="detail.info")
                  open-image(img-type="2",:img-url="detail.info.content",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="5", border-radius="5")

          .tab-content-block 使用须知
            .item-content
              .profiled.flex
                .labeltitle 有效期:
                .question-list
                  .question-li(v-if="detail.info") {{detail.info.expiry}}个月

              .profiled.flex
                .labeltitle 使用规则:
                .question-list
                  .question-li(v-if="detail.info && detail.info.description", v-html="detail.info.description")
                  .question-li(v-if="detail.info && !detail.info.description",) --

              .profiled.flex
                .button.primary.right-30(@click="showItem") 查看卡内项目
                .button.primary(@click="showCardGoods" v-if="detail.info && detail.info.type === 1") 关联商品
</template>

<script>
  import imageScale from '@/mixins/utilities/imageScale'
  import OpenImage from '@/components/generics/OpenImage'
  import Api from '@/mixins/modules/customer'
  import CardGoodsModal from '@/components/customer/CardGoodsModal'
  export default {
    name: 'ClientCarModal',
    mixins: [Api, imageScale],
    components: {
      OpenImage,
      CardGoodsModal,
    },
    props: {
      id: [String, Number],
      upkeep: [String, Number],
    },
    data () {
      return {
        img: ['http://pic27.nipic.com/20130225/4746571_081826094000_2.jpg'],
        detail: {},
        show_card_goods: false,
        card_id: null,
      }
    },
    computed: {},
    methods: {
      // 显示关联商品
      showCardGoods () {
        this.card_id = this.id
        this.show_card_goods = true
      },
      showItem () {
        this.$emit('cardSuccess', this.id)
      },
      // 获取养护卡详情
      async fetchDetail () {
        try {
          const { response, result } = await this.fetchCardDetailTwoApi({
            id: this.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.detail = result.data
            this.detail.info.image_url = [result.data.info.image_url]
            this.detail.info.content = [result.data.info.content]
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
    },
    mounted () {
      this.fetchDetail()
    },
  }
</script>

<style lang="stylus" scoped>
  .button {
    width 120px
    margin-top 40px
  }
  .right-30{
    margin-right 30px
  }
  .labeltitle {
    min-width 50px
  }
  .text{
    font-size 14px
    display flex
    margin-top 5px !important
    justify-content space-between
  }
  .tab-content-item{
    font-size 12px
    color #333
    padding: 10px 0 8px
    .imgbox{
      padding-top 5px
      img{
        width 80px
        height 80px
      }
    }
    .content-item-title{
      font-weight 500
    }
    .item-content{
      padding-top 12px
      padding-bottom 6px
      border-bottom 1px solid #666
      &:first-child{
        padding-top 0
      }
      &:last-child{
        border-bottom 0
      }
    }
    .flex{
      display flex
      justify-content flex-start
    }
    .between{
      justify-content space-between
    }
    .projectbox{
      padding-left 10px
      .project{
        display: inline-block
        padding: 0 8px
        border:1px solid #888
        border-radius 4px
        height: 30px
        line-height 30px
        margin-left 6px
      }
    }
    .question-list{
      padding-left 10px
      width 240px
      word-break break-all
    }
  }

</style>
