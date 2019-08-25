<!--门店详情导航模块-->
<template lang="pug">
  div.content
    service-tab.top-nav(v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changeTab")
    .nav-back-btn(@click="goBack")
    Information-edit(v-if="tab.type === 'basicInfo'")
    store-seniority(v-if="tab.type === 'storeSeniority'")
    service-category(v-if="tab.type === 'storeCategory'")
    store-list(v-if="tab.type === 'storeList'")
    mini-program-code(v-if="tab.type === 'miniProgramCode'")
    mini-program-manage(v-if="tab.type === 'miniProgramManage'")
</template>

<script>
import ServiceTab from '@/components/generics/ServiceTab'
import InformationEdit from '@/components/basicInformation/InformationEdit'
import StoreSeniority from '@/components/basicInformation/StoreSeniority'
import StoreList from '@/components/basicInformation/StoreList'
import ServiceCategory from '@/components/basicInformation/ServiceCategory'
import MiniProgramCode from '@/components/basicInformation/MiniProgramCode'
import MiniProgramManage from '@/components/basicInformation/MiniProgramManage'
import Api from '@/mixins/modules/basicInformation'
import { mapGetters } from 'vuex'
export default {
  name: 'BasicInformationNav',
  components: {
    ServiceTab,
    InformationEdit,
    StoreSeniority,
    StoreList,
    ServiceCategory,
    MiniProgramCode,
    MiniProgramManage,
  },
  mixins: [Api],
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
  },
  data () {
    return {
      tabList: [
        {
          name: '基本信息',
          type: 'basicInfo',
        },
      ],
      tab: {
        name: '基本信息',
        type: 'basicInfo',
      },
      status: null, // 服务类目审核状态 1 审核中, 2 审核失败, 3 审核通过
      qr_code: null, // 是否有二维码 1: 有, 2: 无
    }
  },
  methods: {
    // 切换顶部tab
    changeTab (params) {
      this.tab = params
    },
    // 返回操作
    goBack () {
      this.$router.go(-1)
    },
    async miniGetNearbyStatus () {
      try {
        let { response, result } = await this.getMerchantCategoryApi()
        if (response.status === 200 && result.code === 0) {
          if (result.data.audit_status === 1 || result.data.audit_status === 2 || result.data.audit_status === 3) {
            this.status = result.data.audit_status
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取附近小程序审核状态失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取附近小程序审核状态失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 获取小程序二维码
    async getQrCode () {
      try {
        let { response, result } = await this.getQrCodeApi()
        if (response.status === 200 && result.code === 0) {
          this.qr_code = 1
        } else {
          this.qr_code = 2
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取小程序二维码失败',
          content: `错误: ${err}`,
        })
      }
    },
  },
  async mounted () {
    this.changeTab(this.tabList[0])
    await Promise.all([this.miniGetNearbyStatus(), this.getQrCode()])
    // this.qr_code 是否有二维码 1: 有, 2: 无
    // this.currentUser.mini_from_type === 2 // 快速注册流程
    // this.currentUser.from_type === 2 // 1: 扫码授权 2: 人脸识别授权
    // this.currentUser.step > 3
    // this.status 服务类目审核状态 1 审核中, 2 审核失败, 3 审核通过(审核通过才显示门店管理)
    // this.currentUser.from_type = 1
    if (this.qr_code === 1) {
      if (this.currentUser.mini_from_type === 2) {
        if (this.currentUser.step > 3) {
          if (this.currentUser.from_type === 2) {
            if (this.status === 3) {
              this.tabList = [
                {
                  name: '基本信息',
                  type: 'basicInfo',
                },
                {
                  name: '门店资质',
                  type: 'storeSeniority',
                },
                {
                  name: '小程序管理',
                  type: 'miniProgramManage',
                },
                {
                  name: '服务类目',
                  type: 'storeCategory',
                },
                {
                  name: '门店管理',
                  type: 'storeList',
                },
                {
                  name: '小程序码',
                  type: 'miniProgramCode',
                },
              ]
            } else {
              this.tabList = [
                {
                  name: '基本信息',
                  type: 'basicInfo',
                },
                {
                  name: '门店资质',
                  type: 'storeSeniority',
                },
                {
                  name: '小程序管理',
                  type: 'miniProgramManage',
                },
                {
                  name: '服务类目',
                  type: 'storeCategory',
                },
                {
                  name: '小程序码',
                  type: 'miniProgramCode',
                },
              ]
            }
          } else {
            if (this.status === 3) {
              this.tabList = [
                {
                  name: '基本信息',
                  type: 'basicInfo',
                },
                {
                  name: '门店资质',
                  type: 'storeSeniority',
                },
                {
                  name: '服务类目',
                  type: 'storeCategory',
                },
                {
                  name: '门店管理',
                  type: 'storeList',
                },
                {
                  name: '小程序码',
                  type: 'miniProgramCode',
                },
              ]
            } else {
              this.tabList = [
                {
                  name: '基本信息',
                  type: 'basicInfo',
                },
                {
                  name: '门店资质',
                  type: 'storeSeniority',
                },
                {
                  name: '服务类目',
                  type: 'storeCategory',
                },
                {
                  name: '小程序码',
                  type: 'miniProgramCode',
                },
              ]
            }
          }
        } else {
          this.tabList = [
            {
              name: '基本信息',
              type: 'basicInfo',
            },
            {
              name: '门店资质',
              type: 'storeSeniority',
            },
            {
              name: '小程序码',
              type: 'miniProgramCode',
            },
          ]
        }
      } else {
        this.tabList = [
          {
            name: '基本信息',
            type: 'basicInfo',
          },
          {
            name: '小程序码',
            type: 'miniProgramCode',
          },
        ]
      }
    } else {
      if (this.currentUser.mini_from_type === 2) {
        if (this.currentUser.step > 3) {
          if (this.currentUser.from_type === 2) {
            if (this.status === 3) {
              this.tabList = [
                {
                  name: '基本信息',
                  type: 'basicInfo',
                },
                {
                  name: '门店资质',
                  type: 'storeSeniority',
                },
                {
                  name: '小程序管理',
                  type: 'miniProgramManage',
                },
                {
                  name: '服务类目',
                  type: 'storeCategory',
                },
                {
                  name: '门店管理',
                  type: 'storeList',
                },
              ]
            } else {
              this.tabList = [
                {
                  name: '基本信息',
                  type: 'basicInfo',
                },
                {
                  name: '门店资质',
                  type: 'storeSeniority',
                },
                {
                  name: '小程序管理',
                  type: 'miniProgramManage',
                },
                {
                  name: '服务类目',
                  type: 'storeCategory',
                },
              ]
            }
          } else {
            if (this.status === 3) {
              this.tabList = [
                {
                  name: '基本信息',
                  type: 'basicInfo',
                },
                {
                  name: '门店资质',
                  type: 'storeSeniority',
                },
                {
                  name: '服务类目',
                  type: 'storeCategory',
                },
                {
                  name: '门店管理',
                  type: 'storeList',
                },
              ]
            } else {
              this.tabList = [
                {
                  name: '基本信息',
                  type: 'basicInfo',
                },
                {
                  name: '门店资质',
                  type: 'storeSeniority',
                },
                {
                  name: '服务类目',
                  type: 'storeCategory',
                },
              ]
            }
          }
        } else {
          this.tabList = [
            {
              name: '基本信息',
              type: 'basicInfo',
            },
            {
              name: '门店资质',
              type: 'storeSeniority',
            },
          ]
        }
      } else {
        this.tabList = [
          {
            name: '基本信息',
            type: 'basicInfo',
          },
        ]
      }
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.content
  position relative
  height calc(100% - 56px)
.top-nav
  display flex
  flex 0 0 48px
  align-items center
  justify-content center
  position relative
  height 48px
  padding-left 64px
  padding-right 64px
  background-color #fcfcfc
  box-shadow 0 2px 8px 0 rgba(0, 0, 0, 0.08)
  z-index 8
.nav-back-btn
  position absolute
  top 10px
  left 16px
  width 32px
  height 32px
  border-radius 100%
  background #CED3DC center no-repeat url('~@/assets/back.svg')
  background-size 16px
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, 0.08)
  cursor pointer
  z-index 9
</style>


