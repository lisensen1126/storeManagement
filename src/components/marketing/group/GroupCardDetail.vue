<template lang="pug">
  .content
    card-good-modal(v-model="show_card_goods" v-if="show_card_goods", :id="id")
    .nav-back-btn(@click="goBack")
    service-tab.top-nav( v-model="tab", :tabs="tab_list", :have-icon="false", :have-quantity="false", @input="changeTab(tab.type)")
    .section-layout.section-layout01(v-if="tab.type=='0'")
      .content-wrapper
        .section-setting.tops
          h2.level.header-wrapper
            .level-left
              .icon.user-info-icon-wrapper
                .user-info-icon
              .header-title 查看拼团详情
          .level.level-content
            .level-left
              .form-wrapper
                .field-group
                  .field.is-horizontal
                    label.label 名称
                    .labelname {{detail.info.name}}
                  .field.is-horizontal
                    label.label 卡面
                    open-image(v-if="detail.info.image_url", img-type="1", :img-url="detail.info.image_url",key-name="",mini-width="161",mini-height="100",margin-bottom="0", margin-right="5", border-radius="5")
                  .field.is-horizontal
                    label.label 分类
                    .labelname {{detail.info.category_name}}
                  .field.is-horizontal(v-if="type === 1")
                    label.label 使用次数
                    .labelname {{detail.info.num}}次
                  .field.is-horizontal.custom-select
                    label.label 成团人数
                    .labelname(v-text="num + '人'")
                  .field.is-horizontal.custom-select
                    label.label 成团有效期
                    .labelname(v-text="time + '小时'")
                  .field.is-horizontal
                    label.label 销售价格
                    .labelname {{detail.info.price}}元
                  .field.is-horizontal
                    label.label 卡片原价
                    .labelname {{detail.info.origin_price}}元
                  .field.is-horizontal
                    label.label 拼团价格
                    .labelname(v-text="group_price + '元'")
                  .field.is-horizontal(v-if="type === 1")
                    label.label 关联商品
                    a.button.primary.large(@click="showGoods") 查看关联商品
        .btn-wrapper
          .button-group
            a.button.primary.large(v-if="status === 1", @click="changeStatus") 停止
            a.button.large(v-if="status === 2", @click="deleteGroup") 删除

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
                  td(width="50" v-if="type === 1") 是否为最终项目
              tbody
                tr(v-for="(item, index) in project_list")
                  td
                    .simple-td {{item.name}}
                  td
                    .simple-td {{item.description}}
                  td
                    .simple-td {{item.num == 0 ? '无限次':item.num + '次'}}
                  td(v-if="type === 1")
                    .simple-td {{item.is_end == 1 ? '是': '否'}}
        .section-setting(v-if="type === 1")
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
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import ServiceTab from '@/components/generics/ServiceTab'
  import EmptyPage from '@/components/generics/EmptyPage'
  import filterTools from '@/mixins/utilities/filterTools'
  import CustomInput from '@/components/generics/form/CustomInput'
  import OpenImage from '@/components/generics/OpenImage'
  import ProductServiceMixin from '@/mixins/modules/productService'
  import CardGoodModal from '@/components/marketing/modal/CardGoodModal'
  import {required, between} from 'vuelidate/lib/validators'
  import {priceFormat} from '@/mixins/custom-validators/custom-validators'
  import {validationMixin} from 'vuelidate'
  import GroupApi from '@/mixins/modules/Group'
  export default {
    name: 'cardManagementDetail',
    mixins: [filterTools, ProductServiceMixin, validationMixin, GroupApi],
    components: {
      ServiceTab,
      EmptyPage,
      CustomInput,
      OpenImage,
      CardGoodModal,
      CustomSelect,
    },
    validations: {
      group: {
        num: {
          required,
        },
        time: {
          required,
        },
      },
      group_price: {
        required,
        between: between(0.01, 99999),
        priceFormat,
      },
    },
    data () {
      return {
        status: 1,
        num: '',
        time: '',
        group_price: '',
        tab_list: [{
          name: '查看拼团详情',
          type: '0',
        }, {
          name: '查看卡详情',
          type: '1',
        }],
        tab: {
          name: '查看拼团详情',
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
      // 删除拼团服务
      deleteGroup () {
        this.$store.dispatch('showMessage', {
          title: '确认删除吗？',
          isRejectable: 1,
          resolve: () => {
            this.deleteApi()
          },
        })
      },
      // 删除接口
      async deleteApi () {
        let _this = this
        try {
          const {response, result} = await this.groupDeleteApi({
            id: this.$route.query.group_id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                type: 'success',
                title: '删除成功',
                autoClose: true,
              })
              _this.$router.push({
                name: 'mangeList',
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '删除失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          console.error(err, '删除')
        }
      },
      /*
      * 停止开启参团商品
      * */
      changeStatus () {
        let _this = this
        this.$store.dispatch('showMessage', {
          title: `确认${_this.status === 1 ? '停止' : '开始'}吗？`,
          isRejectable: 1,
          resolve: () => {
            this.changeApi()
          },
        })
      },
      /*
      * 开启关闭接口
      * */
      async changeApi () {
        let _this = this
        try {
          const {response, result} = await this.statusChangeApi({
            id: this.$route.query.group_id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              if (result.message === 'success') {
                this.$store.dispatch('showMessage', {
                  type: 'success',
                  title: `${_this.status === 1 ? '停止' : '开始'}成功`,
                  autoClose: true,
                })
                _this.getGroupDatail()
              } else {
                this.$store.dispatch('showMessage', {
                  type: 'failure',
                  title: `${_this.status === 1 ? '停止' : '开始'}失败`,
                })
                return false
              }
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: `${_this.status === 1 ? '停止' : '开始'}失败`,
                content: `出错了：${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: `${_this.status === 1 ? '停止' : '开始'}失败`,
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          console.error(err, '停止结束失败')
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
        this.$router.go(-1)
      },
      // 获取养护卡详情
      async getCardDetail () {
        try {
          const {response, result} = await this.getCardIsoDetailApi({
            id: this.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.detail = result.data
            this.detail.info = result.data
            this.goods_list = result.data.condition
            this.type = result.data.type
            this.detail.info.price = this.detail.price / 100
            this.detail.info.origin_price = this.detail.origin_price / 100
            if (this.type === 2) {
              this.project_list = this.detail.list.map(item => {
                item.price = parseInt(item.price) / 100
                return item
              })
            } else {
              let arr = []
              let brr = []
              result.data.list.forEach(v => {
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
          console.error(err, '养护卡详情')
        }
      },
      async getGroupDatail () {
        try {
          const {response, result} = await this.groupDetailApi({
            id: this.$route.query.group_id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.num = result.data.num
              this.time = result.data.time
              this.group_price = (result.data.product_sku[0].group_price / 100).toFixed(2)
              this.status = result.data.status
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '拼团详情获取失败',
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '拼团详情获取失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '拼团详情')
        }
      },
    },
    mounted () {
      this.id = this.$route.query.id
      this.getCardDetail() // 获取养护卡详情
      this.getGroupDatail() // 获取拼团详情
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


