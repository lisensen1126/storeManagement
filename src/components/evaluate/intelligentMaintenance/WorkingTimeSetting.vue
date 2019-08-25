<template lang="pug">
  .section-layout
    .content-wrapper
      h2 工时设置
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 机油工时费用
            custom-input(input-type="hasUnit", v-model="form_data.engineoil.value", placeholder="请输入",need-type='float', @input="toNum('engineoil')", :validator="$v.form_data.engineoil", error-info="输入0-9999的数且最多两位小数")
              span(slot="unitName") 元
          .field.is-horizontal
            label.label 机油滤清器工时费用
            custom-input(input-type="hasUnit", v-model="form_data.oilfilter.value", placeholder="请输入",need-type='float', @input="toNum('oilfilter')", :validator="$v.form_data.oilfilter", error-info="输入0-9999的数且最多两位小数")
              span(slot="unitName") 元
          .field.is-horizontal
            label.label 变速箱油工时费用
            custom-input(input-type="hasUnit", v-model="form_data.transmissionoil.value", placeholder="请输入",need-type='float', @input="toNum('transmissionoil')", :validator="$v.form_data.transmissionoil", error-info="输入0-9999的数且最多两位小数")
              span(slot="unitName") 元
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="save") 保存
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import Api from '@/mixins/modules/evaluate'
import { mapGetters } from 'vuex'
export default {
  mixins: [Api],
  components: {
    CustomInput,
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
    getStoreId () {
      return this.currentUser.store_id
    },
  },
  data () {
    return {
      form_data: {
        engineoil: {        // 机油工时费用
          id: '',
          key: '',
          value: '',
        },
        oilfilter: {        // 滤清器工时费用
          id: '',
          key: '',
          value: '',
        },
        transmissionoil: {  // 变速箱油工时费用
          id: '',
          key: '',
          value: '',
        },
      },
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      try {
        const {response, result} = await this.fetchWorkingTimeApi({
          store_id: this.getStoreId,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(item => {
            item.value = item.value === '0' ? '0' : item.value / 100
            this.form_data[item.key] = item
          })
        } else {
          throw new Error({ response, result })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取数据失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    async save () {
      this.$v.$touch()
      if (this.$v.$error) return
      let data = []
      for (let key in this.form_data) {
        let {..._d} = this.form_data[key]
        _d.value = _d.value === '' ? '0' : _d.value * 100
        data.push(_d)
      }
      try {
        const {response, result} = await this.updateIMApi({
          data: data,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '保存成功',
          })
        } else {
          throw new Error({ response, result })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '保存失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    toNum (name) {
      this.form_data[name].value = this.form_data[name].value.replace(/[^\d.]/g, '')
    },
  },
  validations: {
    form_data: {
      engineoil: {        // 机油工时费用
        validate (val) {
          let _v = val.value - 0
          return (/^\d+(\.\d{0,2})?$/.test(val.value) && (_v >= 0 && _v <= 9999)) || val.value === ''
        },
      },
      oilfilter: {        // 滤清器工时费用
        validate (val) {
          let _v = val.value - 0
          return (/^\d+(\.\d{0,2})?$/.test(val.value) && (_v >= 0 && _v <= 9999)) || val.value === ''
        },
      },
      transmissionoil: {  // 变速箱油工时费用
        validate (val) {
          let _v = val.value - 0
          return (/^\d+(\.\d{0,2})?$/.test(val.value) && (_v >= 0 && _v <= 9999)) || val.value === ''
        },
      },
    },
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';
</style>
