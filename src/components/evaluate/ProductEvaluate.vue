<template lang="pug">
  .section-layout
    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有商品评价'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="300") 商品名称
              td(width="80") 商品价格
              td(width="60") 评价内容
              td(width="80") 打分
              td(width="80") 综合评分
              td(width="80") 姓名/手机号
              td(width="80") 车牌号
              td(width="80") 时间
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td.has-image
                  .left-image
                    img(:src="scaleImage(item.pic, 1, 36, 36)")
                  .content-item(v-text="item.name")
              td
                .simple-td(v-text="'¥' + item.price")
              td
                .multi-content-td.word-break(v-text="item.comment_content")
              td
                .simple-td(v-text="item.score + '分'")
              td
                .simple-td(v-text="item.avg_score + '分'")
              td
                .multi-content-td.has-image.m-r-5
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
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import Pagination from '@/components/generics/Pagination'
import evaluateMixin from '@/mixins/modules/evaluate'
import EmptyPage from '@/components/generics/EmptyPage'
import imageScale from '@/mixins/utilities/imageScale'
import filterTools from '@/mixins/utilities/filterTools'

export default {
  name: 'productEvaluate',
  mixins: [evaluateMixin, filterTools, imageScale],
  components: {
    EmptyPage,
    Pagination,
    filterTools,
  },
  data: _ => {
    const schema = {
      isInitiated: false,
      list: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
    }
    return schema
  },
  methods: {
    // 获取商品评价列表数据
    async fetchData () {
      try {
        const {response, result} = await this.fetchCommentGoods({
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品评价列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取商品评价列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 翻页操作
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
    // 搜索
    applyFilter () {
      this.paginationData.current_page = 1
      this.fetchData()
    },
    // 重置
    resetFilter () {
      this.paginationData.current_page = 1
      this.fetchData()
    },
  },
  mounted () {
    this.fetchData() // 获取商品评价列表数据
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.tfoot
  overflow hidden
td,.multi-content-td
  vertical-align: middle
.m-r-5
  margin-right 5px
.h-17
  height 17px
</style>

