<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.name_keyword-wrapper
          label.label 评论来源
          custom-select(:list="write_from", v-model="search_keywords", nameField="name")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置  
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前没有门店评价'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="60") 评价内容
              td(width="80") 打分
              td(width="80") 综合评分
              td(width="80") 姓名/手机号
              td(width="80") 车牌号
              td(width="80") 时间
              td(width="100") 门店回复
              td(width="60") 来源
              td(width="60") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .multi-content-td.word-break(v-text="item.comment_content")
                .pic(v-if="item.comment_image.length>0")
                  open-image(img-type="3",:img-url="item.comment_image",key-name="image_url",mini-width="20",mini-height="20",margin-bottom="0", margin-right="5", border-radius="2")
              td
                .simple-td(v-text="accDiv(item.score,100) + '分'")
              td
                .simple-td(v-text="accDiv(item.avg_score,100) + '分'")
              td
                .multi-content-td.has-image
                  .left-image.round
                    img(v-if="item.face", :src="scaleImage(item.face, 1, 36, 36)")
                    img(v-if="!item.face", src="../../assets/user-avatar.png")
                  .content-item.h-17(v-text="item.user_name")
                  .content-item.h-17(v-text="item.mobile")
              td
                .simple-td(v-if="item.vehicle", v-text="item.vehicle")
                .simple-td.null(v-else) 暂无数据
              td
                .simple-td(v-text="item.created_at")
              td
                .multi-content-td.word-break(v-if="item.sub_comment.length > 0") {{item.sub_comment[0].comment_content}}
                .multi-content-td.word-break(v-else) - -
              td
                .simple-td(v-if="item.source_type===1") 门店
                .simple-td(v-if="item.source_type===2") 平台
              td
                .operation-td
                  a.operation-link(@click="toggleSidePannel(item)", v-if="item.sub_comment &&item.sub_comment.length !==0") 编辑回复
                  a.operation-link(@click="deleteEvaluate(item)", v-if="item.sub_comment &&item.sub_comment.length !==0") 删除回复
                  a.operation-link(@click="toggleSidePannel(item)", v-else) 回复
      .tfoot(v-if="list.length")
        pagination(:pagination-data="pagination_data", @input="paging")
    slide-out-modal(v-if="slide_visible", @input="toggleSidePannel")
      comment-reply(:item="reply_item", @callback="replySuccess")
</template>

<script>
  import Pagination from '@/components/generics/Pagination'
  import EvaluateMixin from '@/mixins/modules/evaluate'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ImageScale from '@/mixins/utilities/imageScale'
  import FilterTools from '@/mixins/utilities/filterTools'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import CommentReply from '@/components/evaluate/CommentReply'
  import OpenImage from '@/components/generics/OpenImage'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import MathFun from '@/mixins/utilities/math'
  export default {
    name: 'storeEvaluate',
    mixins: [EvaluateMixin, FilterTools, ImageScale, MathFun],
    components: {
      EmptyPage,
      Pagination,
      FilterTools,
      SlideOutModal,
      CommentReply,
      OpenImage,
      CustomSelect,
    },
    data: _ => {
      const schema = {
        is_initiated: false,
        list: [],
        pagination_data: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        slide_visible: false, // 是否显示模态框
        reply_item: null, // 提供给回复模态框的数据
        write_from: [
          {
            id: 0,
            name: '全部',
          },
          {
            id: 2,
            name: '平台',
          },
          {
            id: 1,
            name: '门店',
          },
        ],
        search_keywords: null,
        query_search_keywords: null, // 搜索数据备份
        is_search: false, // 是否点击搜索
      }
      return schema
    },
    methods: {
      // 获取门店评价列表数据
      async fetchData () {
        try {
          const {response, result} = await this.fetchCommentStore({
            source_type: this.query_search_keywords ? this.query_search_keywords.id : '',
            page: this.pagination_data.current_page,
            per_page: this.pagination_data.per_page,
          })
          if (response.status === 200 && result.code === 0) {
            this.list.splice(0, this.list.length, ...result.data)
            this.pagination_data = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取门店评价列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店评价列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.is_initiated = true
      },
      // 翻页操作
      paging (state) {
        this.pagination_data = state
        this.fetchData()
      },
      // 搜索
      applyFilter () {
        this.is_search = true
        this.pagination_data.current_page = 1
        this.query_search_keywords = JSON.parse(JSON.stringify(this.search_keywords))
        this.fetchData()
      },
      // 重置
      resetFilter () {
        this.is_search = false
        this.search_keywords = null
        this.query_search_keywords = null
        this.pagination_data.current_page = 1
        this.fetchData()
      },
      // 重置部分参数
      resetParams () {
        this.search_keywords = null
        this.query_search_keywords = null
      },
      // 显隐右侧回复模态框
      toggleSidePannel (item) {
        console.log(item, 'djhdjd')
        this.reply_item = item
        this.slide_visible = !this.slide_visible
      },
      // 回复成功回调
      replySuccess () {
        this.slide_visible = !this.slide_visible
        if (!this.is_search) {
          this.resetParams()
        }
        this.fetchData()
      },
      /*
      *  删除回复
      *  @item {object} 评论对象
      * */
      deleteEvaluate (item) {
        this.$store.dispatch('showMessage', {
          title: '确认删除该回复？',
          content: '删除后数据将无法恢复',
          isRejectable: 1,
          resolve: () => {
            this.removeApi(item)
          },
        })
      },
      /**
       * 删除评论 接口
       * @ item  评论对象
       */
      async removeApi (item) {
        try {
          const {response, result} = await this.removeRecordApi({
            comment_id: item.sub_comment[0].comment_id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '删除成功',
                resolve: () => {
                  if (!this.is_search) {
                    this.resetParams()
                  }
                  this.fetchData()
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '删除回复失败',
                content: `错误：${result.message}`,
              })
            }
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除回复失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      this.fetchData() // 获取门店评价列表数据
    },
  }
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.tfoot
  overflow hidden
td,.multi-content-td
  vertical-align: middle
.h-17
  height 17px
.word-break
  word-break break-all
  word-wrap break-word
.pic
  span
    display inline-block
    padding: 8px 5px 0 0
    img
      width 20px
      height 20px
</style>

