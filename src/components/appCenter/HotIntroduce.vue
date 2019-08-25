<template lang="pug">
  .section-layout
    .content-wrapper
      .top-wrapper
        img(src="../../assets/offlineBuyIntro/tag.png")
      .padding-wrapper
        .top-int
          span.rot 
          span 传统门店经营时代的爆品是很少的，但在小程序互联网时代，必须拼爆品，爆品需具备三个关键因素：
        .content-box
          .item-box
            img.no(src="../../assets/1-icon.png")
            .title 一个极致的单品
            .segmenter
            .content 一个极致的单品。极致的单品能在互联网时代形成规模效应，打爆市场，而这在传统门店经营几乎是不可能的。
          .item-box
            img.no(src="../../assets/2-icon.png")
            .title 杀手级单品
            .segmenter
            .content 杀手级单品。传统门店经营强调的是价格，而互联网时代则强调杀手级单品，单品突破。
          .item-box
            img.no(src="../../assets/3-icon.png")
            .title 爆炸级口碑效应
            .segmenter
            .content 爆炸级口碑效应。小程序互联网时代产品需依靠用户社交口碑效应，这容易引发链式反应，短时间引爆市场。从门店到陌生人的1对N推销，变成了熟人对熟人的N对N推荐，引爆指数会以几何级数倍增。取胜的关键是能否产生口碑效应。
    .bottom-wrapper.flex-between
      .back-btn(@click="goBack")  
      .right-op
        span.tip(v-if="is_disabled")  *小程序未审核通过，待小程序审核通过后可开始使用
        button.button.primary(:class="{'disabled':is_disabled}", @click="startUse") 开始使用
</template>
<script>
import Api from '@/mixins/modules/user'
export default {
  mixins: [Api],
  data () {
    return {
      is_disabled: true,
      is_open: true,
      time_free: true,
      can_user: false,
      is_first: this.$route.query.is_first - 0,
    }
  },
  methods: {
    async startUse () {
      if (this.is_disabled) return
      if (this.is_first === 1) {
        this.$router.push({
          name: 'spikePosterList',
        })
      }
      try {
        const {response, result} = await this.setHasReadApi({
          type: 2,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$router.push({
              name: 'spikePosterList',
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '存储已读介绍',
              content: `出错啦！${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '存储已读介绍',
            content: result.message,
          })
        }
      } catch (err) {
        console.error(err, '存储已读介绍')
      }
    },
    goBack () {
      this.$router.go(-1)
    },
  },
  mounted () {
    if (this.$route.query.install - 0 === 1) {
      this.is_disabled = false
    }
  },
}
</script>


<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.rot 
  display inline-block
  width 4px
  height 4px
  background black
  border-radius 4px
  margin-right 10px
.flex-between
  display flex
  justify-content space-between
  align-items center
.section-layout
  position relative
.bottom-wrapper
  position absolute
  right 0
  bottom 0
  left 0
  height 56px
  background #fff
  padding 0 44px
  .tip
    font-size 10px
    color #D53136
    margin-right 10px
  button
    width 128px
    height 32px
    font-size 12px
  .disabled
    background rgb(217,217,217)
    box-shadow 0px 1px 5px 0px rgba(0,0,0,0.05)
    color #fff
    &:hover
      color #fff
  .back-btn
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, 0.08)
    cursor pointer
    width 32px
    height 32px
    border-radius: 100%
.content-wrapper
  background #FCFCFC
  margin 16px 25px 57px 25px
.padding-wrapper
  padding 71px 48px 46px
  box-sizing border-box
  overflow-y scroll
  overflow-x hidden
  margin-right -17px
  .content-box
    display flex
    justify-content start
    margin-top 20px
    .item-box
      background #FFFFFF
      width 278px
      height 447px
      box-shadow:0px 1px 27px 0px rgba(0,0,0,0.05);
      margin-right 23px
      box-sizing border-box
      padding 82px 24px 0
      .content
        font-size 12px
        font-weight 400
        color rgba(127,127,127,1)
        line-height 24px
      .no
        width 69px
        height 81px
      .title
        font-size 16px
        font-weight 500
        color rgba(64,64,64,1)
        line-height 22px
        margin-top 42px
      .segmenter
        width 230px
        height 5px
        margin 15px 0 25px
        background linear-gradient(270deg,rgba(255,255,255,1) 0%,rgba(255,187,42,1) 100%)
  .top-int
    color #7F7F7F
    font-size 12px
    line-height 17px
.align-center
  text-align center
.intro-text
  font-size 12px
  margin-top 10px
  color #404040
.top-wrapper
  position relative
  img
    width 130px
    height 40px
    position absolute
    left -5px
</style>