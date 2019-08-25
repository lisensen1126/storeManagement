<template lang="pug">
  .section-layout
    .content-wrapper
      .columns.is-flex-grow.is-horizontal.space-between
        .column.width-fixed
          .nav-back-btn(@click="navBack")
          .side-info-pannel
            .customer-basic-info-wrapper
              .basic-name(v-if="detail.name") {{detail.name}}
              .basic-info
                .avatar
                  img(:src="detail.image_url")
            .customer-vehicle-info
              .slide-title(style="padding-top: 0")
                .tab-content
                  .tab-content-item
                    .tab-content-block
                      .item-content
                        .profiled.flex(v-if="detail.type === 1")
                          .labeltitle 使用次数:
                          .question-list
                            .question-li(v-if="detail.num") {{detail.num}}次

                        .profiled.flex
                          .labeltitle 分类:
                          .question-list
                            .question-li(v-if="detail.category_name") {{detail.category_name}}

                        .profiled.flex
                          .labeltitle 销售价格:
                          .question-list
                            .question-li(v-if="detail.price") {{detail.price / 100}}元

                        .profiled.flex
                          .labeltitle 卡片原价:
                          .question-list
                            .question-li(v-if="detail.origin_price") {{detail.origin_price / 100}}元
                        .profiled.flex
                          .labeltitle 图文详情:
                          .question-list(v-if="detail.content")
                            open-image(img-type="2",:img-url="detail.content",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="5", border-radius="5")

                        .profiled.flex
                          .labeltitle 使用须知
                          .question-list
                            .question-li

                        .profiled.flex
                          .labeltitle 有效期:
                          .question-list
                            .question-li(v-if="detail.expiry") {{detail.expiry}}个月

                        .profiled.flex
                          .labeltitle 使用规则:
                          .question-list
                            .question-li(v-if="detail.description", v-html="detail.description ? detail.description : ''") 啊三舅的变化阿斯顿

                        .profiled.flex
                          .button.primary(@click="showCardProject") 卡内项目
                          .button.primary(@click="showChangeRecord") 售价变更记录
                          .button.primary(@click="showCardGoods" v-if="detail.type === 1") 关联商品
        .column
          .section-filter
            .field-group.is-horizontal
              .field.keyword-wrapper
                label.label 关键字搜索
                custom-input(placeholder="请输入用户名/手机号", v-model.trim="filterData.keyword", @keyupEnter="applyFilter")
              .field
                label.label 按时间筛选
                .field.is-horizontal
                  date-picker(type="single", placeholder="选择开始时间", v-model="filterData.start_time")
                  span.margin 至
                  date-picker(type="single", placeholder="选择结束时间", v-model="filterData.end_time")
              .field
                label.label 用途
                custom-select(v-model="filterData.way_status", :list="get_ways")
              .field
                a.button.primary(@click="applyFilter") 搜索
              .field
                a.button(@click="resetFilter") 重置
          .main-info-pannel
            empty-page(v-if="list.length === 0", :tip="'暂无销售记录'")
            .content-wrapper.list-wrapper(v-if="list.length > 0 && isInitiated")
              .table-wrapper
                table.table
                  thead
                    tr
                      td(width="140") 用户
                      td(width="120") 手机号
                      td(width="140") 卡号
                      td(width="160") 购买时间
                      td(width="70") 购买数量
                      td(width="70") 销售价格
                      td(width="50") 用途
                      td(width="100") 关联订单
                  tbody
                    tr(v-for="(item, index) in list")
                      td
                        .simple-td.width-fix {{item.name}}
                      td
                        .simple-td {{item.mobile}}
                      td
                        .operation-td(v-if="item.upkeep_no.length > 0")
                          span.operation-link(@click="showCardRecord(item.upkeep_customer_id)") {{item.upkeep_no_number}}****
                        .simple-td(v-if="item.upkeep_no.length === 0") 暂未生成
                      td
                        .simple-td {{item.created_at}}
                      td
                        .simple-td {{'1'}}
                      td
                        .simple-td {{(item.price - 0) / 100 }}
                      td
                        .simple-td(v-if="item.type == 1") 购买
                        .simple-td(v-if="item.type != 1") 赠送
                      td
                        .simple-td {{item.order_no}}
              .tfoot
                pagination(:pagination-data="paginationData", @input="paging")
    card-project-modal(v-model="show_card_project" v-if="show_card_project", :id="card_id", is_iso="3")
    card-goods-modal(v-model="show_card_goods" v-if="show_card_goods", :id="card_id", is_iso="3")
    price-change-record(v-model="show_change_record" v-if="show_change_record", :id="card_id", is_iso="1")
    card-share-record(v-model="show_share_record", v-if="show_share_record", :id="customer_card_id")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import SlideOutModal from '@/components/generics/SlideOutModal'
import Pagination from '@/components/generics/Pagination'
import Api from '@/mixins/modules/productService'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import ClientCarModal from '@/components/customer/ClientCarModal'
import CardDetailModal from '@/components/customer/CardDetailModal'
import CardProjectModal from '@/components/customer/CardProjectModal'
import PriceChangeRecord from '@/components/productService/modal/PriceChangeRecord'
import CardGoodsModal from '@/components/customer/CardGoodsModal'
import OpenImage from '@/components/generics/OpenImage'
import DatePicker from '@/components/generics/form/DatePicker'
import CardShareRecord from '@/components/productService/modal/CardShareRecord'

export default {
  name: 'StatisticalDetail',
  mixins: [Api, imageScale],
  components: {
    CustomInput,
    CustomSelect,
    SlideOutModal,
    Pagination,
    EmptyPage,
    ClientCarModal,
    CardDetailModal,
    CardProjectModal,
    CardGoodsModal,
    OpenImage,
    DatePicker,
    PriceChangeRecord,
    CardShareRecord,
  },
  data () {
    return {
      get_ways: [
        {
          name: '全部用途',
          id: 0,
        },
        {
          name: '购买',
          id: 1,
        },
        {
          name: '赠送',
          id: 2,
        },
      ],
      paginationData: {
        current_page: 1,
        last_page: 1,
        total: 1,
        per_page: 20,
      },
      filterData: {
        keyword: '',
        way_status: {
          name: '全部用途',
          id: 0,
        },
        start_time: '',
        end_time: '',
      },
      detail: {},
      list: [],
      slide_visible: false,
      isInitiated: false,
      card_id: null,  // 养护卡id
      show_card_project: false, // 控制养护卡卡内项目变量
      show_card_goods: false,  // 控制是否显示关联商品变量
      show_change_record: false,
      img: ['http://pic27.nipic.com/20130225/4746571_081826094000_2.jpg'],
      is_true: true, // 开始是否大于结束
      show_share_record: false, // 是否展示养护卡赠送记录
      customer_card_id: 0,
    }
  },
  methods: {
    /**
     * 展示卡来源
     * id 养护卡id
     */
    showCardRecord (id) {
      this.customer_card_id = id
      this.show_share_record = true
    },
    // 搜索按钮
    applyFilter () {
      if (!this.is_true && this.filterData.end_time !== '') {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'failure',
          title: '开始时间不能大于结束时间',
          resolve: () => this.$emit('failure'),
        })
        return
      }
      this.paginationData.current_page = 1
      this.fetchList()
    },
    // 重置按钮
    resetFilter () {
      this.filterData.keyword = ''
      this.filterData.way_status = {
        name: '全部用途',
        id: 0,
      }
      this.filterData.end_time = ''
      this.filterData.start_time = ''
      this.paginationData.current_page = 1
      this.is_true = true
      this.fetchList()
    },
    // 养护卡详情
    async fetchDetail () {
      try {
        const { response, result } = await this.upkeepDataDetailApi({
          id: this.card_id,
        })
        if (response.status === 200 && result.code === 0) {
          this.detail = result.data.info
          this.detail.content = [result.data.info.content]
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡详情失败',
            content: `出错啦！${result.message}`,
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
    // 返回列表
    navBack () {
      this.$router.back(-1)
    },

    // 获取销售记录列表
    async fetchList () {
      try {
        const { response, result } = await this.upkeepSaleApi({
          id: this.card_id,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
          key_word: this.filterData.keyword,
          start_time: this.filterData.start_time.length > 0 ? new Date(this.filterData.start_time + ' 00:00').getTime() / 1000 : '',
          end_time: this.filterData.end_time.length > 0 ? new Date(this.filterData.end_time + ' 23:59:59').getTime() / 1000 : '',
          type: this.filterData.way_status.id,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(element => {
            element.created_at = this.changeDateTime(element.created_at)
            element.upkeep_no_number = element.upkeep_no.substring(0, element.upkeep_no.length - 4)
          })
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
          this.isInitiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡销售记录失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取养护卡销售记录失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 分页
    paging (state) {
      this.paginationData = state
      this.fetchList()
    },

    // 显示卡内信息
    showCardProject () {
      this.show_card_project = true
    },
    // 显示关联商品
    showCardGoods () {
      this.show_card_goods = true
    },
    // 显示售价变更记录
    showChangeRecord () {
      this.show_change_record = true
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
  watch: {
    'filterData.start_time': function (newVal, oldVal) {
      let start = 0
      let end = 0
      if (newVal === '') {
        newVal = 0
      } else {
        start = this.filterData.start_time.replace(/-/g, '') - 0
        this.filterData.end_time === '' ? end = 0 : end = this.filterData.end_time.replace(/-/g, '') - 0
      }
      (start - end > 0 && end !== 0) ? this.is_true = false : this.is_true = true
    },
    'filterData.end_time': function (newVal, oldVal) {
      let start = 0
      let end = 0
      if (newVal === '') {
        newVal = 0
      } else {
        this.filterData.start_time === '' ? start = 0 : start = this.filterData.start_time.replace(/-/g, '') - 0
        end = this.filterData.end_time.replace(/-/g, '') - 0
      }
      (start - end > 0 && start !== 0) ? this.is_true = false : this.is_true = true
    },
  },
  mounted () {
    this.card_id = this.$route.query.id
    this.fetchDetail()
    this.fetchList()
  },
  created () {
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.width-fix
  max-width 110px !important
// side pannel
td,.multi-content-td
  vertical-align: middle
.side-info-pannel {
  position: relative;
  height: 100%;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: borderRadiusLarge;
  overflow-y: auto;
}

.nav-back-btn {
  position: absolute;
  top: 36px;
  left: -16px;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: #CED3DC center no-repeat url('~@/assets/back.svg');
  background-size: 16px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
  cursor: pointer;
  z-index: 2;
}

.customer-basic-info-wrapper {
  position: relative;

  .edit {
    float: right;
  }

  .extra-info {
    float: none;
  }

  .basic-name {
    text-align center
    line-height 50px
  }
}

.basic-info {
  clear: both;
  padding-bottom: 20px;
  text-align: center;
  color: darker;
  border-bottom: 1px solid line;

  .avatar {
    display: block;
    margin: 0 auto 8px;
    width: 100%;
    height: auto;
    overflow: hidden;
    background-color: lightGrey;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .real-name {
    font-size: 18px;
    line-height: 24px;
  }

  .mobile {
    font-size: 14px;
    line-height: 16px;
  }
}

.extra-info {
  padding: 24px 0;
  border-bottom: 1px solid line;
  color: darker;
  font-size: 13px;
  line-height: 24px;

  .extra-info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .user-comment {
    font-size: 12px;
    line-height: 18px;
    color: lightGrey;
  }
}

.customer-vehicle-info {
  .button {
    min-width 80px
    margin-top 40px
    margin-right 10px
  }
  .labeltitle {
    min-width 60px
  }
  .text{
    font-size 14px
    display flex
    margin-top 5px !important
    justify-content space-between
  }
  .tab-content-item{
    font-size 12px
    color #333
    padding: 10px 0 8px
    .imgbox{
      padding-top 5px
      img{
        width 80px
        height 80px
      }
    }
    .content-item-title{
      font-weight 500
    }
    .item-content{
      padding-top 12px
      padding-bottom 6px
      border-bottom 1px solid #666
      &:first-child{
        padding-top 0
      }
      &:last-child{
        border-bottom 0
      }
    }
    .flex{
      display flex
      justify-content flex-start
    }
    .between{
      justify-content space-between
    }
    .projectbox{
      padding-left 10px
      .project{
        display: inline-block
        padding: 0 8px
        border:1px solid #888
        border-radius 4px
        height: 30px
        line-height 30px
        margin-left 6px
      }
    }
    .question-list{
      padding-left 10px
      width 240px
      word-break break-all
    }
  }
}

.vehicle-info-detail {
  margin-top: 8px;

  .empty-tip {
    font-size: 12px;
    line-height: 16px;
    color: lightGrey;
  }

  .vehicle-info-section {
    position: relative;
    padding: 16px 0 8px;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    &:last-of-type::after {
      display: none;
    }

    .logo {
      position: absolute;
      top: 16px;
      left: 0;
      width: 40px;
      height: 40px;
      background-color: #fafafa;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .license {
      font-size: 14px;
      line-height: 20px;
      color: darker;
    }

    .vehicle-model {
      max-width: 160px;
      margin: 2px 0 8px;
      font-size: 12px;
      line-height: 16px;
      color: lightGrey;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .comment {
      margin-bottom: 8px;
      font-size: 12px;
      line-height: 16px;
      color: lightGrey;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
      line-height: 24px;
      color: darker;

      .info-content {
        text-align: right;
      }

      .tip-info {
        font-size: 12px;
        line-height: 16px;
        color: lightGrey;
      }
    }
  }
}

// main pannel
.main-info-pannel {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  border-radius: borderRadiusLarge;
  overflow-y: auto;
}
.list-wrapper {
  margin: 0;
  padding: 0 24px 36px;
}

.title-item {
  padding-right: 12px;
}

.bottom-image {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;

  img {
    height: 100%;
    width: 100%;
  }
}

td {
  vertical-align: middle;
}
</style>

