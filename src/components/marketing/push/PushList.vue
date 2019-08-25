<template lang="pug">
  .section-layout.height-100
    .content-wrapper.p-b-0
      .section-filter
        .field-group.is-horizontal
          .field.keyword-wrapper.keywords
            label.label 推送标题
            custom-input(v-model.trim="filterData.keyword", placeholder="请输入推送标题", @keyupEnter="applyFilter")
          .field.staff-wrapper.keywords
            label.label 模板名称
            custom-select(v-model="filterData.calssify_status", :list="calssifyList")
          .field
            label.label 发送时间
            .field.is-horizontal
              date-picker.keywords(type="single", placeholder="选择开始时间", v-model="filterData.start_time")
              span.margin 至
              date-picker.keywords(type="single", placeholder="选择结束时间", v-model="filterData.end_time")
          .field
            a.button.primary(@click="applyFilter") 搜索
          .field
            a.button(@click="resetFilter") 重置
        .field-group.is-horizontal
          .field
            label.label &nbsp;
            a.button.primary(@click="goAddFirst(1, '')", v-if="shop_install")
              span 新建推送
            a.button(v-if="!shop_install")
              span 新建推送
      empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有推送记录'")
      .list-wrapper(v-if="list && list.length")
        .table-wrapper
          table.table
            thead
              tr
                td(width="150") 推送标题
                td(width="90") 推送范围
                td(width="100") 模板名称
                td(width="80") 推送时间
                td(width="80") 推送状态
                td(width='80') 成功送达人数
                td(width='60') 操作
            tbody(v-if="list.length")
              tr(v-for="(item, index) in list")
                td
                  .simple-td(v-text="item.title")
                td
                  .simple-td(v-text="item.range === 1 ? '指定用户' : '全部用户'")
                td
                  .simple-td(v-text='item.template_name')
                td
                  .simple-td(v-if="item.status !== 1") {{(item.created_at - 0) | date("yyyy-MM-dd HH:mm:ss", "cn")}}
                  .simple-td(v-if="item.status === 1") --
                td
                  .simple-td(v-text='item.status === 1 ? "发送中" : "发送完成"')
                td
                  .simple-td(v-text='item.status === 1 ? "统计中" : item.success_count')
                td
                  .operation-td
                    span.operation-link(@click="goAddFirst(2, item.id)") 编辑
                    span.operation-link(v-if="item.status === 2", @click="goRecordList(item.id)") 发送记录
        .tfoot(v-if="list.length")
          pagination(:pagination-data="paginationData", @input="paging")
</template>


<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import StorePicker from '@/components/generics/form/StorePicker'
import Pagination from '@/components/generics/Pagination'
import marketingMixin from '@/mixins/modules/marketing'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import DatePicker from '@/components/generics/form/DatePicker'

export default {
  name: 'pushList',
  mixins: [marketingMixin, filterTools, imageScale],
  components: {
    CustomInput,
    CustomSelect,
    StorePicker,
    EmptyPage,
    Pagination,
    DatePicker,
  },
  data: _ => {
    const schema = {
      isInitiated: false,
        // 分页的数据
      paginationData: {
        current_page: 1, // 当前页
        per_page: 15, // 每页的数据
        last_page: 2, // 最后一页
        total: 31, // 总数据
      },
      // 模板名称
      calssifyList: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 'AT0407',
          name: '打卡提醒',
        }, {
          id: 'AT2124',
          name: '保养到期提醒',
        }, {
          id: 'AT0911',
          name: '拼团待成团提醒',
        }, {
          id: 'AT0871',
          name: '信息完善通知',
        },
      ],
      // 搜索条件
      filterData: {
        keyword: '',
        calssify_status: {
          id: '',
          name: '全部',
        },
        start_time: '',
        end_time: '',
      },
      is_search: false,
      // 备份搜索条件
      query_filter_data: {
        keyword: '',
        calssify_status: {
          id: '',
          name: '全部',
        },
        start_time: '',
        end_time: '',
      },
      // 推送列表
      list: [],
      is_true: true, // 开始是否大于结束
      shop_install: false,    // 小程序是否授权
    }
    return schema
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
  methods: {
    /**
     * @methods
     * @description 获取推送列表接口
     *  */
    async fetchData () {
      try {
        const {response, result} = await this.sendPushListApi({
          title: this.query_filter_data.keyword,
          library_id: this.query_filter_data.calssify_status.id,
          start: this.query_filter_data.start_time.length > 0 ? new Date(this.query_filter_data.start_time + ' 00:00').getTime() / 1000 : '',
          end: this.query_filter_data.end_time.length > 0 ? new Date(this.query_filter_data.end_time + ' 23:59:59').getTime() / 1000 : '',
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200) {
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取推送列表失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取推送列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    /**
     * @methods
     * @description 搜索按钮
     */
    applyFilter () {
      if (!this.is_true && this.filterData.end_time !== '') {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'failure',
          title: '开始时间不能大于结束时间',
          resolve: () => {
            this.$emit('failure')
          },
        })
        return
      }
      this.query_filter_data = JSON.parse(JSON.stringify(this.filterData))
      this.is_search = true // 点击搜索开关变为fasle
      this.paginationData.current_page = 1
      this.fetchData()
    },
    /**
     * @methods
     * @description 重置按钮
     */
    resetFilter () {
      this.filterData.keyword = ''
      this.filterData.calssify_status = {
        id: '',
        name: '全部',
      }
      this.filterData.end_time = ''
      this.filterData.start_time = ''
      this.query_filter_data = JSON.parse(JSON.stringify(this.filterData))
      this.is_search = false // 重置之后开关变为fasle
      this.paginationData.current_page = 1
      this.is_true = true
      this.fetchData()
    },
    // 重置部分参数，不发送请求
    resetParams () {
      this.filterData.keyword = ''
      this.filterData.calssify_status = {
        id: '',
        name: '全部',
      }
      this.filterData.end_time = ''
      this.filterData.start_time = ''
      this.query_filter_data = JSON.parse(JSON.stringify(this.filterData))
      this.is_search = false // 重置之后开关变为fasle
      this.is_true = true
    },
    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
    /**
     * @methods
     * @description 跳转添加第一步
     * */
    goAddFirst (type, id) {
      sessionStorage.setItem('push-second', '')
      sessionStorage.removeItem('PHONE_LIST')
      sessionStorage.removeItem('EFFECYIVE_TYPE')
      this.$global = {}
      // type 1 添加  2 编辑
      if (type === 1) {
        this.$router.push({
          name: 'firstSendAdd',
        })
      } else {
        this.$router.push({
          name: 'firstSendAdd',
          query: {
            id: id,
          },
        })
      }
    },
    /**
     * @methods
     * @description 推送记录列表
     * */
    goRecordList (id) {
      this.$global.filterData = this.filterData
      this.$global.paginationData = this.paginationData
      this.$router.push({
        name: 'sendRecordList',
        query: {
          id: id,
        },
      })
    },
    // 判断小程序是否授权
    async getAuthorizations () {
      try {
        const {response, result} = await this.fetchAuthorizations({
          mp_back_url: `${location.href}/service`,
          shop_back_url: `${location.href}/shop`,
        })
        if (response.status === 200 && result.code === 0) {
          this.shop_install = result.data.shop.installed
          if (this.shop_install) {
            this.fetchData()
          } else {
            this.isInitiated = true
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '提示',
              content: '门店小程序未完成注册，暂时无法使用该功能，请先完成注册小程序后再试。',
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取授权信息失败',
            content: `${response.status} ${result.code} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取授权信息失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    if (this.$global.paginationData) {
      this.paginationData = this.$global.paginationData
      this.filterData = this.$global.filterData
      this.$global = {}
    }
    this.getAuthorizations()
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    console.log(from.name + '   ' + from.meta.isSlibing)
   /**
     * 判断是否属于同级页面
     * (由切换tab进入)
     */
    if (!from.meta.isSlibing) {
      to.meta.isOutside = true
    }
    /**
     * 是添加 且 不是返回(保存)
     * @save: 1(返回)
     */
    if ((from.name === 'sendResult' && to.query.save !== 1)) {
      to.meta.isPreserve = true
    }
    next()
  },
  // keep-alive进入
  activated () {
    console.log('进入keepAlive周期')
    /**
     * 未点搜索按钮
     */
    if (!this.is_search) {
      this.resetParams() // 重置部分参数
    }
    /**
     * 由切换tab进入 或
     * 是添加 且 不是返回(保存)
     */
    if (this.$route.meta.isOutside || this.$route.meta.isPreserve) {
      this.resetFilter() // 重置全部参数
      this.$route.meta.isPreserve = false
      this.$route.meta.isOutside = false
      return
    }
    /**
     * 如果是返回不请求接口
     * @save: 1(返回)
     */
    if (Number(this.$route.query.save) !== 1) {
      this.fetchData()
      this.$route.meta.isPreserve = false
      this.$route.meta.isOutside = false
    }
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.section-filter {
    display: flex;
    justify-content: space-between;
}

.keyword-wrapper {
    width: 244px;
}

.staff-wrapper {
  width 120px
}

.button {
    align-items: center;
}

.add-icon {
    display: inline-flex;
    width: 16px;
    height: 16px;
    background: url('~@/assets/icons/button-add.svg') no-repeat center center;
    background-size: cover;
    margin-right: 6px;
}

.td-with-tip {
    position: relative;
    display: flex;
    align-items: center;
}

.help-tip-icon {
    position: relative;
    display: inline-block;
    width: 12px;
    height: 12px;
    background: url('~@/assets/icons/help.svg') no-repeat center center;
    background-size: cover;
    margin-left: 4px;

    &:hover {
        .help-tip {
            display: block;
        }
    }
}

.help-tip {
    display: none;
    z-index: 213;
    position: absolute;
    top: 22px;
    left: -76px;
    width: 160px;
    padding: 4px 6px;
    border-radius: 2px;
    background-color: #121212;
    color: #fff;
    font-size: 12px;
    line-height: 18px;

    &::after {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        left: 50%;
        top: -4px;
        margin-left: -2px;
        transform: rotate(45deg);
        background-color: #121212;
    }
}
.margin
  margin 0 8px
  font-size 14px
.p-b-0
  padding-bottom 0
.display-block
  display block
.height-auto
  height auto
.section-filter
  background #fff
.height-100
  height calc(100% - 56px)
  display block
.content-wrapper
  height 100%
.empty-page-wrapper
  margin-top 50px
.width-fixed
  width 400px !important
.store-list
  width 240px !important
.keywords
  width 180px !important
.list-wrapper
  height calc(100% - 124px) !important
  overflow-y auto
</style>
