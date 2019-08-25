import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 上传图片
    _uploadImage (target, file) {
      const body = new FormData()
      body.append('file', file)
      body.append('img_type', target) // 上传识别图片类型：1.企业资质,2.身份证明(正面),3.身份证明(反面),4.结算账户(正面),5.结算账户(反面), 6 其他
      return $fetch('quick/qualification/upload_qualification_image', {
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
  },
}
