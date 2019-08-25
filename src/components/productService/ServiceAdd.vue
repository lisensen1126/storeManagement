<template lang="pug">
  .section-layout
    .content-wrapper
      h2 添加服务
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 服务名称
            custom-input(v-model="item.name", input-type="hasCount", placeholder="请输入服务名称", :validator="$v.item.name", error-info="服务名称必填并且小于二十位", :is-disabled="isLoading")
              span(slot="countInfo") {{wordLength(item.name)}}/20
          .field.is-horizontal
            label.label 服务品牌
            .custom-brand
              custom-select(v-model="item.brandSelected", :list="brandArr", placeholder="请选择服务品牌", nameField="brand_name", :show-search="true")
          .field.is-horizontal
            label.label 服务图示
            .control.upLoad-image
              upload-pic(v-model="item.pic", :need-default="false", :is-disabled="isLoading", img-type="item")
          .field.is-horizontal
            label.label 服务分类
            custom-select.custom-select-commodity(v-model="firstState", @input="firstStateChange", :validator="$v.firstState", error-info="分类服务不能为空", nameField="category_name", :list="firstClassList")
            custom-select.custom-select-commodity(v-model="secondState", @input="secondStateChange", :validator="$v.secondState", error-info="分类服务不能为空", nameField="category_name", :list="secondClassList")
          .field.is-horizontal
            label.label 服务简述
            .control(:class="{'disabled': isLoading}")
              custom-textarea.textarea(placeholder="请输入该服务的详细描述", v-model="item.desc", :validator="$v.item.desc", error-info="服务简述不能大于100字", :is-disabled="isLoading")
          .field.is-horizontal
            label.label 备注
            textarea.textarea(v-model="item.remark", maxlength=20, placeholder="请输入服务备注")
          .field.is-horizontal
            label.label 服务价格
            .control
              custom-input.package-price(input-type="hasUnit", :is-disabled="isLoading", v-model="item.mini_price", need-type="float", :validator="$v.item.mini_price", error-info="请输入大于0小于99999的价格精确到小数点后2位")
                span(slot="unitName") 元
          .field.is-horizontal
            label.label 服务详情
            .control.image-wrapper
              .upload-pic(v-for="(cell, index) in item.content")
                upload-img-model(v-model="item.content[index]", img-type="item", :has-second-action="true", @other="deleteImage", need-move="2", @leftMove="leftPic('item', index)", @rightMove="rightPic('item',index)", :need-left="index !== 0", :need-right="index !== (item.content.length -1)")
              .upload-pic
                upload-img-model(v-model="item.content[item.content.length]", img-type="item", :has-second-action="true", @other="deleteImage")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData(1)", :class="{'disabled': isLoading}") 保存
          a.button.primary.large(@click="inspectData(2)", :class="{'disabled': isLoading}") 保存并上架
          a.button.large(@click="goBack") 返回
</template>

<script>
import productServiceMixin from '@/mixins/modules/productService'
import {wordLength, priceFormat} from '@/mixins/custom-validators/custom-validators'
import fileUploader from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomTextarea from '@/components/generics/form/CustomTextarea'
import CustomSelect from '@/components/generics/form/CustomSelect'
import RichEditor from '@/components/generics/form/RichEditor'
import UploadPic from '@/components/generics/form/UploadPic'
import {validationMixin} from 'vuelidate'
import {required, between} from 'vuelidate/lib/validators'
import uploadImgModel from '@/components/basicInformation/modal/uploadImgModel'
import MathFun from '@/mixins/utilities/math'
export default {
  name: 'serviceAdd',
  mixins: [validationMixin, productServiceMixin, fileUploader, MathFun],
  components: {
    CustomInput,
    UploadPic,
    RichEditor,
    CustomSelect,
    CustomTextarea,
    uploadImgModel,
  },
  data () {
    return {
      isLoading: false,
      categoryList: [],
      // 选中一级分类
      firstState: null,
      // 一级分类列表
      firstClassList: [],
      // 选中的二级分类
      secondState: null,
      // 二级分类列表
      secondClassList: [],
      item: {
        name: '', // 名称
        category: null, // 分类
        desc: '', // 服务简述
        pic: '', // 服务图示
        mini_price: '', // 服务价格
        content: [], // 特色服务
        brandSelected: {}, // 品牌名称
        remark: '',    // 备注
      },
      brandArr: [], // 品牌列表
    }
  },
  computed: {
    getParams () {
      let params = {
        name: this.item.name,
        category_id: this.secondState.category_id,
        mini_price: this.item.mini_price ? parseFloat(this.accMul(this.item.mini_price, 100)).toFixed(2) : 0,
        content: this.item.content,
        pic: this.item.pic,
        desc: this.item.desc,
        remark: this.item.remark,
      }
      if (this.item.brandSelected) {
        params.brand_id = this.item.brandSelected.brand_id
      }
      return params
    },
  },
  methods: {
    wordLength,
    // 向左
    leftPic (type, index) {
      let list = this.item.content
      this.item.content = []
      let now = list[index]
      let left = list[index - 1]
      list[index] = left
      list[index - 1] = now
      this.item.content = list
    },
    // 向右
    rightPic (type, index) {
      let list = this.item.content
      this.item.content = []
      let now = list[index]
      let left = list[index + 1]
      list[index] = left
      list[index + 1] = now
      this.item.content = list
    },
    // 删除图片
    deleteImage (url) {
      const index = this.item.content.findIndex(val => val === url)
      this.item.content.splice(index, 1)
    },
    // 返回操作
    goBack () {
      if (this.isLoading) {
        return
      }
      this.$router.push({
        name: 'serviceList',
        query: {
          save: 1,
        },
      })
    },
    // 选择一级分类，赋值二级分类
    firstStateChange () {
      if (this.firstState.category_id) {
        // 一级分类更改，二级三级分类初始化
        this.secondClassList = []
        this.item.category = {}
        this.getClassifyList(this.firstState.category_id, 2)
      }
    },
    // 选择二级分类
    secondStateChange () {
    },
    // 分类列表
    async getClassifyList (parentId) {
      try {
        let {response, result} = await this.fetchCategory({
          type: 2,
          parent_id: parentId,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            if (result.data.length > 0) {
              if (result.data[0].level === 1) {
                this.firstClassList = result.data
              } else if (result.data[0].level === 2) {
                this.secondClassList = result.data
              } else {
                this.thirdClassList = result.data
              }
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取服务分类失败',
              content: `出错啦！${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务分类失败',
            content: '获取服务分类发生错误，请稍后再试',
          })
        }
      } catch ({response, result}) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取服务分类失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
    // 获取品牌列表数据
    async getBrand () {
      try {
        const {response, result} = await this.fetchBrand({
          is_page: 2,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.brandArr = result.data
            this.brandArr.unshift({
              brand_name: '请选择服务品牌',
              brand_id: 0,
              brand_logo: '',
              content: '',
              english_name: '',
              source_type: 2,
            })
            this.item.brandSelected = this.brandArr[0]
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取品牌列表失败',
              content: `出错啦！${result.message}`,
            })
          }
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
    // 点击添加服务操作
    inspectData (state) {
      if (this.isLoading) {
        return false
      }
      this.$v.$touch()
      if (this.$v.firstState.$error || this.$v.secondState.$error || this.$v.item.desc.$error || this.$v.item.name.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        return
      }
      if (!this.item.pic) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请上传服务图示',
        })
        return
      }
      // 添加服务
      this.commitData(state)
    },
    // 添加服务
    async commitData (state) {
      try {
        this.isLoading = true
        const {response, result} = await this.serviceCreate(this.getParams)
        if (response.status === 200) {
          if (result.code === 0) {
            if (state === 1) {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '成功',
                content: '服务添加成功',
                resolve: () => {
                  this.$router.replace({
                    name: 'serviceList',
                  })
                },
              })
            } else {
              this.setSellingState(result.data)
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '服务添加失败',
              content: `出错啦！${result.message}`,
            })
            this.isLoading = false
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '服务添加失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '服务添加失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isLoading = false
    },

    // 上架操作
    async setSellingState (param) {
      try {
        const {response, result} = await this.serviceShelves(param.basic_spu_id)
        if (response.status === 200 && result.code === 0) {
          if (result.code === 1006) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '上架失败',
              content: '失败原因：服务信息不完整',
              resolve: () => {
                this.$router.replace({
                  name: 'serviceEdit',
                  params: {
                    id: param.basic_spu_id,
                    isEdit: 1,
                  },
                })
              },
            })
          }
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '服务上下架操作成功',
              resolve: () => {
                this.$router.replace({
                  name: 'serviceList',
                })
              },
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '温馨提示',
            content: result.message,
          })
        }
      } catch (err) {
        console.error('上下架接口', err)
      }
    },
  },
  validations: {
    firstState: {
      required,
    },
    secondState: {
      required,
    },
    item: {
      desc: {
        validate (val) {
          return val.length <= 100
        },
      },
      mini_price: {
        required,
        between: between(0.01, 99999),
        priceFormat,
      },
      name: {
        required,
        validate (val) {
          return this.wordLength(val) <= 20
        },
      },
    },
  },
  mounted () {
    this.getClassifyList(0)
    this.getBrand() // 获取品牌数据

    // this.getServiceCategory() // 获取服务分类数据
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.picture-description
  font-size 12px
  line-height 16px
  color lightGrey
  white-space nowrap
  margin-top 8px
.rich-eidtor-description
  margin-bottom 8px
.custom-select-commodity
  margin-right 20px
.field-content
  font-size: 13px
  line-height: 16px
  color: #353535
.image-wrapper
  .upload-banner + .upload-banner
    margin-left 8px
.upload-pic
  display inline-block
  margin-top 4px
  width 88px
  height 88px
  margin-right 8px
.cus_imgs {
  display: flex;

  .img {
    margin-right: 5px;
  }
}
</style>
