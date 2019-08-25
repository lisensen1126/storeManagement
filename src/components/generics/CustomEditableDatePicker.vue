<template lang="pug">
  .input-editable
    .input
      date-picker(type="single", :placeholder="placeholder", v-model="defaultValue", :has-icon-label="false", :has-clear-btn="false", :has-border="false", :options="options")
</template>

<script>
import DatePicker from '@/components/generics/form/DatePicker'
export default {
  name: 'CustomEditableDatePicker',
  props: {
    value: {
      type: String,
    },
    placeholder: {
      type: String,
      default: '指定日期',
    },
    maxlength: {
      type: Number,
      default: 6,
    },
    options: {
      type: Object,
      default: () => {
        return {
          dateFormat: 'Y/m/d',
        }
      },
    },
  },
  components: {
    DatePicker,
  },
  data () {
    return {
      defaultValue: '',
      copyValue: '',
    }
  },
  watch: {
    value: {
      handler (val) {
        this.defaultValue = val
        this.copyValue = val
      },
      immediate: true,
    },
    defaultValue (val) {
      this.$emit('input', val)
      if (this.copyValue !== this.defaultValue) {
        this.$emit('change', val)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'

.input-editable
  width 76px
  border-bottom 1px solid #ddd
  height 24px
  box-sizing border-box
  position relative
  vertical-align middle
  display inline-block
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
</style>


