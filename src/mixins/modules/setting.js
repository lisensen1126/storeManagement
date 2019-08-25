import {$fetch} from '@/plugins/Fetch'
// import Staff from './staff'

export default {
  // mixins: [Staff],
  methods: {
    // 门店列表
    fetchStores (query) {
      return $fetch('stores', { query })
    },
    // 省市区
    fetchRegions (query) {
      return $fetch('regions', {query})
    },
    // 创建门店
    createStore (params) {
      return $fetch('stores', {
        method: 'POST',
        body: {...params},
      })
    },
    // 获取门店详情
    fetchStoreDetail (storeId) {
      return $fetch(`stores/${storeId}`)
    },
    // 更新门店信息
    updateStore (storeId, params) {
      return $fetch(`stores/${storeId}`, {
        method: 'PATCH',
        body: {...params},
      })
    },
    // 获取门店配置信息
    getStoreSetting (query) {
      return $fetch('store/get_extend', { query })
    },
    // 更新门店配置
    upDataSetting (query) {
      return $fetch('store/update_extend', {
        method: 'POST',
        body: query,
      })
    },
    // 修改密码
    updatePswd (query) {
      return $fetch('auth/update', {
        method: 'POST',
        body: {...query},
      })
    },
    // 微信授权 - 企业详情信息获取
    getWorkAppDetailApi (query) {
      return $fetch('wx_auth/work_app/detail', {
        method: 'GET',
        body: {...query},
      })
    },
    // 微信授权 - 外部联系人信息修改
    saveWorkAppModifyApi (query) {
      return $fetch('wx_auth/work_app/modify', {
        method: 'POST',
        body: {...query},
      })
    },
  },
}
