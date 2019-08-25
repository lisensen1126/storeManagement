<template lang="pug">
  .section-layout
    .content-wrapper
      h2 商品详情
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 商品名称
            .field-content(v-text="info.name")
          .field.is-horizontal
            label.label 商品品牌
            .field-content(v-text="info.brand_name")
          .field.is-horizontal
            label.label 商品图片
            .control.cus_imgs(v-if="info.product_pics && info.product_pics.length>0")
              open-image(img-type="2",:img-url="info.product_pics",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="5", border-radius="5")
          .field.toggle-group.is-horizontal.custom-select
            label.label 商品分类
            .field-content(v-text="info.category_name")
          .field.is-horizontal
            label.label 商品简述
            .field-content.field-textarea(v-text="info.desc && info.desc.length > 0 ? info.desc : '- -'")
          .field.is-horizontal
            label.label 备注
            .field-content(v-text="info.remark && info.remark.length > 0 ? info.remark : '- -'")
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
                label.label(v-text="prop.attribute_name")
                .contentcc
                  .control.cc(v-for="param in prop.attribute_items")
                    .switch
                    .radio.service-status(v-text="param.attribute_item_value")
        .field-group
          .field.is-horizontal.width-100
            label.label SKU设置
            .control
              .sku-title.clearfix
                .title.fl SKU名称
                .title.fl SKU图
                .title.fl.width-160 SKU价格
                .title.fl.p-l-40(v-if="info.source_type == 1") 建议售价
                .title.fl.width-200.p-l-40 详情图
              .sku-box(v-for="(sku, index) in info.sku_data",v-if="sku.is_enabled == 1")
                .sku-txt(v-text="sku.value")
                .sku-img.width-150.m-r-0(v-if="sku.sku_pics && sku.sku_pics[0] && sku.sku_pics[0].length>0")
                  open-image(img-type="1",:img-url="sku.sku_pics[0]",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="0", border-radius="2")
                .fl.sku-txt(v-else) 暂无内容
                .sku-price
                  span(v-text="'¥ ' + accDiv(sku.sell_price,100)")
                .sku-txt.p-l-40(v-if="info.source_type == 1", v-text="'￥'+accDiv(sku.basic_sell_price,100)")
                .sku-txt.width-200.p-l-40
                  .fl.m-r-20(:class="{'a-text': sku.content && sku.content.length > 0}",@click="toggleSidePannel(sku.content)",v-text="sku.content && sku.content.length > 0 ? '查看':'暂无内容'")
      .btn-wrapper
        .button-group
          a.button.primary.large(v-if="info.is_sale == 2" @click="toggleSellingState(1)") 上架
          a.button.primary.large(v-if="info.is_sale == 1" @click="toggleSellingState(2)") 下架
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
  name: 'productDetail',
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
      try {
        const {response, result} = await this.fetchProductDetail(this.product_id)
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '商品详情获取失败',
              content: `${result.message}`,
            })
            return false
          }
          this.info = result.data
          this.propertyList = this.info.attribute_data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '商品详情获取失败',
            content: `${response.status} ${result.message}`,
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
      if (this.$route.query.from) {
        this.$router.replace({
          name: 'productList',
          query: {
            save: 1,
          },
        })
      } else {
        this.$router.back(-1)
      }
    },
    // 查看sku详情
    toggleSidePannel (imgs) {
      if (imgs && imgs.length <= 0) {
        return false
      }
      this.slideVisible = !this.slideVisible
      this.currentArray = imgs
    },
    toggleSellingState (status) {
      this.$store.dispatch('showMessage', {
        title: `确认${status === 2 ? '下架' : '上架'}该商品？`,
        content: status === 2 ? '下架后商品将不在商城售卖' : '上架后即可在商城购买该商品',
        isRejectable: 1,
        resolve: () => {
          this.setSellingState(status)
        },
      })
    },
    // 上下架操作
    async setSellingState (state) {
      let params = {
        product_ids: [this.info.product_id],
        is_sale: state,
      }
      try {
        const {response, result} = await this.productShelves(params)
        if (response.status === 200 && result.code === 0) {
          if (result.data.error_number === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '操作成功',
              resolve: () => {
                this.$router.replace({
                  name: 'productList',
                })
              },
            })
          } else {
            if (status - 0 === 1) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '修改商品上架状态失败',
                content: '失败原因：商品sku配置不全',
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '修改商品下架状态失败',
                content: '该商品正在参与营销活动不能下架',
              })
            }
            return false
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '温馨提示',
            content: '服务异常，请稍后再试',
          })
        }
      } catch (err) {
        console.error('上下架接口', err)
      }
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
.field-textarea
  width 300px
  word-break break-all
</style>
