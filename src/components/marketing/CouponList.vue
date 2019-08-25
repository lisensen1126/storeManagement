<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filterData.keyword", placeholder="优惠券名称", @keyupEnter="applyFilter")
        .field.is-narrow
          label.label 优惠券类型
          custom-select(v-model="filterData.coupon_type", :list="coupon_type_list", nameField="name")
        .field.is-narrow
          label.label 使用范围
          custom-select(v-model="filterData.use_scope", :list="use_scope_list", nameField="name")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="grantCoupon")
            span.add-icon
            span 发放优惠券
        .field
          label.label &nbsp;
          a.button.primary(@click="createCoupon")
            span.add-icon
            span 新建优惠券
    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有优惠券'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="10%") 名称
              td(width="6%") 金额(折扣)
              td(width="6%") 类型
              td(width="8%") 使用范围
              td(width="8%") 使用条件
              td(width="12%") 有效时间
              td(width="6%") 领取数量
              td(width="6%") 使用数量
              td(width="6%") 展示开关
              td(width="14%") 操作时间
              td(width="8%") 操作者
              td(width="10%") 操作
          tbody(v-if="list.length")
            tr(v-for="(coupon, index) in list")
              td
                .simple-td(v-text="coupon.coupon_name")
              td {{coupon.coupon_type === 4 ? (coupon.discount_amount / 100) + ' 折' : '¥ ' + (coupon.discount_amount / 100)}}
              td
                .simple-td
                  span {{coupon.coupon_type_name}}
              td
                .simple-td
                  span.use-scope {{coupon.coupon_use_type_name}}
              td
                .simple-td(v-if="coupon.coupon_type === 4")
                  span.use-scope 满{{coupon.condition_value/100}}元可用
                .simple-td(v-if="coupon.coupon_type === 1 || coupon.coupon_type === 3")
                  span.use-scope(v-if="coupon.condition_value === 0") 不限制
                  span.use-scope(v-else) 满{{coupon.condition_value/100}}减{{coupon.discount_amount/100}}
                .simple-td(v-if="coupon.coupon_type === 2")
                  span.use-scope 不限制
              td
                .simple-td {{coupon.effective_days}}
              td(v-if="coupon.totals===0", style='text-align:center')
                .simple-td 不限制
              td(v-else, style='text-align:center')
                .simple-td {{coupon.grant_num}}
              td(style='text-align:center')
                .simple-td {{coupon.write_num}}
              td
                .simple-td
                  .switch
                    input(type="checkbox", :id="coupon.coupon_id + 'display' + index", :checked="coupon.is_selecteed", v-model="coupon.is_selecteed")
                    label(:for="coupon.coupon_id + 'display' + index")
                    .switch-modal(@click="displayConfirm(coupon)")
              td
                .simple-td {{formateDate(coupon.updated_at, true)}}
              td
                .simple-td {{coupon.operator_name}}
              td
                .operation-td
                  span.operation-link.danger(@click="deleteConfirm(coupon)") 删除
                  span.operation-link(@click="editConfirm(coupon)") 编辑
      .tfoot(v-if="true")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import marketingMixin from '@/mixins/modules/marketing'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import FormateDate from '@/mixins/utilities/formateDate'

export default {
  name: 'CouponList',
  mixins: [marketingMixin, filterTools, imageScale, FormateDate],
  components: {
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
  },
  data: _ => {
    const schema = {
      isInitiated: false,
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      filterData: {
        keyword: '',
        coupon_type: {},  // 优惠券类型
        use_scope: {},    // 使用范围
      },
      queryData: {
        keyword: '',
        coupon_type: {},  // 优惠券类型
        use_scope: {},    // 使用范围
      },
      list: [],
      coupon_type_list: [ // 下拉选项 - 优惠券类型
        { id: 1, name: '代金券' },
        { id: 2, name: '兑换券' },
        { id: 3, name: '满减券' },
        { id: 4, name: '折扣券' },
      ],
      use_scope_list: [ // 下拉选项 - 使用范围
        { id: '', name: '全部' },
        { id: 1, name: '全场通用' },
        { id: 2, name: '指定分类' },
        { id: 3, name: '指定商品/服务' },
        { id: 4, name: '指定养护卡' },
      ],
    }
    // 初始化搜索条件
    ;[schema.filterData, schema.queryData].forEach(conditions => {
      conditions.keyword = ''
    })
    return schema
  },
  methods: {
    dg () {
      console.log(11)
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
        const {response, result} = await this.fetchCoupons({
          use_type: this.queryData.use_scope.id || null,
          coupon_type: this.queryData.coupon_type.id || null,
          keyword: this.queryData.keyword,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.list.splice(0, this.list.length, ...result.data)
          this.list.forEach(function (v) {
            v.is_show === 1 ? v.is_selecteed = true : v.is_selecteed = false
          })
          this.paginationData = result.meta
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
      this.isInitiated = true
    },
    applyFilter () {
      this.paginationData.current_page = 1
      this.switchFilterData(this.filterData, this.queryData)
      this.fetchData()
    },
    resetFilter () {
      this.queryData = {
        keyword: '',
        coupon_type: {},  // 优惠券类型
        use_scope: {},    // 使用范围
      }
      this.recallFilter()
      this.paginationData.current_page = 1
      this.fetchData()
    },
    recallFilter () {
      this.switchFilterData(this.queryData, this.filterData)
    },
    paging (state) {
      this.paginationData = state
      this.recallFilter()
      this.fetchData()
    },
    deleteConfirm (coupon) {
      // console.log(coupon)
      this.$store.dispatch('showMessage', {
        title: '确认删除',
        content: `删除后不可恢复且不影响已发放的优惠券使用，确认删除“${coupon.coupon_name}”吗?`,
        isRejectable: 1,
        resolve: () => {
          this.remove(coupon)
        },
      })
    },
    editConfirm (coupon) {
      this.$global.filterData = this.filterData
      this.$global.paginationData = this.paginationData
      this.$router.push({
        name: 'couponCreation',
        query: {
          coupom_id: coupon.coupon_id,
          type: coupon.coupon_type,
        },
      })
    },
    // 删除优惠券
    async remove (coupon) {
      try {
        const {response, result} = await this.deleteCoupon({couponId: coupon.coupon_id})
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '删除成功',
          })
          this.fetchData()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '温馨提示',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '删除失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 改变优惠券展示状态
    async changeCouponShowStatus (coupon) {
      coupon.is_show === 1 ? coupon.is_show = 2 : coupon.is_show = 1
      coupon.is_selecteed = !coupon.is_selecteed
      this.list = this.list.concat([])
      try {
        const {response, result} = await this.displayCoupon({
          couponId: coupon.coupon_id,
          isShow: coupon.is_show,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '修改展示状态成功',
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改展示状态失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '修改展示状态失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 修改优惠券展示状态的提示框
    displayConfirm (coupon) {
      let str = coupon.is_selecteed ? '关闭' : '打开'
      this.$store.dispatch('showMessage', {
        title: `是否需要${str}开关？`,
        content: `1、打开开关后该优惠券将会在门店小程序“领券中心”中领取。<br/>
                  2、若该优惠券已在“营销配置”中使用，再次打开开关该优惠券，同一用户将会重复领取优惠券。`,
        isRejectable: 1,
        resolve: () => {
          this.changeCouponShowStatus(coupon)
        },
      })
    },
  },
  mounted () {
    if (this.$global.paginationData) {
      this.paginationData = this.$global.paginationData
      this.filterData = this.$global.filterData
      this.queryData = this.$global.filterData
    }
    this.fetchData()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'

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
.section-layout
  height calc(100% - 48px)
.list-wrapper
  height calc(100% - 90px) !important
.switch-modal  
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  z-index 10
</style>

