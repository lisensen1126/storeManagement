<template lang="pug">
  .section-layout
    agree-model(v-model="modal_show", v-if="modal_show", @resolve="getInfo")
    .content-wrapper
      h2.header-title 加入平台
        span(v-if="send.status == 1") (已加入)
        span(v-if="send.status == 2") (禁止加入)
        span(v-if="send.status == ''") (未加入)
      .form-wrapper
        .field-group
          .info-class 微信信息
          .field.is-horizontal
            label.label 微信号
            custom-input(placeholder="请输入微信号", @input="changeGrayStyle('wechat')", :isDisabled="send.status == 1 || send.status == 2" v-model="send.wechat", :validator="$v.send.wechat", error-info="请输入您的微信号", :textColor="(send.status == 1 || send.status == 2)||is_gray_style.wechat?'#c5c5c5':'#353535'")
          .info-class 银行卡信息
          .field.is-horizontal
            label.label 开户人姓名
            custom-input(placeholder="请输入真实姓名", @input="changeGrayStyle('real_name')", :isDisabled="send.status == 1 || send.status == 2" v-model="send.real_name" :validator="$v.send.real_name", error-info="请输入您的真实姓名",  :textColor="(send.status == 1 || send.status == 2)||is_gray_style.real_name?'#c5c5c5':'#353535'")
          .field.is-horizontal
            label.label
            .text 请确认开户人信息无误，信息错误将无法打款。
          .field.is-horizontal
            label.label 绑定银行卡号
            custom-input(placeholder="请输入绑定银行卡号", need-type="number", @input="changeGrayStyle('cardno')", :isDisabled="send.status == 1 || send.status == 2" v-model="send.cardno", :validator="$v.send.cardno", error-info="请输入您的绑定银行卡号", :textColor="(send.status == 1 || send.status == 2)||is_gray_style.cardno?'#c5c5c5':'#353535'")
          .field.is-horizontal
            label.label
            .text 请确认银行卡号信息无误，信息错误将无法打款。
          .field.is-horizontal.select-100
            label.label 开户总行
            custom-select.width-100(:list="main_bank_list", :isDisabled="send.status == 1 || send.status == 2", v-model="main_bank", @input="changeGrayStyle('main_bank')", :validator="$v.main", error-info="请选择开户总行", :show-search="true", :textColor="(send.status == 1 || send.status == 2)||is_gray_style.main_bank?'#c5c5c5':'#353535'")
          .field.is-horizontal
            label.label
            .text 请确认开户总行信息无误，信息错误将无法打款。
          .field.is-horizontal
            label.label 开户城市
            .city-line
              custom-select(:list="bank_province_list", v-model="bank_province",:isDisabled="send.status == 1 || send.status == 2", @input="changeGrayStyle('bank_province')", :validator="$v.bank_province", error-info="请选择省", :show-search="true", :textColor="(send.status == 1 || send.status == 2)||is_gray_style.bank_province?'#c5c5c5':'#353535'")
              custom-select.middle(:list="bank_city_list", :isDisabled="send.status == 1 || send.status == 2", v-model="bank_city", @input="changeGrayStyle('bank_city')", :validator="$v.bank_city", error-info="请选择城市", :show-search="true", :textColor="(send.status == 1 || send.status == 2)||is_gray_style.bank_city?'#c5c5c5':'#353535'")
          .field.is-horizontal
            label.label
            .text 请确认开户城市信息无误，信息错误将无法打款。
          .field.is-horizontal.select-100
            label.label 开户支行
            .branch-bank(v-if="!branch_bank_choose")
              custom-input.custom-input(v-model.trim="branch_bank.branch", @input="changeGrayStyle('branch_bank')", :isDisabled="send.status == 1 || send.status == 2", :validator="$v.branch_bank", placeholder="请输入开户支行", error-info="开户支行必填", :textColor="(send.status == 1 || send.status == 2)||is_gray_style.branch_bank?'#c5c5c5':'#353535'")
              span.branch-tip(@click="toggleBranch(true)", v-show="!send.status")  选择支行
            .branch-bank(v-if="branch_bank_choose")
              custom-select(:list="branch_bank_list", v-model="branch_bank", @input="changeGrayStyle('branch_bank')", :isDisabled="send.status == 1 || send.status == 2", :validator="$v.branch_bank", error-info="请选择开户支行", :show-search="true", nameField="branch", :textColor="(send.status == 1 || send.status == 2)||is_gray_style.branch_bank?'#c5c5c5':'#353535'")
              span.branch-tip(@click="toggleBranch(false)", v-show="!send.status")  没有支行？
          .field.is-horizontal
            label.label
            .text 请确认开户支行信息无误，信息错误将无法打款。
          .field.is-horizontal
            label.label
            .checkbox
              input(type="checkbox", id="rep", v-model="is_agree", :disabled="send.status == 1 || send.status == 2")
              label(for="rep") 已阅读并同意
              span.font-12(@click="showModel") 《平台服务协议》
          .field.is-horizontal
            label.label
            .box 
              span 注：1、用于平台订单分账，微信分账将收取千分之六的手续费； <br>
              span(style="margin-left:26px;margin-top:5px;display:inline-block") 2、姓名需为绑定银行卡账户户主姓名；
              span(style="margin-left:26px;margin-top:5px;display:inline-block") 3、系统会默认展示已开通支付信息，如无更改可直接使用；如有更改需要，可重新编辑，提交信息请确保准确。
           
      .btn-wrapper
        .button-group(v-if="send.status != 2")
          a.button.primary.large(v-if="!send.status && hasFilledAll()", @click="joinConfirm") 加入平台
          a.button.large.is-disabled(v-if="!send.status && !hasFilledAll()") 加入平台
          a.button.large(v-if="send.status == 1", @click="outPlatform") 退出平台
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import Api from '@/mixins/modules/workbench'
import OpenStore from '@/mixins/modules/OpenStore'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import AgreeModel from '@/components/workbench/model/AgreeModel'
export default {
  name: 'JoinPlatform',
  mixins: [Api, OpenStore, validationMixin],
  components: {
    CustomInput,
    CustomSelect,
    AgreeModel,
  },
  data () {
    return {
      send: {
        real_name: '',
        wechat: '',
        status: '',
        cardno: '',
      },
      branch_bank_list: [], // 开户支行列表
      branch_bank: {},  // 开户支行
      main_bank_list: [], // 开户总行列表
      main_bank: {},  // 开户总行
      branch_bank_choose: true, // 开户支行使用选择的方式还是输入的方式
      bank_province_list: [],  // 开户行省份列表
      bank_province: {},  // 开户行的省份
      bank_city_list: [],  // 开户行城市列表
      bank_city: {},  // 开户行的城市
      is_agree: false,
      modal_show: false,
      is_gray_style: { // 填充的字是否为灰色
        main_bank: true,
        branch_bank: true,
        wechat: true,
        cardno: true,
        real_name: true,
        bank_province: true,
        bank_city: true,

      },
    }
  },
  validations: {
    send: {
      real_name: {
        required,
      },
      wechat: {
        required,
      },
      cardno: {
        required,
      },
    },
    bank_province: {
      required,
    },
    bank_city: {
      required,
    },
    branch_bank: {
      required,
    },
  },
  methods: {
    // 改变灰色样式
    changeGrayStyle (name) {
      this.is_gray_style[name] = false
      if (name === 'main_bank' || name === 'bank_city') {
        this.getBranchList(0)
      }
      if (name === 'bank_province') {
        this.getAdress(2, 1)
      }
    },
    // 验证是否已经填写了全部信息
    hasFilledAll () {
      return (this.send.real_name && this.send.wechat && this.send.cardno && this.is_agree &&
            this.main_bank.id && this.main_bank.name &&
            this.branch_bank.branch &&
            this.bank_province.id && this.bank_province.name &&
            this.bank_city.id && this.bank_city.name)
    },
    // 切换支行输入方式
    toggleBranch (bool) {
      this.branch_bank_choose = bool
      this.branch_bank = {}
    },
    // 获取加入平台信息 做一些状态判断
    async fetchDetail () {
      try {
        const { response, result } = await this.storePlatformDetailApi()
        if (response.status === 200 && result.code === 0) {
          if (!result.data.status) {
            this.send.status = ''
            this.is_agree = false
            await this.fetchBandCardDetail()
          } else {
            let data = result.data
            this.send = {
              real_name: data.real_name,
              wechat: data.wechat,
              status: data.status,
              cardno: data.cardno,
            }
            this.bank_city = {
              name: data.city_name,
              id: data.city_code,
            }
            this.bank_province = {
              name: data.province_name,
              id: data.province_code,
            }
            this.main_bank = {
              name: data.bank_name,
              id: data.bank_code,
            }
            this.branch_bank = {
              branch: data.branch_name,
              id: data.branch_code,
            }
            if (result.data.status === 1) this.is_agree = true
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取加入信息失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        console.log('%c 加入平台的详细信息', 'background: #000; color: red', err)
      }
    },
   // 获取总行列表
    async getMainList () {
      try {
        const {response, result} = await this.getBankInfoApi()
        if (response.status === 200) {
          if (result.code === 0) {
            this.main_bank_list = result.data
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
         /*
      * 获取银行卡列表对应的省市
      *  @level 省市区
      *  @clear 是否清除数据
      * */
    async getAdress (level, clear) {
      // 先清除支行信息
      if (clear) {
        this.branch_bank_list = []
        this.branch_bank = {}
        this.bank_city = {}
        if (level === 1) {
          this.is_gray_style.bank_province = false
        } else {
          this.is_gray_style.bank_city = false
        }
      }
      let params = {
        level: level,
      }
      if (level === 2) {
        params.parentId = this.bank_province.id
      }
      try {
        const {response, result} = await this.getCityListApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            if (level === 1) {
              this.bank_province_list = result.data
            }
            if (level === 2) {
              this.bank_city_list = result.data
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
        /**
     * 获取开户支行列表
     */
    async getBranchList (type) {
      // 清除支行信息
      if (!type) {
        this.branch_bank_list = []
        this.branch_bank = {}
      }

      // 如果没有选择总行或者城市，则不获取列表
      if (!this.bank_city.id || !this.main_bank.id) {
        console.log(new Date().getTime())
        console.log('quit')
        return
      }
      try {
        const {response, result} = await this.getBankBranchApi({
          cityId: this.bank_city.id,
          branchId: this.main_bank.id,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.branch_bank_list = result.data
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
    // 获取银行卡
    async fetchBandCardDetail () {
      try {
        const { response, result } = await this.getBandCardApi()
        if (response.status === 200 && result.code === 0) {
          let data = result.data
          this.send = {
            cardno: data.cardno,
            real_name: data.name,
          }
          this.main_bank = {
            name: data.bankName,
            id: data.bankId,
          }
          this.branch_bank = {
            branch: data.branchName,
            id: data.branchId,
          }
          this.bank_province = {
            id: data.bankProvinceId,
          }
          this.bank_city = {
            id: data.bankCityId,
          }
          await this.getAdress(1)
          // 下面这两步是因为在fetchBandCardDetail方法中，
          // 后台只能返回省份和市的id，不能返回名字，
          // 所以无法直接将数据填充，需要循环本地的列表，进行填充
          this.bank_province = this.bank_province_list.filter(item => {
            return item.id === this.bank_province.id
          })[0]
          await this.getAdress(2)
          this.bank_city = this.bank_city_list.filter(item => {
            return item.id === this.bank_city.id
          })[0]
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取加入信息失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        console.log('%c 加入平台的详细信息', 'background: #000; color: red', err)
      }
    },
    joinConfirm () {
      this.$store.dispatch('showMessage', {
        title: '重要提示',
        content: '提交的微信和银行卡信息请确保准确有效，否则会影响到您的账户收款结算！',
        isRejectable: 1,
        primary: '确认加入',
        secondary: '检查一下',
        resolve: () => {
          this.addPlatform()
        },
      })
    },
    // 加入平台
    async addPlatform () {
      this.$v.$touch()
      if (this.$v.$error) return false
      try {
        let data = {
          real_name: this.send.real_name,
          wechat: this.send.wechat,
          cardno: this.send.cardno,
          status: 1,
          bank_code: this.main_bank.id,
          bank_name: this.main_bank.name,
          branch_name: this.branch_bank.branch,
          branch_code: 0,
          province_code: this.bank_province.id,
          province_name: this.bank_province.name,
          city_code: this.bank_city.id,
          city_name: this.bank_city.name,
        }
        if (this.branch_bank.id) {
          data.branch_code = this.branch_bank.id
        }
        const { response, result } = await this.jionPlatformApi(data)
        if (response.status === 200 && result.code === 0) {
          this.fetchDetail()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '加入平台失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        console.log('%c 加入平台操作', 'background: #000; color: red', err)
      }
    },

    // 退出平台
    async outPlatform () {
      try {
        const { response, result } = await this.outPlatformApi()
        if (response.status === 200 && result.code === 0) {
          this.fetchDetail()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '退出平台失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        console.log('%c 退出平台操作 ', 'background: #000; color: red', err)
      }
    },

    // 弹框回调
    getInfo (e) {
      console.log(e)
      if (e === 'success') this.is_agree = true
    },

    // 显示弹框
    showModel () {
      this.modal_show = true
    },

  },
  async mounted () {
    await this.fetchDetail()
    await this.getMainList()
    await this.getBranchList(1)
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins'
@import '~@/stylus/modules/creation-modal'
.content-first
  line-height 16px
.header-title
  border-bottom 1px solid #eee
.form-wrapper .field
  width 620px
.box
  color red
  font-size 13px
.is-disabled
  cursor not-allowed
  background rgba(0, 0, 0, .05)
.text
  font-size 13px
  color #f00
.font-12
  font-size 13px
  line-height 16px
  color #5e7bff
.font-12:hover
  text-decoration underline
.info-class
  margin: 10px 0 15px 0;
  font-weight: 700;
  font-size: 14px;
.city-line
  display: flex;
  width: 500px;
  justify-content: space-between;
.select-100
  .custom-select
    width: 500px;
  .branch-bank
    width: 500px
    display: flex;
    align-items: center;
    .custom-select,.custom-input
      flex: 1  
    .branch-tip
      margin-left: 15px;
      font-size:14px;
      text-decoration : underline;
      color: #0709f5;
      cursor:pointer;
</style>
