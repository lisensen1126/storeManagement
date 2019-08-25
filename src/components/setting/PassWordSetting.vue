<template lang="pug">
  .section-layout
    .content-wrapper
      h2 修改密码
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 原密码
            custom-input(v-model="old_pw" :validator="$v.old_pw", placeholder="请输入原密码", error-info="密码是6-18位数字、字母组合", need-type="number_letter", type="password")
          .field.is-horizontal
            label.label 新密码
            custom-input(v-model="new_pw", :validator="$v.new_pw", placeholder="请输入新密码", error-info="密码是6-18位数字、字母组合", need-type="number_letter", type="password")
          .field.is-horizontal
            label.label 确认密码
            custom-input(v-model="new_pwa", :validator="$v.new_pwa", placeholder="请输入确认密码", error-info="与新密码不一致且新密码是6-18位数字、字母组合", need-type="number_letter", type="password")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData") 保存
</template>

<script>
  import settingApi from '@/mixins/modules/setting'
  import fileUploader from '@/mixins/utilities/fileUploader'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomTextarea from '@/components/generics/form/CustomTextarea'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import RichEditor from '@/components/generics/form/RichEditor'
  import UploadPic from '@/components/generics/form/UploadPic'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  import { mapGetters } from 'vuex'
  import userMixin from '@/mixins/modules/user'

  export default {
    name: 'serviceAdd',
    mixins: [validationMixin, settingApi, fileUploader, userMixin],
    components: {
      CustomInput,
      UploadPic,
      RichEditor,
      CustomSelect,
      CustomTextarea,
    },
    computed: {
      ...mapGetters({
        currentUser: 'currentUser',
      }),
    },
    data () {
      return {
        old_pw: '', // 原密码
        new_pw: '', // 新密码
        new_pwa: '', // 二次新密码
        isLoading: false, // 是否加载
      }
    },
    validations: {
      old_pw: {
        required,
        validate (val) {
          return /^[a-zA-Z\d+]{6,18}$/.test(val)
        },
      },
      new_pw: {
        required,
        validate (val) {
          return /^[a-zA-Z\d+]{6,18}$/.test(val)
        },
      },
      new_pwa: {
        required,
        validate (val) {
          if (this.new_pw === this.new_pwa) {
            return true
          } else {
            return false
          }
        },
      },
    },
    methods: {
      // 点击保存操作
      inspectData () {
        if (this.isLoading) {
          return false
        }
        this.$v.$touch()
        if (this.$v.$error) {
          return
        }
        // 保存
        this.commitData()
      },
      // 保存修改密码
      async commitData () {
        // console.log(this.old_pw, this.new_pw, this.new_pwa)
        try {
          this.isLoading = true
          const {response, result} = await this.updatePswd({
            id: this.currentUser.id,
            password: this.new_pw,
            old_password: this.old_pw,
          })
          if (response.status === 200) {
            if (result.code && result.code !== 0) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '修改密码失败',
                content: `${result.message}`,
              })
              this.isLoading = false
              return false
            }
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '修改密码成功',
              resolve: () => {
                this.logOut()
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改密码失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改密码失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.isLoading = false
      },
      // 登出用户
      async logOut () {
        try {
          const {response, result} = await this.logout()
          if (response.status === 200) {
            this.$store.dispatch('clearUser')
            this.$router.push({
              name: 'login',
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '登出失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch ({err}) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '登出失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      // console.log(this.currentUser)
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
  .picture-description
    font-size 12px
    line-height 16px
    color lightGrey
    white-space nowrap
    margin-top 8px
  .rich-eidtor-description
    margin-bottom 8px
  .field-content
    font-size: 13px
    line-height: 16px
    color: #353535
</style>
