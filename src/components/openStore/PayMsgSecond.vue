<!--第二步：支付账号验证,即美团银行卡验证-->
<template lang="pug">
  .section-layout
    timer-shaft(:high-light="5", :status="miniStatus")
    .content-wrapper
      open-store-title(title="支付申请二：支付账号验证")
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 门店简称
            .field-content {{merchant_name}}
          .field.is-horizontal
            label.label 结算账户类型
            div.type-item.di-1
              .radio
                input(type="radio",id="enterprise", name="type", value="enter", v-model="type", @change="enterpriseChange")
                label.sepcific-setting(for="enterprise") 企业账户
            div.type-item.di
              .radio
                input(type="radio",id="personal", name="type", value="per", v-model="type", @change="enterpriseChange")
                label.sepcific-setting(for="personal") 个人账户
          .field.is-horizontal.long-field(v-if="type === 'per'")
            label.label 身份证照片
            .control.image-wrapper
              .upload-box
                .upload-pic
                  up-meituan(img-type="2", v-model="id_just", :hasSecondAction="is_del", img-id='1', @result="legalFrontSuccess", :isMeituan="true")
                .text 身份证人像面照片
              .upload-box
                .upload-pic
                  up-meituan(img-type="3", v-model="id_back", :hasSecondAction="is_del", img-id='2', @result="legalBackSuccess", :isMeituan="true")
                .text 身份证国徽面照片
              p.red 上传图片需小于8M
          .field.is-horizontal
            label.label 结算账户名称
            custom-input(v-model="account.name", placeholder="请输入账户名称", :validator="$v.account.name", error-info="请输入账号名称", maxlength="32")
            p.red(v-if="type === 'enter'") 必须与企业名称一致
            p.red(v-if="type === 'per'") 必须为结算银行账户所有人
          .field.is-horizontal
            label.label 结算账户联系人
            custom-input(v-model="account.contacts", placeholder="请输入账户联系人", :validator="$v.account.contacts", error-info="请输入账号联系人", maxlength="32")
            p.red(v-if="type === 'enter'") 必须与企业法定代表人一致
            p.red(v-if="type === 'per'") 必须为结算银行账户所有人
          .field.is-horizontal(v-if="type === 'per'")
            label.label 身份证号码
            custom-input(v-model="id", placeholder="请输入身份证号码", error-info="请输入身份证号码", :validator="$v.id",need-type='number_letter', maxlength="32")
            p.red 必须为结算银行账户所有人身份证号
          .field.is-horizontal
            label.label 结算账户联系电话
            custom-input(v-model="account.mobile_phone", placeholder="请输入账户联系电话", :validator="$v.account.mobile_phone", error-info="请输入联系电话",need-type='number', maxlength="11",:open-show-big="true")
            p.red(v-if="type === 'enter'") 必须为企业法定代表人联系电话
            p.red(v-if="type === 'per'") 必须为结算银行账户所有人的联系电话
          .field.is-horizontal.long-field(v-if="type === 'per'")
            label.label 银行卡照片
            .control.image-wrapper
              .upload-box
                .upload-pic
                  up-meituan(img-type="4", v-model="card_just", :hasSecondAction="is_del", img-id='3', @result="bankCardFrontSuccess", :isMeituan="true")
                .text 银行卡卡号面
              .upload-box
                .upload-pic
                  up-meituan(img-type="5", v-model="card_back", :hasSecondAction="is_del", img-id='4', @result="bankCardBackSuccess", :isMeituan="true")
                .text 银行卡签名面
              p.red 上传图片均需小于8M
          .field.is-horizontal.long-field
            label.label(v-if="type === 'enter'") 开户行账号
            label.label(v-if="type === 'per'") 银行卡号
            custom-input(v-model="account.cardno",placeholder="请输入账号", :validator="$v.account.cardno", error-info="请输入账号",need-type='bank_card', maxlength="32",:open-show-big="true")
            p.red(v-if="type === 'enter'") 必须为企业账户银行账号
            p.red(v-if="type === 'per'") 必须为结算银行账户所有人的银行卡号
            p.blue(@click="showModal") 常用银行账户位数参考
          .field.is-horizontal
            label.label 开户总行
            custom-select.width-100(:list="total_list", v-model="total", @input="changeTotal", :validator="$v.total", error-info="请选择开户总行", :show-search="true")
          .field.is-horizontal
            label.label 开户城市
            custom-select(:list="province_list", v-model="province", @input="changeProvince", :validator="$v.province", error-info="请选择省", :show-search="true")
            custom-select.middle(:list="city_list", v-model="city", @input="changeCity", :validator="$v.city", error-info="请选择城市", :show-search="true")
          .field.is-horizontal
            label.label 开户支行
            custom-select.width-100(:list="branch_list", v-model="branch",nameField="branch", :validator="$v.branch", error-info="请选择开户支行", :show-search="true")
          .field.is-horizontal(v-if="type === 'enter'")
            label.label 开户许可证
            .control.image-wrapper
              .upload-pic
                up-meituan(img-type="9", v-model="bank_photo", :hasSecondAction="is_del", img-id='5', :isMeituan="true", @result="bankPhotoChange")
              p.red 上传图片均需小于8M
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="saveData") 下一步
    account-reference(v-if="is_open_reference", :imgUrl="imgUrl", @close="closeModal")
</template>

<script>
import TimerShaft from '@/components/openStore/modal/TimerShaft'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import OpenStoreMixin from '@/mixins/modules/OpenStore'
import AccountReference from '@/components/openStore/modal/AccountReference'
import UpMeituan from '@/components/openStore/modal/UpMeituanImage'
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
export default {
  name: 'payMsgSecond',
  mixins: [validationMixin, OpenStoreMixin],
  components: {
    TimerShaft,
    CustomInput,
    CustomSelect,
    AccountReference,
    UpMeituan,
    OpenStoreTitle,
  },
  validations: {
    id: {
      validate (val) {
        if (this.type === 'enter' || this.id !== '') {
          return true
        } else {
          return false
        }
      },
    },
    account: {
      name: {
        required,
      },
      contacts: {
        required,
      },
      mobile_phone: {
        required,
        validate (val) {
          return /^1\d{10}$/.test(val)
        },
      },
      cardno: {
        required,
      },
    },
    total: {
      required,
    },
    province: {
      required,
    },
    city: {
      required,
    },
    branch: {
      required,
    },
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      wxStatus: 'wxStatus',
      miniStatus: 'miniStatus',
    }),
  },
  data () {
    return {
      is_open_reference: false, // 控制常用银行账户位数参考弹窗
      id: '', // 身份证号
      is_del: false,
      bank_photo: '', // 开户许可证
      account: { // 账户
        name: '', // 名称
        contacts: '', // 联系人
        mobile_phone: '', // 账户联系电话
        cardno: '', // 开户行账号
      },
      card_just: '', // 银行卡正面
      card_back: '', // 银行卡反面
      id_just: '', // 身份证正面
      id_back: '', // 身份证反面
      total_list: [], // 开户总行
      total: {},
      branch_list: [], // 开户支行
      branch: {},
      province_list: [], // 省列表
      province: {},
      city_list: [], // 城市列表
      city: {},
      merchant_name: '', // 门店简称
      type: 'enter', // 账户类型
      store_name: this.$route.query.storeName,
      imgUrl: 'https://oss1.chedianai.com/images/assets/account-reference.png',
    }
  },
  methods: {
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
    * 银行卡正面上传成功的回调
    * @param 银行卡数据
    */
    bankCardFrontSuccess (param) {
      this.successFun(param, 4)
    },
    /**
   * 银行卡正面上传成功的回调
   * @param 银行卡数据
   */
    bankCardBackSuccess (param) {
      this.successFun(param, 5)
    },
    /**
     * 上传成功的回调
     * @param ocr返回的数据
     * @typr 上传的类型(2: 身份证正面, 3: 身份证反面, 4.结算账户(正面), 5.结算账户(反面))
     */
    async successFun (param, type) {
      if (type === 2) {
        this.id_just = param.meituan.url
        this.account.name = param.ocr.legal_person
        this.account.contacts = param.ocr.legal_person
        this.id = param.ocr.legal_person_id_no
      } else if (type === 3) {
        this.id_back = param.meituan.url
      } else if (type === 4) {
        this.card_just = param.meituan.url
        this.account.cardno = param.ocr.card_no
      } else if (type === 5) {
        this.card_back = param.meituan.url
      }
    },
    // 结算账户类型切换
    enterpriseChange () {
      this.bank_photo = '' // 开户许可证
      this.account.name = '' // 名称
      this.account.contacts = '' // 联系人
      this.account.mobile_phone = '' // 账户联系电话
      this.account.cardno = '' // 开户行账号
      this.card_just = '' // 银行卡正面
      this.card_back = '' // 银行卡反面
      this.id_just = '' // 身份证正面
      this.id_back = '' // 身份证反面
      this.id = '' // 身份证号
      this.total = {}
      this.branch = {}
      this.province = {}
      this.city = {}
      if (this.type === 'enter') {
        this.getQualification()
      }
    },
    // 许可证上传回调
    bankPhotoChange (data) {
      this.bank_photo = data.meituan.url
    },
    // 展示常用银行账户位数参考
    showModal () {
      this.is_open_reference = true
    },
    // 关闭常用银行账户位数参考
    closeModal () {
      this.is_open_reference = false
    },
    // 获取虚拟门店详情
    async merchantStore () {
      try {
        const { response, result } = await this.getMerchantApi()
        if (response.status === 200 && result.code === 0) {
          this.merchant_name = result.data.merchantName
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取虚拟门店失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取虚拟门店失败',
          content: `错误：${err}`,
        })
      }
    },
    // 点击下一步
    saveData () {
      let params = {
        cardno: this.account.cardno.replace(/\s/g, ''),
        acctype: this.type === 'enter' ? 1 : 2,
        bankId: this.total.id,
        bankName: this.total.name,
        branchId: this.branch.id,
        branchName: this.branch.branch,
        bankProvinceId: this.province.id,
        bankCityId: this.city.id,
        contactPhone: this.account.mobile_phone,
        contactPerson: this.account.contacts,
        name: this.account.name,
      }
      if (this.type === 'enter') {
        if (!this.bank_photo) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '提示',
            content: '请上传开户许可证',
          })
          return
        }
        params.bankCertificatePhoto = this.bank_photo
      }
      if (this.type === 'per') {
        if (!this.id_just || !this.id_back || !this.card_just || !this.card_back) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '提示',
            content: '请上传身份证/银行卡照片',
          })
          return
        }
        params.accountPersonIdCardPhotoFront = this.id_just
        params.accountPersonIdCardPhotoBack = this.id_back
        params.bankCardFront = this.card_just
        params.bankCardBack = this.card_back
        params.accountPersonIdCode = this.id
      }
      if (this.type === 'per' && this.account.name !== this.account.contacts) {
        this.$store.dispatch('showMessage', {
          autoClose: true,
          type: 'failure',
          title: '提示',
          content: '结算账户名称和结算账户联系人必须一致',
        })
        return
      }
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '确认提交银行卡验证？',
        isRejectable: 1,
        resolve: () => {
          this.setVerifyCard(params)
        },
      })
    },
    /*
    * 保存
    *  @params 提交参数
    * */
    async setVerifyCard (params) {
      try {
        const { response, result } = await this.verifyCardApi(params)
        if (response.status === 200) {
          if (result.code === 0 || result.code === 40000) {
            this.$router.replace({
              name: 'payMsgSecondWait',
              query: {},
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '提交银行卡验证失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提交银行卡验证失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提交银行卡验证失败',
          content: `错误：${err}`,
        })
      }
    },
    /*
    *  改变总行
    *  q 总行对象
    * */
    changeTotal (q) {
      this.total = q
      this.branch = {}
      this.branch_list = []
      if (this.province.id && this.city.id) {
        this.getBranchList()
      }
    },
    /*
    *  改变城市
    *  q 省对象
    * */
    changeProvince (q) {
      this.province = q
      this.city = {}
      this.branch = {}
      this.branch_list = []
      this.getAdress(2)
    },
    /*
   *  改变区
   *  q 城市对象
   * */
    changeCity (q) {
      this.city = q
      if (this.province.id && this.total.id) {
        this.getBranchList()
      }
    },
    /*
    * 获取地址
    *  @level 省市区
    * */
    async getAdress (level) {
      let params = {
        level: level,
      }
      if (level === 2) {
        params.parentId = this.province.id
      }
      try {
        const { response, result } = await this.getCityListApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            if (level === 1) {
              this.province_list = result.data
            }
            if (level === 2) {
              this.city_list = result.data
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取地址列表失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取地址列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取地址列表失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取总行列表
    async getTotalList () {
      try {
        const { response, result } = await this.getBankInfoApi()
        if (response.status === 200) {
          if (result.code === 0) {
            this.total_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取开户总行列表失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取开户总行列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取开户总行列表失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取支行列表
    async getBranchList () {
      try {
        const { response, result } = await this.getBankBranchApi({
          cityId: this.city.id,
          branchId: this.total.id,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.branch_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取开户支行列表失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取开户支行列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取开户支行列表失败',
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
            this.account.name = result.data.license_name
            this.account.contacts = result.data.legal_person
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
    // 更新step字段
    async updateUserInfo () {
      try {
        const { response, result } = await this.fetchUserInfoApi()
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('updateUser', result.data)
          this.redirectFun()
          // this.merchantStore() // 获取虚拟门店详情
          // this.getTotalList()
          // this.getAdress(1)
          // this.getQualification() // 获取门店资质信息
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
            this.merchantStore() // 获取虚拟门店详情
            this.getTotalList()
            this.getAdress(1)
            this.getQualification() // 获取门店资质信息
          } else {
            this.$router.push({
              name: 'payMsgSecondWait',
            })
          }
          break
        case 6:
          if (flag) {
            this.$router.push({
              name: 'payMsgThird',
            })
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
  overflow-y auto
.width-100
  width 100%
.red
  color red
  font-size 12px
  margin-left 10px
.blue
  color blue
  font-size 12px
  margin-left 10px
  cursor pointer
.field
  width 600px !important
.field.long-field
  width 720px !important
.image-wrapper
  display flex
  flex-direction row
  align-items center
  .text
    margin-top 12px
    font-size 12px
    color #999
.upload-banner + .upload-banner
  margin-left 8px
.center
  line-height 88px
  text-align center
.btn-wrapper
  padding-top 30px
.m-b-30
  padding-bottom 40px
.di-1
  margin-right 30px
.middle
  margin 0 10px
.label
  flex 0 0 120px !important
label.label
  font-size 13px
.upload-pic
  width 88px
  height 88px
  margin-right 35px
.form-wrapper .field
  width 520px
.form-wrapper .field.full-width
  width 100%
.upload-banner
  width 88px
  height 88px
  overflow hidden
  position relative
  img
    width 100%
    height 100%
  input[type='file']
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    opacity 0
.upload-button
  border 1px dashed #f1f1f1
  border-radius 2px
  background #fbfbfb
  cursor pointer
  &::before
    content ''
    display block
    position absolute
    width 40px
    height 30px
    background getImage('cloud-upload.svg') no-repeat center center
    top 50%
    margin-top -15px
    left 50%
    margin-left -20px
.qualification-cacl
  margin-left 4px
  color #999
.cs
  padding 12px 0 !important
  border-bottom none !important
.file-input
  width 100%
  height 100%
  position absolute
  top 0
  left 0
  opacity 0
.con
  font-size 14px
  color #ddd
  vertical-align bottom
  margin-left 10px
.field-content
  font-size 13px
  line-height 16px
  color #353535
</style>
