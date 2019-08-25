<template lang="pug">
  .wrapper
    .title {{title}}
    .btns
      a.button.primary.mini(href="https://shimo.im/docs/pkH00fochfowDgsu/reads", target="_bank") 操作流程
      a.button.primary.mini(style="margin-right: 50px", @click="goVideo") 操作视频
      a.button.primary.mini.el-icon-arrow-left(v-if="isShowBack", @click="jump(1)") 返回基础开通流程
      a.button.primary.mini(v-if="wxStatus === 2", @click="jump(2)") 企业微信
      a.button.primary.mini(v-if="currentUser.nearby_status !== 3 && currentUser.step > 3", @click="jump(3)") 附近小程序
</template>

<script type="text/ecmascript-6">
import Api from '@/mixins/modules/OpenStore'
import { mapGetters } from 'vuex'
export default {
  name: 'openStoreTitle',
  props: {
    title: {
      type: String,
      default: '',
    },
    isShowBack: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [Api],
  components: {},
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      wxStatus: 'wxStatus',
    }),
  },
  methods: {
    // 去操作视频
    goVideo () {
      let { href } = this.$router.resolve({
        name: 'operationVideo',
      })
      window.open(href, '_blank')
    },
    /**
     * 跳转
     * @type 1: 返回注册流程, 2: 企业微信, 3:附近小程序
     */
    jump (type) {
      let flag = this.currentUser.mini_status === 1 // 未提交
      if (type === 1) {
        switch (this.currentUser.step) {
          case 1:
            this.$router.push({
              name: 'storeAptitude',
            })
            break
          case 2:
            if (flag) {
              this.$router.push({
                name: 'miniProgramFirst',
              })
            } else {
              this.$router.push({
                name: 'miniProgramFirstWait',
              })
            }
            break
          case 3:
            if (flag) {
              this.$router.push({
                name: 'miniProgramSecond',
              })
            } else {
              this.$router.push({
                name: 'miniProgramSecondWait',
              })
            }
            break
          case 4:
            this.$router.push({
              name: 'payMsgFirstWait',
            })
            break
          case 5:
            if (flag) {
              this.$router.push({
                name: 'payMsgSecond',
              })
            } else {
              this.$router.push({
                name: 'payMsgSecondWait',
              })
            }
            break
          case 6:
            if (this.currentUser.mini_status === 1) {
              this.$router.push({
                name: 'payMsgThird',
              })
            } else {
              this.$router.push({
                name: 'payMsgThirdWait',
              })
            }
            break
          case 7:
            this.$router.push({
              name: 'completePage',
            })
            break
          default:
            break
        }
      } else if (type === 2) {
        this.$router.push({
          name: 'enterpriseWeChatRegister',
        })
      } else {
        this.$router.push({
          name: 'nearbyMiniProgramCategoryRedirect',
        })
      }
    },
  },
  mounted () {},
}
</script>

<style scoped lang="stylus">
.wrapper
  padding 15px 24px
  display flex
  justify-content space-between
  align-items center
  flex-shrink 0
  height 55px
  .title
    font-size 20px
    color #353535
  .btns
    a.button
      margin-right 8px
      &:last-child
        margin-right 0
    .mini
      height 30px
      line-height 30px
      font-size 14px
.remind
  border 1px solid #f00
  color #f00
</style>
