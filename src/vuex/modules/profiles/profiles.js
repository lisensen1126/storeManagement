import mutations from './mutations'
import actions from './actions'

const state = {
  staff: [],
  stores: [],
  insurances: [],
  brands: [],
  salesAssistants: [],
  mechanics: [],
  shopCategories: [],
  olist: [],
  massageCount: '',
  wxStatus: '', // 判断企业微信是否授权
  wxRegister: '', // 判断企业微信是否注册
  judgeAudio: 1,    // 判断语音播报是否开启  1.开启，2.未开启
  miniStatus: null, // 判断小程序申请二审核状态
}
const getters = {
  // 请求数据时加载状态
  olist: state => state.olist,
  massageCount: state => state.massageCount,
  wxRegister: state => state.wxRegister,
  wxStatus: state => state.wxStatus,
  judgeAudio: state => state.judgeAudio,
  miniStatus: state => state.miniStatus,
}
export default {
  getters,
  state,
  mutations,
  actions,
}
