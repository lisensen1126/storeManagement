import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 宣传海报-线下制作 seckill_poster/propagate_made
    makeDownPropagateApi (body) {
      return $fetch('/seckill_poster/propagate_made', {
        method: 'POST',
        body: body,
      })
    },
    // 宣传海报--线下海报打包
    getDownPropagateUrlApi (body) {
      return $fetch('/seckill_poster/propagate_package', {
        method: 'POST',
        body: body,
      })
    },
    // 宣传海报-线上制作 seckill_poster/propagate_online
    makeUpPropagateApi (body) {
      return $fetch('/seckill_poster/propagate_online', {
        method: 'POST',
        body: body,
      })
    },
    // 宣传海报列表 seckill_poster/propagate
    getPropagateListApi (body) {
      return $fetch('/seckill_poster/propagate', {
        method: 'GET',
        body: body,
      })
    },
    // 线下海报打包
    getDownUrlApi (body) {
      return $fetch('/seckill_poster/check_package', {
        method: 'POST',
        body: body,
      })
    },
    // 线上海报制作seckill_poster/onlinePost
    makeUpPosterApi (body) {
      return $fetch('/seckill_poster/online_post', {
        method: 'POST',
        body: body,
      })
    },
    // 线下海报制作seckill_poster/made
    makeDownPosterApi (body) {
      return $fetch('/seckill_poster/made', {
        method: 'POST',
        body: body,
      })
    },
    // 切换海报模板
    changePosterApi (body) {
      return $fetch('/seckill_poster/detail', {
        method: 'POST',
        body: body,
      })
    },
    // 宣传海报列表
    getPropagandaListApi (body) {
      return $fetch('/seckill_poster/bomb_list', {
        method: 'POST',
        body: body,
      })
    },
    // 获取爆炸贴列表
    getBombListApi (body) {
      return $fetch('/seckill_poster/bomb_list', {
        method: 'POST',
        body: body,
      })
    },
    // 下载爆炸贴
    downBombApi (body) {
      return $fetch('/seckill_poster/bomb_made', {
        method: 'POST',
        body: body,
      })
    },
    // 获取海报秒杀列表
    getSpikeGroupApi (body) {
      return $fetch('/seckill_poster/list', {
        method: 'POST',
        body: body,
      })
    },
    // 获取海报背景列表
    getPosterListApi (body) {
      return $fetch('/poster/list', {
        method: 'GET',
        body: body,
      })
    },
    setOfflineOrderNotificationApi (body) {
      return $fetch('/offline_pay/save', {
        method: 'POST',
        body: body,
      })
    },
    getOfflineOrderNotificationApi (body) {
      return $fetch('/offline_pay/detail', {
        method: 'POST',
        body: body,
      })
    },
    // 获取实时语音播报
    getRealTimeApi (body) {
      return $fetch('/offline_pay/get_audio', {
        method: 'GET',
        body: body,
      })
    },
    // 获取线下收款码
    getOffLineQrApi () {
      return $fetch('/store/offline_pay_qrcode', {
        method: 'POST',
      })
    },
    // 线下海报数据统计
    getPosterStatisticListApi (body) {
      return $fetch('/seckill_poster/statistics', {
        method: 'GET',
        body: body,
      })
    },
    // 线下海报数据统计图表
    getPosterChartsApi (body) {
      return $fetch('/seckill_poster/chart', {
        method: 'GET',
        body: body,
      })
    },
    // 收款统计接口
    gatherStatisticsApi (query) {
      return $fetch('/offline_pay/statistics', {
        method: 'POST',
        body: query,
      })
    },
    // 收款记录接口
    gatherLogApi (body) {
      return $fetch('/offline_pay/record', {
        method: 'POST',
        body: body,
      })
    },
    // 员工列表接口
    getStaffListApi (body) {
      return $fetch('/work_wechat/staff/member/simpleList', {
        method: 'GET',
        body: body,
      })
    },
    // 连锁门店名称列表
    getLinkStoreListAPi () {
      return $fetch('/offline_pay/shop_store_list', {
        method: 'POST',
      })
    },
    // 获取报名步骤
    getActiveCurstepAPi () {
      return $fetch('/apply/cur_step', {
        method: 'GET',
      })
    },
    // 开始报名
    createActiveAPi () {
      return $fetch('/apply/create', {
        method: 'POST',
      })
    },
    // 获取报名信息
    getActiveInfoApi () {
      return $fetch('/apply/detail', {
        method: 'GET',
      })
    },
    // 更新报名信息 /apply/update
    setActiveInfoApi (body) {
      return $fetch('/apply/update', {
        method: 'POST',
        body: body,
      })
    },
    // 获取渠道二维码列表
    getChannelQRcodeListApi (body) {
      return $fetch('/collector/list', {
        method: 'POST',
        body: body,
      })
    },
    // 新建渠道二维码
    addChannelQRcodeApi (body) {
      return $fetch('/collector/create', {
        method: 'POST',
        body: body,
      })
    },
    // 渠道二维码数据统计
    channelQRcodeStatistics (body) {
      return $fetch('/collector/stats_total', {
        method: 'POST',
        body: body,
      })
    },
    // 编辑渠道二维码
    updateChannelQRcodeApi (body) {
      return $fetch('/collector/update', {
        method: 'POST',
        body: body,
      })
    },
    // 删除渠道二维码
    deleteChannelQRcodeApi (body) {
      return $fetch('/collector/delete', {
        method: 'POST',
        body: body,
      })
    },
    // 获取渠道二维码详情
    getChannelQRcodeDetailApi (body) {
      return $fetch('/collector/detail', {
        method: 'POST',
        body: body,
      })
    },
    // 获取海报统计列表
    getPosterStatisticsListApi (body) {
      return $fetch('/poster/poster_statistics', {
        method: 'POST',
        body: body,
      })
    },
    // 获取海报统计查看明细
    getPosterStatisticsDetailListApi (body) {
      return $fetch('/poster/poster_statistics_detail', {
        method: 'POST',
        body: body,
      })
    },
    // 获取海报统计用户明细
    getPosterStatisticsUserDetailListApi (body) {
      return $fetch('/poster/poster_customer_detail', {
        method: 'POST',
        body: body,
      })
    },
  },
}
