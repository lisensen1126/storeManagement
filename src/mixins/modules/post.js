import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    fetchPost (query) {
      return $fetch('work_wechat/station', {query})
    },
    savePost (query) {
      return $fetch('work_wechat/station/add', {
        method: 'POST',
        body: query,
      })
    },
    updatePost (query) {
      return $fetch('work_wechat/station/update', {
        method: 'POST',
        body: query,
      })
    },
    removePost (query) {
      return $fetch('work_wechat/station/delete', {
        method: 'POST',
        body: query,
      })
    },
  },
}
