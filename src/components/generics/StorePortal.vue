<!--切换门店组件-->
<template lang="pug">
  .store-portal(:class="{'is-multiple': isSystemAdmin, 'is-inline': inlineStyle, 'text-selector': textSelector, 'is-workbench': isWorkbench}")
    .audio(v-html="audioHtml")
    .icon
      //- .audio-open(v-if="isAudio===1 && currentUser.from != 'BOSS'", @click="voiceCues")
      .audio-open(v-if="isAudio===1 && currentUser.from != 'BOSS'")
      .audio-close(v-if="isAudio===2 && currentUser.from != 'BOSS'", title="您可以去'应用中心'开启收款语音提示")
      .notify(@click.stop="showMessage")
        .total {{count>99? '...' : count}}
    .current-store(v-if="current", :title="current.store_name", @click.stop="toggle")
      .store-name(v-text="current.store_name")
    .custom-select-list.store-list(v-if="isExpanded")
      .custom-select-item(v-for="candidate in list", :class="{'selected': current === candidate}", :title="candidate.name", v-text="candidate.store_name", @click="switchTo(candidate.store_id)")
    .box(v-if="messageBox", @mouseleave="showMessage()")
      .title 消息通知
      ul(v-if="message_list.length > 0")
        li(v-for="msg in message_list" @click="goDetail(msg)")
          span(v-if="msg.type == 'order_consume'") [消费]{{msg.title}}
          span(v-if="msg.type == 'order_appoint'") [预约]{{msg.title}}
          span(v-if="msg.type == 'order_verify'") [核销]{{msg.title}}
          span(v-if="msg.type == 'small_register'") [注册]{{msg.title}}
          span(v-if="msg.type == 'card_transact'") [办卡]{{msg.title}}
          span(v-if="msg.type == 'card_recharge'") [充值]{{msg.title}}
          span(v-if="msg.type == 'system_notice'") [系统]{{msg.title}}
          span(v-if="msg.type == 'card_consume'") [会员消费]{{msg.title}}
      .no-data(v-if="message_list.length == 0") 暂无最新消息
      .bottom(@click.stop="goList") 查看全部  
</template>

<script>
import { mapGetters } from 'vuex'
import userMixin from '@/mixins/modules/user'
import imageScale from '@/mixins/utilities/imageScale'
import MseeageApi from '../../mixins/modules/messageNotice'
import CenterApi from '../../mixins/modules/AppCenter'
import { root } from '@/plugins/Fetch'

export default {
  name: 'StorePortal',
  mixins: [userMixin, imageScale, MseeageApi, CenterApi],
  props: {
    inlineStyle: {
      type: Boolean,
      default: false,
    },
    isWorkbench: {
      type: Boolean,
      default: false,
    },
    reloading: {
      type: Boolean,
      default: true,
    },
    textSelector: {
      type: Boolean,
      default: false,
    },
  },

  data: _ => ({
    current: null,
    isExpanded: false,
    isSwitching: false,
    messageBox: false,
    audioHtml: '',
    itv: '',
    hasErrorInfo: false,
  }),

  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      currentStore: 'currentStore',
      list: 'stores',
      isSystemAdmin: 'isSystemAdmin',
      message_list: 'olist',
      count: 'massageCount',
      isAudio: 'judgeAudio',
    }),
  },

  watch: {
    // currentStore (store) {
    //   this.current = this.findStore(store)
    // },
    list () {
      this.current = this.findStore()
    },
  },

  created () {
    let _this = this
    let body = document.querySelector('body')
    body.addEventListener('click', (e) => {
      _this.messageBox = false
    }, false)
  },

  async mounted () {
    if (!this.list.length) {
      this.$store.dispatch('synchronizeStores')
      this.$store.dispatch('syncAuthorizeStatus')
    }
    this.current = this.findStore()
    this._onBodyClick = () => {
      this.isExpanded = false
    }
    this.$hub.$on(this.$hub.events.bodyClick, this._onBodyClick)
    this._collapsePortal = source => {
      if (this !== source) {
        this.isExpanded = false
      }
    }
    this.$hub.$on(this.$hub.events.collapseDataPickers, this._collapsePortal)
    // 如果用户是从boss后台跳转过来的，就不需要执行以下代码
    if (this.currentUser.from !== 'BOSS') {
      await this.judgeAudio()
      if (this.isAudio === 1) this.resetCom()
    }
  },
  methods: {
    findStore (currentUserId = this.currentUser.store_id) {
      return this.list.find(candidate => candidate.store_id === currentUserId)
    },

    async switchTo (store) {
      // console.log(store)
      if (this.current.store_id === store) {
        return false
      }
      if (!this.isSwitching) {
        const origin = this.current
        this.toggle(false)
        this.isSwitching = true
        this.current = store
        try {
          await this.switchStore(store)
          this.$router.replace({
            name: 'WorkBenchOverview',
          })
          setTimeout(() => {
            this.reloading && window.location.reload()
          }, 300)
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '切换门店失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
          this.current = origin
        }
        this.isSwitching = false
        this.$emit('switched')
      }
    },

    toggle (state) {
      if (this.isSystemAdmin) {
        this.isExpanded = typeof state === 'boolean' ? state : !this.isExpanded
        if (this.isExpanded) {
          this.$hub.$emit(this.$hub.events.collapseDataPickers, this)
        }
      }
    },

    // 显示消息提示
    showMessage () {
      this.messageBox = !this.messageBox
    },

    // 去往消息列表页面
    goList () {
      this.$router.push({
        name: 'messageList',
      })
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

    // 去详情
    goDetail (params) {
      if (params.info.content_type - 0 === 2) {
        if (params.is_read === 1) this.setMessageState(params.id)
        window.open(params.info.content)
      } else {
        this.$router.push({
          name: 'messageDetail',
          query: {
            id: params.id,
          },
        })
      }
    },

    // 获取语音播报
    resetCom () {
      let source = new EventSource(`${root}/get_audio?store_id=${this.currentStore.store_id}`)
      let _this = this
      source.onmessage = (e) => {
        let data = JSON.parse(e.data)
        let url = data.audio
        _this.audioHtml = `<video controls autoplay name="media" hidden><source src="${url}" type="audio/mp3"></video>`
      }
    },

    // 判断是否可以语音播报
    async judgeAudio () {
      try {
        const { response, result } = await this.getOfflineOrderNotificationApi()
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('updateAudio', result.data.is_open_audio)
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '开启语音播报失败',
            content: result.message,
          })
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 语音收款提示交互
    voiceCues () {
      this.$notify({
        title: '听不到收款语音，请尝试以下操作',
        dangerouslyUseHTMLString: true,
        message: `<p>1、检查电脑音箱是否开启，音量是否设置为静音。</p>
        <p>2、点击门店后台页面任意按钮。</p>
        <p style="padding-top: 10px; color: teal">以上操作确认后，下一笔收款即可听到语音播报。</p>`,
        type: 'success',
        duration: 0,
        offset: 62,
      })
    },
  },

  beforeDestroy () {
    this.$hub.$on(this.$hub.events.bodyClick, this._onBodyClick)
    this.$hub.$off(this.$hub.events.collapseDataPickers, this._collapsePortal)
    clearInterval(this.itv)
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.store-portal
  position relative
  .icon
    position absolute
    width 50px
    height 20px
    top 18px
    left -55px
    .notify
      cursor pointer
      width 20px
      height 20px
      display inline-block
      background url("../../assets/tip-active.svg") no-repeat center
      position relative
      .total
        position absolute
        top -6px
        right -6px
        background red
        color #ffffff
        font-size 8px
        border-radius 100%
        min-width 15px
        min-height 15px
        text-align center
        line-height 15px  
    .notify:hover
      background url("../../assets/tip-default.svg") no-repeat center
    .audio-open,.audio-close
      width 20px
      height 20px
      display inline-block
      margin-right 5px
    .audio-open
      background url("../../assets/audio-open.png") no-repeat center
      background-size cover
    .audio-close
      background url("../../assets/audio-close.png") no-repeat center
      background-size cover
  .box
    position absolute
    min-height 282px
    min-width 300px
    background-color #ffffff
    bottom -284px
    left -100px
    border 1px solid #cccccc
    z-index 100
    .title
      height 40px
      line-height 40px
      padding-left 10px
      font-size 16px
      color #000000
      border-bottom 1px solid #cccccc
    .bottom
      height 40px
      line-height 40px
      padding-left 10px
      font-size 16px
      color #2fabdd
      text-align center
      cursor pointer
    .bottom:hover
      color #0a71a1
    ul
      height 200px
    li
      height 40px
      width 300px
      line-height 40px
      color #373737
      font-size 14px
      padding-left 10px
      padding-right 10px
      border-bottom 1px solid #f5f5f5
      border-left 2px solid #ffffff
      cursor pointer
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
    li:hover
      border-left 2px solid #ffc723
    .no-data
      color #373737
      width 100%
      height 200px
      text-align center
      line-height 200px
      font-size 14px
      border-bottom 1px solid #f5f5f5
.current-store
  /*flex 0 0 160px*/
  /*height 48px*/
  display: flex
  flex-direction: row
  height: 100%

.store-portal
  &.is-workbench
    position relative
    /*flex 0 0 310px*/
    /*margin-left 24px*/
    .current-store
      /*flex 0 0 310px*/
      width 310px
      cursor pointer
      &::after
        content ''
        display block
        margin auto 8px
        flex 0 0 0
        border-style solid dashed
        border-width 4px 4px 0
        border-color lightGrey transparent
    .store-avatar
      flex 0 0 48px
      height 48px
      margin-right 16px
      border-radius 3px
    .store-list
      right 0
      width 300px
      .custom-select-item
        text-indent 4px
.store-portal
  &.is-inline
    flex 0 0 120px
    height 24px
    .current-store
      flex 0 0 120px
      height 24px
      width 120px
    .store-list
      width 300px
      left -12px
      .custom-select-item
        text-indent 0px

.store-portal
  position relative
  &.text-selector
    display inline-block
    .store-name
      font-size 18px
      line-height 24px
      flex 0 0 auto
  &.is-multiple
    .current-store
      cursor pointer
      &::after
        content ''
        display block
        margin auto 8px
        flex 0 0 0
        border-style solid dashed
        border-width 4px 4px 0
        border-color lightGrey transparent
  .current-store
    display flex
    align-items center
    width auto

.store-avatar
  flex 0 0 20px
  margin-right 12px
  height 20px
  background-color placeholder
  background-size cover
  border-radius 2px
  overflow hidden

.store-name
  flex 0 1 1
  font-size 14px
  margin-right 10px
  max-width 180px
  overflow hidden
  text-overflow ellipsis
  white-space nowrap

.store-list
  max-height 176px
  overflow auto
  .custom-select-item
    text-indent 5px
.custom-select-list
  right 0
  left initial
  width 300px
</style>

