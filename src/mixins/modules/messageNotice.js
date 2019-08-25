import {$fetch} from '@/plugins/Fetch'
// 公告消息通知
export default {
  methods: {
    // 获取消息列表
    getMessageLists (query) {
      return $fetch('notice/list', {
        method: 'GET',
        body: query,
      })
    },
    // 获取消息详情 notice/detail
    getMessageDetail (query) {
      return $fetch('notice/detail', {query})
    },
    // 获取未读消息数量
    getMessageCount (query) {
      return $fetch('notice/unread-count', {
        method: 'GET',
        body: query,
      })
    },
    // 变更外链阅读状态 notice/change-read-status
    changeMessageState (query) {
      return $fetch('notice/change-read-status', {
        method: 'POST',
        body: query,
      })
    },
  },
}
