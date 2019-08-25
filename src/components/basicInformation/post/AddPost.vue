<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title(v-if="obj == undefined") 添加岗位
      .slide-title(v-if="obj != undefined") 编辑岗位

      .field-group
        .field
          label.label 岗位名称
            custom-input.field-org(placeholder="岗位名称", maxlength="10" :error-info="!$v.info.jobName.required ? '请填写岗位名称（最长为10个字符）': !$v.info.jobName.maxLength ? '岗位名称不能超过10个字符' : ''", v-model="info.jobName", :validator="$v.info.jobName")

    .field
      button.button.large.primary(@click="addOrg" :class="{'disabled':isSaving}") 确定
</template>

<script>
  import DatePicker from '@/components/generics/form/DatePicker'
  import CustomInput from '@/components/generics/form/CustomInput'
  import StaffPicker from '@/components/generics/form/StaffPicker'
  import post from '@/mixins/modules/post'
  import {validationMixin} from 'vuelidate'
  import {required, maxLength, minLength} from 'vuelidate/lib/validators'
  import VehicleSelector from '@/components/generics/VehicleSelector'
  import imageScale from '@/mixins/utilities/imageScale'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  export default {
    name: 'AddPost',
    mixins: [post, validationMixin, imageScale],
    components: {
      CustomInput,
      CustomSelect,
      StaffPicker,
      DatePicker,
      VehicleSelector,
    },
    validations: {
      info: {
        jobName: {
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
      obj: Object,
    },
    data () {
      return {
        info: {},
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
        if (this.obj === undefined) {
          this.save()
        } else {
          this.update()
        }
      },
      // 添加接口
      async save () {
        this.isSaving = true
        var self = this
        try {
          const {result, response} = await this.savePost({
            jobName: self.info.jobName,
          })
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            self.successToast('添加')
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '添加岗位失败',
              content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
            })
          }
          this.isSaving = false
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加岗位失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
          this.isSaving = false
        }
      },
      // 更新借口
      async update () {
        this.isSaving = true
        var self = this
        try {
          const {result, response} = await this.updatePost({
            jobId: self.info.jobId,
            jobName: self.info.jobName,
          })
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            self.successToast('更新')
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '更新岗位失败',
              content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
            })
          }
          this.isSaving = false
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '更新岗位失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
          this.isSaving = false
        }
      },
      successToast: function (info) {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'success',
          title: '成功',
          content: info + '岗位信息成功',
          resolve: () => {
            this.$emit('success')
          },
        })
      },
    },
    mounted () {
      this.info = {...this.obj}
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



