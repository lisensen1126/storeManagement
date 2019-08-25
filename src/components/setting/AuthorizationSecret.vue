<template lang="pug">
  .authorization-wrapper
    .content-container
      .page-title 完成企业微信授权，开通更多服务
      .authorization-list
        custom-input(placeholder="请输入 secret", v-model="secret", error-info="客户姓名必填")
    .content-footer
      button.button.large.primary.confirm-button(@click="setSecret") 确认并继续
      
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import userMixin from '@/mixins/modules/user'

export default {
  name: 'AuthorizationSecret',
  mixins: [userMixin],
  components: {
    CustomInput,
  },
  data () {
    return {
      secret: '',
    }
  },
  methods: {
    async setSecret () {
      if (!this.secret) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: 'secret 不能为空',
        })
        return false
      }
      try {
        const {response, result} = await this.fetchEcSecret({
          ecSecret: this.secret,
        })
        if (response.status === 200) {
          if (result.data && result.data.message === 'success') {
            this.$router.push({
              name: 'authorizations',
            })
          }
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取授权信息失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'

.authorization-wrapper
  // firefox flex bug
  min-height 0
  flex 1 1 auto
  display flex
  flex-direction column
  margin 16px 40px
  border-radius 3px
  background-color #fff
  align-items center
.content-container
  position relative
  width 100%
  overflow-y auto
.page-title
  position relative
  margin-top 48px
  margin 48px auto 32px
  text-align center
  font-size 24px
  line-height 32px
  padding-bottom 26px
  &::after
    content ''
    position absolute
    bottom 0
    left 50%
    transform translateX(-50%)
    display block
    border-top 2px solid primary
    width 32px
.authorization-tip
  margin 24px auto
  text-align center
  font-size 13px
  line-height 20px
  color lightGrey
.authorization-section-info
  text-align center
  font-size 14px
  line-height 16px
  color lightGrey
.authorization-list
  margin 80px auto 20px
  width 500px
.content-footer
  width: 500px
  padding:30px 0
  text-align: center
</style>

