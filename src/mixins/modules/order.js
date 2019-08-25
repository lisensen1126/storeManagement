import {$fetch} from '@/plugins/Fetch'
/**
 * 订单管理相关接口
 * amujoe
 */
export default {
  methods: {
    // 客户服务详情
    fetchOrderList (query) {
      return $fetch('order', {query})
    },
    // 客户详情
    fetchOrderDetail (id) {
      return $fetch(`order/${id}`)
    },
    // 手动退款
    refundApi (query) {
      return $fetch('order/manual_refund', {
        method: 'POST',
        body: query,
      })
    },
    // 订单撤销
    revokeApi (query) {
      return $fetch('order/revoke', {
        method: 'POST',
        body: query,
      })
    },
  },
}
