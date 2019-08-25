<template lang="pug">
  .columns
    .columns.report-top
      .columns.is-horizontal.space-between.report-title
        .title 车检报告
        .inspection-type(:class="detail.inspection_type === 'COMPLETE' ? 'is-complete' : 'is-simple'", v-text="detail.inspection_type === 'COMPLETE' ? '全面检查' : '快速检测'")
        .create-time(v-text="detail.completed_at")
      .columns.is-horizontal.space-between.report-vehicle
        .vehicle-logo
          img(v-if="detail.vehicle_logo", :src="scaleImage(detail.vehicle_logo, 1, 40, 40)")
          .no-identity.large(v-else)
        .vehicle-content
          span.license-plate(v-text="detail.license_plate")
          span.vehicle-name(v-if="detail.customer_id", v-text="detail.vehicle_name ? detail.vehicle_name : '-'")
          span.no-identity-vehicle-name(v-else) 未接收
        .vehicle-mileage
          span.vehicle-mileage-num(v-text="detail.mileage !== null ? detail.mileage + 'KM' : '-'")
          span.vehicle-mileage-content 行驶里程
      .columns.is-horizontal.space-between.customer-mechanic
        .customer-mechanic-content
          span.customer-mechanic-title 车主
          span.customer-mechanic-name
            span(v-text="detail.customer ? detail.customer.real_name : '-'")
            span.slash /
            span(v-text="detail.customer ? detail.customer.mobile : '-'")
        .customer-mechanic-content
          span.customer-mechanic-title 技工
          span.customer-mechanic-name
            span(v-text="detail.store_name || '-'")
            span.slash /
            span(v-text="detail.mechanic_name")
    prior-conditions(:is-center-only="true", :is-white-bg="true")
      service-tab(v-model="currentLevel", :tabs="levelList", :have-icon="false", :is-report-quantity="true", @input="changeLevel")            
    .columns.report-wrapper
      empty-page(v-if="(!reportResult['attention'].length && currentLevel.type === 'ATTENTION') || (!reportResult['caution'].length && currentLevel.type === 'CAUTION') || (!reportResult['satisfaction'].length && currentLevel.type === 'SATISFACTION')", :tip="'当前没有' + (currentLevel.type === 'ATTENTION' ? '急需处理项' : currentLevel.type === 'CAUTION' ? '留意观察项' : '未见异常项')")
      .report-content(v-for="item in (currentLevel.type === 'ATTENTION' ? reportResult['attention'] : currentLevel.type === 'CAUTION' ? reportResult['caution'] : reportResult['satisfaction'])")
        .report-content-state(v-if="item.level === 'ATTENTION'", :class="{'is-handled': item.handling_status === 'HANDLED', 'is-ignored': item.handling_status === 'IGNORED'}")
        .report-content-title(v-text="item.inspection_spot_name")
        ul.report-content-results.is-horizontal
          li(v-for="result in item.items", :class="{'is-red': result.level === 'ATTENTION', 'is-orange': result.level === 'CAUTION'}", v-text="result.inspection_item_name + '：' + result.option")
        .report-content-remarks(v-if="item.images && item.images.length || item.notes") 备注
        .report-content-images
          a(class="content-images", v-for="image in item.images", :href="image.image_url", target="_blank")
            img(:src="scaleImage(image.image_url, 1, 60, 60)")
        .report-content-notes(v-text="item.notes")
</template>

<script>
import PriorConditions from '@/components/generics/PriorConditions'
import ServiceTab from '@/components/generics/ServiceTab'
import EmptyPage from '@/components/generics/EmptyPage'
import imageScale from '@/mixins/utilities/imageScale'

export default {
  name: 'ReportDetail',
  mixins: [imageScale],
  components: {
    PriorConditions,
    ServiceTab,
    EmptyPage,
  },
  props: {
    detail: {
      type: Object,
      default: {},
    },
  },
  data () {
    return {
      currentLevel: {},
      levelList: [],
      reportResult: {
        attention: [],
        caution: [],
        satisfaction: [],
      },
    }
  },
  methods: {
    changeLevel () {},
    restructureReportResults () {
      this.detail.results.map(element => {
        element.items.sort((prve, next) => {
          if (prve.level > next.level) return 1
          if (prve.level < next.level) return -1
          return 0
        })
      })
      this.reportResult.attention = this.detail.results.filter(element => element.level === 'ATTENTION')
      this.reportResult.caution = this.detail.results.filter(element => element.level === 'CAUTION')
      this.reportResult.satisfaction = this.detail.results.filter(element => element.level === 'SATISFACTION')
      this.levelList = [{
        type: 'ATTENTION',
        name: '项急需处理',
        count: this.reportResult.attention.length,
      }, {
        type: 'CAUTION',
        name: '项留意观察',
        count: this.reportResult.caution.length,
      }, {
        type: 'SATISFACTION',
        name: '项未见异常',
        count: this.reportResult.satisfaction.length,
      }]
      this.currentLevel = this.levelList[0]
    },
  },
  mounted () {
    this.restructureReportResults()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.report-top
  box-sizing border-box 
  height 219px
  flex-shrink 0
  background #fff
  padding 43px 24px 16px 32px
  border-bottom 1px solid #ebebeb
.report-top-1
  box-sizing border-box 
  height 267px
  background #fff
  padding-top 43px
  box-shadow 0 2px 8px 0 rgba(0, 0, 0 , .08)
.report-title
  height 24px
  align-items center
  margin-bottom 32px
  flex-shrink 0
  .title
    line-height 24px
    font-size 24px
    color darker
    margin-right 8px
  .inspection-type
    width 88px
    height 24px
    box-sizing border-box
    border 1px solid #ededf0
    padding-left 28px
    color lightGrey
    line-height 24px
    font-size 13px
    &.is-complete
      background getImage('full-inspection.svg') no-repeat 6px center
    &.is-simple
      background getImage('fast-inspection.svg') no-repeat 8px center
  .create-time
    flex-grow 1
    text-align right
    line-height 24px
    font-size 12px
    color lightGrey
.report-vehicle
  height 40px
  margin-bottom 16px
  flex-shrink 0
  .vehicle-logo
    width 40px
    height 40px
    margin-right 8px
  .vehicle-content
    height 40px
    flex-grow 1
    .license-plate
    .vehicle-name
      display block
      line-height 20px
      color darker
      font-size 14px
    .vehicle-name
      color lightGrey
      font-size 12px
  .vehicle-mileage
    position relative
    height 40px
    padding-left 24px
    &:after
      content ''
      display inline-block
      width 1px
      height 32px
      background rgba(0, 0, 0, .06)
      position absolute
      left 0
      top 4px
    .vehicle-mileage-num
    .vehicle-mileage-content
      display block
      line-height 20px
      color lightGrey
      font-size 12px
      text-align right
    .vehicle-mileage-num
      color darker
      font-size 14px
      font-weight bold
.customer-mechanic
  flex-shrink 0
  height 48px
  .customer-mechanic-content
    .customer-mechanic-title
    .customer-mechanic-name
      display block
      line-height 24px
      color lightGrey
      font-size 12px
    .customer-mechanic-name
      color darker
      font-size 13px
      font-weight bold
      .slash
        color disableBorderColor
        padding 0 6px
        font-weight normal
.report-wrapper
  flex-grow 1
  background #f5f5f5
  padding 16px 16px 0
  overflow-y auto
.report-content
  position relative
  display flex
  flex-direction column
  flex-shrink 0
  background #fff
  padding 16px 6px 16px 16px
  margin-bottom 8px
  .report-content-state
    position absolute
    top 0
    right 0
    width 50px
    height 50px
    background center no-repeat url('~@/assets/report/pending-repair.svg')
    background-size 50px
    &.is-handled
      background-image url('~@/assets/report/repaired.svg')
    &.is-ignored
      background-image url('~@/assets/report/ignore.svg')
  .report-content-title
    height 20px
    line-height 20px
    margin-bottom 18px
    color darker
    font-size 16px
    font-weight bold
  ul.report-content-results
    display flex
    flex-wrap wrap
    margin-bottom 8px
    padding-right 2px
    li
      display inline-block
      box-sizing border-box
      height 24px
      line-height 24px
      padding 0 7px
      background #fff
      border 1px solid #ededf0
      border-radius 2px
      font-size 12px
      font-weight bold
      color lightGrey
      margin 0 8px 8px 0
      &.is-red
        border none
        background rgba(255, 74, 74, .1)
        color #ff4a4a
      &.is-orange
        border none
        background rgba(255, 199, 35, .15)
        color #f59e2c
  .report-content-remarks
    position relative
    height 12px
    color lightGrey
    line-height 12px
    padding-left 17px
    font-size 12px
    margin 0 10px 10px 0
    background getImage('notes.svg') no-repeat left center
    &:after
      content ''
      display inline-block
      width 89%
      height 1px
      background rgba(0, 0, 0, .06)
      position absolute
      right 0
      top 5px
  .report-content-images
    display flex
    flex-wrap wrap
    padding-right
    .content-images
      margin 0 10px 5px 0
  .report-content-notes
    line-height 20px
    padding-right 10px
    color darker
    font-size 13px
</style>
