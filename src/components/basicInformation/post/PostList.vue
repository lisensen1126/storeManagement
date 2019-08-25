<template lang="pug">
  .section-layout

    slide-out-modal(v-if="slideVisible", @input="toggleAddPannel")
      add-post(@success="addedHandler", :obj="editObj")

    .section-filter

      .field-group.is-horizontal
        <!--.field.keyword-wrapper-->
          <!--label.label 关键字搜索-->
          <!--custom-input(v-model="filterData.keyword", placeholder="岗位名称")-->
        <!--.field-->
          <!--a.button.primary(@click="applyFilter") 搜索-->
        <!--.field-->
          <!--a.button(@click="resetFilter") 重置-->

      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="addPost")
            span.add-icon
            span 新建岗位

    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有岗位信息'")

    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table

          thead
            tr
              td(width="70%") 岗位
              td(width="30%") 操作

          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.jobName")
              td
                .operation-td
                  span.operation-link(@click="editPost(item)") 编辑
                  span.operation-link(@click="deletePost(item)") 删除

      <!--.tfoot(v-if="true")-->
        <!--pagination(:pagination-data="paginationData", @input="paging")-->
</template>

<script>
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import AddPost from '@/components/basicInformation/post/AddPost'
  import CustomInput from '@/components/generics/form/CustomInput'
  import Pagination from '@/components/generics/Pagination'
  import post from '@/mixins/modules/post'
  import filterTools from '@/mixins/utilities/filterTools'
  import imageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'

  export default {
    name: 'PostList',
    mixins: [post, filterTools, imageScale],
    components: {
      CustomInput,
      EmptyPage,
      Pagination,
      SlideOutModal,
      AddPost,
    },
    data: _ => {
      const schema = {
        isInitiated: false,
        slideVisible: false,
        paginationData: {
          current_page: 1,
          per_page: 500,
          last_page: 1,
          total: 0,
        },
        filterData: {
          keyword: '',
        },
        queryData: {
          keyword: '',
        },
        list: [],
      }
        // 初始化搜索条件
      ;[schema.filterData, schema.queryData].forEach(conditions => {
        conditions.keyword = ''
      })
      return schema
    },
    methods: {
      addPost () {
        this.editObj = undefined
        this.toggleAddPannel()
      },
      editPost (item) {
        this.editObj = item
        this.toggleAddPannel()
      },
      toggleAddPannel () {
        this.slideVisible = !this.slideVisible
      },
      addedHandler () {
        this.toggleAddPannel()
        this.fetchData()
      },
      deletePost (item) {
        this.$store.dispatch('showMessage', {
          title: '确认删除',
          content: `确认删除“${item.jobName}”吗?`,
          isRejectable: 1,
          resolve: () => {
            this.remove(item)
          },
        })
      },
      async remove (item) {
        try {
          const {response, result} = await this.removePost({jobId: item.jobId})
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '删除成功',
            })
            this.fetchData()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除失败',
              content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
      },
      async fetchData () {
        try {
          const {response, result} = await this.fetchPost({
            // keyword: this.queryData.keyword,
            pageNum: this.paginationData.current_page,
            pageSize: this.paginationData.per_page,
          })
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            this.list = result.data.list
            this.paginationData.current_page = result.data.pageNum
            this.paginationData.last_page = Math.ceil(result.data.total / this.paginationData.per_page)
            this.paginationData.total = result.data.total
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取岗位信息失败',
              content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取岗位信息失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
        this.isInitiated = true
      },
      applyFilter () {
        this.paginationData.current_page = 1
        this.switchFilterData(this.filterData, this.queryData)
        this.fetchData()
      },
      resetFilter () {
        this.queryData.keyword = ''
        this.recallFilter()
        this.paginationData.current_page = 1
        this.fetchData()
      },
      recallFilter () {
        this.switchFilterData(this.queryData, this.filterData)
      },
      paging (state) {
        this.paginationData = state
        this.recallFilter()
        this.fetchData()
      },
    },
    mounted () {
      this.fetchData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'

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
</style>
