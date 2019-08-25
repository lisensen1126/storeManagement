import BasicInformationLayout from '@/components/basicInformation/BasicInformationLayout'
import InformationEdit from '@/components/basicInformation/InformationEdit'
import PostList from '@/components/basicInformation/post/PostList'
import OrganizationList from '@/components/basicInformation/organization/OrganizationList'
import EmployeeList from '@/components/basicInformation/employee/EmployeeList'
import BannersPage from '@/components/basicInformation/pageSetting/BannersPage'
import HotBannersPage from '@/components/basicInformation/pageSetting/HotBannersPage'
import PageSetting from '@/components/basicInformation/pageSetting/PageSetting'
import SuperBannersPage from '@/components/basicInformation/pageSetting/SuperBannersPage'
import BrandArea from '@/components/basicInformation/pageSetting/BrandArea'
import BasicInformationNav from '@/components/basicInformation/BasicInformationNav'
import StoreAdd from '@/components/basicInformation/StoreAdd'
import StoreEdit from '@/components/basicInformation/StoreEdit'
import StoreDetail from '@/components/basicInformation/StoreDetail'
import ServiceCategory from '@/components/basicInformation/ServiceCategory'
import ServiceCategoryAdd from '@/components/basicInformation/ServiceCategoryAdd'
import AuthorityMgr from '@/components/basicInformation/AuthorityMgr'

export default {
  // name: 'basicInformation',
  path: 'basicInformation',
  component: BasicInformationLayout,
  children: [{
    name: 'storeDetail',
    path: 'storeDetail',
    component: StoreDetail,
    meta: {
      module: 'basicInformation',
    },
  }, {
    name: 'storeAdd',
    path: 'storeAdd',
    component: StoreAdd,
    meta: {
      module: 'basicInformation',
    },
  }, {
    name: 'storeEdit',
    path: 'storeEdit',
    component: StoreEdit,
    meta: {
      module: 'basicInformation',
    },
  }, {
    name: 'serviceCategory',
    path: 'serviceCategory',
    component: ServiceCategory,
    meta: {
      module: 'basicInformation',
    },
  }, {
    name: 'serviceCategoryAdd',
    path: 'serviceCategoryAdd',
    component: ServiceCategoryAdd,
    meta: {
      module: 'basicInformation',
    },
  }, {
    name: 'basicInformationNav',
    path: 'basicInformationNav',
    component: BasicInformationNav,
    meta: {
      module: 'basicInformation',
      keppAlive: true,
    },
  }, {
    name: 'informationEdit',
    path: 'informationEdit',
    component: InformationEdit,
    meta: {
      module: 'basicInformation',
    },
  }, {
    name: 'organizationList',
    path: 'organizationList',
    component: OrganizationList,
    meta: {
      module: 'basicInformation',
    },
  }, {
    name: 'postList',
    path: 'postList',
    component: PostList,
    meta: {
      module: 'basicInformation',
    },
  }, {
    name: 'employeeList',
    path: 'employeeList',
    component: EmployeeList,
    meta: {
      module: 'basicInformation',
      keppAlive: true,
      isPreserve: false,
      isOutside: false,
    },
  }, {
    name: 'authorityMgr',
    path: 'employeeList/authorityMgr',
    component: AuthorityMgr,
    meta: {
      module: 'basicInformation',
      isSlibing: true,
    },
  }, {
    name: 'pageSetting',
    path: 'pageSetting',
    component: PageSetting,
    children: [
      {
        name: 'bannersPage',
        path: 'bannersPage',
        component: BannersPage,
        meta: {
          module: 'basicInformation',
        },
      }, {
        name: 'hotBannersPage',
        path: 'hotBannersPage',
        component: HotBannersPage,
        meta: {
          module: 'basicInformation',
        },
      }, {
        name: 'superBannersPage',
        path: 'superBannersPage',
        component: SuperBannersPage,
        meta: {
          module: 'basicInformation',
        },
      }, {
        name: 'brandArea',
        path: 'brandArea',
        component: BrandArea,
        meta: {
          module: 'basicInformation',
        },
      }, {
        path: '/',
        redirect: {name: 'bannersPage'},
      },
    ],
    meta: {
      module: 'basicInformation',
    },
  }, {
    path: '/',
    redirect: {name: 'basicInformationNav'},
  }],
}
