import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 企业资质 - 上传识别资质相关图片
    uploadQualificationTmageApi (query) {
      return $fetch('quick/qualification/upload_qualification_image', {
        method: 'POST',
        body: query,
      })
    },
    // 企业资质 - 用地址换图片
    exchangeImageUrlApi (query) {
      return $fetch('quick/qualification/exchange_image_url', {
        method: 'GET',
        body: query,
      })
    },
    // 企业资质 - 获取资质相关信息
    getQualificationApi (query) {
      return $fetch('quick/qualification/get_qualification', {
        method: 'GET',
        body: query,
      })
    },
    // 企业资质 - 设置资质相关信息
    setQualificationApi (query) {
      return $fetch('quick/qualification/set_qualification', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 小程序授权信息
    fetchAuthorizations (query) {
      return $fetch('wx_auth/open_platform_info', {
        method: 'GET',
        query,
      })
    },
    // 小程序创建相关 - 小程序信息完善
    miniPerfectInfoApi (query) {
      return $fetch('mini_program/perfect_info', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 小程序信息修改
    miniUpdateInfoApi (query) {
      return $fetch('mini_program/update_info', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 微信认证名称检测
    miniWxVerifyNameApi (query) {
      return $fetch('mini_program/wx_verify_name', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 快速创建小程序
    miniCreateMini (query) {
      return $fetch('mini_program/create_mini', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 查询创建小程序状态
    getMiniStatusApi (query) {
      return $fetch('mini_program/get_mini_status', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 查询小程序基本信息审核状态
    getUpdateMiniStatusApi (query) {
      return $fetch('mini_program/get_update_mini_status', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 获取小程序基本信息
    getMiniInfoApi (query) {
      return $fetch('mini_program/get_mini_info', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 附近小程序开通
    miniSetNearbyApi (query) {
      return $fetch('mini_program/set_nearby', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 附近小程序开通审核状态
    miniGetNearbyStatusApi (query) {
      return $fetch('mini_program/get_nearby_status', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 获取微信门店服务类目
    merchantCategoryApi (query) {
      return $fetch('mini_program/merchant_category', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 获取门店服务类目
    getMerchantCategoryApi (query) {
      return $fetch('mini_program/get_merchant_category', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 设置门店服务类目
    setMerchantCategoryApi (query) {
      return $fetch('mini_program/set_merchant_category', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 获取门店列表
    getStoreListApi () {
      return $fetch('mini_program/store/lists', {
        method: 'POST',
      })
    },
    // 小程序创建相关 - 添加门店
    addStoreApi (query) {
      return $fetch('mini_program/store/create', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 更新门店
    updateStoreApi (query) {
      return $fetch('mini_program/store/update', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 门店详情
    getStoreDetailApi (query) {
      return $fetch('mini_program/store/detail', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 门店展示状态变更
    setStoreStstusApi (query) {
      return $fetch('mini_program/set_nearby', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 删除门店
    deleteStoreApi (query) {
      return $fetch('mini_program/store/delete', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 添加门店: 省市区
    getminiProgramLocationApi (query) {
      return $fetch('mini_program/wx_district_local', {
        method: 'GET',
        body: query,
      })
    },
    // 小程序创建相关 - 添加门店: 搜索门店
    searchStoreApi (query) {
      return $fetch('mini_program/wx_search_map_poi', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序创建相关 - 添加门店: 拉取官方服务标签
    getWxOfficialServiceApi () {
      return $fetch('mini_program/wx_official_service', {
        method: 'GET',
      })
    },
    // 美团支付服务 - 美团上传图片
    uploadImageApi (query) {
      return $fetch('meituan/upload_image', {
        method: 'POST',
        body: query,
      })
    },
    // 美团支付服务 - 美团下载模板
    getSettleApi (query) {
      return $fetch('meituan/settle', {
        method: 'GET',
        body: query,
      })
    },
    // 美团支付服务 - 美团分行信息列表
    getBankBranchApi (query) {
      return $fetch('meituan/bank_branch', {
        method: 'GET',
        body: query,
      })
    },
    // 美团支付服务 - 美团创建美团虚拟门店
    setMerchantPoiApi (query) {
      return $fetch('meituan/create_merchant_poi', {
        method: 'POST',
        body: query,
      })
    },
    // 美团支付服务 - 美团城市列表
    getCityListApi (query) {
      return $fetch('meituan/city_list', {
        method: 'GET',
        body: query,
      })
    },
    // 美团支付服务 - 美团开通支付
    openPaymentApi (query) {
      return $fetch('meituan/open_payment', {
        method: 'POST',
        body: query,
      })
    },
    // 美团支付服务 - 重置门店美团支付信息
    resetPaymentApi () {
      return $fetch('meituan/reset_merchant', {
        method: 'POST',
      })
    },
    // 美团支付服务 - 美团查询美团虚拟门店
    getMerchantApi (query) {
      return $fetch('meituan/get_merchant', {
        method: 'GET',
        body: query,
      })
    },
    // 美团支付服务 - 美团签署美团协议
    signProtocolApi (query) {
      return $fetch('meituan/sign_protocol', {
        method: 'POST',
        body: query,
      })
    },
    // 美团支付服务 - 美团行政区列表
    getLocationApi (query) {
      return $fetch('meituan/get_location', {
        method: 'GET',
        body: query,
      })
    },
    // 美团支付服务 - 美团银行信息列表
    getBankInfoApi (query) {
      return $fetch('meituan/bank_info', {
        method: 'GET',
        body: query,
      })
    },
    // 美团支付服务 - 美团银行卡验证
    verifyCardApi (query) {
      return $fetch('meituan/verify_card', {
        method: 'POST',
        body: query,
      })
    },
    // 企业微信注册 - 生成注册企业微信链接
    spreadRegisterApi () {
      return $fetch('quick/work/spread_register', {
        method: 'GET',
      })
    },
    // 企业微信授权 - 获取企业微信应用列表接口
    workWechatListApi (query) {
      return $fetch('wx_auth/work_wechat/list', {
        method: 'GET',
        body: query,
      })
    },
    // 企业微信授权 - 获取企业微信授权应用数量和状态(老接口)
    authorizeAppStatusApi () {
      return $fetch('wx_auth/work_wechat', {
        method: 'GET',
      })
    },
    // 企业微信授权 - 获取企业微信授权应用数量和状态(新接口)
    newAuthorizeAppStatusApi () {
      return $fetch('quick/work/register_info', {
        method: 'GET',
      })
    },
    // 更新user数据
    fetchUserInfoApi () {
      return $fetch('auth/user', {
        forceResolve: true,
      })
    },
  },
}
