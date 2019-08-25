<template lang="pug">
  .content
    card-goods-modal(v-model="show_card_goods" v-if="show_card_goods", type="1" :id="(need_pid - 0 === 2 || detail.info.pid === 0) ? card_id : detail.info.pid", :need_type="detail.info.pid === 0 && is_edit")
    .nav-back-btn(@click="goBack")
    service-tab.top-nav( v-model="tab", :tabs="tab_list", :have-icon="false", :have-quantity="false", @input="changeTab(tab.type)")
    .section-layout.section-layout01(v-if="tab.type=='0'")
      .content-wrapper
        .section-setting.tops
          h2.level.header-wrapper
            .level-left
              .icon.user-info-icon-wrapper
                .user-info-icon
              .header-title 添加秒杀养护卡
          .level.level-content
            .level-left
              .form-wrapper
                .field-group
                  .field.is-horizontal
                    label.label 开始时间
                    date-picker(type="singleWithTime", v-model="start_time", :options="startTimeOptions", error-info="请选择秒杀开始时间", :validator="$v.start_time")
                  .field.is-horizontal
                    label.label 结束时间
                    date-picker(type="singleWithTime", v-model="end_time", :options="endTimeOptions", error-info="请选择秒杀结束时间", :validator="$v.end_time")
                  .field.is-horizontal
                    label.label 限购数量
                    .limit-num
                      custom-input(input-type="hasUnit", placeholder="请输入限购数量", v-model="limit_number", error-info="请输入大于0小于99999的整数", :validator="$v.limit_number", need-type="number")
                        span(slot="unitName") 件/人
                  .field.is-horizontal
                    label.label 名称
                    .labelname {{detail.info.name}}
                  .field.is-horizontal
                    label.label 卡面
                    open-image(v-if="detail.info.image_url", img-type="1", :img-url="detail.info.image_url",key-name="",mini-width="161",mini-height="100",margin-bottom="0", margin-right="5", border-radius="5")
                  .field.is-horizontal
                    label.label 分类
                    .labelname {{detail.info.category_name}}
                  .field.is-horizontal(v-if="type !== 1")
                    label.label 使用次数
                    .labelname {{detail.info.num}}次
                  .field.is-horizontal
                    label.label 销售价格
                    .labelname {{detail.info.price}}元
                  .field.is-horizontal
                    label.label 卡片原价
                    .labelname {{detail.info.origin_price}}元
                  .field.is-horizontal
                    label.label 秒杀价格
                    .sku-price
                      custom-input(input-type="hasUnit", placeholder="请输入秒杀价格", v-model="limit_price", error-info="请输入大于0小于99999的价格精确到小数点后2位", :validator="$v.limit_price", need-type="float")
                        span(slot="unitName") 元
                  .field.is-horizontal
                    label.label 活动数量
                    .sku-price
                      custom-input(input-type="hasUnit", placeholder="请输入活动数量", v-model="inventory_total", error-info="请输入大于0小于99999的整数", :validator="$v.inventory_total", need-type="number")
                        span(slot="unitName") 件
                  .field.is-horizontal(v-if="type !== 1")
                    label.label 关联商品
                    a.button.primary.large(@click="showGoods") 查看关联商品
        .btn-wrapper
          .button-group
            a.button.primary.large(@click="saveData",) 保存并开始
            a.button.large(@click="goBack") 取消

    .section-layout.section-layout02(v-if="tab.type=='1'")
      .section-filter
        .section-setting
          h2.level.header-wrapper
            .level-left
              .icon.user-info-icon-wrapper
                .user-info-icon
              .header-title 图文详情
          .level.level-content
            .level-left
              .form-wrapper
                .field-group
                  open-image(v-if="detail.info.content", img-type="1",:img-url="detail.info.content",key-name="",mini-width="161",mini-height="100",margin-bottom="0", margin-right="5", border-radius="5")
        .section-setting
          h2.level.header-wrapper
            .level-left
              .icon.user-info-icon-wrapper
                .user-info-icon
              .header-title 使用须知
          .level.level-content
            .level-left
              .form-wrapper
                .field-group
                  .field.is-horizontal
                    label.label 有效期
                    .labelname {{detail.info.expiry}}月
                  .field.is-horizontal
                    label.label 使用规则
                    .labelname(v-if="detail.info.description", v-html="detail.info.description")
                    .labelname(v-else) --
        .section-setting
          h2.level.header-wrapper
            .level-left
              .icon.user-info-icon-wrapper
                .user-info-icon
              .header-title 卡内项目
          empty-page(v-if="!project_list.length", :tip="'暂无项目'",style={'margin-top':'40px','margin-bottom':'40px'})
          .table-wrapper.bottom-none(style={'border-bottom':'8px solid #f0f1f2','margin-bottom':'13px'},v-if="project_list.length")
            table.table.table_cleardefault
              thead
                tr
                  td(width="80") 项目名称
                  td(width="150") 项目描述
                  td(width="100") 次数
                  td(width="50" v-if="type !== 1") 是否为最终项目
              tbody
                tr(v-for="(item, index) in project_list")
                  td
                    .simple-td {{item.name}}
                  td
                    .simple-td {{item.description}}
                  td
                    .simple-td {{item.num == 0 ? '无限次':item.num + '次'}}
                  td(v-if="type !== 1")
                    .simple-td {{item.is_end == 1 ? '是': '否'}}
        .section-setting(v-if="type !== 1")
          h2.level.header-wrapper
            .level-left
              .icon.user-info-icon-wrapper
                .user-info-icon
              .header-title 免激活项目
          empty-page(v-if="!project.length", :tip="'免激活项目'",style={'margin-top':'40px','margin-bottom':'40px'})
          .table-wrapper.bottom-none(style={'border-bottom':'8px solid #f0f1f2','margin-bottom':'13px'},v-if="project.length")
            table.table.table_cleardefault
              thead
                tr
                  td(width="80") 项目名称
                  td(width="150") 项目描述
                  td(width="100") 次数（未填写视为不限次）
                  td(width="50") 月份
              tbody
                tr(v-for="(item, index) in project")
                  td
                    .simple-td {{item.name}}
                  td
                    .simple-td {{item.description}}
                  td
                    .simple-td {{item.num == 0 ? '无限次':item.num + '次'}}
                  td
                    .simple-td {{item.expiry}}
</template>

<script>
  import DatePicker from '@/components/generics/form/DatePicker'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import ServiceTab from '@/components/generics/ServiceTab'
  import EmptyPage from '@/components/generics/EmptyPage'
  import filterTools from '@/mixins/utilities/filterTools'
  import CustomInput from '@/components/generics/form/CustomInput'
  import OpenImage from '@/components/generics/OpenImage'
  import ProductServiceMixin from '@/mixins/modules/productService'
  import CardGoodsModal from '@/components/customer/CardGoodsModal'
  import Api from '@/mixins/modules/Spike'
  import {priceFormat, quantityFormat} from '@/mixins/custom-validators/custom-validators'
  import {validationMixin} from 'vuelidate'
  import {required, between} from 'vuelidate/lib/validators'
  export default {
    name: 'spikeCard',
    mixins: [filterTools, ProductServiceMixin, validationMixin, Api],
    components: {
      ServiceTab,
      EmptyPage,
      CustomInput,
      OpenImage,
      CardGoodsModal,
      CustomSelect,
      DatePicker,
    },
    validations: {
      start_time: {
        required,
      },
      end_time: {
        required,
      },
      inventory_total: {
        required,
        between: between(1, 99999),
        validate (val) {
          return val && quantityFormat(val)
        },
      },
      limit_number: {
        required,
        between: between(1, 99999),
        validate (val) {
          return val && quantityFormat(val)
        },
      },
      limit_price: {
        required,
        between: between(0.01, 99999),
        priceFormat,
      },
    },
    data () {
      return {
        start_time: '', // 开始时间
        end_time: '', // 结束时间
        limit_price: '', // 秒杀价格
        limit_number: '', // 限制数量
        inventory_total: '', // 活动数量
        // 选择时分默认
        endTimeOptions: {
          defaultHour: 23,
          defaultMinute: 59,
          minuteIncrement: 1,
        },
        startTimeOptions: {
          defaultHour: 0,
          defaultMinute: 0,
          minuteIncrement: 1,
        },
        tab_list: [{
          name: '添加秒杀养护卡',
          type: '0',
        }, {
          name: '查看卡详情',
          type: '1',
        }],
        tab: {
          name: '添加秒杀养护卡',
          type: '0',
        },
        card_id: this.$route.query.id,
        need_pid: 1,
        is_edit: 2,
        detail: {
          info: {
            pid: '',
            id: null,
            name: '',
            image_url: '',
            category_id: null,
            category_name: '',
            num: null,
            price: null,
            max_price: null,
            origin_price: null,
            content: '',
            expiry: null,
            begin_time: '',
            end_time: '',
            description: '',
          },
          item: [],
        },
        show_card_goods: false,
        project_list: [], // 项目列表
        project: [],
        filter_data: {
          keyword: '',
        },
        is_initiated: false,
        type: 0, // 卡片类型
      }
    },
    methods: {
      saveData () {
        this.$v.$touch()
        if (this.$v.start_time.$error || this.$v.end_time.$error || this.$v.limit_number.$error) {
          document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
          return
        }
        if (this.$v.$error) {
          return
        }
        let nowTime = Date.parse(new Date()) / 1000
        let time = this.start_time
        time = (new Date(time.replace(/-/g, '/'))).getTime() / 1000
        if (nowTime > time) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '创建秒杀失败',
            content: '开始时间要大于当前时间',
          })
          return
        }
        let time2 = this.end_time
        time2 = (new Date(time2.replace(/-/g, '/'))).getTime() / 1000
        if (time > time2) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '创建秒杀失败',
            content: '结束时间要大于开始时间',
          })
          return
        }
        let params = {
          start_time: (new Date(this.start_time.replace(/-/g, '/'))).getTime() / 1000,
          end_time: (new Date(this.end_time.replace(/-/g, '/'))).getTime() / 1000,
          product: {
            id: this.card_id,
            name: this.detail.info.name,
            limit_number: this.limit_number - 0,
            inventory_total: this.inventory_total - 0,
            limit_price: this.limit_price * 100,
            category_id: this.detail.info.category_id,
          },
        }
        if (this.detail.info.type === 1) {
          params.product.type = 3
          if (this.detail.info.from === 1) params.product.type = 4
        } else {
          params.product.type = 5
        }
        this.$store.dispatch('showMessage', {
          title: '确认要保存吗',
          isRejectable: 1,
          resolve: () => {
            this.addSpike(params)
          },
        })
      },
      async addSpike (params) {
        try {
          const {response, result} = await this.addCardSpikeApi(params)
          if (response.status === 200) {
            if (result.code === 0 && result.message === 'success') {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '成功',
                content: '秒杀开始成功',
                resolve: () => {
                  this.$router.push({
                    name: 'spikeList',
                  })
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '秒杀开始失败',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '秒杀开始失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error('添加秒杀', err)
        }
      },
      // 查看关联商品
      showGoods () {
        this.show_card_goods = true
      },
      // 切换顶部tab
      changeTab (type) {
        this.tab = this.tab_list[type]
      },
      // 返回
      goBack () {
        this.$router.replace({
          name: 'spikeList',
          query: {
            save: 1
          },
        })
      },
      // 获取养护卡详情
      async getCardDetail () {
        try {
          const {response, result} = await this.upkeepDetailApi({
            id: this.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.detail = result.data
            this.type = result.data.info.type - 1
            this.detail.info.price = this.detail.info.price / 100
            this.detail.info.origin_price = this.detail.info.origin_price / 100
            this.detail.info.max_price = this.detail.info.max_price / 100
            if (this.type - 0 === 1) {
              this.project_list = this.detail.item.map(item => {
                item.price = parseInt(item.price) / 100
                return item
              })
            } else {
              let arr = []
              let brr = []
              result.data.item.forEach(v => {
                v.num === 0 ? v.num = '' : v.num = v.num
                v.is_end === 1 ? v.is_end = true : v.is_end = false
                if (v.type === 1) {
                  arr.push(v)
                } else {
                  brr.push(v)
                }
              })
              this.project_list = arr
              this.project = brr
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡详情失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '养护卡')
        }
      },
    },
    mounted () {
      this.id = this.$route.query.id
      this.getCardDetail() // 获取养护卡详情
      console.log(this.type)
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .content
    height calc(100% - 56px)
    position relative
  .page-title
    font-size: 20px;
    padding-left: 24px;
    height: 60px;
    line-height: 60px;
  .top-nav
    display: flex;
    flex: 0 0 48px;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 48px;
    margin: 0 24px;
    background-color: inherit;
    z-index: 8;
  .content-wrapper
    padding-top 0px
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
  .blue
    color #2FABDD
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
  .section-layout01
    overflow-y auto
    height calc(100% - 62px)
  .section-layout02
    overflow-y auto
    height calc(100% - 62px)
  .section-setting
    + .section-setting
      margin-top 16px
    background #ffffff
    padding-bottom 24px
  .sheng
    margin-top 0 !important
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
  .level-left  .field
    margin-left 30px
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
  .form-wrapper_clearmargin
    margin 0
    padding 0
  .form-wrapper-zhigong
    padding-left 0
    padding-right 0
    padding-bottom 15px
  .form-wrapper-zhigong .field-group
    flex-direction row
    align-items center
  .form-wrapper-zhigong .field-group.field_m_t_0
    margin-top 5px
  .form-wrapper-zhigong .field-group .field
    width 350px
    margin-top 0
  .form-wrapper-zhigong .field-group .field_200px
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
    &:last-child
      margin-top 10px
  .radio label
    padding-left 32px
  .checkbox
    width 230px
    height auto
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
    background-color #ffffff
    padding 20px 0 20px 116px
    border-top 1px solid rgba(0,0,0,0.08)
  .nav-back-btn
    position absolute
    top 10px
    left 15px
    width 32px
    height 32px
    border-radius 100%
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
    cursor pointer
    z-index 9
  .table.table_cleardefault
    padding 0 20px
    border-spacing 0 0
  .table.table_cleardefault thead tr
    background-color #fff
    padding 14px 0
  .table.table_cleardefault thead tr td
    padding 8px 0 8px 0
    border-bottom 1px solid rgba(48,48,48,0.1)
  .table.table_cleardefault thead tr td:first-child
    padding-left 14px
  .table.table_cleardefault tbody tr td
    border-bottom 1px solid rgba(48,48,48,0.1)
  .table.table_cleardefault tbody tr:last-child td
    border-bottom 0
  .table_cleardefault.table tbody tr:hover
    box-shadow none
    td:first-child
      border-left 2px solid #fff
  .bottom-none
    border-bottom none !important
</style>
