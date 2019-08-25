<template lang="pug">
  .content
    .page-title 养护卡详情
    .nav-back-btn(@click="goBack")
    service-tab.top-nav( v-model="tab", :tabs="tab_list", :have-icon="false", :have-quantity="false", @input="changeTab(tab.type)")
    .section-layout.section-layout01(v-if="tab.type=='0'")
      .content-wrapper
        .section-setting.tops
          h2.level.header-wrapper
            .level-left
              .icon.user-info-icon-wrapper
                .user-info-icon
              .header-title 基本信息
          .level.level-content
            .level-left
              .form-wrapper
                .field-group
                  .field.is-horizontal
                    label.label(v-text="detail.info.type === 1 && detail.info.from === 2 ? '默认名称' : '名称'")
                    .labelname(v-text="detail.info.type === 1 && detail.info.from === 2 ? detail.info.origin_name : detail.info.name")
                  .field.is-horizontal(v-if="detail.info.type === 1 && detail.info.from === 2")
                    label.label 自定义名称
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
                    label.label 图文详情
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
        .btn-wrapper
          .button-group
            a.button.large(@click="goBack") 返回

    .section-layout.section-layout02(v-if="tab.type=='1'")
      .section-filter
        .field-group.is-horizontal
          .field
            label.label 关键字搜索
            custom-input(v-model="filter_data.keyword", placeholder="搜索名称", @keyupEnter="applyFilter")
          .field
            label.label 分类
            goods-services-select(@success="getClassify" ref="child")
          .field
            a.button.primary(@click="applyFilter") 搜索
          .field
            a.button(@click="resetFilter") 重置
      empty-page(v-if="!(goods_list && goods_list.length) && is_initiated", :tip="'当前没有关联商品/服务'")
      .content-wrapper.list-wrapper(v-if="goods_list && goods_list.length")
        .table-wrapper
          table.table
            thead
              tr
                td(width="80") 图片
                td(width="80") 名称
                td(width="80") 类型
                td(width="50") 分类
            tbody(v-if="goods_list.length")
              tr(v-for="(item, index) in goods_list")
                td
                  .multi-content-td.has-image
                    .left-image
                      img(:src="item.image_url")

                td
                  .simple-td {{item.name}}
                td
                  .simple-td {{item.type==1 ? '商品':'服务'}}
                td
                  .simple-td {{item.category_name_one}}/{{item.category_name_two}}
</template>

<script>
  import ServiceTab from '@/components/generics/ServiceTab'
  import EmptyPage from '@/components/generics/EmptyPage'
  import filterTools from '@/mixins/utilities/filterTools'
  import CustomInput from '@/components/generics/form/CustomInput'
  import GoodsServicesSelect from '@/components/productService/modal/GoodsServicesSelect'
  import OpenImage from '@/components/generics/OpenImage'
  import ProductServiceMixin from '@/mixins/modules/productService'
  export default {
    name: 'cardManagementDetail',
    mixins: [filterTools, ProductServiceMixin],
    components: {
      ServiceTab,
      EmptyPage,
      CustomInput,
      GoodsServicesSelect,
      OpenImage,
    },
    data () {
      return {
        tab_list: [{
          name: '卡片信息',
          type: '0',
        }, {
          name: '关联商品(0)',
          type: '1',
        }],
        tab: {
          name: '卡片信息',
          type: '0',
        },
        detail: {
          info: {
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
        project_list: [], // 项目列表
        project: [],
        goods_list: [], // 关联商品列表
        search_classify: [], // 关联商品列表选择的商品服务分类
        filter_data: {
          keyword: '',
        },
        is_initiated: false,
        type: this.$route.query.type - 0, // 卡片类型
      }
    },
    methods: {
      // 切换顶部tab
      changeTab (type) {
        this.tab = this.tab_list[type]
      },
      // 返回
      goBack () {
        this.$router.go(-1)
      },
      // 选择商品服务分类组件回调
      getClassify (val) {
        this.search_classify = val
      },
      // 关联商品列表的搜索按钮
      applyFilter () {
        this.getGoodList()
      },
      // 关联商品列表的重置
      resetFilter () {
        this.filter_data.keyword = ''
        this.search_classify = []
        this.$refs.child.parentMsg()
        this.getGoodList()
      },
      // 获取关联商品服务列表
      async getGoodList () {
        // 接口传参格式化
        let params = {
          id: this.id,
          name: this.filter_data.keyword,
        }
        if (this.search_classify.length > 1) params.type = this.search_classify[0]
        if (this.search_classify.length > 2) params.category_id_one = this.search_classify[1]
        if (this.search_classify.length > 2 && this.search_classify[2] !== 0) params.category_id_two = this.search_classify[2]
        try {
          const {response, result} = await this.upkeepProductApi(params)
          if (response.status === 200 && result.code === 0) {
            this.goods_list = result.data
            this.is_initiated = true
            this.tab_list[1].name = '关联商品(' + result.data.length + ')'
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取关联商品列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取关联商品列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 获取养护卡详情
      async getCardDetail () {
        try {
          const {response, result} = await this.upkeepDetailApi({
            id: this.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.detail = result.data
            this.detail.info.price = this.detail.info.price / 100
            this.detail.info.origin_price = this.detail.info.origin_price / 100
            this.detail.info.max_price = this.detail.info.max_price / 100
            if (this.$route.query.type - 0 === 1) {
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
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡详情失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      this.id = this.$route.query.id
      if (this.$route.query.type - 0 === 1) {
        this.tab_list = [{
          name: '卡片信息',
          type: '0',
        }]
      } else {
        this.getGoodList() // 获取关联商品服务列表
      }
      this.getCardDetail() // 获取养护卡详情
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
  height calc(100% - 120px)
.section-layout02
  overflow-y auto
  height calc(100% - 120px)
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
  top 72px
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

