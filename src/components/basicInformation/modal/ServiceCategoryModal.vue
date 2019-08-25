<!--选择品牌馆弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 修改服务类目
        .close-button(@click="modalClose")
      .modal-body
        .form-wrapper
          .field-group
            .field.is-horizontal
              label.label 服务类目
              custom-select(v-model="first_category", :list="first_category_list", @input="changeFirstCategory", :validator="$v.first_category", error-info="请选择", :show-search="true")
              custom-select.m-l-10(v-model="second_category", :list="second_category_list", @input="changeSecondCategory", :validator="$v.second_category", error-info="请选择", :show-search="true")
            .field.is-horizontal(v-if="sensitive_type")
              label.label 营业执照照片
              .image-wrapper
                .upload-pic
                  up-meituan(img-type="6", v-model="license_url", :hasSecondAction="is_del", @result="licenseSuccess", img-id='1', ref="upMeituan")
                .tooltip-text 上传原件或复印件，复印件务必加盖公司公章文件格式为jpg、jpeg或png，文件大小不超过5M。
      .modal-footer.level
        .level-left
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(@click="complete") 修改
</template>

<script>
import ModalInteractions from '@/mixins/utilities/modalInteractions'
import ModalDialog from '@/components/generics/ModalDialog'
import CustomSelect from '@/components/generics/form/CustomSelect'
import UpMeituan from '@/components/openStore/modal/UpMeituanImage'
import Api from '@/mixins/modules/OpenStore'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'serviceCategoryModal',
  components: {
    ModalDialog,
    CustomSelect,
    UpMeituan,
  },
  mixins: [ModalInteractions, validationMixin, Api],
  props: {
    licenseUrl: {
      type: String,
    },
  },
  validations: {
    first_category: { required },
    second_category: { required },
  },
  data () {
    return {
      is_del: false,
      license_url: '', // 上传图片url
      sensitive_type: 0, // 0或者1 sensitive_type=1：在申请类目时需要上传相关证件
      first_category_list: [], // 一级类目列表
      first_category: {}, // 一级类目
      second_category_list: [], // 二级类目列表
      second_category: {}, // 二级类目
    }
  },
  methods: {
    complete () {
      this.$v.$touch()
      if (this.$v.$error) {
        return false
      }
      if (!this.license_url && this.sensitive_type) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请上传营业执照',
        })
        return
      }
      let params = {
        category_first_id: this.first_category.category_id,
        category_second_id: this.second_category.category_id,
        license_url: this.license_url,
      }
      this.$emit('resolve', params)
    },
    /**
     * 营业执照上传成功的回调
     * @param 营业执照数据
     */
    licenseSuccess (param) {
      this.license_url = param.local.url
    },
    /*
    * 获取服务类目
    *  @level 类目
    * */
    async getMerchantCategory (level) {
      let params = {
        level: level,
      }
      if (level === 2) {
        params.father = this.first_category.category_id
      }
      try {
        const { response, result } = await this.merchantCategoryApi(params)
        if (response.status === 200 && result.code === 0) {
          if (level === 1) {
            this.first_category_list = result.data
          }
          if (level === 2) {
            this.second_category_list = result.data
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务类目列表失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取服务类目列表失败',
          content: `错误：${err}`,
        })
      }
    },
    /*
     *  改变服务类目
     *  q 一级类目
     * */
    changeFirstCategory (q) {
      this.first_category = q
      this.second_category = {}
      this.getMerchantCategory(2)
    },
    /*
   *  改变服务类目
   *  q 二级类目
   * */
    changeSecondCategory (q) {
      this.second_category = q
      this.sensitive_type = this.second_category.sensitive_type
    },
  },
  mounted () {
    this.getMerchantCategory(1)
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.red
  color #FE0000
.blur
  color #0000FF
.m-l-10
  margin-left 10px
.upload-pic
  width 88px
  height 88px
.image-wrapper
  .tooltip-text
    margin-top 15px
    font-size 12px
    line-height 14px
.modal-header
  padding 20px 24px
.modal-footer
  padding 12px 16px
.modal-body
  padding 20px
  min-height 110px
  line-height 22px
  font-size 15px
  color #888
.text
  font-size 12px
  color #999
</style>

