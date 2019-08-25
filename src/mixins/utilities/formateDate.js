export default {
  methods: {
    getYearMonth (time) {
      let date = new Date(time * 1000)
      let year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      return {data: year + '年' + month + '月', year: year, month: month}
    },
    /**
     * @param time {Number} 时间戳
     * @param isTime {Boolean} 是否显示具体时间  09:11:05
     * @returns {string} 返回值
     */
    formateDate (time, isTime, type = 1) {
      let date = new Date(time * 1000)
      let year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (type === 1) {
        // 拼接
        return year + '年' + month + '月' + day + '日' + (isTime ? hours + ':' + minutes + ':' + seconds : '')
      } else {
        // 拼接
        return year + '-' + month + '-' + day + ' ' + (isTime ? hours + ':' + minutes : '')
      }
    },
  },
}
