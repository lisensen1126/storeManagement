import {$fetch} from '@/plugins/Fetch'
/**
 * 工作台 相关接口
 * amujoe
 */
export default {
  methods: {
    // 客户的养护卡
    customerCardListApi (query) {
      return $fetch('upkeep/customer_upkeep', {
        method: 'GET',
        body: query,
      })
    },
    // 工作台 - 预约列表
    workbenchReserve (query) {
      return $fetch('workbench/reserve', {query})
    },
    // 工作台 - 核销码详情
    checkDetail (id) {
      return $fetch(`workbench/check/${id}`)
    },
    // 工作台 - 核销操作
    workbenchCheck (data) {
      return $fetch('workbench/check', {
        method: 'POST',
        body: data,
      })
    },
    // 工作台 - 核销列表
    checkList (query) {
      return $fetch('workbench/check', {query})
    },
    // 卡券核销搜索 marketing/write/{checkCode}
    searchCord (query) {
      return $fetch(`marketing/write/${query}`, {
        method: 'GET',
      })
    },
    // 卡券核销操作
    writeOffCard (query) {
      return $fetch(`marketing/write/${query.checkCode}`, {
        method: 'POST',
        body: query,
      })
    },
    // 卡券核销列表 marketing/write
    cardOffList (query) {
      return $fetch('marketing/write', {
        body: query,
      })
    },
    // 团购核销列表
    getGroupPurchaseApi (query) {
      return $fetch('tuan_gou/coupon/list', {
        body: query,
      })
    },
    // 核销团购券
    getGroupPurchaseCouponApi (query) {
      return $fetch('tuan_gou/coupon/write_off', {
        method: 'POST',
        body: query,
      })
    },
    // 验证核销码
    getGroupPurchaseVerifyApi (query) {
      return $fetch('tuan_gou/coupon/verify', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡核销列表
    getCardManagementListApi (params) {
      return $fetch('upkeep/validate_record', {
        method: 'GET',
        body: params,
      })
    },
    // 养护卡核销信息
    getCardManagementInfoApi (params) {
      return $fetch('upkeep/validate_info_new', {
        method: 'GET',
        body: params,
      })
    },
    // 次卡确认核销
    selfApi (params) {
      return $fetch('upkeep/validate_new', {
        method: 'POST',
        body: params,
      })
    },
    // 养护卡确认核销
    getCardManagementConfirmApi (params) {
      return $fetch('upkeep/validate_new', {
        method: 'POST',
        body: params,
      })
    },
    // 养护卡查看详情
    getCardManagementDetailApi (params) {
      return $fetch('upkeep/detail', {
        method: 'GET',
        body: params,
      })
    },
    // 养护卡查看详情
    getCardManagementDetailTwoApi (params) {
      return $fetch('upkeep/detail_iso', {
        method: 'GET',
        body: params,
      })
    },
    // 获取客户车辆列表 /v1/customer/vehicle/list
    getCustomerCarApi (params) {
      return $fetch('customer/vehicle/list', {
        method: 'GET',
        body: params,
      })
    },
    // 获取加入平台信息 workbench/storeDetail
    storePlatformDetailApi (params) {
      return $fetch('workbench/storeDetail', {
        method: 'GET',
        body: params,
      })
    },
    // 获取银行卡信息
    getBandCardApi (params) {
      return $fetch('workbench/cardnoGet', {
        method: 'POST',
        body: params,
      })
    },
    // 加入平台 workbench/storeApply
    jionPlatformApi (params) {
      return $fetch('workbench/storeApply', {
        method: 'POST',
        body: params,
      })
    },
    // 退出平台 workbench/storeOut
    outPlatformApi (params) {
      return $fetch('workbench/storeOut', {
        method: 'GET',
        body: params,
      })
    },
  },
}
