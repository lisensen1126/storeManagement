<template lang="pug">
  .section-layout
    .content-wrapper
      h2.level.header-wrapper
        .level-center
          .icon.user-info-icon-wrapper
            .user-info-icon
          .header-title 成功提交，请尽快支付！
      .content-pay
        .pay-money 
          span 应付金额：
          span.blod(v-text="price") 200.00
          span 元
        .wx-content
          .content-sao
            .content-left
              .wx-pay(v-text="channel === 1 ? '微信支付' : '支付宝支付'") 微信支付
              .code 
                img(:src="root + '/common/qr_code?qr_code=' + qr_code + '&size=200'")
              .saoyisao
                img(src="../../assets/saoyisao.png")
                .sao-text 请使用{{channel === 1 ? '微信' : '支付宝'}}扫一扫<br/>扫描二维码支付
            //- .content-right
            //-   img(src="../../assets/phone.png")
          .content-back
            a.back-button(@click="back") 选择其他支付方式
              img(src="../../assets/back-button.png")
        .bottom-button
          a.button.primary(@click="getDetail") 支付成功
          a.button(@click="back") 支付遇到问题
    loading(v-show="fetchLoading")
</template>
<script>
import marketingMixin from '@/mixins/modules/marketing'
import {root} from '@/plugins/Fetch'
import Loading from '@/components/generics/Loading'

export default {
  name: 'MessageCode',
  mixins: [marketingMixin],
  components: {
    Loading,
  },
  data () {
    return {
      root,
      qr_code: '',
      fetchLoading: false,
      price: '',
      channel: null,
    }
  },
  methods: {
    confirm () {
      this.$router.push({
        name: 'messageAdmin',
      })
    },
    awaitThree () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 3000)
      })
    },
    async getDetail () {
      this.fetchLoading = true
      try {
        await this.awaitThree()
        this.fetchLoading = false
        const {response, result} = await this.getPayOrderDetail({
          order_no: this.$route.query.order_no,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            if (result.data.status === 1) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '充值失败',
                autoClose: true,
              })
              setTimeout(() => {
                this.back()
              }, 1000)
            } else if (result.data.status === 2) {
              this.$store.dispatch('showMessage', {
                type: 'success',
                title: '充值成功',
                autoClose: true,
              })
              setTimeout(() => {
                this.confirm()
              }, 1000)
            }
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取支付信息失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取支付信息失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    back () {
      this.$router.back()
    },
  },
  mounted () {
    this.qr_code = this.$route.query.qr_code
    this.price = this.$route.query.price
    this.channel = this.$route.query.channel
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.section-layout
  padding-top 20px
.content-wrapper
  background #fff
.header-title
  font-size 20px
.level
  justify-content center
.bottom-button
  margin-top 20px
  .primary
    margin-right 20px
.content-pay
  width 700px
  margin 40px auto 0
  height 467px
  .pay-money
    color #121212
    font-weight bold
    font-size 14px
    .blod
      color #ffbb29
  .wx-content
    width 100%
    margin-top 20px
    border-radius 3px
    height 380px
    border 1px solid #DDDDDD
  .content-sao
    display flex
    justify-content center
.content-left
  margin-right 15px
  .wx-pay
    font-size 14px
    color #666
    text-align center
    margin-top 20px
  .code
    width 200px
    height 200px
    img
      width 100%
      height 100%
  .saoyisao
    display flex
    align-items center
    img
      width 60px
      height 60px
    .sao-text
      color #666666
      font-size 14px
      line-height 20px
.content-right
  img
    width 222px
    height 264px
    margin-top 20px
.content-back
  margin-top 20px
  text-align right
  padding-right 20px
  display flex
  justify-content flex-end
  align-items center
  .back-button
    display flex
    width 150px
    justify-content flex-end
    align-items center
    color #666
    font-size 14px
    img
      width 16px
      height 16px
</style>
