<template lang="pug">
  .section-layout
    .content-wrapper
      h2 查看服务
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 服务名称
            .labelname(v-text="detail.product_name")
          .field.is-horizontal
            label.label 服务图示
            open-image(v-if="detail.product_pic",img-type="1",:img-url="detail.product_pic",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="0", border-radius="5")
          .field.is-horizontal
            label.label 服务品牌
            .field-content(v-text="(detail.brands && detail.brands.brand_name)?detail.brands.brand_name:'- -'")
          .field.is-horizontal
            label.label 服务分类
            .labelname(v-text="detail.category_name")
          .field.is-horizontal
            label.label 建议价格
            .field-content(v-if="detail.sell_price == '0.00'",v-text="'- -'")
            .field-content(v-else) {{detail.sell_price ? accDiv(detail.sell_price,100) + '元' : ''}}
          .field.is-horizontal
            label.label 服务简述
            .field-content(v-if="detail.summary !== ''", v-text="detail.summary")
            .field-content(v-else) - -
          .field.is-horizontal
            label.label 服务详情
            .control(v-if="detail.content.length === 0")  - -
            .control.image-wrapper(v-else)
              img.img-detail(v-for="(cell, index) in detail.content",:src="detail.content[index]")
      .btn-wrapper
        .button-group
          a.button.large(@click="goBack") 返回
</template>

<script>
import productServiceMixin from '@/mixins/modules/productService'
import EmptyPage from '@/components/generics/EmptyPage'
import imageScale from '@/mixins/utilities/imageScale'
import uploadImgModel from '@/components/basicInformation/modal/uploadImgModel'
import OpenImage from '@/components/generics/OpenImage'
import MathFun from '@/mixins/utilities/math'

export default {
  name: 'serviceLibraryDetail',
  mixins: [productServiceMixin, imageScale, MathFun],
  components: {
    EmptyPage,
    uploadImgModel,
    OpenImage,
  },
  data () {
    return {
      detail: {
        content: [],
      },
      basic_spu_id: null,
    }
  },
  methods: {
    // 返回操作
    goBack () {
      this.$router.push({
        name: 'serviceLibrary',
      })
    },
    // 获取详情
    async getDetail () {
      try {
        const {response, result} = await this.fetchServiceLibraryDetail(this.basic_spu_id)
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取服务详情失败',
              content: `${result.message}`,
            })
            return false
          }
          this.detail = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务详情失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取服务详情失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    this.basic_spu_id = this.$route.params.id
    this.getDetail() // 获取详情
  },
}
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
.label
  color #353535
  font-size 13px
.labelname
  color #999
  font-size 13px
  line-height 29px
.radio label
  padding-left 32px
.upload-pic
  width 88px
  height 88px
  border-radius: 2px
  overflow: hidden
  position: relative
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.15)
.img-detail
  display block
  width 375px
  height auto
.cus_imgs {
  display: flex;

  .img {
    margin-right: 5px;
  }
}
</style>
