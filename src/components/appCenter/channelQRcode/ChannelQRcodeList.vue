<template lang="pug">
  //- 渠道二维码列表页面
  .section-layout.content
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 二维码名称
          custom-input(v-model="filterData.keyword", placeholder="请输入二维码名称", @keyupEnter="search")
        .field.staff-wrapper.width-160
          label.label 二维码分类
          custom-select(v-model="filterData.type", :list="type_list")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset") 重置
      .field
        a.button.addQRcode(@click="addQRcode") 新建二维码
    empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有二维码")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="100") 二维码名称
              td(width="70") 二维码图片
              td(width="100") 分类
              td(width="100") 生成时间
              td(width="100") 操作人
              td(width="100") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.name}}
              td
                .simple-td.qrCodeBox
                    img.qrCode(:src="item.image_url_mini")
                    .qrCodeDialog
                        img(:src="item.image_url_comm")
              td
                .simple-td(v-if="item.cid == 1") 线上渠道
                .simple-td(v-if="item.cid == 2") 线下渠道
              td
                .simple-td {{(item.created_at - 0) | date("yyyy-MM-dd HH:mm:ss", "cn")}}
              td
                .simple-td {{item.operator}}
              td
                .operation-td
                  a.operation-link(@click="downloadQRcode(item.id)") 下载
                  a.operation-link(@click="editQRcode(item.id)") 编辑
                  a.operation-link(@click="deleteQRcode(item.id)") 删除
        .tfoot(v-if="list.length")
      pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
  import PriorConditions from '@/components/generics/PriorConditions'
  import ServiceTab from '@/components/generics/ServiceTab'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import EmptyPage from '@/components/generics/EmptyPage'
  import Api from '@/mixins/modules/AppCenter'
  import Pagination from '@/components/generics/Pagination'
  import imageScale from '@/mixins/utilities/imageScale'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import PosterPreviewModal from '@/components/appCenter/PosterPreviewModal'
  import filterTools from '@/mixins/utilities/filterTools'
  import {root} from '@/plugins/Fetch'
  export default {
    name: 'ChannelQRcodeList', // 应用中心 --> 渠道二维码页面
    mixins: [Api, imageScale, filterTools],
    components: {
      PriorConditions,
      PosterPreviewModal,
      ServiceTab,
      EmptyPage,
      CustomInput,
      CustomSelect,
      Pagination,
      SlideOutModal,
    },
    data () {
      return {
        root,
        img_bg: '', // 海报背景
        showQrcode: false, // 是否显示二维码大图
        type: 1, // 海报类型
        isInitiated: false, // 页面初始状态
        // 搜索对象
        filterData: {
          keyword: '',
          type: {
            type: '',
            name: '全部',
          },
        },
        type_status: {
          type: 1,
          name: '拼团海报',
        },
        type_list: [
          {
            type: '',
            name: '全部',
          },
          {
            type: 1,
            name: '线上渠道',
          },
          {
            type: 2,
            name: '线下渠道',
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
    watch: {
      'filterData.type': function (val) {
        console.log('filterData.type', val)
      },
    },
    methods: {
      // 新建二维码
      addQRcode () {
        this.$router.push({
          name: 'channelQRcodeEdit',
          query: {
            isAdd: true,
          },
        })
      },
      // 操作 -- 下载
      downloadQRcode (id) {
        console.log('下载二维码', id)
        let url = `${root}/collector/download?id=${id}`
        window.open(url)
      },
      // 操作 -- 编辑
      editQRcode (id) {
        console.log('编辑二维码', id)
        localStorage.setItem('channelQRcodeList', this.list)
        this.$router.push({
          path: 'channelQRcodeEdit',
          query: {
            id: id,
          },
        })
      },
      // 操作 -- 删除
      deleteQRcode (id) {
        console.log('删除二维码', id)
        this.$store.dispatch('showMessage', {
          title: '确认删除该二维码吗？',
          // content: '删除后该二维码将不存在',
          isRejectable: 1,
          resolve: () => {
            // this.deleteEApi(item)
            this.deleteQrcodeApi(id)
          },
        })
      },
      async deleteQrcodeApi (id) {
        try {
          const { response, result } = await this.deleteChannelQRcodeApi({
            id: id,
          })
          if (response.status === 200 && result.code === 0) {
            // 删除成功后，再次请求列表
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '删除成功',
              resolve: () => {
                // 返回上一级
                this.getList()
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除渠道二维码列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '渠道二维码')
        }
      },
      // 获取列表数据
      async getList () {
        try {
          const { response, result } = await this.getChannelQRcodeListApi({
            keywords: this.filterData.keyword,
            cid: this.filterData.type.type,
            page: this.paginationData.current_page,
            per_page: this.paginationData.per_page,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
            this.paginationData = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取渠道二维码列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '海报列表')
        }
        this.isInitiated = true
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
          type: {
            type: '',
            name: '全部',
          },
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
    // 导航守卫
    beforeRouteEnter (to, from, next) {
      /**
       * 判断是否属于同级页面
       * (由切换tab进入)
       */
      to.meta.isOutside = false
      if (!from.meta.isSlibing) {
        to.meta.isOutside = true
      }
      /**
       * 是添加 且 不是返回(保存)
       * @save: 1(返回)
       */
      // if ((from.name === 'authorityMgr' && to.query.save !== 1)) {
      //   to.meta.isPreserve = true
      // }
      next()
    },
    activated () {
      if (this.$route.meta.isOutside) {
        this.reset()
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  @import '~@/stylus/modules/table-sp';
  .qrCode{
      width:70px;
      height:70px;
  }
  .qrCodeBox{
    position relative
    overflow: unset;
  }
  .qrCodeBox:hover .qrCodeDialog{
    display block
  }
  .qrCodeDialog{
    display none
    position absolute;
    left -90px;
    top -60px;
    width 250px;
    // height 250px;
    background #fff;
    z-index 9;
    border: 1px solid #eee
    padding: 5px;
    box-shadow 0 2px 6px 5px rgba(0, 0, 0, 0.1)
    img{
      width:100%;
    }
  }
.addQRcode{
  background: #ffbb29;
  color: #121212;
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
