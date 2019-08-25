<template lang="pug">
  .section-layout
    .content-wrapper
      h2 添加商品
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 商品名称
            custom-input(v-model="info.product_name", input-type="hasCount", :validator="$v.info.product_name", placeholder="请输入商品名称", error-info="商品名称必填并且小于二十位")
              span(slot="countInfo") {{wordLength(info.product_name)}}/20
          .field.is-horizontal
            label.label 商品品牌
            .custom-brand
              custom-select(v-model="brandSelected", @input="resetSelected", v-if="!isShowCustom", :list="brandArr", placeholder="请选择商品品牌", nameField="brand_name", :validator="$v.brandSelected", error-info="请选择商品品牌", :show-search="true")
              custom-input(v-model="custom_name", @input="resetSelected", max-length="20" v-if="isShowCustom" :validator="$v.custom_name", placeholder="请输入品牌名称",  error-info="品牌名称必填并且小于二十位")
            label.label.no-brand(@click="noBrand", v-if="!isShowCustom") 没有品牌？
            label.label.no-brand(@click="noBrand", v-if="isShowCustom") 选择品牌
          .field.is-horizontal
            label.label 商品主图
            .control.image-wrapper
              .upload-pic(v-for="(item, index) in info.product_pics")
                upload-img-model(v-model="info.product_pics[index]", img-type="info", :has-second-action="true", @other="deleteImage")
              .upload-pic(v-if="info.product_pics.length < 5")
                upload-img-model(v-model="info.product_pics[info.product_pics.length]", img-type="info", :has-second-action="true", @other="deleteImage")
          .field.is-horizontal
            label.label
            .picture-description 商品图示，用于商品详情页顶部大图、所有列表页缩略图，建议尺寸不小于720*540px
          .field.toggle-group.is-horizontal.custom-select
            label.label 商品分类
            .select-classify
              .s-c-box
                custom-select(v-model="firstState", :list="firstClassList", nameField="category_name", :validator="$v.firstState", error-info="请选择一级分类")
              .s-c-box
                custom-select(v-model="secondState", :list="secondClassList", nameField="category_name", :validator="$v.secondState", error-info="请选择二级分类", @input="selectSecond")
          .field.is-horizontal
            label.label 商品简述
            custom-textarea.textarea(placeholder="请输入该商品的详细描述", v-model="info.desc", :validator="$v.info.desc", error-info="商品描述不能大于100字",)
          .field.is-horizontal
            label.label 备注
            textarea.textarea(v-model="info.remark", maxlength=20, placeholder="请输入商品备注")
        .field-group
          .field.is-horizontal
            label.label 属性
            .control-box
              .control.controlcc(v-for="prop in propertyList")
                .switch
                  input(type="checkbox", :id="prop.attribute_id", v-model="prop.is_check")
                  label(:for="prop.attribute_id")
                .radio.service-status(v-text="prop.attribute_name")
        .field-group
          .field.is-horizontal
            label.label 参数
            .control
              .field.is-horizontal(v-for="prop in propertyList", v-if="prop.is_check")
                label.label(v-text="prop.attribute_name + ':'")
                .contentcc
                  .control.cc(v-for="param in prop.attribute_items")
                    .switch
                      input(type="checkbox", :id="param.attribute_item_id", v-model="param.is_check")
                      label(:for="param.attribute_item_id")
                    .radio.service-status(v-text="param.attribute_item_value")
        .field-group(v-if="info.sku_data && info.sku_data.length")
          .field.is-horizontal.width-100
            label.label SKU设置
            .control
              .sku-title.clearfix
                .title.fl SKU名称
                .title.fl SKU图
                .title.fl.width-160 SKU价格
                .title.fl.width-200.p-l-40 详情图
                .title.fl.width-80 操作
              .sku-box(v-for="(sku, index) in info.sku_data")
                .sku-txt(v-text="sku.value")
                .sku-img.width-150.m-r-0
                  upload-pic(v-model="sku.sku_pics[0]", :img-id="index", :default-img="defaultImgSrc", img-type="sku")
                .sku-price
                  custom-input(input-type="hasUnit",placeholder="请输入价格", v-model="sku.sell_price", :validator="$v.info.sku_data.$each[index].sell_price", error-info="请输入大于0小于99999的价格精确到小数点后2位", need-type="float")
                    span(slot="unitName") 元
                .sku-txt.width-200.p-l-40
                  .a-text.fl.m-r-20(v-show="!sku.isFlag", @click="openImage(index)") 上传
                  .a-text.fl.m-r-20(v-show="sku.isFlag", @click="toggleSidePannel(sku.content)") 查看
                  .a-text.fl.m-r-20(v-show="sku.isFlag", @click="delcontent(index)") 删除
                  <!--.a-text.fl.m-r-20 编辑-->
                .sku-txt.width-200
                  .simple-td
                    .switch
                      input(type="checkbox", :id="'display' + index", v-model="sku.is_selected", @change="displayConfirm(sku)")
                      label(:for="'display' + index")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="createData(1)") 保存
          a.button.primary.large(@click="createData(2)") 保存并上架
          a.button.large(@click="goBack") 取消

    select-image(v-model="openFlag", v-if="openFlag", @resolve="getImageArray", :index="currentIndex")
    slide-out-modal(v-if="slideVisible", :is-slim="true", @input="toggleSidePannel")
      image-detail(v-if="true", :current-image-array="currentArray")
</template>

<script>
import productServiceMixin from '@/mixins/modules/productService'
import fileUploader from '@/mixins/utilities/fileUploader'
import CustomSelect from '@/components/generics/form/CustomSelect'
import CustomInput from '@/components/generics/form/CustomInput'
import UploadPic from '@/components/generics/form/UploadPic'
import { validationMixin } from 'vuelidate'
import {required, between} from 'vuelidate/lib/validators'
import {priceFormat, wordLength} from '@/mixins/custom-validators/custom-validators'
import uploadImgModel from '@/components/basicInformation/modal/uploadImgModel'
import SelectImage from '@/components/generics/SelectImage'
import ImageDetail from '@/components/productService/ImageDetail'
import SlideOutModal from '@/components/generics/SlideOutModal'
import CustomTextarea from '@/components/generics/form/CustomTextarea'

/**
 * @author amujoe
 * @description 创建/编辑商品
 */
export default {
  name: 'productAdd',
  mixins: [validationMixin, fileUploader, productServiceMixin],
  components: {
    CustomInput,
    CustomSelect,
    UploadPic,
    uploadImgModel,
    SelectImage,
    ImageDetail,
    SlideOutModal,
    CustomTextarea,
  },
  data () {
    return {
      firstState: null,
      firstClassList: [],
      secondState: null,
      secondClassList: [],
      thirdState: null,
      thirdClassList: [],
      info: {
        product_id: '',
        product_name: '', // 商品名称
        brand_name: null, // 品牌
        category_id: '', // 分类
        product_pics: [], // 主图
        sku_data: [],
        remark: '',    // 备注
        desc: '',    // 商品描述
      },
      propertyList: [],
      defaultImgSrc: '',
      brandArr: [],
      brandSelected: null,
      openFlag: false,
      currentArray: [],
      slideVisible: false,
      custom_name: null,        // 自定义品牌
      isShowCustom: false,      // 是否显示自定义品牌
    }
  },
  computed: {
    getParams () {
      let skuData = JSON.parse(JSON.stringify(this.info.sku_data))
      skuData = skuData.map((item) => {
        item.sell_price = item.sell_price * 100
        if (!item.sku_pics[0]) { // 解决最后一个sku_pics=[""]的问题
          item.sku_pics = []
        }
        return item
      })
      let brandName = ''
      if (!this.isShowCustom) {
        brandName = this.brandSelected.brand_name
      } else if (this.isShowCustom) {
        brandName = this.custom_name.trim()
      }
      return {
        product_name: this.info.product_name,
        brand_name: brandName,
        category_id: this.secondState && this.secondState.category_id ? this.secondState.category_id : '',
        product_pics: this.info.product_pics,
        sku_data: skuData,
        remark: this.info.remark,
        desc: this.info.desc,
      }
    },
  },
  methods: {
    wordLength,
    // 是否显示自定义品牌
    noBrand () {
      this.isShowCustom = !this.isShowCustom
      this.firstState = null
      this.secondState = null
      this.custom_name = null
      this.brandSelected = null
    },
    // 重新选择品牌时分类项置空
    async resetSelected (q) {
      if (typeof q === 'string') {
        q = q.replace(/\s+/g, '')
        this.custom_name = q
      }
      this.brandSelected = q
      this.firstState = null
      this.secondState = null
    },
    // 获取分类数据
    async getClassifyList (parentId) {
      try {
        const {response, result} = await this.fetchCategory({
          type: 1,
          parent_id: parentId,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            // 根据返回的分类级别组装数据
            if (result.data.length <= 0) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取商品分类失败',
                content: '该分类下未创建子级分类',
              })
              return false
            }
            if (result.data[0].level === 1) {
              this.firstClassList = result.data
            } else if (result.data[0].level === 2) {
              this.secondClassList = result.data
            } else if (result.data[0].level === 3) {
              this.thirdClassList = result.data
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取商品分类失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品分类失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取商品分类失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 获取品牌数据
    async getBrand () {
      try {
        const {response, result} = await this.fetchBrand({
          is_page: 2,
        })
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取品牌列表失败',
              content: `${result.message}`,
            })
            return false
          }
          this.brandArr = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 关闭/开启SKU
    async displayConfirm (sku) {
      sku.is_enabled === 1 ? sku.is_enabled = 2 : sku.is_enabled = 1
    },
    // 获取商品属性数据--商品品牌
    async getAttribute (categoryId, isBrandId) {
      try {
        const {response, result} = await this.fetchAttribute({
          brand_id: isBrandId,
          category_id: categoryId,
        })
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取商品属性失败',
              content: `${result.message}`,
            })
            return false
          }
          if (result.data.length <= 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取商品属性失败',
              content: '该分类下未添加属性',
            })
          }
          this.propertyList = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品属性失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取商品属性失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 选择二级分类后，调用获取商品属性数据
    selectSecond (thirdState) {
      this.$v.$touch()
      if (!this.custom_name && this.isShowCustom) {
        return
      }
      let isBrandId = ''
      if (!this.isShowCustom) {
        isBrandId = this.brandSelected.brand_id
      } else if (this.isShowCustom) {
        isBrandId = 0
      }
      this.propertyList = []
      this.getAttribute(thirdState.category_id, isBrandId)
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
    // 删除图片
    deleteImage (url) {
      const index = this.info.product_pics.findIndex(val => val === url)
      this.info.product_pics.splice(index, 1)
    },
    // sku数量大于1时，格式化
    outputSKU (...props) {
      if (props.length > 1) {
        let [one, two, tempArr] = [props[0], props[1], []]
        for (let i = 0; i < one.length; i++) {
          for (let j = 0; j < two.length; j++) {
            let obj = {
              value: one[i].value + '-' + two[j].value,
              sell_price: '',
              attribute_item_ids: [],
              sku_pics: [], // 接口提交格式要求如此
              content: [],
              isEnabled: true,
              is_enabled: 1,
              isFlag: false,
            }
            let ooo = one[i]
            if (one[i].attribute_item_ids && one[i].attribute_item_ids.length) {
              obj.attribute_item_ids = [...ooo.attribute_item_ids]
              obj.attribute_item_ids.push(two[j].key)
            } else {
              obj.attribute_item_ids.push(one[i].key)
              obj.attribute_item_ids.push(two[j].key)
            }
            tempArr.push(obj)
          }
        }
        tempArr.forEach(function (e) {
          e.is_enabled === 1 ? e.is_selected = true : e.is_selected = false
        })
        props.splice(0, 2, tempArr)
        return this.outputSKU(...props)
      }
      return props[0]
    },
    // sku数量等于1时，格式化
    outputOnlySKU (...props) {
      let prp = props[0]
      let tempArr2 = []
      for (let k = 0; k < prp.length; k++) {
        let obj2 = {
          value: prp[k].value,
          sell_price: '',
          attribute_item_ids: [],
          sku_pics: [], // 接口提交格式要求如此
          content: [],
          isEnabled: true,
          is_enabled: 1, // 启用、禁用
          isFlag: false,
        }
        obj2.attribute_item_ids.push(prp[k].key)
        tempArr2.push(obj2)
      }
      tempArr2.forEach(function (e) {
        e.is_enabled === 1 ? e.is_selected = true : e.is_selected = false
      })
      return tempArr2
    },
    // 创建商品
    createData (status) {
      if (this.isLoading) {
        return false
      }
      this.$v.$touch()
      if (this.$v.info.product_name.$error || this.$v.firstState.$error || this.$v.secondState.$error || this.$v.info.desc.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        return
      }
      if (!this.isShowCustom && this.$v.brandSelected.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        return
      } else if (this.isShowCustom && this.$v.custom_name.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        return
      }
      if (this.info.product_pics.length <= 0) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请上传商品主图',
        })
        return
      }
      if (!this.info.sku_data) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 150)
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请至少选择一个属性',
        })
        return
      }
      if (this.info.sku_data.length <= 0) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 200)
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请选择参数',
        })
        return
      }
      let arr = this.info.sku_data.filter(ele => {
        if (ele.sell_price < 0) {
          return ele
        }
      })
      if (arr.length > 0) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 200)
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: 'SKU价格不能小于0',
        })
        return
      }
      // 添加商品
      this.commitData(status)
    },
    // 添加商品
    async commitData (status) {
      let categoryIds = []
      categoryIds.push(this.getParams.category_id)
      this.getParams.category_ids = categoryIds
      try {
        this.isLoading = true
        const {response, result} = await this.productCreate(this.getParams)
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '商品添加失败',
              content: `${result.message}`,
            })
            this.isLoading = false
            return false
          }
          if (status === 1) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '商品添加成功',
              resolve: () => {
                this.$router.push({
                  name: 'productList',
                })
              },
            })
          } else {
            this.setSellingState(result.data)
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '商品添加失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        console.error('保存商品', err)
      }
      this.isLoading = false
    },
    // 打开上传详情弹窗
    openImage (index) {
      this.openFlag = true
      this.currentIndex = index
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
      this.info.sku_data[index].isFlag = false
    },
    // 查看sku详情
    toggleSidePannel (imgs) {
      this.slideVisible = !this.slideVisible
      this.currentArray = imgs
    },
    // 修改启用、禁用状态值
    changeEnabled (flag) {
      flag.isEnabled ? flag.is_enabled = 1 : flag.is_enabled = 2
    },
    // 上架操作
    async setSellingState (param) {
      let params = {
        product_ids: [param.basic_spu_id],
        is_sale: 1,
      }
      try {
        const {response, result} = await this.productShelves(params)
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
              resolve: () => {
                this.$router.replace({
                  name: 'productEdit',
                  params: {
                    id: param.basic_spu_id,
                  },
                })
              },
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
  watch: {
    // 选择一级分类，赋值二级分类
    async firstState () {
      this.secondState = null
      this.thirdState = null
      this.secondClassList = []
      this.thirdClassList = []
      this.propertyList = []
      if (!this.firstState) {
        return
      }
      await this.getClassifyList(this.firstState.category_id)
    },
    propertyList: {
      handler: function (val) {
        let arrA = []
        val.forEach(item => {
          if (!item.is_check) {
            return false
          }
          let arrO = []
          item.attribute_items.forEach(prop => {
            if (!prop.is_check) {
              return false
            }
            let obj = {
              key: prop.attribute_item_id,
              value: prop.attribute_item_value,
            }
            arrO.push(obj)
          })
          arrA.push(arrO)
        })
        if (arrA.length === 1) {
          this.info.sku_data = this.outputOnlySKU(...arrA)
        } else {
          this.info.sku_data = this.outputSKU(...arrA)
        }
      },
      deep: true,
    },
  },
  validations: {
    custom_name: {
      required,
    },
    info: {
      product_name: {
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
      sku_data: {
        $each: {
          sell_price: {
            between: between(0.01, 99999),
            priceFormat,
          },
        },
      },
    },
    brandSelected: {
      required,
    },
    firstState: {
      required,
    },
    secondState: {
      required,
    },
  },
  mounted () {
    this.getClassifyList(0) // 获取分类数据
    this.getBrand() // 获取品牌数据
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';
.custom-brand {
  width: 197px !important
}
.no-brand {
  color: #2fabdd;
  text-decoration: underline;
  margin-left: 10px;
  cursor: pointer
}
.select-classify {
  display: flex;
  min-width 300px
  .s-c-box{
    width: 33.33%;
    padding-right: 10px
  }
}
.service-status {
  padding-left: 7px;
  font-size: 13px;
  color: darker;
}

.radio + .radio {
  margin-left: 28px;
}
.service-status {
  margin-right: 20px;
}
.image-wrapper
  display flex
  flex-direction row
  .upload-banner + .upload-banner
    margin-left 8px
.upload-pic
  width 88px
  height 88px
  margin-right 8px
.cus_imgs {
  display: flex;

  .img {
    margin-right: 5px;
  }
}

.sku-box {
  display: flex;
  align-items: center;
  margin-top: 20px;
  .sku-txt {
    width: 150px;
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
    width auto
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
.control-box
  display flex
  flex-wrap wrap
.controlcc
  margin-top 5px
</style>
