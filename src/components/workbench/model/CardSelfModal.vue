<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title(v-text="confirm_show ? '待核销项目确认' : '核销信息'") 核销信息
        .close-button(@click="modalClose")
      .modal-body(v-if="!confirm_show")
        .record-info
          .service-ticket-wrapper
            .serivce-main-info-wrapper
              .label 名称：{{info.name}}
            .serivce-main-info-wrapper
              .label 卡号：{{info.upkeep_no_new}}
          .service-ticket-wrapper
            .serivce-main-info-wrapper
              .label 价格：{{info.price / 100}}元
          .service-ticket-wrapper
            .serivce-main-info-wrapper
              .label 到期时间： {{info.expiry_time}}
        .record-info-list
          .content-wrapper.list-wrapper
            .record-info-title 选择卡内项目
            .table-wrapper
              table.table
                thead
                  tr
                    td(width="100") 项目名称
                    td(width="100") 项目描述
                    td(width="60") 可用数量
                    td(width="100") 核销数量
                tbody(v-if="info.item && info.item.length")
                  tr(v-for="(cell, index) in info.item")
                    td
                      .simple-td(v-text="cell.name", :title="cell.name")
                    td
                      .simple-td(v-text="cell.description", :title="cell.description")
                    td
                      .simple-td(v-if="cell.num !== -1") {{cell.num}}
                      .simple-td(v-if="cell.num === -1") 无限次
                    td.content-box
                      .btn.left-jian(@click="changeNum('-', index)") -
                      .width-100
                        custom-input(maxlength="2", :padding="36", v-model="cell.number", need-type="number",:max="cell.num !== -1 ? cell.num : '99'", min="0")
                      .btn.right-jia(@click="changeNum('+', index)") +
      .modal-footer(v-if="!confirm_show")
        button.button.large.primary(@click="confirmAgain") 确认核销
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
                      .simple-td(v-text="cell.number", :title="cell.name") 
      .modal-footer(v-if="confirm_show")
        button.button.large.primary(@click="finishService", :class="{'disabled': isLoading}") 确认核销
        span.cancel-button(@click="showFirst") 取消
</template>

<script>
  import Checkbox from '@/components/generics/form/Checkbox'
  import ModalDialog from '@/components/generics/ModalDialog'
  import modalInteractions from '@/mixins/utilities/modalInteractions'
  import workbenchMixin from '@/mixins/modules/workbench'
  import imageScale from '@/mixins/utilities/imageScale'
  import CustomInput from '@/components/generics/form/CustomInput'
  export default {
    name: 'CardSelfModal',
    mixins: [modalInteractions, workbenchMixin, imageScale],
    components: {
      Checkbox,
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
        this.info.item = []
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
        this.info.item = arr
      },
      confirmAgain () {
        this.confirm_list = this.info.item.filter(cell => cell.number > 0)
        if (this.confirm_list.length === 0) {
          return
        }
        this.confirm_show = true
      },
      showFirst () {
        this.confirm_show = false
      },
      async finishService () {
        if (this.isLoading) return false
        this.isLoading = true
        let item = []
        this.info.item.forEach(cell => {
          let obj = {
            id: cell.use_id,
            num: cell.number === '' ? 0 : cell.number,
          }
          item.push(obj)
        })
        try {
          const {response, result} = await this.selfApi({
            upkeep_no: this.info.upkeep_no,
            item: item,
          })
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
          this.isLoading = false
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '核销失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
          this.isLoading = false
        }
      },
    },
  }
</script>

<style scoped lang="stylus">
  @import '~@/stylus/mixins.styl'
  .modal-card
    width 700px !important
  .simple-td
    max-width 180px !important
  .service-ticket-wrapper
    line-height 40px
    padding 0 10px
  .serivce-main-info-wrapper
    width 290px
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
  .simple-td
    max-width 200px !important
  .content-box
    width 200px
    position relative
    text-align center
</style>
