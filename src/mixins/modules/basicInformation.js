import {$fetch} from '@/plugins/Fetch'
// 商品服务管理模块接口
export default {
  methods: {
    // z主引导列表
    indexList () {
      return $fetch('guide', {
        method: 'GET',
      })
    },
    // 更新引导列表
    updateIndex (query) {
      return $fetch('guide', {
        method: 'PATCH',
        body: query,
      })
    },
    // 爆品列表
    hotList (query) {
      return $fetch('hot/list', {
        method: 'POST',
        body: query,
      })
    },
    // 更新爆品
    updateHotList (query) {
      return $fetch('hot/add', {
        method: 'POST',
        body: query,
      })
    },
    // 获取服务认证列表
    getFWList (query) {
      return $fetch('marketing/setting/list', {
        method: 'GET',
        body: query,
      })
    },
    // 公共 - 省市区列表
    fetchRegions (query) {
      return $fetch('common/regions', {query})
    },
    // 基本信息 - 更新门店信息
    storeSave (data) {
      return $fetch('store/save', {
        method: 'PUT',
        body: {
          ...data,
        },
      })
    },
    // 基本信息 - 门店基本信息
    fetchStore (query) {
      return $fetch('store', {query})
    },
    // 技师 - 技师列表
    fetchTechnician (query) {
      return $fetch('technician/list', {query})
    },
    // 技师 - 技师新增
    technicianCreate (query) {
      return $fetch('technician/add', {
        method: 'POST',
        body: query,
      })
    },
    // 技师 - 技师编辑
    technicianUpdate (query) {
      return $fetch('technician/update', {
        method: 'POST',
        body: query,
      })
    },

    // 轮播图列表
    getBannerList () {
      return $fetch('change_image/list', {
        method: 'GET',
      })
    },
    // 轮播图保存
    saveBanner (query) {
      return $fetch('change_image/save', {
        method: 'POST',
        body: query,
      })
    },
    // 超级品牌日列表
    getSuperBannerList () {
      return $fetch('brand_day/list', {
        method: 'GET',
      })
    },
    // 超级品牌日保存
    saveSuperBanner (query) {
      return $fetch('brand_day/save', {
        method: 'POST',
        body: query,
      })
    },
    // 品牌专区列表
    fetchBrandAreaApi (query) {
      return $fetch('brand-interval/list', {
        method: 'GET',
        body: query,
      })
    },
    // 品牌专区保存
    saveBrandAreaApi (query) {
      return $fetch('brand-interval/save', {
        method: 'POST',
        body: query,
      })
    },
    // 品牌馆列表
    fetchBrandListApi (query) {
      return $fetch('brand_house/list', {
        method: 'GET',
        body: query,
      })
    },
    // 获取小程序二维码
    getQrCodeApi () {
      return $fetch('mini_program/get_qr_code', {
        method: 'GET',
      })
    },
    // 小程序创建相关 - 获取门店服务类目
    getMerchantCategoryApi (query) {
      return $fetch('mini_program/get_merchant_category', {
        method: 'POST',
        body: query,
      })
    },
  },
}
