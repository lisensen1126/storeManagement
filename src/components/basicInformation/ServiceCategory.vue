<template lang="pug">
  .section-layout
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .tips-text 
          span 
      .field-group.is-horizontal.border-no
        .field.add(v-if="!Object.keys(service_category).length")
          router-link.button.primary(:to="{name: 'serviceCategoryAdd'}") 添加服务类目
        .red-text 注：仅可认证一个主营类目，类目需要与门店提供的服务一致，每月限修改两次。
    empty-page(v-if="!Object.keys(service_category).length", :tip="'当前没有服务类目'")
    .content-wrapper(v-if="Object.keys(service_category).length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="200") 类目名称
              td(width="100") 状态
              td(width="30") 操作
          tbody
            tr
              td
                .simple-td
                  span {{service_category.category_first_name}} > {{service_category.category_second_name}}
              td.audit-status
                .simple-td(v-text="formatAuditStatus(service_category.audit_status)")
                el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="service_category.errmsg", v-if="service_category.audit_status === 2")
                  .el-icon-question(slot="reference")
              td
                .operation-td     
                  span.operation-link(@click="showModal(service_category)", v-if="service_category.audit_status !== 1") 修改
                  span.operation-link-no(v-if="service_category.audit_status === 1") 修改
    service-category-modal(v-if="is_show", ref="serviceCategoryModal" @input="close", @resolve="editSerive")
</template>

<script type="text/ecmascript-6">
import CustomInput from '@/components/generics/form/CustomInput'
import EmptyPage from '@/components/generics/EmptyPage'
import ServiceCategoryModal from '@/components/basicInformation/modal/ServiceCategoryModal'
import Api from '@/mixins/modules/OpenStore'
export default {
  name: 'serviceCategory',
  mixins: [Api],
  components: {
    CustomInput,
    EmptyPage,
    ServiceCategoryModal,
  },
  data () {
    return {
      is_show: false,
      service_category: {}, // 门店列表
      license_url: '',
    }
  },
  methods: {
    /**
     * 模态框打开
     * @data 服务类目数据
     */
    showModal (data) {
      this.is_show = true
    },
    // 模态框关闭
    close () {
      this.is_show = false
    },
    /**
     * 修改门店服务类目
     * @data 门店服务类目数据
     */
    async editSerive (data) {
      try {
        let { response, result } = await this.setMerchantCategoryApi(data)
        if (response.status === 200 && result.code === 0) {
          this.is_show = false
          this.getServiceCategory()
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
    // 格式化状态
    formatAuditStatus (param) {
      let status = ''
      switch (param) {
        case 1:
          status = '审核中'
          break
        case 2:
          status = '审核失败'
          break
        case 3:
          status = '审核成功'
          break
        default:
          break
      }
      return status
    },
    // 获取服务类目
    async getServiceCategory () {
      try {
        let { response, result } = await this.getMerchantCategoryApi()
        if (response.status === 200 && result.code === 0) {
          this.service_category = result.data
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
    // 获取资质信息
    async getQualification () {
      try {
        let { response, result } = await this.getQualificationApi()
        if (response.status === 200 && result.code === 0) {
          if (!(result.data instanceof Array)) {
            this.license_url = result.data.license_url
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店资质信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取门店资质信息失败',
          content: `错误: ${err}`,
        })
      }
    },
  },
  mounted () {
    this.getServiceCategory()
    // this.getQualification() // 获取门店资质信息
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
.field-group
  display flex
  flex-direction column
  border 0
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
.operation-link-no
  color #999
  cursor pointer
.audit-status
  position relative
  .tips-text
    position absolute
    top 14px
    left 55px
</style>
