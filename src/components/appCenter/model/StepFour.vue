<!--活动报名步骤一-->
<template lang="pug">
  .model
    h2 优惠券配置
      a.more(@click="goDetail()") 更多活动详情
    .form-wrapper
      .box-card
        .div-info 根据行业历史活动的数据反馈，支付后推送给消费者下次使用的优惠券，能提高消费者回店和复购率25.5%
        .div-info “支付有礼”，“评价有礼”等营销活动门店可自主选择是否加入以及优惠力度，优惠券由门店自主承担；
      .tip 不知道怎么设置优惠券？
        a.more(@click="see") 点击查看
      .tabel-tip 优惠券设置建议：
      el-table(:data="table_data", border, style="width: 721px")
        el-table-column(prop="name1", label="营销类型", width="180")
        el-table-column(prop="name2", label="优惠券名称", width="180")
        el-table-column(prop="name3", label="建议类型", width="180")
        el-table-column(prop="name4", label="适用范围", width="180")
    .btn-wrapper
      .button-group
        a.button.primary(@click="saveStep()") 我确认已配置
</template>

<script>
import Api from '@/mixins/modules/AppCenter'
import Images from '@/assets/coupon-tip.png'
export default {
  name: 'stepFour',
  mixins: [Api],
  data () {
    return {
      product_pics: [], // 主图
      table_data: [
        {
          name1: '支付有礼',
          name2: '壳牌保养优惠券',
          name3: '满599减50,满699减60',
          name4: '壳牌商品和服务',
        },
        {
          name1: '支付有礼',
          name2: '壳保养卡优惠券',
          name3: '满99减20',
          name4: '壳保养卡',
        },
        {
          name1: '支付有礼',
          name2: '洗车/美容/贴膜等优惠券',
          name3: '门店自主制定',
          name4: '门店自主制定',
        },
        {
          name1: '评价有礼',
          name2: '评价有礼通用优惠券',
          name3: '5元通用代金券',
          name4: '小程序通用',
        },
      ],
    }
  },

  methods: {
    goDetail () {
      this.$router.push({
        name: 'ActiveSignUpDetail',
      })
    },
    // 预览提示
    see () {
      this.$alert(`
      <div style="max-height: 400px; overflow-y: auto">
        <img src=${Images} width="100%"/>
      </div>`, '优惠券配置步骤', {
        dangerouslyUseHTMLString: true,
      })
      let dom = document.getElementsByClassName('el-message-box')[0]
      dom.style.width = 650 + 'px'
    },

    // 保存
    async saveStep () {
      try {
        const {result, response} = await this.setActiveInfoApi({
          step: 4,
        })
        if (response.status === 200 && result.code === 0) {
          this.$emit('stepFour', 4)
        } else if (response.status === 200 && result.code === 41232) {
          this.$store.dispatch('showMessage', {
            title: '提示',
            content: result.message,
            isRejectable: 1,
            resolve: () => {
              this.$emit('stepViewFour', 1)
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
  .form-wrapper
    padding-bottom 40px
    .tip
      font-size 14px
      padding-top 20px
    .box-card
      width 720px
      height auto
      padding 16px 20px
      line-height 1.6
      font-size 14px
      color #333
      border 1px solid #eeeeee
      border-radius 4px
    .tabel-tip
      font-size 16px
      font-weight 600
      color #333
      padding 30px 0
  .btn-wrapper
    padding: 23px 185px 10px
</style>
