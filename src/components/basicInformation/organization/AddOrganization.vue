<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title(v-if="id == undefined") 添加部门
      .slide-title(v-if="id != undefined") 编辑部门

      .field-group
        .field
          label.label 部门名称
            custom-input.field-org(placeholder="部门名称",  maxlength="10" :error-info="!$v.orgInfo.dpName.required ? '请填写部门名称（最长为10个字符）': !$v.orgInfo.dpName.maxLength ? '部门名称不能超过10个字符' : ''", v-model="orgInfo.dpName", :validator="$v.orgInfo.dpName")

    .field
      button.button.large.primary(@click="addOrg" :class="{'disabled':isSaving}") 确定
</template>

<script>
  import DatePicker from '@/components/generics/form/DatePicker'
  import CustomInput from '@/components/generics/form/CustomInput'
  import StaffPicker from '@/components/generics/form/StaffPicker'
  import organization from '@/mixins/modules/organization'
  import {validationMixin} from 'vuelidate'
  import {required, maxLength, minLength} from 'vuelidate/lib/validators'
  import VehicleSelector from '@/components/generics/VehicleSelector'
  import imageScale from '@/mixins/utilities/imageScale'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  export default {
    name: 'AddOrganization',
    mixins: [organization, validationMixin, imageScale],
    components: {
      CustomInput,
      CustomSelect,
      StaffPicker,
      DatePicker,
      VehicleSelector,
    },
    validations: {
      orgInfo: {
        dpName: {
          required: (value) => {
            if (value === undefined) return false
            if (value.trim() === '') return false
            return required(value)
          },
          maxLength: maxLength(10),
          minLength: minLength(1),
        },
      },
    },
    props: {
      id: String,
      pid: String,
    },
    data () {
      return {
        orgInfo: {},
        isSaving: false,
      }
    },
    watch: {
      id: {
        handler (id) {
        },
        immediate: true,
      },
    },
    methods: {
      addOrg: function () {
        if (this.isSaving) return
        this.$v.$touch()
        if (this.$v.$error) {
          return
        }
        if (this.id === undefined) {
          this.saveOrg()
        } else {
          this.updateOrg()
        }
      },
      // 添加接口
      async saveOrg () {
        this.isSaving = true
        var self = this
        try {
          const {result, response} = await this.saveOrganization({
            dpParentid: self.pid,
            dpName: self.orgInfo.dpName,
          })
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            self.successToast('添加')
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '添加部门失败',
              content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
            })
          }
          this.isSaving = false
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加部门失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
          this.isSaving = false
        }
      },
      // 更新借 口
      async updateOrg () {
        this.isSaving = true
        var self = this
        try {
          const {result, response} = await this.updateOrganization({
            dpId: self.orgInfo.dpId,
            dpName: self.orgInfo.dpName,
          })
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            self.successToast('编辑')
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '更新部门失败',
              content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
            })
          }
          this.isSaving = false
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '更新部门失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
          this.isSaving = false
        }
      },
      // 查询部门信息
      async getOrgInfo () {
        var self = this
        try {
          const {result, response} = await this.fetchOrganization(self.id)
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            self.orgInfo = result
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取部门信息失败',
              content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取部门信息失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
      },
      successToast: function (info) {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'success',
          title: '成功',
          content: info + '部门' + '成功',
          resolve: () => {
            this.$emit('success')
          },
        })
      },
    },
    mounted () {
      if (this.id !== undefined) {
        this.getOrgInfo()
      }
    },
  }
</script>
<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .text
    height 16px
    font-size 13px
    font-family PingFangSC-Regular
    color rgba(18,18,18,1)
    line-height 16px
    margin-top 17px
  .field-org
    margin-top 5px
</style>



