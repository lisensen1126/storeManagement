<template lang="pug">
  .transfer-page
    .transfer-tip
      .loading-icon
      .transfer-title 页面跳转中...
</template>

<script>
import {root} from '@/plugins/Fetch'
export default {
  name: 'AuthorizationList',
  data () {
    return {
      root,
    }
  },
  methods: {
    goDetail () {
      window.location.replace(root + '/wx_auth/success_jump?back=' + this.back + '&enterprise_hash=' + this.enterpriseHash + '&auth_for=' + this.authFor + '&shop_hash=' + this.shopHash + '&channel_id=' + this.channelId + '&name=' + this.name + '&auth_code=' + this.authCode + '&open_platform_type=' + this.openPlatformType + '&expires_in=' + this.expiresIn)
    },
  },
  mounted () {
    if (this.$route.query.back) {
      this.back = this.$route.query.back.replace(/#/, '%23')
    }
    this.enterpriseHash = this.$route.query.enterprise_hash
    this.authFor = this.$route.query.auth_for
    this.shopHash = this.$route.query.shop_hash
    this.channelId = this.$route.query.channel_id
    this.name = this.$route.query.name
    this.authCode = this.$route.query.auth_code
    this.expiresIn = this.$route.query.expires_in
    this.openPlatformType = this.$route.query.open_platform_type
    this.goDetail()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.transfer-page
  width 100%
  height 100%
  position relative
  .transfer-tip
    position absolute
    top 50%
    left 50%
    margin-left -100px
    margin-top -20px
    line-height 1
    font-size 20px
    .transfer-title
      display inline-block
      vertical-align middle
    .loading-icon
      display inline-block
      vertical-align middle
      width: 20px
      height: 20px
      margin-right: 5px
      background: url('~@/assets/bars-rotate.svg') no-repeat center center
      background-size: cover
      animation: rotate 0.8s steps(24) infinite
      @keyframes rotate
        0%
          transform: rotate(0deg)
        to
          transform: rotate(1turn)
</style>

