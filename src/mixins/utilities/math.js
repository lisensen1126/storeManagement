// 用于解决浮点数运算精度缺失
export default {
  methods: {
    // 两个浮点数相加
    accAdd (num1, num2) {
      if ((!num1 && Number(num1) !== 0) || (!num2 && Number(num2 !== 0))) {
        return
      }
      var r1, r2, m
      try {
        r1 = num1.toString().split('.')[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = num2.toString().split('.')[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2))
      return Math.round(num1 * m + num2 * m) / m
      // return (Math.round(num1 * m + num2 * m) / m).toFixed(2);
    },
    // 两个浮点数相减
    accSub (num1, num2) {
      if ((!num1 && Number(num1) !== 0) || (!num2 && Number(num2 !== 0))) {
        return
      }
      var r1, r2, m
      try {
        r1 = num1.toString().split('.')[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = num2.toString().split('.')[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2))
      return Math.round(num1 * m - num2 * m) / m
      // return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
    },
    // 两数相乘
    accMul (num1, num2) {
      if ((!num1 && Number(num1) !== 0) || (!num2 && Number(num2 !== 0))) {
        return
      }
      let m = 0
      let s1 = num1.toString()
      let s2 = num2.toString()
      try {
        m += s1.split('.')[1].length
      } catch (e) { }
      try {
        m += s2.split('.')[1].length
      } catch (e) { }
      return (
          (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
          Math.pow(10, m)
      )
        // return (
        //   (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
        //   Math.pow(10, m)
        // ).toFixed(2);
    },
    // 两数相除
    accDiv (num1, num2) {
      if ((!num1 && Number(num1) !== 0) || (!num2 && Number(num2 !== 0))) {
        return
      }
      var t1, t2, r1, r2
      try {
        t1 = num1.toString().split('.')[1].length
      } catch (e) {
        t1 = 0
      }
      try {
        t2 = num2.toString().split('.')[1].length
      } catch (e) {
        t2 = 0
      }
      r1 = Number(num1.toString().replace('.', ''))
      r2 = Number(num2.toString().replace('.', ''))
      return (r1 / r2) * Math.pow(10, t2 - t1)
      // return (r1 / r2) * Math.pow(10, t2 - t1).toFixed(2);
    },
  },
}
