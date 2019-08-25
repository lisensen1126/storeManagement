<template lang="pug">
  .section-layout
    timer-shaft(:high-light="6", :status="miniStatus")
    .content-wrapper
      open-store-title(title="支付申请三：支付配置申请")
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label-title 账户信息
          .field.is-horizontal
            label.label 门店简称
            .field-content {{merchant_name}}
          .field.is-horizontal
            label.label 账户类型
            .radio-wrapper(v-if="acctype === 1")
              .type-item
                .radio
                  input(type="radio",id="personal", name="type2", :value="1", v-model="acctype")
                  label(for="personal") 企业账户
            .radio-wrapper(v-if="acctype === 2")
              .type-item
                .radio
                  input(type="radio",id="enter", name="type2", :value="2", v-model="acctype")
                  label(for="enter") 法人个人账户
          .field.is-horizontal
            label.label 支付费率
            .field-content {{wx_rate / 100}} %
          .field.is-horizontal
            label.label 开户支行
            .field-content {{bank_card.branchName}}
          .field.is-horizontal
            label.label 银行卡号
            .field-content {{bank_card.cardno}}
          .field.is-horizontal
            label.label 账户名称
            .field-content {{bank_card.name}}
          .field.is-horizontal
            label.label 账户联系人
            .field-content {{bank_card.contactPerson}}
          .field.is-horizontal
            label.label 账户联系电话
            .field-content {{bank_card.contactPhone}}
          .field.is-horizontal
            label.label-title 营业执照
          .field.is-horizontal
              label.label 营业执照类型
              .radio-wrapper
                .type-item
                  .radio
                    input(type="radio", id="enterprise", name="type", :value="202", v-model="license_type")
                    label.sepcific-setting(for="enterprise") 企业法人营业执照
                .type-item
                  .radio
                    input(type="radio", id="per", name="type", :value="201", v-model="license_type")
                    label.sepcific-setting(for="per") 个体工商户营业执照
          .field.is-horizontal
            label.label 营业执照照片
            .image-wrapper
              .image-item
                .upload-pic
                  up-meituan(img-type="1", v-model="license_pic", :hasSecondAction="is_del", @id="licenseSuccess", img-id='1')
              .image-item
                .tooltip-text 拍照营业执照清晰图片，上传图片小于2M
          .field.is-horizontal
            label.label 营业执照名称
            custom-input(v-model="license_name", placeholder="请输入营业执照名称", error-info="请输入营业执照名称", maxlength="32", :validator="$v.license_name")
          .field.is-horizontal.w-all(v-if="license_type === 201")
            label.label
            .text 若营业执照上名称为空或为“无字号”，请填写“个体户+经营者姓名”，如“个体户张三”
          .field.is-horizontal
            label.label 营业执照注册号
            custom-input(v-model="license_register_num", placeholder="请输入营业执照注册号", error-info="请输入营业执照注册号", need-type='number_letter', maxlength="64", :validator="$v.license_register_num", :open-show-big="true")
          .field.is-horizontal
            label.label 企业代码类型
            custom-select(v-model="license_code_type", :list="license_code_type_list", nameField="license_name", @input="handleSelect", :validator="$v.license_code_type", error-info="请选择企业代码类型")
          .field.is-horizontal
            label.label 营业执照额外类型
            .radio-wrapper
              .type-item
                .radio
                  input(type="radio", id="yes", :value="1", v-model="license_extra_type")
                  label(for="yes") 已三证合一
              .type-item
                .radio
                  input(type="radio", id="no", :value="2", v-model="license_extra_type")
                  label(for="no") 未三证合一
          .field.is-horizontal.w-all
            label.label
            .text 若营业执照注册号为18位统一社会信用代码，请选择“已三证合一”，否则请选择“未三证合一”
          .field.is-horizontal
            label.label 营业注册地址
            custom-input(v-model="license_register_adress", placeholder="请输入营业注册地址", error-info="请输入营业注册地址", maxlength="64", :validator="$v.license_register_adress")
          .field.is-horizontal
            label.label 法定代表人
            custom-input(v-model="legal_person", placeholder="请输入法定代表人", error-info="请输入法定代表人", maxlength="32", :validator="$v.legal_person")
          .field.is-horizontal
            label.label 营业期限
            date-picker(type="single", placeholder="选择开始时间", v-model="start_time", :validator="$v.start_time", error-info="请选择开始时间")
            .middle 至
            date-picker(type="single", placeholder="选择截止时间", v-model="end_time")
          .field.is-horizontal
              label.label
              .text 开始时间为必填项, 截止时间为空代表永久
          .field.is-horizontal
            label.label-title 法人身份信息（限中国大陆居民)
          .field.is-horizontal.w-all.m-t-24(v-if="legal_person")
              label.label
              .el-icon-info.icon.text 请上传法人“
                span.tooltip-text {{legal_person}}
                span ”的身份证（即与营业执照上的经营者/法人姓名相同的身份证件）
          .field.is-horizontal.w-all
            label.label 身份证照片
            .image-wrapper
              .image-item.m-r-70.column
                .upload-pic
                  up-meituan(img-type="2", v-model="id_just", :hasSecondAction="is_del", img-id='2',  @result="legalFrontSuccess")
                .text 身份证人像面照片
              .image-item.column
                .upload-pic
                  up-meituan(img-type="3", v-model="id_back", :hasSecondAction="is_del", img-id='3', @result="legalBackSuccess")
                .text 身份证国徽面照片
              .image-item
                .tooltip-text 上传图片均需小于8M
          .field.is-horizontal
            label.label 身份证姓名
            custom-input(placeholder="身份证姓名", v-model="id_name", :validator="$v.id_name", error-info="请输入身份证姓名")
          .field.is-horizontal
            label.label 法定代表人身份证号
            custom-input(v-model="id_code", placeholder="请输入法定代表人身份证号", error-info="请输入法定代表人身份证号", need-type='number_letter', maxlength="32", :validator="$v.id_code", :open-show-big="true")
          .field.is-horizontal.w-all
            label.label 门店头图
            .image-wrapper
              .image-item
                .upload-pic
                  up-meituan(img-type="7", v-model="head_img", :hasSecondAction="is_del", img-id='4', @result="headImgSuccess", :isMeituan="true")
              .image-item
                .tooltip-text 上传图片均需小于8M，门头图需将门头拍摄清晰，并和“支付申请一”中的“门店名称”保持一致。
                a.tooltip-text(style='color: blue', @click="showModal") 查看示例
          .field.is-horizontal
            label.label 门店内景图
            .image-wrapper
              .image-item
                .upload-pic
                  up-meituan(img-type="8", v-model="interior", :hasSecondAction="is_del", img-id='5', @result="interiorSuccess", :isMeituan="true")
              .image-item
                .tooltip-text 上传图片均需小于8M
          .field.is-horizontal(v-if="judgeAuthorize && acctype === 2")
            label.label 清算授权书
            .image-wrapper
              .image-item
                .upload-pic
                  up-meituan(img-type="9", v-model="business_settle_photos", :hasSecondAction="is_del", img-id='6', @result="photosSuccess", :isMeituan="true")
              .image-item
                a.download-btn(target="_blank", :href="`${root}/meituan/settle`") 下载模板
              .image-item
                a.download-btn(target="_blank", :href="`https://oss1.chedianai.com/images/assets/qingsuan1.png`") 参考示例
          .field.is-horizontal.w-all(v-if="judgeAuthorize && acctype === 2")
            label.label 
            .tooltip-text 注意事项：如个人账户信息填写为非企业法人账户时，必须上传清算授权书，上传格式必须为图片格式
      .btn-wrapper
        .button-group      
          a.button.large(style="width: 140px", @click="resetPayment", v-if="is_reset_show") 重置支付信息
          a.button.primary.large(@click="goNext") 提交   
    account-reference(v-if="is_open_reference", :imgUrl="imgUrl", @close="closeModal")  
</template>

<script>
import TimerShaft from '@/components/openStore/modal/TimerShaft'
import CustomInput from '@/components/generics/form/CustomInput'
import DatePicker from '@/components/generics/form/DatePicker'
import CustomSelect from '@/components/generics/form/CustomSelect'
import UpMeituan from '@/components/openStore/modal/UpMeituanImage'
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import AccountReference from '@/components/openStore/modal/AccountReference'
import Api from '@/mixins/modules/OpenStore'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { root } from '@/plugins/Fetch'
import Utils from '@/mixins/utilities/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'payMsgThird',
  mixins: [Api, validationMixin, Utils],
  components: {
    TimerShaft,
    CustomInput,
    DatePicker,
    CustomSelect,
    UpMeituan,
    OpenStoreTitle,
    AccountReference,
  },
  validations: {
    license_name: {
      required,
    },
    license_register_num: {
      required,
    },
    license_code_type: {
      required,
    },
    license_register_adress: {
      required,
    },
    legal_person: {
      required,
    },
    id_name: {
      required,
    },
    id_code: {
      required,
    },
    start_time: {
      required,
    },
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      wxStatus: 'wxStatus',
      miniStatus: 'miniStatus',
    }),
    /**
     * 判断是否显示清算授权书
     *
     * 账户名称: bank_card.name
     * 法定代表人: legal_person
     * 身份证姓名: id_name
     */
    judgeAuthorize () {
      if (this.legal_person !== '' && this.id_name !== '') {
        if (this.bank_card.name !== this.legal_person || this.bank_card.name !== this.id_name) {
          return true
        }
      }
      return false
    },
  },
  data () {
    return {
      root,

      is_del: false,
      is_reset_show: false, // 是否显示重置按钮
      is_open_reference: false,
      imgUrl: 'https://oss1.chedianai.com/images/assets/store-head-img.jpg',

      merchant_name: '', // 门店简称
      acctype: '', // 账账户类型：1:对公，2:对私
      wx_rate: 0, // 支付费率
      bank_card: {},

      license_type: 202, // 营业执照类型：201：个体工商户营业执照，202：企业法人营业执照(企业资质)
      encrypt_id: '', // 营业执照ID
      license_pic: '', // 营业执照
      license_meituan_url: '', // 营业执照美团url
      license_extra_type: 0, // 企业执照额外类型：1：三证合一，2：未三证合一
      license_name: '', // 营业执照名称
      license_register_num: '', // 营业注册号
      license_register_adress: '', // 营业注册地址
      legal_person: '', // 法定代表人
      license_time_type: null, // 营业时间有效期
      start_time: '', // 开始日期
      end_time: '', // 截止日期
      id_just: '', // 身份证正面
      id_back: '', // 身份证反面
      meituan_id_just: '', // 美团身份证正面
      meituan_id_back: '', // 美团身份证反面
      id_name: '', // 身份证姓名
      id_code: '', // 身份证号
      head_img: '', // 门店头图
      interior: '', // 内景图
      business_settle_photos: '',  // 授权清算书

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
    // 展示"门店头图"样例
    showModal () {
      this.is_open_reference = true
    },
    // 关闭"门店头图"样例
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
     * 门店头图上传成功的回调
     * @param 门店头图数据
     */
    headImgSuccess (param) {
      this.successFun(param, 7)
    },
    /**
     * 门店内景上传成功的回调
     * @param 门店内景数据
     */
    interiorSuccess (param) {
      this.successFun(param, 8)
    },
    /**
     * 清算授权书上传成功的回调
     * @param 清算授权书数据
     */
    photosSuccess (param) {
      this.successFun(param, 9)
    },
    /**
     * 上传成功的回调
     * @param ocr返回的数据
     * @typr 上传的类型(1: 营业执照, 2: 身份证正面, 3: 身份证反面, 7.门头图, 8.店内环境, 9.各类证明文件)
     */
    async successFun (param, type) {
      if (type === 1) {
        this.encrypt_id = param.meituan.encrypt_id
        this.license_pic = param.local.url
        this.license_name = param.ocr.license_name
        this.license_register_num = param.ocr.license_code
        this.license_register_adress = param.ocr.license_address
        this.legal_person = param.ocr.legal_person
        this.start_time = this.changeDateTime(param.ocr.license_start_time)
        this.end_time = this.changeDateTime(param.ocr.license_expired_time)

        if (this.id_name !== '' && this.legal_person !== this.id_name) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '请上传与身份证件持有人姓名相同的营业执照',
          })
        }

        await this.licenseCodeType() // 判断企业代码类型 & 营业执照类型
        await this.judgeExpiredType() // 判断营业期限
      } else if (type === 2) {
        this.id_just = param.local.url
        this.meituan_id_just = param.meituan.url
        this.id_code = param.ocr.legal_person_id_no
        this.id_name = param.ocr.legal_person

        if (this.legal_person !== '' && this.legal_person !== this.id_name) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '请上传与营业执照上的经营者/法人姓名相同的身份证件',
          })
        }
      } else if (type === 3) {
        this.id_back = param.local.url
        this.meituan_id_back = param.meituan.url
      } else if (type === 7) {
        this.head_img = param.meituan.url
      } else if (type === 8) {
        this.interior = param.meituan.url
      } else if (type === 9) {
        this.business_settle_photos = param.meituan.url
      }
    },
    // 重置门店美团支付信息
    async resetPayment () {
      this.$store.dispatch('showMessage', {
        isRejectable: 1,
        title: '警告',
        content: '确认重置支付信息并返回"支付申请一"',
        resolve: () => {
          this.resetPaymentFun()
        },
      })
    },
    async resetPaymentFun () {
      try {
        const { response, result } = await this.resetPaymentApi()
        if (response.status === 200 && result.code === 0) {
          this.$router.replace({
            name: 'payMsgFirst',
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '重置门店美团支付信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '重置门店美团支付信息失败',
          content: `错误：${err}`,
        })
      }
    },
    goNext () {
      if (!this.license_pic) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请上传营业执照照片',
        })
        return
      }
      if (!this.id_just || !this.id_back) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请上传身份证正反面照片',
        })
        return
      }
      if (this.legal_person !== '' && this.id_name !== '' && this.legal_person !== this.id_name) {
        console.log(2348972389)
        this.$store.dispatch('showMessage', {
          duration: 6000,
          type: 'failure',
          title: '提示',
          content: '营业执照法人姓名与身份证件姓名必须一致',
        })
        return
      }
      if (!this.license_type) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请选择营业执照类型',
        })
        return
      }
      if (!this.license_extra_type) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请选择营业执照额外类型',
        })
        return
      }
      if (!this.head_img) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请上传门店头图',
        })
        return
      }
      if (!this.interior) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请上传门店内景图',
        })
        return
      }

      // acctype: 账户类型：1:对公，2:对私
      // business_settle_photos: 清算授权书
      if (this.judgeAuthorize) {
        if (!this.business_settle_photos && this.acctype === 2) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '请上传清算授权书',
          })
          return
        }
      }

      this.$v.$touch()
      if (this.$v.$error) {
        return false
      }
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '确认提交支付申请？',
        isRejectable: 1,
        resolve: () => {
          this.openPayment()
        },
      })
    },
    // 保存
    async openPayment () {
      let params = {
        businessLicenceType: this.license_type,
        businessLicenceCodeType: this.license_code_type.value,
        businessLicenceExtraType: this.license_extra_type,
        businessLicenceName: this.license_name,
        businessLicenceNumber: this.license_register_num,
        businessLicenceAddress: this.license_register_adress,
        businessLicencePhotoId: this.encrypt_id,
        businessLicencePhotoLocal: this.license_pic,
        businessLicenceExpiredType: this.license_time_type,
        businessLicenceStartTime: this.timeStamp(this.start_time),
        businessLicenceExpiredTime: this.timeStamp(this.end_time) ? this.timeStamp(this.end_time) : 0,
        legalPerson: this.legal_person,
        legalPersonIdNo: this.id_code,
        legalPersonIdFrontLocal: this.id_just,
        legalPersonIdFront: this.meituan_id_just,
        legalPersonIdBackLocal: this.id_back,
        legalPersonIdBack: this.meituan_id_back,
        shopPhoto: this.head_img,
        shopInsidePhoto: this.interior,
        businessSettlePhotos: this.business_settle_photos,
      }
      if (params.businessLicenceExpiredTime) { // 截止日期类型：0: 永久，1: 选择截止日期
        params.businessLicenceExpiredType = 1
      } else if (!params.businessLicenceExpiredTime) {
        params.businessLicenceExpiredType = 0
      }
      try {
        const { response, result } = await this.openPaymentApi(params)
        if (response.status === 200 && result.code === 0) {
          this.$router.replace({
            name: 'payMsgThirdWait',
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '开通支付失败',
            content: `${result.message}`,
            resolve: () => {
              this.is_reset_show = true
            },
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '开通支付失败',
          content: `错误：${err}`,
        })
      }
    },
    // 判断企业代码类型 & 营业执照类型
    licenseCodeType () {
      if (this.license_register_num.length === 18) {
        this.license_extra_type = 1
        this.license_code_type = {
          license_name: '统一社会信用代码（18位）',
          value: '1',
        }
      } else if (this.license_register_num.length === 9) {
        this.license_extra_type = 2
        this.license_code_type = {
          license_name: '组织机构代码（9位）',
          value: '2',
        }
      } else if (this.license_register_num.length === 15) {
        this.license_extra_type = 2
        this.license_code_type = {
          license_name: '营业执照注册号（15位）',
          value: '3',
        }
      }
    },
    /**
    * 选择企业代码类型
    * @type 企业代码类型
    */
    handleSelect (type) {
      if (type.value === '0') {
        this.license_extra_type = ''
      } else if (type.value === '1') {
        this.license_extra_type = 1
      } else {
        this.license_extra_type = 2
      }
    },
    // 判断营业期限
    judgeExpiredType () {
      if (this.end_time === '') {
        this.end_time = ''
        this.license_time_type = 0
      } else {
        this.license_time_type = 1
      }
    },
    // 获取支付配置
    async merchantStore () {
      try {
        const { response, result } = await this.getMerchantApi()
        if (response.status === 200) {
          if (result.code === 0) {
            this.merchant_name = result.data.merchantName
            this.acctype = result.data.bank_card.acctype
            this.wx_rate = result.data.wxRate
            this.bank_card = result.data.bank_card
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取支付配置失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取支付配置失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取支付配置失败',
          content: `错误：${err}`,
        })
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
            this.license_type = result.data.license_type
            this.license_pic = result.data.license_url
            this.encrypt_id = result.data.license_meituan_url
            this.license_name = result.data.license_name
            this.license_register_num = result.data.license_code
            this.license_register_adress = result.data.license_address
            this.legal_person = result.data.legal_person
            this.start_time = result.data.license_start_time
            this.end_time = result.data.license_expired_time
            this.id_just = result.data.legal_person_id_front
            this.meituan_id_just = result.data.legal_person_id_front_meituan
            this.id_back = result.data.legal_person_id_back
            this.meituan_id_back = result.data.legal_person_id_back_meituan
            this.id_name = result.data.legal_person
            this.id_code = result.data.legal_person_id_no
            await this.licenseCodeType() // 判断企业代码类型 & 营业执照类型
            await this.judgeExpiredType() // 判断营业期限
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
    // 获取数据
    async getData () {
      await Promise.all([this.merchantStore(), this.getQualification()])
      // let [legalPerson, bankCardName] = await Promise.all([this.merchantStore(), this.getQualification()])
      // 如果企业法人和账户名称不一致, 显示清算授权书
      // console.log(legalPerson !== bankCardName)
      // if (legalPerson !== bankCardName) {
      //   this.is_show = true
      // }
    },
    // 更新step字段
    async updateUserInfo () {
      try {
        const { response, result } = await this.fetchUserInfoApi()
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('updateUser', result.data)
          this.redirectFun()

          // this.getData()
        }
        return { response, result }
      } catch (err) {
        throw err
      }
    },
    // 重定向
    redirectFun () {
      let type = this.currentUser.step // 主流程
      let wxStatus = this.wxStatus // 企业微信
      let nearbyStatus = this.currentUser.nearby_status // 附近小程序
      let flag = this.currentUser.mini_status === 1 || this.currentUser.mini_status === 4 // 未提交
      switch (type) {
        case 1:
          this.$router.push({
            name: 'storeAptitude',
          })
          break
        case 2:
          if (flag) {
            this.$router.push({
              name: 'miniProgramFirst',
            })
          } else {
            this.$router.push({
              name: 'miniProgramFirstWait',
            })
          }
          break
        case 3:
          if (flag) {
            this.$router.push({
              name: 'miniProgramSecond',
            })
          } else {
            this.$router.push({
              name: 'miniProgramSecondWait',
            })
          }
          break
        case 4:
          this.$router.push({
            name: 'payMsgFirstWait',
          })
          break
        case 5:
          if (flag) {
            this.$router.push({
              name: 'payMsgSecond',
            })
          } else {
            this.$router.push({
              name: 'payMsgSecondWait',
            })
          }
          break
        case 6:
          if (flag) {
            this.getData()
          } else {
            this.$router.push({
              name: 'payMsgThirdWait',
            })
          }
          break
        case 7:
          if (wxStatus === 2) {
            this.$router.push({
              name: 'enterpriseWeChatRegister',
            })
          } else if (nearbyStatus !== 3) {
            this.$router.push({
              name: 'nearbyMiniProgramCategoryRedirect',
            })
          }
          break
        default:
          break
      }
    },
  },
  async mounted () {
    this.$store.dispatch('syncAuthorizeStatus')
    this.updateUserInfo()
    await this.$store.dispatch('syncMiniStatus')
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
.field.is-horizontal .label
  flex 0 0 110px
.form-wrapper
  .w-all
    width 100%
.middle 
  margin 0 12px
  font-size 13px
.label-title
  font-size 15px
  font-weight bold
  border-left 3px solid #ffbb29
  padding-left 6px
  position relative
  left -9px
  line-height 1
.el-icon-info::before
  padding-right 5px
.text
  font-size 12px
  line-height 12px
  color #999
  white-space nowrap
.icon.text
  color #333
.upload-pic
  width 88px
  height 88px
  margin-right 8px
  font-size 13px
.field-content
  font-size 13px
  line-height 16px
  color #353535
.custom-select
  width 300px
.tooltip-text
  font-size 12px
  color #FF0000
.radio-wrapper
  display flex
  justify-content start
  align-items center
  .type-item
    display inline-block
    width 150px
  .w-70
    width 70px
  .w-250
    width 250px
.closing-date
  display flex
  align-items center
.image-wrapper
  display flex
  align-items center
  .image-item
    display flex
    align-items center
    margin-right 20px
    &:last-child
      margin-right 0
    span.tooltip-text
      padding-right 30px
      font-size 14px
      color #000
    .download-btn
      font-size 14px
      color #ffbb29
    .text
      margin-top 10px
  .column
    flex-direction column
  .m-r-70
    margin-right 70px
</style>
