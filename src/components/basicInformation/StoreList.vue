<template lang="pug">
  .section-layout
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .tips-text 
          span 成功添加门店后，你的门店以及关联的小程序服务可在微信小程序入口内的“附近的小程序”出现。
          a.blue-text(@click="showModal") 查看示例
      .field-group.is-horizontal
        .field.add(v-if="online_status === 1")
          router-link.button.primary(:to="{name: 'nearbyMiniProgramSotreAdd'}") 添加门店
        .field.add(v-else)
          a.button.primary.disabled(disabled) 添加门店
          el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="tips_text", style='padding-left: 10px')
            .el-icon-question(slot="reference")
        .red-text 注：最多可添加10个门店
    empty-page(v-if="!list.length", :tip="'当前没有门店'")
    .content-wrapper(v-if="list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="200") 门店名称
              td(width="80") 地理位置
              td(width="80") 状态
              td(width="80") 展示状态
              td(width="140") 操作
          tbody
            tr(v-for="(item, index) in list", :key="index")
              td
                .simple-td(v-text="item.store_name")
              td
                .simple-td(v-text="item.qualification_address")
              td.audit-status
                .simple-td(v-text="formatAuditStatus(item.audit_status)")
                el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="item.refuse_reason", v-if="item.audit_status === 4")
                  .el-icon-question(slot="reference")
              td
                .simple-td(v-text="formatDisplayStatus(item.display_status)")
              td
                .operation-td
                  span.operation-link(@click="setStoreStatus(item.poi_id, item.display_status)", v-if="item.audit_status === 5") {{item.display_status ? '取消展示' : '设置展示'}}
                  //- span.operation-link(@click="goEdit(item.poi_id)") 修改
                  span.operation-link(@click="goEdit(item.poi_id)", v-if="item.audit_status === 4 || item.audit_status === 5 && !item.display_status") 修改
                  span.operation-link(@click="goDetail(item.poi_id)") 详情
                  span.operation-link(@click="delectStore(item.poi_id)", v-if="item.audit_status === 4 || item.audit_status === 5 && !item.display_status") 删除
    account-reference(v-if="is_open_reference", :imgUrl="img_url", @close="closeModal")
</template>

<script type="text/ecmascript-6">
import CustomInput from '@/components/generics/form/CustomInput'
import EmptyPage from '@/components/generics/EmptyPage'
import AccountReference from '@/components/openStore/modal/AccountReference'
import Api from '@/mixins/modules/OpenStore'
export default {
  name: 'storeList',
  mixins: [Api],
  components: {
    CustomInput,
    EmptyPage,
    AccountReference,
  },
  data () {
    return {
      is_open_reference: false,
      img_url: 'https://oss1.chedianai.com/images/assets/list-example.jpg',
      list: [], // 门店列表
      online_status: null, // 判断是否显示添加 1: 显示, 2: 不显示
      tips_text: '注：请等待小程序上线后再添加门店',
    }
  },
  methods: {
    /**
     * 门店展示状态变更
     * @id 门店poi_id @status 展示状态 0: 不展示, 1: 展示
     */
    async setStoreStatus (id, status) {
      let params = {
        poi_id: id,
        status: status === 1 ? 0 : 1,
      }
      try {
        let { response, result } = await this.setStoreStstusApi(params)
        if (response.status === 200 && result.code === 0) {
          this.updateUserInfo()
          this.getStoreList()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '改变门店展示状态失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '改变门店展示状态失败',
          content: `错误: ${err}`,
        })
      }
    },
    /**
     * 编辑
     * @id 门店id
     */
    goEdit (id) {
      this.$router.push({
        name: 'storeEdit',
        query: {
          id,
        },
      })
    },
    /**
     * 详情
     * @id 门店id
     */
    goDetail (id) {
      this.$router.push({
        name: 'storeDetail',
        query: {
          id,
        },
      })
    },
    /**
     * 删除门店
     * @id 要删除的门店id
     */
    delectStore (id) {
      this.$store.dispatch('showMessage', {
        title: '删除提示？',
        content: '确认删除该门店？',
        isRejectable: 1,
        resolve: () => {
          this.delectStoreFun(id)
        },
      })
    },
    async delectStoreFun (id) {
      let param = {
        poi_id: id,
      }
      try {
        let { response, result } = await this.deleteStoreApi(param)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '删除门店成功',
          })
          this.getStoreList()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除门店失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '删除门店失',
          content: `错误: ${err}`,
        })
      }
    },
    // 展示"附近小程序"样例
    showModal () {
      this.is_open_reference = true
    },
    // 关闭"附近小程序"样例
    closeModal () {
      this.is_open_reference = false
    },
    // 格式化状态
    formatAuditStatus (param) {
      let status = ''
      switch (param) {
        case 3:
          status = '审核中'
          break
        case 4:
          status = '审核失败'
          break
        case 5:
          status = '审核成功'
          break
        default:
          break
      }
      return status
    },
    // 格式化展示状态
    formatDisplayStatus (param) {
      let status = ''
      if (param === 0) {
        status = '未展示'
      } else {
        status = '已展示'
      }
      return status
    },
    // 获取门店列表
    async getStoreList () {
      try {
        let { response, result } = await this.getStoreListApi()
        if (response.status === 200 && result.code === 0) {
          if (result.data.poi_list.length) {
            this.list = result.data.poi_list
          } else {
            this.list = []
          }
          this.online_status = result.data.online_status
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店列表失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取门店列表失败',
          content: `错误: ${err}`,
        })
      }
    },
    // 更新step字段
    async updateUserInfo () {
      try {
        const { response, result } = await this.fetchUserInfoApi()
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('updateUser', result.data)
        }
        return { response, result }
      } catch (err) {
        throw err
      }
    },
  },
  mounted () {
    this.$store.dispatch('syncAuthorizeStatus')
    this.updateUserInfo()
    this.getStoreList()
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/modules/creation-modal'
.section-layout
  height calc(100% - 56px)
  overflow-y auto
.content-wrapper
  margin-top 0
  height calc(100% - 106px)
  overflow-y auto
  background #F0F1F2
.section-filter
  padding-bottom 0
  display flex
  justify-content space-between
  align-items center
.field-group.is-horizontal
  display flex
  flex-direction column
  .field
    margin-bottom 10px
  .add
    text-align right
  .tips-text
    margin-top 40px
    font-size 12px
  .blue-text
    color #0000FF
  .red-text
    font-size 12px
    color #FF0000
.audit-status
  position relative
  .tips-text
    position absolute
    top 14px
    left 55px
</style>
