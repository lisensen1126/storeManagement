<template lang="pug">
  .section-layout
    //- 选择关联商品服务弹框
    choose-commodity(v-if="show_goodserve", v-model="show_goodserve", :array="goodserve_list", @resolve="addGoodTrue")
    choose-classify(v-if="show_classify", v-model="show_classify", :array="classify_list", @resolve="addClassifTrue")
    choose-card(v-if="show_cards", v-model="show_cards", :array="cards_list", @resolve="addCardsTrue")
    .content-wrapper
      service-tab.top-nav(v-model="currt_type", :tabs="coupon_type", :have-icon="false", :have-quantity="false", class="status-list", @input="checkCouponType($event)")
      .tab-box
        .form-wrapper
          .field-group
            .field.is-horizontal
              label.label 优惠券名称
              custom-input(v-model.trim="send.coupon_name", placeholder="请输入优惠券名称，最多15个字符", maxlength="15", :validator="$v.send.coupon_name", error-info="优惠券名称不能为空")

            //- 满减券
            .field.is-horizontal(v-show="currt_type.type == 3")
              label.label 优惠券金额
              span.span 满
              custom-input.custom-input.m-l-r(input-type="hasUnit", v-model="send.condition_value", placeholder="使用条件", maxlength="5", need-type="number", :validator="$v.send.condition_value", error-info="请填写大于0的整数")
                span(slot="unitName") 元
              span.span 减
              custom-input.custom-input.m-l-r(input-type="hasUnit", v-model="send.discount_amount" placeholder="减免金额", maxlength="3", need-type="number", :validator="$v.send.discount_amount", error-info="请填写大于0的整数")
                span(slot="unitName") 元
            
            //- 折扣券
            .field.is-horizontal(v-show="currt_type.type == 4")
              label.label 优惠券折扣
              span.span 满
              custom-input.custom-input.m-l-r(input-type="hasUnit", v-model="send.condition_value", placeholder="使用条件", maxlength="5", need-type="number", :validator="$v.send.condition_value", error-info="请填写大于0的整数")
                span(slot="unitName") 元
              custom-input.custom-input(input-type="hasUnit", v-model="send.discount_amount", placeholder="折扣", maxlength="3", need-type="float", :validator="$v.send.discount_amount", error-info="请填写大于1且小于10的数")
                span(slot="unitName") 折
            
            //- 代金券&兑换券
            .field.is-horizontal(v-show="currt_type.type == 2 || currt_type.type == 1")
              label.label 优惠券金额
              custom-input.custom-input(input-type="hasUnit", v-model="send.discount_amount", placeholder="优惠金额：元", maxlength="3", need-type="number", :validator="$v.send.discount_amount", error-info="请填写大于0的整数")
                span(slot="unitName") 元

            .field.is-horizontal(v-show="currt_type.type != 2")
              label.label 使用范围
              custom-select(v-model="use_type" placeholder="请选择使用范围", :list="use_scope", ref="useType", :isDisabled="currt_type.type == 2")
              .button.large.primary.small(v-if="use_type.id == 2", @click="lookupClassify") 选择指定分类
              .button.large.primary.small(v-if="use_type.id == 3", @click="lookupGoods") 选择指定商品/服务
              .button.large.primary.small(v-if="use_type.id == 4", @click="lookupCards") 选择指定养护卡
              a.f-14.m-l-20(v-if="classify_list.length != 0", @click="lookupClassify") （已选{{classify_list.length}}项）
              a.f-14.m-l-20(v-if="goodserve_list.length != 0", @click="lookupGoods") （已选{{goodserve_list.length}}项）
              a.f-14.m-l-20(v-if="cards_list.length != 0", @click="lookupCards") （已选{{cards_list.length}}项）
            .box-tips(v-if="use_type.id == 1") 温馨提示：通用优惠券适用于常规购买商品服务和线下买单（不包含拼团、秒杀和养护卡）
            .box-tips(v-if="use_type.id == 2") 温馨提示：可以选择优惠券在商品和服务分类中指定的分类，支持多选。
            .box-tips(v-if="use_type.id == 3") 温馨提示：可以选择优惠券适用的具体商品和服务，支持多选。
            .box-tips(v-if="use_type.id == 4") 温馨提示：可以选择优惠券适用的指定养护卡，支持多选。

            .field.is-horizontal.time
              label.label 设置有效期
              div.type-item
                .radio
                  input(type="radio", v-model="send.effective_type", id="yx-1", value=3)
                  label.sepcific-setting(for="yx-1") 无限制
              div.type-item
                .radio
                  input(type="radio", v-model="send.effective_type", id="yx-2", value=2)
                  label.sepcific-setting(for="yx-2") 自领取日起
                  custom-input.custom-input.m-l-r.m(input-type="hasUnit", need-type="number", v-model="send.effective_days", placeholder="有效天数", :isDisabled="send.effective_type == 1 || send.effective_type == 3", maxlength="3", :validator="$v.send.effective_days", error-info="请填写大于0的整数")
                    span(slot="unitName") 天
                  span.f-14 有效
              div.type-item
                .radio.w-340
                  input(type="radio", v-model="send.effective_type", id="yx-3", value=1)
                  label.sepcific-setting(for="yx-3")
                  .control.m
                    date-picker(type="range", placeholder="选择日期区间", :isDisabled="send.effective_type == 2 || send.effective_type == 3", v-model="rang_time")
                    //- v-model="rang_time", :validator="$v.rang_time", error-info="请选择时间"
            
            .field.is-horizontal
              label.label 备注
              custom-textarea(placeholder="请输入备注，最多50个字符", v-model="send.remark", maxlength="50")

            //- 是否是重复领取 
            .field.is-horizontal(v-if="currt_type.type != 2")
              label.label 重复领取
              .switch
                input(type="checkbox", id="rep", v-model="is_repeat")
                label(for="rep")
                span.red (车主客户可以在领券中心和商品服务详情页重复领取该优惠券)

            //- 每日领取上限
            .field.is-horizontal(v-if="currt_type.type != 2")
              label.label 每日领取上限
              custom-input.custom-input(input-type="hasUnit", placeholder="领取上限", maxlength="2", need-type="number", v-model="send.day_max", :isDisabled="!is_repeat", :validator="$v.send.day_max", error-info="请填写1-20之间的整数")
                span(slot="unitName") 次
            
            .field.is-horizontal
              label.label 展示开关
              .switch
                input(type="checkbox", id="open", v-model="is_show")
                label(for="open")
                span.red(v-show="currt_type.type !== 2") (开启后，领券中心、商品服务详情页都展示)
                span.red(v-show="currt_type.type == 2") (开启后，领券中心页将展示) 
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="formatting") 保存
          a.button.large(@click="goBack") 取消
</template>

<script>
import Api from '@/mixins/modules/marketing'
import CustomInput from '@/components/generics/form/CustomInput'
import DatePicker from '@/components/generics/form/DatePicker'
import CustomSelect from '@/components/generics/form/CustomSelect'
import CustomTextarea from '@/components/generics/form/CustomTextarea'
import ServiceTab from '@/components/generics/ServiceTab'
import ChooseCommodity from '@/components/marketing/modal/ChooseCommodity'
import ChooseClassify from '@/components/marketing/modal/ChooseClassify'
import ChooseCard from '@/components/marketing/modal/ChooseUpkeepCardModal'
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import FormateDate from '@/mixins/utilities/formateDate'
export default {
  name: 'couponCreation',
  mixins: [validationMixin, Api, FormateDate],
  components: {
    CustomInput,
    DatePicker,
    CustomSelect,
    CustomTextarea,
    ServiceTab,
    ChooseCommodity,
    ChooseClassify,
    ChooseCard,
  },
  data () {
    return {
      is_edit: false,                          // 是否是编辑
      currt_type: {name: '代金券', type: 1},
      coupon_type: [
        {name: '代金券', type: 1},
        {name: '兑换券', type: 2},
        {name: '满减券', type: 3},
        {name: '折扣券', type: 4},
      ],
      show_goodserve: false,                    // 是否显示选择商品&服务弹框
      show_classify: false,                     // 是否显示选择商品分类&服务分类弹框
      show_cards: false,                        // 是否显示选择养护卡弹框
      use_type: {id: 1, name: '小程序商城通用'},
      use_scope: [
        {id: 1, name: '小程序商城通用'},
        {id: 2, name: '指定分类'},
        {id: 3, name: '指定商品/服务'},
        {id: 4, name: '指定养护卡'},
      ],
      rang_time: '',                             // 时间段
      is_repeat: false,                          // 是否重复领取选择
      is_show: true,                             // 是否在小程序展示选择
      goodserve_list: [],                        // 已选中的商品&服务
      classify_list: [],                         // 已选中的商品分类&服务分类
      cards_list: [],                            // 已选中的养护卡
      send: {
        coupon_name: '',                         // 优惠券名称
        coupon_use_type: null,                   // 优惠券使用范围
        effective_type: 3,                       // 有效时间类型（1固定时间段，2固定天数,3无期限）
        coupon_type: null,                       // 优惠券类型
        discount_amount: '',                     // 优惠金额
        effective_days: '',                      // effective_type=2时填写的天数
        start_time: 0,                           // effective_type=1时填写开始时间
        end_time: 0,                             // effective_type=1时填写结束时间
        condition_value: '',                     // 优惠券使用条件值（为0表示无限制）
        use_range: [],                           // 商品或者分类id集合(一维数组)
        is_repeat: 1,                            // 是否可重复领取（1：是，2：否）
        is_show: 1,                              // 是否在小程序展示（1：是，2：否）
        remark: '',                              // 备注
        day_max: '',                             // 重复领取上线
      },
      is_click: null,
    }
  },
  watch: {
    'use_type' (val) {
      // 使用范围改变后，清空列表
      this.goodserve_list = []
      this.classify_list = []
      this.cards_list = []
    },
    rang_time (val) {
      let start = 0    // 开始时间
      let endtime = 0  // 结束时间
      if (val !== '') {
        let time = this.rang_time.split('至')
        let oo = new Date(time[0].replace(/-/g, '/') + ' 00:00')
        let qq = new Date(time[1].replace(/-/g, '/') + ' 23:59:59')
        start = oo.getTime() / 1000
        endtime = qq.getTime() / 1000
      }
      this.send.start_time = start
      this.send.end_time = endtime
    },
  },
  validations: {
    send: {
      coupon_name: {
        required,
      },
      discount_amount: {
        required,
        validate (val, data) {
          if (this.currt_type.type === 2 || this.currt_type.type === 1 || this.currt_type.type === 3) {
            let num = val - 0
            return /^[1-9]\d*$/.test(num)
          }
          if (this.currt_type.type - 0 === 4) {
            if (val - 0 >= 10) return false
            return /^([1-9]\d*)(\.[1-9]{1})?$/.test(val)
          }
          return true
        },
      },
      condition_value: {
        validate (val, data) {
          if (this.currt_type.type - 0 === 3 || this.currt_type.type - 0 === 4) {
            return /^[1-9]\d*$/.test(val)
          }
          return true
        },
      },
      effective_days: {
        validate (val, data) {
          if (this.send.effective_type - 0 === 2) {
            return /^[1-9]\d*$/.test(val)
          }
          return true
        },
      },
      day_max: {
        validate (val, data) {
          if (this.is_repeat) {
            if (val !== '') {
              return val <= 20 && val >= 1
            }
          }
          return true
        },
      },
    },
  },
  methods: {
    // tab切换 需要重置部分数据
    checkCouponType (e) {
      if (this.is_click.type === e.type) return
      this.$v.$reset()                                // 重置验证
      this.use_type.id = 1
      this.rang_time = ''                             // 时间段
      this.is_repeat = false                          // 是否重复领取选择
      this.is_show = true                             // 是否在小程序展示选择
      this.goodserve_list = []                        // 已选中的商品&服务
      this.classify_list = []                         // 已选中的商品分类&服务分类
      this.cards_list = []                            // 已选中的养护卡
      this.use_type = {id: 1, name: '小程序商城通用'}
      this.use_scope = [
        {id: 1, name: '小程序商城通用'},
        {id: 2, name: '指定分类'},
        {id: 3, name: '指定商品/服务'},
      ]
      if (e.type === 1 || e.type === 3) {
        this.use_scope = [...this.use_scope, ...[{id: 4, name: '指定养护卡'}]]
      }
      this.send = {
        coupon_name: '',                         // 优惠券名称
        coupon_use_type: null,                   // 优惠券使用范围
        effective_type: 3,                       // 有效时间类型（1固定时间段，2固定天数,3无期限）
        coupon_type: null,                       // 优惠券类型
        discount_amount: '',                     // 优惠金额
        effective_days: '',                      // effective_type=2时填写的天数
        start_time: 0,                           // effective_type=1时填写开始时间
        end_time: 0,                             // effective_type=1时填写结束时间
        condition_value: '',                     // 优惠券使用条件值（为0表示无限制）
        use_range: [],                           // 商品或者分类id集合(一维数组)
        is_repeat: 1,                            // 是否可重复领取（1：是，2：否）
        is_show: 1,                              // 是否在小程序展示（1：是，2：否）
        remark: '',                              // 备注
        day_max: '',                             // 重复领取上线
      }
      this.is_click = e
    },
    /**
     *  选中的商品&服务回调
     */
    addGoodTrue (list) {
      this.goodserve_list = list
    },
    /**
     * 选中的商品分类&服务分类回调
     */
    addClassifTrue (list) {
      console.log(list)
      this.classify_list = list
    },
    /**
     * 选中的养护卡回调
     */
    addCardsTrue (list) {
      this.cards_list = list
    },
    // 显示商品分类服务分类弹框
    lookupClassify () {
      this.show_classify = true
    },
    // 显示商品服务弹框
    lookupGoods () {
      this.show_goodserve = true
    },
    // 显示养护卡选择弹框
    lookupCards () {
      this.show_cards = true
    },
    // 格式化数据
    formatting () {
      // 数据和格式化
      this.send.coupon_type = this.currt_type.type   // 优惠券类型
      this.send.coupon_use_type = this.use_type.id   // 优惠券使用范围
      this.send.effective_type = this.send.effective_type - 0
      if (this.send.coupon_use_type === 3 && this.goodserve_list.length !== 0) {
        this.send.use_range = this.goodserve_list.map(item => {
          return item.product_id
        })
      }
      if (this.send.coupon_use_type === 2 && this.classify_list.length !== 0) {
        this.send.use_range = this.classify_list
      }
      if (this.send.coupon_use_type === 4 && this.cards_list.length !== 0) {
        this.send.use_range = this.cards_list.map(item => {
          return item.upkeep_id
        })
      }
      if (this.currt_type.type === 2) this.is_repeat = false
      this.send.is_repeat = this.is_repeat ? 1 : 2
      this.send.is_show = this.is_show ? 1 : 2
      // 数据校验
      this.$v.$touch()
      if (this.$v.$error) return false
      let timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000   // 获取当天0点的时间戳
      if (this.use_type.id === 2 && this.classify_list.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请选择指定分类项目',
        })
        return false
      }
      if (this.use_type.id === 3 && this.goodserve_list.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请选择指定商品/服务项目',
        })
        return false
      }
      if (this.use_type.id === 4 && this.cards_list.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请选择指定养护卡',
        })
        return false
      }
      if (this.send.effective_type - 0 === 1 && this.send.start_time === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请选择日期区间',
        })
        return false
      }
      if (this.send.effective_type - 0 === 1 && this.send.start_time !== 0 && this.send.start_time < timeStamp) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '优惠券有效的开始日期不能小于当天日期',
        })
        return false
      }
      if (this.send.effective_days === '') this.send.effective_days = 0
      if (this.send.condition_value === '') this.send.condition_value = 0
      if (this.currt_type.type - 0 === 3 && this.send.discount_amount - this.send.condition_value > 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '优惠金额不能大于满减金额',
        })
        return false
      }
      this.is_edit ? this.editData() : this.commitData()
    },
    // 创建优惠券
    async commitData () {
      try {
        console.log(this.send)
        const {response, result} = await this.createCouponApi(this.send)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '优惠券创建成功',
            resolve: () => {
              this.$router.go(-1)
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '优惠券创建失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取优惠券详情
    async fetchDetail () {
      try {
        const {response, result} = await this.getCouponApi({couponId: this.$route.query.coupom_id})
        if (response.status === 200 && result.code === 0) {
          // 返回数据进行格式化
          setTimeout(() => {
            if (result.data.coupon_use_type === 2) {
              // 指定分类的数据格式和其他两个不一样
              this.classify_list = result.data.use_range.map(v => {
                return v.category_id
              })
            }
            if (result.data.coupon_use_type === 3) {
              this.goodserve_list = result.data.use_range
            }
            if (result.data.coupon_use_type === 4) {
              this.cards_list = result.data.use_range
            }
          }, 100)
          this.send = {
            coupon_id: result.data.coupon_id,                            // 优惠券id
            coupon_name: result.data.coupon_name,                        // 优惠券名称
            coupon_use_type: result.data.coupon_use_type,                // 优惠券使用范围
            effective_type: result.data.effective_type,                  // 有效时间类型（1固定时间段，2固定天数,3无期限）
            coupon_type: result.data.coupon_type,                        // 优惠券类型
            discount_amount: result.data.discount_amount / 100,          // 优惠金额
            effective_days: result.data.effective_days,                  // effective_type=2时填写的天数
            start_time: result.data.start_time,                          // effective_type=3时填写开始时间
            end_time: result.data.end_time,                              // effective_type=3时填写结束时间
            condition_value: result.data.condition_value / 100,          // 优惠券使用条件值（为0表示无限制）
            use_range: [],                                               // 商品或者分类id集合(一维数组)
            is_repeat: result.data.is_repeat,                            // 是否可重复领取（1：是，2：否）
            is_show: result.data.is_show,                                // 是否在小程序展示（1：是，2：否）
            remark: result.data.remark,                                  // 备注
            day_max: result.data.day_max,
          }
          let dept = this.use_scope.find(v => v.id === this.send.coupon_use_type) || {}
          this.$refs.useType.selectCandidate(dept)
          result.data.user_limit === 1 ? this.is_repeat = false : this.is_repeat = true
          result.data.is_show === 1 ? this.is_show = true : this.is_show = false
          if (result.data.effective_type === 1) this.rang_time = this.formateDate(result.data.start_time, false, 2) + '至' + this.formateDate(result.data.end_time, false, 2)
          if (result.data.effective_type !== 2) this.send.effective_days = ''
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取优惠券详情失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取优惠券详情失败',
          content: '服务异常，请稍后再试',
        })
      }
    },
    // 编辑优惠券
    async editData () {
      try {
        const {response, result} = await this.editCouponApi(this.send)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '优惠券编辑成功',
            resolve: () => {
              this.$router.go(-1)
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '优惠券编辑失败',
          content: `错误：${err}`,
        })
      }
    },

    // 返回
    goBack () {
      this.$router.go(-1)
    },
  },
  mounted () {
    // 优惠券编辑时，动态生成tab
    this.is_click = {name: '代金券', type: 1}
    if (!this.$route.query.type) return
    let type = this.$route.query.type - 0
    let name = ''
    if (type === 1) name = '代金券(编辑)'
    if (type === 2) name = '兑换券(编辑)'
    if (type === 3) name = '满减券(编辑)'
    if (type === 4) name = '折扣券(编辑)'
    if (type === 2 || type === 4) {
      this.use_scope = [
        {id: 1, name: '小程序商城通用'},
        {id: 2, name: '指定分类'},
        {id: 3, name: '指定商品/服务'},
      ]
    }
    this.coupon_type = [{name: name, type: type}]
    this.currt_type = {name: name, type: type}
    this.is_click = {name: name, type: type}
    this.is_edit = true
    this.fetchDetail()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';

.section-layout >>>.status-list ul {
  justify-content: left;
  padding-left: 20px;
  background-color: #ffffff;
}

.red {
  color: red;
  font-size: 12px;
  margin-left: 20px;
  padding-top: 4px;
}

.m-l-r {
  margin: 0 10px;
}

.span {
  font-size: 13px;
}

.box-tips {
  line-height: 50px;
  width: 700px;
  color: red;
  padding-left: 120px;
  font-size: 13px;
}

.m-l-20 {
  margin-left: 20px;
}

.form-wrapper >>> .field {
  width: 700px;
}

.field.is-horizontal .custom-input {
  flex: 0 1 120px;
}

.last-part {
  min-height: 120px;
}

.type-item {
  display: inline-flex;
  min-width: 88px;
  // margin-right 24px
}

.condition-setting {
  display: inline-flex;
  align-items: center;
}

.condition-input {
  margin: 0 8px;
  width: 100px;
}

.shop-categroy-picker {
  margin-left: 8px;
  width: 150px;
}

.field.is-horizontal .m {
  margin: -8px 8px;
}

.f-14 {
  font-size: 13px;
  line-height: 15px;
}

.small {
  height: 32px;
  line-height: 32px;
  margin-left: 20px;
}
</style>
