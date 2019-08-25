import AppCenterLayout from '@/components/appCenter/AppCenterLayout'
import AllAppPage from '@/components/appCenter/AllApp'
import PosterList from '@/components/appCenter/PosterList'
import PayIcon from '@/components/appCenter/PayIcon'
import HotIntroduce from '@/components/appCenter/HotIntroduce'
import PropagandaPoster from '@/components/appCenter/PropagandaPoster'
import SpikePosterList from '@/components/appCenter/SpikePosterList'
import HotRecommendNav from '@/components/appCenter/HotRecommendNav'
import HotPosterDetailNav from '@/components/appCenter/HotPosterDetailNav'
import BombPoster from '@/components/appCenter/BombPoster'
import DataStatistics from '@/components/appCenter/DataStatistics'
import PosterMateriel from '@/components/appCenter/PosterMateriel'
import DisaccountSet from '@/components/appCenter/DisaccountSet'
import GatherLog from '@/components/appCenter/GatherLog'
import GatherStatistics from '@/components/appCenter/GatherStatistics'
import OpenBillItem from '@/components/appCenter/OpenBillItem'
import OfflineBuyIntro from '@/components/appCenter/OfflineBuyIntro'
import ActiveSignUp from '@/components/appCenter/ActiveSignUp'               // 活动报名开始页面
import ActiveSignUpDetail from '@/components/appCenter/ActiveSignUpDetail'   // 活动报名介绍页面
import ActiveSignUpStep from '@/components/appCenter/ActiveSignUpStep'       // 活动报名步骤页面
import ChannelQRcodeNav from '@/components/appCenter/channelQRcode/ChannelQRcodeNav' // 应用中心 - 渠道二维码
import ChannelQRcodeEdit from '@/components/appCenter/channelQRcode/ChannelQRcodeEdit' // 应用中心 - 渠道二维码 - 编辑
import ChannelQRcodeDetail from '@/components/appCenter/channelQRcode/ChannelQRcodeDetail' // 应用中心 - 渠道二维码数据统计 - 查看明细页面
import PosterStatisticsList from '@/components/appCenter/posterStatistics/PosterStatisticsList'  // 应用中心 - 海报统计
import PosterStatisticsDetail from '@/components/appCenter/posterStatistics/PosterStatisticsDetail'  // 应用中心 - 海报统计 此页面为拼团秒杀养护卡的详细页面
import PosterStatisticsDetailBack from '@/components/appCenter/posterStatistics/PosterStatisticsDetailBack'  // 应用中心 - 海报统计 此页面为节日门店活动页面
import PosterStatisticsUserDetail from '@/components/appCenter/posterStatistics/PosterStatisticsUserDetail'  // 应用中心 - 海报统计 明细 -> 用户明细
export default {
  path: 'appcenter',
  component: AppCenterLayout,
  children: [
    {
      name: 'allApp',
      path: 'allApp',
      component: AllAppPage,
      meta: {
        module: 'appcenter',
        keepAlive: true,
      },
    },
    {
      name: 'hotRecommendNav',
      path: 'allApp/hotRecommendNav',
      component: HotRecommendNav,
      children: [
        {
          name: 'spikePosterList',
          path: 'spikePosterList',
          component: SpikePosterList,
          meta: {
            module: 'appcenter',
          },
        },
        {
          path: '/',
          redirect: { name: 'spikePosterList' },
        },
      ],
    },
    {
      name: 'hotPosterDetailNav',
      path: 'allApp/hotPosterDetailNav',
      component: HotPosterDetailNav,
      children: [
        {
          name: 'posterMateriel',
          path: 'posterMateriel',
          component: PosterMateriel,
          meta: {
            module: 'appcenter',
          },
        },
        {
          name: 'dataStatistics',
          path: 'dataStatistics',
          component: DataStatistics,
          meta: {
            module: 'appcenter',
          },
        },
        {
          name: 'bombPoster',
          path: 'bombPoster',
          component: BombPoster,
          meta: {
            module: 'appcenter',
          },
        },
        {
          path: '/',
          redirect: { name: 'posterMateriel' },
        },
      ],
    },
    {
      name: 'hotIntroduce',
      path: 'allApp/hotIntroduce',
      component: HotIntroduce,
      meta: {
        module: 'appcenter',
      },
    },
    {
      name: 'offlineBuyIntro',
      path: 'allApp/offlineBuyIntro',
      component: OfflineBuyIntro,
      meta: {
        module: 'appcenter',
      },
    },
    {
      name: 'propagandaPoster',
      path: 'allApp/propagandaPoster',
      component: PropagandaPoster,
      meta: {
        module: 'appcenter',
      },
    },
    {
      name: 'channelQRcode',
      path: 'allApp/channelQRcodeNav',
      component: ChannelQRcodeNav,
      meta: {
        module: 'appcenter',
        keepAlive: true,
      },
    },
    {
      name: 'channelQRcodeEdit',
      path: 'allApp/channelQRcodeEdit',
      component: ChannelQRcodeEdit,
      meta: {
        module: 'appcenter',
        // keepAlive: true,
      },
    },
    {
      name: 'channelQRcodeDetail',
      path: 'allApp/channelQRcodeDetail',
      component: ChannelQRcodeDetail,
      meta: {
        module: 'appcenter',
        // keepAlive: true,
        isSlibing: true,
      },
    },
    {
      name: 'posterStatistics',
      path: 'allApp/posterStatistics',
      component: PosterStatisticsList,
      meta: {
        module: 'appcenter',
        keepAlive: true,
      },
    },
    {
      name: 'posterStatisticsDetail',
      path: 'allApp/posterStatisticsDetail',
      component: PosterStatisticsDetail,
      meta: {
        module: 'appcenter',
        isSlibing: true,
        // keepAlive: true,
      },
    },
    {
      name: 'posterStatisticsDetailBack',
      path: 'allApp/posterStatisticsDetailBack',
      component: PosterStatisticsDetailBack,
      meta: {
        module: 'appcenter',
        isSlibing: true,
        // keepAlive: true,
      },
    },
    {
      name: 'posterStatisticsUserDetail',
      path: 'allApp/posterStatisticsUserDetail',
      component: PosterStatisticsUserDetail,
      meta: {
        module: 'appcenter',
        // keepAlive: true,
      },
    },
    {
      name: 'posterList',
      path: 'allApp/posterList',
      component: PosterList,
      meta: {
        module: 'appcenter',
      },
    },
    {
      name: 'bill',
      path: 'allApp/bill',
      component: PayIcon,
      meta: {
        module: 'appcenter',
      },
    },
    {
      name: 'disaccountSet',
      path: 'allApp/disaccountSet',
      component: DisaccountSet,
      meta: {
        module: 'appcenter',
      },
    },
    {
      name: 'openBillItem',
      path: 'allApp/openBillItem',
      component: OpenBillItem,
      meta: {
        module: 'appcenter',
      },
    },
    {
      name: 'gatherStatistics',
      path: 'allApp/gatherStatistics',
      component: GatherStatistics,
      meta: {
        module: 'appcenter',
      },
    },
    {
      name: 'gatherLog',
      path: 'allApp/gatherLog',
      component: GatherLog,
      meta: {
        module: 'appcenter',
      },
    },
    {
      name: 'ActiveSignUp',
      path: 'allApp/signup',
      component: ActiveSignUp,
      meta: {
        module: 'appcenter',
      },
    },
    {
      name: 'ActiveSignUpDetail',
      path: 'allApp/signup/info',
      component: ActiveSignUpDetail,
      meta: {
        module: 'appcenter',
      },
    },
    {
      name: 'ActiveSignUpStep',
      path: 'allApp/signup/step',
      component: ActiveSignUpStep,
      meta: {
        module: 'appcenter',
      },
    },
    {
      path: '/',
      redirect: { name: 'posterList' },
    },
  ],
}
