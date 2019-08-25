<template lang="pug">
  .section-layout
    .content-wrapper
      h2 数据开放设置
      .form-wrapper
        .field-group
          .field.is-horizontal
            .tip-description 设置在小程序端（我的页面）是否显示给用户查看相应的信息。未上透明车间系统默认关闭「我的施工录像」，未上ERP系统默认关闭「门店消费记录」
          .field.is-horizontal
            label.label 门店消费记录
            .switch
              input(type="checkbox", id="s01", v-model="item.records.val", @input="storeRecord")
              label(for="s01")
          .field.is-horizontal
            label.label 门店车检报告

            .switch
              input(type="checkbox", id="s02", v-model="item.vehicle.val", @input="storeVehicle")
              label(for="s02")
          .field.is-horizontal
            label.label 会员卡
            .switch
              input(type="checkbox", id="s03", v-model="item.vip.val", @input="storeVip")
              label(for="s03")
          .field.is-horizontal
            label.label 我的施工录像
            .switch
              input(type="checkbox", id="s04", v-model="item.movie.val", @input="storeMovie")
              label(for="s04")
          .field.is-horizontal
            label.label 天气预报
            .switch
              input(type="checkbox", id="s05", v-model="item.weather.val", @input="storeWeather")
              label(for="s05")

</template>

<script>
import settingApi from '@/mixins/modules/setting'
import fileUploader from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomTextarea from '@/components/generics/form/CustomTextarea'
import CustomSelect from '@/components/generics/form/CustomSelect'
import RichEditor from '@/components/generics/form/RichEditor'
import UploadPic from '@/components/generics/form/UploadPic'
import {validationMixin} from 'vuelidate'
import { mapGetters } from 'vuex'

export default {
  name: 'serviceAdd',
  mixins: [validationMixin, settingApi, fileUploader],
  components: {
    CustomInput,
    UploadPic,
    RichEditor,
    CustomSelect,
    CustomTextarea,
  },
  data () {
    return {
      item: {
        records: {}, // 消费记录
        vehicle: {}, // 车间报告
        vip: {}, // 会员卡
        movie: {}, // 施工录像
        weather: {}, // 天气
      },
      store_id: undefined, // 门店的ID
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
  },
  methods: {
    // 修改门店消费
    storeRecord () {
      this.item.records.val = !this.item.records.val
      // console.log(this.item.records)
      var params = {
        id: this.item.records.id,
        value: 'off',
      }
      if (this.item.records.val) {
        params.value = 'on'
      }
      this.updateApi(params)
    },
    // 修改车间报告
    storeVehicle () {
      this.item.vehicle.val = !this.item.vehicle.val
      var params = {
        id: this.item.vehicle.id,
        value: 'off',
      }
      if (this.item.vehicle.val) {
        params.value = 'on'
      }
      this.updateApi(params)
    },
    // 修改会员卡
    storeVip () {
      this.item.vip.val = !this.item.vip.val
      var params = {
        id: this.item.vip.id,
        value: 'off',
      }
      if (this.item.vip.val) {
        params.value = 'on'
      }
      this.updateApi(params)
    },
    // 修改施工录像
    storeMovie () {
      this.item.movie.val = !this.item.movie.val
      var params = {
        id: this.item.movie.id,
        value: 'off',
      }
      if (this.item.movie.val) {
        params.value = 'on'
      }
      this.updateApi(params)
    },
    // 修改天气预报
    storeWeather () {
      this.item.weather.val = !this.item.weather.val
      var params = {
        id: this.item.weather.id,
        value: 'off',
      }
      if (this.item.weather.val) {
        params.value = 'on'
      }
      this.updateApi(params)
    },
    /*
    * 修改接口
    * @ body 此次修改的参数
    * */
    async updateApi (body) {
      console.log('调用>>>>>>>>>')
      try {
        const {response, result} = await this.upDataSetting(body)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '修改状态成功',
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改状态成功失败',
              content: `错误: ${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改状态成功失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '修改状态成功失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.getStoreData()
    },
    // 门店数据开放详情
    async getStoreData () {
      try {
        const {response, result} = await this.getStoreSetting({
          store_id: this.store_id,
        })
        if (response.status === 200) {
          result.data.forEach(item => {
            if (item.key === 'videotape') {
              this.item.movie = item
              if (item.value === 'off') {
                this.item.movie.val = false
              } else {
                this.item.movie.val = true
              }
            }
            if (item.key === 'weather_show') {
              this.item.weather = item
              if (item.value === 'off') {
                this.item.weather.val = false
              } else {
                this.item.weather.val = true
              }
            }
            if (item.key === 'presentation') {
              this.item.vehicle = item
              if (item.value === 'off') {
                this.item.vehicle.val = false
              } else {
                this.item.vehicle.val = true
              }
            }
            if (item.key === 'consumption') {
              this.item.records = item
              if (item.value === 'off') {
                this.item.records.val = false
              } else {
                this.item.records.val = true
              }
            }
            if (item.key === 'membership') {
              this.item.vip = item
              if (item.value === 'off') {
                this.item.vip.val = false
              } else {
                this.item.vip.val = true
              }
            }
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店配置失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取门店配置失败',
          content: '服务异常，请稍后再试',
        })
      }
    },
  },
  mounted () {
    this.store_id = this.currentUser.store_id
    // 获取门店配置详情
    this.getStoreData()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.tip-description
  font-size 12px
  line-height 16px
  color red
  white-space nowrap
  margin-top 8px
.rich-eidtor-description
  margin-bottom 8px
.field-content
  font-size: 13px
  line-height: 16px
  color: #353535
  min-height: 500px
.field-group
  border none
.form-wrapper
  border-bottom none
</style>
