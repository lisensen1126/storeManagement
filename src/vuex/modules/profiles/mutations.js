import * as types from './types'

export default {
  // replace staff with the latest copy
  [types.REFRESH_STAFF] ({staff}, latest) {
    staff.splice(0, staff.length, ...latest)
  },
  [types.REFRESH_STORES] ({stores}, latest) {
    stores.splice(0, stores.length, ...latest)
  },
  [types.REFRESH_INSURANCES] ({insurances}, latest) {
    insurances.splice(0, insurances.length, ...latest)
  },
  [types.REFRESH_BRANDS] ({brands}, latest) {
    brands.splice(0, brands.length, ...latest)
  },
  [types.REFRESH_SALES_ASSISTANT] ({salesAssistants}, latest) {
    salesAssistants.splice(0, salesAssistants.length, ...latest)
  },
  [types.REFRESH_MECHANIC] ({mechanics}, latest) {
    mechanics.splice(0, mechanics.length, ...latest)
  },
  [types.REFRESH_SHOP_CATEGORIES] ({shopCategories}, latest) {
    shopCategories.splice(0, shopCategories.length, ...latest)
  },
  [types.CLEAR__STORES] (state) {
    state.stores = []
  },
  [types.MESSAGE_OLIST] ({olist}, latest) {
    olist.splice(0, olist.length, ...latest)
  },
  [types.MESSAGE_COUNT] (state, latest) {
    state.massageCount = latest.count
  },
  [types.WX_STATUS] (state, latest) {
    state.wxRegister = latest.register_status
    state.wxStatus = latest.authorize_status
  },
  [types.JUDGE_AUDIO] (state, latest) {
    console.log(latest)
    state.judgeAudio = latest
  },
  [types.MINI_STATUS] (state, latest) {
    state.miniStatus = latest.result.code
  },
}
