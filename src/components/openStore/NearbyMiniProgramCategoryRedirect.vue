<!-- 附近小程序: 服务类目重定向用 -->
<template lang="pug">
  .section-layout
</template>

<script>
import Api from '@/mixins/modules/OpenStore'

export default {
  name: 'nearbyMiniProgramCategoryRedirect',
  mixins: [Api],
  components: {},
  validations: {},
  data () {
    return {}
  },
  methods: {
    // 获取小程序服务类目审核状态
    async miniGetNearbyStatus () {
      try {
        let { response, result } = await this.getMerchantCategoryApi()
        if (response.status === 200 && result.code === 0) {
          // audit_status 审核状态: 1 审核中 2 审核失败 3 审核通过
          if (result.data.audit_status === undefined) { // 表示未提交过附近小程序服务类目资料
            this.$router.replace({
              name: 'nearbyMiniProgramCategory',
            })
          } else if (result.data.audit_status === 3) {
            this.$router.replace({
              name: 'nearbyMiniProgramSotreList',
            })
          } else {
            this.$router.replace({
              name: 'nearbyMiniProgramCategoryWait',
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取附近小程序审核状态失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取附近小程序审核状态失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
  },
  mounted () {
    this.miniGetNearbyStatus()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.section-layout
  height calc(100% - 56px)
  overflow-y auto
.content-wrapper
  height calc(100% - 56px)
  overflow-y auto
.m-l-10
  margin-left 10px
.upload-pic
  width 88px
  height 88px
.image-wrapper
  .tooltip-text
    margin-top 15px
    font-size 12px
    line-height 14px
</style>
