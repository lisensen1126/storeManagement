import {$fetch} from '@/plugins/Fetch'
export default {
  methods: {
    // 系统cvp信息
    fetchCvp () {
      return $fetch('/xianfeng/cvp', {
        method: 'GET',
      })
    },
    // 数字先锋 - 用户列表
    fetchXianFengList (body) {
      return $fetch('/xianfeng/member_list', {
        method: 'GET',
        body: {...body},
      })
    },
    // 获取同步员工详情
    fetchMemberDetail (body) {
      return $fetch('/xianfeng/member_detail', {
        method: 'GET',
        body: {...body},
      })
    },
    // 微信授权 - 企业微信通讯录授权状态
    fetchContactAuthStatus () {
      return $fetch('/wx_auth/work_wechat/contact_auth_status', {
        method: 'GET',
      })
    },
  },
}
