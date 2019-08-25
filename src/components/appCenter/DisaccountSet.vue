<template lang="pug">
  .section-layout
    .content-wrapper
      service-tab.top-nav(v-model="currt_type", :tabs="pay_type", :have-icon="false", :have-quantity="false", class="status-list", @input="changeTab($event)")
      .tab-box(v-if="currt_type.type == 2")
        .section-setting
          .form-wrapper
            .field-group
              .field.is-horizontal
                label.label 是否允许使用优惠券
                .switch
                  input(type="checkbox", id="open", v-model="is_open")
                  label(for="open")
              .field.is-horizontal
                label.label 同一用户每天最多允许使用：
                custom-input.fl(input-type="hasUnit", v-model="set_num" placeholder="请输入次数（1~10之内）", need-type="number", :isDisabled="!is_open")
                  span(slot="unitName") 次
              .field.is-horizontal.width-auto
                label.label 
                .red 温馨提示：该功能设置目前仅对门店收款码扫码付款页面生效。
          .btn-wrapper
            .button-group
              a.button.primary.large(@click="setAllowCoupon") 保存
</template>

<script>
import Tab from '@/components/appCenter/model/PublicTabs'
import CustomInput from '@/components/generics/form/CustomInput'
import Api from '@/mixins/modules/AppCenter'
import ServiceTab from '@/components/generics/ServiceTab'
export default {
  mixins: [Tab, Api],
  components: {
    CustomInput,
    ServiceTab,
  },
  data () {
    return {
      currt_type: {name: '优惠设置', type: 2},
      is_open: true,
      set_num: '',
    }
  },
  mounted () {
    this.is_click = 2
    this.currt_type = {name: '优惠设置', type: 2}
    this.getInfo()
  },
  methods: {
    async getInfo () {
      this.is_loading = true
      try {
        let {result, response} = await this.getOfflineOrderNotificationApi({hide_loading: true})
        if (response.status === 200 && result.code === 0) {
          this.is_open = result.data.is_open_coupon === 1
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
        // 设置是否可以使用优惠券
    setAllowCoupon () {
      let data = {
        is_open_coupon: this.is_open ? 1 : 2,   // 1打开，2关闭
      }
      // 如果填写了数量，就加入参数中
      if (Number(this.set_num)) {
        data.coupon_num = Number(this.set_num)
      }
      if (this.is_open && !Number(this.set_num)) {
        this.$store.dispatch('showMessage', {
          title: '请填写1~10之内的使用次数！',
        })
        return
      }
      this.setInfo(data)
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
  },
  watch: {
    set_num (val) {
      if (Number(val) > 10) {
        this.set_num = 10
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.section-layout >>>.status-list ul
  justify-content left
  padding-left 20px
  background-color #ffffff
.red
  font-size 13px
  color #666
.width-auto
  width auto !important
</style>
