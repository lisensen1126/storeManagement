<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goList")
    .content-wrapper
      .steps-box
        .step-item.step-is-active
          div.step-right
          span.no-icon 1
          span.text 发给谁
        .step-item
          div.step-right
          span.no-icon 2
          span.text 发什么
        .step-item
          div.step-right
          div.step-right-last
          span.no-icon 3
          span.text 完成创建
      //- el-steps.step(:active="step_num", simple)
      //-   el-step(title="发给谁", icon="el-icon-question")
      //-   el-step(title="发什么", icon="el-icon-tickets")
      //-   el-step(title="完成创建", icon="el-icon-circle-check")
      .section-setting
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 推送范围
                  .field.is-horizontal
                    div.type-item
                      .radio
                        input(type="radio", v-model="effective_type", id="yx-1", value=1)
                        label.sepcific-setting(for="yx-1") 指定用户
                    div.type-item.m-l-20
                      .radio
                        input(type="radio", v-model="effective_type", id="yx-2", value=2)
                        label.sepcific-setting(for="yx-2") 全部用户
              .field-group(v-if="effective_type == 1")
                .field.is-horizontal
                  label.label
                  .field-content.clearfix
                    custom-input.fl.phone-input(maxlength='11' @keyupEnter="searchPhone" @input="changePhone" v-model="phone" placeholder="请输入手机号搜索" :validator="$v.phone" error-info="请输入正确的手机号", need-type="number")
                    a.button.primary.m-l-20(@click="searchPhone") 搜索
                    p.p-tip(v-if="no_find_phone") 未找到注册用户，请重新输入手机号再试
                    p.p-tip(v-if="again_phone") 该用户已添加，请添加其他用户
              .field-group(v-if="effective_type == 1")
                .field.is-horizontal
                  label.label
                  .field-content.border
                    .phone.fl(v-for="(item, index) in phone_list")
                      .box-phone.fl
                        .text-name(v-html="item.nick_name ? item.nick_name : '&nbsp;'") 月野兔兔兔兔兔兔兔兔少女心信息信息
                        .text(v-text="item.mobile")
                      .close.fr.delete-icon(@click="delPhone(index)")
                      .tip-color(:class="item.has_form_id === 1 ? '' : 'active'", v-text="item.has_form_id === 1 ? '有互动' : '无互动'") 有互动
              .field-group
                .field.is-horizontal
                  label.label 推送方式
                  .field.is-horizontal
                    label.label 立即推送
              .field-group
                .field.is-horizontal
                  label.label 预计可推送用户
                  .field.is-horizontal
                    label.label {{phone_length}}人
              .field-group
                .field.is-horizontal
                  label.label
                  .field-content
                    p.sms.f-12 注：由于微信小程序要求，预计可推送用户只包含7天内和门店小程序有互动的用户。
              .field-group
                .field.is-horizontal
                  label.label
                  .field-content
                    a.button.primary(v-if="phone_length > 0",@click="goSecond") 下一步
                    a.button(v-if="phone_length == 0") 下一步
</template>

<script>
import CustomSelect from '@/components/generics/form/CustomSelect'
import CustomInput from '@/components/generics/form/CustomInput'
import SlideOutModal from '@/components/generics/SlideOutModal'
import MessageType from '@/components/marketing/modal/MessageType'
import {validationMixin} from 'vuelidate'
import {root} from '@/plugins/Fetch'
import Api from '@/mixins/modules/marketing'
import Loading from '@/components/generics/Loading'
export default {
  name: 'firstSendAdd',
  mixins: [Api, validationMixin],
  components: {
    CustomSelect,
    CustomInput,
    SlideOutModal,
    MessageType,
    Loading,
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
  data () {
    return {
      root,
      phone_list: [],
      step_num: 0,
      phone: '',
      no_find_phone: false,    // 手机号查找报错信息是否展示
      again_phone: false,    // 重复添加
      effective_type: 1,   // 推送范围  1 指定用户  2 全部用户
    }
  },
  watch: {
    // 监听推送范围变化
    effective_type (val) {
      this.phone_list = []
      if (val - 0 === 2) {
        this.isCanPhone('', 2)
      }
    },
  },
  computed: {
    // 预计可推送用户
    phone_length () {
      let num = this.phone_list.filter(ele => ele.has_form_id === 1).length
      return num
    },
  },
  methods: {
    // 去推送列表
    goList () {
      this.$router.push({
        name: 'pushList',
        query: {
          save: 1
        }
      })
    },
    // 第二步骤
    goSecond () {
      sessionStorage.setItem('PHONE_LIST', JSON.stringify(this.phone_list))
      sessionStorage.setItem('EFFECYIVE_TYPE', this.effective_type)
      this.$router.push({
        name: 'secondSendAdd',
        query: {
          id: this.$route.query.id,
        },
      })
    },
    // input输入变化时候不显示下面报错信息
    changePhone () {
      this.again_phone = false
      this.no_find_phone = false
    },
    // 回车检索手机号码
    searchPhone () {
      if (this.phone === '') return
      if (this.$v.phone.$error) return
      if (this.uniq(this.phone)) {
        this.again_phone = true
        return
      }
      this.isCanPhone(this.phone, 1)
      this.phone = ''
    },
    /**
     * @params phone 需要检索手机号
     * @params type  推送目标是否是全部用户 1 不是 2 是
     * @description 检索手机号码是否存在
     */
    async isCanPhone (phone, type) {
      let params = {}
      if (type === 1) {
        // string 是 输入手机号
        if (typeof phone === 'string') {
          params.mobile = [phone]
        } else {
          // 编辑时的手机号集合
          params.mobile = [...phone]
        }
      }
      try {
        const {response, result} = await this.searchCustomer(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.no_find_phone = false
            this.phone_list = [...result.data.user_info, ...this.phone_list]
          } else {
            this.no_find_phone = true
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '手机号查找失败',
            content: result.message,
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * @description 删除手机号码
     * @params index 需要删除的手机号对应的下标
     */
    delPhone (index) {
      this.phone_list.splice(index, 1)
    },
    // 数组去重
    uniq (phone) {
      let flag = this.phone_list.some(ele => ele.mobile === phone)
      return flag
    },
    // 获取详情
    async getDetail () {
      try {
        const {response, result} = await this.sendPushDetailApi({
          id: this.$route.query.id,
        })
        if (response.status === 200 && result.code === 0) {
          if ((result.data.range - 0) === 1) {
            this.isCanPhone(result.data.mobiles, 1)
          }
          this.effective_type = result.data.range
          // if (sessionStorage.getItem('push-second')) {
          //   return false
          // }
          // 第二步存缓存
          let obj = {
            template_id: result.data.library_id,
            title: result.data.title,
            type: result.data.value_type,
            value_content: result.data.value_content,
            content: {
              first: result.data.content[0],
              second: result.data.content[1],
              third: result.data.content.length > 2 ? result.data.content[2] : '',
              fourth: result.data.content.length > 3 ? result.data.content[3] : '',
              fifth: result.data.content.length > 4 ? result.data.content[4] : '',
              sixth: result.data.content.length > 5 ? result.data.content[5] : '',
            },
          }
          sessionStorage.setItem('push-second', JSON.stringify(obj))
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取详情失败',
            content: result.message,
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
  },
  mounted () {
    let PHONE_LIST = sessionStorage.getItem('PHONE_LIST') || null
    let EFFECYIVE_TYPE = sessionStorage.getItem('EFFECYIVE_TYPE') || null
    sessionStorage.removeItem('PHONE_LIST')
    sessionStorage.removeItem('EFFECYIVE_TYPE')
    if (!PHONE_LIST && !EFFECYIVE_TYPE && this.$route.query.id) {
      this.getDetail()
      // console.log(11)
    }
    if (PHONE_LIST) {
      this.phone_list = JSON.parse(PHONE_LIST)
    }
    if (EFFECYIVE_TYPE) {
      this.effective_type = EFFECYIVE_TYPE - 0
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.nav-back-btn
  position absolute
  top 36px
  left 16px
  width 32px
  height 32px
  border-radius 100%
  background #CED3DC center no-repeat url('~@/assets/back.svg')
  background-size 16px
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
  cursor pointer
  z-index 2
.steps-box
  width 100%
  height 50px
  display flex
  justify-content start
  background #d3d3d3
  .step-item
    width 33%
    line-height 50px
    height 50px
    color white
    margin-right 30px
    font-size 16px
    box-sizing border-box
    padding-left 30px
    position relative
    .no-icon
      float: left
      width 20px
      height 20px
      border 1px solid white
      border-radius 20px
      line-height 20px
      text-align center
      margin 16px 6px 0 0
    .text
      float: left
  .step-is-active
    background #2fabdd
  .step-item:after
    content: ""
    border-top 25px solid transparent
    border-bottom 25px solid transparent
    border-left 25px solid #d3d3d3
    position absolute
    top 0
    right -25px
  .step-is-active:after
    content: ""
    border-top 25px solid transparent
    border-bottom 25px solid transparent
    border-left 25px solid #2fabdd
    position absolute
    top 0
    right -25px
  .step-right
    border-top 25px solid transparent
    border-bottom 25px solid transparent
    border-left 25px solid white
    position absolute
    top 0
    right -26px
  .step-right-last
    width: 29px
    height: 50px
    position: absolute
    background: white
    top: 0
    right: -30px
.form-wrapper .field
  min-width 680px
  font-size 12px
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
  width 650px
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
  width 280px
  &.disabled
    opacity .5
.field-group
  + .field-group
    margin-top 24px
.m-l-20
  margin-left 20px
.phone-input
  width 300px
.p-tip
  font-size 12px
  color #f00
  padding 12px 0 0 0
.border
  width 650px
  height 200px
  overflow-y auto
  border 1px solid #dddddd
  padding 10px
  .phone
    width 172px
    height 52px
    line-height 24px
    border 1px solid #dddddd
    margin-right 10px
    margin-bottom 6px
    position relative
    .tip-color
      width 55px
      height 18px
      text-align center
      line-height 18px
      color #ffffff
      font-size 8px !important
      background-color #ffbb29
      border-top-left-radius 20px
      border-bottom-left-radius 20px
      position absolute
      bottom 2px
      right 0
      &.active
        background-color #f00
    &:nth-of-type(3n) {
      margin-right 0
    }
    .text
      font-size 12px
    .text-name
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    .delete-icon
      width 26px
      height 24px
      background center no-repeat url('~@/assets/icons/trash.svg')
      cursor pointer
      background-size 12px
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
.box-phone
  width 130px
  overflow hidden
  padding-left 4px
  box-sizing border-box
</style>
