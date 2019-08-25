<template lang="pug">
  .div
    .workbenck-operation-pannel(v-if="string == '优惠券核销'")
      .label.service 优惠券核销
      .auto-complete-input
        .select 核销码
        input.input(v-model="queryStr", @keyup="autocomlete(1)", @keyup.enter="search1")
      button.button.large.primary(@click="search1") 查询
      card-off-modal(v-if="modalShow", :cardInfo="cardInfo", :checkCode="queryStr", @input="toggleWriteOffModal", @success="handleModal")
    .workbenck-operation-pannel(v-if="string == '预约核销'")
      .label.service 预约核销
      .auto-complete-input
        .select 核销码
        input.input(v-model="queryStr", @keyup="autocomlete", @keyup.enter="search")
      button.button.large.primary(@click="search") 查询
      write-off-modal(v-if="modalShow", :service-item="serviceItem", :user-info="userInfo", :purchase_type="purchase_type", :trade-order="tradeOrder", @input="toggleWriteOffModal", @success="handleModal")
    .workbenck-operation-pannel(v-if="string == '团购核销'")
      .label.service 团购核销
      .auto-complete-input
        .select 核销码
        input.input(v-model="queryStr", @keyup="autocomlete(2)", @keyup.enter="search2")
      button.button.large.primary(@click="search2") 查询
      write-off-modal-group(v-if="modalShow", :order-info="group_info",  @input="toggleWriteOffModal", @success="handleModal")
    .workbenck-operation-pannel(v-if="string == '卡核销'")
      .label.service 卡核销
      .auto-complete-input
        .select 卡号
        input.input.card-input(placeholder="请输入卡号",v-model="queryStr", @keyup.enter="search3")
      button.button.large.primary(@click="search3") 查询
      card-management-modal(v-if="modalShow && !is_self",  @input="toggleWriteOffModal",:info="group_info", @success="handleModal")
      card-self-modal(v-if="modalShow  && is_self", @input="toggleWriteOffModal",:info="group_info", @success="handleModal")
</template>

<script>
import CardSelfModal from '@/components/workbench/model/CardSelfModal'
import CardManagementModal from '@/components/workbench/model/CardManagementModal'
import WriteOffModalGroup from '@/components/workbench/model/WriteOffModalGroup'
import WriteOffModal from '@/components/workbench/model/WriteOffModal'
import CardOffModal from '@/components/workbench/model/CardOffModal'
import workbenchMixin from '@/mixins/modules/workbench'

export default {
  name: 'ReservationWriteOff',
  mixins: [workbenchMixin],
  components: {
    WriteOffModalGroup,
    WriteOffModal,
    CardOffModal,
    CardManagementModal,
    CardSelfModal,
  },
  props: {
    string: '',
  },
  data () {
    return {
      queryStr: '',
      // modal
      modalShow: false,
      userInfo: null,
      serviceItem: null,
      group_info: null,
      tradeOrder: null,
      cardInfo: null,
      is_self: false,
      purchase_type: 0,   // 订单来源：1 门店，2 平台， 3 第三方
    }
  },
  methods: {
    // 自动查询
    autocomlete (type) {
      if (this.queryStr.length !== 6 && type !== 3) {
        return
      } else if (type === 3 && this.queryStr.length !== 8) {
        return
      }
      switch (type) {
        case 1:
          this.search1()
          break
        case 2:
          this.search2()
          break
        case 3:
          this.search3()
          break
        default:
          this.search()
      }
    },
    // 优惠券核销详情(优惠券核销搜索)
    async search1 () {
      // this.modalShow = true
      if (!this.queryStr) {
        return
      }
      try {
        const {response, result} = await this.searchCord(this.queryStr)
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '查询失败',
              content: `${result.message}`,
            })
            this.modalShow = false
            return false
          } else {
            this.cardInfo = result.data
            this.modalShow = true
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
    // 查询核销订单详情
    async search () {
      if (!this.queryStr) {
        return
      }
      try {
        const {response, result} = await this.checkDetail(this.queryStr)
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '查询失败',
              content: `${result.message}`,
            })
            return false
          }
          this.userInfo = result.data.customer
          this.purchase_type = parseInt(result.data.purchase_type)
          this.tradeOrder = {
            tradeOrderNo: result.data.trade_order_no,
            tradeOrderId: result.data.trade_order_id,
            writeOffCode: result.data.write_off_code,
          }
          result.data.item.forEach(item => {
            if (item.item_type === '商品') {
              if (item.sku_attribute.length > 0) {
                var obj = JSON.parse(item.sku_attribute)
                var str = ''
                obj.forEach(cell => {
                  str += (cell.attribute_item_value + ' ')
                })
                item.sku_name = str
              } else {
                item.sku_name = ''
              }
            } else {
              item.sku_name = ''
            }
          })
          this.serviceItem = result.data.item
          this.modalShow = true
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
    // 团购核销详情(优惠券核销搜索)
    async search2 () {
      if (!this.queryStr) {
        return
      }
      try {
        const {response, result} = await this.getGroupPurchaseVerifyApi({
          write_off_code: this.queryStr,
        })
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '查询失败',
              content: `${result.message}`,
            })
            this.modalShow = false
            return false
          } else {
            this.group_info = result.data
            this.modalShow = true
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
    // 卡核销详情(卡核销搜索)
    async search3 () {
      if (this.queryStr.length === 0) {
        return
      }
      let str = this.queryStr.toUpperCase()
      if (str.indexOf('VIP') === -1) str = 'VIP' + str
      try {
        const {response, result} = await this.getCardManagementInfoApi({
          upkeep_no: str,
        })
        if (response.status === 200) {
          if (result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '查询失败',
              content: `${result.message}`,
            })
            this.modalShow = false
            return false
          } else {
            let input = document.getElementsByClassName('card-input')[0]
            input.blur()
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
              this.is_self = true
            }
            result.data.expiry_time = this.changeDateTime(result.data.expiry_time)
            this.group_info = result.data
            this.modalShow = true
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
    // 弹层开关
    toggleWriteOffModal () {
      this.modalShow = !this.modalShow
      if (!this.modalShow) {
        this.$el.querySelector('.input').select()
      }
    },
    // 确认核销回调
    handleModal () {
      this.queryStr = ''
      this.$emit('success')
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
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.workbenck-operation-pannel
  position relative
  flex 1 1 auto
  display flex
  justify-content space-between
  margin-right 16px
  padding 16px 16px
  padding-left 188px
  background-color #fff
  border-radius 3px
  flex-grow 0
  &:last-child
    margin-right 0
  .label
    position absolute
    top 16px
    left 16px
    display block
    padding-left 64px
    height 40px
    font-size 18px
    line-height 40px
    color standblack
    // border-left 1px solid rgba(0, 0, 0, .08)
    &::after
      content ''
      position absolute
      top 8px
      left 32px
      width 24px
      height 24px
      background center no-repeat
    &.service::after
      background-image url('~@/assets/workbench-service-black.svg')

  .button
    margin-left 8px
    width 96px
    flex 0 0 96px

.auto-complete-input
  position relative
  display inline-block
  flex 1 1 auto
  .select
    position absolute
    left 0
    top 0
    height 40px
    padding 8px 16px
    font-size 16px
    line-height 24px
    color darker
    &::after
      content ''
      position absolute
      top 8px
      right 0
      height 24px
      border-left 1px solid line
  .input
    padding 8px 12px
    padding-left 96px
    font-size 16px
    line-height 22px

.auto-complete-list
  position absolute
  top 37px
  width 100%
  max-height 280px
  overflow-y auto
  padding 8px 0
  background-color #fff
  border 1px solid #c2c2c2
  box-shadow 0 4px 12px 0 rgba(0, 0, 0, .1)
  z-index 2
.auto-complete-item
  height 32px
  padding 0 16px
  font-size 13px
  line-height 32px
  color darker
  cursor pointer
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  .number
  .name
    display inline-block
  .name
    padding-left 30px
    color placeholder
  &:hover
    background-color hover
</style>
