import {$fetch} from '@/plugins/Fetch'
// 商品服务管理模块接口
export default {
  methods: {
    // 删除门店回复
    removeRecordApi (query) {
      return $fetch('comment/store/delete', {query})
    },
    // 编辑门店回复
    uodateRecordApi (query) {
      return $fetch('comment/store/update', {
        method: 'POST',
        body: query,
      })
    },
    // 评论列表 - 商品评论列表
    fetchCommentGoods (query) {
      return $fetch('comment/goods', {query})
    },
    // 评论列表 - 服务评论列表
    fetchCommentService (query) {
      return $fetch('comment/service', {query})
    },
    // 评论列表 - 门店评论列表
    fetchCommentStore (query) {
      return $fetch('comment/store', {query})
    },
    fetchCommentStoreReply (query) {
      return $fetch('comment/store/reply', {
        method: 'POST',
        body: query,
      })
    },
    // 车检列表
    fetchVehicleListApi (query) {
      return $fetch('inspect/list_store', {
        method: 'GET',
        body: query,
      })
    },
    // 智能保养 - 工时设置
    fetchWorkingTimeApi (query) {
      return $fetch('store/shop_extend', {
        method: 'GET',
        body: query,
      })
    },
    // 智能保养 - 项目设置
    fetchProjectApi (query) {
      return $fetch('store/store_extend', {
        method: 'GET',
        body: query,
      })
    },
    // 智能保养 - 更新
    updateIMApi (query) {
      return $fetch('store/update_extend_multiple', {
        method: 'POST',
        body: query,
      })
    },
    // 车检报告-PDF详情
    getInspectPdfApi (query) {
      return $fetch(`inspect/report/${query.id}`, {
        method: 'GET',
        body: query,
      })
    },
    /**
     * *************** 车检单 **************/
    // 车检单列表
    getInspectListApi (query) {
      return $fetch('inspect/store_list', {
        method: 'GET',
        body: query,
      })
    },
    // 车检单创建
    getInspectCreateApi (query) {
      return $fetch('inspect/store_create', {
        method: 'POST',
        body: query,
      })
    },
    // 车检单复制
    getInspectCopyApi (query) {
      return $fetch('inspect/store_copy', {
        method: 'POST',
        body: query,
      })
    },
    // 车检单上下架
    getInspectStatusApi (query) {
      return $fetch('inspect/inspect_status', {
        method: 'POST',
        body: query,
      })
    },
    // 车检单删除
    getInspectDeteleApi (query) {
      return $fetch('inspect/store_delete', {
        method: 'POST',
        body: query,
      })
    },
    // 车检单编辑
    getInspectEditApi (query) {
      return $fetch('inspect/store_update', {
        method: 'POST',
        body: query,
      })
    },
    // 车检单详情
    getInspectDetailApi (query) {
      return $fetch('inspect/store_detail', {
        method: 'GET',
        body: query,
      })
    },
    // 项目详情
    getProjectDetailApi (query) {
      return $fetch('inspect/store_project_detail', {
        method: 'GET',
        body: query,
      })
    },
    // 项目详情(创建时调用)
    getCategoryDetailApi (query) {
      return $fetch('inspect/store_category_project', {
        method: 'POST',
        body: query,
      })
    },
  },
}
