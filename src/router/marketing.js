import MarketingLayout from '@/components/marketing/MarketingLayout'
import WashingMarketing from '@/components/marketing/WashingMarketing'
import CouponList from '@/components/marketing/CouponList'
import CouponCreate from '@/components/marketing/CouponCreate'
import turnplateAdd from '@/components/marketing/turnplateAdd'
import turnplateList from '@/components/marketing/turnplateList'
import GroupPurshareList from '@/components/marketing/GroupPurshareList'
import marketingAllocation from '@/components/marketing/marketingAllocation'
import TurnplateDetail from '@/components/marketing/turnplateDetail'
import CouponGive from '@/components/marketing/CouponGive'
import CouponListNav from '@/components/marketing/CouponListNav'
import CouponsRecord from '@/components/marketing/CouponRecordList'
import MessageNav from '@/components/marketing/MessageNav'
import MessageAdmin from '@/components/marketing/MessageAdmin'
import MessagePush from '@/components/marketing/MessagePush'
import MessagePay from '@/components/marketing/MessagePay'
import MessageCode from '@/components/marketing/MessageCode'
import MessageBuyRecord from '@/components/marketing/MessageBuyRecord'
import MessageDetail from '@/components/marketing/MessageDetail'
import MessageConfirm from '@/components/marketing/MessageConfirm'
import GroupEventNav from '@/components/marketing/group/GroupEventNav'
import GroupMangeList from '@/components/marketing/group/GroupMangeList'
import GroupRecordsList from '@/components/marketing/group/GroupRecordsList'
import GroupGoodAdd from '@/components/marketing/group/GroupGoodAdd'
import GroupServeAdd from '@/components/marketing/group/GroupServeAdd'
import GroupCardAdd from '@/components/marketing/group/GroupCardAdd'
import GroupGoodEdit from '@/components/marketing/group/GroupGoodEdit'
import GroupCardEdit from '@/components/marketing/group/GroupCardEdit'
import GroupServeEdit from '@/components/marketing/group/GroupServeEdit'
import GroupGoodDetail from '@/components/marketing/group/GroupGoodDetail'
import GroupServeDetail from '@/components/marketing/group/GroupServeDetail'
import GroupCardDetail from '@/components/marketing/group/GroupCardDetail'
import GroupCardRecord from '@/components/marketing/group/GroupCardRecord'
import GroupRecordDetail from '@/components/marketing/group/GroupRecordDetail'
import GroupServeRecord from '@/components/marketing/group/GroupServeRecord'
import SpikeList from '@/components/marketing/spike/SpikeList'
import SpikeNav from '@/components/marketing/spike/SpikeNav'
import TradeRecord from '@/components/marketing/spike/TradeRecord'
import SpikeDetail from '@/components/marketing/spike/SpikeDetail'
import SpikeCardDetail from '@/components/marketing/spike/SpikeCardDetail'
import SpikeGoodAdd from '@/components/marketing/spike/SpikeGoodAdd'
import SpikeServeAdd from '@/components/marketing/spike/SpikeServeAdd'
import SpikeCardAdd from '@/components/marketing/spike/SpikeCardAdd'
import SpikeGoodEdit from '@/components/marketing/spike/SpikeGoodEdit'
import SpikeCardEdit from '@/components/marketing/spike/SpikeCardEdit'
import SpikeServeEdit from '@/components/marketing/spike/SpikeServeEdit'
// 推送
import PushList from '@/components/marketing/push/PushList'
import FirstSendAdd from '@/components/marketing/push/FirstSendAdd'
import SecondSendAdd from '@/components/marketing/push/SecondSendAdd'
import SendRecordList from '@/components/marketing/push/SendRecordList'
import SendResult from '@/components/marketing/push/SendResult'

export default {
  // name: 'marketing',
  path: 'marketing',
  component: MarketingLayout,
  children: [{
    name: 'pushList', // 推送列表
    path: 'pushList',
    component: PushList,
    meta: {
      module: 'marketing',
      keepAlive: true,
      isOutside: false,
      isPreserve: false,
    },
  }, {
    name: 'firstSendAdd', // 新建推送第一步
    path: 'pushList/firstSendAdd',
    component: FirstSendAdd,
    meta: {
      module: 'marketing',
      isSlibing: true,
    },
  }, {
    name: 'secondSendAdd', // 新建推送第二步
    path: 'pushList/secondSendAdd',
    component: SecondSendAdd,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'sendRecordList', // 新建推送记录第二步
    path: 'pushList/sendRecordList',
    component: SendRecordList,
    meta: {
      module: 'marketing',
      isSlibing: true,
    },
  }, {
    name: 'sendResult', // 新建推送记录第二步
    path: 'pushList/sendResult',
    component: SendResult,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'spikeList',
    path: 'spikeList',
    component: SpikeList,
    meta: {
      module: 'marketing',
      keepAlive: true,
      isOutside: false,
      isPreserve: false,
    },
  }, {
    name: 'spikeAdd',
    path: 'spikeList/spikeAdd',
    component: SpikeGoodAdd,
    meta: {
      module: 'marketing',
      isSlibing: true,
    },
  }, {
    name: 'spikeServeAdd',
    path: 'spikeList/spikeServeAdd',
    component: SpikeServeAdd,
    meta: {
      module: 'marketing',
      isSlibing: true,
    },
  }, {
    name: 'spikeCardAdd',
    path: 'spikeList/spikeCardAdd',
    component: SpikeCardAdd,
    meta: {
      module: 'marketing',
      isSlibing: true,
    },
  }, {
    name: 'spikeGoodEdit',
    path: 'spikeList/spikeGoodEdit',
    component: SpikeGoodEdit,
    meta: {
      module: 'marketing',
      isSlibing: true,
    },
  }, {
    name: 'spikeCardEdit',
    path: 'spikeList/spikeCardEdit',
    component: SpikeCardEdit,
    meta: {
      module: 'marketing',
      isSlibing: true,
    },
  }, {
    name: 'spikeServeEdit',
    path: 'spikeList/spikeServeEdit',
    component: SpikeServeEdit,
    meta: {
      module: 'marketing',
      isSlibing: true,
    },
  }, {
    name: 'groupServeAdd',
    path: 'group/groupServeAdd',
    component: GroupServeAdd,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'groupCardAdd',
    path: 'group/groupCardAdd',
    component: GroupCardAdd,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'groupServeEdit',
    path: 'group/groupServeEdit',
    component: GroupServeEdit,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'groupServeDetail',
    path: 'group/groupServeDetail',
    component: GroupServeDetail,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'groupCardDetail',
    path: 'group/groupCardDetail',
    component: GroupCardDetail,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'groupAdd',
    path: 'group/groupAdd',
    component: GroupGoodAdd,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'groupRecord',
    path: 'group/groupRecord',
    component: GroupRecordDetail,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'serveRecord',
    path: 'group/serveRecord',
    component: GroupServeRecord,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'cardRecord',
    path: 'group/cardRecord',
    component: GroupCardRecord,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'groupDetail',
    path: 'group/groupDetail',
    component: GroupGoodDetail,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'groupEdit',
    path: 'group/groupEdit',
    component: GroupGoodEdit,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'groupCardEdit',
    path: 'group/cardEdit',
    component: GroupCardEdit,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'spike',
    path: 'spikeList',
    component: SpikeNav,
    meta: {
      module: 'marketing',
    },
    children: [{
      name: 'spikeTrade',
      path: 'spikeTrade',
      component: TradeRecord,
      meta: {
        module: 'marketing',
        isSlibing: true,
      },
    }, {
      name: 'spikeDetail',
      path: 'spikeDetail',
      component: SpikeDetail,
      meta: {
        module: 'marketing',
        isSlibing: true,
      },
    }, {
      name: 'spikeCardDetail',
      path: 'spikeCardDetail',
      component: SpikeCardDetail,
      meta: {
        module: 'marketing',
        isSlibing: true,
      },
    }, {
      path: '/',
      redirect: {
        name: 'spikeDetail',
      },
    }],
  }, {
    name: 'group',
    path: 'group',
    component: GroupEventNav,
    meta: {
      module: 'marketing',
    },
    children: [{
      name: 'mangeList',
      path: 'mangeList',
      component: GroupMangeList,
      meta: {
        module: 'marketing',
      },
    }, {
      name: 'recordList',
      path: 'recordList',
      component: GroupRecordsList,
      meta: {
        module: 'marketing',
      },
    }, {
      path: '/',
      redirect: {
        name: 'mangeList',
      },
    }],
  }, {
    name: 'list',
    path: 'list',
    component: CouponListNav,
    meta: {
      module: 'marketing',
    },
    children: [{
      name: 'coupons',
      path: 'coupons',
      component: CouponList,
      meta: {
        module: 'marketing',
      },
    }, {
      name: 'couponsRecordList',
      path: 'couponsRecordList',
      component: CouponsRecord,
      meta: {
        module: 'marketing',
      },
    }, {
      path: '/',
      redirect: {
        name: 'coupons',
      },
    }],
  }, {
    name: 'couponCreation',
    path: 'list/create',
    component: CouponCreate,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'tools',
    path: 'tools',
    component: WashingMarketing,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'turnplateList',
    path: 'turnplateList',
    component: turnplateList,
    meta: {
      module: 'marketing',
      keepAlive: true,
    },
  }, {
    name: 'groupPurshareList',
    path: 'groupPurshareList',
    component: GroupPurshareList,
    meta: {
      module: 'marketing',
      keepAlive: true,
    },
  }, {
    name: 'marketingAllocation',
    path: 'marketingAllocation',
    component: marketingAllocation,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'couponGive',
    path: 'list/couponGive',
    component: CouponGive,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'turnplateAdd',
    path: 'turnplateList/add/:id',
    component: turnplateAdd,
    meta: {
      module: 'marketing',
      keepAlive: false,
    },
  }, {
    name: 'turnplateDetail',
    path: 'turnplateList/detail/:id',
    component: TurnplateDetail,
    meta: {
      module: 'marketing',
      keepAlive: false,
    },
  }, {
    name: 'messageNav',
    path: 'messageNav',
    component: MessageNav,
    children: [{
      name: 'messageAdmin',
      path: 'messageAdmin',
      component: MessageAdmin,
      meta: {
        module: 'marketing',
      },
    }, {
      name: 'messagePush',
      path: 'messagePush',
      component: MessagePush,
      meta: {
        module: 'marketing',
      },
    },
    {
      path: '/',
      redirect: {
        name: 'messageAdmin',
      },
    },
    ],
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'messagePay',
    path: 'messageNav/messagePay',
    component: MessagePay,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'messageCode',
    path: 'messageNav/messageCode',
    component: MessageCode,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'messageBuyRecord',
    path: 'messageNav/messageBuyRecord',
    component: MessageBuyRecord,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'smsdetail',
    path: 'messageNav/smsdetail',
    component: MessageDetail,
    meta: {
      module: 'marketing',
    },
  }, {
    name: 'messageConfirm',
    path: 'messageNav/messageConfirm',
    component: MessageConfirm,
    meta: {
      module: 'marketing',
    },
  }, {
    path: '/',
    redirect: {
      name: 'list',
    },
  }],
}
