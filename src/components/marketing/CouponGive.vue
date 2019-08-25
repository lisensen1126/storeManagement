<template lang="pug">
  .section-layout
    //- 选择推荐可会弹框
    slide-out-modal(@input="toggleSidePannel" v-if="show_mode")
      message-type(:id="'3'" @success="seleckType")
    //- 选择优惠券弹框 
    choose-coupon(v-if="show_coupon", v-model="show_coupon", :array="coupon_list", :params="'2'" @resolve="getCouponList")
    //- 搜索客户弹框
    choose-customer(v-if="show_customer", v-model="show_customer", :array="customer_list", @resolve="getCustomerList")
    .content-wrapper
      .section-setting
        h2 发放优惠券
        .form-wrapper
          .field-group
            .field.is-horizontal
              label.label 选择优惠券
              a.button.primary(@click="selectCoupon") 添加优惠券
            .field.is-horizontal(v-if="coupon_list.length > 0")
              label.label
              .box
                ul.clearfix.coupon
                  li.fl 优惠券名称
                  li.fl 优惠券金额(折扣)
                  li.fl.w-80 优惠券类型
                  li.fl 使用范围
                  li.fl 操作
                ul.clearfix.coupon-list(v-for="(item, index) in coupon_list")
                  li.fl {{item.coupon_name}}
                  li.fl(v-if="item.coupon_type != 4") {{item.discount_amount/100}}元
                  li.fl(v-if="item.coupon_type == 4") {{item.discount_amount/100}}折
                  li.fl.w-80 {{item.coupon_type_name}}
                  li.fl {{item.coupon_use_type_name}}
                  li.fl
                    a.operation-link(@click="deleteCoupon(index)") 删除
          .field-group
            .field.is-horizontal
              label.label 推送目标
              .field-content.clearfix
                .button.primary.fl(@click="searchCustomer") 搜索客户
                .button.primary.m-l-20.fl(@click="toggleSidePannel") 推荐客户
                .button.primary.m-l-20.fl.file 导入客户
                  input(type="file" value="导入客户" name="file", @change="importPhone($event)" style='opacity: 0; width: 80px; height:32px; position: absolute; top: 0; left: 0px; cursor: pointer')
                .check-but.fl.link(@click="down") （下载模板）
        
            .field.is-horizontal
              label.label
              .field-content
                custom-input.fl.phone-input(maxlength='11' @keyupEnter="enterPhone" v-model="phone" placeholder="请输入手机号" :validator="$v.phone" error-info="请输入正确的手机号", need-type="number")
                p.fl.p-tip （输入手机号码，回车添加）
          
            .field.is-horizontal
              label.label
              .field-content.border
                .phone.fl(v-for="(item, index) in phone_list")
                  .text.fl(v-text="item")
                  .close.fr.delete-icon1(@click="delPhone(index)")

            .clear-phone
              .field.is-horizontal
                label.label
                .field-content.clearfix
                  .clear.fl(@click="clearAll") 清空
                  .num.fr 当前共有{{phone_list.length}}个客户
          
              .field.is-horizontal.m-t-20
                label.label 是否短信通知
                .switch(:class='{"disabled": message_num == 0}')
                  input(type="checkbox", id="rep", v-model="is_sms", :disabled='message_num == 0')
                  label(for="rep")
                span.message-num 短信剩余量：{{message_num}}条
        .btn-wrapper
          .button-group
            a.button.primary.large(@click="giveCoupon") 发放
            a.button.large(@click="goBack") 取消
</template>

<script>
import Api from '@/mixins/modules/marketing'
import CustomSelect from '@/components/generics/form/CustomSelect'
import CustomInput from '@/components/generics/form/CustomInput'
import {root} from '@/plugins/Fetch'
import {validationMixin} from 'vuelidate'
import SlideOutModal from '@/components/generics/SlideOutModal'
import MessageType from '@/components/marketing/modal/MessageType'
import ChooseCoupon from '@/components/marketing/modal/ChooseCoupon'
import ChooseCustomer from '@/components/marketing/modal/ChooseCustomer'

export default {
  name: 'couponGive',
  mixins: [Api, validationMixin],
  components: {
    CustomSelect,
    CustomInput,
    SlideOutModal,
    MessageType,
    ChooseCoupon,
    ChooseCustomer,
  },
  data () {
    return {
      coupon_list: [],                       // 选择的优惠券列表
      customer_list: [],                     // 选择的优惠券列表
      root,                                  // base-url
      show_mode: false,                      // 控制导入客户变量
      show_coupon: false,                    // 控制选择优惠券弹框变量
      show_customer: false,                  // 控制选择搜索客户弹框
      phone_list: [],                        // 客户电话
      phone: '',
      is_sms: false,
      is_loading: false,
      message_num: 0,                        // 短信余量
      send_data: {
        coupon_id: [],
        mobile: [],
        is_sms: 2,
      },
    }
  },
  validations: {
    phone: {
      validate (val) {
        if (val === '') {
          return true
        } else {
          return /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(val)
        }
      },
    },
  },
  watch: {
    coupon_list (val) {
      let self = this
      self.send_data.coupon_id = []
      if (val.length === 0) return
      val.forEach(v => {
        self.send_data.coupon_id.push(v.coupon_id)
      })
    },
    phone_list () {
      this.send_data.mobile = [...this.phone_list]
    },
  },
  methods: {
    // 控制选择优惠券显隐
    selectCoupon () {
      this.show_coupon = !this.show_coupon
    },

    // 控制推荐客户显隐
    toggleSidePannel () {
      this.show_mode = !this.show_mode
    },

    // 控制搜索客户显隐
    searchCustomer () {
      this.show_customer = !this.show_customer
    },

    // 下载模板
    down () {
      window.open(`${this.root}/sms/download`)
    },

    // 回车添加手机号码
    enterPhone () {
      if (this.phone === '') return
      if (this.$v.phone.$error) return
      this.phone_list.unshift(this.phone)
      this.phone_list = this.uniq(this.phone_list)
      this.phone = ''
    },

    // 删除手机号码
    delPhone (index) {
      this.phone_list.splice(index, 1)
    },

    // 清空所有手机号码
    clearAll () {
      this.phone_list = []
    },

    // 数组去重
    uniq (array) {
      if (array.length === 0) {
        return []
      }
      let str = array.toString()
      str = str.split(',')
      let temp = Array.from(new Set(str))
      return temp
    },

    /**
     * 模态框回调的数据 获取推荐客户手机号列表 并且获取手机号码
     * params {Array} 推荐客户分类数组
     */
    async seleckType (params) {
      let data = params.toString()
      try {
        const {response, result} = await this.getSmsRecListApi({
          type: data,
        })
        if (response.status === 200 && result.code === 0) {
          this.phone_list.push.apply(this.phone_list, result.data)  // 合并数组
          this.phone_list = this.uniq(this.phone_list)  // 数组去重
          this.toggleSidePannel()   // 获取数据成功后关掉侧边栏
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取推荐客户失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取推荐客户失败',
          content: '服务异常，请稍后再试',
        })
      }
    },

    /**
     * 导入客户
     * event {Object} 文件对象
     */
    async importPhone (event) {
      let file = event.target.files[0]
      this.is_loading = true
      try {
        const {status, data} = await this.exportPhoneApi({
          excel: file,
        })
        if (status === 200 && data.code === 0) {
          this.phone_list.push.apply(this.phone_list, data.data.result)  // 合并数组
          this.phone_list = this.uniq(this.phone_list)  // 数组去重
          this.is_loading = false
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '导入客户失败',
            content: data.message,
          })
          this.is_loading = false
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '导入客户失败',
          content: err,
        })
      }
      this.is_loading = false
      event.target.value = null
    },

    /**
     * 选择添加优惠券
     * list {Array} 选择的优惠券列表
     */
    getCouponList (list) {
      this.coupon_list = [...list]
    },

    /**
     * 删除已选优惠券
     * index {Number} 要删除已选优惠券下标
     */
    deleteCoupon (index) {
      this.coupon_list.splice(index, 1)
    },

    /**
     * 搜索客户弹框回调
     * list {Array} 选择的客户列表
     */
    getCustomerList (list) {
      if (list.length === 0) return
      let templist = []
      list.forEach(v => {
        templist.push(v.mobile)
      })
      // this.customer_list = [...list]
      this.phone_list = [...templist]
      this.phone_list = this.uniq(this.phone_list)
    },

    // 获取短信余量
    async getMessageNum () {
      try {
        const {response, result} = await this.fetchMessageCountApi()
        if (response.status === 200 && result.code === 0) {
          this.message_num = result.data.surplus
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取短信余量失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取短信余量失败',
          content: '服务异常，请稍后再试',
        })
      }
    },

    // 发放优惠券函数
    async sendCoupon () {
      try {
        const {response, result} = await this.addSendCoupon(this.send_data)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'success',
            title: '成功',
            content: '优惠券发放成功！',
            resolve: () => {
              this.$router.go(-1)
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '发放优惠券失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '发放优惠券失败',
          content: '服务异常，请稍后再试',
        })
      }
    },

    // 发放优惠券验证操作
    giveCoupon () {
      this.is_sms ? this.send_data.is_sms = 1 : this.send_data.is_sms = 2
      if (this.send_data.coupon_id.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请选择要发放的优惠券',
        })
        return
      }
      if (this.send_data.mobile.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请选择/填写目标客户手机号码',
        })
        return
      }
      if (this.send_data.coupon_id.length > 5) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '友情提示',
          content: '最多只能选择五张优惠券！',
        })
        return false
      }
      if ((this.send_data.coupon_id.length * this.send_data.mobile.length) > 10000) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '提示',
          content: '本次发送优惠券较多，已超出系统发送上限。建议您分批次（每次10000）导入客户发送优惠券。',
          autoClose: true,
        })
        return
      }
      this.$store.dispatch('showMessage', {
        type: 'warning',
        title: '提示',
        content: `确定给清单里的${this.phone_list.length}个客户发放优惠券吗?`,
        isRejectable: 1,
        resolve: () => {
          this.sendCoupon()
        },
      })
    },

    // 返回
    goBack () {
      this.$router.go(-1)
    },
  },
  mounted () {
    this.getMessageNum()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/creation-modal'
.small
  height 32px
  line-height 32px
  font-size 14px
.f-14
  font-size 13px
  line-height 15px
.m-l-20
  margin-left 20px
.form-wrapper .field
  min-width 680px
  font-size 12px
.message-num
  margin-left 20px
  color #666
.coupon
  background-color #f0f1f2
  padding-left 8px
  .w-80
    width 60px 
  li
    width 120px
    margin-right 20px
    line-height 36px
  li:last-child
    margin-right 0
    width 46px
    text-align center
.coupon-list
  padding-left 8px
  border-bottom 1px solid #eee
  cursor pointer
  border-left 2px solid transparent
  .w-80
    width 60px  
  li
    width 120px
    margin-right 20px
    line-height 34px
    white-space nowrap
    text-overflow ellipsis
    height 34px
    overflow hidden
    color #666
  li:last-child
    margin-right 0
    width 46px
    text-align center
.coupon-list:hover
  border-left 2px solid #ffc723
  box-shadow 0 2px 8px 0 rgba(0,0,0,.08)
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.clearfix:after{
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden
}
.fl{
  float: left;
}
.fr{
  float: right ;
}
.f-12
  font-size 12px
  color red
.field-content
  width 700px
.section-layout
  height calc(100% - 56px)
  overflow-y auto
.section-setting
  + .section-setting
    margin-top 16px
  background #ffffff
  padding-bottom 24px
.header-wrapper
  height 56px
  align-items center
  border-bottom 1px solid line
.header-title
  font-size 18px
  line-height 24px
  color darker
  position relative
.level-left
  align-items center
.switch-title
  margin-left 8px
  font-size 13px
  line-height 18px
  word-break keep-all
.form-wrapper
  padding 0
  padding-left 24px
  padding-top 32px
  &.disabled
    opacity .5
.field-group
  + .field-group
    margin-top 24px
  + .clear-phone
    margin-top 0
.m-l-20
  margin-left 20px
.m-t-20
  margin-top 20px
.check-but
  padding 4px 6px
  cursor pointer
  border 1px solid #dddddd
  border-radius 3px
  color #666
.link
  font-size 12px
  cursor pointer
  color #5E7BFF
  padding 16px 0 0 0
  border none
  margin-left 10px
.link:hover
  text-decoration underline
.phone-input
  width 300px
.p-tip
  font-size 12px
  color #666
  padding 16px 0 0 4px
.border
  width 650px
  height 200px
  overflow-y auto
  border 1px solid #dddddd
  padding 10px
  .phone
    width 120px
    height 26px
    line-height 24px
    border 1px solid #dddddd
    margin-right 10px
    margin-bottom 6px
    .text
      padding-left 4px
      font-size 12px
    .delete-icon1
      width 26px
      height 24px
      background center no-repeat url('~@/assets/icons/trash.svg')
      cursor pointer
      background-size 12px
.clear-phone
  .field-content
    padding-top 10px
    color #666
    .clear
      color #5E7BFF
      cursor pointer
    .clear:hover
      text-decoration underline
    .num
      font-size 12px
.moban
  width 250px
  margin-right 10px
.sms
  line-height 20px
.sms>>>input
  width 100px
  border none
  border-bottom 1px solid #dddddd
  font-size 12px
  text-align center
.msg-text
  height 150px
  line-height 1.4
.file
  position relative
</style>
