import SettingLayout from '@/components/setting/SettingLayout'
import AuthorizationList from '@/components/setting/AuthorizationList'
import AuthorizationMp from '@/components/setting/AuthorizationMp'
import AuthorizationEnterprice from '@/components/setting/AuthorizationEnterprice'
import AuthorizationEnterpriceForm from '@/components/setting/AuthorizationEnterpriceForm'
import AuthorizationMechanic from '@/components/setting/AuthorizationMechanic'
import AuthorizationShop from '@/components/setting/AuthorizationShop'
import AuthorizationSecret from '@/components/setting/AuthorizationSecret'
import TransferPage from '@/components/setting/TransferPage'
import DataOpenSetting from '@/components/setting/DataOpenSetting'
import PassWordSetting from '@/components/setting/PassWordSetting'

export default {
  // name: 'setting',
  path: 'setting',
  component: SettingLayout,
  children: [{
    name: 'authorizations',
    path: 'authorizations',
    component: AuthorizationList,
    meta: {
      module: 'setting',
    },
  }, {
    name: 'authorizationService',
    path: 'authorizations/service',
    component: AuthorizationMp,
    meta: {
      module: 'setting',
    },
  }, {
    name: 'authorizationEnterprice',
    path: 'authorizations/enterprice',
    component: AuthorizationEnterprice,
    meta: {
      module: 'setting',
    },
  }, {
    name: 'authorizationEnterpriceForm',
    path: 'authorizations/enterprice-form',
    component: AuthorizationEnterpriceForm,
    meta: {
      module: 'setting',
    },
  }, {
    name: 'authorizationMechanic',
    path: 'authorizations/mechanic',
    component: AuthorizationMechanic,
    meta: {
      module: 'setting',
    },
  }, {
    name: 'authorizationShop',
    path: 'authorizations/shop',
    component: AuthorizationShop,
    meta: {
      module: 'setting',
    },
  }, {
    name: 'authorizationSecret',
    path: 'authorizations/secret',
    component: AuthorizationSecret,
    meta: {
      module: 'setting',
    },
  }, {
    name: 'transferPage',
    path: 'transferPage',
    component: TransferPage,
    meta: {
      module: 'setting',
    },
  }, {
    name: 'dataOpenSetting',
    path: 'dataOpenSetting',
    component: DataOpenSetting,
    meta: {
      module: 'setting',
    },
  }, {
    name: 'passWordSetting',
    path: 'passWordSetting',
    component: PassWordSetting,
    meta: {
      module: 'setting',
    },
  }, {
    path: '/',
    redirect: {name: 'authorizations'},
  }],
}
