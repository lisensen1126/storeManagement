<template lang="pug">
  .section-layout
    .nav-title 发送记录列表
      .nav-back-btn(@click="goList")
    .section-filter
      .field-group.is-horizontal
        .field.name_keyword-wrapper
          label.label 关键字搜索
          custom-input(need-type="number", v-model="filter_data.mobile", placeholder="请输入用户手机号", @keyupEnter="applyFilter")
        .field.is-narrow
          label.label 发送状态
          custom-select(v-model="filter_data.status", :list="status_list")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field.right-btn
          a.button(@click="exportExcel", :class="has_fail - 0 === 1 ? '' : 'primary'") 导出失败用户
    empty-page(v-if="!list.length", :tip="'当前没有发送记录'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="400") 用户信息
              td(width="80") 模板名称
              td(width="180") 发送时间
              td(width="200") 发送状态
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .user-info
                  img.avatar(:src="item.avatar ? item.avatar : 'https://oss1.chedianai.com/images/assets/user-avatar.png'")
                  .info
                    .user-name {{item.nick_name}}
                    .mobile {{item.mobile}}
              td
                .simple-td(v-text="item.template_name")
              td
                .simple-td(v-if="!item.created_at", v-text="'--'")
                .simple-td(v-if="item.created_at", v-text="formateDate(item.created_at, true, 2)")
              td
                .simple-td(v-if="item.status === 1") 发送成功
                .simple-td(v-if="item.status === 2") 发送失败
        .tfoot(v-if="list.length")
          pagination(:pagination-data="pagination_data", @input="paging")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import Api from '@/mixins/modules/marketing'
import { root } from '@/plugins/Fetch'
import FormateDate from '@/mixins/utilities/formateDate'
export default {
  name: 'ContentList',
  mixins: [filterTools, imageScale, Api, FormateDate],
  components: {
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
  },
  data: () => {
    return {
      status_list: [{
        name: '全部',
        type: '',
      }, {
        name: '发送成功',
        type: 1,
      }, {
        name: '发送失败',
        type: 2,
      }],
      filter_data: {
        status: {
          name: '全部',
          type: '',
        },
        mobile: '',
      },
      pagination_data: {
        current_page: 1,
        per_page: 20,
        last_page: 2,
        total: 0,
      },
      list: [],
      id: 0,
      has_fail: 0,
    }
  },
  methods: {
    // 去推送列表
    goList () {
      this.$router.push({
        name: 'pushList',
        query: {
          save: 1
        },
      })
    },
    // 导出失败用户
    exportExcel () {
      if (this.has_fail - 0 === 1) {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'failure',
          title: '提示',
          content: '本次推送暂无发送失败用户',
        })
        return false
      }
      this.$store.dispatch('showMessage', {
        title: '导出未发送用户',
        content: '导出后按以下步骤可继续发送短信通知：<br/>1、导出未发送用户Excel表格；<br/>2、点击后台“营销助手-短信发送”，导入客户，发送短信',
        isRejectable: 1,
        resolve: () => {
          window.open(`${root}/template_message/task_log/export?task_id=${this.id}`)
        },
      })
    },
    // 记录列表
    async fetchData () {
      try {
        const { response, result } = await this.pushRecordListApi({
          task_id: this.id,
          status: this.filter_data.status.type,
          mobile: this.filter_data.mobile,
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.list = result.data.data
          this.has_fail = result.data.has_fail
          this.pagination_data = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取发送记录列表失败',
            content: result.message,
          })
        }
      } catch (err) {
        console.error('发送记录列表', err)
      }
    },
    // 搜索按钮
    applyFilter () {
      this.pagination_data.current_page = 1
      this.fetchData()
    },
    // 重置
    resetFilter (page) {
      this.pagination_data.current_page = 1
      this.filter_data = {
        status: {
          name: '全部',
          type: '',
        },
        mobile: '',
      }
      this.fetchData()
    },
    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.pagination_data = state
      this.fetchData()
    },
  },
  watch: {},
  mounted () {
    this.id = this.$route.query.id - 0
    this.fetchData()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.nav-title
  width 100%
  height 48px
  background-color #ffffff
  line-height 48px
  padding-left 60px
.nav-back-btn
  position absolute
  top 9px
  left 16px
  width 32px
  height 32px
  border-radius 100%
  background #CED3DC center no-repeat url('~@/assets/back.svg')
  background-size 16px
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
  cursor pointer
  z-index 2
.right-btn {
  margin-top 20px
}
.not-allow {
  cursor not-allowed
}
.user-info {
  display flex
  justify-content start
  height 40px
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 36px;
  margin-right: 12px;
}
.info {
  color: black;
  font-size: 12px;
  line-height 18px;
}
.section-filter {
  display: flex;
  justify-content: space-between;
}

.name_keyword-wrapper {
  width: 244px;
}
.button {
  align-items: center;
}
</style>
