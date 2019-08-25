<template lang="pug">
  .section-layout
    timer-shaft(:high-light="4", :status="miniStatus")
    agree-model(v-if="is_agree", @close="closeModal")
    .content-wrapper
      open-store-title(title="支付申请一：支付信息完善")
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 支付渠道
            custom-select(v-model="pay", :list="pay_list")
          .field.is-horizontal.w-all
            label.label 门店名称
            custom-input(input-type="hasCount",v-model="store.store_name",:validator="$v.store.store_name", error-info="门店名称必填且不多于20字",placeholder="请输入门店名称")
              span(slot="countInfo") {{store.store_name ? store.store_name.length : 0}}/20
            .tooltip-text 注: 门店名称需和门店头图中的名称一致。
          .field.is-horizontal(v-if="!cannot_edit_name")
            label.label
            .tip-description 应美团方要求，门店名称不能多于20字，请修改后再提交
          .field.is-horizontal
            label.label 门店地址
            custom-select(:list="province_list", nameField="chineseName", v-model="province", @input="changeprovince", :validator="$v.province", error-info="请选择省", :show-search="true")
            custom-select.middle(:list="city_list", nameField="chineseName", v-model="city", @input="changecity", :validator="$v.city", error-info="请选择城市", :show-search="true")
            custom-select(:list="country_list", nameField="chineseName", v-model="country", @input="changecountry", :validator="$v.country", error-info="请选择区县", :show-search="true")
          .field.is-horizontal
            label.label 详情地址
            custom-input(v-model="store.address", :validator="$v.store.address", error-info="请填写详细地址最多30个字符", maxlength=30)
          .field.is-horizontal
            label.label 商户手机号
            custom-input(v-model="store.business_phone", maxlength=11, need-type='number', :validator="$v.store.business_phone", error-info="请填写正确的联系电话",:open-show-big="true")
          .field.is-horizontal
            .checkbox
              input(type="checkbox", :id="1", v-model="store_agree")
              label(@click="showModal") 我同意《美团智能支付合作协议》的相关服务条款和政策
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="goNext") 下一步
</template>

<script>
import TimerShaft from '@/components/openStore/modal/TimerShaft'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import OpenStoreMixin from '@/mixins/modules/OpenStore'
import basicInformationMixin from '@/mixins/modules/basicInformation'
import AgreeModel from '@/components/openStore/modal/AgreeMeituan'
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
export default {
  name: 'payMsgFirst',
  mixins: [validationMixin, OpenStoreMixin, basicInformationMixin],
  components: {
    TimerShaft,
    CustomInput,
    CustomSelect,
    AgreeModel,
    OpenStoreTitle,
  },
  data () {
    return {
      is_agree: false, // 控制同意弹窗
      store_agree: false, // 门店同意
      store: {
        store_name: '', // 门店名称
        address: '', // 门店地址
        business_phone: '', // 商户手机号
      },
      pay: { // 门店支付渠 道
        name: '美团支付',
      },
      pay_list: [{ // 支付渠道列表
        name: '美团支付',
      }],
      store_id: '',
      province_list: [], // 省列表
      province: {}, // 省
      city_list: [], // 城市列表
      city: {}, // 城市
      country_list: [], // 区列表
      country: {}, // 区
      cannot_edit_name: false, // 判断是否展示修改门店名称提醒
    }
  },
  validations: {
    store: {
      store_name: {
        required,
        validate (val) {
          return val && val.length <= 20
        },
      },
      business_phone: {
        required,
        validate (val) {
          return /^1\d{10}$/.test(val)
        },
      },
      address: {
        required,
      },
    },
    province: {
      required,
    },
    city: {
      required,
    },
    country: {
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
  methods: {
    // 下一步
    async goNext () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      if (!this.store_agree) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请同意协议',
        })
        return false
      }
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '确认提交支付信息？',
        isRejectable: 1,
        resolve: () => {
          this.setMerchantPoi()
        },
      })
    },
    async setMerchantPoi () {
      try {
        const { response, result } = await this.setMerchantPoiApi({
          merchantName: this.store.store_name,
          provinceId: this.province.id,
          province: this.province.chineseName,
          cityId: this.city.id,
          city: this.city.chineseName,
          countryId: this.country.id,
          country: this.country.chineseName,
          address: this.store.address,
          merchantPhone: this.store.business_phone,
          longitude: this.store.lng,
          latitude: this.store.lat,
        })
        if (response.status === 200 && result.code === 0) {
          this.$router.replace({
            name: 'payMsgFirstWait',
            query: {},
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '创建虚拟门店失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '创建虚拟门店失败',
          content: `错误：${err}`,
        })
      }
    },
    // 展示同意条款
    showModal () {
      this.is_agree = true
    },
    // 关闭同意条款
    closeModal () {
      this.is_agree = false
    },
    /*
    *  改变省
    *  q 省对象
    * */
    changeprovince (q) {
      this.province = q
      this.city_list = []
      this.country_list = []
      this.city = {}
      this.country = {}
      this.getAdress(2)
    },
    /*
    *  改变城市
    *  q 城市对象
    * */
    changecity (q) {
      this.country_list = []
      this.city = q
      this.getAdress(3)
      this.country = {}
    },
    /*
   *  改变区
   *  q 区对象
   * */
    changecountry (q) {
      this.country = q
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
      if (level === 3) {
        params.parentId = this.city.id
      }
      try {
        const { response, result } = await this.getLocationApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            if (level === 1) {
              this.province_list = result.data
            }
            if (level === 2) {
              this.city_list = result.data
            }
            if (level === 3) {
              this.country_list = result.data
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
    // 更新step字段
    async updateUserInfo () {
      try {
        const { response, result } = await this.fetchUserInfoApi()
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('updateUser', result.data)
          if (this.currentUser.step === 3 || this.currentUser.step === 4) {
            this.getAdress(1) // 获取地址省列表
            this.store = JSON.parse(JSON.stringify(this.currentUser.store))
            if (this.store.store_name && this.store.store_name.length > 20) {
              this.cannot_edit_name = false
            } else {
              this.cannot_edit_name = true
            }
          } else {
            this.redirectFun()
          }
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
          this.getAdress(1) // 获取地址省列表
          this.store = JSON.parse(JSON.stringify(this.currentUser.store))
          if (this.store.store_name && this.store.store_name.length > 20) {
            this.cannot_edit_name = false
          } else {
            this.cannot_edit_name = true
          }
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
.checkbox
  margin-left 150px
  label:hover
    text-decoration underline
    color #FFBB29
.tooltip-text
  margin-left 12px
  font-size 12px
  line-height 16px
  color #FF0000
.middle
  margin 0 10px
.label
  flex 0 0 120px !important
label.label
  font-size 13px
.form-wrapper .field
  width 520px
.form-wrapper .field.w-all
  width 755px
.form-wrapper .field.full-width
  width 100%
.cs
  padding 12px 0 !important
  border-bottom none !important
.con
  font-size 14px
  color #ddd
  vertical-align bottom
  margin-left 10px
.tip-description
  font-size 14px
  line-height 16px
  color red
  white-space nowrap
  margin-top 0px
.btn-wrapper
  text-align center
</style>
