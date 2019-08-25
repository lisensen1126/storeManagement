<template lang="pug">
  .section-layout.pps

    slide-out-modal(v-if="slideVisible", @input="toggleAddPannel")
      add-organization(@success="addedHandler", :id="editId" :pid="editPid")

    .section-filter.field-group.is-horizontal.pp
      <!--.field.keyword-wrapper-->
        <!--label.label 关键字搜索-->
        <!--custom-input(v-model="filterData.keyword", placeholder="组织")-->
      <!--.field-->
        <!--a.button.primary(@click="search") 搜索-->

      .field-group.is-horizontal.haha
        .field
          label.label &nbsp;
          a.button.primary.disabled(v-if="!isAddBtnView")
            span.add-icon
            span 添加部门
          a.button.primary(v-if="isAddBtnView" @click="addOrg" )
            span.add-icon
            span 添加部门

    .listData
      .left-list
        .thead 组织层级
        el-tree.list(:props="orgTreeConfig" ref="tree" node-key="dpId" :load="loadOrgTreeNode" lazy empty-text="暂无组织信息" :default-expanded-keys="treeExpandedKeys" :highlight-current="true" @node-click="onOrgTreeNodeClick" @current-change="onOrgTreeNodeCurrentChange")

      .right-data
        empty-page.emp(v-if="!(list && list.length)", tip="暂无数据")

        .content-wrapper.list-wrapper(v-if="list && list.length")
          .table-wrapper
            table.table

              thead
                tr
                  td(v-for="th in theadConfig", v-text="th.name", :width="th.width")

              tbody(v-if="list.length")
                tr(v-for="(item, index) in list")
                  td
                    .content-item(v-text="item.dpName")
                  td
                    .operation-td
                      a.operation-link.bian( @click="editOrg(item)") 编辑
                      a.operation-link.bian( @click="deleteOrg(item)") 删除
                      // v-if="item.departmentMemberCount==0"

          <!--.tfoot(v-if="list.length")-->
            <!--pagination(:pagination-data="paginationData", @input="paging")-->

</template>

<script>
  // import TreeList from '@/components/generics/TreeList'
  import AddOrganization from '@/components/basicInformation/organization/AddOrganization'
  import Pagination from '@/components/generics/Pagination'
  import DatePicker from '@/components/generics/form/DatePicker'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import CustomInput from '@/components/generics/form/CustomInput'
  import StaffPicker from '@/components/generics/form/StaffPicker'
  import filterTools from '@/mixins/utilities/filterTools'
  import imageScale from '@/mixins/utilities/imageScale'
  import organization from '@/mixins/modules/organization'
  import EmptyPage from '@/components/generics/EmptyPage'
  import CustomEditableInput from '@/components/generics/CustomEditableInput'
  import CustomEditableDatePicker from '@/components/generics/CustomEditableDatePicker'
  export default {
    name: 'OrganizationList',
    mixins: [organization, filterTools, imageScale],
    components: {
      // TreeList,
      CustomInput,
      StaffPicker,
      Pagination,
      DatePicker,
      SlideOutModal,
      AddOrganization,
      EmptyPage,
      CustomEditableInput,
      CustomEditableDatePicker,
    },
    data () {
      return {
        list: [],
        slideVisible: false,
        isAddBtnView: false,
        treeExpandedKeys: [],
        orgTreeConfig: {
          label: 'dpName',
          children: 'children',
          isLeaf: 'leaf',
        },
        theadConfig: [{
          name: '部门名称',
          width: '70%',
        }, {
          name: '操作',
          width: '30%',
        }],
      }
    },
    methods: {
      // 动态获取组织信息
      loadOrgTreeNode (node, resolve) {
        if (node.level > 2) return resolve([])
        if (node.level === 0) {
          return this.fetchOrg({}, resolve, node)
        }
        this.fetchOrg({dpId: node.data.dpId}, resolve, node)
      },
      // 点击组织节点
      onOrgTreeNodeClick (data, node) {
        if (node && node.level === 1) {
          this.fetchOrg({dpId: node.data.dpId})
        } else {
          this.list = []
        }
      },
      onOrgTreeNodeCurrentChange (data, node) {
        if (node && node.level === 1) {
          this.isAddBtnView = true
        } else {
          this.isAddBtnView = false
        }
      },
      addOrg () {
        let data = this.$refs.tree.getCurrentNode()
        this.editPid = data.dpId
        this.editId = undefined
        this.toggleAddPannel()
      },
      editOrg (data) {
        this.editPid = data.dpParentid
        this.editId = data.dpId
        this.toggleAddPannel()
      },
      toggleAddPannel () {
        this.slideVisible = !this.slideVisible
      },
      addedHandler () {
        this.toggleAddPannel()
        this.refreshTreeAndList()
      },
      refreshTreeAndList () {
        let _self = this
        let data = this.$refs.tree.getCurrentNode()
        let dpId = data.dpId
        this.fetchOrg({dpId: dpId}, function (data) {
          _self.list = data || []
          _self.$refs.tree.updateKeyChildren(dpId, (data || []).map(function (item) {
            item.leaf = true
            return item
          }))
        })
      },
      deleteOrg (data) {
        this.$store.dispatch('showMessage', {
          title: '确认删除',
          content: '确认删除该部门？',
          isRejectable: 1,
          resolve: () => {
            this.remoteOrg(data)
          },
        })
      },
      async remoteOrg (data) {
        try {
          const {result, response} = await this.removeOrganization({
            dpId: data.dpId,
          })
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '删除部门成功',
            })
            this.refreshTreeAndList()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除部门失败',
              content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除部门失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
      },
      async fetchOrg (param, resolve, node) {
        try {
          const {result, response} = await this.fetchOrganizationList(param)
          if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
            if (resolve) {
              if (node && node.level === 1) {
                resolve((result || []).map(function (item) {
                  item.leaf = true
                  return item
                }))
              } else {
                if (node && node.level === 0 && result && result.length) {
                  this.treeExpandedKeys = [result[0].dpId]
                }
                resolve(result)
              }
            } else {
              this.list = result
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取组织列表失败',
              content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取组织列表失败',
            content: `服务异常，请稍后再试 ${err}`,
          })
        }
      },
    },
    mounted () {
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .listData
    display flex
    justify-content start
  .pps
    overflow scroll
  .pp
    position relative
  .haha
    position absolute
    bottom 20px
    right 50px
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
  .left-list
    padding-left 30px
    margin-right 18px
  .list
    width 320px
    height 442px
    overflow scroll
    background rgba(247,247,247,1)
    box-shadow 0px 4px 10px 0px rgba(53,53,53,0.08)
    border-radius 3px
    border 1px solid rgba(221,221,221,1)
  .thead
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #fff;
    background-color: #efac1b;
    padding: 20px;
    text-align: center;
  .table
    margin-top 5px
  .list-wrapper
    height 496px
    position relative
  .tfoot
    position absolute
    bottom 0
  .bian
    height 16px
    font-size 13px
    font-family:MicrosoftYaHei
    color rgba(47,171,221,1)
    line-height 16px
    padding-right 17px
    margin-right 0
  .shan
    padding-left 17px
    color rgba(235,78,56,1) !important
    border-left 1px solid rgba(0,0,0,0.08)
  .emp
    width 770px
    height 440px
    background white
    margin-left 24px
    margin-top 56px
  .right-data
    width 100%
</style>
