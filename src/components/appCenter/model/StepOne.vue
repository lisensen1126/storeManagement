<!--活动报名步骤一-->
<template lang="pug">
  .model
    h2 确认物料接收地址信息，等待寄送物料
      a.more(@click="goDetail()") 更多活动详情
    .form-wrapper(v-show="step == 1")
      .field-group
        .field.is-horizontal
          label.label 门店名称
          .field-content {{info.store_name}}
        .field.is-horizontal
          label.label 联系人名称
          custom-input(v-model.trim="info.contacts", input-type="hasCount", :validator="$v.info.contacts", placeholder="请输入姓名", error-info="请输入姓名", maxlength=10)
            span(slot="countInfo") {{info.contacts.length}}/10
        .field.is-horizontal
          label.label 联系人电话
          custom-input(v-model.trim="info.mobile", input-type="hasCount", :validator="$v.info.mobile", placeholder="请输入联系人电话", error-info="请输入联系人电话", maxlength=11)
            span(slot="countInfo") {{info.mobile.length}}/11
        .field.is-horizontal
          label.label 所在地区
          .field-content {{info.province_name + ' ' +  info.city_name + ' ' + info.area_name}}
        .field.is-horizontal
          label.label 详细地址
          custom-text(v-model.trim="info.address", input-type="hasCount", :validator="$v.info.address", placeholder="请输入详细地址", error-info="请输入详细地址", maxlength=50)
            span.count-info(slot="countInfo") {{info.address.length}}/50
    .form-wrapper(v-show="step == 2")
      .box
        .line 门店名称：  {{info.store_name}}
        .line 联系人姓名：{{info.contacts}}
        .line 联系人手机：{{info.mobile}}
        .line 所在区域：  {{info.province_name + info.city_name + info.area_name}}
        .line 详细地址：  {{info.address}}
    .btn-wrapper
      .info(v-if="step == 2") 点击确认即视为参与活动，收到提交信息后，2个工作日内处理物料制作打印寄送
      .button-group
        a.button.primary(v-show="step == 1", @click="showSureBtn()") 我确认信息正确
        a.button.primary(v-show="step == 2", @click="dataView()") 我确认信息正确
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomText from '@/components/generics/form/CustomText'
import { validationMixin } from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import Api from '@/mixins/modules/AppCenter'
export default {
  name: 'stepOne',
  components: {
    CustomInput,
    CustomText,
  },
  mixins: [validationMixin, Api],
  data () {
    return {
      info: {
        contacts: '',
        mobile: '',
        address: '',
      },
      step: 1,
    }
  },

  // 表单验证
  validations: {
    info: {
      contacts: {
        required,
      },
      mobile: {
        required,
        validate (val) {
          return /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(val)
        },
      },
      address: {
        required,
      },
    },
  },

  methods: {
    // 获取报名信息
    async fetchDetail () {
      try {
        const {result, response} = await this.getActiveInfoApi()
        if (response.status === 200 && result.code === 0) {
          this.info = result.data
          result.data.mobile === '' ? this.step = 1 : this.step = 2
          this.info.step = 1
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取报名信息失败',
            content: `服务异常，请稍后再试（${result.message}）`,
          })
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 去活动介绍页
    goDetail () {
      this.$router.push({
        name: 'ActiveSignUpDetail',
      })
    },

    // 显示填写完之后的信息
    showSureBtn () {
      this.$v.$touch()
      if (this.$v.$error) {
        return false
      }
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '地址确认之后不能修改，还要继续操作吗？',
        isRejectable: 1,
        resolve: () => {
          this.saveStep()
        },
      })
    },

    // 保存
    async saveStep () {
      try {
        const {result, response} = await this.setActiveInfoApi(this.info)
        if (response.status === 200 && result.code === 0) {
          this.step = 2
        } else if (response.status === 200 && result.code === 41232) {
          this.$store.dispatch('showMessage', {
            title: '提示',
            content: result.message,
            isRejectable: 1,
            resolve: () => {
              this.$emit('stepViewOne', 1)
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: `服务异常，请稍后再试（${result.message}）`,
          })
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 预览报名信息
    dataView () {
      this.$emit('stepOne', 1)
    },
  },

  mounted () {
    this.fetchDetail()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.model
  width 100%
  height 100%
  .more
    color #409EFF
    font-size 14px
    margin-left 10px
  .more:hover
    text-decoration underline
  .field-content
    font-size 13px
  .box
    width 400px
    min-height 160px
    border 1px solid #eee
    border-radius 4px
    padding 20px
    margin-top 40px
    margin-bottom 40px
    .line
      line-height 24px
      color #666666
      font-size 14px
  .count-info
    position absolute
    font-size 13px
    line-height 16px
    right 12px
    bottom 9px
    color placeholder
  .info
    font-size 13px
    color #999999
    margin-bottom 10px
    margin-left -156px
  .btn-wrapper
    padding: 23px 185px 0
</style>
