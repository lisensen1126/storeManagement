import OpenStoreLayout from '@/components/openStore/OpenStoreLayout'
import StoreAptitude from '@/components/openStore/StoreAptitude'
import EnterpriseWeChatAuthorization from '@/components/openStore/EnterpriseWeChatAuthorization'
import EnterpriseWeChatRegister from '@/components/openStore/EnterpriseWeChatRegister'
import MiniProgramFirst from '@/components/openStore/MiniProgramFirst'
import MiniProgramFirstWait from '@/components/openStore/MiniProgramFirstWait'
import MiniProgramSecond from '@/components/openStore/MiniProgramSecond'
import MiniProgramSecondWait from '@/components/openStore/MiniProgramSecondWait'
import NearbyMiniProgramCategory from '@/components/openStore/NearbyMiniProgramCategory'
import NearbyMiniProgramCategoryRedirect from '@/components/openStore/NearbyMiniProgramCategoryRedirect'
import NearbyMiniProgramCategoryWait from '@/components/openStore/NearbyMiniProgramCategoryWait'
// import NearbyMiniProgramWait from '@/components/openStore/NearbyMiniProgramWait'
import PayMsgFirst from '@/components/openStore/PayMsgFirst'
import PayMsgFirstWait from '@/components/openStore/PayMsgFirstWait'
import PayMsgSecond from '@/components/openStore/PayMsgSecond'
import PayMsgSecondWait from '@/components/openStore/PayMsgSecondWait'
import PayMsgThird from '@/components/openStore/PayMsgThird'
import PayMsgThirdWait from '@/components/openStore/PayMsgThirdWait'
import CompletePage from '@/components/openStore/CompletePage'
import NearbyMiniProgramSotreList from '@/components/openStore/NearbyMiniProgramSotreList'
import NearbyMiniProgramSotreDetail from '@/components/openStore/NearbyMiniProgramSotreDetail'
import NearbyMiniProgramSotreEdit from '@/components/openStore/NearbyMiniProgramSotreEdit'
import NearbyMiniProgramSotreAdd from '@/components/openStore/NearbyMiniProgramSotreAdd'
import OperationVideo from '@/components/openStore/OperationVideo'

export default {
  path: 'openStore',
  component: OpenStoreLayout,
  children: [
    {
      name: 'storeAptitude',
      path: 'storeAptitude',
      component: StoreAptitude,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'enterpriseWeChatAuthorization',
      path: 'enterpriseWeChatAuthorization',
      component: EnterpriseWeChatAuthorization,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'enterpriseWeChatRegister',
      path: 'enterpriseWeChatRegister',
      component: EnterpriseWeChatRegister,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'miniProgramFirst',
      path: 'miniProgramFirst',
      component: MiniProgramFirst,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'miniProgramFirstWait',
      path: 'miniProgramFirstWait',
      component: MiniProgramFirstWait,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'miniProgramSecond',
      path: 'miniProgramSecond',
      component: MiniProgramSecond,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'miniProgramSecondWait',
      path: 'miniProgramSecondWait',
      component: MiniProgramSecondWait,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'nearbyMiniProgramCategory',
      path: 'nearbyMiniProgramCategory',
      component: NearbyMiniProgramCategory,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'nearbyMiniProgramCategoryRedirect',
      path: 'nearbyMiniProgramCategoryRedirect',
      component: NearbyMiniProgramCategoryRedirect,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'nearbyMiniProgramCategoryWait',
      path: 'nearbyMiniProgramCategoryWait',
      component: NearbyMiniProgramCategoryWait,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'operationVideo',
      path: 'operationVideo',
      component: OperationVideo,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'payMsgFirst',
      path: 'payMsgFirst',
      component: PayMsgFirst,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'payMsgFirstWait',
      path: 'payMsgFirstWait',
      component: PayMsgFirstWait,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'payMsgSecond',
      path: 'payMsgSecond',
      component: PayMsgSecond,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'payMsgSecondWait',
      path: 'payMsgSecondWait',
      component: PayMsgSecondWait,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'payMsgThird',
      path: 'payMsgThird',
      component: PayMsgThird,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'payMsgThirdWait',
      path: 'payMsgThirdWait',
      component: PayMsgThirdWait,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'completePage',
      path: 'completePage',
      component: CompletePage,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'nearbyMiniProgramSotreList',
      path: 'nearbyMiniProgramSotreList',
      component: NearbyMiniProgramSotreList,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'nearbyMiniProgramSotreDetail',
      path: 'nearbyMiniProgramSotreDetail',
      component: NearbyMiniProgramSotreDetail,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'nearbyMiniProgramSotreEdit',
      path: 'nearbyMiniProgramSotreEdit',
      component: NearbyMiniProgramSotreEdit,
      meta: {
        module: 'openStore',
      },
    },
    {
      name: 'nearbyMiniProgramSotreAdd',
      path: 'nearbyMiniProgramSotreAdd',
      component: NearbyMiniProgramSotreAdd,
      meta: {
        module: 'openStore',
      },
    },
    {
      path: '/',
      redirect: {name: 'storeAptitude'},
    },
  ],
}
