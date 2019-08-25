export default {
  methods: {
    parseDistanc (distance) {
      if (distance < 1000) {
        return parseFloat(distance).toFixed(1) + 'm'
      } else {
        return distance / 1000 > 99 ? '99+km' : (distance / 1000).toFixed(1) + 'km'
      }
    },
    scaleImage (url, mode, width, height) {
      // imageMogr2/auto-orient,是为了解决ios图片倒置90度问题，后台如果要用imageMogr2压缩图片展示，就不需要这个参数了
      if (url.indexOf('?imageMogr2/auto-orient') > -1) {
        url = url.replace('?imageMogr2/auto-orient', '')
      }
      return `${url}?imageView2/${mode}/w/${width}/h/${height}`
    },
    /**
     * 年月日转换为时间戳
     * @date 年月日
     */
    timeStamp (date) {
      return date ? parseInt(new Date(date + ' 00:00').getTime() / 1000) : ''
    },
    /**
       * 时间戳转年月日
       * @val  时间戳
       */
    changeDateTime (val) {
      if (!val) {
        return ''
      }
      let date = new Date(val * 1000)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = this.judgeTime(date.getDate()) + ' '
      // let h = this.judgeTime(date.getHours()) + ':'
      // let m = this.judgeTime(date.getMinutes())
      return Y + M + D
    },
    /**
     * 时 分 格式化
     * @t  时分
     */
    judgeTime (t) {
      if (t < 10) {
        return '0' + t
      } else {
        return t
      }
    },
  },
}
