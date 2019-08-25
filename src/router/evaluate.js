import EvaluateLayout from '@/components/evaluate/EvaluateLayout'
import ServiceEvaluate from '@/components/evaluate/ServiceEvaluate'
import ProductEvaluate from '@/components/evaluate/ProductEvaluate'
import StoreEvaluate from '@/components/evaluate/StoreEvaluate'
import VehicleRecordList from '@/components/evaluate/VehicleRecordList'
import TypeManage from '@/components/evaluate/TypeManage'
import AddInspection from '@/components/evaluate/AddInspection'
import VehicleNav from '@/components/evaluate/VehicleNav'
import IntelligentMaintenance from '@/components/evaluate/IntelligentMaintenance'
import WorkingTimeSetting from '@/components/evaluate/intelligentMaintenance/WorkingTimeSetting'
import ProjectSetting from '@/components/evaluate/intelligentMaintenance/ProjectSetting'

export default {
  // name: 'evaluate',
  path: 'evaluate',
  component: EvaluateLayout,
  children: [{
    name: 'serviceEvaluate',
    path: 'serviceEvaluate',
    component: ServiceEvaluate,
    meta: {
      module: 'evaluate',
    },
  }, {
    name: 'productEvaluate',
    path: 'productEvaluate',
    component: ProductEvaluate,
    meta: {
      module: 'evaluate',
    },
  }, {
    name: 'storeEvaluate',
    path: 'storeEvaluate',
    component: StoreEvaluate,
    meta: {
      module: 'evaluate',
    },
  }, {
    name: 'intelligentMaintenance',
    path: 'intelligentMaintenance',
    component: IntelligentMaintenance,
    children: [{
      name: 'intelligentMaintenance',
      path: 'intelligentMaintenance',
      component: WorkingTimeSetting,
      meta: {
        module: 'evaluate',
      },
    }, {
      name: 'projectSetting',
      path: 'intelligentMaintenance/ProjectSetting',
      component: ProjectSetting,
      meta: {
        module: 'evaluate',
      },
    }],
  }, {
    name: 'VehicleNav',
    path: 'VehicleNav',
    component: VehicleNav,
    children: [{
      name: 'VehicleRecordList',
      path: 'VehicleRecordList',
      component: VehicleRecordList,
      meta: {
        module: 'evaluate',
      },
    }, {
      name: 'TypeManage',
      path: 'TypeManage',
      component: TypeManage,
      meta: {
        module: 'evaluate',
      },
    }],
  }, {
    name: 'AddInspection',
    path: 'VehicleNav/AddInspection',
    component: AddInspection,
    meta: {
      module: 'evaluate',
    },
  }, {
    path: '/',
    redirect: {name: 'storeEvaluate'},
  }],
}
