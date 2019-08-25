<template lang="pug">
  .control(:class="[{ 'is-error': validator && validator.$error, 'is-disabled': isDisabled}, scaleClass]")
    input.input(:value="value", @input="updateValue($event.target.value)", @blur="check($event.target.value)", :placeholder="placeholder", :disabled="isDisabled", :autocomplete="autocomplete" :maxlength="maxlength", :type="type", :max="max", :min="min", :class="{'is-disabled': isDisabled, 'p-36': padding}", @keyup.enter="keyEnter", ref="input1", :title="value", :style="'color:'+ textColor + '!important;'")
    .error-icon(v-show="validator && validator.$error")
    .error-info(v-show="validator && validator.$error", v-text="errorInfo")
    .count-info
      slot(name="countInfo")
    .unit-info
      slot(name="unitName")
    //-  输入放大显示
    .show-big-box(v-text="value", :class="{'show-big': value && value.length > 0 && openShowBig && show_big_flag}")
    //- 联想功能
    .filter-box(v-if="filterShow && filterList.length")
      .filter-item(v-for="(item, index) in filterList" v-text="item" @click="chooseFilterItem(item)")
</template>

<script>
  /**
   * @augments inputType 默认为normal 根据需求传递hasUnit(带单位) hasCount(带计数)
   * @augments validator 传递vuelidate对象 判断对错 参考erp-center
   * @augments isDisabled 为true时 禁止输入
   * @augments textColor 文字颜色
   * @description 根据需求传递slot countInfo为信息 unitName为单位
   */
  export default {
    name: 'CustomInput',
    props: {
      value: [String, Number],
      // 联想array
      list: {
        type: Array,
        default: () => [],
      },
      textColor: {
        type: String,
        default () {
          return '#353535'
        },
      },
      type: {
        type: String,
        default () {
          return 'text'
        },
      },
      padding: {
        type: Number,
        default () {
          return 0
        },
      },
      placeholder: {
        type: String,
        default () {
          return ''
        },
      },
      maxlength: {
        type: [String, Number],
      },
      max: {
        type: [String, Number],
      },
      needType: {
        type: String,
        default () {
          return 'normal'
        },
      },
      min: {
        type: [String, Number],
      },
      inputType: {
        type: String,
        default () {
          return 'normal'
        },
      },
      validator: {
        type: Object,
        default () {
          return null
        },
      },
      errorInfo: {
        type: String,
        default () {
          return ''
        },
      },
      isDisabled: {
        type: '',
        default () {
          return false
        },
      },
      autocomplete: {
        type: '',
        default () {
          return 'on'
        },
      },
      // 控制是否开启放大显示效果
      openShowBig: {
        type: Boolean,
        default () {
          return false
        },
      },
    },
    data () {
      return {
        show_big_flag: false,
        filterShow: false,
      }
    },
    computed: {
      scaleClass () {
        return this.inputType === 'hasCount' ? 'has-count'
          : this.inputType === 'hasUnit' ? 'has-unit' : `is-${this.inputType}`
      },
      filterList () {
        return this.list.filter(item => {
          return item.indexOf(this.value) >= 0
        })
      },
    },
    mounted () {
      this.getUnitWidth()
    },
    methods: {
      updateValue (value) {
        this.show_big_flag = true
        this.filterShow = !!value
        // 只能输入数字
        if (this.needType === 'number') {
          let data = value.replace(/\D/g, '')
          if (this.max !== undefined) {
            if (this.max < data) data = this.max
          }
          this.$refs.input1.value = data
        }
        // 只能输入数字和小数点
        if (this.needType === 'float') {
          // 先把非数字的都替换掉，除了数字和.
          let a = value.replace(/[^\d.]/g, '')
          // 保证只有出现一个.而没有多个.
          let b = a.replace(/\.{2,}/g, '.')
          // 必须保证第一个为数字而不是小数点
          let c = b.replace(/^\./g, '')
          // 保证.只出现一次小数点，而不能出现两次以上
          this.$refs.input1.value = c.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          if (c.indexOf('.') < 0 && c !== '') {
            if (c.substr(0, 1) === '0' && c.length === 2) {
              this.$refs.input1.value = c.substr(1, c.length)
            }
          }
        }
        // 只能输入数字字母
        if (this.needType === 'number_letter') {
          this.$refs.input1.value = value.replace(/[\W]/g, '')
        }
        // 只能输入数字和‘-’（主要判断数据为座机时）
        if (this.needType === 'specialTel') {
          let arr = value.split('-')
          let data = ''
          arr.forEach((item, index) => {
            if (index !== arr.length - 1) {
              data += (item.replace(/\D/g, '') + '-')
            } else {
              data += item.replace(/\D/g, '')
            }
          })
          // 必须保证第一个为数字而不是'-'
          let a = data.replace(/^-/g, '')
          // 保证.只出现一次'-'，而不能出现两次以上
          this.$refs.input1.value = a.replace('-', '$#$').replace(/-/g, '').replace('$#$', '-')
        }
        // 纯数字并且输入四位自动补一个空格
        if (this.needType === 'bank_card') {
          this.$refs.input1.value = value.replace(/\D/g, '').replace(/....(?!$)/g, '$& ')
        }
        // 不允许输入空格
        if (this.needType === 'no_space') {
          this.$refs.input1.value = value.replace(/^ +| +$/g, '')
        }
        this.$emit('input', this.$refs.input1.value)
        this.validator && this.validator.$touch()
      },
      check (value) {
        this.show_big_flag = false
        setTimeout(() => {
          this.filterShow = false
        }, 500)
        this.$emit('blur', value)
      },
      getUnitWidth () {
        let unitNameDom = this.$el.querySelector('.unit-info')
        if (unitNameDom && unitNameDom.innerHTML) {
          let domWidth = parseInt(window.getComputedStyle(unitNameDom).width)
          if (domWidth > 28) {
            this.$el.querySelector('.input').style.paddingRight = domWidth + 22 + 'px'
            this.$el.querySelector('.error-icon').style.right = domWidth + 9 + 'px'
          }
        }
      },
      keyEnter () {
        this.$emit('keyupEnter')
      },
      /**
       * 选中联想 item
       */
      chooseFilterItem (value) {
        this.$emit('input', value)
        this.filterShow = false
      },
    },
  }
</script>

<style scoped lang="stylus">
  @import '~@/stylus/mixins'
  .error-info
    z-index 30
  .has-count.is-error
    .error-icon
      right 50px
  .has-unit.is-error
    .error-icon
      right 40px
  .change-rule-modal-body
    .has-unit.is-error
      .error-icon
        right 52px
  .p-36
    padding 7px 36px
    text-align center
  .is-disabled
    cursor not-allowed
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button
    -webkit-appearance: none !important
  .show-big-box
    height 30px
    min-width 10px
    white-space nowrap
    line-height 30px
    padding 0px 8px
    background #FBCE07
    position absolute
    left 0
    top -35px
    font-size 24px
    color #404040
    line-height 30px
    opacity 0
    transition all 0.2s
    border-radius 5px
    z-index 2
  .show-big
    opacity 1
.filter-box
  position absolute
  left 0
  top 35px
  z-index 99
  background-color #ffffff
  box-shadow 0 0 10px rgba(0,0,0,0.2)
  padding 5px 10px
  width 100%
  max-height 90px
  overflow auto
  .filter-item
    font-size 12px
    line-height 20px
</style>
