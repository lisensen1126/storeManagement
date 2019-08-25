<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title(v-if="obj != undefined") 编辑员工
      .slide-title(v-if="obj == undefined") 新增员工

      .field-group.is-horizontal
        .field.field-input
          label.label 员工姓名
          custom-input(placeholder="请输入员工姓名",  maxlength="20" :error-info="!$v.addemployeeInfo.memUsername.required ? '请填写员工姓名（最长为20个字符）': !$v.addemployeeInfo.memUsername.maxLength ? '员工姓名不能超过20个字符' : !$v.addemployeeInfo.memUsername.minLength ? '员工姓名不能少于2个字符' : ''", v-model="addemployeeInfo.memUsername", :validator="$v.addemployeeInfo.memUsername")

      .field
        label.label 员工照片
        .control.image-wrapper
          .upload-pic
            upload-img-model(v-model="addemployeeInfo.memFace", img-type="avatar" :has-second-action="false")

      .field-group.is-horizontal
        .field.chosex
          label.label.sex 性别
          div.type-item.di
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
          custom-select(v-model='addemployeeInfo.post', ref="postSelect" :list="postList", nameField="jobName", :validator="$v.addemployeeInfo.post.jobId", error-info="职位必选")

      .field-group.is-horizontal
        .field.field-input
          label.label 联系电话
          custom-input(type="text", v-model="addemployeeInfo.memMobile",  maxlength="11" placeholder="请输入手机号", :validator="$v.addemployeeInfo.memMobile", error-info="请输入正确的手机号", need-type="number")

    .field
      button.button.large.primary(@click="addEm" :class="{'disabled':isSaving}") 确定

</template>

<script>
import UploadImgModel from '@/components/basicInformation/employee/UploadImgModel'
import upLoadApi from '@/mixins/utilities/fileUploader'
import DatePicker from '@/components/generics/form/DatePicker'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import StaffPicker from '@/components/generics/form/StaffPicker'
import UploadPic from '@/components/generics/form/UploadPic'
import employee from '@/mixins/modules/employee'
import { validationMixin } from 'vuelidate'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'
import VehicleSelector from '@/components/generics/VehicleSelector'
import imageScale from '@/mixins/utilities/imageScale'
import Utils from '@/mixins/utilities/utils'
export default {
  name: 'AddsEmployee',
  mixins: [employee, validationMixin, upLoadApi, imageScale, Utils],
  components: {
    CustomInput,
    CustomSelect,
    UploadPic,
    StaffPicker,
    DatePicker,
    VehicleSelector,
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
        minLength: minLength(2),
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
      post: {
        jobId: {
          required,
        },
      },
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
        memGender: '1',
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
    onOrgChanged (item) {
      this.loadDeptList(item)
    },
    addEm: function () {
      if (this.isSaving) return
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      // 模态框消失重新加载数据放在请求成功后
      if (this.obj === undefined) {
        this.getStoreCount(1)
      } else {
        this.getStoreCount(2)
      }
    },
    /**
     * 获取员工已在部门
     * @type 1: 添加, 2:编辑
     */
    async getStoreCount (type) {
      try {
        const { response, result } = await this.getStoreCountApi({ memMobile: this.addemployeeInfo.memMobile })
        if (response.status === 200 && result.code === 0) {
          // 如果 count> 0: 表示该员工在别的门店添加过
          if (result.data.count) {
            if (type === 1) {
              this.$store.dispatch('showMessage', {
                title: '提示',
                content: `该员工已在${result.data.count}家门店存在，如果在本店重复创建，将沿用之前的名称、头像、角色、岗位，确认新建吗？`,
                isRejectable: 1,
                resolve: () => {
                  this.addApi()
                },
              })
            } else if (type === 2) {
              this.$store.dispatch('showMessage', {
                title: '提示',
                content: `如果在本店修改员工名称、头像、角色、岗位信息，该员工在${result.data.count}家门店信息将同步修改，确认提交吗？`,
                isRejectable: 1,
                resolve: () => {
                  this.updateApi()
                },
              })
            }
          } else {
            if (type === 1) {
              this.addApi()
            } else if (type === 2) {
              this.updateApi()
            }
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取员工已在部门失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取员工已在部门失败',
          content: `错误: ${err}`,
        })
      }
    },
    async addApi () {
      this.isSaving = true
      try {
        const { response, result } = await this.saveEmployee({
          memUsername: this.addemployeeInfo.memUsername,
          memFace: this.addemployeeInfo.memFace,
          memGender: this.addemployeeInfo.memGender,
          memMobile: this.addemployeeInfo.memMobile,
          // orgId: this.addemployeeInfo.org.dpId,
          dpIdList: this.addemployeeInfo.dept.dpId,
          memRole: this.addemployeeInfo.role.roleName,
          memJob: this.addemployeeInfo.post.jobName,
        })
        if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
          this.successToast('添加')
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加员工信息失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
          })
        }
        this.isSaving = false
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '添加员工信息失败',
          content: `服务异常，请稍后再试 ${err}`,
        })
        this.isSaving = false
      }
    },
    async updateApi () {
      this.isSaving = true
      try {
        const { response, result } = await this.updateEmployee({
          memUid: this.addemployeeInfo.memUid,
          memUsername: this.addemployeeInfo.memUsername,
          memFace: this.addemployeeInfo.memFace,
          memGender: this.addemployeeInfo.memGender,
          memMobile: this.addemployeeInfo.memMobile,
          // orgId: this.addemployeeInfo.org.dpId,
          dpIdList: this.addemployeeInfo.dept.dpId,
          memRole: this.addemployeeInfo.role.roleName,
          memJob: this.addemployeeInfo.post.jobName,
        })
        if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
          this.successToast('更新')
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '更新员工信息失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
          })
        }
        this.isSaving = false
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '更新员工信息失败',
          content: `服务异常，请稍后再试 ${err}`,
        })
        this.isSaving = false
      }
    },
    successToast: function (msg) {
      this.$store.dispatch('showMessage', {
        autoClose: true, // 控制弹框自动消失
        type: 'success',
        title: '成功',
        content: msg + '员工信息成功',
        resolve: () => {
          this.$emit('success')
        },
      })
    },
    async loadOrgList () {
      try {
        const { response, result } = await this.getOrgList({
          departmentLevel: 2,
        })
        if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
          this.orgList = result
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取组织信息失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
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
    async loadDeptList (item) {
      try {
        if (!item.dpId) return
        const { response, result } = await this.getOrgList({
          dpId: item.dpId,
        })
        if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
          // this.deptList = result && result.length > 0 ? result.filter(item => item.dpLevel === 3) : []
          this.deptList = result
          if (this.employeeInfo && this.employeeInfo.dpName && this.employeeInfo.dpName.length) {
            let dept = this.deptList.find(item => item.dpId === this.employeeInfo.dpName[0].dpId) || {}
            this.$refs.deptSelect.selectCandidate(dept)
          } else {
            let dept = this.deptList && this.deptList.length ? this.deptList[0] : {}
            this.$refs.deptSelect.selectCandidate(dept)
          }
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
    async loadRoleList () {
      try {
        const { response, result } = await this.getRoleList({
        })
        if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
          this.roleList = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取角色信息失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
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
    async loadPostList () {
      try {
        const { response, result } = await this.getPostList({})
        if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
          this.postList = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取岗位信息失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
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
    async loadEmployee () {
      try {
        const { response, result } = await this.getEmployee(this.obj.memUid)
        if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
          this.employeeInfo = result
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取员工信息失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
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
              memUid: this.employeeInfo.memUid,
              memUsername: this.employeeInfo.memUsername,
              memFace: this.employeeInfo.memFace,
              memGender: this.employeeInfo.memGender,
              memMobile: this.employeeInfo.memMobile,
            }
            // console.log('this.addemployeeInfo', this.employeeInfo)
            // console.log('this.orgList', this.orgList)
            // console.log('this.roleList', this.roleList)
            // let org = this.orgList.find(item => this.employeeInfo.dpGroup ? item.dpId === this.employeeInfo.dpGroup.dpId : false) || {}
            let org = this.orgList[0]
            this.$refs.orgSelect.selectCandidate(org)
            let role = this.roleList.find(item => this.employeeInfo.role ? item.roleId === this.employeeInfo.role.roleId : false) || {}
            this.$refs.roleSelect.selectCandidate(role)
            let post = this.postList.find(item => this.employeeInfo.job ? item.jobId === this.employeeInfo.job.jobId : false) || {}
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
  padding-top 5px
  font-size 13px
  color #eb4e38
  line-height 15px
.error-input
  border-color #eb4e38
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

