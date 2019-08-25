import ReportFormLayout from '@/components/reportForm/ReportFormLayout'
import IncomeSummary from '@/components/reportForm/IncomeSummary'
import OrderSplitList from '@/components/reportForm/OrderSplitList'
import OrderSplitDetail from '@/components/reportForm/OrderSplitDetail'
import OrderBossList from '@/components/reportForm/BossOrderList'
export default {
  path: 'report',
  component: ReportFormLayout,
  children: [
    // 财务管理
    {
      name: 'incomeSummary',
      path: 'incomeSummary',
      component: IncomeSummary,
      meta: {
        module: 'report',
      },
    },
    // 订单列表
    {
      name: 'bossOrderList',
      path: 'orderSplitList/bossOrderList',
      component: OrderBossList,
      meta: {
        module: 'report',
      },
    },
    // 订单分账 - 列表
    {
      name: 'orderSplitList',
      path: 'orderSplitList',
      component: OrderSplitList,
      meta: {
        module: 'report',
      },
    },
    // 订单分账 - 详情
    {
      name: 'orderSplitDetail',
      path: 'orderSplitList/orderSplitDetail/:id',
      component: OrderSplitDetail,
      meta: {
        module: 'report',
      },
    },
    {
      path: '/',
      redirect: { name: 'incomeSummary' },
    },
  ],
}
