<template lang="pug">
  .section-layout
    empty-page(v-if="!(list && list.length)", tip="当前没有爆炸贴")
    .nav-back-btn(@click="goBack")
    .poster-wrapper(v-if="list.length && list.length > 0")
      .bomb-wrapper.clearfix()
        .bomb-item(v-for="(item, index) in list")
          .bomb-box
            .text(v-if="item.qr_code") 扫描识别二维码
            img.bomb-img(:src="item.thumbnail_image_url")
            img.qr-code(:src="item.qr_code", v-if="item.qr_code")
          a.button.primary.down-btn(@click="downPoster(item, index)") 下载爆炸贴
      .footer-tip 注：小程序二维码扫描后将跳到智慧门店小程序对应“秒杀商品”页面。
</template>

<script>
  import EmptyPage from '@/components/generics/EmptyPage'
  import Api from '@/mixins/modules/AppCenter'
  import spikeApi from '@/mixins/modules/Spike'
  import { root } from '@/plugins/Fetch'
  export default {
    name: 'PosterList',
    mixins: [Api, spikeApi],
    components: {
      EmptyPage,
    },
    data () {
      return {
        list: [],
        product_info: null,
      }
    },
    methods: {
      goBack () {
        this.$router.push({
          name: 'spikePosterList',
        })
      },
      // 获取爆炸贴列表
      async getBombList () {
        try {
          const {response, result} = await this.getBombListApi({
            obj_id: this.$route.query.spike_id,
            type: 1,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.list = result.data
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取爆炸贴列表获取失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取爆炸贴列表',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '获取爆炸贴列表')
        }
      },
      // 下载爆炸贴
      async downPoster (item, index) {
        if (item.download.length > 0) {
          window.open(root + item.download)
        } else {
          let params = {
            obj_id: this.$route.query.spike_id,
            bomb_id: item.id,
            type: 1,
            post_type: 6,
          }
          // 商品
          if (this.product_info.type === 1) {
            params.sku_id = this.product_info.sku_id
            params.spu_id = this.product_info.spu_id
            params.serve_type = 1
            params.path = 'pages/spilkeGroup/timeLimitGoodsDetail/timeLimitGoodsDetail'
          }
          // 服务
          if (this.product_info.type === 2) {
            params.spu_id = this.product_info.spu_id
            params.serve_type = 2
            params.path = 'pages/spilkeGroup/timeLimitServiceDetail/timeLimitServiceDetail'
          }
          // 养护卡
          if (this.product_info.type > 2) {
            params.card_id = this.product_info.card_id
            params.serve_type = 3
            params.path = 'pages/spilkeGroup/timeLimitPurchaseDetail/timeLimitPurchaseDetail'
          }
          try {
            const {response, result} = await this.downBombApi(params)
            if (response.status === 200) {
              if (result.code === 0) {
                this.list[index].download = result.data.download
                this.list[index].qr_code = result.data.qr_code
                window.open(root + result.data.download)
              } else {
                this.$store.dispatch('showMessage', {
                  type: 'failure',
                  title: '下载海报失败',
                  content: `出错啦！${result.message}`,
                })
              }
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '下载海报失败',
                content: result.message,
              })
            }
          } catch (err) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '下载海报失败',
            })
          }
        }
      },
      // 获取秒杀详情
      async getSpikeDetail () {
        try {
          const {response, result} = await this.spikeDetailApi({
            id: this.$route.query.spike_id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              let data = result.data.product
              this.product_info = {
                seckill_id: data.id,
                spu_id: data.basic_spu_id,
                card_id: data.basic_spu_id,
                type: data.type,
                sku_id: data.sku[0].basic_sku_id,
              }
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '秒杀详情获取失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '秒杀详情获取失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '秒杀详情')
        }
      },
    },
    mounted () {
      this.getSpikeDetail()
      this.getBombList()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  .section-layout
    height 92%
    .poster-wrapper
      background white
      height 100%
      overflow auto
      margin 25px 40px
      border-radius 5px
      padding-bottom 60px
      .footer-tip
        width 100%
        text-align center
        color red
        font-size 12px
      .bomb-wrapper
        padding 20px
        .bomb-item
          float left
          margin-bottom 25px
          text-align center
          width 300px
          height 240px
          position relative
          .down-btn
            position absolute
            top 190px
            left 75px
          .bomb-box
            -webkit-transform scale(0.36,0.36)
            position absolute
            width 690px
            height 463px
            top -150px
            left -215px
            .qr-code
              width 93px
              height 93px
              position absolute
              top 173px
              left 446px
            .text
              width 94px
              height 20px
              font-size 13px
              color rgba(75,76,79,1)
              line-height 18px
              position absolute
              top 269px
              left 446px
              z-index 16
            .bomb-img
              width 690px
              height 463px
              position absolute
              top 0
              left 0
  .nav-back-btn
    position absolute
    top -39px
    left 16px
    width 32px
    height 32px
    border-radius 100%
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
    cursor pointer
    z-index 21
</style>
