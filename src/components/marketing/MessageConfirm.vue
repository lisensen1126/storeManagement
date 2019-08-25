<template lang="pug">
  .section-layout
    .content-wrapper
      h2.level.header-wrapper
        .level-left
          .icon.user-info-icon-wrapper
            .user-info-icon
          .header-title 收银台
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 商品名称
            .labelname(v-text="info.product_name") 2000条短信套餐
          .field.is-horizontal
            label.label 支付金额
            .labelname.yellow(v-text="info.price ? ('¥' + info.price) : 0 ") ¥200.00 
      .form-wrapper.b-t-0
        label.label 选择支付方式
        .field-group.row-flex
          a.field.is-horizontal.pay-way(:class="wx_check ? 'active' : ''",@click="switchWay(1)")
            .wx-pay
              img(class="logo",src="../../assets/wx.png")
              .text 微信
            img(src="../../assets/wx-check.png",class="checked",v-if="wx_check")
          a.field.is-horizontal.pay-way(:class="zfb_check ? 'active' : ''",@click="switchWay(2)")
            .wx-pay
              img(class="logo",src="../../assets/zhifubao.png")
              .text 支付宝
            img(src="../../assets/wx-check.png",class="checked",v-if="zfb_check")
        .bottom-button
          a.button.primary(@click="confirm") 确认支付
          a.button(@click="back") 取消
</template>
<script>
import marketingMixin from '@/mixins/modules/marketing'

export default {
  name: 'MessageConfirm',
  mixins: [marketingMixin],
  components: {
  },
  data () {
    return {
      wx_check: true,
      zfb_check: false,
      info: {},
      order_info: {},
    }
  },
  methods: {
    switchWay (type) {
      if (type === 1) {
        this.wx_check = true
        this.zfb_check = false
      } else if (type === 2) {
        this.wx_check = false
        this.zfb_check = true
      }
    },
    async getSmsDetail () {
      try {
        const {response, result} = await this.getSmsDetailApi({
          id: this.$route.query.id,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            result.data.price = (result.data.price / 100).toFixed(2)
            this.info = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取套餐详情失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取套餐详情失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取套餐详情失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    async payment () {
      try {
        const {response, result} = await this.paymentApi({
          id: this.$route.query.id,
          channel: this.wx_check ? 1 : this.zfb_check ? 2 : '',
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.order_info = result.data
            this.$router.push({
              name: 'messageCode',
              query: {
                qr_code: this.order_info.qr_code,
                order_no: this.order_info.order_no,
                price: this.info.price,
                channel: this.wx_check ? 1 : this.zfb_check ? 2 : '',
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '支付失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '支付失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '支付失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    async confirm () {
      await this.payment()
    },
    back () {
      this.$router.back()
    },
  },
  mounted () {
    this.getSmsDetail()
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.section-layout
  padding-top 20px
.content-wrapper
  background #fff
  padding-top 0
.label
  color #353535
  font-size 14px
.labelname
  color #353535
  font-size 14px
  line-height 29px
.yellow
  color #FFBB29
  font-size 16px
  font-weight bold
.header-wrapper
  height 56px
  align-items center
  padding-left 32px
  border-bottom 1px solid line

.header-title
  font-size 18px
  line-height 24px
  color darker
  position relative

.level-left
  align-items center
  flex 1
.clearflex
  display block !important
.form-wrapper
  padding 0
  padding-left 64px
  padding-top 24px
  padding-right 64px
  padding-bottom 20px
  width 100%
  border-bottom 1px solid line
.b-t-0
  border-bottom 0
.row-flex
  flex-direction row
  height auto
.pay-way
  width 250px
  height 100px
  border 1px solid #DDDDDD
  position relative
  margin-top 24px
  margin-right 20px
  padding 20px
  border-radius 3px
  &.active
    border 1px solid #FFBB29
  .wx-pay
    display flex
    justify-content flex-start
    align-items center
    .logo
      width 60px
      height 60px
    .text
      color #121212
      font-weight bold
      font-size 16px
      margin-left 20px
  .checked
    position absolute
    right 0
    bottom 0
    width 46px
    height 20px
.bottom-button
  margin-top 30px
  .button
    margin-right 20px
</style>
