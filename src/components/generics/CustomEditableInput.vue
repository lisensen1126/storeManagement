<template lang="pug">
  .input-editable(:class="{'is-active': !isLabelVisible}", :style="{'width': !!hasDefaultWidth ? hasDefaultWidth + 'px' : ''}")
    input.input(v-if="!isPrice", type="tel", :maxlength="maxlength", v-number-only="allowZero", :placeholder="placeholder", :value="defaultValue", @blur="updateValue($event.target.value)", ref="input")
    input.input(v-if="isPrice", :placeholder="placeholder", :value="defaultValue", @blur="updateValue($event.target.value)", ref="input")
    .label(v-text="labelValue", :class="{'has-color': !!defaultValue || (allowZero && defaultValue === 0), 'is-unvisible': !isLabelVisible}", @click="selectInput")
</template>

<script>
export default {
  name: 'CustomEditableInput',
  props: {
    value: [String, Number],
    placeholder: {
      type: String,
      default: '输入里程',
    },
    defaultUnit: {
      type: String,
      default: 'km',
    },
    maxlength: {
      type: Number,
      default: 6,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    hasDefaultWidth: {
      type: [String, Number],
      default: 70,
    },
    isPrice: {
      type: Boolean,
      default: false,
    },
    allowZero: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      defaultValue: '',
      copyValue: '',
      isLabelVisible: true,
    }
  },
  directives: {
    numberOnly: {
      bind: (el, binding) => {
        el.handler = () => {
          if (binding.value) {
            el.value = el.value.replace(/\D+/g, '')
          } else {
            el.value = el.value.replace(/\D+/g, '').replace(/^0/, '')
          }
        }
        el.addEventListener('input', el.handler)
      },
      unbind: el => {
        el.removeEventListener('input', el.handler)
      },
    },
  },
  computed: {
    labelValue () {
      return !!this.defaultValue || (this.allowZero && this.defaultValue === 0)
      ? this.isPrice
        ? this.defaultUnit + this.defaultValue
        : this.defaultValue + this.defaultUnit
      : this.placeholder
    },
  },
  watch: {
    value: {
      handler (val) {
        this.defaultValue = this.allowZero ? val || 0 : val
        this.copyValue = this.allowZero ? val || 0 : val
        this.isLabelVisible = val !== '' || (val !== 0 && !this.allowZero)
      },
      immediate: true,
    },
  },
  methods: {
    selectInput () {
      if (this.isDisabled) {
        return
      }
      this.$refs.input.focus()
      this.isLabelVisible = false
    },
    updateValue (value) {
      if (this.isDisabled) {
        return
      }
      this.defaultValue = this.allowZero ? value || 0 : value
      this.isLabelVisible = true

      if (this.isPrice) {
        this.$emit('input', typeof this.value === 'number' ? parseFloat(value) : value)
        if (this.copyValue === '' && this.defaultValue === '') {
          return
        }
        if (parseFloat(this.copyValue) !== parseFloat(this.defaultValue)) {
          this.$emit('change', value)
        }
      } else {
        this.$emit('input', typeof this.value === 'number'
          ? this.allowZero
            ? parseInt(value) || 0
            : parseInt(value)
            : value
        )
        if (this.copyValue === '' && this.defaultValue === '') {
          return
        }
        if (parseInt(this.copyValue) !== parseInt(this.defaultValue)) {
          this.$emit('change', this.allowZero ? value || 0 : value)
        }
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'

.input-editable
  border-bottom 1px solid #ddd
  height 24px
  box-sizing border-box
  position relative
  vertical-align middle
  display inline-block
  padding 0 2px
  overflow hidden
  &.is-active
    border-bottom 1px solid darker
  .label
    height 100%
    box-sizing border-box
    padding 4px 0
    line-height 16px
    color #999
    font-size 13px
    position relative
    z-index 2
    // text-align center
    min-width 32px
    &.has-color
      color darker
    &.is-unvisible
      visibility hidden
  .input
    position absolute
    width 100%
    height 100%
    left 0
    top 0
    padding 4px 2px
    line-height 16px
    color darker
    box-sizing border-box
    border none
    box-shadow none
    font-size 13px
    background-color transparent
    opacity 0
    &:focus
      outline none
      user-select none
      opacity 1
      + .label
        display none
</style>


