<!--预约核销详情弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card", v-if="need_off_card")
      .modal-header
        .modal-card-title
          span(v-text="confirm_show ? '待核销项目确认' : '核销信息'") 核销信息
        .close-button(@click="modalClose")
        .success.red-tip(v-if="!confirm_show") 您的订单核销已成功！温馨提示您还有养护卡项目待核销！
      .choose-box(v-if="!confirm_show")
        .choose-card
          span(style="line-height: 30px; font-size: 12px") 选择养护卡
          custom-select(placeholder="请选择养护卡", :list="card_list", v-model="card")
        .red-tip.has_num(v-if="!is_self") 您有{{info.has_num}}次待核销机会
      .modal-body(v-if="!confirm_show", style="min-height:200px")
        .record-info(v-if="info.name")
          .service-ticket-wrapper
            .serivce-main-info-wrapper
              .label 名称： {{info.name}}
            .serivce-main-info-wrapper
              .label 卡号： {{info.upkeep_no_new}}
          .service-ticket-wrapper
            .serivce-main-info-wrapper
              .label 价格： {{info.price / 100}}元
            .serivce-main-info-wrapper(v-if="info.from === 2")
              .label 获取： 获赠卡
          .service-ticket-wrapper
            .serivce-main-info-wrapper
              .label 到期时间： {{info.expiry_time}}
        .record-info-list
          .content-wrapper.list-wrapper(v-if="info.item && info.item.length")
            .record-info-title 卡内项目
            .table-wrapper
              table.table
                thead
                  tr
                    td(width="50") 项目名称
                    td(width="90") 项目描述
                    td(width="80") 可用数量
                    td(width="50") 数量
                tbody(v-if="info.item.length")
                  tr(v-for="(cell, index) in info.item" :class="{'bg-d': cell.is_end == 1 && !is_need}" v-if="!(cell.is_end === 1 && info.is_validate_end === 1)")
                    td
                      .simple-td(:title="cell.is_end == 1 ? cell.name + '(终极)' : cell.name")
                        span(v-text="cell.name")
                        span(v-if="cell.is_end == 1") (终极)

                    td
                      .simple-td(v-text="cell.description", :title="cell.description")
                    td
                      .simple-td {{cell.num}}
                    td.content-box(v-if="cell.is_end === 2 || is_need")
                      .btn.left-jian(@click="changeNum('-', index)") -
                      .width-100
                        custom-input(:padding="36", v-model="cell.number", need-type="number", :is-disabled="true")
                      .btn.right-jia(@click="changeNum('+', index)") +
                    td.content-box(v-else) 差{{info.need_num}}次激活项目
        .record-info-list(v-if="info.project && info.project.length")
          .content-wrapper.list-wrapper
            .record-info-title 免激活项目
            .table-wrapper
              table.table
                thead
                  tr
                    td(width="50") 项目名称
                    td(width="90") 项目描述
                    td(width="80") 可用数量
                    td(width="50") 数量
                tbody
                  tr(v-for="(cell, index) in info.project")
                    td
                      .simple-td(:title="cell.name")
                        span(v-text="cell.name")
                    td
                      .simple-td(v-text="cell.description", :title="cell.description")
                    td
                      .simple-td(v-if="cell.num !== -1") {{cell.num}}
                      .simple-td(v-if="cell.num === -1") 无限次
                    td.content-box
                      .btn.left-jian(@click="projectNum('-', index)") -
                      .width-100
                        custom-input(maxlength="2", :padding="36", v-model="cell.number", need-type="number", :is-disabled="true")
                      .btn.right-jia(@click="projectNum('+', index)") +
      .modal-footer(v-if="!confirm_show")
        button.button.large.primary(@click="confirmAgain", :class="{'disabled': isLoading}") 确认核销
        span.cancel-button(@click="modalClose") 取消
      .modal-body(v-if="confirm_show")
        .record-info-list
          .content-wrapper.list-wrapper
            .table-wrapper
              table.table
                thead
                  tr
                    td(width="100") 项目名称
                    td(width="100") 项目描述
                    td(width="100") 核销数量
                tbody
                  tr(v-for="(cell, index) in confirm_list")
                    td
                      .simple-td(v-text="cell.name", :title="cell.name")
                    td
                      .simple-td(v-text="cell.description", :title="cell.description")
                    td
                      .simple-td(v-text="cell.number") 
      .modal-footer(v-if="confirm_show")
        button.button.large.primary(@click="finishCard", :class="{'disabled': isLoading}") 确认核销
        span.cancel-button(@click="showFirst") 取消
    .modal-card(slot="card" v-if="!need_off_card")
      .modal-header
        .modal-card-title 核销信息
        .close-button(@click="modalClose")
      .modal-body(style="height:480px;overflow-y:auto")
        .service-ticket-wrapper
          .serivce-ticket-item
            .serivce-main-info-wrapper
              .label 订单编号
              .content(v-text="tradeOrder.tradeOrderNo")
          .serivce-ticket-item.orderList
            .table-wrapper
              table.table
                thead
                  tr
                    td
                    td(width="150") 商品服务信息
                    td(width="50") 价格
                    td(width="100") 购买数量
                    td(width="110") 可核销数量
                    td(width="150") 核销数量
                tbody
                  tr(v-for="(item, index) in non_write_off_item")
                    td
                      .service-item-detail
                        .item-image
                          img(v-if="item.image_url", :src="scaleImage(item.image_url, 1, 40, 40)")
                    td
                      .good-name {{item.item_title}}
                      .good-name {{item.sku_name}}
                    td
                      .simple-td(v-text="accDiv(item.unit_price,100)")
                    td
                      .simple-td(v-text="item.quantity")
                    td
                      .simple-td(v-text="item.non_write_off_quantity")
                    td.num-box
                      .btn.left-jian(@click="writeOffProjectNum('-', index)") -
                      .width-100
                        custom-input(maxlength="2", :padding="36", v-model="item.number", need-type="number", :is-disabled="true")
                      .btn.right-jia(@click="writeOffProjectNum('+', index)") +
          .serivce-ticket-item
            .label.client 客户信息
            .content
              .multi-content-td.has-image
                .left-image.round
                  img(v-if="userInfo", :src="scaleImage(userInfo.avatar, 1, 36, 36)")
                .label-item(v-text="userInfo.name")
                .content-item()
                  span(v-text="userInfo.mobile")
                  span.content-divider.inline
                  span(v-if="userInfo.license_plate", v-text="userInfo.license_plate")
          .serivce-ticket-item.clearfix(v-if="purchase_type !== 2")
            .box
              span 车辆信息
              custom-select(placeholder="请选择车辆", :list="car_list", nameField="license_plate", v-model="car")
            .box
              span 上次保养里程
              custom-input(v-model="mileage", need-type="number", placeholder="请输入里程", :validator="$v.mileage", error-info="请输入大于0且小于1000000的正整数")
          .service-ticket-wrapper(v-if="write_off_confirm.length")
            .label-text 核销确认
          .serivce-ticket-item.orderList(v-if="write_off_confirm.length")
            .table-wrapper
              table.table
                thead
                  tr
                    td 商品服务信息
                    td 核销数量
                tbody
                  tr(v-for="(item, index) in write_off_confirm")
                    td
                      .service-item-detail
                        .item-image
                          img(v-if="item.image_url", :src="scaleImage(item.image_url, 1, 40, 40)")
                        .simple-td.good-name {{item.item_title}} <br/> {{item.sku_name}}
                    td
                      span {{item.number}}
        .modal-footer
          button.button.large.primary(@click="finishService", :class="{'disabled': isLoading}") 确认核销
          span.cancel-button(@click="modalClose") 取消
</template>

<script>
import ModalDialog from '@/components/generics/ModalDialog'
import modalInteractions from '@/mixins/utilities/modalInteractions'
import workbenchMixin from '@/mixins/modules/workbench'
import imageScale from '@/mixins/utilities/imageScale'
import * as suitableTypes from '@/constants/terms/suitable-types'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Checkbox from '@/components/generics/form/Checkbox'
import { validationMixin } from 'vuelidate'
import MathFun from '@/mixins/utilities/math'

export default {
  name: 'WriteOffModal',
  mixins: [modalInteractions, workbenchMixin, imageScale, validationMixin, MathFun],
  components: {
    ModalDialog,
    CustomInput,
    CustomSelect,
    Checkbox,
  },
  props: {
    serviceItem: Array,
    userInfo: Object,
    tradeOrder: Object,
    purchase_type: Number,
    nonWriteOffItem: Array,
  },
  data () {
    return {
      info: {},
      is_self: true, // 是否为门店自建卡
      is_all_select: false, // 是否全选
      is_need: false,
      detail: {},
      need_off_card: false,
      suitableTypes,
      isLoading: false,
      mileage: '',
      car_list: null,
      card_list: [],
      card: {},
      car: {
        license_plate: '',
        vehicle_id: '',
      },
      confirm_show: false,
      confirm_list: [],
      non_write_off_item: this.nonWriteOffItem, // 订单核销项目信息数据
      write_off_confirm: [], // 核销确认数据
    }
  },
  watch: {
    'card' () {
      if (this.card && this.card.name) this.getCardDetail()
    },
  },
  methods: {
    confirmAgain () {
      let arr = []
      let arr1 = []
      arr = (this.info.project && this.info.project.length) ? this.info.project.filter(cell => cell.number > 0) : []
      arr1 = this.info.item.filter(cell => cell.number > 0)
      this.confirm_list = [...arr, ...arr1]
      if (this.confirm_list.length === 0) {
        return
      }
      this.confirm_show = true
    },
    showFirst () {
      this.confirm_show = false
    },
    async finishCard () {
      let params = {}
      params.upkeep_no = this.info.upkeep_no
      let arr = []
      this.info.project.forEach(item => {
        arr.push({
          id: item.use_id,
          num: item.number,
        })
      })
      params.item = arr
      let brr = []
      this.info.item.forEach(item => {
        brr.push({
          id: item.use_id,
          num: item.number,
        })
      })
      params.item_use = brr
      try {
        const { response, result } = await this.getCardManagementConfirmApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '核销成功',
              resolve: () => {
                this.modalClose()
                this.$emit('success')
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '核销失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '核销失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '核销失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    /*
    * 核销商品改变数量
    * type 加减类型
    * index 下标
    * */
    writeOffProjectNum (type, index) {
      let arr = JSON.parse(JSON.stringify(this.non_write_off_item))
      if (type === '-') {
        if (arr[index].number > 0) {
          arr[index].number--
        } else {
          arr[index].number = 0
        }
      } else {
        let flag = arr[index].non_write_off_quantity - arr[index].number === 0
        if (flag) {
          return false
        } else {
          arr[index].number++
          if (arr[index].number > 99) {
            arr[index].number = 99
          }
        }
      }
      this.non_write_off_item = arr
      this.write_off_confirm = []
      this.non_write_off_item.filter(item => {
        if (item.number > 0) {
          this.write_off_confirm.push(item)
        }
      })
    },
    /*
    * 改变数量
    * type 加减类型
    * index 下标
    * */
    projectNum (type, index) {
      let arr = this.info.project
      this.info.project = []
      if (type === '-') {
        if (arr[index].number > 0) {
          arr[index].number--
        } else {
          arr[index].number = 0
        }
      } else {
        if (arr[index].num !== -1) {
          if (arr[index].number < arr[index].num) {
            arr[index].number++
          } else {
            arr[index].number = arr[index].num
          }
        }
        if (arr[index].num === -1) {
          if (arr[index].number < 99) {
            arr[index].number++
          } else {
            arr[index].number = 99
          }
        }
      }
      this.info.project = arr
    },
    /*
    * 改变数量
    * type 加减类型
    * index 下标
    * */
    changeNum (type, index) {
      let arr = this.info.item
      if (type === '-') {
        if (arr[index].number > 0) {
          console.log('减', index)
          arr[index].number--
          if (arr[index].is_end === 1) return
          // 减核销次数和需要次数
          this.info.has_num++
          this.info.need_num++
          // 判断是否激活最终项目
          if (this.info.need_num > 0) {
            this.is_need = false
            if (arr[arr.length - 1].is_end === 1) arr[arr.length - 1].number = 0
          }
        } else {
          arr[index].number = 0
        }
      } else {
        // 可用次数小于核销次数
        if (arr[index].number < arr[index].num) {
          // 如果没次数了且不是最终项目直接return
          if (this.info.has_num === 0 && arr[index].is_end === 2) return
          arr[index].number++
          if (arr[index].is_end === 1) return
          // 减核销次数和需要次数
          this.info.has_num--
          this.info.need_num--
          // 判断是否激活最终项目
          if (this.info.need_num <= 0) {
            this.is_need = true
            // 需求改变, 最终项目不用自动加上数量
            // if (arr[arr.length - 1].is_end === 1) arr[arr.length - 1].number = 1
          }
        } else {
          arr[index].number = arr[index].num
        }
      }
      this.info.item = []
      this.info.item = arr
    },
    // getCardDetail获取卡详情
    async getCardDetail () {
      try {
        const { response, result } = await this.getCardManagementInfoApi({
          upkeep_no: this.card.upkeep_no,
        })
        if (response.status === 200) {
          if (result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '查询失败',
              content: `${result.message}`,
            })
          } else {
            result.data.upkeep_no_new = result.data.upkeep_no.substring(0, result.data.upkeep_no.length - 4) + '****'
            result.data.item.forEach(ele => {
              if (result.data.type === 1) {
                ele.is_select = false
                ele.number = 0
              } else {
                ele.number = 0
              }
            })
            result.data.item_use.forEach(ele => {
              ele.number = 0
            })
            let arr = result.data.item_use
            result.data.item_use = arr.sort((n, m) => {
              return m.is_end - n.is_end
            })
            if (result.data.type === 1) {
              this.is_self = false
              result.data.project = result.data.item
              result.data.item = result.data.item_use
              result.data.has_num = result.data.surplus
              result.data.need_num = result.data.count_num - result.data.num
            } else {
              result.data.project = result.data.item
              result.data.item = result.data.item_use
              this.is_self = true
            }
            result.data.expiry_time = this.changeDateTime(result.data.expiry_time)
            this.info = result.data
            // 壳牌卡核销
            if (this.info.need_num === 0 && result.data.type === 1) {
              this.is_need = true
              if (this.info.is_validate_end === 2 && this.info.item[this.info.item.length - 1].is_end === 1) {
                let arr = this.info.item
                // 需求改变, 最终项目不用自动加上数量
                // arr[arr.length - 1].number = 1
                this.info.item = []
                this.info.item = arr
              }
            } else {
              this.is_need = false
            }
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '查询失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '查询失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 核销操作
    async finishService () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      if (!this.write_off_confirm.length) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '警告',
          content: '请选择核销项目',
        })
        return
      }
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      let writeOffItem = []
      this.write_off_confirm.forEach(item => {
        writeOffItem.push(
          {
            trade_order_item_id: item.trade_order_item_id,
            write_off_count: item.number,
          }
        )
      })
      try {
        const { response, result } = await this.workbenchCheck({
          write_off_code: this.tradeOrder.writeOffCode,
          vehicle_id: this.car.vehicle_id,
          write_off_item: writeOffItem,
          mileage: this.mileage,
        })
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '核销失败',
              content: `${result.message}`,
            })
            this.isLoading = false
            return false
          }
          if (this.purchase_type === 2) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '核销成功',
              resolve: () => {
                this.modalClose()
                this.$emit('success')
              },
            })
            return false
          }
          if (this.card_list.length > 0) {
            this.need_off_card = true
            this.isLoading = false
            return false
          }
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '核销成功',
            resolve: () => {
              this.modalClose()
              this.$emit('success')
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '核销失败',
            content: `出错啦！错误码：${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '核销服务失败',
          content: `出错啦！错误码：${err}`,
        })
      }
      this.isLoading = false
    },
    // 获取用户车辆列表 getCustomerCarApi
    async fetchCarList () {
      try {
        const { response, result } = await this.getCustomerCarApi({
          customer_id: this.userInfo.customer_id,
          purchase_type: this.purchase_type,
        })
        if (response.status === 200 && result.code === 0) {
          this.car_list = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取用户车辆列表失败',
            content: `出错啦！错误码：${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取用户车辆列表失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    async getCustomerCard () {
      try {
        const { response, result } = await this.customerCardListApi({
          customer_id: this.userInfo.customer_id,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(item => {
            item.name = item.name + '(' + item.upkeep_no.substring(0, item.upkeep_no.length - 4) + '****)'
          })
          this.card_list = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取用户养护卡列表失败',
            content: `出错啦！错误码：${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取用户养护卡列表失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    /**
     * 时间戳转年月日
     * @val  时间戳
     */
    changeDateTime (val, type) {
      if (!val) {
        return ''
      }
      let date = new Date(val * 1000)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = this.judgeTime(date.getDate()) + ' '
      let h = this.judgeTime(date.getHours()) + ':'
      let m = this.judgeTime(date.getMinutes())
      if (type === 'data') {
        return Y + M + D
      } else if (type === 'datetime') {
        return Y + M + D + h + m
      } else {
        return Y + M + D + h + m
      }
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
  validations: {
    mileage: {
      validate (val) {
        if (val === '') { return true }
        // let status  = /^[1-9]\d*$|^[+]{0,1}(\d+\.\d+)$/.test(val)
        // if (!status)
        // return /^[1-9]\d*$|^[+]{0,1}(\d+\.\d+)$/.test(val)
        return val < 1000000
      },
    },
  },
  async mounted () {
    if (this.purchase_type !== 2) {
      await this.getCustomerCard()
      this.fetchCarList()
    }
    console.log(this.non_write_off_item)
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins.styl'
.simple-td
  width 200px
.red-tip
  color red
  font-size 13px
  line-height 50px
.tip-item
  position relative
  min-height 64px
  &::before
    content ''
    display inline-block
    vertical-align top
    margin-right 15px
    width 16px
    height 16px
    background center no-repeat url('~@/assets/icons/info-yellow.svg')
.orderList
  padding-top 0px
  padding-bottom 10px
  overflow-y auto
  max-height 215px
  .service-item-detail
    line-height 40px
    height 40px
  .content
    border-bottom 1px solid #f0f0f0
    padding 5px 0
    .price-info
      line-height 40px
      border-left none
  .content:last-child
    border-bottom none
  .titless
    line-height 16px
.box
  width 200px
  float left
  margin-left 20px
.simple-td
  max-width 115px !important
.bg-d
  background #ddd
.content-box
  width 200px
  text-align center
.num-box
  width 150px
  text-align center
.width-100
  width 100%
  .input
    padding 7px 36px
.btn
  width 32px
  font-size 13px
  text-align center
  height 30px
  line-height 30px
  background #fdfdfd
  color #999
  padding 0 8px
  color #999
  cursor pointer
.left-jian
  position absolute
  z-index 9999
  top 3px
  left 14px
  border-right 1px solid #c2c2c2
.right-jia
  position absolute
  z-index 9999
  top 3px
  right 2px
  border-left 1px solid #c2c2c2
.red-tip
  color red
  font-size 13px
  padding-left 30px
.service-ticket-wrapper
  line-height 40px
  padding 0 10px
.serivce-main-info-wrapper
  width 270px
  margin-bottom 0
.serivce-main-info-wrapper::before
  border none
.serivce-main-info-wrapper .label
  font-size 14px
.tip-item
  position relative
  min-height 64px
  &::before
    content ''
    display inline-block
    vertical-align top
    margin-right 15px
    width 16px
    height 16px
    background center no-repeat url('~@/assets/icons/info-yellow.svg')
.orderList
  padding-top 0px
  padding-bottom 10px
  overflow-y auto
  max-height 215px
  .service-item-detail
    line-height 40px
    height 40px
  .content
    border-bottom 1px solid #f0f0f0
    padding 5px 0
    .price-info
      line-height 40px
      border-left none
  .content:last-child
    border-bottom none
.table-wrapper td
  padding 0 0 0 13px !important
.record-info
  border-bottom 1px solid #eeeeee
  padding-bottom 10px
.content-wrapper
  margin 15px 26px 0
.modal-body
  max-height 300px
  overflow-y scroll
.choose-box
  display flex
  justify-content start
  padding 15px 30px
  .choose-card
    width 300px
.good-name
  width 130px
  line-height 18px
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
.service-item-detail .simple-td.good-name
  padding-top 2px
  max-width 300px !important
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
.label-text
  font-size 14px
  color #999
</style>
