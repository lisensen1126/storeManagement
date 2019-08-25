<template lang="pug">
  .section-layout
    choose-good(v-model="show_product", v-if="show_product", @resolve="getProduct")
    choose-serve(v-model="show_serve", v-if="show_serve", @resolve="getServe")
    choose-card(v-model="show_card", v-if="show_card", @resolve="getCard")
    .section-filter
      .field-group.is-horizontal
        .field.keyword-wrapper.width-160
          label.label 关键字搜索
          custom-input(v-model="filter_data.keyword", placeholder="商品/服务/养护卡名称", @keyupEnter="applyFilter")
        .field.staff-wrapper.width-160
          label.label 状态查询
          custom-select(v-model="filter_data.status", :list="status_list")
        .field.staff-wrapper.width-160(v-if="is_show")
          label.label 全部分类
          choose-tab(@success="getClassify" ref="child" :default="filter_data.search_classify")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="openModel(3)")
            span.add-icon
            span 添加秒杀养护卡
        .field
          label.label &nbsp;
          a.button.primary(@click="openModel(2)")
            span.add-icon
            span 添加秒杀服务
        .field
          label.label &nbsp;
          a.button.primary(@click="openModel(1)")
            span.add-icon
            span 添加秒杀商品
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前没有秒杀活动'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="120") 商品/服务/养护卡
              td(width="60") 分类
              td(width="80") 活动数量
              td(width="100") 限购（件/人）
              td(width="100") 开始时间
              td(width="100") 结束时间
              td(width="60") 成交数
              td(width="80") 成交金额
              td(width="80") 状态
              td(width="80") 排序
                span(v-if="is_search") (不可用)
              td(width="140") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td.width-160 {{item.product.name}}
              td
                .simple-td.width-160 {{item.product.category_name}}
              td
                .simple-td {{item.event_num }}
              td
                .simple-td {{item.product.limit_number}}
              td
                .simple-td(v-text="formateDate(item.start_time, true, 2)")
              td
                .simple-td(v-text="formateDate(item.end_time, true, 2)")
              td
                .simple-td.center {{item.product.sales_total}}
              td
                .simple-td.center ￥{{item.product.sales_price}}
              td
                .simple-td(v-if="item.status === 1") 进行中
                .simple-td(v-if="item.status === 2") 预热中
                .simple-td(v-if="item.status === 3") 已结束
              td.tr-p
                div(v-if="!is_search")
                  .up(v-if="index !== 0", @click="sortItem(item.id, index, 'up')")
                  .down(v-if="index !== list.length - 1", @click="sortItem(item.id, index, 'down')" )
              td
                .operation-td
                  span.operation-link(@click="goDetail(item)") 查看
                  span.operation-link(v-if="item.status === 3", @click="changeStatus(item)") 开始
                  span.operation-link.danger(v-if="item.status < 3", @click="changeStatus(item)") 结束
                  //- span.operation-link(@click="deleteItem(item.id)") 删除
      .tfoot(v-if="true")
        pagination(:pagination-data="pagination_data", @input="paging")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import Pagination from '@/components/generics/Pagination'
import marketingMixin from '@/mixins/modules/marketing'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import CustomSelect from '@/components/generics/form/CustomSelect'
import ChooseTab from '@/components/marketing/modal/ChooseTab'
import ChooseGood from '@/components/marketing/modal/ChooseGood'
import ChooseServe from '@/components/marketing/modal/ChooseServe'
import FormateDate from '@/mixins/utilities/formateDate'
import spikeApi from '@/mixins/modules/Spike'
import ChooseCard from '@/components/marketing/modal/ChooseCardModal'
import ProductServiceMixin from '@/mixins/modules/productService'
export default {
  name: 'SpikeList',
  mixins: [marketingMixin, filterTools, imageScale, FormateDate, spikeApi, ProductServiceMixin],
  components: {
    CustomInput,
    EmptyPage,
    Pagination,
    CustomSelect,
    ChooseTab,
    ChooseGood,
    ChooseServe,
    ChooseCard,
  },
  data: _ => {
    const schema = {
      is_show: false,
      show_card: false,
      show_product: false,    // 控制商品
      show_serve: false, // 控制服务
      is_initiated: false,
      pagination_data: {
        current_page: 1,
        per_page: 999,
        last_page: 1,
        total: 0,
      },
      status_list: [{
        id: '',
        name: '全部',
      }, {
        id: 1,
        name: '进行中',
      }, {
        id: 2,
        name: '预热中',
      }, {
        id: 3,
        name: '已结束',
      }],
      list: [],
      filter_data: {
        keyword: '',
        status: {
          id: '',
          name: '全部',
        },
        search_classify: [],
      },
      query_data: {},
      is_search: false, // 是否搜索(隐藏排序用)
    }
    return schema
  },
  methods: {
     /**
     * 排序
     * @id 拼团id
     * @index {int} 序列号
     * @type {string} up or down
     */
    sortItem (id, index, type) {
      let arr = [...this.list]
      this.list = []
      let temp = arr[index]
      // 向上移动
      if (type === 'up') {
        arr[index] = arr[index - 1]
        arr[index - 1] = temp
        this.seckillSort({id, sort: 1})
      }
      // 向下移动
      if (type === 'down') {
        arr[index] = arr[index + 1]
        arr[index + 1] = temp
        this.seckillSort({id, sort: 2})
      }
      this.list = [...arr]
    },
     /**
       * 秒杀列表排序
       * @params {id: 拼团id, sort: 1 向上排序，2 向下排序}
       *  */
    async seckillSort (params) {
      try {
        const {response, result} = await this.seckillSortApi(params)
        if (response.status === 200 && result.code === 0) {

        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '秒杀排序失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '秒杀排序失败',
          content: `错误: ${err}`,
        })
      }
    },
    getCard (e) {
      this.$router.push({
        name: 'spikeCardAdd',
        query: {
          id: e.id,
          type: e.type,
        },
      })
    },
    getClassify (val) {
      this.filter_data.search_classify = val
    },
    /*
    *  去详情
    *  item {obj}
    * */
    goDetail (item) {
      let query = {
        id: item.id,
        spike_type: item.product.type,
      }
      // 养护卡
      if (item.product.type > 2) {
        query = {
          id: item.product.history_product_id, // 养护卡id
          spike_id: item.id, // 秒杀id
          spike_type: item.product.type, // 类型
        }
      }
      this.$router.push({
        name: item.product.type > 2 ? 'spikeCardDetail' : 'spikeDetail',
        query: query,
      })
    },
    // 获取详情 1 商品 2 服务 3-5 卡片
    async getDetail (item) {
      let type = item.product.type
      try {
        const {response, result} = type > 2 ? await this.upkeepDetailApi({id: item.product.basic_spu_id}) : type === 1 ? await this.fetchProductDetail(item.product.basic_spu_id) : await this.fetchServiceDetail(item.product.basic_spu_id)
        if (response.status === 200 && result.code === 0) {
          if ((result.data.name && result.data.is_sale === 1) || (result.data.info && result.data.info.name && result.data.info.status === 1)) {
            let query = {
              id: item.id,
              spike_type: item.product.type,
            }
            // 养护卡
            if (item.product.type > 2) {
              query = {
                id: item.product.basic_spu_id, // 养护卡id
                spike_id: item.id, // 秒杀id
                spike_type: item.product.type, // 类型
              }
            }
            this.$router.push({
              name: item.product.type === 1 ? 'spikeGoodEdit' : item.product.type === 2 ? 'spikeServeEdit' : 'spikeCardEdit',
              query: query,
            })
          } else {
            let txt = type === 1 ? '商品' : type === 2 ? '服务' : '养护卡'
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '秒杀开始失败',
              content: '该活动的' + txt + '已下架或删除，请确保上架后再开始秒杀活动！',
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '商品服务养护卡详情获取失败',
            content: result.data,
          })
        }
      } catch (err) {
        console.error(err, '商品服务养护卡详情')
      }
    },
    /*
    * 停止开启秒杀商品
    * item {obj}
    * */
    changeStatus (item) {
      if (item.status !== 3) {
        this.$store.dispatch('showMessage', {
          title: `确认${item.status !== 3 ? '结束' : '开始'}吗？`,
          isRejectable: 1,
          resolve: () => {
            this.changeApi(item.id, 2)
          },
        })
      } else {
        this.getDetail(item)
      }
    },
    /*
    * 修改秒杀状态接口
    * id  秒杀活动id
    * enable 是否开启
    * */
    async changeApi (id, enable) {
      try {
        const { response, result } = await this.statusChangeApi({
          id: id,
          enable: enable,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            if (result.message === 'success') {
              this.$store.dispatch('showMessage', {
                type: 'success',
                title: `${parseInt(enable) === 1 ? '开启' : '结束'}成功`,
                autoClose: true,
              })
              if (enable === 1) {
                this.$router.push({
                  name: 'spikeDetail',
                  query: {
                    id: 336,
                    spike_type: 2,
                  },
                })
              } else {
                await this.fetchData()
              }
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: `${parseInt(enable) === 1 ? '开启' : '结束'}失败`,
              })
              return false
            }
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: `${parseInt(enable) === 1 ? '开启' : '结束'}失败`,
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: `${parseInt(enable) === 1 ? '开启' : '结束'}失败`,
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 成功选择商品的回调
    getProduct (e) {
      this.$router.push({
        name: 'spikeAdd',
        query: {
          id: e.product_id,
        },
      })
    },
    // 成功选择服务的回调
    getServe (e) {
      this.$router.push({
        name: 'spikeServeAdd',
        query: {
          id: e.basic_spu_id,
        },
      })
    },
    // 打开选择商品的弹框
    openModel (type) {
      if (type - 0 === 1) {
        this.show_product = true
      } else if (type - 0 === 2) {
        this.show_serve = true
      } else {
        this.show_card = true
      }
    },
    async fetchData () {
      let params = {
        name: this.query_data.keyword.trim(),
        status: this.query_data.status.id,
        page: this.pagination_data.current_page,
        per_page: this.pagination_data.per_page,
      }
      if (this.query_data.search_classify.length > 1) params.type = this.query_data.search_classify[0]
      if (params.type > 2) {
        if (this.query_data.search_classify[1] !== 0) params.parent_category_id = this.query_data.search_classify[1]
      } else {
        if (this.query_data.search_classify.length > 2) params.parent_category_id = this.query_data.search_classify[1]
        if (this.query_data.search_classify.length > 2 && this.query_data.search_classify[2] !== 0) params.category_id = this.query_data.search_classify[2]
      }
      if (params.name || params.status || params.type) {
        this.is_search = true
      } else {
        this.is_search = false
      }
      try {
        const { response, result } = await this.spikeListApi(params)
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(item => {
            item.product.sales_price = (item.product.sales_price / 100).toFixed(2)
            let event = 0
            item.product.sku.forEach(cell => {
              if (cell.enable === 1) event += (cell.inventory_total + cell.sales_total)
            })
            item.event_num = event
          })
          // 李森森 -- 此处加判断是因为如果最后一页的最后一条数据被删除，则最后一页的数据为0，此时应该定位到前一页再去取数据，直到取到值
          if (result.data.length === 0 && this.pagination_data.current_page > 1) {
            this.pagination_data.current_page --
            this.fetchData()
          } else {
            this.list = result.data
            this.pagination_data = result.meta
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取秒杀列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取秒杀列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.is_initiated = true
    },
    applyFilter () {
      this.is_search = true
      for (let key in this.filter_data) {
        if (this.query_data.hasOwnProperty(key)) {
          this.query_data[key] = this.filter_data[key]
        }
      }
      this.pagination_data.current_page = 1
      this.fetchData()
    },
    // 重置
    resetFilter () {
      this.is_search = false
      if (this.$refs.child) this.$refs.child.parentMsg()
      this.filter_data = {
        keyword: '',
        status: {
          id: '',
          name: '全部',
        },
        search_classify: [],
      }
      this.query_data = JSON.parse(JSON.stringify(this.filter_data))
      this.pagination_data.current_page = 1
      this.fetchData()
    },
    // 重置部分参数，不发送请求
    resetParams () {
      this.is_search = false
      if (this.$refs.child) this.$refs.child.parentMsg()
      this.filter_data = {
        keyword: '',
        status: {
          id: '',
          name: '全部',
        },
        search_classify: [],
      }
      this.query_data = JSON.parse(JSON.stringify(this.filter_data))
    },
    paging (state) {
      this.pagination_data = state
      this.fetchData()
    },
    /*
    * 去编辑页面
    * item {obj}
    * */
    editGood (item) {
      this.$router.push({
        name: 'spikeGoodEdit',
        query: {
          id: 1006,
        },
      })
    },
    formatTime (date) {
      return date.slice(0, 10)
    },
  },
  mounted () {
    this.is_show = true
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    console.log(from)
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
    if ((from.name === 'spikeAdd' || from.name === 'spikeServeAdd' || from.name === 'spikeCardAdd') && to.query.save !== 1) {
      to.meta.isPreserve = true
    }
    next()
  },
  // keep-alive进入
  activated () {
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
@import '~@/stylus/mixins'
.center
  text-align center !important
.width-160
  width 160px !important
.section-filter
  display flex
  justify-content space-between
.keyword-wrapper
  width 244px
.button
  align-items center
.add-icon
  display inline-flex
  width 16px
  height 16px
  background url('~@/assets/icons/button-add.svg') no-repeat center center
  background-size cover
  margin-right 6px
.td-with-tip
  position relative
  display flex
  align-items center
.help-tip-icon
  position relative
  display inline-block
  width 12px
  height 12px
  background url('~@/assets/icons/help.svg') no-repeat center center
  background-size cover
  margin-left 4px
  &:hover
    .help-tip
      display block
.help-tip
  display none
  z-index 213
  position absolute
  top 22px
  left -76px
  width 160px
  padding 4px 6px
  border-radius 2px
  background-color #121212
  color #fff
  font-size 12px
  line-height 18px
  &::after
    content ''
    position absolute
    width 8px
    height 8px
    left 50%
    top -4px
    margin-left -2px
    transform rotate(45deg)
    background-color #121212
.section-layout
  height calc(100% - 48px)
.list-wrapper
  height calc(100% - 90px) !important
.tr-p
  position relative
  .up
  .down
    position absolute
    top 17px
    width 20px
    height 30px
    opacity .5
    cursor pointer
    &.is-disable
      opacity .2
      pointer-events none
    &:hover
      opacity 1
  .up
    left 0
    background center no-repeat url('~@/assets/icons/move-up.svg')
    background-size 20px 30px
  .down
    left 25px
    background center no-repeat url('~@/assets/icons/move-down.svg')
    background-size 20px 30px
  .delete
    position absolute
    top 8px
    right 8px
    width 16px
    height 16px
    background center no-repeat url('~@/assets/icons/trash.svg')
    cursor pointer
</style>
