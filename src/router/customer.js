import CustomerLayout from '@/components/customer/CustomerLayout'
import CustomerList from '@/components/customer/CustomerList'
import CustomerDetail from '@/components/customer/CustomerDetail'

export default {
  // name: 'customerLayout',
  path: 'customer',
  component: CustomerLayout,
  children: [
    {
      name: 'customerList',
      path: 'list',
      component: CustomerList,
      meta: {
        module: 'customer',
        keepAlive: true,
      },
    },
    {
      name: 'customerDetail',
      path: 'list/detail',
      component: CustomerDetail,
      meta: {
        module: 'customer',
        isSlibing: true,
      },
    },
    {
      path: '/',
      redirect: {name: 'customerList'},
    },
  ],
}
