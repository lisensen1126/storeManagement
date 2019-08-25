<template lang="pug">
  .section-layout
    .content-wrapper
      h2 商品详情
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 商品名称
            .field-content(v-text="info.product_name")
          .field.is-horizontal
            label.label 商品品牌
            .field-content(v-text="info.brand_name")
          .field.is-horizontal
            label.label 商品图片
            .control.cus_imgs(v-if="info.product_pics.length>0")
              open-image(img-type="2",:img-url="info.product_pics",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="5", border-radius="5")
          .field.toggle-group.is-horizontal.custom-select
            label.label 商品分类
            .field-content(v-text="info.category_name")
        .field-group
          .field.is-horizontal
            .control
              .field.is-horizontal
                label.label(v-text="'属性'")
                .control(v-for="propertyItem in propertyList")
                  .switch
                  .radio.service-status(v-text="propertyItem.attribute_name")
        .field-group
          .field.is-horizontal
            label.label 参数
            .control
              .field.is-horizontal(v-for="prop in info.attribute_data")
                label.label(v-text="prop.attribute_name + ':'")
                .contentcc
                  .control.cc(v-for="param in prop.attribute_items")
                    .switch
                    .radio.service-status(v-text="param.attribute_item_value")
        .field-group
          .field.is-horizontal
            label.label SKU设置
            .control
              .sku-title.clearfix
                .title.fl SKU名称
                .title.fl SKU图
                .title.fl.p-l-40(v-if="info.source_type == 1") SKU价格(建议)
                .title.fl.width-200.p-l-40 详情图
              .sku-box(v-for="(sku, index) in info.sku_data",v-if="sku.is_enabled == 1")
                .sku-txt(v-text="sku.value")
                .sku-img.width-150.m-r-0(v-if="sku.sku_pics && sku.sku_pics[0] && sku.sku_pics[0].length>0")
                  open-image(img-type="1",:img-url="sku.sku_pics[0]",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="0", border-radius="2")
                .fl.sku-txt(v-else) 暂无内容
                .sku-txt.p-l-40(v-if="info.source_type == 1", v-text="'¥'+sku.basic_sell_price")
                .sku-txt.width-200.p-l-40
                  .fl.m-r-20(:class="{'a-text': sku.content && sku.content.length > 0}",@click="toggleSidePannel(sku.content)",v-text="sku.content && sku.content.length > 0 ? '查看':'暂无内容'")
        <!--.field-group-->
          <!--.field.is-horizontal-->
            <!--label.label 图文详情-->
            <!--.control-->
              <!--.picture-description.rich-eidtor-description 商文详情页下拉显示的商品描述图文，建议图片宽度不小于720px-->
              <!--rich-editor(v-model="info.content", :is-disabled="true")-->
      .btn-wrapper
        .button-group
          a.button.large(@click="goBack") 返回
    select-image(v-model="openFlag", v-if="openFlag", @resolve="getImageArray", :index="currentIndex",:current-image-array="currentArray")
    slide-out-modal(v-if="slideVisible", :is-slim="true", @input="toggleSidePannel")
      image-detail(v-if="true", :current-image-array="currentArray")
</template>

<script>
import productServiceMixin from '@/mixins/modules/productService'
import imageScale from '@/mixins/utilities/imageScale'
import UploadPic from '@/components/generics/form/UploadPic'
import SelectImage from '@/components/generics/SelectImage'
import ImageDetail from '@/components/productService/ImageDetail'
import SlideOutModal from '@/components/generics/SlideOutModal'
import OpenImage from '@/components/generics/OpenImage'
import MathFun from '@/mixins/utilities/math'

export default {
  name: 'productLibraryDetail',
  mixins: [productServiceMixin, imageScale, MathFun],
  components: {
    UploadPic,
    SelectImage,
    ImageDetail,
    SlideOutModal,
    OpenImage,
  },
  data () {
    return {
      info: {
        product_id: '',
        product_name: '',
        brand_name: '',
        category_id: '',
        category_name: '',
        content: '',
        product_pics: [],
        sku_data: [],
        attribute_data: [],
      },
      propertyList: [],
      defaultImgSrc: '',
      openFlag: false,
      currentArray: [],
      slideVisible: false,
    }
  },
  methods: {
    // 获取商品详情
    async getData () {
      let self = this
      try {
        const {response, result} = await this.fetchProductLibraryDetail(this.product_id)
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '商品详情获取失败',
              content: `${result.message}`,
            })
            return false
          }
          result.data.sku_data.forEach(function (v) {
            v.sell_price = self.accDiv(v.sell_price, 100).toFixed(2)
            v.basic_sell_price = self.accDiv(v.basic_sell_price, 100).toFixed(2)
          })
          this.info = result.data
          this.propertyList = this.info.attribute_data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '商品详情获取失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '商品详情获取失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 返回
    goBack () {
      this.$router.push({
        name: 'productLibrary',
      })
    },
    // 查看sku详情
    toggleSidePannel (imgs) {
      if (imgs && imgs.length <= 0) {
        return false
      }
      this.slideVisible = !this.slideVisible
      this.currentArray = imgs
    },
  },
  mounted () {
    this.product_id = this.$route.params.id
    if (this.product_id) {
      this.getData()
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';
.field-content
  font-size: 13px
  line-height: 16px
  color: #353535
.service-status {
  padding-left: 7px;
  font-size: 13px;
  color: darker;
}

.radio + .radio {
  margin-left: 28px;
}

.custom-select {
  width: 600px !important;
}

.custom-select-commodity {
  margin-right: 20px;
}

.service-status {
  margin-right: 20px;
}

.cus_imgs {
  display: flex;
  .img {
    width: 60px
    height: 60px
    margin-right: 5px;
    img{
      width 100%
      height 100%
    }
  }
}

.sku-box {
  display: flex;
  align-items: center;
  margin-top: 20px;

  .sku-txt {
    width: 150px
    font-size: 12px;
    color: #888;
    padding-right: 20px;
  }

  .sku-img {
    width: 60px;
    height: 60px;
    margin-right: 20px;
  }

  .sku-price {
    width: 160px;
  }
}

.sku-img>.upload-pic {
  width: 60px !important;
  height: 60px !important;
}

.picture-description {
  font-size: 12px;
  line-height: 16px;
  color: lightGrey;
  white-space: nowrap;
  margin-top: 8px;
}

.rich-eidtor-description {
  margin-bottom: 8px;
}
.contentcc
  width 100%
  .cc
    float left
    margin-bottom 10px
    margin-left 10px
.ccs
  color gray
  font-size 12px
  padding-left 30px
/*new*/
.m-l-0
  margin-left 0 !important
.m-r-0
  margin-right 0 !important
.m-r-20
  margin-right 20px
.p-l-40
  padding-left 40px
.fl
  float left
.clearfix:after
  display block
  content ''
  clear both
  height 0
.sku-title
  padding-top 8px
  width 900px
  .title
    float left
    width 150px
    font-size 12px
    line-height 16px
    color #666
.width-100
  width 100% !important
.width-200
  width 200px !important
.width-150
  width 150px !important
.width-160
  width 160px !important
.width-80
  width 80px !important
.a-text
  color #3a8ee6 !important
  cursor pointer
</style>
