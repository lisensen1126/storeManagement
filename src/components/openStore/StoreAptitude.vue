<template lang="pug">
  .section-layout
    timer-shaft(:high-light="1")
    .content-wrapper
      open-store-title(title="门店资质")
      .form-wrapper
        .field-group
          .field.is-horizontal.w-all
            .tooltip-text 以下信息为用于智慧门店申请微信小程序&支付等用，平台将保证信息的保密性，请认真填写以免影响申请事宜。

        <!-- 营业执照 -->
        .field-group
          .field.is-horizontal
            label.label-title 营业执照
          .business-license
            .field.is-horizontal
              label.label
              .radio-wrapper
                .type-item
                  .radio
                    input(type="radio", id="groups", :value="202", v-model="qualification_data.license_type")
                    label(for="groups") 企业法人
                .type-item
                  .radio
                    input(type="radio", id="personal", :value="201", v-model="qualification_data.license_type")
                    label(for="personal") 个体工商户
            .field.is-horizontal.w-all
              label.label
              .text 营业执照上的主体类型一般为个体户、个体工商户、个体经营，选择“个体工商户”
            .field.is-horizontal.w-all
              label.label
              .text 营业执照上的主体类型一般为有限公司、有限责任公司，选择“企业法人”
            .field.is-horizontal.w-all
              label.label
              .el-icon-info.icon.text 请上传"营业执照"，需年检章齐全，当年注册除外
              .blue(@click="showModal") 查看"营业执照"样例
            .field.is-horizontal
              label.label 营业执照照片
              .image-wrapper
                .image-item
                  .upload-pic.image-item
                    up-meituan(img-type="1", v-model="qualification_data.license_url", :hasSecondAction="is_del", @id="licenseSuccess", img-id='1')
                  .tooltip-text 拍照营业执照清晰图片，上传图片小于2M
            .field.is-horizontal
              label.label 营业执照名称
              custom-input(placeholder="企业名称", v-model="qualification_data.license_name", :validator="$v.qualification_data.license_name", error-info="请输入营业执照名称")
            .field.is-horizontal(v-if="qualification_data.license_type === 201")
              label.label 
              .text 若营业执照上名称为空或为“无字号”，请填写“个体户+经营者姓名”，如“个体户张三”
            .field.is-horizontal
              label.label 营业执照注册号
              custom-input(placeholder="企业代码", v-model="qualification_data.license_code", :open-show-big="true", need-type='number_letter', maxlength="64",  :validator="$v.qualification_data.license_code", error-info="请输入营业执照注册号")
            .field.is-horizontal
              label.label 企业代码类型
              custom-select(v-model="license_code_type", :list="license_code_type_list", nameField="license_name", @input="handleSelect", :validator="$v.license_code_type", error-info="请选择企业代码类型")
            .field.is-horizontal
              label.label 营业执照额外类型
              .radio-wrapper
                .type-item
                  .radio
                    input(type="radio", id="yes", :value="1", v-model="qualification_data.license_extra_type")
                    label(for="yes") 已三证合一
                .type-item
                  .radio
                    input(type="radio", id="no", :value="2", v-model="qualification_data.license_extra_type")
                    label(for="no") 未三证合一
            .field.is-horizontal.w-all
              label.label
              .text 若营业执照注册号为18位统一社会信用代码，请选择“已三证合一”，否则请选择“未三证合一”
            .field.is-horizontal
              label.label 营业注册地址
              custom-input(placeholder="注册地址", v-model="qualification_data.license_address", :validator="$v.qualification_data.license_address", error-info="请输入营业注册地址")
            .field.is-horizontal
              label.label 经营者姓名/法定代表人
              custom-input(placeholder="经营者姓名/法定代表人", v-model="qualification_data.legal_person", :validator="$v.qualification_data.legal_person", error-info="请输入经营者姓名/法定代表人")
            .field.is-horizontal
              label.label 营业期限 
              date-picker(type="single", placeholder="选择开始时间", v-model="qualification_data.license_start_time",:validator="$v.qualification_data.license_start_time", error-info="请选择开始时间")
              .middle 至
              date-picker(type="single", placeholder="选择截止时间", v-model="qualification_data.license_expired_time")
            .field.is-horizontal.w-all
              label.label
              .text 开始时间为必填项, 截止时间为空代表永久

        <!-- 法人身份信息 -->
        .field-group
          .field.is-horizontal
            label.label-title 法人身份信息（限中国大陆居民) 
          .identity-info
            .field.is-horizontal.w-all.m-t-24(v-if="qualification_data.legal_person")
              label.label
              .el-icon-info.icon.text 请上传法人“
                span.tooltip-text {{qualification_data.legal_person}}
                span ”的身份证（即与营业执照上的经营者/法人姓名相同的身份证件）
            .field.is-horizontal.w-all
              label.label 身份证照片
              .image-wrapper
                .image-item.m-r-70.column
                  .upload-pic
                    up-meituan(img-type="2", v-model="qualification_data.legal_person_id_front", :hasSecondAction="is_del", img-id='2', @result="legalFrontSuccess")
                  .text 身份证人像面照片
                .image-item.column
                  .upload-pic
                    up-meituan(img-type="3", v-model="qualification_data.legal_person_id_back", :hasSecondAction="is_del", img-id='3', @result="legalBackSuccess")
                  .text 身份证国徽面照片
                .image-item
                  .tooltip-text 上传图片均需小于8M
            .field.is-horizontal
              label.label 身份证姓名
              custom-input(placeholder="身份证姓名", v-model="legal_person", :validator="$v.legal_person", error-info="请输入身份证姓名")
            .field.is-horizontal
              label.label 身份证号码
              custom-input(placeholder="身份证号码", v-model="qualification_data.legal_person_id_no", :open-show-big="true", :validator="$v.qualification_data.legal_person_id_no", error-info="请输入身份证号码")
            .field.is-horizontal
              label.label 法人微信号
              custom-input(placeholder="请输入以上身份证号对应的法人微信号", v-model="qualification_data.legal_person_weixin", :validator="$v.qualification_data.legal_person_weixin", error-info="请输入法人微信号")
            .field.is-horizontal
              label.label 
              .text 法人微信号为后续快速注册法人人脸识别认证小程序时，微信下发消息通知到法人微信模板消息用。
            .field.is-horizontal.m-t-10
              label.label 
              .tooltip-text 法人微信号必须绑定法人账户银行卡。
      .btn-wrapper
        .button-group
          a.button.large(@click="skip") 跳过      
          a.button.primary.large(@click="goNext") 下一步
    account-reference(v-if="is_open_reference", :imgUrl="imgUrl", @close="closeModal")
</template>

<script>
import TimerShaft from '@/components/openStore/modal/TimerShaft'
import UpMeituan from '@/components/openStore/modal/UpMeituanImage'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import DatePicker from '@/components/generics/form/DatePicker'
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import AccountReference from '@/components/openStore/modal/AccountReference'
import Api from '@/mixins/modules/OpenStore'
import Utils from '@/mixins/utilities/utils'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'storeAptitude',
  mixins: [Api, Utils, validationMixin],
  components: {
    TimerShaft,
    UpMeituan,
    CustomInput,
    CustomSelect,
    DatePicker,
    OpenStoreTitle,
    AccountReference,
  },
  validations: {
    qualification_data: {
      license_name: {
        required,
      },
      license_code: {
        required,
      },
      license_address: {
        required,
      },
      legal_person: {
        required,
      },
      legal_person_id_no: {
        required,
      },
      legal_person_weixin: {
        required,
      },
      license_start_time: {
        required,
      },
    },
    license_code_type: {
      required,
    },
    legal_person: {
      required,
    },
  },
  data () {
    return {
      is_del: false, // 是否可以删除图片
      legal_person: '', // 身份证姓名
      is_open_reference: false,
      imgUrl: 'https://oss1.chedianai.com/images/assets/example-img.png',
      qualification_data: { // 门店资质数据
        license_url: '', // 营业执照图片URL
        license_meituan_url: '', // 营业执照美团图片URL
        license_code_type: 0, // 企业代码类型: 1.统一社会信用代码（18位）,2.组织机构代码（9位）,3.营业执照注册号（15位）
        license_code: '', // 企业代码
        license_type: 202, // 企业执照类型：201：个体工商户营业执照，202：企业法人营业执照
        license_extra_type: 0, // 企业执照额外类型：1：三证合一，2：未三证合一
        license_name: '', // 企业执照名称
        license_address: '', // 企业执照注册地址
        license_expired_type: 3, // 截止日期类型：0: 永久，1: 选择截止日期
        license_start_time: '', // 开始时间
        license_expired_time: '', // 截止日期Unix时间戳
        legal_person: '', // 经营者姓名/法定代表人
        legal_person_id_no: '', // 法定代表人证件身份证号码
        legal_person_weixin: '', // 法定代表人微信号
        legal_person_id_front: '', // 法定代表人身份证正面图片URL
        legal_person_id_back: '', // 法定代表人身份证反面图片URL
        legal_person_id_front_meituan: '', // 法定代表人身份证正面美团图片URL
        legal_person_id_back_meituan: '', // 法定代表人身份证反面美团图片URL
      },
      submit_data: {},
      license_code_type_list: [ // 企业代码类型列表
        {
          license_name: '统一社会信用代码（18位）',
          value: '1',
        },
        {
          license_name: '组织机构代码（9位）',
          value: '2',
        },
        {
          license_name: '营业执照注册号（15位）',
          value: '3',
        },
      ],
      license_code_type: {},
    }
  },
  methods: {
    // 展示"营业执照"样例
    showModal () {
      this.is_open_reference = true
    },
    // 关闭"营业执照"样例
    closeModal () {
      this.is_open_reference = false
    },
    /**
     * 营业执照上传成功的回调
     * @param 营业执照数据
     */
    licenseSuccess (param) {
      this.successFun(param, 1)
    },
    /**
     * 身份证正面上传成功的回调
     * @param 身份证数据
     */
    legalFrontSuccess (param) {
      this.successFun(param, 2)
    },
    /**
     * 身份证正面上传成功的回调
     * @param 身份证数据
     */
    legalBackSuccess (param) {
      this.successFun(param, 3)
    },
    /**
     * 上传成功的回调
     * @param ocr返回的数据
     * @typr 上传的类型(1: 营业执照, 2: 身份证正面, 3: 身份证反面)
     */
    async successFun (param, type) {
      if (Object.keys(param).length > 0 && param instanceof Object) {
        if (type === 1) {
          for (let key in param.ocr) {
            if (this.qualification_data.hasOwnProperty(key)) {
              this.qualification_data[key] = param.ocr[key]
            }
          }

          this.qualification_data.license_url = param.local.url
          this.qualification_data.license_meituan_url = param.meituan.encrypt_id
          this.qualification_data.license_start_time = this.changeDateTime(param.ocr.license_start_time)
          this.qualification_data.license_expired_time = this.changeDateTime(param.ocr.license_expired_time)

          await this.judgeExpiredType()
          await this.licenseCodeType()

          if (this.legal_person !== '' && this.qualification_data.legal_person !== this.legal_person) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '提示',
              content: '请上传与身份证件持有人姓名相同的营业执照',
            })
          }
        } else if (type === 2) {
          this.legal_person = param.ocr.legal_person
          this.qualification_data.legal_person_id_no = param.ocr.legal_person_id_no
          this.qualification_data.legal_person_id_front = param.local.url
          this.qualification_data.legal_person_id_front_meituan = param.meituan.url

          if (this.qualification_data.legal_person !== '' && this.qualification_data.legal_person !== this.legal_person) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '提示',
              content: '请上传与营业执照上的经营者/法人姓名相同的身份证件',
            })
          }
        } else {
          this.qualification_data.legal_person_id_back = param.local.url
          this.qualification_data.legal_person_id_back_meituan = param.meituan.url
        }
      }
    },
    /**
     * 选择企业代码类型
     * @type 企业代码类型
     */
    handleSelect (type) {
      if (type.value === '0') {
        this.qualification_data.license_extra_type = ''
      } else if (type.value === '1') {
        this.qualification_data.license_extra_type = 1
      } else {
        this.qualification_data.license_extra_type = 2
      }
    },
    // 保存资质信息
    goNext () {
      if (!this.qualification_data.license_url) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请上传营业执照照片',
        })
        return
      }
      if (!this.qualification_data.legal_person_id_front || !this.qualification_data.legal_person_id_back) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请上传身份证正反面照片',
        })
        return
      }
      if (this.qualification_data.legal_person !== '' && this.legal_person !== '' && this.qualification_data.legal_person !== this.legal_person) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '营业执照法人姓名与身份证件姓名必须一致',
        })
        return
      }
      if (!this.qualification_data.license_type) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请选择营业执照类型',
        })
        return
      }
      if (!this.qualification_data.license_extra_type) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请选择营业执照额外类型',
        })
        return
      }
      this.$v.$touch()
      if (this.$v.$error) {
        return false
      }
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '确认提交门店资质信息？',
        isRejectable: 1,
        resolve: () => {
          this.setQualification()
        },
      })
    },
    // 提交
    async setQualification () {
      for (let key in this.qualification_data) {
        if (this.submit_data.hasOwnProperty(key)) {
          this.submit_data[key] = this.qualification_data[key]
        }
      }
      if (this.license_code_type.value !== undefined) {
        this.submit_data.license_code_type = this.license_code_type.value - 0
      }
      this.submit_data.license_start_time = this.timeStamp(this.submit_data.license_start_time)
      this.submit_data.license_expired_time = this.timeStamp(this.submit_data.license_expired_time) ? this.timeStamp(this.submit_data.license_expired_time) : 0
      if (this.submit_data.license_expired_time) { // 截止日期类型：0: 永久，1: 选择截止日期
        this.submit_data.license_expired_type = 1
      } else if (!this.submit_data.license_expired_time) {
        this.submit_data.license_expired_type = 0
      }
      try {
        let { response, result } = await this.setQualificationApi(this.submit_data)
        if (response.status === 200 && result.code === 0) {
          this.$router.replace({
            name: 'miniProgramFirst',
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '设置门店资质信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '设置门店资质信息失败',
          content: `错误: ${err}`,
        })
      }
    },
    // 跳过
    async skip () {
      try {
        let { response, result } = await this.setQualificationApi()
        if (response.status === 200 && result.code === 0) {
          this.$router.replace({
            name: 'miniProgramFirst',
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '设置门店资质信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '设置门店资质信息失败',
          content: `错误: ${err}`,
        })
      }
    },
    // 判断营业期限
    judgeExpiredType () {
      if (this.qualification_data.license_expired_time === '') {
        this.qualification_data.license_expired_time = ''
        this.qualification_data.license_expired_type = 0
      } else {
        this.qualification_data.license_expired_type = 1
      }
    },
    // 获取资质信息
    async getQualification () {
      try {
        let { response, result } = await this.getQualificationApi()
        if (response.status === 200 && result.code === 0) {
          if (!(result.data instanceof Array)) {
            result.data.license_start_time = this.changeDateTime(result.data.license_start_time)
            result.data.license_expired_time = this.changeDateTime(result.data.license_expired_time)
            this.qualification_data = result.data
            this.legal_person = this.qualification_data.legal_person

            await this.judgeExpiredType()
            await this.licenseCodeType()
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店资质信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取门店资质信息失败',
          content: `错误: ${err}`,
        })
      }
    },
    // 判断企业代码类型 & 营业执照类型
    licenseCodeType () {
      if (this.qualification_data.license_code.length === 18) {
        this.qualification_data.license_extra_type = 1
        this.license_code_type = {
          license_name: '统一社会信用代码（18位）',
          value: '1',
        }
      } else if (this.qualification_data.license_code.length === 9) {
        this.qualification_data.license_extra_type = 2
        this.license_code_type = {
          license_name: '组织机构代码（9位）',
          value: '2',
        }
      } else if (this.qualification_data.license_code.length === 15) {
        this.qualification_data.license_extra_type = 2
        this.license_code_type = {
          license_name: '营业执照注册号（15位）',
          value: '3',
        }
      }
    },
  },
  mounted () {
    this.$store.dispatch('syncAuthorizeStatus')
    this.submit_data = JSON.parse(JSON.stringify(this.qualification_data))
    this.getQualification() // 获取门店资质信息
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.section-layout
  height calc(100% - 56px)
  overflow-y auto
.content-wrapper
  height calc(100% - 106px)
.el-icon-info::before
  padding-right 5px
.form-wrapper
  .w-all
    width 100%
.middle 
  margin 0 12px
  font-size 13px
.upload-pic
  width 88px
  height 88px
.field-group .field.m-t-10
  margin-top 10px
.blue
  margin-left 10px
  font-size 12px
  color blue
  cursor pointer
.label-title
  font-size 15px
  font-weight bold
  border-left 3px solid #ffbb29
  padding-left 6px
  position relative
  left -9px
  line-height 1
.custom-select
  width 300px
.image-wrapper
  display flex
  align-items center
  .image-item
    display flex
    align-items center
    margin-right 20px
    .text
      margin-top 10px
  .column
    flex-direction column
  .m-r-70
    margin-right 70px
.tooltip-text
  font-size 12px
  color #FF0000
.text
  font-size 12px
  line-height 12px
  color #999
  white-space nowrap
.icon.text
  color #333
.radio-wrapper
  display flex
  justify-content start
  .type-item
    display inline-block
    width 100px
.identity-info
  .field:first-child
    margin-top 24px
</style>