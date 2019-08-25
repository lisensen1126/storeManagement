import SynchronizeLayout from '@/components/synchronize/SynchronizeLayout'
import SyncEmployeeList from '@/components/synchronize/SyncEmployeeList'
import SyncEmployeeEdit from '@/components/synchronize/SyncEmployeeEdit'
import CvpSync from '@/components/synchronize/CvpSync'

export default {
  path: 'synchronize',
  component: SynchronizeLayout,
  children: [{
    name: 'syncEmployeeList',
    path: 'syncEmployeeList',
    component: SyncEmployeeList,
    meta: {
      module: 'synchronize',
      keepAlive: true,
    },
  }, {
    name: 'syncEmployeeEdit',
    path: 'syncEmployeeList/syncEmployeeEdit',
    component: SyncEmployeeEdit,
    meta: {
      module: 'synchronize',
    },
  }, {
    name: 'cvpSync',
    path: 'cvpSync',
    component: CvpSync,
    meta: {
      module: 'synchronize',
    },
  }, {
    path: '/',
    redirect: {name: 'syncEmployeeList'},
  }],
}
