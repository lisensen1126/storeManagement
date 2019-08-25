<template lang="pug">
  .section-layout
    //- empty-page(v-if="!list.length", :tip="'当前没有门店'")
    .content-wrapper(v-if="img_url")
      div.img-box
        img(:src="img_url")
        a.button.primary.large.isDisabled(:href="`${root}/mini_program/qr_code_download`",target="_blank",) 下载

</template>

<script type="text/ecmascript-6">
import EmptyPage from '@/components/generics/EmptyPage'
import Api from '@/mixins/modules/basicInformation'
import {root} from '@/plugins/Fetch'
export default {
  name: 'miniProgramCode',
  mixins: [Api],
  components: {
    EmptyPage,
  },
  data () {
    return {
      root,
      img_url: '', // 二维码地址
    }
  },
  methods: {
    // 获取小程序二维码
    async getQrCode () {
      try {
        let { response, result } = await this.getQrCodeApi()
        if (response.status === 200 && result.code === 0) {
          this.img_url = result.data.image
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取小程序二维码失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取小程序二维码失败',
          content: `错误: ${err}`,
        })
      }
    },
  },
  mounted () {
    this.getQrCode()
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/modules/creation-modal'
.section-layout
  height calc(100% - 56px)
  overflow-y auto
.content-wrapper
  height calc(100% - 56px)
  overflow-y auto
  background #fff
.img-box
  display flex
  flex-direction column
  align-items center
  img
    margin-top 75px
    width 200px
    height 200px
  .button
    margin-top 35px
</style>
