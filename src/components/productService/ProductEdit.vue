<template lang="pug">
  .section-layout
    .content-wrapper
      h2 编辑商品
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 商品库名称
            .field-content(v-text="info.product_name")
          .field.is-horizontal
            label.label 商品名称
            custom-input(v-model="info.name", input-type="hasCount", placeholder="请输入商品名称", :validator="$v.info.name", error-info="商品名称必填并且小于十五位")
              span(slot="countInfo") {{wordLength(info.name)}}/20
          .field.is-horizontal
            label.label 商品品牌
            .field-content(v-text="info.brand_name")
          .field.is-horizontal
            label.label 商品图片
            .control.cus_imgs(v-if="info.product_pics.length>0 && info.source_type === 1")
              open-image(img-type="2",:img-url="info.product_pics",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="5", border-radius="5")
            .control.image-wrapper(v-if="info.source_type === 2")
              .upload-pic(v-for="(item, index) in info.product_pics")
                upload-img-model(v-model="info.product_pics[index]", img-type="info", :has-second-action="true", :img-id="index + 1", @other="deleteImage")
              .upload-pic(v-if="info.product_pics.length < 5")
                upload-img-model(v-model="info.product_pics[info.product_pics.length]", img-type="info", :has-second-action="true", @other="deleteImage")
          .field.toggle-group.is-horizontal.custom-select
            label.label 商品分类
            .field-content(v-text="info.category_name")
          .field.is-horizontal
            label.label 商品简述
            .control(:class="{'disabled': isLoading}")
              custom-textarea.textarea(placeholder="请输入该商品的详细描述", v-model="info.desc", :validator="$v.info.desc", error-info="商品描述不能大于100字", :is-disabled="isLoading")
          .field.is-horizontal
            label.label 备注
            textarea.textarea(v-model="info.remark", maxlength=20, placeholder="请输入商品备注")
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
        .field-group(v-if="info.sku_data.length>0")
          .field.is-horizontal.width-100
            label.label SKU设置
            .control
              .sku-title.clearfix
                .title.fl SKU名称
                .title.fl SKU图
                .title.fl.width-160 SKU价格
                .title.fl.p-l-40(v-if="info.source_type == 1") 建议售价
                .title.fl.width-200.p-l-40 详情图
                .title.fl.width-80 操作
              <!--禁用的sku隐藏掉 -->
              .sku-box(v-for="(sku, index) in sku_data")
                .sku-txt(v-text="sku.value")
                .sku-img.width-150.m-r-0
                  upload-pic(v-if='info.source_type === 2',v-model="sku.sku_pics[0]", :img-id="index + 1", :default-img="defaultImgSrc", img-type="sku")
                  .upload-pic-default(v-if='info.source_type === 1')
                    img(:src='sku.sku_pics[0]')
                .sku-price
                  custom-input(input-type="hasUnit", :is-disabled="isLoading", v-model="sku.sell_price", :validator="$v.sku_data.$each[index].sell_price", error-info="请输入大于0小于99999的价格精确到小数点后2位", need-type="float")
                    span(slot="unitName") 元
                .sku-txt.p-l-40(v-if="info.source_type == 1", v-text="'￥'+sku.basic_sell_price")
                .sku-txt.width-200.p-l-40
                  .a-text.fl.m-r-20(v-show="!sku.isFlag && info.source_type === 2", @click="addImage(index)") 上传
                  .fl.m-r-20.gray(v-show="!sku.isFlag && info.source_type === 1") 上传
                  .a-text.fl.m-r-20(v-show="sku.isFlag && info.source_type === 2", @click="editImage(index,sku.content)") 编辑
                  .a-text.fl.m-r-20(v-show="sku.isFlag", @click="toggleSidePannel(sku.content)") 查看
                  .a-text.fl.m-r-20(v-show="sku.isFlag && info.source_type === 2", @click="delcontent(index)") 删除
                .sku-txt.width-200
                  .simple-td
                    .switch
                      input(type="checkbox", :id="'display' + index", v-model="sku.is_selected", @change="displayConfirm(sku)")
                      label(:for="'display' + index")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData(1)", :class="{'disabled': isLoading}") 保存
          a.button.primary.large(@click="inspectData(2)", :class="{'disabled': isLoading}") 保存并上架
          a.button.large(@click="goBack") 取消
    select-image(v-model="openFlag", v-if="openFlag", @resolve="getImageArray", :index="currentIndex",:current-image-array="currentArray")
    slide-out-modal(v-if="slideVisible", :is-slim="true", @input="toggleSidePannel")
      image-detail(v-if="true", :current-image-array="currentArray")
</template>

<script>
import productServiceMixin from '@/mixins/modules/productService'
import fileUploader from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import UploadPic from '@/components/generics/form/UploadPic'
import imageScale from '@/mixins/utilities/imageScale'
import { between, required } from 'vuelidate/lib/validators'
import { priceFormat, wordLength } from '@/mixins/custom-validators/custom-validators'
import SelectImage from '@/components/generics/SelectImage'
import ImageDetail from '@/components/productService/ImageDetail'
import SlideOutModal from '@/components/generics/SlideOutModal'
import OpenImage from '@/components/generics/OpenImage'
import uploadImgModel from '@/components/basicInformation/modal/uploadImgModel'
import CustomTextarea from '@/components/generics/form/CustomTextarea'
import MathFun from '@/mixins/utilities/math'

export default {
  name: 'productEdit',
  mixins: [productServiceMixin, fileUploader, imageScale, MathFun],
  components: {
    CustomInput,
    UploadPic,
    SelectImage,
    ImageDetail,
    SlideOutModal,
    OpenImage,
    uploadImgModel,
    CustomTextarea,
  },
  data () {
    return {
      isLoading: false,
      info: {
        name: '',
        product_id: '',
        product_name: '',
        brand_name: '',
        category_id: '',
        product_pics: [], // 主图
        sku_data: [],
        attribute_data: [],
        remark: '',    // 备注
        source_type: 1,
        desc: '',    // 商品描述
      },
      propertyList: [],
      sku_data: [],
      defaultImgSrc: '',
      openFlag: false,
      currentArray: [],
      slideVisible: false,
    }
  },
  computed: {
    getParams () {
      // console.log(this.info.product_pics, 'XXXX')
      let skuData = JSON.parse(JSON.stringify(this.sku_data))
      skuData = skuData.map((item) => {
        item.sell_price = item.sell_price * 100
        return item
      })
      return {
        product_id: this.product_id,
        product_pics: this.info.product_pics,
        name: this.info.name,
        sku_data: skuData,
        source: 2, // （1:同步，2:创建）
        remark: this.info.remark,
        desc: this.info.desc,
      }
    },
  },
  validations: {
    info: {
      name: {
        required,
        validate (val) {
          return this.wordLength(val) <= 20
        },
      },
      desc: {
        validate (val) {
          return val.length <= 100
        },
      },
    },
    sku_data: {
      $each: {
        sell_price: {
          between: between(0.01, 99999),
          priceFormat,
        },
      },
    },
  },
  methods: {
    wordLength,
    // 删除图片
    deleteImage (url) {
      const index = this.info.product_pics.findIndex(val => val === url)
      this.info.product_pics.splice(index, 1)
    },
    // 获取商品详情
    async getData () {
      let self = this
      try {
        const { response, result } = await this.fetchProductDetail(this.product_id)
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '商品详情获取失败',
              content: `${result.message}`,
            })
            return false
          }
          var filterData = []
          result.data.sku_data.forEach(function (v) {
            if (v.content && v.content.length > 0) {
              v.isFlag = true
            } else {
              v.isFlag = false
            }
            if (v.is_enabled === 1) {
              v.is_selected = true
            } else {
              v.is_selected = false
            }
            if (v.sell_price) {
              v.sell_price = self.accDiv(v.sell_price, 100)
            }
            if (v.basic_sell_price) {
              v.basic_sell_price = self.accDiv(v.basic_sell_price, 100)
            }
            filterData.push(v)
          })
          result.data.sku_data = filterData
          this.info = result.data
          this.sku_data = this.info.sku_data
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
    // 关闭/开启SKU
    async displayConfirm (sku) {
      sku.is_enabled === 1 ? sku.is_enabled = 2 : sku.is_enabled = 1
    },
    // 返回
    goBack () {
      this.$router.replace({
        name: 'productList',
        query: {
          save: 1,
        },
      })
    },
    /**
     * 编辑商品
     * status    1.保存，2.保存并编辑
     */
    async inspectData (status) {
      if (this.isLoading) {
        return false
      }
      this.$v.$touch()
      if (this.$v.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        return
      }
      let arr = this.info.sku_data.filter(ele => {
        if (ele.sell_price < 0) {
          return ele
        }
      })
      if (this.info.product_pics.length <= 0) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请上传商品主图',
        })
        return
      }
      if (arr.length > 0) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 200)
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: 'SKU价格不能小于0',
        })
        return
      }
      try {
        this.isLoading = true
        const { response, result } = await this.productUpdate(this.getParams)
        if (response.status === 200 && result.code === 0) {
          if (status === 1) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '商品保存成功',
              resolve: () => {
                this.$router.replace({
                  name: 'productList',
                })
              },
            })
          } else {
            this.setSellingState()
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '商品修改失败',
            content: `${result.message}`,
          })
          this.isLoading = false
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '商品修改失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isLoading = false
    },
    // 打开上传详情
    addImage (index) {
      this.openFlag = true
      this.currentIndex = index
      this.currentArray = []
    },
    // 编辑上传详情
    editImage (index, imgs) {
      this.openFlag = true
      this.currentIndex = index
      this.currentArray = imgs
    },
    // 上传详情弹窗回调
    getImageArray (index, imageArray) {
      this.info.sku_data[index].content = imageArray
      if (imageArray && imageArray.length > 0) {
        this.info.sku_data[index].isFlag = true
      } else {
        this.info.sku_data[index].isFlag = false
      }
    },
    // 删除sku图片详情
    delcontent (index) {
      this.info.sku_data[index].content = []
      this.$set(this.info.sku_data[index], 'isFlag', false)
    },
    // 查看sku详情
    toggleSidePannel (imgs) {
      this.slideVisible = !this.slideVisible
      this.currentArray = imgs
    },
    // 上架操作
    async setSellingState () {
      let params = {
        product_ids: [this.info.product_id],
        is_sale: 1,
      }
      try {
        const { response, result } = await this.productShelves(params)
        if (response.status === 200 && result.code === 0) {
          if (result.data.error_number === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '商品保存并上架成功',
              resolve: () => {
                this.$router.replace({
                  name: 'productList',
                })
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '上架失败',
              content: '失败原因：商品sku配置不全',
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '温馨提示',
            content: '服务异常，请稍后再试',
          })
        }
      } catch (err) {
        console.error('上架接口', err)
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
@import '~@/stylus/modules/creation-modal'
.field-content
  font-size 13px
  line-height 16px
  color #353535
.image-wrapper
  display flex
  flex-direction row
  .upload-banner + .upload-banner
    margin-left 8px
  .upload-pic
    width 88px
    height 88px
    margin-right 8px
  .cus_imgs
    display flex
    .img
      margin-right 5px
.service-status
  padding-left 7px
  font-size 13px
  color darker
  margin-right 20px
.radio + .radio
  margin-left 28px
.custom-select
  width 600px !important
.cus_imgs
  display flex
  .img
    width 60px
    height 60px
    margin-right 5px
.sku-box
  display flex
  align-items center
  margin-top 20px
  .sku-txt
    width 150px
    font-size 12px
    color #888
    padding-right 20px
  .sku-img
    width 60px
    height 60px
    margin-right 20px
  .sku-price
    width 160px
.sku-img>.upload-pic
  width 60px !important
  height 60px !important
.upload-pic-default
  width 60px !important
  height 60px !important
  img
    width 100%
    height 100%
.picture-description
  font-size 12px
  line-height 16px
  color lightGrey
  white-space nowrap
  margin-top 8px
.rich-eidtor-description
  margin-bottom 8px
.contentcc
  width 100%
  .cc
    float left
    margin-bottom 10px
    margin-left 10px
    width auto
.gray
  color #666 !important
/* new */
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
