<template lang="pug">
  .section-layout
    //- agreement
    //- .reserve-operation-wrapper
    //-   reservation-write-off(@success='refreshList', :string="'卡核销'")
    .section-filter
      .field-group.is-horizontal
        .field
          label.label 关键字搜索
          custom-input(placeholder="请输入手机号/车牌号" v-model="keyword", @keyupEnter="search")
        .field
          label.label 起止时间
          .field.is-horizontal
            date-picker.w-160(type="single", placeholder="选择开始时间", v-model="start")
            span.margin 至
            date-picker.w-160(type="single", placeholder="选择结束时间", v-model="end")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset") 重置
        .field
          a.button(@click="exportTable") 导出
    empty-page.m-t-40(v-if="!(list && list.length) && isInitiated", tip="当前没有核销列表数据")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td.m-r-5(v-text="item.write_off_time")
              td
                .simple-td.m-r-5(v-text="item.operator")
              td
                .simple-td.m-r-5(v-text="item.name") 壳牌金养护卡
              td
                .simple-td.m-r-5(v-text="item.category_name") 车辆养护
              td
                .simple-td.m-r-5 {{item.from == 1 ? (item.type === 1 ? '养护卡' : '次卡') :'壳养护卡'}}
              td
                .simple-td
                  div.text-items(v-for="(items, indexs) in item.item_name") {{indexs + 1}}.{{items}}
              td
                .multi-content-td
                  .content-item
                    span.left-image.inline
                      img(v-if="item.customer.avatar", :src="scaleImage(item.customer.avatar, 1, 16, 16)")
                      img(v-if="!item.customer.avatar", src="../../assets/user-avatar.png")
                    span(v-text="item.customer.name || ''")
                  .content-item
                    span(v-text="item.customer.mobile || ''")
                    span.content-divider.inline(v-if="item.customer.license_plate")
                    span(v-text="item.customer.license_plate || ''")
              td
                .simple-td(v-if="item.order_no", v-text="item.order_no")
                .simple-td(v-else) --
              td
                .operation-td
                  span.operation-link(@click="viewInfo(item)") 查看
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
      slide-out-modal(v-if="slide_visible", @input="toggleSidePannel")
        card-management-detail(:user_info="item_info")
</template>

<script>
import ReservationWriteOff from './ReservationWriteOff'
import EmptyPage from '@/components/generics/EmptyPage'
import Api from '@/mixins/modules/workbench'
import Pagination from '@/components/generics/Pagination'
import imageScale from '@/mixins/utilities/imageScale'
import Agreement from '@/components/generics/agreementModel'
import SlideOutModal from '@/components/generics/SlideOutModal'
import CardManagementDetail from '@/components/workbench/model/CardManagementDetail'
import CustomInput from '@/components/generics/form/CustomInput'
import DatePicker from '@/components/generics/form/DatePicker'
import {root} from '@/plugins/Fetch'

export default {
  name: 'CardManagementOffRecord',
  mixins: [Api, imageScale],
  components: {
    ReservationWriteOff,
    EmptyPage,
    Pagination,
    Agreement,
    SlideOutModal,
    CardManagementDetail,
    CustomInput,
    DatePicker,
  },
  data () {
    return {
      root,
      keyword: '',
      isInitiated: false,
      slide_visible: false,
      theadConfig: [
        {
          name: '核销时间',
          width: '130',
        },
        {
          name: '核销人',
          width: '80',
        },
        {
          name: '卡名称',
          width: '150',
        },
        {
          name: '分类',
          width: '90',
        },
        {
          name: '来源',
          width: '80',
        },
        {
          name: '核销项目',
          width: '90',
        },
        {
          name: '车主信息',
          width: '240',
        },
        {
          name: '养护卡关联订单',
          width: '100',
        },
        {
          name: '操作',
          width: '100',
        }],
      list: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      item_info: {},
      is_search: false, // 是否搜索(翻页判断时用)
      start: '', // 开始时间
      end: '', // 结束时间
    }
  },
  methods: {
    // 导出
    exportTable () {
      let time = this.start
      time = time && (new Date(time.replace(/-/g, '/'))).getTime() / 1000
      let time2 = this.end
      time2 = time2 && ((new Date(time2.replace(/-/g, '/'))).getTime() / 1000) + 3600 * 24 - 1
      if (time > time2 && this.start && this.end) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          content: '开始时间不能大于结束时间',
        })
        return false
      }
      let url = `${root}/export/export_write_off_upkeep_list?keywords=${this.keyword}&start=${time}&end=${time2}`
      console.log(url)
      window.open(url)
    },
    // 重置
    reset () {
      this.is_search = false
      this.keyword = ''
      this.start = ''
      this.end = ''
      this.paginationData.current_page = 1
      this.getList()
    },
    // 搜索
    search () {
      let time = this.start
      time = time && (new Date(time.replace(/-/g, '/'))).getTime() / 1000
      let time2 = this.end
      time2 = time2 && ((new Date(time2.replace(/-/g, '/'))).getTime() / 1000) + 3600 * 24 - 1
      if (time > time2 && this.start && this.end) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          content: '开始时间不能大于结束时间',
        })
        return false
      }
      this.time = time
      this.time2 = time2
      this.is_search = true
      this.paginationData.current_page = 1
      this.getList()
    },
    // 获取核销列表数据
    async getList () {
      try {
        const { response, result } = await this.getCardManagementListApi({
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
          keyword: this.is_search ? this.keyword : '',
          start: this.is_search && this.time ? this.time : '',
          end: this.is_search && this.time2 ? this.time2 : '',
        })
        if (response.status === 200) {
          if (result.code === 0) {
            result.data.forEach(element => {
              element.write_off_time = this.changeDateTime(element.write_off_time)
            })
            this.list.splice(0, this.list.length, ...result.data)
            this.paginationData = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取核销列表失败',
              content: result.message,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取核销列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取核销列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 查看详情
    viewInfo (item) {
      // 记录列表页数
      this.$store.dispatch('setCurrentPageStorage', this.paginationData.current_page)
      this.item_info = item
      this.toggleSidePannel()
    },
    // 分页跳转
    paging (state) {
      this.paginationData = state
      this.getList()
    },
    // 确认核销完成的回调方法
    refreshList: function () {
      this.getList()
    },
    toggleSidePannel () {
      this.slide_visible = !this.slide_visible
    },
    /**
     * 时间戳转年月日
     * @val  时间戳
     */
    changeDateTime (val, type) {
      if (!val) {
        return ''
      }
      let date = new Date(val * 1000)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = this.judgeTime(date.getDate()) + ' '
      let h = this.judgeTime(date.getHours()) + ':'
      let m = this.judgeTime(date.getMinutes())
      if (type === 'data') {
        return Y + M + D
      } else if (type === 'datetime') {
        return Y + M + D + h + m
      } else {
        return Y + M + D + h + m
      }
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
  created () {
    // 设置列表历史页数记录并重置
    this.$set(this.paginationData, 'current_page', this.$store.state.list.currentPageStorage)
    this.$store.dispatch('setCurrentPageStorage', 0)
  },
  mounted () {
    this.getList() // 获取核销列表数据
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp';
.section-layout
  height: calc(100% - 52px) !important
.reserve-operation-wrapper {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
  background-color: #fff;
}
.text-items {
  line-height: 22px
}
.margin {
  margin: 0 8px;
  font-size: 14px;
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

.m-r-5 {
  margin-right: 5px;
}
.m-t-40
  margin-top 40px
.list-wrapper
  height calc(100% - 48px) !important
</style>
