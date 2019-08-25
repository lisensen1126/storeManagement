export default{
  data () {
    return {
      pay_type: [
        {name: '收款码', type: 1},
        {name: '优惠设置', type: 2},
        {name: '快速开单项目', type: 3},
        {name: '收款统计', type: 4},
        {name: '收款记录', type: 5},
      ],
      is_click: null,   // 要在mounted或者activited里初始化此值
      currt_type: {},
    }
  },
  methods: {
    changeTab (e) {
      if (this.is_click === e.type) return
      if (e.type === 1) {
        this.$router.replace({name: 'bill'})
      }
      if (e.type === 2) {
        this.$router.replace({name: 'disaccountSet'})
      }
      if (e.type === 3) {
        this.$router.replace({name: 'openBillItem'})
      }
      if (e.type === 4) {
        this.$router.replace({name: 'gatherStatistics'})
      }
      if (e.type === 5) {
        this.$router.replace({name: 'gatherLog'})
      }
    },
  },
}
