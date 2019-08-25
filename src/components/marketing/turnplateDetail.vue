<template lang="pug">
  .section-layout
    h2.level.header-wrapper
      .level-left
        .nav-back-btn(@click="goBack")
        .header-title(style={'padding-left':'25px'}) 参加活动
    .content-wrapper
      .section-setting
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 活动信息
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 活动名称
                  .labelname(v-text='detail.name')
                .field.is-horizontal
                  label.label 起止时间
                  .labelname
                    span.iocns_svg
                    span(v-if='detail.end_time', v-text='detail.start_time + "~" + detail.end_time')
                    span(v-if='!detail.end_time', v-text=' "长期" ')
                .field.is-horizontal(v-show='detail.lottery_nums!=0 || detail.share_nums!=0')
                  label.label 抽奖机会
                  .labelname
                    .yuan(v-if='detail.lottery_nums!=0')
                    span(v-if='detail.lottery_nums!=0') 赠送一次
                    .yuan(v-if='detail.share_nums!=0')
                    span(v-if='detail.share_nums!=0') 分享送一次
                .field.is-horizontal
                  label.label 活动简介
                  .labelname(v-text='detail.description')
      .section-setting
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 奖品信息
        .level.level-content
          .level-left.clearflex(style={padding:'0 64px','flex-grow':1})
            .form-wrapper.form-wrapper-zhigong(v-show='zhigongList.length>0')
              .field-group(v-for="(win, index) in detail.prize_item", v-if='win.type==1')
                .field.is-horizontal
                  label.label 直供奖品
                  .labelname(v-text='win.coupon_name') 京东E卡 200元
                .field.is-horizontal.field_200px
                  label.label.label_50px 数量
                  .labelname(v-text='win.stock_nums') 10  张
                .field.is-horizontal.field_200px
                  label.label.label_50px 中奖率
                  .labelname(v-text='win.rate') 10
                .field.is-horizontal.field_200px
                  label.label.label_50px 已中奖
                  .labelname(:class="{'blue': win.win_prize_count > 0}", v-text='win.used') 10
            .form-wrapper.form-wrapper-zhigong(:style="{'padding-top':'15px','border-top':zhigongList.length>0 ? '1px solid rgba(0,0,0,0.08)' : '0px'}",v-show='mendianList.length>0')
              .field-group(v-for='(win, index) in mendianList')
                .field.is-horizontal
                  label.label(v-if='index==0') 门店奖励
                  label.label(v-if='index!=0')
                  .labelname(v-text='win.coupon_name') 快结束的结束山东快书
                .field.is-horizontal.field_200px
                  label.label.label_50px 数量
                  .labelname(v-text='win.stock_nums+" 张"') 10  张
                .field.is-horizontal.field_200px
                  label.label.label_50px 中奖率
                  .labelname(v-text='win.rate') 10
                .field.is-horizontal.field_200px
                  label.label.label_50px 已中奖
                  .labelname(:class="{'blue': win.win_prize_count > 0}", v-text='win.used') 10
      .section-setting(style={position:'relative'})
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 中奖客户清单
        empty-page(v-if="!list.length && isInitiated", :tip="'暂无中奖客户'",style={'margin-top':'40px'})
        .table-wrapper(style={'border-bottom':'8px solid #f0f1f2','margin-bottom':'13px'},v-if="list.length")
          table.table.table_cleardefault
            thead
              tr
                td(width="120") 时间
                td(width="100") 名称
                td(width="100") 电话
                td(width="100") 车牌号
                td(width="140") 车型
                td(width="120") 奖品
            tbody
              tr(v-for="(coupon, index) in list")
                td
                  .simple-td(v-text="coupon.created_at")
                td
                  .simple-td(v-text="coupon.customer_name")
                td
                  .simple-td(v-text="coupon.mobile")
                td
                  .simple-td(v-if="coupon.license_plate === ''") 暂无数据
                  .simple-td(v-else) {{coupon.license_plate}}
                td
                  .simple-td(v-if="coupon.car_model === ''") 暂无数据
                  .simple-td(v-else) {{coupon.car_model}}
                td
                  .simple-td(v-text="coupon.coupon_name")
        .tfoot(v-if="list.length")
          pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import marketingMixin from '@/mixins/modules/marketing'
import CustomInput from '@/components/generics/form/CustomInput'
import Pagination from '@/components/generics/Pagination'
import EmptyPage from '@/components/generics/EmptyPage'
import { mapGetters } from 'vuex'

export default {
  name: 'turnplateDetail',
  mixins: [marketingMixin],
  components: {
    CustomInput,
    Pagination,
    EmptyPage,
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
  },
  data () {
    return {
      isLoading: false,
      isInitiated: false,
      // 分页的数据
      paginationData: {
        current_page: 1, // 当前页
        per_page: 15, // 每页的数据
        last_page: 2, // 最后一页
        total: 31, // 总数据
      },
      store_id: '', // 门店的id
      detail: {}, // 活动详情
      activeId: null, // 活动id
      mendianList: [], // 门店奖励
      list: [],
      zhigongList: [], // 直供奖励
    }
  },
  methods: {
    // 返回按钮
    goBack () {
      if (this.isLoading) {
        return
      }
      this.$router.push({
        name: 'turnplateList',
        query: {
          save: 1,
        },
      })
    },
    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
    // 获取活动详情
    async getDetail () {
      try {
        const {response, result} = await this.activeDetail(this.$route.params.id, {
          store_id: this.store_id,
        })
        if (response.status === 200) {
          if (result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取活动详情失败',
              content: result.message,
            })
          } else {
            result.data.start_time = this.changeDateTime(result.data.start_time)
            result.data.end_time = this.changeDateTime(result.data.end_time)
            this.detail = result.data
            this.mendianList = result.data.prize_item
            this.fetchData()
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取活动详情失败',
            content: result.message,
          })
        }
      } catch (err) {
        // console.log(err)
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取活动详情失败',
          content: '服务异常，请稍后再试',
        })
      }
      this.isInitiated = true
    },
    // 获取中奖清单
    async fetchData () {
      try {
        const {response, result} = await this.winCustomerList(this.activeId, {
          store_id: this.store_id,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200) {
          result.data.forEach(item => {
            if (item.car_model === '  ') {
              item.car_model = ''
            }
            // item.car_model = item.car_model.replace(/(^\s*)|(\s*$)/g, "")
            item.created_at = this.changeDateTime(item.created_at)
          })
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取中奖客户清单失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取中奖客户清单失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    /**
     * 时间戳转年月日
     * @val  时间戳
     */
    changeDateTime (val) {
      if (!val) {
        return ''
      }
      let date = new Date(val * 1000)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = this.judgeTime(date.getDate()) + ' '
      let h = this.judgeTime(date.getHours()) + ':'
      let m = this.judgeTime(date.getMinutes())
      return Y + M + D + h + m
    },
    /**
     * 时 分 格式化
     * @t  时分
     */
    judgeTime (t) {
      if (t < 10) {
        return '0' + t
      } else {
        return t
      }
    },
  },
  mounted () {
    this.store_id = this.currentUser.store_id
    this.activeId = this.$route.params.id
    this.getDetail()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.content-wrapper
  padding-top 0
.label
  color #353535
  font-size 13px
.labelname
  color #999
  font-size 13px
  line-height 29px
.iocns_svg
  background center no-repeat url('~@/assets/calendar/input-calendar.svg')
  background-size 100% 100%
  display inline-block
  width 16px
  height 16px
  margin-top -2px
  margin-right 5px
  vertical-align middle
.labelname.red
  color #F4381E
.blue
  color #2FABDD
.yuan
  width 16px
  height 16px
  border-radius 50%
  border 5px solid #ffc723
  display inline-block
  vertical-align middle
  margin-right 5px
  margin-top -2px
.yuan:nth-of-type(2)
  margin-left 25px
.field.is-horizontal .label_50px
 flex 0 0 50px
 margin-right 0
.section-layout
  overflow-y auto

.section-setting
  + .section-setting
    margin-top 16px
  background #ffffff
  padding-bottom 24px

.header-wrapper
  height 56px
  align-items center
  padding-left 32px
  border-bottom 1px solid line

.header-title
  font-size 18px
  line-height 24px
  color darker
  position relative

.level-left
  align-items center
  flex 1
.clearflex
  display block !important

.switch-title
  margin-left 8px
  font-size 13px
  line-height 18px
  word-break keep-all

.form-wrapper
  padding 0
  padding-left 64px
  padding-top 24px
  padding-right 64px
  width 100%
  &.disabled
    opacity .5
.form-wrapper_clearmargin
  margin 0
  padding 0
.form-wrapper-zhigong
  padding-left 0
  padding-right 0
  padding-bottom 15px
.form-wrapper-zhigong .field-group
  flex-direction row
  align-items center
.form-wrapper-zhigong .field-group.field_m_t_0
  margin-top 5px
.form-wrapper-zhigong .field-group .field
  width 350px
  margin-top 0
.form-wrapper-zhigong .field-group .field_200px
  width 200px

.field-group
  width 100%
  + .field-group
    margin-top 15px
.field-group-m-t-15
  margin-top 8px
.custom-input
  width 106px
.custom_39px
  width 62px
.service-title
  line-height 16px
  font-size 13px
  color darker
  font-weight bold
  margin-bottom 8px

.service-content
  font-size 12px
  color lightGrey
  line-height 20px
  + .service-content
    margin-top 8px

.service-description
  width 305px
  margin-top 42px
  padding-left 16px
  border-left 1px solid line
  flex-shrink 0

.level-content
  align-items flex-start
.wide-form-wrapper
  width 320px
  .custom-input
    flex-grow 0
    width 95px
  .field.is-horizontal.has-tips::after
    right 50px

.setting-type-wrapper
  height auto

.type-item
  display flex
  align-items baseline
  height auto
  &:last-child
    margin-top 10px
.radio label
  padding-left 32px
.checkbox
  width 230px
  height auto
.sepcific-setting
  display flex
  align-items center
  .number-input
    margin 0 8px
    width 64px
  .price-input
    margin 0 8px
    width 95px

.gift-package-wrapper
  width 272px
.coupon-item
  display flex
  align-items center
  margin-bottom 8px
  cursor pointer
  &:hover
    .delete-icon
      display block
    .coupon-detail
      box-shadow 0 2px 8px -2px rgba(0,0,0,0.08)
.coupon-detail
  display flex
  justify-content space-between
  align-items center
  padding 12px
  width 240px
  height 40px
  border 1px solid #e5e5e5
  border-radius 2px
  font-size 13px
  line-hight 16px
  color #353535
.delete-icon
  display none
  margin 0 8px
  width 16px
  height 16px
  background center no-repeat url('~@/assets/icons/trash.svg')
.select-button
  margin-top 16px
  display flex
  align-items center
  font-size 13px
  line-height 16px
  color #353535
  cursor pointer
  .add-icon
    width 24px
    height 24px
    background #ffbb29 center no-repeat url('~@/assets/plus-l.svg')
    border-radius 24px
    margin-right 8px
.field.is-horizontal .control
  flex-grow inherit
.btn-wrapper
  padding 20px 0 0 116px
  border-top 1px solid rgba(0,0,0,0.08)
  margin-top 20px
.nav-back-btn
  position absolute
  top 12px
  left 15px
  width 32px
  height 32px
  border-radius 100%
  background #CED3DC center no-repeat url('~@/assets/back.svg')
  background-size 16px
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
  cursor pointer
  z-index 2
.table.table_cleardefault
  padding 0 20px
  border-spacing 0 0
.table.table_cleardefault thead tr
  background-color #fff
  padding 14px 0
.table.table_cleardefault thead tr td
  padding 8px 0 8px 0
  border-bottom 1px solid rgba(48,48,48,0.1)
.table.table_cleardefault thead tr td:first-child
  padding-left 14px
.table.table_cleardefault tbody tr td
  border-bottom 1px solid rgba(48,48,48,0.1)
.table.table_cleardefault tbody tr:last-child td
  border-bottom 0
.table_cleardefault.table tbody tr:hover
  box-shadow none
  td:first-child
    border-left 2px solid #fff
</style>
