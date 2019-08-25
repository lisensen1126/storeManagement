<template lang="pug">
  .wrapper(v-if="isVisible && message_list[0] && message_list[0].is_top === 1 && message_list[0].type === 'system_notice'")
    .message(@click="goDetail") {{message_list[0].title}}
    .close(@click.stop="close") 	&times;
</template>

<script>
  import { mapGetters } from 'vuex'
  import Api from '@/mixins/modules/messageNotice'
  export default {
    name: 'MessageTip',
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
      // 去详情  判断是否跳转外链，是：跳转并且更新该消息状态   否：跳详情
      goDetail () {
        // this.close()
        if (this.message_list[0].info.content_type - 0 === 2) {
          if (this.message_list[0].is_read === 1) this.setMessageState(this.message_list[0].id)
          window.open(this.message_list[0].info.content)
        } else {
          this.$router.push({
            name: 'messageDetail',
            query: {
              id: this.message_list[0].id,
            },
          })
        }
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
  width 100%
  height 30px
  position relative
  .message
    display block
    width 100%
    height 30px
    background-color #EA6049
    color #ffffff
    text-align center
    line-height 30px
    cursor pointer
    a
      width 100%
      height 30px
      background-color #EA6049
      color #ffffff
      text-align center
      line-height 30px
      cursor pointer
  .close
    width 30px
    height 30px
    line-height 30px
    text-align center
    position absolute
    right 60px
    top 0
    color #000000
    cursor pointer
    z-index 10
</style>
