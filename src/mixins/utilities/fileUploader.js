import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 上传图片
    _uploadImage (target, file) {
      const body = new FormData()
      body.append('file', file)
      body.append('target', target)
      return $fetch('common/images', {
        method: 'POST',
        body,
      })
    },
    async uploadImage (file, type) {
      try {
        const {response, result} = await this._uploadImage(type, file)
        if (response.status === 200) {
          return {response, result}
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '上传失败',
            // content: `${response.status} ${result.message}`,
            content: '服务异常，请重新上传',
          })
          return {response, result}
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '上传失败',
          content: `错误：${err}`,
        })
      }
    },
    // 上传文件
    _uploadFile (file) {
      const body = new FormData()
      body.append('file', file)
      return $fetch('common/files', {
        method: 'POST',
        body,
      })
    },
    async uploadFile (file) {
      try {
        const {response, result} = await this._uploadFile(file)
        if (response.status === 200) {
          return {response, result}
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '上传文件失败',
            // content: `${response.status} ${result.message}`,
            content: '服务异常，请重新上传',
          })
          return {response, result}
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '上传文件失败',
          content: `错误：${err}`,
        })
      }
    },
  },
}
