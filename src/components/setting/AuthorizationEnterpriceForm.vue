<template lang="pug">
  .page-container
    .header 创建应用参数表单
    .section-layout
      .content-wrapper
        .form-wrapper
          .field-group
            .field.is-horizontal
              label.label 管理外部联系人Secret
              custom-input(v-model="secret", placeholder="请输入外部联系人Secret", maxlength="64" :validator="$v.secret", error-info="外部联系人Secret必填")
        .btn-wrapper
          .button-group
            a.button.primary.large(@click="saveInfo" :class="{'disabled':isSaving}") 保存
      .content-wrapper.content-wrapper-2(v-if="customer_status === 1")
        .form-wrapper
          .field-group
            .field.is-horizontal.field-width
              label.label URL
              .field-content(v-text="secret_info.url") 管理外部联系人Secret
            .field.is-horizontal
              label.label Token
              .field-content(v-text="secret_info.token") 管理外部联系人Secret
            .field.is-horizontal
              label.label EncodingAESKey
              .field-content(v-text="secret_info.encoding_aes_key") 管理外部联系人Secret
</template>

<script>
import settingApi from '@/mixins/modules/setting'
import EmptyPage from '@/components/generics/EmptyPage'
import CustomInput from '@/components/generics/form/CustomInput'
import {validationMixin} from 'vuelidate'
import {required, maxLength} from 'vuelidate/lib/validators'

export default {
  name: 'AuthorizationEnterpriceForm',
  mixins: [validationMixin, settingApi],
  components: {
    EmptyPage,
    CustomInput,
  },
  data () {
    return {
      isSaving: false,
      secret: '',
      secret_info: {},
      customer_status: null,
    }
  },
  validations: {
    secret: {
      required: (value) => {
        if (value === undefined) return false
        if (value.trim() === '') return false
        return required(value)
      },
      maxLength: maxLength(64),
    },
  },
  methods: {
    async saveInfo () {
      this.$v.$touch()
      if (this.$v.$error) return
      if (this.isSaving) return
      this.isSaving = true
      try {
        const {response, result} = await this.saveWorkAppModifyApi({
          secret: this.secret,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: result.message || '安装应用成功',
            resolve: () => {
              this.$router.push({name: 'authorizationEnterprice', params: {}})
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '安装应用失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
          })
        }
        this.isSaving = false
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '安装应用失败',
          content: `服务异常，请稍后再试 ${err}`,
        })
        this.isSaving = false
      }
    },
    // 获取企业微信授权详情
    async getWorkAppDetail () {
      try {
        const {response, result} = await this.getWorkAppDetailApi({})
        if (response.status === 200) {
          this.secret = result.data.secret
          this.customer_status = result.data.customer_status
          if (result.data.customer_status === 1) {
            this.secret_info = {
              token: result.data.token,
              encoding_aes_key: result.data.encoding_aes_key,
              url: result.data.url,
            }
          } else {
            this.secret_info = {}
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取管理外部联系人 Secret 失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取管理外部联系人 Secret 失败',
          content: `服务异常，请稍后再试 ${err}`,
        })
      }
    },
  },
  mounted () {
    this.getWorkAppDetail()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'

.page-container
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
.header
  font-size 18px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: #3D424C;
  line-height: 25px;
  padding 21px 0 22px 121px
  background-color #FFFFFF
.form-header
  .form-header__content
    font-size: 16px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: #3D424C
    line-height: 22px;
    margin  31px 0 0 30px
  .form-header__desc
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #3D424C;
    line-height:20px;
    margin 10px 0 0 30px
    a
      color #637BFF
.field.is-horizontal .label
  flex 0 0 140px
  margin-right 15px
.field.is-horizontal .control
  flex 0 0 295px
  margin 0
.field.is-horizontal .control-copy
  flex 0 0 239px
  position relative
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:#3D424C;
  height 36px
  line-height:36px;
  & input
    border none!important
    box-shadow none!important
    padding 0 10px 0 0
label.label
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #3D424C;
  line-height: 20px;
.form-wrapper
  border none
  padding 20px 0 0 30px
  .field-group
    padding 0
    border none
.form-wrapper .field
  width 481px
.form-wrapper .field.full-width
  width 100%
.content-wrapper
  margin: 30px 121px;
.btn-wrapper
  padding: 23px 30px 0;
.button-group
  .tips
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:#EC3B3B;
    line-height:20px;
    margin 0 0 0 20px
.field-corpId
  .link
    flex-grow 1
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: #3D424C;
    line-height:20px;
    word-break:break-all;
    overflow:auto;
.content-wrapper-2
  margin-top 0
.field-width
  width 100% !important
  .field-content
    word-break break-all
    color #3d424c
</style>

