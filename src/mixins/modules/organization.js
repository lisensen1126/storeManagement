import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 组织列表
    fetchOrganizationList (query) {
      return $fetch('/work_wechat/enterprise', {
        method: 'POST',
        body: query,
      })
    },
    // 获取组织详情
    fetchOrganization (dpId) {
      return $fetch(`/work_wechat/enterprise/detail/${dpId}`, {
        method: 'GET',
      })
    },
    // 删除组织
    removeOrganization (body) {
      return $fetch(`/work_wechat/enterprise/delete/${body.dpId}`, {
        method: 'GET',
      })
    },
    // 新增组织
    saveOrganization (body) {
      return $fetch('/work_wechat/enterprise/save', {
        method: 'POST',
        body,
      })
    },
    // 编辑组织
    updateOrganization (body) {
      return $fetch('/work_wechat/enterprise/update', {
        method: 'POST',
        body,
      })
    },

  },
}
