import WorkbenchLayout from '@/components/workbench/WorkbenchLayout'
import WorkbenchOverview from '@/components/workbench/WorkbenchOverview'
import WriteOffRecord from '@/components/workbench/WriteOffRecord'
import WriteOffAllList from '@/components/workbench/WriteOffAllList'
import CardOffRecord from '@/components/workbench/CardOffRecord'
import GroupPurshareRecord from '@/components/workbench/GroupPurshareRecord'
import CardManagementOffRecord from '@/components/workbench/CardManagementOffRecord'
import JoinPlatform from '@/components/workbench/JoinPlatform'

export default {
  path: 'workbench',
  component: WorkbenchLayout,
  children: [
    {
      name: 'workbenchOverview',
      path: 'overview',
      component: WorkbenchOverview,
      meta: {
        module: 'workbench',
        keepAlive: true,
      },
    },
    {
      name: 'writeOffAllList',
      path: 'record',
      component: WriteOffAllList,
      meta: {
        module: 'workbench',
      },
      children: [
        {
          name: 'writeOffRecord',
          path: 'record-order',
          component: WriteOffRecord,
          meta: {
            module: 'workbench',
          },
        },
        {
          name: 'record-card',
          path: 'record-card',
          component: CardManagementOffRecord,
          meta: {
            module: 'workbench',
          },
        },
        {
          name: 'record-coupon',
          path: 'record-coupon',
          component: CardOffRecord,
          meta: {
            module: 'workbench',
          },
        },
        {
          path: '/',
          redirect: {
            name: 'writeOffRecord',
          },
        },
      ],
    },
    {
      name: 'groupPurshareRecord',
      path: 'groupPurshareRecord',
      component: GroupPurshareRecord,
      meta: {
        module: 'workbench',
      },
    },
    {
      name: 'JoinPlatform',
      path: 'join',
      component: JoinPlatform,
      meta: {
        module: 'workbench',
      },
    },
    {
      path: '/',
      redirect: {
        name: 'writeOffAllList',
      },
    },
  ],
}
