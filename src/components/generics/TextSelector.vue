<template lang="pug">
  .store-portal.is-multiple
    .current-store(v-if="value", :title="value.name", @click.stop="toggle")
      .store-name(v-text="value.name")
    .custom-select-list.store-list(v-if="isExpanded")
      .custom-select-item(v-for="candidate in listData", :class="{'selected': value.value === candidate.value}", :title="candidate.name", v-text="candidate.name", @click="selectCandidate(candidate)")
</template>

<script>
export default {
  name: 'TextSelector',
  props: {
    value: {
      type: Object,
    },
    inlineStyle: {
      type: Boolean,
      default: false,
    },
    reloading: {
      type: Boolean,
      default: true,
    },
    listData: {
      type: Array,
      default: [],
    },
  },
  data: _ => ({
    current: null,
    isExpanded: false,
    isSwitching: false,
  }),
  methods: {
    toggle (state) {
      this.isExpanded = typeof state === 'boolean' ? state : !this.isExpanded
    },
    selectCandidate (candidate) {
      this.$emit('input', candidate)
    },
  },
  mounted () {
    // collapse on body click
    this._onBodyClick = () => {
      this.isExpanded = false
    }
    this.$hub.$on(this.$hub.events.bodyClick, this._onBodyClick)
    // collapse on hub event
    this._collapsePortal = source => {
      if (this !== source) {
        this.isExpanded = false
      }
    }
    this.$hub.$on(this.$hub.events.collapseDataPickers, this._collapsePortal)
  },
  beforeDestroy () {
    this.$hub.$on(this.$hub.events.bodyClick, this._onBodyClick)
    this.$hub.$off(this.$hub.events.collapseDataPickers, this._collapsePortal)
  },
}
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'

  .store-portal
    display inline-block
    position relative
  .current-store
    cursor pointer
    &::after
      content ''
      display block
      margin auto 8px
      flex 0 0 0
      border-style solid dashed
      border-width 4px 4px 0
      border-color lightGrey transparent

  .current-store
    display flex
    align-items center

  .store-name
    font-size 18px
    line-height 24px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap

  .store-list
    min-width 112px
    width 100%
    max-height 176px
    overflow auto
    top calc(100% + 8px)
    left -12px
</style>

