import {$fetch, root} from '@/plugins/Fetch'
import {$axios} from '@/plugins/axios'

export default {
  methods: {
    // 员工列表
    getEmployeeList (body) {
      return $fetch('/work_wechat/staff/member', {
        method: 'GET',
        body: {...body},
      })
    },
    // 新增员工
    saveEmployee (body) {
      return $fetch('/work_wechat/staff/member/store', {
        method: 'POST',
        body: {...body},
      })
    },
    // 修改员工
    updateEmployee (body) {
      return $fetch('/work_wechat/staff/member/update', {
        method: 'POST',
        body: {...body},
      })
    },
    // 获取员工详情
    getEmployee (memUid) {
      return $fetch(`/work_wechat/staff/member/show/${memUid}`, {
        method: 'GET',
      })
    },
    // 删除员工
    removeEmployee (body) {
      return $fetch('/work_wechat/staff/member/delete', {
        method: 'POST',
        body,
      })
    },
    // 员工管理-批量导入
    allImport (body) {
      let formdata = new FormData()
      formdata.append('excel', body)
      let promise = new Promise((reslove, reject) => {
        return $axios({
          url: `${root}/member/import`,
          method: 'POST',
          data: formdata,
        }).then((res) => { return reslove(res) })
      })
      return promise
    },
    // 下载模板
    downloadTemp () {
      return $fetch('/work_wechat/staff/member/download')
    },
    // 员工管理-批量导出
    allExport (dpId) {
      return $fetch('/work_wechat/staff/member/export?dpId=' + dpId)
    },
    // 获取角色列表
    getRoleList () {
      return $fetch('/work_wechat/staff/member/role', {
        method: 'GET',
      })
    },
    // 获取组织部门列表
    getDpList () {
      return $fetch('/work_wechat/staff/member/store_dep_list', {
        method: 'GET',
      })
    },
    // // 获取组织列表
    // getOrgList (body) {
    //   return $fetch('/work_wechat/staff/member/department_category', {
    //     method: 'GET',
    //     body: body,
    //   })
    // },
    // 组织列表
    getOrgList (query) {
      return $fetch('/work_wechat/enterprise', {
        method: 'POST',
        body: query,
      })
    },
    // 获取部门列表
    getDeptList (body) {
      return $fetch(`/work_wechat/staff/member/department_cate/${body.dpId}`, {
        method: 'GET',
      })
    },
    // 获取岗位列表
    getPostList (body) {
      return $fetch('/work_wechat/staff/member/job', {
        method: 'GET',
        body: body,
      })
    },
    // 员工管理 - 变更技师展示状态
    updateStoreFlag (body) {
      return $fetch('/work_wechat/staff/change-show-status', {
        method: 'POST',
        body: body,
      })
    },
    // 获取员工权限
    getStaffAuthApi (body) {
      return $fetch('/permission/detail', {
        method: 'GET',
        body: body,
      })
    },
    // 设置员工权限
    setStaffAuthApi (body) {
      return $fetch('/permission/save', {
        method: 'POST',
        body: body,
      })
    },
    // 获取员工已在部门
    getStoreCountApi (body) {
      return $fetch('/work_wechat/staff/member/store_count', {
        method: 'POST',
        body,
      })
    },
  },
}
