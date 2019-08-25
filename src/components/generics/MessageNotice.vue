<template lang="pug">
  .wrapper(v-if="isVisible && message_list[0] && message_list[0].is_top === 2")
    .image
      .close(@click="close") &times;
      img(:src="message_list[0].info.image")
    .title {{message_list[0].title}}
    .content {{message_list[0].info.summary}}
    .button(@click="goDetail()" v-if="message_list[0].info.content_type == 1") 查看详情
    .button(@click="openNew(message_list[0].info.content, message_list[0])" v-if="message_list[0].info.content_type == 2") 查看详情
</template>

<script>
  import Api from '@/mixins/modules/messageNotice'
  import { mapGetters } from 'vuex'
  export default {
    name: 'MessageNotice',
    mixins: [Api],
    props: {
      message: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        isVisible: 1,
      }
    },
    computed: {
      ...mapGetters({
        message_list: 'olist',
      }),
    },
    methods: {
      // 关闭消息提醒强弹框，在浏览器当前窗口不再显示
      close () {
        this.isVisible = 0
        sessionStorage.setItem('closeKey', this.isVisible)
      },
      // 去消息详情，同时关闭强弹窗提醒
      goDetail (id) {
        // this.close()
        this.$router.push({
          name: 'messageDetail',
          query: {
            id: this.message_list[0].id,
          },
        })
      },
      // 外链跳转
      openNew (e, params) {
        // this.close()
        if (params.is_read === 1) this.setMessageState(params.id)
        window.open(e)
      },
      // 变更外链阅读状态
      async setMessageState (id) {
        try {
          const { response, result } = await this.changeMessageState({
            id: id,
          })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('synchronizeOlist')    // 调用消息公告列表
            this.$store.dispatch('synchronizeMsgCount')  // 获取未读消息总数
          } else {
            console.log(result)
          }
        } catch (err) {
          console.log(err)
        }
      },
    },
    mounted () {
      if (sessionStorage.getItem('closeKey')) {
        this.isVisible = sessionStorage.getItem('closeKey') - 0
      }
    },
  }
</script>

<style lang="stylus" scoped>
.wrapper
  border-radius 3px
  overflow hidden
  width 400px
  height 443px
  position fixed
  top 20%
  right 0
  bottom 0
  left 0
  margin 0 auto
  box-shadow 0 0 20px rgba(0,0,0,0.4)
  background-color #ffffff
  color #000000
  line-height 30px
  z-index 9999
  .image
    position relative
    width 400px
    height 222px
    .close
      width 16px
      height 16px
      line-height 1
      text-align center
      font-size 14px
      color #8A92A2
      border-radius 100%
      border 1px solid #8A92A2
      position absolute
      top 6px
      right 6px
      cursor pointer
    img
      width 400px
      height 222px
  .title
    padding 20px 20px 15px 20px
    color #3D424C
    font-size 16px
    font-weight 600
    white-space nowrap
    overflow hidden
    text-overflow ellipsis 
  .content
    padding 0 20px
    font-size 14px
    height 35px
    line-height 17px
    // white-space nowrap 
    overflow hidden
    text-overflow ellipsis
  .button
    height 44px
    line-height 44px
    width 160px
    text-align center
    background #4B77B0
    border-radius 3px
    color #ffffff
    margin-left 120px
    margin-top 40px
</style>
