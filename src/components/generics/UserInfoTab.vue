<!--登录用户显示组件-->
<template lang="pug">
  .userInfo-wrapper.columns.is-horizontal
    .column
      .user-name(v-text="currentUser && currentUser.name")
    .column
      .logout-wrapper(@click="logOut")
</template>

<script>
import userMixin from '@/mixins/modules/user'
import { mapGetters } from 'vuex'

export default {
  name: 'UserInfoTab',
  mixins: [userMixin],
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
  },
  methods: {
    async logOut () {
      try {
        const {response, result} = await this.logout()
        if (response.status === 200) {
          this.$store.dispatch('clearUser')
          this.$store.dispatch('synchronizeClearMsg')   // 关闭消息组件
          sessionStorage.removeItem('closeKey')
          sessionStorage.removeItem('is_show_tip')
          sessionStorage.removeItem('is_show_open_store')
          this.$router.push({
            name: 'login',
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '登出失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch ({err}) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '登出失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    this.$store.dispatch('synchronizeOlist')    // 调用消息公告列表
    this.$store.dispatch('synchronizeMsgCount')  // 获取未读消息总数
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins'

.user-name
  font-size 15px
  line-height 16px
  padding 21px 2px 16px
  color darker
.logout-wrapper
  width 16px
  height 16px
  margin 21px 0 19px 32px
  cursor pointer
  background getImage('menu/logout.svg') no-repeat center center
  position relative
  &::before
    content ''
    display block
    position absolute
    height 16px
    background red
    border-left 1px solid #f4f4f4
    left -15px
    top 50%
    margin-top -8px
    z-index 200
  &:hover
    background-image getImage('menu/logout-hover.svg')
</style>
