<template lang="pug">
  .section-layout
    .content-wrapper
      h2.level.header-wrapper
        .level-center
          .icon.user-info-icon-wrapper
            .user-info-icon
          .header-title 购买短信通知，及时触达用户，与用户零距离
            .line
      .field-group.is-horizontal.flex-center
        .message-topup(v-for="(item,index) in list", :key="index")
          img(src="../../assets/hot-icon.png",class="top-card",v-if="item.tag === 1")
          img(src="../../assets/save-icon.png",class="top-card",v-if="item.tag === 2")
          .message-send-top.pd-20
            span.bold {{item.count}}条
            span  / {{parseInt(item.price)}}元
          .line
          .average.pd-20
            span (每条≈{{(item.average / 100).toFixed(2)}}元)
          a.buttons.mg-20(@click="buyDetail(item.id)") 立即购买
          .message-title.pd-20 专业短信服务
          .message-send-data
            .message-item.pd-20(v-for="(info, i) in item.product_desc")
              .square
              span(v-text="info")
</template>


<script>
import marketingMixin from '@/mixins/modules/marketing'

export default {
  name: 'MessagePay',
  mixins: [marketingMixin],
  components: {
  },
  data: _ => {
    const schema = {
      list: [200, 5100, 1000, 2000],
    }
    return schema
  },
  methods: {
    async getSmsList () {
      try {
        const {response, result} = await this.getSmsListApi()
        if (response.status === 200) {
          if (result.code === 0) {
            result.data.forEach(element => {
              element.price = (element.price / 100).toFixed(2)
              element.product_desc = element.product_desc.split(',')
            })
            this.list = result.data
            console.log(this.list)
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取套餐列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取套餐列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    buyDetail (id) {
      this.$router.push({
        name: 'messageConfirm',
        query: {
          id: id,
        },
      })
    },
  },
  mounted () {
    this.getSmsList()
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.section-layout
  padding-top 20px
  height calc(100% - 56px)
  overflow-y auto
.content-wrapper
  height calc(100% - 106px)
  overflow-y auto
  background #fff
.header-title
  font-size 20px
  .line
    margin 0 auto
    margin-top 26px
    width 32px
    height 2px
    background #FFC723
.level
  justify-content center
.flex-center
  justify-content space-around
  padding 0 60px
.pd-20
  padding 0 20px 0 20px
.mg-20
  margin 0 20px 0 20px
.top-card
  position absolute
  top: 0
  right 0
  width 50px
.message-topup
  margin-top 25px
  padding-top 20px
  padding-bottom 0 
  width 220px
  position relative
  min-height 400px
  border-radius 3px
  border:1px solid rgba(221,221,221,1)
  &:hover
    border 1px solid rgba(255,198,36,0.44)
    box-shadow 2px 2px 27px 0px rgba(0,0,0,0.05)
    .message-send-top
      .bold
        color #FFC624
    .message-send-data
      .message-item
        &:nth-of-type(odd)
          background #FFFAEE
  .message-send-top
    margin-top 10px
    font-size 12px
    color #7F7F7F
    .bold
      font-size 24px
      font-weight 600
      color #000
  .line
    margin 15px auto
    width 180px
    height 3px
    background linear-gradient(270deg,rgba(255,255,255,1) 0%,rgba(255,187,42,1) 100%)
  .average
    font-size 12px
  .buttons
    margin-top 25px
    display block
    width 180px
    height 36px
    line-height 34px
    font-size 12px
    text-align center
    color #000
    border 2px solid rgba(255,198,36,1)
    border-radius 3px
    &:hover
      background #FFC624
  .message-title
    margin 20px 0 10px 0
    font-size 14px
    font-weight 600
  .message-send-data
    .message-item
      display flex
      align-items center
      height 28px
      line-height 28px
      font-size 12px
      &:nth-of-type(odd)
        background #F9F9F9
      .square
        margin-right 30px
        width 6px
        height 6px
        background rgba(190,213,15,1)
        box-shadow 0px 4px 3px 0px rgba(190,213,15,0.44)
        border-radius 1px
</style>
