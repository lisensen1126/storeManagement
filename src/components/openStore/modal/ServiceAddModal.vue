<!--选择品牌馆弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 添加服务能力
        .close-button(@click="modalClose")
      .modal-body
        .form-wrapper
          .field-group
            .field.is-horizontal
              label.label 选择服务
              custom-select(:list="serviceList", v-model="service_data.current_service", nameField="name", @input="selected", :validator="$v.service_data.current_service", error-info="请选择服务",)
            .field.is-horizontal
              label.label {{service_text}}
              custom-input(:placeholder="placeholder_text", v-model="service_data.service_desc", maxlength=10, :validator="$v.service_data.service_desc", error-info="请输入",)
            .field.is-horizontal
              label.label 小程序AppID
              .field-content {{service_data.app_id}}
            .field.is-horizontal
              label.label 小程序页面路径
              custom-input(placeholder="填写该服务的对应的小程序页面路径", v-model="service_data.page_route", :validator="$v.service_data.page_route", error-info="请输入该服务的对应的小程序页面路径",)
      .modal-footer.level
        .level-left
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(@click="complete") 添加
</template>

<script>
import ModalInteractions from '@/mixins/utilities/modalInteractions'
import ModalDialog from '@/components/generics/ModalDialog'
import CustomSelect from '@/components/generics/form/CustomSelect'
import CustomInput from '@/components/generics/form/CustomInput'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'serviceAddModal',
  components: {
    ModalDialog,
    CustomSelect,
    CustomInput,
  },
  mixins: [ModalInteractions, validationMixin],
  props: {
    serviceList: {
      type: Array,
    },
    appId: {
      type: String,
      default: '',
    },
    currentData: {
      type: Array,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  validations: {
    service_data: {
      current_service: { required },
      service_desc: { required },
      page_route: { required },
    },
  },
  data () {
    return {
      service_text: '服务描述',
      placeholder_text: '填写该服务优惠、新品等信息, 如: 满40减5',
      service_data: {
        current_service: {}, // 服务类型
        service_desc: '', // 服务描述
        app_id: this.appId, // appid
        page_route: '', // 小程序页面路径
        custom_name: '', // 自定义服务名称
      },
      standard_num: 1, // 标准服务
      custom_num: 1, // 自定义服务
      id_arr: [],
    }
  },
  methods: {
    // 选择服务回调
    selected (data) {
      if (data.id === 0) {
        this.service_text = '服务名称'
        this.placeholder_text = '用于展示服务名称, 10个字符以内'
      } else {
        this.service_text = '服务描述'
        this.placeholder_text = '填写该服务优惠、新品等信息, 如: 满40减5'
      }
    },
    complete () {
      this.$v.$touch()
      if (this.$v.$error) {
        return false
      }
      if (this.custom_num > 4 && this.service_data.current_service.id === 0 && !this.isEdit) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '最多添加4项自定义服务',
        })
        return
      } else if (this.custom_num <= 4 && this.service_data.current_service.id === 0) {
        let flag = this.id_arr.some((item) => {
          return item === this.service_data.service_desc
        })
        if (flag && !this.isEdit) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: `自定义服务名称 '${this.service_data.service_desc}' 重复`,
          })
          return
        }
        this.service_data.custom_name = this.service_data.service_desc
        this.service_data.service_desc = ''
      }
      if (this.standard_num > 5 && this.service_data.current_service.id !== 0 && !this.isEdit) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '最多添加5项标准服务',
        })
        return
      } else if (this.standard_num <= 5 && this.service_data.current_service.id !== 0) {
        let flag = this.id_arr.some((item) => {
          return item === this.service_data.current_service.id
        })
        if (flag && !this.isEdit) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: `您已添加过 '${this.service_data.current_service.name}' 服务`,
          })
          return
        }
      }
      this.$emit('resolve', this.service_data)
    },
  },
  mounted () {
    this.currentData.forEach(item => {
      if (item.current_service.id === 0) {
        this.custom_num++
        this.id_arr.push(item.custom_name)
      } else {
        this.standard_num++
        this.id_arr.push(item.current_service.id)
      }
    })
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.red
  color #FE0000
.blur
  color #0000FF
.modal-header
  padding 20px 24px
.modal-footer
  padding 12px 16px
.modal-body
  padding 20px
  min-height 110px
  line-height 22px
  font-size 15px
  color #888
.text
  font-size 12px
  color #999
</style>

