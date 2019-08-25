<template lang="pug">
  .section-layout
    slide-out-modal(v-if="car_modal", @input="closeCarModal")
      customer-car(:customerId="customerId", :vehicleId="vehicle_id", @success="saveCarSuccess")
    slide-out-modal(v-if="slide_visible", @input="toggleSidePannel")
      client-car-modal(:id="vehicle_id")
    slide-out-modal(v-if="show_card_detail" @input="cardModalCk")
      card-detail-modal(:id="user_card_id" :upkeep="upkeep_no" v-on:cardSuccess="showCardProject")
    .content-wrapper
      .columns.is-flex-grow.is-horizontal.space-between
        .column.width-fixed
          .nav-back-btn(@click="navBack")
          .side-info-pannel
            .customer-basic-info-wrapper
              .basic-info
                .avatar
                  img(v-if="detail.avatar", :src="scaleImage(detail.avatar, 1, 80, 80)")
                  img(v-if="!detail.avatar", src="../../assets/user-avatar.png")
                .real-name(v-text="detail.name")
                .mobile(v-text="detail.mobile")
              .purchase-info
                .purchase-info-item
                  .count
                    span.yuan ￥
                    span(v-text="detail && detail.consume_amount ? detail.consume_amount : '0.00'")
                  .label 累计消费金额
                .purchase-info-item
                  .count(v-text="detail && detail.consume_nums ? detail.consume_nums : '0'")
                  .label 累计消费次数
            .customer-vehicle-info
              .title
                span 车辆信息
                .addBtn(@click="openCarModal")
              .vehicle-info-detail
                .empty-tip(v-if="!carList.length") 尚未添加车辆信息
                template(v-for="(car,index) in carList", v-if="carList.length")
                  .vehicle-info-section.car-logo
                    .logo(@click="toggleCarInfo(car,index)")
                      img(:src="scaleImage(car.logo, 1, 40, 40)")
                    .license {{car.license_plate}}
                      span.default-car(v-if="car.is_default==1") 默认车辆
                    .vehicle-model(v-if="car.carpart_brand_id >= 0", :title="vehicleTypeName(car)", v-text="vehicleTypeName(car)")
                    .vehicle-model(v-if="car.brand_name == ''") --
                    .comment(v-if="car.comment", v-text="car.comment")
                    a.car-mileage(@click="changeMRModel(car)") 里程记录
                    .car-action
                      a.car-edit(@click="openCarModal(car)") 编辑
                      a.car-del(@click="deleteCarDialog(car,index)",v-if="car.is_default!=1") 删除
            .remark-box 
              .title  备注
              el-input(type="textarea", placeholder="请输入备注", rows="4" v-model="custom_remark", maxlength="50", :show-word-limit="true")
              button.button.primary(@click="saveRemark") 保存备注 
        .column
          .main-info-pannel
            feature-tabs(v-model="currentTab", :tabs="tabs", @input="getTab")
            empty-page(v-if="!(currentTab.list && currentTab.list.length) && isInitiated", is-white=true, :tip="'当前没有' + currentTab.title")
            .content-wrapper.list-wrapper(v-if="currentTab.list && currentTab.list.length")
              .table-wrapper
                table.table.embedded
                  thead
                    tr(v-if="currentTab.id === 'ORDER'")
                      td(width="140") 订单号
                      td(width="110") 商品种类
                      td(width="110") 订单类型
                      td(width="90") 订单金额
                      td(width="130") 下单时间
                      td(width="90") 订单状态
                      td(width="80") 操作
                    tr(v-if="currentTab.id === 'CHECK'")
                      td(width="140") 检测时间
                      td(width="80") 车牌号
                      td(width="200") 品牌车型
                      td(width="45") 正常点
                      td(width="45") 异常点
                      td(width="45") 需关注
                      td(width="45") 未检测
                      td(width="120") 检测门店
                      td(width="50") 操作
                    tr(v-if="currentTab.id === 'CARD'")
                      td(width="80") 名称
                      td(width="80") 卡号
                      td(width="60") 分类
                      td(width="60") 使用次数
                      td(width="60") 分享次数
                      td(width="60") 剩余次数
                      td(width="80") 到期时间
                      td(width="60") 价格
                      td(width="60") 来源
                      td(width="60") 状态
                      td(width="80") 操作
                  tbody
                    tr(v-for="order in currentTab.list",v-if="currentTab.id === 'ORDER'")
                      td
                        .multi-content-td
                          .content-item(v-text="order.trade_order_no")
                          .content-item
                            span.bottom-image(v-for="img in order.item")
                              img(v-if="img", :src="scaleImage(img, 1, 36, 36)")
                      td
                        .simple-td.title-item(v-text="order.item_num")
                      td
                        .simple-td(v-if="order.goods_type === 0") 全部
                        .simple-td(v-if="order.goods_type === 1 && order.order_type <= 4") 商品服务订单
                        .simple-td(v-if="order.goods_type === 2 && order.order_type <= 4") 养护卡订单
                        .simple-td(v-if="order.order_type === 7 || order.order_type === 6") 线下买单订单
                      td
                        .simple-td.title-item(v-text="'¥ ' + accDiv(order.final_amount,100)")
                      td
                        .simple-td.fix-width(v-text="formatTimeStamp(order.created_at)")
                      td
                        .simple-td
                          .status-dot(:class="{'primary': (order.status == '2' && (!order.reserve || order.reserve.status != '2')), 'green': order.status == '3', 'blue': (order.status == '2' && order.reserve && order.reserve.status == '2'), 'grey': order.status == '4', 'red': order.status == '1'}")
                          span(v-if="order.status == '1'") 待付款
                          span(v-if="order.status == '2' && (!order.reserve || order.reserve.status != '2')") 待核销
                          span(v-if="order.status == '3'") 已完成
                          span(v-if="order.status == '4'") 已关闭
                          span(v-if="order.status == '2' && order.reserve &&  order.reserve.status == '2'&& order.reserve.reserve_status == '0'") 已预约
                          span(v-if="order.status == '2' && order.reserve &&  order.reserve.status == '2'&& order.reserve.reserve_status == '1'") 已过期
                      td
                        .operation-td
                          a.operation-link(@click="viewOrder(order)") 查看
                    tr(v-for="vehicle in currentTab.list", v-if="currentTab.id === 'CHECK'")
                      td
                        .simple-td(v-text="changeDateTime(vehicle.inspect_time)")
                      td
                        .simple-td {{vehicle.license_plate}}
                      td
                        .simple-td {{vehicle.vehicle_name}}
                      td
                        .simple-td {{vehicle.normal}}
                      td
                        .simple-td {{vehicle.exception}}
                      td
                        .simple-td {{vehicle.pending}}
                      td
                        .simple-td {{vehicle.noninspect}}
                      td
                        .simple-td {{vehicle.store_name}}
                      td
                        .operation-td
                          a.operation-link(@click="vehicleDetail(vehicle.id)") 详情
                    tr(v-for="card in currentTab.list", v-if="currentTab.id === 'CARD'")
                      td
                        .simple-td {{card.name}}
                      td
                        .simple-td {{card.upkeep_no_number}}****
                      td
                        .multi-content-td {{card.category_name}}
                      td
                        .simple-td {{card.num}}
                      td
                        .simple-td(v-text="card.type == 2 ? card.share : '--'") --
                      td
                        .simple-td(v-if="card.type == 1") {{card.surplus}}
                        .simple-td(v-if="card.type == 2") --
                      td
                        .simple-td.fix-width {{card.end_time | date('yyyy-MM-dd','cn')}}
                      td
                        .simple-td ￥{{card.price / 100}}
                      td
                        .simple-td(v-if="card.from==1") 购买
                        .simple-td(v-if="card.from==2") 赠送
                      td
                        .simple-td(v-if="card.status==1") 可使用
                        .simple-td(v-if="card.status==2") 待核销
                        .simple-td(v-if="card.status==3") 已过期
                        .simple-td(v-if="card.status==4") 已用完
                      td
                        .operation-td
                          a.operation-link(@click="cardDetail(card.id, card.upkeep_no_number)") 查看
                          a.operation-link(@click="cardRecord(card.upkeep_no)") 核销记录
                          a.operation-link(@click="cardShareRecord(card.id)", v-if="card.type == 2") 分享记录
              .tfoot
                pagination(v-if="currentTab", :pagination-data="currentTab.paginationData", @input="paging")
    card-project-modal(v-model="show_card_project" v-if="show_card_project", :id="card_id")
    card-record-modal(v-model="show_card_record" v-if="show_card_record", :id="upkeep_no")
    card-share-record-modal(v-model="show_card_share_record" v-if="show_card_share_record", :id="upkeep_no_id")
    mileage-record(v-model="show_mileage_record" v-if="show_mileage_record" :vehicleId="vehicle_id")
</template>

<script>
import { mapGetters } from 'vuex'
import FeatureTabs from '@/components/generics/FeatureTabs'
import SlideOutModal from '@/components/generics/SlideOutModal'
import Pagination from '@/components/generics/Pagination'
import clientMixin from '@/mixins/modules/customer'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import ClientCarModal from '@/components/customer/ClientCarModal'
import CardDetailModal from '@/components/customer/CardDetailModal'
import CardProjectModal from '@/components/customer/CardProjectModal'
import CardRecordModal from '@/components/customer/CardRecordModal'
import CardShareRecordModal from '@/components/customer/modal/CardShareRecordModal'
import FormateDate from '@/mixins/utilities/formateDate'
import CustomerCar from '@/components/customer/modal/CustomerCar'
import MileageRecord from '@/components/customer/modal/MileageRecord'
import MathFun from '@/mixins/utilities/math'
var enterPath = ''

export default {
  name: 'CustomerDetail',
  mixins: [clientMixin, filterTools, imageScale, FormateDate, MathFun],
  components: {
    FeatureTabs,
    SlideOutModal,
    Pagination,
    EmptyPage,
    ClientCarModal,
    CardDetailModal,
    CardProjectModal,
    CardRecordModal,
    CustomerCar,
    MileageRecord,
    CardShareRecordModal,
  },
  data () {
    const tabs = [{
      title: '消费记录',
      id: 'ORDER',
      list: [],
      paginationData: {
        current_page: 1,
        last_page: 1,
        total: 1,
        per_page: 20,
      },
    },
    {
      title: '车检报告',
      id: 'CHECK',
      list: [],
      paginationData: {
        current_page: 1,
        last_page: 1,
        total: 1,
        per_page: 20,
      },
    },
    {
      title: '养护卡',
      id: 'CARD',
      list: [],
      paginationData: {
        current_page: 1,
        last_page: 1,
        total: 1,
        per_page: 20,
      },
    },
    ]
    return {
      vehicle_id: '', // 车辆id
      car_modal: false, // 控制添加编辑车辆弹框
      slide_visible: false,
      isInitiated: false,
      enterPath: enterPath,
      customerId: null,
      detail: {}, // 客户信息
      carList: [], // 客户车辆
      tabs: tabs, // tabs
      currentTab: tabs[0], // 当前 tab
      show_card_detail: false, // 控制养护卡详情模态框变量
      card_id: null,  // 养护卡id
      user_card_id: null,
      upkeep_no: null,
      show_card_project: false, // 控制养护卡卡内项目变量
      show_card_record: false,  // 控制是否限制使用记录变量
      show_card_share_record: false,
      show_mileage_record: false,  // 里程记录模态框状态
      card_type: 1,
      upkeep_no_id: null,
      custom_remark: '',
    }
  },
  computed: {
    ...mapGetters({
      currentEnterprise: 'currentEnterprise',
    }),
  },
  methods: {
    saveCarSuccess () {
      this.closeCarModal()
      this.fetchDetail()
    },
    // 模态框状态切换
    changeMRModel (car) {
      this.vehicle_id = car.vehicle_id
      this.show_mileage_record = !this.show_mileage_record
    },
    // 关闭添加编辑弹框
    closeCarModal () {
      this.car_modal = false
    },
    // 打开添加编辑弹框
    openCarModal (car) {
      this.vehicle_id = car.vehicle_id || ''
      this.car_modal = true
    },
    // 获取客户信息
    async fetchDetail () {
      let self = this
      try {
        const { response, result } = await this.fetchCustomerDetail(this.customerId)
        if (response.status === 200) {
          console.log(result.data.consume_amount)
          if (result.data.consume_amount) {
            // 如果有result.data.consume_amount值，则除100，不判断执行accDiv方法会报错
            result.data.consume_amount = self.accDiv(result.data.consume_amount, 100).toFixed(2)
          }
          this.detail = result.data
          this.carList = result.data.vehicle
          this.custom_remark = result.data.remarks
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取客户详情失败',
            content: `出错啦！${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取客户详情失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 保存备注
    async saveRemark () {
      try {
        let {result, response} = await this.setCustomerRemarkApi({customer_id: this.customerId, remarks: this.custom_remark})
        console.log(result, response)
        if (result.code === 0) {
          this.$store.dispatch('showMessage', {
            type: 'success',
            title: '修改客户备注成功！',
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改客户备注失败',
            content: `出错啦！${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '修改客户备注失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    deleteCarDialog (car, index) {
      this.$store.dispatch('showMessage', {
        title: '删除提示',
        content: '确认删除该车辆？',
        isRejectable: 1,
        resolve: () => {
          this.deleteCar(car.vehicle_id, index)
        },
      })
    },
    // 删除车辆
    async deleteCar (vehicleId, index) {
      try {
        const { response, result } = await this.deleteCarApi({
          vehicle_id: vehicleId,
          customer_id: this.customerId,
        })
        if (response.status === 200 && result.code === 0) {
          this.carList.splice(index, 1)
        } else {
          throw new Error(result.message)
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '删除车辆失败',
          content: `出错啦！错误信息：${err}`,
        })
      }
      this.isInitiated = true
    },
    // 返回列表
    navBack () {
      this.$router.push({
        name: 'customerList',
      })
    },
    // 车型信息格式化
    vehicleTypeName (vehicle) {
      return `${vehicle.brand_name} ${vehicle.model_name} ${vehicle.series_name ? vehicle.series_name + '-' : ''} ${vehicle.product_year ? vehicle.product_year + '款' : ''} ${vehicle.vehicle_name}`
    },
    // 获取消费记录列表
    async fetchOrders () {
      try {
        const { response, result } = await this.fetchCustomerConsume({
          customer_id: this.customerId,
          page: this.currentTab.paginationData.current_page,
          per_page: this.currentTab.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.currentTab.list = result.data
          this.currentTab.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取客户消费记录失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取客户消费记录失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 获取车检记录列表
    async fetchVehicle () {
      try {
        const { response, result } = await this.fetchInspectListApi({
          customer_id: this.customerId,
          page: this.currentTab.paginationData.current_page,
          per_page: this.currentTab.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.currentTab.list = result.data
          this.currentTab.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取客户车检记录失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取客户车检记录失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 分页
    paging (state) {
      this.currentTab.paginationData = state
      if (this.currentTab.id === 'ORDER') {
        this.fetchOrders()
      } else if (this.currentTab.id === 'CHECK') {
        this.fetchVehicle()
      } else if (this.currentTab.id === 'CARD') {
        this.fetchCardList()
      }
    },
    // 查看订单
    viewOrder (order) {
      // 记录列表页数
      this.$store.dispatch('setCurrentPageStorage', this.tabs[0].paginationData.current_page)
      this.$router.push({
        name: 'orderDetail',
        params: {
          id: order.trade_order_id,
        },
      })
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
    // 格式化时间
    formatTimeStamp (dateStr) {
      return dateStr.slice(0, 16)
    },
    // 格式化生日
    formatBirthday (date) {
      return date.slice(0, 10)
    },
    getTab (data) {
      this.currentTab = data
      if (data.id === 'ORDERS') this.fetchOrders()
      if (data.id === 'CHECK') this.fetchVehicle()
      if (data.id === 'CARD') this.fetchCardList()
    },
    // 车检详情
    vehicleDetail (id) {
      this.vehicle_id = id
      this.toggleSidePannel()
    },
    toggleSidePannel () {
      this.slide_visible = !this.slide_visible
    },
    // 控制卡片详情展示fn
    cardModalCk (params) {
      this.show_card_detail = !this.show_card_detail
    },
    // 打开卡片详情
    cardDetail (params, upkeep) {
      this.user_card_id = params
      this.upkeep_no = upkeep
      this.cardModalCk()
    },
    /**
     * 显示养护卡卡内项目Fn
     * params {String} 养护卡ID
     */
    showCardProject (params) {
      // this.cardModalCk()
      this.card_id = params
      this.show_card_project = true
    },
    // 查看使用记录
    cardRecord (params) {
      this.upkeep_no = params
      this.show_card_record = true
    },
    cardShareRecord (params) {
      this.upkeep_no_id = params
      this.show_card_share_record = true
    },
    /**
     * 客户的养护卡
     * params {string} 客户id
     */
    async fetchCardList (params) {
      try {
        const { response, result } = await this.fetchCardListApi({
          customer_id: this.customerId,
          page: this.currentTab.paginationData.current_page,
          per_page: this.currentTab.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(item => {
            item.upkeep_no_number = item.upkeep_no.substring(0, item.upkeep_no.length - 4)
          })
          this.currentTab.list = result.data
          this.currentTab.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取养护卡失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
  },
  mounted () {
    this.customerId = this.$route.query.customerId
    this.fetchDetail() // 获取客户信息
    this.fetchOrders() // 获取消费记录列表0
  },
  created () {
    // 如果从客户列表进入，存储客户列表页数并清空当前页数记录
    if (this.enterPath === 'customerList') {
      this.$store.dispatch('setLastPageStorage', this.$store.state.list.currentPageStorage)
      this.$store.dispatch('setCurrentPageStorage', 0)
    }
    // 设置列表历史页数记录并重置
    this.$set(this.tabs[0].paginationData, 'current_page', this.$store.state.list.currentPageStorage)
  },
  // 路由拦截 判断进入路由
  beforeRouteEnter (to, from, next) {
    enterPath = from.name
    next()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.simple-td
  max-width 110px
.fix-width
  max-width 100%
// side pannel
td,.multi-content-td
  vertical-align: middle
.side-info-pannel {
  position: relative;
  height: 100%;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: borderRadiusLarge;
  overflow-y: auto;
}

.nav-back-btn {
  position: absolute;
  top: 36px;
  left: -16px;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: #CED3DC center no-repeat url('~@/assets/back.svg');
  background-size: 16px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
  cursor: pointer;
  z-index: 2;
}

.customer-basic-info-wrapper {
  position: relative;

  .edit {
    float: right;
  }

  .extra-info {
    float: none;
  }
}

.basic-info {
  clear: both;
  padding-bottom: 20px;
  text-align: center;
  color: darker;
  border-bottom: 1px solid line;

  .avatar {
    display: block;
    margin: 0 auto 8px;
    width: 80px;
    height: 80px;
    border-radius: 100%;
    overflow: hidden;
    background-color: lightGrey;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .real-name {
    font-size: 18px;
    line-height: 24px;
  }

  .mobile {
    font-size: 14px;
    line-height: 16px;
  }
}

.purchase-info {
  text-align: center;
  border-bottom: 1px solid line;
  overflow: hidden;

  .purchase-info-item {
    float: left;
    width: 50%;
    position: relative;
    padding: 15px 0;

    &:first-child::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: block;
      height: 36px;
      border-left: 1px solid line;
    }
  }

  .count {
    font-size: 18px;
    line-height: 24px;
  }

  .yuan, .label {
    font-size: 12px;
    line-height: 24px;
    color: #929599;
  }

  .label {
    line-height: 16px;
  }
}

.extra-info {
  padding: 24px 0;
  border-bottom: 1px solid line;
  color: darker;
  font-size: 13px;
  line-height: 24px;

  .extra-info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .user-comment {
    font-size: 12px;
    line-height: 18px;
    color: lightGrey;
  }
}

.customer-vehicle-info {
  padding-top: 32px;
  font-size: 14px;
  color: darker;

  .title {
    line-height: 24px;
  }

  .addBtn {
    float: right;
    margin-top: 2px;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    background: #ddd center no-repeat url('~@/assets/plus-s.svg');
    background-size: 10px;
    cursor: pointer;
    background-color: primary;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08);
  }

  .edit-btn {
    float: right;
  }
}

.vehicle-info-detail {
  margin-top: 8px;

  .empty-tip {
    font-size: 12px;
    line-height: 16px;
    color: lightGrey;
  }

  .vehicle-info-section {
    position: relative;
    padding: 16px 0 8px;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    &:last-of-type::after {
      display: none;
    }

    .logo {
      position: absolute;
      top: 16px;
      left: 0;
      width: 40px;
      height: 40px;
      background-color: #fafafa;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .license {
      font-size: 14px;
      line-height: 20px;
      color: darker;
      .default-car {
        padding 2px 4px
        margin-left 4px
        vertical-align top
        border-radius 3px
        font-size 10px
        background #ffc723
        color white
      }
    }

    .vehicle-model {
      max-width: 160px;
      margin: 2px 0 8px;
      font-size: 12px;
      line-height: 16px;
      color: lightGrey;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .comment {
      margin-bottom: 8px;
      font-size: 12px;
      line-height: 16px;
      color: lightGrey;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
      line-height: 24px;
      color: darker;

      .info-content {
        text-align: right;
      }

      .tip-info {
        font-size: 12px;
        line-height: 16px;
        color: lightGrey;
      }
    }
  }

  .car-logo {
    padding-left: 48px;
    padding-right: 60px;

    &::after {
      border: none;
    }

    .car-edit, .car-mileage {
      position: absolute;
      right: 10px;
      margin-top: -20px;
      line-height: 15px;
      color: #2FABDD;
      font-size: 13px;
      cursor: pointer;
    }
    .car-edit {
      bottom: 15px;
      right: 44px;
    }
    .car-mileage {
      right: 18px;
      top: 35px;
    }
    .car-del {
      position: absolute;
      right: 10px;
      bottom: 15px;
      margin-top: -20px;
      line-height: 15px;
      color: rgba(235,78,56,1);
      font-size: 13px;
      cursor: pointer;
    }
  }

  .car-logo:hover {
    .car-edit {
      display: block;
    }
  }
}

// main pannel
.main-info-pannel {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  border-radius: borderRadiusLarge;
  overflow-y: auto;
}

.list-wrapper {
  margin: 0;
  padding: 0 24px 36px;
}

.title-item {
  padding-right: 12px;
}

.bottom-image {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;

  img {
    height: 100%;
    width: 100%;
  }
}

td {
  vertical-align: middle;
}
.remark-box{
  text-align: right;
  .title{
    text-align: left;
    line-height: 26px;
    font-size: 14px;
  }

  button{
    margin-top: 10px;
  }
}
</style>

