<!--活动报名步骤一-->
<template lang="pug">
  .model
    h2 确认收到物料
      a.more(@click="goDetail()") 更多活动详情
    .form-wrapper
      .success
        img(src="~@/assets/pay-success.svg")
        .tip 报名信息提交成功
        .text {{info.contacts}}您好，报名信息已收到，我们将在2个工作日内处理收款码、海报等物料制作，并安排物流寄送，请注意查收物流信息。如有疑问，可在自己店的智慧门店微信客服群咨询客服
      .box
        .line 门店名称：{{info.store_name}}
        .line 联系人姓名：{{info.contacts}}
        .line 联系人手机：{{info.mobile}}
        .line 所在区域：{{info.province_name + info.city_name + info.area_name}}
        .line 详细地址：{{info.address}}
    .btn-wrapper
      .info 收到物料后，请点击[我确认已收到物料]，进入下一步。
      .button-group
        a.button.primary(@click="saveStep()") 我确认已收到物料
</template>

<script>
import Api from '@/mixins/modules/AppCenter'
export default {
  name: 'stepTwo',
  mixins: [Api],
  data () {
    return {
      info: {},
    }
  },

  methods: {
    // 获取报名信息
    async fetchDetail () {
      try {
        const {result, response} = await this.getActiveInfoApi()
        if (response.status === 200 && result.code === 0) {
          this.info = result.data
          this.info.step = 2
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取报名信息失败',
            content: `服务异常，请稍后再试（${result.message}）`,
          })
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 去活动介绍页
    goDetail () {
      this.$router.push({
        name: 'ActiveSignUpDetail',
      })
    },

    // 保存
    async saveStep () {
      try {
        const {result, response} = await this.setActiveInfoApi(this.info)
        if (response.status === 200 && result.code === 0) {
          this.$emit('stepTwo', 2)
        } else if (response.status === 200 && result.code === 41232) {
          this.$store.dispatch('showMessage', {
            title: '提示',
            content: result.message,
            isRejectable: 1,
            resolve: () => {
              this.$emit('stepViewTwo', 1)
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: `服务异常，请稍后再试（${result.message}）`,
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
  },
  mounted () {
    this.fetchDetail()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.model
  width 100%
  height 100%
  .more
    color #409EFF
    font-size 14px
    margin-left 10px
  .more:hover
    text-decoration underline
  .success
    width 400px
    height auto
    color #666666
    font-size 14px
    text-align center
    img
      width 100px
      margin 0 auto
    .text
      text-align center
      padding-top 12px
      line-height 1.6
    .tip
      font-size 16px
      font-weight 600
      color #333
  .box
    width 400px
    height 160px
    border 1px solid #eee
    border-radius 4px
    padding 20px
    margin-top 20px
    margin-bottom 40px
    .line
      line-height 24px
      color #666666
      font-size 14px
  .count-info
    position absolute
    font-size 13px
    line-height 16px
    right 12px
    bottom 9px
    color placeholder
  .info
    font-size 13px
    color #999999
    margin-bottom 10px
    margin-left -86px
  .btn-wrapper
    padding: 23px 185px 10px
    .button
      width 136px
</style>
