<template lang="pug">
.app-container
  .app-type-list(v-if="(appList && appList.length) && isInitiated")

    .app-type-item(v-for="list in appList")
      .app-type-item-head
        span.title {{ list.groupInfo.pgName }}
        span.desc {{ list.groupInfo.pgDesc }}
      .app-type-item-body
        .app-list
          .app-list-item(v-for="app in list.groupList" :class="{'app-list-item--active':(app.plIdentifier === 'car-manu-customer')||(app.plIdentifier !== 'car-manu-customer' && app.available===2)}" @click="toAuthPage(app)")
            .app-list-item-wrap
              .app-list-item-wrapwrap
                .app-status(v-if="app.plIdentifier!=='car-manu-customer' && app.available===2") 未授权
                .app-status-part(v-if="app.plIdentifier!=='car-manu-customer' && app.available===2")
                .app-status(v-if="app.plIdentifier==='car-manu-customer' && app.available===2") 未安装
                .app-status-part(v-if="app.plIdentifier==='car-manu-customer' && app.available===2")
                .app-list-item-left
                  .app-img-wrap
                    .app-img(:class="['icon-app-'+app.plIdentifier]")
                .app-list-item-right
                  .app-title(:title="app.plName", v-text="app.plName")
                  .app-tag(v-text="app.plTagName")
                  .app-desc(:title="app.plDescription", v-text="app.plDescription" class="line-ellipsis-2")

  empty-page(v-if="!(appList && appList.length) && isInitiated", :tip="'当前没有应用授权信息'")

</template>

<script>
import userMixin from '@/mixins/modules/user'
import EmptyPage from '@/components/generics/EmptyPage'

export default {
  name: 'AuthorizationEnterprice',
  mixins: [userMixin],
  components: {
    EmptyPage,
  },
  data () {
    return {
      isInitiated: false,
      appList: [],
    }
  },
  methods: {
    async getAppList () {
      try {
        const {response, result} = await this.fetchAppList({})
        if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
          this.appList = result
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取授权信息失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取授权信息失败',
          content: `服务异常，请稍后再试 ${err}`,
        })
      }
      this.isInitiated = true
    },
    async sendAuthorizationResult (param) {
      try {
        const {response, result} = await this.authorizationResult(param)
        if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
          this.appList = result
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取授权信息失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取授权信息失败',
          content: `服务异常，请稍后再试 ${err}`,
        })
      }
      this.isInitiated = true
    },
    toAuthPage (app) {
      if (app && app.plIdentifier === 'car-manu-customer') {
        this.$router.push({name: 'authorizationEnterpriceForm', params: {}})
        return
      }
      if (app && app.available === 2 && app.installUrl) {
        window.location.href = app.installUrl
      }
    },
  },
  mounted () {
    this.getAppList()
  },
}
</script>

<style lang="stylus" scoped>
.line-ellipsis-2 {
  display: -webkit-box;
  line-clamp: 2
  box-orient: vertical
  /* autoprefixer: off */
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  overflow: hidden;
}
.app-container
  position relative
  width 100%
  height 100%
  overflow auto
  .empty-page-wrapper
    height 100%
  .app-type-list
    margin: 0 10px 30px 30px;
    .app-type-item
      &:not(:first-child)
        margin-top 9px
      .app-type-item-head
        padding 21px 0 0 0
        .title
          display inline-block
          font-size 18px
          color #3D424C
          font-family PingFangSC-Semibold;
          font-weight:600;
          line-height 25px;
          vertical-align middle
        .desc
          display inline-block
          margin-left 29px
          font-size 14px;
          font-family PingFangSC-Regular;
          font-weight 400;
          line-height 20px;
          vertical-align middle
      .app-type-item-body
        .app-list
          .app-list-item
            position relative
            display inline-block
            width 25%
            max-width 300px
            min-width 280px
            margin-top 19px
            padding-right 20px
            vertical-align top
            &--active
              cursor pointer
            &:not(:nth-child(4n))
              border-right 1px solid #EEEEF0
            .app-list-item-wrap
              border-bottom 3px solid transparent
              border-radius 0 0 3px 3px
              &:hover
                border-bottom 3px solid #F7B52A
                transition: all .1s ease-in .05s;
              .app-list-item-wrapwrap
                background: #fff
                .app-status
                  position absolute
                  display inline-block
                  top: -11px
                  right: 14px
                  width 45px
                  height 19px
                  background #FF7979
                  border-radius 2px 0px 0px 2px
                  font-size 12px
                  font-family PingFangSC-Medium;
                  font-weight 500;
                  color #fff
                  line-height 19px;
                  text-align: center
                .app-status-part
                  position: absolute;
                  top: 8px;
                  right: 14px;
                  display: inline-block;
                  border: 3px solid #d44242;
                  border-top-width: 4px;
                  border-bottom-width: 4px;
                  border-bottom-color: transparent;
                  border-right-color: transparent;
                .app-list-item-left
                  position absolute
                  top 0
                  left 0
                  .app-img-wrap
                    .app-img
                      display inline-block
                      width 44px
                      height 44px
                      margin 20px 20px 0 20px
                      background transparent
                      background-size contain
                      background-repeat no-repeat
                      background-position center center
                      &.icon-app-business-tool//生意工具
                        background-image: url('~@/assets/settings/enterprice-wechat/business-tool.png')
                      &.icon-app-business-manage//生意管理
                        background-image: url('~@/assets/settings/enterprice-wechat/business-manage.png')
                      &.icon-app-operation-support //运营支持
                        background-image: url('~@/assets/settings/enterprice-wechat/operation-support.png')
                      &.icon-app-staff-power//员工赋能
                        background-image: url('~@/assets/settings/enterprice-wechat/staff-power.png')
                      &.icon-app-car-article//cdarticle_文章推荐.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cdarticle.png')
                      &.icon-app-car-card//cdcard_发送名片.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cdcard.png')
                      &.icon-app-car-customer//cdcustomer_客户管理.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cdcustomer.png')
                      &.icon-app-car-manu-customer//cdcustomer_客户管理.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cdcustomer.png')
                      &.icon-app-cdcustomer//cdcustomer_客户管理.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cdcustomer.png')
                      &.icon-app-car-inspect//cdinspection_车检助手.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cdinspection.png')
                      &.icon-app-car-customer-evaluation//cdcustomerevaluation_客户评价.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cdcustomerevaluation.png')
                      &.icon-app-car-daily//cddaily_经营日报.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cddaily.png')
                      &.icon-app-car-invite-evaluation//cdinviteevaluation_邀请评价.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cdinviteevaluation.png')
                      &.icon-app-car-monthly//cdmonthly_经营月报.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cdmonthly.png')
                      &.icon-app-car-prefer//cdprefer_发送优惠.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cdprefer.png')
                      &.icon-app-car-shell//cdshell_壳牌.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cdpurchase.png')
                      &.icon-app-car-rank//cdrank_技师排名.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cdrank.png')
                      &.icon-app-car-spread//cdspread_推广门店.png
                        background-image: url('~@/assets/settings/enterprice-wechat/cdspread.png')
                      &.icon-app-contact//contact_通讯录.png
                        background-image: url('~@/assets/settings/enterprice-wechat/contact.png')
                      &.icon-app-car-notify
                        background-image: url('~@/assets/settings/enterprice-wechat/car-notify.png')
                      &.icon-app-car-reservation
                        background-image: url('~@/assets/settings/enterprice-wechat/car-reservation.png')
                .app-list-item-right
                  position relative
                  height 106px
                  overflow hidden
                  padding 20px 21px 20px 84px
                  .app-title
                    display inline-block
                    vertical-align top
                    font-size 16px
                    font-family PingFangSC-Semibold
                    font-weight 600
                    color #3D424C
                    line-height 22px
                    overflow hidden
                    text-overflow ellipsis
                    white-space nowrap
                    max-width: 55%;
                  .app-tag
                    display inline-block
                    vertical-align top
                    height 16px
                    line-height 16px;
                    background #F7B52A
                    border-radius 2px
                    color #fff
                    font-size 11px;
                    font-family PingFangSC-Medium;
                    font-weight 500;
                    padding 0 5px
                    margin 3px 0 0 10px
                  .app-desc
                    overflow hidden
                    word-break break-all
                    text-overflow ellipsis
                    height 34px
                    margin-top 10px
                    font-size 12px
                    font-family PingFangSC-Regular
                    font-weight 400
                    color #8A92A2
                    line-height 17px


</style>

