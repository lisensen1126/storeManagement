<template lang="pug">
  .section-layout
    timer-shaft(:high-light="2")
    .content-wrapper
      open-store-title(title="小程序申请一：小程序注册")
      .form-wrapper
        .remind-wrapper
          .title 小程序申请
          .radio-wrapper
            .type-item(:class="{ active: is_yes === 2 }")
              .radio(@click="")
                input(type="radio", id="no", :value="2", v-model="is_yes")
                label(for="no") 我要申请小程序
            .type-item(:class="{ active: is_yes === 1 }")
              .radio
                input(type="radio", id="yes", :value="1", v-model="is_yes", @click="goAuthorization")
                label(for="yes") 我已有小程序
        .field-group
          .field.is-horizontal
              label.label 营业执照照片
              .image-wrapper
                .image-item
                  .upload-pic.image-item
                    up-meituan(img-type="1", v-model="info.license_url", :hasSecondAction="is_del", @id="licenseSuccess", img-id='1')
                  .tooltip-text 拍照营业执照清晰图片，上传图片小于2M
          .field.is-horizontal
            label.label 企业名称
            custom-input(v-model="info.name", maxlength=30, placeholder="请输入企业名称", :validator="$v.info.name", error-info="企业名称不能为空且不大于30字")
          .field.is-horizontal
            label.label 企业代码类型
            custom-select(v-model="info.select_code_type", ref="codeSelect", :list="code_type_list", nameField="name", :validator="$v.info.select_code_type", error-info="请选择企业代码类型")
          .field.is-horizontal
            label.label 企业代码
            custom-input(v-model="info.code", maxlength=30, placeholder="请输入企业代码", :validator="$v.info.code", error-info="企业代码不能为空",:open-show-big="true")
          .field.is-horizontal
              label.label 
              .tooltip-text 请再次确认识别的企业代码是否正确
          .field.is-horizontal
            label.label 法人姓名
            custom-input(v-model="info.legal_persona_name", maxlength=30, placeholder="请输入法人姓名", :validator="$v.info.legal_persona_name", error-info="法人姓名不能为空且不大于30字")
          .field.is-horizontal
            label.label 法人微信号
            custom-input(v-model="info.legal_persona_wechat", maxlength=50, placeholder="请输入法人微信号", :validator="$v.info.legal_persona_wechat", error-info="法人微信号不能为空")
          .field.is-horizontal
              label.label 
              .tooltip-text 注：此处填写的法人微信号请确认能在微信中查找到，微信系统会验证微信实名信息是否为法人本人，请先确认法人微信号是否已绑法人本人银行卡
      .btn-wrapper
        .button-group
          a.button.large(@click="goBack") 上一步
          a.button.primary.large(@click="registerClick") 注册
      .example-img
        open-image(img-type="1",:img-url="'https://oss1.chedianai.com/images/assets/example-img.png'",key-name="",mini-width="250",mini-height="300",margin-bottom="0", margin-right="5", border-radius="0", :is-original="true")
      mini-program-modal(v-if="is_show", :name="info.legal_persona_name", :wechat="info.legal_persona_wechat", @resolve="confirm", @input="close")
</template>

<script>
import TimerShaft from '@/components/openStore/modal/TimerShaft'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import OpenImage from '@/components/generics/OpenImage'
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import UpMeituan from '@/components/openStore/modal/UpMeituanImage'
import MiniProgramModal from '@/components/openStore/modal/MiniProgramModal'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import OpenStoreMixin from '@/mixins/modules/OpenStore'
// import store from '../../vuex/store'
import { mapGetters } from 'vuex'
export default {
  name: 'miniProgramFirst',
  mixins: [validationMixin, OpenStoreMixin],
  components: {
    TimerShaft,
    CustomInput,
    CustomSelect,
    OpenImage,
    OpenStoreTitle,
    UpMeituan,
    MiniProgramModal,
  },
  data () {
    return {
      is_show: false,
      is_yes: 2, // 1: 是, 2: 否
      is_del: false,
      info: {
        name: '',
        select_code_type: {},
        code: '',
        legal_persona_name: '',
        legal_persona_wechat: '',
        license_url: '',
        license_meituan_url: '', // 美团url
      },
      mini_program_data: {}, // 小程序授权信息
      code_type_list: [
        {
          name: '统一社会信用代码(18位)',
          id: 1,
        },
        {
          name: '组织机构代码(9位)',
          id: 2,
        },
        {
          name: '营业执照注册号(15位)',
          id: 3,
        },
      ],
    }
  },
  validations: {
    info: {
      name: {
        required,
      },
      select_code_type: {
        required,
      },
      code: {
        required,
      },
      legal_persona_name: {
        required,
      },
      legal_persona_wechat: {
        required,
      },
    },
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      wxStatus: 'wxStatus',
    }),
  },
  methods: {
    /**
     * 营业执照上传成功的回调
     * @data 营业执照数据
     */
    licenseSuccess (data) {
      this.info.name = data.ocr.license_name
      this.info.code = data.ocr.license_code
      this.info.legal_persona_name = data.ocr.legal_person
      this.info.license_url = data.local.url
      this.info.license_meituan_url = data.meituan.encrypt_id
      if (data.ocr.license_code.length === 18) {
        this.info.select_code_type = {
          name: '统一社会信用代码(18位)',
          id: 1,
        }
      } else if (data.ocr.license_code.length === 9) {
        this.info.select_code_type = {
          name: '组织机构代码(9位)',
          id: 2,
        }
      } else if (data.ocr.license_code.length === 15) {
        this.info.select_code_type = {
          name: '营业执照注册号(15位)',
          id: 3,
        }
      }
    },
    // 小程序授权
    goAuthorization () {
      console.log(this.mini_program_data.installed)
      if (this.mini_program_data.installed) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '该门店已绑定小程序',
          resolve: () => {
            this.$router.replace({
              name: 'payMsgFirst',
            })
          },
        })
      } else {
        location.href = this.mini_program_data.auth_url
      }
    },
    // 点击上一步
    goBack () {
      this.$router.replace({
        name: 'storeAptitude',
        query: {},
      })
    },
    // 点击注册
    registerClick () {
      if (!this.info.license_url) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请上传营业执照',
        })
      }
      this.$v.$touch()
      if (this.$v.$error) {
        return false
      }
      this.is_show = true
    },
    // 已完成注册
    confirm () {
      this.register()
      this.is_show = false
    },
    // 关闭弹框
    close () {
      this.is_show = false
    },
    async register () {
      let params = {
        name: this.info.name,
        code_type: this.info.select_code_type.id,
        code: this.info.code,
        legal_persona_name: this.info.legal_persona_name,
        legal_persona_wechat: this.info.legal_persona_wechat,
        license_url: this.info.license_url,
        license_meituan_url: this.info.license_meituan_url,
      }
      try {
        const { response, result } = await this.miniCreateMini(params)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '注册成功',
            resolve: () => {
              this.$router.push({
                name: 'miniProgramFirstWait',
                query: {},
              })
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '注册失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '注册失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取小程序创建信息
    async getInfo () {
      let _this = this
      try {
        const { response, result } = await _this.getQualificationApi()
        if (response.status === 200 && result.code === 0) {
          _this.info.name = result.data.license_name ? result.data.license_name : ''
          _this.info.code = result.data.license_code ? result.data.license_code : ''
          _this.info.legal_persona_name = result.data.legal_person ? result.data.legal_person : ''
          _this.info.legal_persona_wechat = result.data.legal_person_weixin ? result.data.legal_person_weixin : ''
          _this.info.license_url = result.data.license_url ? result.data.license_url : ''
          _this.info.license_meituan_url = result.data.license_meituan_url ? result.data.license_meituan_url : ''
          // 根据接口字段匹配企业代码类型
          let code = this.code_type_list.find(item => result.data.license_code_type ? item.id === parseInt(result.data.license_code_type) : false) || {}
          this.$refs.codeSelect.selectCandidate(code)
        } else {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取小程序创建信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取小程序创建信息失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 获取小程序授权信息
    async getAuthorizations () {
      let callbackUrl = location.href.slice(0, location.href.lastIndexOf('/')) + '/payMsgFirst'
      try {
        const { response, result } = await this.fetchAuthorizations({
          shop_back_url: callbackUrl,
        })
        if (response.status === 200 && result.code === 0) {
          this.mini_program_data = result.data.shop
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取小程序授权信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取小程序授权信息失败',
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
          // this.getInfo() // 获取小程序创建信息
          // this.getAuthorizations() // 获取小程序授权信息
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
      let flag = this.currentUser.mini_status === 1 || this.currentUser.mini_status === 2 || this.currentUser.mini_status === 4 // 未提交, 审核或失败
      switch (type) {
        case 1:
          this.$router.push({
            name: 'storeAptitude',
          })
          break
        case 2:
          if (flag) {
            this.getInfo() // 获取小程序创建信息
            this.getAuthorizations() // 获取小程序授权信息
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
  mounted () {
    this.$store.dispatch('syncAuthorizeStatus')
    this.updateUserInfo()
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
  position relative
.tooltip-text
  font-size 12px
  line-height 16px
  color #FF0000
.image-wrapper
  display flex
  align-items center
  .image-item
    display flex
    align-items center
    margin-right 20px
  .upload-pic
    width 88px
    height 88px
.example-img
  position absolute
  top 235px
  left 620px
  width 250px
  height 300px
.remind-wrapper
  margin 24px auto 0 auto
  width 300px
  height 120px
  text-align center
  .title
    font-size 20px
    font-weight 600
  .radio-wrapper
    padding-top 30px
    display flex
    justify-content center
    align-items center
    height 50px
    .type-item
      margin-right 24px
</style>
