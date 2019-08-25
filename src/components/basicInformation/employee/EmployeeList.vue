<template lang="pug">
  .section-layout
    .section-filter.field-group.is-horizontal.pp

      .field.keyword-wrapper.width130
        label.label 员工姓名
        custom-input(v-model="filterData.memUsername", placeholder="员工姓名", @keyupEnter="applyFilter")

      .field.keyword-wrapper.width150
        label.label 手机号
        custom-input(v-model="filterData.memMobile",need-type='number', placeholder="手机号", @keyupEnter="applyFilter")

      .field.field-role
        label.label 角色
        custom-select(v-model="filterData.role", placeholder="请选择", :list="roleList", :isNullable="true" :candidateNull="roleNull" nameField="roleName")

      .field.field-role
        label.label 部门
        custom-select(v-model="filterData.department", placeholder="请选择", :list="departmentList", :isNullable="true" :candidateNull="departmentNull" nameField="dpName")

      .field
        a.button.primary(@click="applyFilter") 查询
      .field
        a.button(@click="resetFilter") 重置
      .right-box
        .field
          a.button.primary(@click="addEmployee")
            span.add-icon
            span 添加员工
        .field.xi
          a.button(target="_blank", :href="`${root}/member/export?memMobile=${queryData.memMobile ? queryData.memMobile : ''}&memUsername=${queryData.memUsername ? queryData.memUsername : ''}&dpId=${queryData.department ? queryData.department.dpId : ''}&roleIdList=${queryData.role ? queryData.role.roleId : ''}`") 批量导出
        .field.position-relative
          el-upload(:action="`${root}/member/import`", :show-file-list="false", :on-success="handleAvatarSuccessVideo", :on-error="avatarUploadOnErrorVideo", :before-upload="beforeAvatarUploadVideo", name="excel", :with-credentials="true")
            a.button 批量导入
        .field
          a.button.primary(target="_blank", :href="`${root}/member/download`") 下载模板

    empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有员工信息")
    loading(v-if="is_loading")

    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table

          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")

          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .content-item(v-text="item.memUsername" :title="item.memUsername")
              td
                .multi-content-td.has-image
                  .left-image.round
                    img(v-if="item.faceLoadedUrl" :src="item.faceLoadedUrl")
                    img(v-if="!item.faceLoadedUrl" :src="getFace(item)")
              td
                .content-item(:title="item.dpName | getOrgName") {{item.dpName | getOrgName}}
              td
                .content-item(:title="item.jobList | getPostName") {{item.jobList | getPostName}}
              td
                .content-item(:title="item.roleList | getRoleName") {{item.roleList | getRoleName}}
              td
                .content-item(v-if="item.memGender==1") 男
                .content-item(v-if="item.memGender==2") 女
                .content-item(v-if="item.memGender==0") 保密
              td
                .content-item(v-text="item.memMobile")
              td
                .content-item(v-text="item.recommendFew")
              td
                .content-item.switch(:class="{'disabled':item.memRole!='技师'}")
                  input(type="checkbox", :id="item.memUid", :disabled="item.memRole!='技师'", :checked="item.show_status==1&&item.memRole=='技师'", @change="changeShowStatus(item,index)")
                  label(:for="item.memUid")
              td
                .operation-td
                  a.operation-link.bian( @click="authoritySet(item)") 权限设置
                  a.operation-link.bian( @click="editEmployee(item)") 编辑
                  a.operation-link.bian( @click="delEmployee(item)") 删除

      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")

    slide-out-modal(v-if="slideVisible", @input="toggleSidePannel")
      add-employee(@success="additionHandler",  :obj="obj",)

</template>

<script>
  import AddEmployee from '@/components/basicInformation/employee/AddEmployee'
  import Pagination from '@/components/generics/Pagination'
  import DatePicker from '@/components/generics/form/DatePicker'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import StaffPicker from '@/components/generics/form/StaffPicker'
  import filterTools from '@/mixins/utilities/filterTools'
  import imageScale from '@/mixins/utilities/imageScale'
  import employee from '@/mixins/modules/employee'
  import organization from '@/mixins/modules/organization'
  import EmptyPage from '@/components/generics/EmptyPage'
  import CustomEditableInput from '@/components/generics/CustomEditableInput'
  import CustomEditableDatePicker from '@/components/generics/CustomEditableDatePicker'
  import {root} from '@/plugins/Fetch'
  import Loading from '@/components/generics/Loading'

  export default {
    name: 'EmployeeList',
    mixins: [employee, organization, filterTools, imageScale],
    components: {
      CustomInput,
      CustomSelect,
      StaffPicker,
      Pagination,
      DatePicker,
      SlideOutModal,
      AddEmployee,
      EmptyPage,
      CustomEditableInput,
      CustomEditableDatePicker,
      Loading,
    },
    data () {
      return {
        test: true,
        root,
        roleList: [],
        departmentList: [],
        roleNull: {
          roleId: '',
          roleName: '全部',
        },
        departmentNull: {
          dpId: '',
          dpName: '全部',
        },
        theadConfig: [{
          name: '姓名',
          width: '100',
        }, {
          name: '照片',
          width: '200',
        }, {
          name: '所属组织',
          width: '100',
        }, {
          name: '岗位',
          width: '200',
        }, {
          name: '角色',
          width: '100',
        }, {
          name: '性别',
          width: '200',
        }, {
          name: '联系电话',
          width: '200',
        }, {
          name: '推荐数',
          width: '200',
        }, {
          name: '门店展示开关',
          width: '200',
        }, {
          name: '操作',
          width: '300',
        }],
        list: [],
        is_search: false,
        isInitiated: false,
        paginationData: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 1,
        },
        filterData: {
          memMobile: undefined,
          memUsername: undefined,
          role: undefined,
          department: undefined,
        },
        queryData: {},
        slideVisible: false,
        is_first_enter: false, // 是否第一次进入页面
        is_back: false, // 是否返回
        is_loading: false, // 是否显示小车车
      }
    },
    filters: {
      getOrgName (dpNameList) {
        if (dpNameList && dpNameList.length) {
          return dpNameList.map(item => item.dpName).join('/')
          // return dpNameList[0].dpName
        } else {
          return ''
        }
      },
      getPostName (jobList) {
        if (jobList && jobList.length) {
          return jobList.map(item => item.jobName).join(',')
        } else {
          return ''
        }
      },
      getRoleName (roleList) {
        if (roleList && roleList.length) {
          return roleList.map(item => item.roleName).join(',')
        } else {
          return ''
        }
      },
      getDepartmentName (departmentList) {
        if (departmentList && departmentList.length) {
          return departmentList.map(item => item.roleName).join(',')
        } else {
          return ''
        }
      },
    },
    methods: {
      /**
       * 切换门店展示开关
       */
      async changeShowStatus (item, index) {
        try {
          console.log(item)
          let status = item.show_status === 1 ? 2 : 1
          const {response, result} = await this.updateStoreFlag({
            mem_uid: item.memUid,
            show_status: status,
            mobile: item.memMobile,
          })
          if (response.status === 200 && result.code === 0) {
            this.fetchData()
          } else {
            throw new Error(result.message)
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改展示状态失败',
            content: `出错啦！错误信息：${err}`,
            resolve: () => {
              this.fetchData()
            },
          })
        }
      },
      addEmployee () {
        this.obj = undefined
        this.toggleSidePannel()
      },
      // 员工权限管理页面
      authoritySet (item) {
        this.$router.push({name: 'authorityMgr', query: {id: item.memUid}})
      },
      editEmployee (item) {
        this.obj = item
        this.toggleSidePannel()
      },
      additionHandler () {
        this.toggleSidePannel()
        this.fetchData()
      },
      toggleSidePannel () {
        this.slideVisible = !this.slideVisible
      },
      getFace (item) {
        if (item && item.memFace) {
          let url = this.scaleImage(item.memFace, 1, 36, 36)
          let img = new Image()
          img.onload = () => {
            item.faceLoadedUrl = url
            this.$forceUpdate()
          }
          img.src = url
        }
        return require('@/assets/user-avatar.png')
      },
      /**
       * 删除员工
       * item 要删除的某条数据
       */
      delEmployee (item) {
        this.$store.dispatch('showMessage', {
          title: '确认删除该员工？',
          content: '删除后员工将不存在',
          isRejectable: 1,
          resolve: () => {
            this.deleteEApi(item)
          },
        })
      },
      /**
       * 删除员工
       * item 要删除的某条数据
       */
      async deleteEApi (item) {
        let params = {
          memUid: item.memUid,
          dpIdList: item.dpName[0].dpId,
        }
        console.log(params)
        // 如果未点击过搜索按钮
        if (!this.is_search) {
          this.resetParams() // 重置部分参数
        }
        // 如果当前页只剩一条数据 且 当前页不是第一页
        if (this.list.length === 1 && this.paginationData.current_page > 1) {
          this.paginationData.current_page--
        }
        try {
          const {response, result} = await this.removeEmployee(params)
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '员工删除成功',
              resolve: () => {
                this.fetchData()
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除员工失败',
              content: `${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除员工失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
      },
      // 获取列表数据
      async fetchData () {
        var self = this
        try {
          const {response, result} = await this.getEmployeeList({
            memMobile: this.queryData.memMobile,
            memUsername: this.queryData.memUsername,
            roleIdList: this.queryData.role ? this.queryData.role.roleId : undefined,
            dpId: this.queryData.department ? this.queryData.department.dpId : undefined,
            pageNum: self.paginationData.current_page,
            pageSize: self.paginationData.per_page,
          })
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            self.list = result.list
            this.paginationData.current_page = result.pageNum
            this.paginationData.last_page = Math.ceil(result.total / this.paginationData.per_page)
            this.paginationData.total = result.total
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取员工列表失败',
              content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取员工列表失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
        this.isInitiated = true
      },
      // 重置表单
      resetFilter () {
        this.is_search = false
        this.filterData.memUsername = undefined
        this.filterData.memMobile = undefined
        this.filterData.role = undefined
        this.filterData.department = undefined
        this.queryData = Object.assign({}, this.filterData)
        this.paginationData.current_page = 1
        this.fetchData()
      },
      resetParams () {
        this.is_search = false
        this.filterData.memUsername = undefined
        this.filterData.memMobile = undefined
        this.filterData.role = undefined
        this.filterData.department = undefined
        this.queryData = Object.assign({}, this.filterData)
      },
      // 分页
      paging (state, evt) {
        this.paginationData = state
        this.fetchData()
      },
      // 回车搜索
      applyFilter () {
        this.is_search = true
        for (let key in this.filterData) {
          if (this.queryData.hasOwnProperty(key)) {
            this.queryData[key] = this.filterData[key]
          }
        }
        this.paginationData.current_page = 1
        this.fetchData()
      },
      // 初始化角色列表
      async initRoleList () {
        try {
          const {response, result} = await this.getRoleList({
          })
          if (result.code === 0 && response.status === 200) {
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
      // 初始化组织列表
      async initDepartmentList () {
        try {
          const {response, result} = await this.getDpList()
          if (result.code === 0 && response.status === 200) {
            this.departmentList = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取组织列表失败',
              content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取组织列表失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
      },
      /**
       * @method
       * @description 上传员工前
       */
      beforeAvatarUploadVideo (file) {
        // if (
        //   file.type !== 'application/vnd.ms-excel' &&
        //   file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        // ) {
        //   this.$store.dispatch('showMessage', {
        //     type: 'failure',
        //     title: '上传失败',
        //     content: '格式不正确',
        //   })
        //   return false
        // }
        this.is_loading = true
      },
      /**
       * @method
       * @description 上传成功
       */
      handleAvatarSuccessVideo (res, file) {
        let self = this
        if (res.code === 0) {
          let errMessage = ''
          if (res.data.fail_num > 0) {
            errMessage = '失败的数据可能存在员工信息不完整、信息格式不正确等问题（例如手机号格式不正确，姓名为空等），请调整后重新导入。'
          }
          self.$store.dispatch('showMessage', {
            type: 'success',
            title: '导入成功',
            content: `导入成功${res.data.succ_num}条，导入失败${res.data.fail_num}条` + '<br/>' + errMessage,
            resolve: () => {
              if (res.data.fail_num !== 0) {
                window.location.href = `${root}${res.data.down_url}/${res.data.file_name}`
              }
            },
          })
          self.fetchData()
        } else {
          self.$store.dispatch('showMessage', {
            type: 'success',
            title: '导入错误',
            content: `${res.message}`,
          })
        }
        this.is_loading = false
      },
      /**
     * @method
     * @description 上传失败
     */
      avatarUploadOnErrorVideo (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '导入员工失败',
          content: `出错啦!${err.message}`,
        })
        this.is_loading = false
      },
    },
    mounted () {
      this.is_first_enter = true
      this.initRoleList()
      this.initDepartmentList()
    },
    // 导航守卫
    beforeRouteEnter (to, from, next) {
      console.log(from.name + '   ' + from.meta.isSlibing)
    /**
       * 判断是否属于同级页面
       * (由切换tab进入)
       */
      if (!from.meta.isSlibing) {
        to.meta.isOutside = true
      }
      /**
       * 是添加 且 不是返回(保存)
       * @save: 1(返回)
       */
      if ((from.name === 'authorityMgr' && to.query.save !== 1)) {
        to.meta.isPreserve = true
      }
      next()
    },
      // keep-alive进入
    activated () {
      /**
       * 未点搜索按钮
       */
      if (!this.is_search) {
        this.resetParams() // 重置部分参数
      }
      /**
       * 由切换tab进入 或
       * 是添加 且 不是返回(保存)
       */
      if (this.$route.meta.isOutside || this.$route.meta.isPreserve) {
        this.resetFilter() // 重置全部参数
        this.$route.meta.isPreserve = false
        this.$route.meta.isOutside = false
        return
      }
      /**
       * 如果是返回不请求接口
       * @save: 1(返回)
       */
      if (Number(this.$route.query.save) !== 1) {
        this.fetchData()
        this.$route.meta.isPreserve = false
        this.$route.meta.isOutside = false
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .content
    display flex
    justify-content start
  .pp
    position relative
  .haha
  .add-icon
  .category-icon
    display inline-flex
    width 16px
    height 16px
    background url('~@/assets/icons/button-add.svg') no-repeat center center
    background-size cover
    margin-right 6px
    margin-top 8px
  .category-icon
    background-image url('~@/assets/icons/button-catrgory.svg')
  .page-selector
    label
      z-index 5
  .right-box
    display flex
    position absolute
    bottom 20px
    right 30px
  .xi
    align-self flex-end
  .bian
    height 16px
    font-size 13px
    font-family:MicrosoftYaHei
    color rgba(47,171,221,1)
    line-height 16px
    // padding-right 17px
    margin-right 0
  .del
    padding-left 17px
    color rgba(235,78,56,1)
    border-left 1px solid rgba(0,0,0,0.08)
  .button
    padding 0 10px
  .username
    line-height 36px
  .field-role
    width 120px
  .table tbody tr td
    max-width 130px
    .switch input
      cursor pointer
      &:disabled
        cursor auto
  .subFile
    width 74px
    height 32px
    position absolute
    top 0
    left 0
    opacity 0
    input
      width 100%
      height 100%
      position absolute
      top 0
      left 0
  .position-relative
    position relative
.content-item
  max-width 150px
.operation-td
  display flex
  justify-content space-around
  height 36px
  align-items center
.width130
  width 130px
.width150
  width 150px
</style>
