<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slideVisible", :is-slim="true", @input="toggleSidePannel")
      poster-preview-modal(:img-url="img_bg", :type="type")
      span.red 注：该海报仅为示意图片，您可到门店小程序体验分享海报及扫码功能。
    prior-conditions
      service-tab(v-model="type_status", :tabs="status_list", :have-icon="false", :have-quantity="false", @input="changeOrderStatus")
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filterData.keyword", placeholder="请输入海报名称", @keyupEnter="search")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset") 重置
    empty-page(v-if="!(list && list.length)", tip="当前没有海报")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="100") 海报名称
              td(width="100") 海报类型
              td(width="100") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.name}}
              td
                .simple-td(v-if="item.type == 1") 秒杀海报
                .simple-td(v-if="item.type == 2") 拼团海报
                .simple-td(v-if="item.type == 5") 养护卡海报
              td
                .operation-td
                  a.operation-link(@click="toggleSidePannel(item)") 预览
        .tfoot(v-if="list.length")
      pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
  import PriorConditions from '@/components/generics/PriorConditions'
  import ServiceTab from '@/components/generics/ServiceTab'
  import CustomInput from '@/components/generics/form/CustomInput'
  import EmptyPage from '@/components/generics/EmptyPage'
  import Api from '@/mixins/modules/AppCenter'
  import Pagination from '@/components/generics/Pagination'
  import imageScale from '@/mixins/utilities/imageScale'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import PosterPreviewModal from '@/components/appCenter/PosterPreviewModal'
  export default {
    name: 'PosterList',
    mixins: [Api, imageScale],
    components: {
      PriorConditions,
      PosterPreviewModal,
      ServiceTab,
      EmptyPage,
      CustomInput,
      Pagination,
      SlideOutModal,
    },
    data () {
      return {
        img_bg: '', // 海报背景
        type: 1, // 海报类型
        slideVisible: false,
        isInitiated: false,
        // 搜索对象
        filterData: {
          keyword: '',
        },
        type_status: {
          type: 1,
          name: '拼团海报',
        },
        status_list: [
          {
            type: 1,
            name: '秒杀海报',
          },
          {
            type: 2,
            name: '拼团海报',
          },
          {
            type: 5,
            name: '养护卡海报',
          },
        ],
        list: [],
        paginationData: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        query_data: {},
      }
    },
    methods: {
      // 预览
      toggleSidePannel (item) {
        console.log(item)
        this.img_bg = item.cover
        this.type = item.type
        this.slideVisible = !this.slideVisible
      },
      // 获取列表数据
      async getList () {
        try {
          const { response, result } = await this.getPosterListApi({
            name: this.filterData.keyword,
            page: this.paginationData.current_page,
            size: this.paginationData.per_page,
            type: this.type_status.type,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
            this.paginationData = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取海报列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '海报列表')
        }
      },
      // 搜索
      search () {
        for (let key in this.filterData) {
          if (this.query_data.hasOwnProperty(key)) {
            this.query_data[key] = this.filterData[key]
          }
        }
        this.paginationData.current_page = 1
        this.getList()
      },
      // 重置
      reset () {
        this.filterData = {
          search_order_type: null,
          keyword: '',
        }
        this.query_data = JSON.parse(JSON.stringify(this.filterData))
        this.getList()
      },
      // 分页跳转
      paging (state) {
        this.paginationData = state
        this.getList()
      },
      // tabs 跳转
      changeOrderStatus () {
        this.$set(this.paginationData, 'current_page', 1)
        this.filterData = {
          keyword: '',
        }
        this.query_data = JSON.parse(JSON.stringify(this.filterData))
        this.getList()
      },
    },
    mounted () {
      this.getList()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  @import '~@/stylus/modules/table-sp';

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
  .money{
    width: 82px;
    height:36px;
  }
  .fccc {
    width: 100px;
    height: 200px;
    background: red;
  }
  .red {
    color: red;
    font-size: 15px;
    margin-left: 10px;
  }
  .bigImg {
    z-index: 9999;
  }
  .section-filter {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .margin {
    margin: 0 8px;
    font-size: 14px;
  }

</style>
