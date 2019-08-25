<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slide_visible", @input="toggleSidePannel")
      coupon-used-detail(:id="click_id")
    .section-filter
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filter_data.keyword", placeholder="客户名称/电话号码", @keyupEnter="search")
        .field
          label.label 状态
          custom-select(v-model="status", :list="status_list")
        .field
          label.label 获取方式
          custom-select(v-model="ways", :list="get_ways")
        .field
          label.label 使用渠道
          custom-select(v-model="cannel", :list="use_cannel")
        .field
          label.label 使用时间
          date-picker(v-model="use_time", type="range", placeholder="请选择")
        .field
          label.label 领取时间
          date-picker(v-model="receive_time", type="range", placeholder="请选择")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="resetFilter") 重置
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前没有优惠券记录'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="12%") 客户名称
              td(width="10%") 手机号
              td(width="10%") 优惠券名称
              td(width="8%") 金额(折扣)
              td(width="8%") 获取方式
              td(width="8%") 状态
              td(width="10%") 使用渠道
              td(width="12%") 使用时间
              td(width="12%") 领取时间
              td(width="10%") 操作
          tbody(v-if="list.length")
            tr(v-for="(coupon, index) in list")
              td
                .simple-td(v-text="coupon.real_name")
              td
                .simple-td(v-text="coupon.mobile")
              td
                .simple-td
                  span {{coupon.coupon_name}}
              td
                .simple-td
                  span {{coupon.coupon_type === 4 ? (coupon.discount_amount / 100) + ' 折' : '¥ ' + (coupon.discount_amount / 100)}}
              td
                .simple-td {{way_arr[coupon.obtain_type]}}
              td
                .simple-td(v-if="coupon.status - 0 === 1") 待使用
                .simple-td(v-if="coupon.status - 0 === 2") 已使用
                .simple-td(v-if="coupon.status - 0 === 3") 已过期
              td
                .simple-td(v-if="coupon.write_off_type === 1") 订单抵扣
                .simple-td(v-if="coupon.write_off_type === 2") 直接核销
                .simple-td(v-if="coupon.write_off_type === 0") - -
              td
                .simple-td(v-if="coupon.status - 0 === 2", v-text="formateDate(coupon.write_off_at)")
                .simple-td(v-else) - -
              td
                .simple-td {{formateDate(coupon.received_at)}}
              td
                .operation-td
                  span.operation-link(@click="goDetail(coupon)") 优惠券详情
      .tfoot(v-if="true")
        pagination(:pagination-data="pagination_data", @input="paging")
</template>

<script>
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import CouponUsedDetail from '@/components/marketing/modal/CouponUsedDetail'
  import DatePicker from '@/components/generics/form/DatePicker'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import Pagination from '@/components/generics/Pagination'
  import MarketingMixin from '@/mixins/modules/marketing'
  import FilterTools from '@/mixins/utilities/filterTools'
  import ImageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import FormateDate from '@/mixins/utilities/formateDate'
  export default {
    name: 'CouponRecordList',
    mixins: [MarketingMixin, FilterTools, ImageScale, FormateDate],
    components: {
      CustomInput,
      CustomSelect,
      DatePicker,
      EmptyPage,
      Pagination,
      SlideOutModal,
      CouponUsedDetail,
    },
    data: _ => {
      const schema = {
        click_id: null,
        slide_visible: false,
        is_initiated: false,
        pagination_data: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        status: {},         // 状态
        use_time: null,     // 使用时间
        receive_time: null, // 领取时间
        status_list: [{
          id: '',
          name: '全部',
        }, {
          id: 1,
          name: '待使用',
        }, {
          id: 2,
          name: '已使用',
        }, {
          id: 3,
          name: '已过期',
        }],
        ways: {},
        way_arr: ['', '定向推送', '活动中奖', '营销配置', '领券中心', '商品详情页'],
        get_ways: [{
          id: '',
          name: '全部',
        }, {
          id: 1,
          name: '定向推送',
        }, {
          id: 2,
          name: '活动中奖',
        }, {
          id: 3,
          name: '营销配置',
        }, {
          id: 4,
          name: '领券中心',
        }, {
          id: 5,
          name: '商品详情页',
        }],
        cannel: {}, // 渠道
        use_cannel: [{
          id: '',
          name: '全部',
        }, {
          id: 1,
          name: '订单抵扣',
        }, {
          id: 2,
          name: '直接核销',
        }],
        filter_data: {
          keyword: '',
        },
        query_data: {
          keyword: '',
        },
        list: [],
      }
        // 初始化搜索条件
      ;[schema.filter_data, schema.query_data].forEach(conditions => {
        conditions.keyword = ''
      })
      return schema
    },
    methods: {
      // 添加组件的展示
      toggleSidePannel () {
        this.slide_visible = !this.slide_visible
      },
      createCoupon () {
        this.$router.push({
          name: 'couponCreation',
        })
      },
      grantCoupon () {
        this.$router.push({
          name: 'couponGive',
        })
      },
      async fetchData () {
        try {
          const UT = this.dealWithTime(this.use_time)
          const RT = this.dealWithTime(this.receive_time)
          const {response, result} = await this.fetchRecordList({
            condition: this.query_data.keyword,
            page: this.pagination_data.current_page,
            per_page: this.pagination_data.per_page,
            status: this.status.id ? this.status.id : null,
            obtain_type: this.ways.id ? this.ways.id : null,
            write_off_type: this.cannel ? this.cannel.id : null,
            use_start_time: UT[0] / 1000,
            use_end_time: UT[1] / 1000,
            receive_start_time: RT[0] / 1000,
            receive_end_time: RT[1] / 1000,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
            this.pagination_data = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取优惠券列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取优惠券列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.is_initiated = true
      },
      search () {
        this.pagination_data.current_page = 1
        this.switchFilterData(this.filter_data, this.query_data)
        this.fetchData()
      },
      resetFilter () {
        this.cannel = {}
        this.ways = {}
        this.status = {}
        this.query_data.keyword = ''
        this.use_time = null     // 使用时间
        this.receive_time = null // 领取时间
        this.recallFilter()
        this.pagination_data.current_page = 1
        this.fetchData()
      },
      recallFilter () {
        this.switchFilterData(this.query_data, this.filter_data)
      },
      paging (state) {
        this.pagination_data = state
        this.recallFilter()
        this.fetchData()
      },
      /*
      * 查看使用详情
      * @ coupon 优惠券
      * */
      goDetail (coupon) {
        this.click_id = coupon.cc_id
        this.slide_visible = true
      },
      /**
       * 处理字符串日期区间
       * @param {String} str 日期区间
       * @returns {Integer}
       */
      dealWithTime (str) {
        let r = [null, null]
        if (str) {
          r = str.split(' 至 ')
          r[0] = new Date(r[0]).getTime()
          r[1] = new Date(r[1]).getTime()
        }
        return r
      },
    },
    mounted () {
      this.fetchData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .simple-td
    max-width 130px !important
  .section-layout
    height calc(100% - 48px)
  .list-wrapper
    height calc(100% - 90px) !important
  .section-filter
    display flex
    justify-content space-between
  .keyword-wrapper
    width 244px
  .button
    align-items center
  .add-icon
    display inline-flex
    width 16px
    height 16px
    background url('~@/assets/icons/button-add.svg') no-repeat center center
    background-size cover
    margin-right 6px
  .td-with-tip
    position relative
    display flex
    align-items center
  .help-tip-icon
    position relative
    display inline-block
    width 12px
    height 12px
    background url('~@/assets/icons/help.svg') no-repeat center center
    background-size cover
    margin-left 4px
    &:hover
      .help-tip
        display block
  .help-tip
    display none
    z-index 213
    position absolute
    top 22px
    left -76px
    width 160px
    padding 4px 6px
    border-radius 2px
    background-color #121212
    color #fff
    font-size 12px
    line-height 18px
    &::after
      content ''
      position absolute
      width 8px
      height 8px
      left 50%
      top -4px
      margin-left -2px
      transform rotate(45deg)
      background-color #121212
</style>
