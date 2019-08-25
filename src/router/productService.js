import ProductServiceLayout from '@/components/productService/ProductServiceLayout'
import ProductList from '@/components/productService/ProductList'
import ProductAdd from '@/components/productService/ProductAdd'
import ProductEdit from '@/components/productService/ProductEdit'
import ProductDetail from '@/components/productService/ProductDetail'
import ServiceList from '@/components/productService/ServiceList'
import ServiceAdd from '@/components/productService/ServiceAdd'
import ServiceEdit from '@/components/productService/ServiceEdit'
import ServiceDetail from '@/components/productService/ServiceDetail'
import ServiceLibrary from '@/components/productService/ServiceLibrary'
import ServiceLibraryDetail from '@/components/productService/ServiceLibraryDetail'
import ProductLibrary from '@/components/productService/ProductLibrary'
import ProductLibraryDetail from '@/components/productService/ProductLibraryDetail'
import ProductLibraryEdit from '@/components/productService/ProductLibraryEdit'
import CardManagementSetting from '@/components/productService/CardManagementSetting'
import CardManagementList from '@/components/productService/CardManagementList'
import CardManagementAddShell from '@/components/productService/CardManagementAddShell' // 选择壳牌养护卡
import CardManagementAdd from '@/components/productService/CardManagementAdd' // 门店自建养护卡
import CardManagementAddTwo from '@/components/productService/CardManagementAddTwo' // 门店自建养护卡第二步
import CardManagementDetail from '@/components/productService/CardManagementDetail'
import CardSelfBuild from '@/components/productService/CardSelfBuild' // 门店自建次卡
import ChooseShellCard from '@/components/productService/ChooseShellCard'
import StatisticalList from '@/components/productService/StatisticalList'
import StatisticalDetail from '@/components/productService/StatisticalDetail'

export default {
  path: 'productService',
  component: ProductServiceLayout,
  children: [
    {
      name: 'productList',
      path: 'productList',
      component: ProductList,
      meta: {
        module: 'productService',
        keepAlive: true,
        isPreserve: false,
        isOutside: false,
      },
    },
    {
      name: 'productEdit',
      path: 'productList/productEdit/:id',
      component: ProductEdit,
      meta: {
        module: 'productService',
        isSlibing: true,
      },
    },
    {
      name: 'productAdd',
      path: 'productList/productAdd',
      component: ProductAdd,
      meta: {
        module: 'productService',
        isSlibing: true,
      },
    },
    {
      name: 'productDetail',
      path: 'productList/productDetail/:id',
      component: ProductDetail,
      meta: {
        module: 'productService',
        isSlibing: true,
      },
    },
    {
      name: 'serviceList',
      path: 'service',
      component: ServiceList,
      meta: {
        module: 'productService',
        keepAlive: true,
        isOutside: false,
        isPreserve: false,
      },
    },
    {
      name: 'serviceAdd',
      path: 'service/serviceAdd',
      component: ServiceAdd,
      meta: {
        module: 'productService',
        isSlibing: true
      },
    },
    {
      name: 'serviceEdit',
      path: 'service/serviceEdit/:id',
      component: ServiceEdit,
      meta: {
        module: 'productService',
        isSlibing: true
      },
    },
    {
      name: 'serviceDetail',
      path: 'service/serviceDetail/:id',
      component: ServiceDetail,
      meta: {
        module: 'productService',
        isSlibing: true
      },
    },
    {
      name: 'serviceLibrary',
      path: 'serviceLibrary',
      component: ServiceLibrary,
      meta: {
        module: 'productService',
        keepAlive: true,
      },
    },
    {
      name: 'serviceLibraryDetail',
      path: 'serviceLibrary/serviceLibraryDetail/:id',
      component: ServiceLibraryDetail,
      meta: {
        module: 'productService',
        isSlibing: true
      },
    },
    {
      name: 'productLibrary',
      path: 'productLibrary',
      component: ProductLibrary,
      meta: {
        module: 'productService',
        keepAlive: true,
      },
    },
    {
      name: 'productLibraryEdit',
      path: 'productList/productLibraryEdit/:id',
      component: ProductLibraryEdit,
      meta: {
        module: 'productService',
        isSlibing: false
      },
    },
    {
      name: 'productLibraryDetail',
      path: 'productLibrary/productLibraryDetail/:id',
      component: ProductLibraryDetail,
      meta: {
        module: 'productService',
        isSlibing: true
      },
    },
    {
      name: 'cardManagementSetting',
      path: 'cardManagementSetting',
      component: CardManagementSetting,
      children: [
        {
          name: 'cardManagementList',
          path: 'cardManagementList',
          component: CardManagementList,
          meta: {
            module: 'productService',
          },
        },
        {
          name: 'statisticalList',
          path: 'statisticalList',
          component: StatisticalList,
          meta: {
            module: 'productService',
          },
        },
        {
          path: '/',
          redirect: {name: 'cardManagementList'},
        },
      ],
      meta: {
        module: 'productService',
      },
    },
    {
      name: 'cardSelfBuild',
      path: 'cardManagementSetting/cardSelfBuild',
      component: CardSelfBuild,
      meta: {
        module: 'productService',
      },
    },
    {
      name: 'cardManagementAdd',
      path: 'cardManagementSetting/cardManagementAdd',
      component: CardManagementAdd,
      meta: {
        module: 'productService',
      },
    },
    {
      name: 'cardManagementAddTwo',
      path: 'cardManagementSetting/cardManagementAddTwo',
      component: CardManagementAddTwo,
      meta: {
        module: 'productService',
      },
    },
    {
      name: 'cardManagementAddShell',
      path: 'cardManagementSetting/cardManagementAddShell',
      component: CardManagementAddShell,
      meta: {
        module: 'productService',
      },
    },
    {
      name: 'chooseShellCard',
      path: 'cardManagementSetting/chooseShellCard',
      component: ChooseShellCard,
      meta: {
        module: 'productService',
      },
    },
    {
      name: 'cardManagementDetail',
      path: 'cardManagementSetting/cardManagementDetail',
      component: CardManagementDetail,
      meta: {
        module: 'productService',
      },
    },
    {
      name: 'statisticalDetail',
      path: 'cardManagementSetting/statisticalDetail',
      component: StatisticalDetail,
      meta: {
        module: 'productService',
      },
    },
    {
      path: '/',
      redirect: {
        name: 'productList',
      },
    },
  ],
}
