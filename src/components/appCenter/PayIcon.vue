<template lang="pug">
  .section-layout
    .content-wrapper
      service-tab.top-nav(v-model="currt_type", :tabs="pay_type", :have-icon="false", :have-quantity="false", class="status-list", @input="changeTab($event)")
      .tab-box(v-if="currt_type.type == 1")
        .left
          //- .tips  线下收款月交易流水达到50笔或流水总额达到5000元，次月可降低交易手续费费率，详情请咨询智慧门店客服。
          .form-wrapper
            h2 收款语音
            .field-group
              .field.is-horizontal
                label.label 收款语音播报
                .switch
                  input(type="checkbox", id="open", v-model="is_show")
                  label(for="open")
              .field.is-horizontal
                label.label 试听 
                audio(controls="controls" class='audio')
                  source(:src="baseUrl" type="audio/mpeg")
            h2 素材下载
            .field-group
              .field.is-horizontal
                label.label 素材说明
                .box.red 下载后请打印物料，张贴到收银处，替换个人微信收款码。
              .field.is-horizontal
                label.label 物料尺寸                
                span.font-13 105mm*166mm              
              .field.is-horizontal
                a.button.large(:href="imgUrl", :download="can_download", :class="{'primary':can_download}") 下载素材                  
        .right
          #targetDom
            img.back-img(src="~@/assets/pay-offline.png")
            img.er-code(:src="qrImg", @load="downloadPicture")
            p.store-id NO.{{currentStore.store_id | numberFotmat}}
            p.store-name {{currentStore.store_name}}         
</template>

<script>
import ServiceTab from '@/components/generics/ServiceTab'
import CustomInput from '@/components/generics/form/CustomInput'
import { mapGetters } from 'vuex'
import html2canvas from 'html2canvas'
import Api from '@/mixins/modules/AppCenter'
import Tab from '@/components/appCenter/model/PublicTabs'
import { root } from '@/plugins/Fetch'
export default {
  name: 'payIcon',
  components: {
    CustomInput,
    ServiceTab,
  },
  mixins: [Api, Tab],
  data () {
    return {
      currt_type: {name: '收款码', type: 1},
      is_show: true,
      size: '',
      set_num: '',
      imgUrl: 'javascript:void(0)',     // 下载链接，默认阻止点击
      can_download: false,              // 下载物料是否已经准备好
      is_loading: true,                  // 是否正在请求接口，请求时不显示弹窗
      qrImg: '',                        // 收款码的地址
      baseUrl: '',                    // 接口基础路径
    }
  },
  mounted () {
    this.baseUrl = root.split('v1')[0] + 'sample.mp3'    // 静态提示语音根据环境加载
    this.is_click = 1
    this.currt_type = {name: '收款码', type: 1}
    this.getInfo()
    this.getImage()
  },
  computed: {
    ...mapGetters({
      currentStore: 'currentStore',
    }),
  },
  methods: {
    // 获取门店收款码
    async getImage () {
      try {
        let {result, response} = await this.getOffLineQrApi()
        if (result.code === 0 && response.status === 200) {
          if (result.data.image === '') {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '温馨提示',
              content: '门店小程序未注册完成，暂时无法生成收款码，请先注册完成小程序后再试。',
            })
          }
          this.qrImg = result.data.image
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取收款码失败！',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取收款码失败！',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    checkCouponType (e) {
      if (this.is_click === e.type) return
      this.is_click = e.type
      this.getInfo()
    },
    // 下载素材，当车店图标加载完成后执行此函数
    downloadPicture () {
      html2canvas(document.querySelector('#targetDom'), {
        useCORS: true,  // 允许跨域访问图片
        scale: 3,   // 绘制的像素密度，默认为1，建议设置为3，再大的话可能会出现图片绘制不完整的情况
      }).then(canvas => {
        canvas.className = 'canvas'
          // 将canvas转换为base64
        let dataURL = canvas.toDataURL('image/png')
          // 将imgUrl赋值，此时已经可以下载图片
        this.imgUrl = dataURL
          // 准备工作完成，可以随时下载
        this.can_download = '收款码'
      })
    },

    // 修改设置的方法
    async setInfo (data) {
      try {
        let {result, response} = await this.setOfflineOrderNotificationApi(data)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            type: 'success',
            autoClose: true,
            title: '设置成功！',
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '设置失败！',
            content: result.message,
            resolve: () => {
              this.getInfo()
            },
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '设置失败！',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          resolve: () => {
            this.getInfo()
          },
        })
      }
    },
    async getInfo () {
      this.is_loading = true
      try {
        let {result, response} = await this.getOfflineOrderNotificationApi({hide_loading: true})
        if (response.status === 200 && result.code === 0) {
          this.is_show = result.data.is_open_audio === 1
          this.set_num = result.data.coupon_num
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取设置失败！',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取设置失败！',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      } finally {
        // 防止页面刚载入时跳出弹窗
        setTimeout(() => {
          this.is_loading = false
        }, 200)
      }
    },
  },
  watch: {
    is_show (val) {
      if (this.is_loading) {
        return
      }
      val ? this.$store.dispatch('updateAudio', 1) : this.$store.dispatch('updateAudio', 2)
      this.setInfo({
        is_open_audio: val ? 1 : 2, hide_loading: true,
      })
    },
    set_num (val) {
      if (Number(val) > 10) {
        this.set_num = 10
      }
    },
  },
  filters: {
    numberFotmat (val) {
      switch (val.toString().length) {
        case 1:
          return '000' + val
        case 2:
          return '00' + val
        case 3:
          return '0' + val
        default: return val
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
h2
  padding-left 0
  border-bottom 1px solid #f1f1f1
.field-group
  border-bottom none
.section-layout >>>.status-list ul
  justify-content left
  padding-left 20px
  background-color #ffffff
.top-nav
  border-bottom 1px solid #f1f1f1
.radio
  margin-right 30px
.num-input
  width: 200px
  position relative
  .section-setting
    position relative
    .tip
      width 300px
      font-size: 12px
      position absolute
      top: 20px
      left: 125px
.left
  width calc(100% - 415px)
  height 100%
  float left
  .audio
    height 45px
.right
  width 355px
  height 565px
  margin 30px
  float left
  overflow hidden
.red
  font-size 13px
  color #666
#targetDom
  height 100%
  width 100%
  position relative
  .back-img
    position absolute
    top 0
    left 0
    width 355px
    height 565px
  .er-code
    width 170px 
    height 170px
    position absolute
    top 217px
    left 92px
    z-index 1
  .store-id
    width 170px
    height 40px
    line-height 40px
    text-align center
    font-family Futura-Medium
    color #404040
    margin 0 auto
    position absolute
    top 393px
    left 93px
    font-size 28px
    z-index 1
  .store-name
    width 240px
    text-align center
    color #404040
    font-size 16px
    position absolute
    bottom 68px
    left 58px
    z-index 1
    line-height 24px
.font-13
  font-size 13px
  line-height 16px
.form-wrapper
  border-top  none
  padding-top 10px
.tips
  font-size 13px
  color #666
  line-height 15px
  margin 20px 0 0 45px
</style>
