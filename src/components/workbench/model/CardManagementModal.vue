<!--优惠券核销详情弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span(v-text="confirm_show ? '待核销项目确认' : '核销信息'") 核销信息
          span.red-tip(v-if="!confirm_show") 您有{{info.has_num}}次待核销机会
        .close-button(@click="modalClose")
      .modal-body(v-if='!confirm_show')
        .record-info
          .service-ticket-wrapper
            .serivce-main-info-wrapper
              .label 名称： {{info.name}}
            .serivce-main-info-wrapper
              .label 卡号： {{info.upkeep_no_new}}
          .service-ticket-wrapper
            .serivce-main-info-wrapper
              .label 价格： {{info.price / 100}}元
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
                        span(v-text="cell.name",)
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
                      .simple-td
                        span(v-text="cell.name", :title="cell.name")
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
      .modal-footer(v-if='!confirm_show')
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
                    td(width="90") 项目描述
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
        button.button.large.primary(@click="finishService", :class="{'disabled': isLoading}") 确认核销
        span.cancel-button(@click="showFirst") 取消
</template>

<script>
import ModalDialog from '@/components/generics/ModalDialog'
import modalInteractions from '@/mixins/utilities/modalInteractions'
import workbenchMixin from '@/mixins/modules/workbench'
import imageScale from '@/mixins/utilities/imageScale'
import CustomInput from '@/components/generics/form/CustomInput'
export default {
  name: 'CardOffModal',
  mixins: [modalInteractions, workbenchMixin, imageScale],
  components: {
    ModalDialog,
    CustomInput,
  },
  props: {
    info: {},
  },
  data () {
    return {
      checkCode: 1234,
      isLoading: false,
      is_all_select: false,
      checkout_ids: [],
      is_need: false,
      confirm_show: false,
      confirm_list: [],
    }
  },
  methods: {
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
    confirmAgain () {
      let arr = []
      let arr1 = []
      arr = this.info.project.filter(cell => cell.number > 0)
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
    // // 核销操作
    async finishService () {
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
        const {response, result} = await this.getCardManagementConfirmApi(params)
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
    // 复选框选中列表项
    isCheckout (params) {
      // 当前项的选中
      if (params.type === 'unit') {
        // 选中项的id集合
        let ids = []
        this.info.item.forEach(function (item) {
          if (item.is_select) {
            ids.push(item.use_id)
          }
        })
        if (ids.length === this.info.item.length) {
          this.is_all_select = true
        } else {
          this.is_all_select = false
        }
        this.checkout_ids = ids
      }
      // 全选操作
      if (params.type === 'all') {
        let ids = []
        this.is_all_select = params.is_all_select
        // 更新列表 list 数据
        if (params.is_all_select) {
          this.info.item.forEach(function (item) {
            item.is_select = true
            ids.push(item.use_id)
          })
        } else {
          this.info.item.forEach(function (item) {
            ids = []
            item.is_select = false
          })
        }
        this.checkout_ids = ids
      }
    },
  },
  mounted () {
    if (this.info.need_num === 0) {
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
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins.styl'
.simple-td
  max-width 180px !important
.bg-d
  background #ddd
.content-box
  width 200px !important
  text-align center
.width-100
  width 100%
  .input
    padding 7px 36px
.btn
  width 32px
  font-size: 13px;
  text-align: center;
  height: 30px
  line-height: 30px;
  background: #fdfdfd;
  color: #999;
  padding: 0 8px;
  color: #999;
  cursor pointer
.left-jian
  position: absolute;
  z-index: 9999;
  top: 3px;
  left: 14px;
  border-right: 1px solid #c2c2c2;
.right-jia
  position: absolute;
  z-index: 9999;
  top: 3px;
  right: 2px;
  border-left: 1px solid #c2c2c2;
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
  padding-top: 0px
  padding-bottom: 10px
  overflow-y: auto
  height: 215px
  .service-item-detail
    line-height: 40px
    height: 40px
  .content
    border-bottom: 1px solid #f0f0f0
    padding: 5px 0;
    .price-info
      line-height 40px
      border-left: none
  .content:last-child
    border-bottom: none
.table-wrapper td
  padding 0 0 0 13px !important
.record-info
  border-bottom 1px solid #eeeeee
  padding-bottom 10px
.content-wrapper
  margin 15px 26px 0
.modal-card
  width 700px !important
  height 600px
  overflow-y scroll
.modal-body
  max-height 444px
  overflow-y scroll
</style>
