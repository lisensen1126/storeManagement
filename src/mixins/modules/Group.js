import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 拼团养护卡详情镜像 upkeep/card-detail-iso
    getCardIsoDetailApi (data) {
      return $fetch('upkeep/card-detail-iso', {
        method: 'GET',
        body: data,
      })
    },
    // 改变拼团养护卡状态 group/change-status-card
    changeStatusCardApi (data) {
      return $fetch('group/change-status-card', {
        method: 'POST',
        body: data,
      })
    },
    // 选择养护卡列表
    getCardGroupApi (data) {
      return $fetch('group/list-card', {
        method: 'POST',
        body: data,
      })
    },
    // 养护卡添加拼团 group/insert-card
    addCardGroupApi (data) {
      return $fetch('group/insert-card', {
        method: 'POST',
        body: data,
      })
    },
    // 养护卡编辑拼团 group/update-card
    editCardGroupApi (data) {
      return $fetch('group/update-card', {
        method: 'POST',
        body: data,
      })
    },
    // 拼团商品详情 /group/product-history-detail
    eventDetailApi (query) {
      return $fetch('group/product-history-detail', {
        method: 'POST',
        body: query,
      })
    },
    // 拼团列表
    groupListApi (query) {
      return $fetch('group/list', {
        method: 'POST',
        body: query,
      })
    },
    // 修改拼团状态 seckill/update
    statusChangeApi (query) {
      return $fetch('group/change-status', {
        method: 'POST',
        body: query,
      })
    },
    // 创建
    addGroupApi (query) {
      return $fetch('group/save', {
        method: 'POST',
        body: query,
      })
    },
    // 编辑
    editGroupApi (query) {
      return $fetch('group/update', {
        method: 'POST',
        body: query,
      })
    },
    // 详情
    groupDetailApi (query) {
      return $fetch('group/detail-image', {
        method: 'POST',
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
    // 商品列表 seckill/service
    goodsListApi (query) {
      return $fetch('seckill/product', {
        method: 'GET',
        body: query,
      })
    },
    // 删除拼团活动
    groupDeleteApi (query) {
      return $fetch('group/delete', {
        method: 'POST',
        body: query,
      })
    },
    // 拼团记录列表
    groupRecordListApi (query) {
      return $fetch('group/record-list', {
        method: 'POST',
        body: query,
      })
    },
    // 拼团记录详情
    groupRecordDetailApi (query) {
      return $fetch('group/record-detail', {
        method: 'POST',
        body: query,
      })
    },
    // 拼团排序
    groupSortApi (query) {
      return $fetch('group/sort', {
        method: 'POST',
        body: query,
      })
    },
  },
}
