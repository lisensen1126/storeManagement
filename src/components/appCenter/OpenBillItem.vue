<template lang="pug">
  .section-layout
    choose-item(v-model="show_modal", v-if="show_modal", :index="cur_tab.index", @resolve="getBillList")
    .content-wrapper
      service-tab.top-nav(v-model="currt_type", :tabs="pay_type", :have-icon="false", :have-quantity="false", class="status-list", @input="changeTab($event)")     
      .left-tabs
        .tab(v-for="item in open_bill_list", @click="toggleTab(item)" :class="{'active-tab':item.index===cur_tab.index}") {{item.name}}
      .top-bar
        button.button.primary(v-if="cur_tab.index!==6", @click="syncItem")  同步项目
        button.button.primary(@click="show_modal=true")  添加项目
      .table-wrapper
        empty-page(tip="暂无项目", v-if="has_load && cur_list.length===0")
        table.table(v-show="cur_list.length>0")
          thead
            tr
              td(width="30%") 项目名称
              td(width="30%") 项目分类
              td(width="20%")
                span 项目价格
                el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'商品价格默认展示该商品其中一个SKU的价格。'")
                  .el-icon-question(slot="reference")
              td(width="20%") 操作
          tbody
            tr(v-for="item in cur_list")
              td.simple-td
                .flex-around-center
                  img(:src="item.pic")
                  .name {{item.name}}
              td.simple-td
                span {{item.category_name}}
              td.simple-td  ¥{{item.price/100}}
              td.simple-td  
                .flex-around-center
                  span.operation(@click="checkItem(item)")  查看
                  span.operation(@click="deleteItem(item)") 删除
      .foot-wrapper(v-show="cur_list.length>0")
        .tfoot
          pagination(:pagination-data="paginationData", @input="paging")        
      .bottom-tip
        h3  温馨提示：
        p 1、快速开单项目指门店在企业微信上开单收款时可以快速选择的项目，也可以在企微上搜索门店全部已上架项目。
        p 2、快速开单项目只能从门店已上架的商品/服务/养护卡列表中选择添加
        p 3、门店员工可以在企业微信选择指定商品或服务项目快速生成企业收款二维码，引导客户付款。
                 
</template>
<script>
import ServiceTab from '@/components/generics/ServiceTab'
import Tab from '@/components/appCenter/model/PublicTabs'
import EmptyPage from '@/components/generics/EmptyPage'
import Pagination from '@/components/generics/Pagination'
import ChooseItem from '@/components/appCenter/model/ChooseItem'
import Api from '@/mixins/modules/OpenBillItem'
export default {
  mixins: [Tab, Api],
  components: {
    ServiceTab,
    Pagination,
    EmptyPage,
    ChooseItem,
  },
  data () {
    return {
      currt_type: { name: '快速开单项目', type: 3 },
      is_click: null,
      cur_tab: {},
      paginationData: {
        current_page: 1,
        per_page: 1,
        last_page: 1,
        total: 1,
      },
      open_bill_list: [
        { name: '基础换油保养', index: 1 },
        { name: '深度换油保养', index: 2 },
        { name: '洗车', index: 3 },
        { name: '养护卡', index: 4 },
        { name: '轮胎服务', index: 5 },
        { name: '其他', index: 6 },
      ],
      cur_list: [],     // 当前项目列表
      show_modal: false,
      has_load: false,
    }
  },
  async mounted () {
    this.currt_type = { name: '快速开单项目', type: 3 }
    this.is_click = 3
    await this.getCateList()
    await this.getBillList()
  },
  methods: {
    // 切换tab时触发
    async toggleTab (item) {
      if (this.cur_tab.index === item.index) {
        return
      }
      this.cur_tab = item
      this.paginationData.current_page = 1
      // 请求数据
      await this.getBillList()
    },
    paging (state) {
      this.paginationData = state
      this.getBillList()
    },
    // 同步项目
    async syncItem () {
      this.$store.dispatch('showMessage', {
        title: '确认同步该类项目',
        isRejectable: 1,
        content: '是否同步当前分类下门店已上架项目，作为企业微信快速开单项目？',
        resolve: async() => {
          try {
            const {result, response} = await this.syncOpenBillApi({
              type_name: this.cur_tab.name,
            })
            if (response.status === 200 && result.code === 0) {
              this.$store.dispatch('showMessage', {
                autoClose: true,
                title: '同步完成！',
              })
              await this.getBillList()
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '温馨提示',
                content: result.message,
              })
            }
          } catch (err) {
            this.errorMessage('同步快速开单项目失败')
          }
        },
      })
    },
    // 查看项目详情
    checkItem (item) {
      if (item.obj_type === 1) {
        this.$router.push({name: 'productDetail', params: {id: item.basic_spu_id}})
      }
      if (item.obj_type === 2) {
        this.$router.push({name: 'serviceDetail', params: {id: item.basic_spu_id}})
      }
      if (item.obj_type === 3) {
        this.$router.push({name: 'cardManagementDetail', query: {id: item.obj_id}})
      }
    },
    async deleteItem (item) {
      this.$store.dispatch('showMessage', {
        title: '确认删除该项目？',
        content: '删除后，该项目将不会出现在企业微信开单收款项目列表中，是否继续？',
        isRejectable: 1,
        resolve: async () => {
          try {
            const { response, result } = await this.deleteQuickBillApi({
              quick_bill_item_id: item.quick_bill_item_id,
            })
            if (response.status === 200 && result.code === 0) {
              this.$store.dispatch('showMessage', {
                type: 'success',
                title: '删除快速开单项目成功！',
                autoClose: true,
              })
            } else {
              this.errorMessage('获取分类发生错误')
            }
          } catch ({ response, result }) {
            this.errorMessage('获取分类发生错误')
          } finally {
            this.getBillList()
          }
        },
      })
    },
    // 获取项目分类
    async getCateList () {
      try {
        const { response, result } = await this.getQuickBillCateApi()
        if (response.status === 200 && result.code === 0) {
          this.open_bill_list = result.data.map(item => {
            return {
              name: item.quick_bill_name,
              index: item.quick_bill_category_id,
            }
          })
          this.cur_tab = this.open_bill_list[0]
        } else {
          this.errorMessage('获取分类发生错误')
        }
      } catch ({ response, result }) {
        this.errorMessage('获取分类发生错误')
      }
    },
    async getBillList () {
      this.has_load = false
      try {
        const { response, result } = await this.getQuickBillListApi({
          quick_bill_category_id: this.cur_tab.index,
          page: this.paginationData.current_page,
          hide_loading: false,
        })
        if (response.status === 200 && result.code === 0) {
          this.cur_list = result.data
          this.paginationData = result.meta
          this.has_load = true
        } else {
          this.errorMessage('获取项目列表发生错误')
        }
      } catch ({ response, result }) {
        this.errorMessage('获取项目列表发生错误')
      } finally {
        if (document.getElementsByClassName('table-wrapper')[0]) {
          document.getElementsByClassName('table-wrapper')[0].scrollTop = 0
        }
      }
    },
    errorMessage (message) {
      this.$store.dispatch('showMessage', {
        type: 'failure',
        title: message,
        content: `${message}，请稍后再试`,
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';

.section-layout >>>.status-list ul {
  justify-content: left;
  padding-left: 20px;
  background-color: #ffffff;
}

.flex-around-center {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 10px;

  .name {
    flex: 1;
    width: 150px;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-left: 10px;
  }

  img {
    width: 40px;
    height: 40px;
  }

  .operation {
    color: #2fabdd;
    cursor: pointer;
  }
}

.table, td {
  text-align: center;
}

.left-tabs {
  position: absolute;
  left: 0;
  width: 150px;
  top: 108px;
  bottom: 100px;
  overflow-y:scroll;
  &::-webkit-scrollbar {
    display:none;
  }
  .tab {
    text-align: right;
    border-left: none;
    border-right: 1px solid #e4e7ed;
    border-bottom: none;
    background: #fff;
    line-height: 40px;
    padding: 0 20px;
    font-size: 14px;
    border-top: 1px solid #e4e7ed;
    cursor: pointer;
    &:last-child{
      border-bottom: 1px solid #e4e7ed;
    }
    &:hover {
      color: #409EFF;
    }
  }

  .active-tab {
    color: #409EFF;
    border-right: 1px solid transparent;
  }
}

.top-bar {
  padding: 10px 0;
  text-align: right;

  button {
    margin-right: 30px;
  }
}

.tfoot {
  width: auto;
  right: 0;
  left: 155px;
}

.margint0 {
  margin-top: 0;
  height: 40px;
}

.bottom-tip {
  padding: 15px;

  h3 {
    font-size: 14px;
    margin-bottom: 10px;
    color: #444;
  }

  p {
    font-size: 13px;
    color: #666;
    line-height: 15px;
  }
}

.foot-wrapper {
  position: relative;
}

.table-wrapper {
  padding-bottom: 36px;
  min-height: 280px;
  margin-left: 155px;
  &::-webkit-scrollbar {
    display:none;
  }
}

.content-wrapper {
  padding-bottom: 0;
  overflow-x:hidden;
  overflow-y:scroll;  
  flex-grow:1;
  &::-webkit-scrollbar {
    display:none;
  }
}
.empty-page-wrapper{
  height: 100%;
}
</style>
