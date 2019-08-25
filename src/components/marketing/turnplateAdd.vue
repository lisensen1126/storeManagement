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
                  .labelname(v-text='detail.name') 剪卡圣诞节阿上课的哈手机号撒的哈萨克
                .field.is-horizontal
                  label.label 起止时间
                  .labelname
                    span.iocns_svg
                    span(v-if='detail.end_time', v-text=' detail.start_time + "~" + detail.end_time ')
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
                  .labelname(v-text='detail.description') 撒娇就撒娇挥洒个鸡蛋羹三卡上打卡上打双打圣诞贺卡上大哭阿圣诞贺卡上大手大脚卡实打实的卡上的撒开撒的挥洒健康的哈萨克好的卡上打卡上阿什顿看见啊啥的空间啊啥的卡上打
      .section-setting
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 奖品信息
        .level.level-content
          .level-left.clearflex
            .form-wrapper.form-wrapper-mendian(v-show='mendianList.length>0', :style="{'border-top':zhigongList.length>0 ? '1px solid rgba(0, 0, 0, 0.08)' : '0px'}")
              .field-group
                .field.is-horizontal
                  label.label 门店奖品
                  .form-wrapper.form-wrapper_clearmargin
                    .labelname.red 请勾选适合自己门店的奖品，并设置中奖率(勾选奖品数量不能超过五个)
                      a.icons-help(@mouseover="showCommentModal", @mouseleave="hideCommentModal", @mouseout="CommentModalOut")
                        .modaltips(v-if="isVisible")
                          transition(name="fade")
                            p(v-text="message")
                          .sanjiao
                    .field-group.field-group-m-t-15
                      .setting-type-wrapper
                        div.type-item(v-for='(win, index) in mendianList')
                          .checkbox
                            input(type="checkbox",:id='"random"+index',name="prize", :value="win.id",v-model='win.checked')
                            label(:for="'random'+index",v-text='win.coupon_name') 位置/金额随机上
                          .field.is-horizontal.field_200px(v-show='win.checked && win.coupon_type === 3')
                            label.label.label_50px 数量
                            custom-input.custom-input(input-type="hasUnit",v-model.trim='win.stock_nums', type='text', min='0', need-type="number")
                              span(slot="unitName") 张
                          .field.is-horizontal.field_200px(v-show='win.checked')
                            label.label.label_50px 中奖率
                            custom-input.custom-input.custom_39px(v-model.trim='win.rate', need-type="number")
        .btn-wrapper
          .button-group
            a.button.primary.large(@click="commitModal") 发布活动
            a.button.large(@click="goBack") 返回列表
</template>

<script>
import marketingMixin from '@/mixins/modules/marketing'
import CustomInput from '@/components/generics/form/CustomInput'
import DatePicker from '@/components/generics/form/DatePicker'
import ShopCategoryPicker from '@/components/generics/form/ShopCategoryPicker'

export default {
  name: 'turnplateAdd',
  mixins: [marketingMixin],
  components: {
    CustomInput,
    DatePicker,
    ShopCategoryPicker,
  },
  data () {
    return {
      isDisabled: false,
      isLoading: false,
      isVisible: false,
      hideTimeout: null,
      message: '中奖率为每百次抽奖中奖率。如填写1，中奖率即为百分之一',
      detail: {}, // 活动详情
      activeId: null,
      mendianList: [], // 门店奖品
      prize: [],
      zhigongList: [], // 直供奖品（已经没了）
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
    // 获取详情
    async getDetail () {
      try {
        const {response, result} = await this.activeDetail(this.activeId)
        if (response.status === 200) {
          result.data.start_time = this.changeDateTime(result.data.start_time)
          result.data.end_time = this.changeDateTime(result.data.end_time)
          this.detail = result.data
          this.getList()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取活动详情失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取活动详情失败',
          content: '服务异常，请稍后再试',
        })
      }
      // this.isInitiated = true
    },
    // coppyArray (arr) {
    //   return arr.map((e) => {
    //     if (typeof e === 'object') {
    //       return Object.assign({}, e)
    //     } else {
    //       return e
    //     }
    //   })
    // },
    // 发布活动正则校验
    commitModal () {
      let prizeLength = this.getTrue().length
      if (prizeLength === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '您未选择门店奖励',
        })
        return
      }
      if (prizeLength > 5) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '门店奖励最多不超过5个',
        })
        return
      }
      if (this.isStockNums().length !== 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '请填写数量',
        })
        return
      }
      if (this.isRate().length !== 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '请填写中奖率',
        })
        return
      }
      if (this.isStockNumsRight().length !== 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '请填写正确的数量',
          content: '数量只能数整数',
        })
        return
      }
      if (this.isRateRight().length !== 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '请填写正确的中奖率',
          content: '不可大于100且中奖率精确到小数点后一位',
        })
        return
      }
      this.$store.dispatch('showMessage', {
        type: 'warning',
        title: '活动确认',
        content: '你已提供' + prizeLength + '项奖品参加本次抽奖活动，请确认是否发布活动?',
        isRejectable: 1,
        resolve: () => {
          this.commitData()
        },
      })
    },
    // 获取奖品列表
    async getList () {
      try {
        this.isLoading = true
        const {response, result} = await this.getPrive()
        if (response.status === 200) {
          this.mendianList = result.data
          // this.mendianList = this.coppyArray(result.data)
          // console.log(this.mendianList)
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取奖品列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取奖品列表失败',
          content: `错误：${err}`,
        })
      }
      this.isLoading = false
    },
    // 发布活动
    async commitData () {
      let data = {
        'prize_item': this.getTrue(),
      }
      // console.log(data)
      try {
        this.isLoading = true
        const {response, result} = await this.activeAdd(data, this.activeId)
        if (response.status === 200) {
          if (result.message === 'success') {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '参与成功',
              resolve: () => {
                this.$router.push({
                  name: 'turnplateList',
                })
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '参与失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '参与失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '参与失败',
          content: `错误：${err}`,
        })
      }
      this.isLoading = false
    },
    // 判断发放奖品的数量和类型
    isStockNums () {
      return this.getTrue().filter(item => {
        if (item.coupon_type === 2 && item.stock_nums.length === 0) {
          // console.log(item.stock_nums)
          return item
        }
      })
    },
    // 判断发放奖品的中奖率
    isRate () {
      return this.getTrue().filter(item => {
        if (item.rate.length === 0) {
          return item
        }
      })
    },
    // 中奖率正则
    isRateRight () {
      return this.getTrue().filter(item => {
        if (!/^[0-9]+(.[0-9]{1})?$/.test(item.rate) || item.rate > 100 || item.stock_nums < 0) {
          return item
        }
      })
    },
    // 发放数量正则
    isStockNumsRight () {
      return this.getTrue().filter(item => {
        if (item.coupon_type === 2) {
          if (/.*\..*/.test(item.stock_nums) || !/^\d+$/.test(item.stock_nums) || item.stock_nums < 0) {
            return item
          }
        }
      })
    },
    // 提交参数
    getTrue () {
      return this.mendianList.filter(item => item.checked).map(item => {
        return {
          coupon_id: item.coupon_id,
          stock_nums: item.stock_nums,
          rate: item.rate,
          type: item.coupon_type,
        }
      })
    },
    // 鼠标在上面
    showCommentModal () {
      window.clearTimeout(this.hideTimeout)
      this.isVisible = true
    },
    // 鼠标离开
    hideCommentModal () {
      this.isVisible = false
    },
    // 鼠标进入
    CommentModalOut () {
      window.clearTimeout(this.hideTimeout)
      this.hideTimeout = setTimeout(() => {
        this.isVisible = false
      }, 200)
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
  .icons-help
    position relative
    background center no-repeat url('~@/assets/icons/icons_help.svg')
    background-size 100% 100%
    display inline-block
    width 14px
    height 14px
    margin-top -2px
    margin-left 5px
    vertical-align middle
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
.form-wrapper-mendian
  padding-top 15px
.form-wrapper_clearmargin
  margin 0
  padding 0
.form-wrapper-zhigong .field-group
  flex-direction row
  align-items center
.form-wrapper-zhigong .field-group.field_m_t_0
  margin-top 5px
.form-wrapper-zhigong .field-group .field
  width 350px
  margin-top 0
.form-wrapper-mendian .field-group .field
  margin-top 0
.form-wrapper-zhigong .field-group .field_200px
  width 200px
.form-wrapper-mendian .field-group .field_200px
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
  margin-top 10px
.radio label
  padding-left 32px
.checkbox
  width 230px
  min-height 32px
  height auto
.checkbox label::before
  top 7px
.checkbox input[type="checkbox"]
  top 7px
.checkbox label
  line-height 32px
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
.modaltips
  width 172px
  box-sizing border-box
  background rgba(0,0,0,0.8)
  border-radius 2px
  box-shadow 0 0 0 0 rgba(0, 0, 0, .05), 0 2px 12px -1px rgba(0, 0, 0, .10)
  padding 5px 8px
  font-size 12px
  line-height 18px
  color #fff
  position absolute
  z-index 11
  bottom 35px
  left calc(50% -6px)
  transform translateX(calc(-50% + 6px))
  .sanjiao
    width 8px
    position absolute
    left 0
    right 0
    margin auto
    bottom -8px
    border-width 8px 8px 0
    border-style solid
    border-color rgba(0,0,0,0.8) #fff #fff
.comment
  width 78px
  display inline-flex
  div
    width 100%
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
    &.has-comment
      color #fff
.fade-enter-active,
.fade-leave-active
  transition: opacity .5s
.fade-enter,
.fade-leave-to
  opacity: 0
</style>
