import {$fetch} from '@/plugins/Fetch'
/**
 * 商品服务管理 相关接口
 * amujoe
 */
export default {
  methods: {
    // 查看卡来源的历史upkeep/history
    getUpkeepHistoryApi (data) {
      return $fetch('upkeep/history', {
        method: 'GET',
        body: {
          ...data,
        },
      })
    },
    // 编辑自建壳养护卡 upkeep/store_save
    storeEditBossCardApi (data) {
      return $fetch('upkeep/store_save', {
        method: 'POST',
        body: {
          ...data,
        },
      })
    },
    // 门店自建壳养护卡
    storeAddBossCardApi (data) {
      return $fetch('upkeep/store_add', {
        method: 'POST',
        body: {
          ...data,
        },
      })
    },
    // 商品品牌馆列表
    fetchBrandHouse (query) {
      return $fetch('brand_house/list', {query})
    },
    // 商品品牌列表
    fetchBrand (query) {
      return $fetch('common/brand', {query})
    },
    // 商品属性列表
    fetchAttribute (query) {
      return $fetch('common/attribute', {query})
    },
    // 分类
    fetchCategory (query) {
      return $fetch('common/category', {query})
    },
    // 商品库 - 商品库列表
    fetchProductLibrary (query) {
      return $fetch('product_bank', {query})
    },
    // 商品库 - 商品库详情
    fetchProductLibraryDetail (id) {
      return $fetch(`product_bank/${id}`)
    },
    // 商品库 - 批量添加
    fetchSyncProduct (data) {
      return $fetch('product_bank/sync', {
        method: 'POST',
        body: {
          ...data,
        },
      })
    },
    // 商品管理 - 商品列表
    fetchProduct (query) {
      return $fetch('product', {query})
    },
    // 商品管理 - 商品上下架
    productShelves (data) {
      return $fetch('product/sale', {
        method: 'PATCH',
        body: {
          ...data,
        },
      })
    },
    // 商品管理 - 商品删除
    productDelete (id) {
      return $fetch(`product/${id}`, {
        method: 'DELETE',
      })
    },
    // 商品管理 - 商品创建
    productCreate (data) {
      return $fetch('product/create', {
        method: 'POST',
        body: data,
      })
    },
    // 商品管理 - 商品同步和编辑
    productUpdate (data) {
      return $fetch('product/sync_or_update', {
        method: 'PUT',
        body: {
          ...data,
        },
      })
    },
    // 商品管理 - 商品详情
    fetchProductDetail (id) {
      return $fetch(`product/${id}`)
    },
    // 服务库-服务库管理列表
    fetchServiceLibrary (query) {
      return $fetch('servicelibrary', {query})
    },
    // 服务库-服务库详情
    fetchServiceLibraryDetail (id) {
      return $fetch(`servicelibrary/${id}`)
    },
    // 服务管理 - 创建门店服务管理
    serviceCreate (data) {
      return $fetch('service/create', {
        method: 'POST',
        body: data,
      })
    },
    // 服务管理 - 服务上下架
    serviceShelves (id) {
      return $fetch(`service/shelves/${id}`, {
        method: 'PATCH',
      })
    },
    // 服务管理 -服务管理列表
    fetchService (query) {
      return $fetch('service', {query})
    },
    // 服务管理 - 服务管理详情
    fetchServiceDetail (id) {
      return $fetch(`service/${id}`)
    },
    // 服务管理 - 编辑门店服务管理
    serviceSave (data) {
      return $fetch('service/save', {
        method: 'PUT',
        body: {
          ...data,
        },
      })
    },
    // 服务管理 - 删除服务
    serviceDelete (data) {
      return $fetch('service/delete', {
        method: 'POST',
        body: data,
      })
    },
    // 服务管理 - 删除服务
    batchShelves (data) {
      return $fetch('service/batch_shelves', {
        method: 'POST',
        body: data,
      })
    },
    // 服务管理 - 删除服务
    batchAddService (data) {
      return $fetch('service/batch_create', {
        method: 'POST',
        body: data,
      })
    },
    // 获取商品分类
    commodityClassification (data) {
      return $fetch('common/set_category', {
        method: 'GET',
        body: data,
      })
    },
    // 养护卡 - 养护卡分类列表
    upkeepCategoryApi (data) {
      return $fetch('upkeep/category', {
        method: 'GET',
        body: data,
      })
    },
    // 养护卡 - 壳牌养护卡列表库
    upkeepDepotListApi (data) {
      return $fetch('upkeep/depot_list', {
        method: 'GET',
        body: data,
      })
    },
    // 养护卡 - 养护卡删除
    upkeepDeleteApi (data) {
      return $fetch('upkeep/delete', {
        method: 'GET',
        body: data,
      })
    },
    // 养护卡 - 养护卡上下架状态编辑
    upkeepStatusApi (data) {
      return $fetch('upkeep/status', {
        method: 'POST',
        body: data,
      })
    },
    // 养护卡 - 养护卡详情
    upkeepDetailApi (data) {
      return $fetch('upkeep/detail', {
        method: 'GET',
        body: data,
      })
    },
    // 养护卡 - 数据统计养护卡详情
    upkeepDataDetailApi (data) {
      return $fetch('upkeep/detail_count', {
        method: 'GET',
        body: data,
      })
    },
    // 养护卡 - 养护卡关联商品
    upkeepProductApi (data) {
      return $fetch('upkeep/product', {
        method: 'GET',
        body: data,
      })
    },
    // 养护卡新建 - 获取封面模版
    getTemplateListApi (data) {
      return $fetch('upkeep/template', {
        method: 'GET',
        body: data,
      })
    },
    // 养护卡 - 添加养护卡
    upkeepAddApi (data) {
      return $fetch('upkeep/add', {
        method: 'POST',
        body: data,
      })
    },
    // 养护卡 - 编辑养护卡
    upkeepSaveApi (data) {
      return $fetch('upkeep/save', {
        method: 'POST',
        body: data,
      })
    },
    // 养护卡 - 选中模版 新建
    upkeepDepotAddApi (data) {
      return $fetch('upkeep/depot_add', {
        method: 'POST',
        body: data,
      })
    },
    // 养护卡 - 选中 boss 模版 编辑
    upkeepDepotSaveApi (data) {
      return $fetch('upkeep/depot_save', {
        method: 'POST',
        body: data,
      })
    },
    // 养护卡 - 门店养护卡列表
    upkeepListApi (data) {
      return $fetch('upkeep/list', {
        method: 'GET',
        body: data,
      })
    },
    // 养护卡 - 统计列表
    upkeepTotalApi (data) {
      return $fetch('upkeep/list', {
        method: 'GET',
        body: data,
      })
    },
    // 养护卡 - 排序
    updateSortTotalApi (data) {
      return $fetch('upkeep/sort', {
        method: 'POST',
        body: data,
      })
    },
    // 数据统计列表
    upkeepDataList (data) {
      return $fetch('upkeep/list_count', {
        method: 'GET',
        body: data,
      })
    },
    // 养护卡 - 销售记录列表upkeep/sale_list
    upkeepSaleApi (data) {
      return $fetch('upkeep/sale_list', {
        method: 'GET',
        body: data,
      })
    },
    // 养护卡关联商品 - 弹框里面获取商品、服务
    getProductServiceListApi (data) {
      return $fetch('product/sku_list', {
        method: 'GET',
        body: data,
      })
    },
    // upkeep/product
    getTwoApi (data) {
      return $fetch('upkeep/product', {
        method: 'GET',
        body: data,
      })
    },
    // 优惠券关联商品服务列表
    getCouponRelationApi (data) {
      return $fetch('marketing/coupon/product/list', {
        method: 'GET',
        body: data,
      })
    },
    // 所有商品和服务名称 提供给养护卡输入项目名称联想
    getPSNameApi (data) {
      return $fetch('/product/all_name', {
        method: 'GET',
        body: data,
      })
    },
  },
}
