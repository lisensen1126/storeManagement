<!--在这个页面，判断支付信息是否完善，然后重定向到相应页面-->
<template lang="pug">
  .section-layout
    timer-shaft(:high-light="4")
</template>

<script>
import TimerShaft from '@/components/openStore/modal/TimerShaft'
import Api from '@/mixins/modules/OpenStore'
export default {
  name: 'payMsgFirstWait',
  mixins: [Api],
  components: {
    TimerShaft,
  },
  methods: {
    // 获取美团支付信息，判断支付信息是否完善，然后重定向到相应页面
    async merchantStore () {
      try {
        const { response, result } = await this.getMerchantApi()
        if (response.status === 200 && result.code === 0) {
          if (result.data.merchantId) {
            this.$router.replace({
              name: 'payMsgSecond',
              query: {},
            })
          } else {
            this.$router.replace({
              name: 'payMsgFirst',
              query: {},
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取美团支付信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取美团支付信息失败',
          content: `错误：${err}`,
        })
      }
    },
  },
  mounted () {
    this.merchantStore() // 获取美团支付信息，判断支付信息是否完善，然后重定向到相应页面
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.section-layout
  height calc(100% - 56px)
  overflow-y auto
</style>

