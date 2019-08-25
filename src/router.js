import Router from 'vue-router'
import store from './vuex/store'
import userMixin from '@/mixins/modules/user'

import ManagementLayout from '@/components/ManagementLayout'
import customer from '@/router/customer'
import order from '@/router/order'
import message from '@/router/message'
import productService from '@/router/productService'
import basicInformation from '@/router/basicInformation'
import evaluate from '@/router/evaluate'
import setting from '@/router/setting'
import Login from '@/components/Login'
import workbench from '@/router/workbench'
import marketing from '@/router/marketing'
import Content from '@/router/Content'
import ReportForm from '@/router/ReportForm'
import OpenStore from '@/router/OpenStore'
import synchronize from '@/router/synchronize'
import appCenter from '@/router/appCenter'
const routes = [
  {
    path: '/console',
    component: ManagementLayout,
    children: [
      workbench,
      appCenter,
      customer,
      order,
      message,
      productService,
      basicInformation,
      evaluate,
      setting,
      marketing,
      Content,
      ReportForm,
      OpenStore,
      synchronize,
      {
        path: '',
        redirect: {name: 'writeOffRecord'},
      },
    ],
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      isPublic: true,
      module: 'login',
    },
  },
  {
    path: '/',
    redirect: {name: 'writeOffRecord'},
  },
]

const router = new Router({
  routes,
  linkActiveClass: 'is-active',
})
router.beforeResolve(async (to, from, next) => {
  // start
  // 只有在附近小程序门店详情页面和编辑页面才添加meta标签
  let headNode = document.getElementsByTagName('head')[0]
  let headNodes = headNode.children
  if (to.name === 'nearbyMiniProgramSotreDetail' || to.name === 'nearbyMiniProgramSotreEdit') {
    Array.from(headNodes).forEach((item, index) => {
      if (item.name === 'referrer') {
        headNode.removeChild(item)
      }
    })
    let referrerMeta = document.createElement('meta')
    referrerMeta.name = 'referrer'
    referrerMeta.content = 'never'
    document.getElementsByTagName('head')[0].appendChild(referrerMeta)
  } else {
    Array.from(headNodes).forEach((item, index) => {
      if (item.name === 'referrer') {
        headNode.removeChild(item)
      }
    })
  }
  // end
  if (!to.meta.isPublic && !store.getters.currentUser) {
    try {
      const {response} = await userMixin.methods.updateUserInfo()
      if (response.status !== 200) {
        return next({name: 'login'})
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  next()
})

export default router
