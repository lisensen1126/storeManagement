import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 快速开单分类列表
    getQuickBillCateApi () {
      return $fetch('/offline_pay/quick_bill_category', {
        method: 'POST',
      })
    },
    // 获取商品、服务列表
    getGoodsServeListApi (body) {
      return $fetch('/offline_pay/bill_product_list', {
        method: 'POST',
        body: body,
      })
    },
    // 获取养护卡列表
    getCardListApi (body) {
      return $fetch('/offline_pay/bill_upkeep_list', {
        method: 'POST',
        body: body,
      })
    },
    // 获取商品/服务分类列表
    getGoodServeCateListApi (query) {
      // type 1商品，2服务
      // parent_id 父级id，默认一级
      return $fetch('common/category', {query})
    },
    // 创建快速开单项目
    createQuickBillApi (data) {
      return $fetch('/offline_pay/quick_bill_item', {
        method: 'POST',
        body: data,
      })
    },
    // 快速开单项目列表
    getQuickBillListApi (data) {
      return $fetch('/offline_pay/quick_bill_list', {
        method: 'POST',
        body: data,
      })
    },
    // 删除项目
    deleteQuickBillApi (body) {
      return $fetch('/offline_pay/quick_bill_del', {
        method: 'POST',
        body: body,
      })
    },
    // 同步快速开单项目
    syncOpenBillApi (body) {
      return $fetch('/offline_pay/sync_quick_bill_item', {
        method: 'POST',
        body,
      })
    },
  },
}
