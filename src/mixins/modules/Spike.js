import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 养护卡详情镜像 upkeep/card-detail-iso
    getCardIsoDetailApi (data) {
      return $fetch('upkeep/card-detail-iso', {
        method: 'GET',
        body: data,
      })
    },
    // 选择养护卡列表
    getCardSpikeApi (data) {
      return $fetch('seckill/upkeep_list', {
        method: 'POST',
        body: data,
      })
    },
    // 养护卡添加秒杀group/insert-card
    addCardSpikeApi (data) {
      return $fetch('seckill/upkeep_create', {
        method: 'POST',
        body: data,
      })
    },
    // 秒杀列表
    spikeListApi (query) {
      return $fetch('seckill/list', {
        method: 'POST',
        body: query,
      })
    },
    // 修改秒杀状态 seckill/update
    statusChangeApi (query) {
      return $fetch('seckill/update', {
        method: 'POST',
        body: query,
      })
    },
    // 创建秒杀
    addSpikeApi (query) {
      return $fetch('seckill/create', {
        method: 'POST',
        body: query,
      })
    },
    // 秒杀详情
    spikeDetailApi (query) {
      return $fetch('seckill/detail', {
        method: 'GET',
        body: query,
      })
    },
    // 服务管理列表 seckill/service
    serviceListApi (query) {
      return $fetch('seckill/service', {
        method: 'GET',
        body: query,
      })
    },
    // 拼团服务管理列表 seckill/service
    groupServeApi (query) {
      return $fetch('group/service-list', {
        method: 'POST',
        body: query,
      })
    },
    // 拼团商品管理列表 seckill/service
    groupGoodApi (query) {
      return $fetch('group/goods-list', {
        method: 'POST',
        body: query,
      })
    },
    // 商品列表 seckill/service
    goodsListApi (query) {
      return $fetch('seckill/product', {
        method: 'GET',
        body: query,
      })
    },
    // 秒杀订单列表 seckill/order_list
    spikeOrderListApi (query) {
      return $fetch('seckill/order_list', {
        method: 'POST',
        body: query,
      })
    },
    // 秒杀排序
    seckillSortApi (query) {
      return $fetch('seckill/sort', {
        method: 'POST',
        body: query,
      })
    },
    // 秒杀删除
    seckillDeleteApi (query) {
      return $fetch('seckill/delete', {
        method: 'POST',
        body: query,
      })
    },
  },
}
