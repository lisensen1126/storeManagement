<template lang="pug">
  .app-container
    .app-type-list(v-if="appList && appList.length")

      .app-type-item(v-for="(list, index) in appList")
        .app-type-item-head
          span.title {{ list.name }}
          span.desc {{ list.desc }}
        .app-type-item-body
          .app-list
            .app-list-item(v-for="app in list.groupList" :class="{'app-list-item--active':(app.plIdentifier === 'car-manu-customer')||(app.plIdentifier !== 'car-manu-customer' && app.available===2)}" @click="toPage(index, app)")
              .app-list-item-wrap
                .app-bottom(v-if="!shop_install && app.tip") {{app.tip}}
                .app-time-free(v-if="app.time_free") 限时免费
                .app-has-introduce(v-if="app.has_introduce", @click.stop="goIntroduce(app)") 功能介绍
                .app-list-item-wrapwrap
                  .app-list-item-left
                    .app-img-wrap
                      .app-img(:class="['icon-app-'+app.icon]")
                  .app-list-item-right
                    .app-title(:title="app.name", v-text="app.name")
                    .app-desc(:title="app.desc", v-text="app.desc" class="line-ellipsis-2")

</template>

<script>
  import userMixin from '@/mixins/modules/user'
  import Api from '@/mixins/modules/AppCenter'
  import { mapGetters } from 'vuex'
  export default {
    name: 'AllApp',
    mixins: [userMixin, Api],
    data () {
      return {
        is_first: 1,
        can_use: false,
        shop_install: true,
        appList: [{
          name: '生意工具',
          desc: '扫码、核销、推送工具',
          groupList: [{
            icon: 'down-order',
            name: '线下买单',
            desc: '生成直接收款页面和收款码',
            time_free: true,
            has_introduce: true,
          }],
        }, {
          name: '营销工具',
          desc: '吸粉、老带新、提高转化率',
          groupList: [{
            icon: 'poster-01',
            name: '裂变海报',
            desc: '一站式在线生成多种线上裂变吸粉海报',
            time_free: true,
          }, {
            icon: 'poster-02',
            name: '宣传海报',
            desc: '极速开展活动，不再为海报问题苦恼。',
            time_free: true,
            tip: '注：小程序未审核通过，待小程序审核通过后可开始使用。',
          }, {
            icon: 'poster-02',
            name: '渠道二维码',
            desc: '生成带统计的不同场景值的渠道二维码。',
            time_free: true,
            tip: '注：小程序未审核通过，待小程序审核通过后可开始使用。',
          }, {
            icon: 'poster-02',
            name: '海报统计',
            desc: '对门店海报的各项指标进行精准统计。',
            time_free: true,
            tip: '注：小程序未审核通过，待小程序审核通过后可开始使用。',
          },
          ],
        }, {
          name: '集客工具',
          desc: '爆款服务，智能化流程快速复制助力门店线下生意',
          groupList: [{
            icon: 'hot-spike',
            name: '爆款推荐',
            desc: '集客，复购，商品服务促销，清理店内库存的营销利器！',
            time_free: true,
            has_introduce: true,
          }, {
            icon: 'hot-spike',
            name: '支付红包活动',
            desc: '万元红包，100%中奖（最高88元），门店双重奖励',
            time_free: false,
            has_introduce: false,
          }],
        }],
        has_read: 1,
        step: 0,
        active_begin: 1,      // 活动是否开始  1.开始，2.已结束
      }
    },
    computed: {
      ...mapGetters({
        currentStore: 'currentStore',
      }),
    },
    methods: {
      async getAuthorizations () {
        try {
          const {response, result} = await this.fetchAuthorizations({
            mp_back_url: `${location.href}/service`,
            // ai_maintenance_back_url: `${location.href}/maintenance`,
            // car_inspection_back_url: `${location.href}/inspection`,
            // washing_back_url: `${location.href}/washing`,
            shop_back_url: `${location.href}/shop`,
          })
          if (response.status === 200 && result.code === 0) {
            this.shop_install = result.data.shop.installed
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取授权信息失败',
              content: `${response.status} ${result.code} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取授权信息失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },

      // 去功能介绍页
      goIntroduce (app) {
        if (app.name === '爆款推荐') {
          this.$router.push({
            name: 'hotIntroduce',
            query: {
              install: this.shop_install ? 1 : 2,
              is_first: this.is_first,
            },
          })
        }
        if (app.name === '线下买单') {
          this.$router.push({
            name: 'offlineBuyIntro',
            params: {
              has_read: this.has_read,
            },
          })
        }
      },

      toPage (index, app) {
        if (index === 0) {
          if (this.has_read === 1) {
            this.$router.push({
              name: 'bill',
            })
          } else {
            this.$router.push({
              name: 'offlineBuyIntro',
              params: {
                has_read: this.has_read,
              },
            })
          }
        }
        if (index === 1) {
          if (app.name === '裂变海报') {
            this.$router.push({
              name: 'posterList',
            })
          }
          if (app.name === '宣传海报') {
            if (!this.shop_install) return
            this.$router.push({
              name: 'propagandaPoster',
            })
          }
          if (app.name === '渠道二维码') {
            if (!this.shop_install) return
            this.$router.push({
              name: 'channelQRcode',
            })
          }
          if (app.name === '海报统计') {
            if (!this.shop_install) return
            this.$router.push({
              name: 'posterStatistics',
            })
          }
        }
        if (index === 2 && app.name === '爆款推荐') {
          let first = this.is_first
          if (first === 1 && this.shop_install) {
            this.$router.push({
              name: 'spikePosterList',
              query: {
                name: '秒杀商品设置',
                type: 'spikePosterList',
                urlName: 'spikePosterList',
              },
            })
          } else {
            this.$router.push({
              name: 'hotIntroduce',
              query: {
                install: this.shop_install ? 1 : 2,
                is_first: this.is_first,
              },
            })
          }
        }
        // 随机立减报名跳转
        if (index === 2 && app.name === '支付红包活动') {
          if (this.overdue) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '温馨提示',
              content: '本次活动已结束，下回记得速速报名！',
            })
          } else if (this.initiation) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '温馨提示',
              content: '7月8日开始报名，敬请期待！',
            })
          } else if (this.step === 5) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '温馨提示',
              content: '请前往企业微信生意管理-业绩看板查看！',
            })
          } else {
            if (this.step === 0) this.$router.push({name: 'ActiveSignUp', query: {step: this.step, isStart: this.active_begin}})
            if (this.step !== 0) this.$router.push({name: 'ActiveSignUpStep', query: {step: this.step}})
          }
        }
      },

      async getReadState () {
        try {
          const {result, response} = await this.getReadStatusApi()
          if (response.status === 200 && result.code === 0) {
            this.has_read = result.data.successCode
            this.is_first = result.data.poster
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取是否已读信息失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },

      // 获取报名到哪一步了，步骤
      async fetchStep () {
        try {
          const {result, response} = await this.getActiveCurstepAPi()
          if (response.status === 200 && result.code === 0) {
            this.step = result.data.step
            this.active_begin = result.data.isStart
          } else if (response.status === 200 && result.code === 41231) {
            this.overdue = true
          } else if (response.status === 200 && result.code === 41230) {
            this.initiation = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取报名步骤失败',
              content: `服务异常，请稍后再试（${result.message}）`,
            })
          }
        } catch (err) {
          console.error(err)
        }
      },
    },
    mounted () {
      this.getAuthorizations()
      this.fetchStep()
      console.log(this.currentStore)
    },
    activated () {
      this.getReadState()
      this.fetchStep()
    },
  }
</script>

<style lang="stylus" scoped>
  .line-ellipsis-2 {
    display: -webkit-box;
    line-clamp: 2;
    box-orient: vertical;
    /* autoprefixer: off */
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    overflow: hidden;
  }
  .app-container
    position relative
    width 100%
    height 100%
    overflow auto
    .empty-page-wrapper
      height 100%
    .app-type-list
      margin: 0 10px 30px 30px;
      .app-type-item
        &:not(:first-child)
          margin-top 9px
        .app-type-item-head
          padding 21px 0 0 0
          .title
            display inline-block
            font-size 18px
            color #3D424C
            font-family PingFangSC-Semibold;
            font-weight:600;
            line-height 25px;
            vertical-align middle
          .desc
            display inline-block
            margin-left 29px
            font-size 14px;
            font-family PingFangSC-Regular;
            font-weight 400;
            line-height 20px;
            vertical-align middle
        .app-type-item-body
          .app-list
            .app-list-item
              position relative
              display inline-block
              width 25%
              max-width 300px
              min-width 280px
              margin-top 19px
              padding-right 20px
              vertical-align top
              &--active
                cursor pointer
              &:not(:nth-child(4n))
                border-right 1px solid #EEEEF0
              .app-list-item-wrap
                border-bottom 3px solid transparent
                border-radius 0 0 3px 3px
                cursor pointer
                position relative
                &:hover
                  border-bottom 3px solid #F7B52A
                  transition: all .1s ease-in .05s;
                .app-has-introduce
                  position absolute
                  bottom 5px
                  right 5px
                  font-size 12px
                  cursor pointer
                  color #2fabdd
                  z-index 9999
                .app-time-free
                  position absolute
                  top 5px
                  right 5px
                  font-size 12px
                  color red
                  padding 5px
                  border 1px solid red
                  border-radius 3px
                .app-bottom
                  position absolute
                  bottom -30px
                  left 0
                  color red
                  font-size 12px
                .app-list-item-wrapwrap
                  background: #fff
                  .app-status
                    position absolute
                    display inline-block
                    top: -11px
                    right: 14px
                    width 45px
                    height 19px
                    background #FF7979
                    border-radius 2px 0px 0px 2px
                    font-size 12px
                    font-family PingFangSC-Medium;
                    font-weight 500;
                    color #fff
                    line-height 19px;
                    text-align: center
                  .app-status-part
                    position: absolute;
                    top: 8px;
                    right: 14px;
                    display: inline-block;
                    border: 3px solid #d44242;
                    border-top-width: 4px;
                    border-bottom-width: 4px;
                    border-bottom-color: transparent;
                    border-right-color: transparent;
                  .app-list-item-left
                    position absolute
                    top 0
                    left 0
                    .app-img-wrap
                      .app-img
                        display inline-block
                        width 44px
                        height 44px
                        margin 20px 20px 0 20px
                        background transparent
                        background-size contain
                        background-repeat no-repeat
                        background-position center center
                        &.icon-app-poster-01 //裂变海报
                          background-image: url('~@/assets/poster-icon-01.png')
                        &.icon-app-poster-02 //运营支持
                          background-image: url('~@/assets/poster-icon-02.png')
                        &.icon-app-hot-spike //裂变海报
                          background-image: url('~@/assets/hot-spike.png')
                        &.icon-app-down-order //运营支持
                          background-image: url('~@/assets/down-order.png')
                  .app-list-item-right
                    position relative
                    height 106px
                    overflow hidden
                    padding 20px 21px 20px 84px
                    .app-title
                      display inline-block
                      vertical-align top
                      font-size 16px
                      font-family PingFangSC-Semibold
                      font-weight 600
                      color #3D424C
                      line-height 22px
                      overflow hidden
                      text-overflow ellipsis
                      white-space nowrap
                      max-width: 64%;
                    .app-tag
                      display inline-block
                      vertical-align top
                      height 16px
                      line-height 16px;
                      background #F7B52A
                      border-radius 2px
                      color #fff
                      font-size 11px;
                      font-family PingFangSC-Medium;
                      font-weight 500;
                      padding 0 5px
                      margin 3px 0 0 10px
                    .app-desc
                      overflow hidden
                      word-break break-all
                      text-overflow ellipsis
                      height 34px
                      margin-top 10px
                      font-size 12px
                      font-family PingFangSC-Regular
                      font-weight 400
                      color #8A92A2
                      line-height 17px


</style>
