<template lang="pug">
  .section-layout
    .section-filter.field-group.is-horizontal.pp
      .field.keyword-wrapper
        label.label 关键字
        custom-input(v-model="filterData.keyword", placeholder="请输入员工姓名/手机号", @keyupEnter="applyFilter")
      .field
        a.button.primary(@click="applyFilter") 搜索
      .field
        a.button(@click="resetFilter") 重置
    empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有员工信息")

    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")

          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .content-item(v-text="item.name")
              td
                .multi-content-td.has-image
                  .left-image.round
                    img(v-if="item.photo", :src="item.photo")
                    img(v-if="!item.photo", src="../../assets/user-avatar.png")
              td
                .content-item(v-if="item.mem_job",v-text="item.mem_job")
                .content-item(v-if="!item.mem_job",v-text="'--'")
              td
                .content-item(v-text="item.mem_role")
              td
                .content-item(v-text="item.phone")
              td
                .simple-td
                  .status-dot(:class="{'primary': item.status == '1','green': item.status == '2'}")
                  span(v-if="item.status == '1'") 未同步
                  span(v-else) 已同步
              td
                .operation-td(v-if="item.status==1")
                  span.operation-link(@click="addEmployee(item)") 同步

      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")

    slide-out-modal(v-if="slideVisible", @input="toggleSidePannel")
      sync-employee-edit(@success="additionHandler",  :obj="obj",)

</template>

<script>
  import SyncEmployeeEdit from '@/components/synchronize/SyncEmployeeEdit'
  import Pagination from '@/components/generics/Pagination'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import CustomInput from '@/components/generics/form/CustomInput'
  import filterTools from '@/mixins/utilities/filterTools'
  import imageScale from '@/mixins/utilities/imageScale'
  import synchronize from '@/mixins/modules/synchronize'
  import EmptyPage from '@/components/generics/EmptyPage'

  export default {
    name: 'SyncEmployeeList',
    mixins: [synchronize, filterTools, imageScale],
    components: {
      CustomInput,
      Pagination,
      SlideOutModal,
      SyncEmployeeEdit,
      EmptyPage,
    },
    data () {
      return {
        roleNull: {
          roleId: '',
          roleName: '全部',
        },
        departmentNull: {
          dpId: '',
          dpName: '全部',
        },
        theadConfig: [{
          name: '姓名',
          width: '200',
        }, {
          name: '照片',
          width: '80',
        }, {
          name: '岗位',
          width: '200',
        }, {
          name: '角色',
          width: '200',
        }, {
          name: '联系电话',
          width: '100',
        }, {
          name: '状态',
          width: '80',
        }, {
          name: '操作',
          width: '80',
        }],
        list: [],
        isInitiated: false,
        paginationData: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 1,
        },
        filterData: {
          keyword: undefined,
          role: undefined,
          department: undefined,
        },
        queryData: {},
        slideVisible: false,
      }
    },
    methods: {
      // 同步员工操作
      addEmployee (item) {
        if (this.contact_status === 2) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '失败',
            content: '企业微信未授权，请先去授权',
          })
          return false
        }
        this.obj = item
        this.toggleSidePannel()
      },
      // 员工同步成功的回调
      additionHandler () {
        this.toggleSidePannel()
        this.fetchData()
      },
      // 控制员工同步侧边栏的显隐
      toggleSidePannel () {
        this.slideVisible = !this.slideVisible
      },
      // 获取同步员工列表数据
      async fetchData () {
        let self = this
        try {
          const {response, result} = await this.fetchXianFengList({
            keyword: this.filterData.keyword,
            page: self.paginationData.current_page,
            per_page: self.paginationData.per_page,
          })
          if (response.status === 200 && result.code === 0) {
            self.list.splice(0, self.list.length, ...result.data)
            this.paginationData = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取员工列表失败',
              content: `${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取员工列表失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
        this.isInitiated = true
      },
      // 重置表单
      resetFilter () {
        this.filterData.keyword = undefined
        this.queryData = {}
        this.paginationData.current_page = 1
        this.fetchData()
      },
      // 分页
      paging (state, evt) {
        this.paginationData = state
        this.recallFilter()
        this.fetchData()
      },
      recallFilter () {
        this.switchFilterData(this.queryData, this.filterData)
      },
      // 回车搜索
      applyFilter () {
        this.paginationData.current_page = 1
        this.switchFilterData(this.filterData, this.queryData)
        this.fetchData()
      },
      // 获取微信授权 - 企业微信通讯录授权状态
      async getContactAuthStatus () {
        let self = this
        try {
          const {response, result} = await this.fetchContactAuthStatus()
          if (response.status === 200 && result.code === 0) {
            self.contact_status = result.data.status // 通讯录授权状态（1：已授权 2：未授权）
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取企业微信通讯录授权状态失败',
              content: `${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取企业微信通讯录授权状态失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
      },
    },
    mounted () {
      this.getContactAuthStatus() // 获取微信授权 - 企业微信通讯录授权状态
      this.fetchData() // 获取同步员工列表数据
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .content
    display flex
    justify-content start
  .pp
    position relative
  .haha
  .add-icon
  .category-icon
    display inline-flex
    width 16px
    height 16px
    background url('~@/assets/icons/button-add.svg') no-repeat center center
    background-size cover
    margin-right 6px
    margin-top 8px
  .category-icon
    background-image url('~@/assets/icons/button-catrgory.svg')
  .page-selector
    label
      z-index 5
  .right-box
    display flex
    position absolute
    bottom 20px
    right 30px
  .xi
    align-self flex-end
  .bian
    height 16px
    font-size 13px
    font-family:MicrosoftYaHei
    color rgba(47,171,221,1)
    line-height 16px
    padding-right 17px
    margin-right 0
  .del
    padding-left 17px
    color rgba(235,78,56,1)
    border-left 1px solid rgba(0,0,0,0.08)
  .button
    padding 0 10px
  .username
    line-height 36px
  .field-role
    width 120px
  .table tbody tr td
    max-width 130px
  .subFile
    width 74px
    height 32px
    position absolute
    top 0
    left 0
    opacity 0
    input
      width 100%
      height 100%
      position absolute
      top 0
      left 0
  .position-relative
    position relative
</style>
