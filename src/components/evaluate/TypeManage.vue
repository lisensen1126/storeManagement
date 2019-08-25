<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.name_keyword-wrapper
          label.label 来源
          custom-select(v-model="source", :list="source_list", nameField="name")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="createInspection")
            span.add-icon
            span 新增车检单
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前没有车检类型'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="120") 车检单名称
              td(width="140") 更新时间
              td(width="120") 操作人
              td(width="120") 车检场景
              td(width="120") 车检项目
              td(width="120") 来源
              td(width="120") 是否上架
              td(width="60") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.name}}
              td
                .simple-td {{item.updated_time | date('yyyy年MM月dd HH:mm:ss', 'cn')}}
              td
                .simple-td {{item.operator_name}}
              td
                .simple-td {{item.categories_count}}
              td
                .simple-td {{item.items_count}}
              td
                .simple-td(v-if="item.from===1") BOSS
                .simple-td(v-if="item.from===2") 门店
              td
                .simple-td
                  .switch
                    input(type="checkbox", :id="'display' + index", v-model="item.is_select", @change="displayConfirm(index)")
                    label(:for="'display' + index")
              td
                .operation-td(v-if="item.from===1")
                  span.operation-link(@click="copyInspection(item.id)") 复制
                  span.operation-link(@click="seeInspection(item.id)") 查看
                .operation-td(v-if="item.from===2")
                  span.operation-link(@click="editInspection(item.id)") 编辑
                  span.operation-link(v-if="!item.is_select", @click="delInspection(item.id)") 删除
      .tfoot(v-if="true")
        pagination(:pagination-data="pagination_data", @input="paging")
</template>

<script>
  import Pagination from '@/components/generics/Pagination'
  import marketingMixin from '@/mixins/modules/marketing'
  import filterTools from '@/mixins/utilities/filterTools'
  import imageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import CustomInput from '@/components/generics/form/CustomInput'
  import Api from '@/mixins/modules/evaluate'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  export default {
    name: 'TypeManage',
    mixins: [marketingMixin, filterTools, imageScale, Api],
    components: {
      EmptyPage,
      Pagination,
      CustomInput,
      CustomSelect,
    },
    data () {
      return {
        pagination_data: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        source: {
          value: '1',
          name: '全部',
        },
        source_list: [
          {
            value: '1',
            name: '全部',
          },
          {
            value: '2',
            name: 'BOSS',
          },
          {
            value: '3',
            name: '门店',
          },
        ],
        list: [],
        is_initiated: false,
      }
    },
    methods: {
      // 修改是否上下架状态
      async displayConfirm (index) {
        let _this = this
        try {
          const { response, result } = await _this.getInspectStatusApi({
            inspect_id: _this.list[index].id,
            status: _this.list[index].is_select ? 1 : 2,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              _this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '修改成功',
                resolve: () => {
                  _this.getInspectionList()
                },
              })
            } else {
              _this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '修改失败',
                content: `${result.message}`,
              })
              // _this.list[index].is_select = !_this.list[index].is_select
            }
          } else {
            _this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改信息失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改信息失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
          _this.list[index].is_select = !_this.list[index].is_select
        }
      },

      // 重置
      reset () {
        this.source = {
          value: '1',
          name: '全部',
        }
        this.pagination_data.current_page = 1
        this.getInspectionList()
      },

      // 搜索
      search () {
        this.pagination_data.current_page = 1
        this.getInspectionList()
      },

      /**
       * 分页处理
       * @status  分页的状态
       */
      paging (state) {
        this.pagination_data = state
        this.getInspectionList()
      },
      // 复制
      copyInspection (id) {
        this.$router.push({
          name: 'AddInspection',
          query: {
            edit: 1,
            classify_id: id,
          },
        })
      },
      // 查看
      seeInspection (id) {
        this.$router.push({
          name: 'AddInspection',
          query: {
            edit: 2,
            classify_id: id,
          },
        })
      },
      // 编辑车检报告
      editInspection (id) {
        this.$router.push({
          name: 'AddInspection',
          query: {
            edit: 3,
            classify_id: id,
          },
        })
      },
      // 添加车检报告
      createInspection () {
        this.$router.push({
          name: 'AddInspection',
          query: {
            edit: 4,
          },
        })
      },
      // 删除车检项
      delInspection (id) {
        this.$store.dispatch('showMessage', {
          title: '提示',
          content: '确认删除该条车检内容嘛？',
          isRejectable: 1,
          resolve: () => {
            this.removeApi(id)
          },
        })
      },

      /**
       * 删除接口
       * @id {int} 删除的id
       */
      async removeApi (id) {
        let _this = this
        try {
          const { response, result } = await this.getInspectDeteleApi({
            id: id,
          })
          if (response.status === 200) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '删除成功',
              resolve: () => {
                _this.getInspectionList()
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除信息失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除信息失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },

      // 获取车检单列表
      async getInspectionList () {
        let params = {
          from: this.source.value,
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
        }
        try {
          const { response, result } = await this.getInspectListApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              result.data.data.forEach(item => {
                if (item.status === 1) {
                  item.is_select = true
                } else {
                  item.is_select = false
                }
              })
              this.list = result.data.data
              this.pagination_data = result.meta
              this.is_initiated = true
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取车检列表失败',
                content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取车检列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch ({ response, result }) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取车检列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      this.getInspectionList()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  .section-layout {
    height: calc(100% - 56px);
  }

  .icon-img {
    height: 36px;
  }

  .icon-img img {
    width: 36px;
    height: 36px;
  }

  .section-filter-none.is-horizontal {
    height: 0;
    padding: 0;
  }

  .section-filter .add-button {
    bottom: initial;
  }

  .section-filter {
    display: flex;
    justify-content: space-between;
  }

  .button {
    align-items: center;
  }

  .add-icon {
    display: inline-flex;
    width: 16px;
    height: 16px;
    background: url('~@/assets/icons/button-add.svg') no-repeat center center;
    background-size: cover;
    margin-right: 6px;
  }

  .section-layout {
    height: calc(100% - 48px);
  }

  .list-wrapper {
    height: calc(100% - 90px) !important;
  }
</style>
