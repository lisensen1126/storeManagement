<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .field.keyword-wrapper.width-160
          label.label 关键字搜索
          custom-input(v-model="filter_data.keyword", placeholder="商品/服务/养护卡名称", @keyupEnter="search")
        .field.staff-wrapper.width-160
          label.label 状态查询
          custom-select(v-model="filter_data.status", :list="status_list")
        .field.staff-wrapper.width-160(v-if="is_show")
          label.label 全部分类
          choose-tab(@success="getClassify" ref="child" :default="filter_data.search_classify")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="goAddSpike()")
            span.add-icon
            span 新增秒杀
    empty-page(v-if="!(list && list.length)", tip="当前没有秒杀商品")
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
              td(width="80") 活动状态
              td(width="80") 制作状态
              td(width="100") 操作
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
              td
                .simple-td(v-if="!item.make") 未制作
                .simple-td(v-if="item.make") 已制作
              td
                .operation-td
                  a.operation-link(v-if="item.make", @click="goPoster(item)") 物料查看
                  a.operation-link(v-if="item.make", @click="goData(item)") 数据查看
                  a.operation-link(v-if="!item.make", @click="goPoster(item)") 物料制作
        .tfoot(v-if="list.length")
      pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import CustomInput from '@/components/generics/form/CustomInput'
  import EmptyPage from '@/components/generics/EmptyPage'
  import Api from '@/mixins/modules/AppCenter'
  import Pagination from '@/components/generics/Pagination'
  import imageScale from '@/mixins/utilities/imageScale'
  import ChooseTab from '@/components/marketing/modal/ChooseTab'
  import FormateDate from '@/mixins/utilities/formateDate'
  export default {
    name: 'PosterList',
    mixins: [Api, imageScale, FormateDate],
    components: {
      EmptyPage,
      CustomSelect,
      CustomInput,
      Pagination,
      ChooseTab,
    },
    data () {
      return {
        is_show: false,
        // 搜索对象
        filter_data: {
          keyword: '',
          status: {
            id: '',
            name: '全部',
          },
          search_classify: [],
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
        }],
        list: [],
        paginationData: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
      }
    },
    methods: {
      // 去秒杀列表页面
      goAddSpike () {
        this.$router.push({
          name: 'spikeList',
        })
      },
      // 去数据查看
      goData (item) {
        this.$router.push({
          name: 'dataStatistics',
          query: {
            show_data: item.make ? 2 : 1,
            spike_id: item.id,
            name: '数据统计',
            type: 'dataStatistics',
            urlName: 'dataStatistics',
            spike_name: item.product.name,
            good_type: item.product.type,
            id: item.product.basic_spu_id,
          },
        })
      },
      // 去海报物料制作
      goPoster (item) {
        this.$router.push({
          name: 'posterMateriel',
          query: {
            show_data: item.make ? 2 : 1,
            spike_id: item.id,
            name: '宣传海报物料',
            type: 'posterMateriel',
            urlName: 'posterMateriel',
            spike_name: item.product.name,
            good_type: item.product.type,
            id: item.product.basic_spu_id,
          },
        })
      },
      // 返回
      goBack () {
        this.$router.push({
          name: 'allApp',
        })
      },
      getClassify (val) {
        this.filter_data.search_classify = val
      },
      // 获取列表数据
      async getList () {
        let params = {
          name: this.filter_data.keyword,
          status: this.filter_data.status.id,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        }
        if (this.filter_data.search_classify.length > 1) params.type = this.filter_data.search_classify[0]
        if (params.type > 2) {
          if (this.filter_data.search_classify[1] !== 0) params.parent_category_id = this.filter_data.search_classify[1]
        } else {
          if (this.filter_data.search_classify.length > 2) params.parent_category_id = this.filter_data.search_classify[1]
          if (this.filter_data.search_classify.length > 2 && this.filter_data.search_classify[2] !== 0) params.category_id = this.filter_data.search_classify[2]
        }
        try {
          const { response, result } = await this.getSpikeGroupApi(params)
          if (response.status === 200 && result.code === 0) {
            result.data.forEach(item => {
              item.product.sales_price = (item.product.sales_price / 100).toFixed(2)
              let event = 0
              item.product.sku.forEach(cell => {
                if (cell.enable === 1) event += (cell.inventory_total + cell.sales_total)
              })
              item.event_num = event
            })
            this.list = result.data
            this.paginationData = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取秒杀列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '秒杀列表')
        }
      },
      // 搜索
      search () {
        this.paginationData.current_page = 1
        this.getList()
      },
      // 重置
      reset () {
        if (this.$refs.child) this.$refs.child.parentMsg()
        this.filter_data = {
          keyword: '',
          status: {
            id: '',
            name: '全部',
          },
          search_classify: [],
        }
        this.paginationData.current_page = 1
        this.getList()
      },
      // 分页跳转
      paging (state) {
        this.paginationData = state
        this.getList()
      },
    },
    mounted () {
      this.is_show = true
      this.getList()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  .width-160
    max-width 160px !important 
  .section-filter
    display flex
    justify-content space-between
  .add-icon
    display inline-flex
    width 16px
    height 16px
    background url('~@/assets/icons/button-add.svg') no-repeat center center
    background-size cover
    margin-right 6px
    margin-top 8px
  .section-layout
    height calc(100% - 48px)
  .list-wrapper
    height calc(100% - 90px) !important
  .nav-back-btn
    position absolute
    top -39px
    left 16px
    width 32px
    height 32px
    border-radius 100%
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
    cursor pointer
    z-index 21
</style>
