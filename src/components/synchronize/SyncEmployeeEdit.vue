<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title 同步员工
      .field-group.is-horizontal
        .field.field-input
          label.label 员工姓名
          custom-input(placeholder="请输入员工姓名",  maxlength="20" :error-info="!$v.addemployeeInfo.memUsername.required ? '请填写员工姓名（最长为20个字符）': !$v.addemployeeInfo.memUsername.maxLength ? '员工姓名不能超过20个字符' : ''", v-model="addemployeeInfo.memUsername", :validator="$v.addemployeeInfo.memUsername")

      .field
        label.label 员工照片
        .control.image-wrapper
          .upload-pic
            upload-img-model(v-model="addemployeeInfo.memFace", img-type="avatar" :has-second-action="false")

      .field-group.is-horizontal
        .field.chosex
          label.label.sex 性别
          div.type-item.di.man
            .radio
              input(type="radio", id="man", value="1", v-model="addemployeeInfo.memGender")
              label.sepcific-setting(for="man") 男
          div.type-item.di
            .radio
              input(type="radio", id="woman", value="2", v-model="addemployeeInfo.memGender")
              label.sepcific-setting(for="woman") 女
          div.type-item.di
            .radio
              input(type="radio", id="secrecy", value="0", v-model="addemployeeInfo.memGender")
              label.sepcific-setting(for="secrecy") 保密

      .field-group.is-horizontal
        .field.field-select
          label.label 组织
          custom-select(v-model='addemployeeInfo.org', ref="orgSelect" :list="orgList", nameField="dpName", :validator="$v.addemployeeInfo.org.dpId", error-info="组织必选", @input="onOrgChanged")
        .field.field-select
          label.label 部门
          custom-select(v-model='addemployeeInfo.dept', ref="deptSelect" :list="deptList", nameField="dpName", :validator="$v.addemployeeInfo.dept.dpId", error-info="部门必选")

      .field-group.is-horizontal
        .field.field-select.field-select-v
          label.label 角色
          custom-select(v-model='addemployeeInfo.role', ref="roleSelect" :list="roleList", nameField="roleName", :validator="$v.addemployeeInfo.role.roleId", error-info="角色必选")

      .field-group.is-horizontal
        .field.field-select.field-select-v
          label.label 岗位
          custom-select(v-model='addemployeeInfo.post', ref="postSelect" :list="postList", nameField="jobName")

      .field-group.is-horizontal
        .field.field-input
          label.label 联系电话
          custom-input(type="text", v-model="addemployeeInfo.memMobile", need-type='number',  maxlength="11" placeholder="请输入手机号", :validator="$v.addemployeeInfo.memMobile", error-info="请输入正确的手机号")

    .field
      button.button.large.primary(@click="addEm" :class="{'disabled':isSaving}") 同步

</template>

<script>
  import UploadImgModel from '@/components/basicInformation/employee/UploadImgModel'
  import upLoadApi from '@/mixins/utilities/fileUploader'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import UploadPic from '@/components/generics/form/UploadPic'
  import employee from '@/mixins/modules/employee'
  import synchronize from '@/mixins/modules/synchronize'
  import {validationMixin} from 'vuelidate'
  import {required, maxLength, minLength} from 'vuelidate/lib/validators'
  import imageScale from '@/mixins/utilities/imageScale'
  import Utils from '@/mixins/utilities/utils'
  export default {
    name: 'SyncEmployeeEdit',
    mixins: [employee, synchronize, validationMixin, upLoadApi, imageScale, Utils],
    components: {
      CustomInput,
      CustomSelect,
      UploadPic,
      UploadImgModel,
    },
    validations: {
      addemployeeInfo: {
        memUsername: {
          required: (value) => {
            if (value === undefined) return false
            if (value.trim() === '') return false
            return required(value)
          },
          maxLength: maxLength(20),
          minLength: minLength(1),
        },
        org: {
          dpId: {
            required,
          },
        },
        dept: {
          dpId: {
            required,
          },
        },
        role: {
          roleId: {
            required,
          },
        },
        // post: {
        //   jobId: {
        //     required,
        //   },
        // },
        memMobile: {
          required,
          validate (val) {
            return /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(val)
          },
        },
      },
    },
    props: {
      obj: Object,
    },
    data () {
      return {
        addemployeeInfo: {
          memGender: 0,
        },
        orgList: [],
        deptList: [],
        roleList: [],
        postList: [],
        type: [],
        isSaving: false,
      }
    },
    watch: {
    },
    methods: {
      // 选择组织
      onOrgChanged (item) {
        this.loadDeptList(item)
      },
      // 点击同步按钮
      addEm: function () {
        if (this.isSaving) return
        this.$v.$touch()
        if (this.$v.$error) {
          return
        }
        // 模态框消失重新加载数据放在请求成功后
        this.addApi()
      },
      // 同步员工接口（新增员工接口）
      async addApi () {
        this.isSaving = true
        try {
          const {response, result} = await this.saveEmployee({
            xf_id: this.obj.id,
            memUsername: this.addemployeeInfo.memUsername,
            memFace: this.addemployeeInfo.memFace,
            memGender: this.addemployeeInfo.memGender,
            memMobile: this.addemployeeInfo.memMobile,
            dpIdList: this.addemployeeInfo.dept.dpId,
            memRole: this.addemployeeInfo.role.roleName,
            memJob: this.addemployeeInfo.post.jobName,
          })
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '同步员工信息成功',
              resolve: () => {
                this.$emit('success')
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '同步员工信息失败',
              content: `${result.message}`,
            })
          }
          this.isSaving = false
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '同步员工信息失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
          this.isSaving = false
        }
      },
      // 组织列表接口
      async loadOrgList () {
        try {
          const {response, result} = await this.getOrgList({
            departmentLevel: 2,
          })
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            this.orgList = result
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取组织信息失败',
              content: `${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取组织信息失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
      },
      // 部门列表接口
      async loadDeptList (item) {
        try {
          if (!item.dpId) return
          const {response, result} = await this.getOrgList({
            dpId: item.dpId,
          })
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            // this.deptList = result && result.length > 0 ? result.filter(item => item.dpLevel === 3) : []
            this.deptList = result
            let dept = this.deptList && this.deptList.length ? this.deptList[0] : {}
            this.$refs.deptSelect.selectCandidate(dept)
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取部门信息失败',
              content: `${result.message}`,
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
      // 角色列表接口
      async loadRoleList () {
        try {
          const {response, result} = await this.getRoleList({
          })
          if (response.status === 200 && result.code === 0) {
            this.roleList = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取角色信息失败',
              content: `${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取角色信息失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
      },
      // 岗位列表接口
      async loadPostList () {
        try {
          const {response, result} = await this.getPostList({})
          if (response.status === 200 && result.code === 0) {
            this.postList = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取岗位信息失败',
              content: `${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取岗位信息失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
      },
      // 员工信息详情接口
      async loadEmployee () {
        try {
          const {response, result} = await this.fetchMemberDetail({
            id: this.obj.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.employeeInfo = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取员工信息失败',
              content: `${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取员工信息失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
      },
    },
    mounted () {
      Promise.all([this.loadOrgList(), this.loadRoleList(), this.loadPostList()]).then(() => {
        if (this.obj) {
          this.loadEmployee().then(() => {
            if (this.employeeInfo) {
              this.addemployeeInfo = {
                memUid: this.employeeInfo.id,
                memUsername: this.employeeInfo.name,
                memFace: this.employeeInfo.photo,
                memGender: 0,
                memMobile: this.employeeInfo.phone,
              }
              // 默认选中角色
              let role = this.roleList.find(item => this.employeeInfo.mem_role ? item.roleName === this.employeeInfo.mem_role : false) || {}
              this.$refs.roleSelect.selectCandidate(role)
              // 默认选中岗位
              let post = this.postList.find(item => this.employeeInfo.mem_job ? item.jobName === this.employeeInfo.mem_job : false) || {}
              this.$refs.postSelect.selectCandidate(post)
            }
          })
        }
      })
    },
  }
</script>
<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .sex
    margin-right 28px
    margin-bottom 0
    line-height 19px
  .chosex
    display flex
    justify-content start
  .di
    width 60px
    display inline-block
  .error
    padding-top: 5px
    font-size: 13px
    color: #eb4e38
    line-height 15px
  .error-input
    border-color: #eb4e38
  .field-input
    width 60%
  .field-select
    width 50%
  .field-select-v
    padding-right 8px
  .upload-pic
    width 88px
    height 88px
    margin-right 8px
</style>

