import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 平台订单结算统计 accounts/count
    getBossCountApi (query) {
      return $fetch('accounts/count', {
        method: 'POST',
        body: query,
      })
    },
    // accounts/count-list 平台订单统计列表
    getCountListApi (query) {
      return $fetch('accounts/count-list', {
        method: 'POST',
        body: query,
      })
    },
    // 所选未分账的数据 accounts/manual-separate-count
    getCountApi (query) {
      return $fetch('accounts/manual-separate-count', {
        method: 'POST',
        body: query,
      })
    },
    // 确认分账 accounts/manual-separate
    confirmAccountsApi (query) {
      return $fetch('accounts/manual-separate', {
        method: 'POST',
        body: query,
      })
    },
    // 收入汇总
    IncomeSummaryApi (query) {
      return $fetch('order/summary', {
        method: 'POST',
        body: query,
      })
    },
    // 流水明细
    FlowDetailsApi (query) {
      return $fetch('order/turnover_list', {
        method: 'POST',
        body: query,
      })
    },
    // 导出设置
    ExportTableApi (query) {
      return $fetch('order/turnover_export', {
        method: 'GET',
        body: query,
      })
    },
    /**
     * 订单分账 - 列表
     * @param {Object} query 参数
     */
    OrderSplitListApi (query) {
      return $fetch('/accounts', {
        method: 'GET',
        body: query,
      })
    },
    /**
     * 订单分账 - 详情
     * @param {Number} id ID
     */
    OrderSplitDetailsApi (id) {
      return $fetch(`/accounts/${id}`)
    },
  },
}
