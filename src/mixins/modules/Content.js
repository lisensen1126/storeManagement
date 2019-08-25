import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    BrandListApi (query) {
      return $fetch('common/brand', {
        method: 'GET',
        body: query,
      })
    },
    // 内容列表 boss
    ContentListBossApi (query) {
      return $fetch('content/boss', {
        method: 'GET',
        body: query,
      })
    },
    // 内容列表
    ContentListApi (query) {
      return $fetch('content/contents', {
        method: 'GET',
        body: query,
      })
    },
    // 内容-创建
    ContentCreateApi (query) {
      return $fetch('content/contents', {
        method: 'POST',
        body: query,
      })
    },
    // 内容-更新
    ContentUpdateApi (query) {
      return $fetch(`content/contents/${query.id}`, {
        method: 'PUT',
        body: query,
      })
    },
    // 内容-详情
    ContentDetailApi (query) {
      return $fetch(`content/contents/${query.id}`, {
        method: 'GET',
        body: query,
      })
    },
    // 内容-删除
    ContentDeleteApi (query) {
      return $fetch(`content/contents/${query.id}`, {
        method: 'DELETE',
        body: query,
      })
    },
  },
}
