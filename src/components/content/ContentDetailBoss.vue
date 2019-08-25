<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 内容编辑
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 名称
            .con(v-text="info.title")
          .field.is-horizontal
            label.label 品牌
            .con(v-text="info.brand_name")
          .field.is-horizontal
            label.label 封面图
            .img
              img(:src="info.cover")
          .field.is-horizontal
            label.label 内容简介
            .con(v-text="info.description")
          .field.is-horizontal
            label.label 内容
            .control
              rich-editor(v-model="info.content", ref="editor", :is-disabled="is_disabled")
          .field.is-horizontal.long-field(v-if='info.product && info.product.length !== 0')
            label.label 关联商品
            .content
              .goods-item(v-for='item in info.product')
                .img 
                  img(:src='item.product_pic')
                .pro-name {{item.product_name}}
          .field.is-horizontal.long-field(v-if='info.upkeep && info.upkeep.length !== 0')
            label.label 关联养护卡
            .content
              .goods-item(v-for='item in info.upkeep')
                .img 
                  img(:src='item.image_url')
                .pro-name {{item.name}}
                //- .delete-btn(@click='deletePro(item.product_id)') 删除
</template>

<script>
import Api from '@/mixins/modules/Content'
import upLoadApi from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import UploadPic from '@/components/generics/form/UploadPic'
import RichEditor from '@/components/generics/form/RichEditor'
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import Utils from '@/mixins/utilities/utils'

/**
 * @vue
 */
export default {
  name: 'ContentCreate',
  mixins: [validationMixin, Api, upLoadApi, Utils],
  components: {
    CustomInput,
    CustomSelect,
    UploadPic,
    RichEditor,
  },
  data () {
    return {
      info: {
        id: '',
        title: '',
        brand_id: '',
        brand_name: '',
        cover: '',
        description: '',
        content: '',
      },
      is_disabled: true,
      brand: null,
      brand_list: [],
    }
  },
  computed: {
  },
  watch: {
    brand: function (val) {
      this.info.brand_id = val.brand_id
      this.info.brand_name = val.brand_name
    },
  },
  methods: {
    // 返回
    goBack () {
      this.$router.push({
        name: 'contentListBoss',
        query: {
          save: 1,
        },
      })
    },
    // 获取品牌列表
    async getBrandList () {
      try {
        const {response, result} = await this.BrandListApi({
          page: '1',
          per_page: '9999',
          is_page: 1,
        })
        if (response.status === 200) {
          this.brand_list = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌列表失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 获取详情
    async getInfo () {
      try {
        const {response, result} = await this.ContentDetailApi({
          id: this.info.id,
        })
        if (response.status === 200) {
          this.info = result.data
          this.brand = {
            brand_id: result.data.brand_id,
            brand_name: result.data.brand_name,
          }
          this.$refs.editor.info(result.data.content)
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取详情出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌列表失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 验证数据
    validateData () {
      let _this = this
      let pass = true
      if (!_this.info.brand_id) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: ' 品牌不能为空',
        })
        pass = false
        return pass
      }
      if (!_this.info.cover) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '封面图不能为空',
        })
        pass = false
        return pass
      }
      if (!_this.info.description) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '内容描述不能为空',
        })
        pass = false
        return pass
      }
      if (!_this.info.content) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '内容不能为空',
        })
        pass = false
        return pass
      }
      return pass
    },
    // 保存数据
    async saveData () {
      let _this = this
      _this.$v.$touch()
      if (_this.$v.$error) return

      // 验证数据
      let res = this.validateData()
      if (!res) {
        return false
      }

      try {
        const {response, result} = await _this.ContentUpdateApi(_this.info)
        if (response.status === 200) {
          if (result.code === 0) {
            _this.goBack()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存内容出错',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存内容出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '保存内容出错',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
  },
  mounted () {
    this.info.id = this.$route.query.id
    this.getInfo()
  },
  validations: {
    info: {
      title: {
        required,
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.nav-back-btn
  position absolute
  top 36px
  left 16px
  width 32px
  height 32px
  border-radius 100%
  background #CED3DC center no-repeat url('~@/assets/back.svg')
  background-size 16px
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
  cursor pointer
  z-index 2
label.label
  font-size 13px
.upload-pic
  width 88px
  height 88px
  margin-right 8px
.img
  img
    width: 100px
    height: 100px
.form-wrapper, .field-group
  border-bottom: none
.long-field
  width 750px !important
.goods-item
  border: 1px solid #c2c2c2
  padding 8px 10px
  border-radius 5px
  float left 
  margin-right 15px
  display flex
  justify-content space-between
  align-items center
  width 300px
  margin-bottom 10px
  .img
    width 50px
    height 50px
    img
      width 100%
      height 100%
  .pro-name
    font-size 13px
    width 210px
    color #333
  .delete-btn
    font-size 13px
    color red
</style>
