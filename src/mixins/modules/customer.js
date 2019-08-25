import {$fetch} from '@/plugins/Fetch'
/**
 * 客户管理相关接口
 * amujoe
 */
export default {
  methods: {
    // 客户管理 - 客户管理列表
    fetchCustomerList (query) {
      return $fetch('customer', {query})
    },
    // 客户管理 - 客户详情
    fetchCustomerDetail (id) {
      return $fetch(`customer/${id}`)
    },
    // 客户管理 - 改备注
    setCustomerRemarkApi (param) {
      return $fetch('customer/customer_remarks_update', {
        method: 'POST',
        body: param,
      })
    },
    // 客户管理 - 客户消费列表
    fetchCustomerConsume (query) {
      return $fetch(`customer/${query.customer_id}/consume`, {query})
    },
    // 客户管理 - 车检报告列表
    fetchInspectListApi (query) {
      return $fetch('inspect/list', {query})
    },
    // 客户管理 - 车检报告详情
    fetchInspectDetailApi (query) {
      return $fetch('inspect/detail', {query})
    },
    // 客户管理 - 养护卡列表
    fetchCardListApi (query) {
      return $fetch('upkeep/customer', {query})
    },
    // 客户管理 - 养护卡详情
    fetchCardDetailApi (query) {
      return $fetch('upkeep/detail', {query})
    },
    // 客户管理 - 养护卡详情
    fetchCardCountDetailApi (query) {
      return $fetch('upkeep/detail_count', {query})
    },
    // 客户管理 - 车辆里程记录
    fetchMileageRecordApi (query) {
      return $fetch('customer/vehicle/vehicle-mileage-record', {query})
    },
    // 养护卡使用记录 upkeep/customer_use
    fetchCardUserApi (query) {
      return $fetch('upkeep/customer_use', {query})
    },
    // 养护卡分享记录 upkeep/customer_use
    fetchCardShareApi (query) {
      return $fetch('upkeep/customer_share', {query})
    },
    // 基础库养护卡关联商品
    fetchCardGoodsApi (query) {
      return $fetch('upkeep/depot_product', {query})
    },
    // 养护卡镜像详情
    fetchCardDetailTwoApi (query) {
      return $fetch('upkeep/detail_iso', {query})
    },
    // 养护卡价格变更记录
    fetchCardPriceRecordApi (query) {
      return $fetch('upkeep/price_logs', {query})
    },
    // 车辆品牌列表
    fetchCarBrandsApi (query) {
      return $fetch('common/inspect/brands', {query})
    },
    // 车型列表
    fetchCarModelsApi (vehicleBrandId) {
      return $fetch(`common/inspect/models/${vehicleBrandId}`)
    },
    // 车型具体销售版本列表
    fetchCarSalesApi (vehicleModelId) {
      return $fetch(`common/inspect/vehicles/${vehicleModelId}`)
    },
    // 客户管理 - 客户车辆详情
    fetchCarDetailApi (query) {
      return $fetch('customer/vehicle/detail', {query})
    },
    // 根据ip地址获取所在地省份简称
    fetchProvinceByIPApi (query) {
      return $fetch('common/province', {query})
    },
    // 客户管理 - 新增客户车辆
    addCarApi (body) {
      return $fetch('customer/vehicle/add', {
        method: 'POST',
        body: body,
      })
    },
    // 客户管理 - 编辑客户车辆
    editCarApi (body) {
      return $fetch('customer/vehicle/edit', {
        method: 'POST',
        body: body,
      })
    },
    // 客户管理 - 删除客户车辆
    deleteCarApi (body) {
      return $fetch('customer/vehicle/delete', {
        method: 'POST',
        body: body,
      })
    },
  },
}
