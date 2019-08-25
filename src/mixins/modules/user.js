import store from '../../vuex/store'
import {$fetch} from '@/plugins/Fetch'
/**
 * 用户信息 相关接口
 * amujoe
 */
const methods = {
  /* APIs */
  fetchUserInfo () {
    return $fetch('auth/user', {
      forceResolve: true,
    })
  },
  fetchEnterpriceAuthorization (query) {
    return $fetch('wx_auth/work_wechat', {
      method: 'GET',
    })
  },
  fetchAppList (query) {
    return $fetch('wx_auth/work_wechat/list', {
      method: 'GET',
    })
  },
  installApp (body) {
    return $fetch('wx_auth/work_app/install', {
      method: 'POST',
      body: {...body},
    })
  },
  getAppDomain (body) {
    return $fetch('wx_auth/work_app/domain', {
      method: 'GET',
      body: {...body},
    })
  },
  authorizationResult (query) {
    return $fetch('wx_auth/work_wechat/authorizationResult', {
      method: 'POST',
      body: query,
    })
  },
  fetchAuthorizations (query) {
    return $fetch('wx_auth/open_platform_info', {query})
  },
  fetchServiceAuthorization (query) {
    return $fetch('wx_auth/mp', {query})
  },
  fetchCorpAuthorization () {
    return $fetch('auth/work')
  },
  fetchMechanicAuthorization () {
    return $fetch('auth/mechanic')
  },
  fetchMaintenanceAuthorization (query) {
    return $fetch('auth/ai_maintenance', {query})
  },
  fetchInspectionAuthorization (query) {
    return $fetch('auth/car_inspection', {query})
  },
  fetchShopAuthorization (query) {
    return $fetch('wx_auth/shop', {query})
  },
  fetchWashingAuthorization (query) {
    return $fetch('auth/washing', {query})
  },
  fetchMenuSet () {
    return $fetch('wx_auth/menu_set', {
      method: 'POST',
    })
  },
  login (query) {
    return $fetch('auth/login', {
      method: 'POST',
      body: query,
    })
  },
  logout () {
    return $fetch('auth/logout')
  },
  settings (name, body) {
    return $fetch(`settings/${name}`, {
      method: 'PUT',
      body,
    })
  },
  updataUserInfo () {
    return $fetch('auth/agree', {
      method: 'POST',
    })
  },
  /* utilities */
  async updateUserInfo () {
    try {
      const {response, result} = await methods.fetchUserInfo()
      if (response.status === 200) {
        store.dispatch('updateUser', result.data)
      }
      return {response, result}
    } catch (err) {
      throw err
    }
  },
  async switchStore (storeID) {
    try {
      const switchOutcome = await $fetch(`store/switch/${storeID}`, {
        method: 'PUT',
      })
      if (switchOutcome.response.status === 200) {
        const userOutcome = await methods.updateUserInfo()
        if (userOutcome.response.status === 200) {
          return switchOutcome
        } else {
          throw userOutcome
        }
      } else {
        throw switchOutcome
      }
    } catch (err) {
      throw err
    }
  },
  // 获取门店公众号推荐配置值
  getOfficialVal () {
    return $fetch('wx_auth/get_val')
  },
  // 设置门店公众号推荐配置值
  setOfficialVal (query) {
    return $fetch('wx_auth/set_val', {
      method: 'GET',
      body: query,
    })
  },
  // 线下买单的功能介绍是否已读接口
  getReadStatusApi () {
    return $fetch('/offline_pay/shop_use_agree', {
      method: 'POST',
    })
  },
  // 设置线下买单的功能介绍为已读
  setHasReadApi (query) {
    return $fetch('/offline_pay/shop_use_status', {
      method: 'POST',
      body: query,
    })
  },
}

export default {
  methods,
}
