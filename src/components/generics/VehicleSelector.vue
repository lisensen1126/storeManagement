<!--车辆品牌选择组件-->
<template lang="pug">
  .vehicle-selector(@click.stop="")
    .search-bar
      input.search-input(placeholder="输入VIN码快速找车", v-model="keyword", @keyup="searchByVin")
      div.icon-wrapper
        span.search-icon
        span.clear-icon(v-if="keyword", @click="clearKeyword")
    .selector-panel
      .alphabet
        .letter(v-if="!shortcut.isAbsent", v-for="shortcut in alphabet", :class="{'is-absent': shortcut.isAbsent, 'is-active': seekingIn === shortcut.letter}", v-text="shortcut.letter", @mousedown.left="startBrowse(shortcut)", @mousemove="seekIn(shortcut)", @mouseup.left="endBrowse")
      .brand-list(ref="candidates")
        template(v-for="(candidate, index) in filteredCandidates")
          .item-initial(:ref="'candidate' + getInitial(candidate)", v-if="isFirstOfGroup(index)", v-text="getInitial(candidate)")
          .brand-item(v-text="candidate.name", :title="candidate.name", :class="{'is-selected': selection.carpart_brand_id === candidate.id}", @click="selectBrand(candidate)")
      .model-list
        template(v-for="(model, index) in modelList")
          .item-initial(v-if="isFirstOfFactory(model, index)", v-text="model.factory.name")
          .sub-btn(v-text="'确定'",@click="subSelect")
          .model-item(:class="{'is-selected': selection.carpart_model_id === model.id}", v-text="model.name", @click="selectModel(model)")
      .vehicle-type-panel(v-if="typePanelShow", @click="togglePanel")
        .type-list(@click.stop="")
          template(v-for="(type, index) in typeList")
            .item-initial(v-if="isFirstOfYear(type, index)", v-text="type.product_year + '款'")
            .sub-btn(v-text="'确定'",@click="subSelect")
            .type-item(:class="{'is-selected': selection.carpart_vehicle_id === type.id}", v-text="type.sales_name", @click="selectType(type)")
      .search-empty-panel(v-if="searchResultEmpty")
        .icon
        .tip 未找到相关车型
        .button.primary(@click="closeEmptyPanel") 按分类查找
</template>

<script>
import vehicleMixin from '@/mixins/modules/vehicle'
import { mapGetters } from 'vuex'

export default {
  name: 'VehicleSelector',
  mixins: [vehicleMixin],
  components: {
  },
  props: {
    value: {
      type: Object,
    },
  },
  data () {
    return {
      keyword: '',
      normalPattern: /[A-Z]/,
      isBrowsing: false,
      seekingIn: 'A',
      modelList: [],
      typeList: [],
      selection: {
        brand_name: '',
        carpart_brand_id: null,
        model_name: '',
        carpart_model_id: null,
        vehicle_name: '',
        carpart_vehicle_id: null,
        product_year: '',
        series_name: '',
        logo: '',
      },
      typePanelShow: false,
      searchResultEmpty: false,
    }
  },
  computed: {
    ...mapGetters({
      candidates: 'brands',
    }),
    filteredCandidates () {
      return this.candidates
    },
    filteredInitials () {
      const initials = this.filteredCandidates.reduce((list, value, index) => {
        if (this.isFirstOfGroup(index)) {
          list.push(this.getInitial(value))
        }
        return list
      }, [])
      return [...initials]
    },
    alphabet () {
      const charCodeA = 'A'.charCodeAt(0)
      const alphabetLetters = Array.apply(null, Array(26)).map((value, index) => {
        const letter = String.fromCharCode(charCodeA + index)
        return {
          letter,
          isAbsent: !this.filteredInitials.includes(letter),
        }
      })
      return [...alphabetLetters]
    },
  },
  watch: {
    candidates: {
      handler (newval) {
        if (newval.length && !this.selection.brand_name) {
          this.selectBrand(this.candidates[0])
        }
      },
      immediate: true,
    },
  },
  methods: {
    // apis
    async vehicleModelList (brand) {
      try {
        const {response, result} = await this.fetchVehicleModels({
          vehicle_brand_id: brand.id,
        })
        if (response.status === 200) {
          this.modelList = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取车系列表失败',
            content: `出错啦！${result.message}`,
          })
        }
      } catch ({response, result}) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取车系列表失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
    async vehicleTypeList (model) {
      try {
        const {response, result} = await this.fetchVehicleTypes({
          vehicle_model_id: model.id,
        })
        if (response.status === 200) {
          this.typeList = result.data
          if (this.typeList.length <= 0) {
            this.subSelect()
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取类型列表失败',
            content: `出错啦！${result.message}`,
          })
        }
      } catch ({response, result}) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取类型列表失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
    // interactions
    clearKeyword () {
      this.keyword = ''
    },
    closeEmptyPanel () {
      this.clearKeyword()
      this.searchResultEmpty = false
    },
    async searchByVin () {
      if (this.keyword.length < 17) {
        return
      }
      try {
        const {response, result} = await this.fetchVehicleTypeDetail({
          vehicle_vin: this.keyword,
        })
        if (response.status === 200) {
          this.selectByVin(result.data)
        } else if (response.status === 422) {
          this.searchResultEmpty = true
        }
      } catch ({response, result}) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '搜索失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
    startBrowse (shortcut) {
      this.isBrowsing = true
      this.seekIn(shortcut)
    },
    seekIn (shortcut) {
      if (shortcut && this.isBrowsing && !shortcut.isAbsent) {
        this.seekingIn = shortcut.letter
      }
    },
    endBrowse () {
      this.isBrowsing = false
    },
    scrollTo () {
      if (this.isBrowsing && this.seekingIn) {
        if (this.filteredInitials.includes(this.seekingIn)) {
          this.$refs.candidates.scrollTop = this.getInitialAnchor(this.seekingIn).offsetTop
        } else {
          this.seekingIn = ''
          this.$refs.candidates.scrollTop = 0
        }
      }
    },
    selectBrand (brand) {
      this.selection.brand_name = brand.name
      this.selection.carpart_brand_id = brand.id
      this.selection.logo = brand.logo_url
      this.vehicleModelList(brand)
    },
    selectModel (model) {
      if (this.selection.carpart_model_id !== model.id || this.modelList.length) {
        this.vehicleTypeList(model)
      }
      this.selection.model_name = model.name
      this.selection.carpart_model_id = model.id
      this.togglePanel()
    },
    togglePanel () {
      this.typePanelShow = !this.typePanelShow
    },
    selectByVin (type) {
      this.selection.carpart_vehicle_id = type.id
      this.selection.carpart_model_id = type.model.id
      this.selection.carpart_brand_id = type.brand.id
      this.selection.logo = type.brand_logo_url
      this.selection.brand_name = type.brand_name
      this.selection.model_name = type.model_name
      this.selection.series_name = type.series_name
      this.selection.product_year = type.product_year
      this.selection.vehicle_name = type.sales_name
      this.$emit('input', this.selection)
    },
    selectType (type) {
      this.selection.vehicle_name = type.sales_name
      this.selection.carpart_vehicle_id = type.id
      this.selection.product_year = type.product_year
      this.selection.logo = type.brand_logo_url
      this.selection.series_name = type.series_name
      this.selection.output_volume = type.displacement
      this.$emit('input', this.selection)
    },
    subSelect () {
      this.$emit('input', this.selection)
    },
    // utils
    getInitial (candidate) {
      if (candidate && candidate.pinyin) {
        const initial = candidate.pinyin.charAt(0).toUpperCase()
        return initial
      }
    },
    isFirstOfGroup (index) {
      const initial = this.getInitial(this.filteredCandidates[index])
      return !index || initial !== this.getInitial(this.filteredCandidates[index - 1])
    },
    getInitialAnchor (letter) {
      const anchor = this.$refs[`candidate${letter}`]
      return Array.isArray(anchor) ? anchor[0] : anchor
    },
    isFirstOfFactory (model, index) {
      return !index || model.factory.id !== this.modelList[index - 1].factory.id
    },
    isFirstOfYear (type, index) {
      return !index || type.product_year !== this.typeList[index - 1].product_year
    },
  },
  mounted () {
    this.$watch('seekingIn', this.scrollTo)
    this._onBodyClick = () => {
      this.$emit('close')
    }
    document.body.addEventListener('click', this._onBodyClick, false)
    !this.$store.getters.brands.length && this.$store.dispatch('synchronizeBrands')
  },
  destroyed () {
    document.body.removeEventListener('click', this._onBodyClick)
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'

.vehicle-selector
  display flex
  flex-direction column
  position absolute
  top 100%
  left 0
  width 100%
  max-width 336px
  height 429px
  background #FFFFFF
  box-shadow 0 2px 5px 0 rgba(0, 0, 0, .05), 0 6px 28px 0 rgba(0, 0, 0, .1)
  border-radius 2px
  z-index 12

.search-bar
  flex 0 0 48px
  position relative
  display flex
  height 48px
  padding 8px
  border-radius 2px 2px 0 0
  border-bottom 1px solid rgba(0, 0, 0, .05)
.search-input
  flex 1 1 auto
  padding 7px 12px
  padding-right 64px
  font-size 13px
  line-height 16px
  border 1px solid #CCCCCC
  border-radius 2px
  caret-color  #FFC723
  background-color transparent
  &::placeholder
    color #b2b2b2
  &:hover
  &:focus
    border-color #C2C2C2
    box-shadow 0 2px 4px 0 rgba(0, 0, 0, .06)
  &:focus + .icon-wrapper
    .search-icon
      background-image url('~@/assets/vehicle/search-yellow.svg')
.search-icon
  position absolute
  right 16px
  top 16px
  width 16px
  height 16px
  background center no-repeat
  background-image url('~@/assets/vehicle/search-grey.svg')
.clear-icon
  position absolute
  right 40px
  top 8px
  width 32px
  height 32px
  background center no-repeat url('~@/assets/vehicle/clear.svg')
  cursor pointer
  &::after
    content ''
    position absolute
    top 50%
    right 0
    margin-top -8px
    height 16px
    border-left 1px solid rgba(0, 0, 0, .08)

.selector-panel
  position relative
  flex 1 1 auto
  display flex
  min-height 0

.alphabet
  flex 0 0 32px
  display flex
  flex-direction column
  justify-content center
  background #F5F5F5
  border-right 1px solid rgba(0, 0, 0, .05)
  user-select none
.letter
  text-align center
  font-size 12px
  line-height 16px
  color #999
  width 100%
  height 16px
  cursor pointer
  &.is-active
    color #ffc723
  &.is-absent
    color rgba(lightGrey, .5)
    cursor default
.brand-list
  flex 0 0 112px
  background-color #fafafa
  border-right 1px solid rgba(0, 0, 0, .05)
  overflow-y auto
.brand-item
.model-item
.type-item
.item-initial
  position relative
  padding-left 16px
  font-size 12px
  line-height 32px
.item-initial
  color #b2b2b2
  height 32px
  display flex
  &::after
    content ''
    flex 1 0 auto
    display block
    margin 16px 8px 0 8px
    border-top 1px solid rgba(0, 0, 0, .08)
.sub-btn
  width 40px
  height 18px
  background #ffc723
  border-radius 2px
  color #fff
  font-size 13px
  line-height 18px
  text-align center
  position absolute
  right 8px
  top 6px
.brand-item
  padding-right 32px
  color #121212
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  cursor pointer
  &::before
    display block
    content ''
    position absolute
    width 3px
    height 12px
    background-color  #ffbb29
    top 10px
    left 0
    display none
  &.is-selected
    background-color #fff
    &::before
      display block
  &:hover
    background #fff

.model-list
  flex 1 1 auto
  overflow-y auto
.model-item
  padding-right 32px
  color #121212
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  cursor pointer
  &::after
    content ''
    position absolute
    right 8px
    top 10px
    width 12px
    height 12px
    background center no-repeat
    background-image url('~@/assets/vehicle/list-right.svg')
  &.is-selected
  &:hover
    background #f5f5f7
.vehicle-type-panel
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  background-color rgba(0, 0, 0, .3)
.type-list
  position absolute
  top 0
  right 0
  width 271px
  height 100%
  background-color #fff
  overflow-y auto
.type-item
  padding-right 32px
  color #121212
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  cursor pointer
  &::after
    display block
    content ''
    position absolute
    width 3px
    height 6px
    border 2px solid #ffbb29
    border-top none
    border-left none
    top 11px
    right 14px
    transform rotate(45deg)
    display none
  &.is-selected
    &::after
      display block
  &:hover
    background #f5f5f7
.search-empty-panel
  position absolute
  display flex
  flex-direction column
  justify-content center
  align-items center
  width 100%
  height 100%
  background-color #fafafa
  .icon
    width 64px
    height 64px
    background center no-repeat url('~@/assets/vehicle/car-select.svg')
  .tip
    margin-bottom 15px
    font-size 13px
    line-height 16px
    color #b2b2b2
  .button
    margin-bottom 65px
</style>

