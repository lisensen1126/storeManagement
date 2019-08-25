<!--左边侧边tab栏设置-->
<template lang="pug">
  .root(:class="{'is-show': isShow}", @click="toggleNav(false)")
    .logo-wrapper
      router-link.logo(:to="{name: 'writeOffRecord'}")
    ul.major-nav
      li
        router-link.nav-tab.workbench(:to="{name: 'writeOffAllList'}", :class="{'is-active': isCurrentPath('workbench')}") 工作台
      li
        router-link.nav-tab.client(:to="{name: 'customerList'}", :class="{'is-active': isCurrentPath('customer')}") 客户管理
      li
        router-link.nav-tab.order(:to="{name: 'orderList'}", :class="{'is-active': isCurrentPath('order')}") 订单管理
      li
        router-link.nav-tab.product(:to="{name: 'productLibrary'}", :class="{'is-active': isCurrentPath('productService')}") 商品服务管理
      li
        router-link.nav-tab.base(:to="{name: 'basicInformationNav', params: {storeId: 44}}", :class="{'is-active': isCurrentPath('basicInformation')}") 基本信息维护
      li
        router-link.nav-tab.evaluate(:to="{name: 'storeEvaluate'}", :class="{'is-active': isCurrentPath('evaluate')}") 业务功能
      li
        router-link.nav-tab.marketing(:to="{name: 'coupons', query: {name: '优惠券列表',type: 'coupons',urlName: 'coupons',}}", :class="{'is-active': isCurrentPath('marketing')}") 营销助手
      li
        router-link.nav-tab.content(:to="{name: 'contentList'}", :class="{'is-active': isCurrentPath('content')}") 内容管理
      li
        router-link.nav-tab.reportList(:to="{name: 'incomeSummary'}", :class="{'is-active': isCurrentPath('report')}") 统计管理
      li(v-if="currentUser.from == 'BOSS'")
        router-link.nav-tab.synchronize(:to="{name: 'syncEmployeeList'}", :class="{'is-active': isCurrentPath('synchronize')}") 同步管理
      li
        router-link.nav-tab.setting(:to="{name: 'authorizations'}", :class="{'is-active': isCurrentPath('setting')}") 设置
      li
        router-link.nav-tab.appcenter(:to="{name: 'allApp'}", :class="{'is-active': isCurrentPath('appcenter')}") 应用中心
      li(@click="toHelp")
        span.nav-tab.help 使用说明
</template>

<script>
import { mapGetters } from 'vuex'
import CenterApi from '../../mixins/modules/AppCenter'

export default {
  name: 'MajorNav',
  mixins: [CenterApi],
  data () {
    return {
      isShow: false,
    }
  },
  computed: {
    ...mapGetters({
      isSystemAdmin: 'isSystemAdmin',
      currentEnterprise: 'currentEnterprise',
      currentUser: 'currentUser',
      isAudio: 'judgeAudio',
    }),
  },
  methods: {
    isCurrentPath (name) {
      // this.$store.dispatch('setCurrentPageStorage', 0)
      return this.$route.meta.module === name
    },
    toggleNav (state) {
      this.isShow = state
    },
    // 跳转 help
    toHelp () {
      window.open('https://shimo.im/docs/61e57c2345c440cd/')
    },
    // 判断是否可以语音播报
    async judgeAudio () {
      try {
        const { response, result } = await this.getOfflineOrderNotificationApi()
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('updateAudio', result.data.is_open_audio)
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '开启语音播报失败',
            content: result.message,
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
    // 语音收款提示交互
    voiceCues () {
      this.$notify({
        title: '听不到收款语音，请尝试以下操作',
        dangerouslyUseHTMLString: true,
        message: `<p>1、检查电脑音箱是否开启，音量是否设置为静音。</p>
        <p>2、点击门店后台页面任意按钮。</p>
        <p style="padding-top: 10px; color: teal">以上操作确认后，下一笔收款即可听到语音播报。</p>`,
        type: 'success',
        duration: 0,
        offset: 62,
      })
    },
  },
  async mounted () {
    this.$hub.$on(this.$hub.events.navChange, this.toggleNav)
    // 如果用户是从boss后台跳转过来的，就不需要执行以下代码
    if (this.currentUser.from !== 'BOSS') {
      await this.judgeAudio()
      if (this.isAudio === 1) this.voiceCues()
    }
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins';

major-width = 152px;
rootZIndex = 50;

.root {
  flex-grow: 0;
  flex-shrink: 0;
  width: major-width;
  background: #313942;
  box-shadow: 4px 0 12px 0 rgba(0, 0, 0, 0.1);
  height: 100%;

  +media(standWidth) {
    position: fixed;
    height: 100%;
    z-index: rootZIndex;
    width: 0;
    overflow: hidden;
    transition: width 0.2s;

    &:after {
      opacity: 0;
      transition: opacity 20s;
    }

    &.is-show {
      width: major-width;

      &:after {
        content: '';
        display: block;
        position: fixed;
        width: 100%;
        height: 100%;
        background: #303030;
        top: 0;
        left: 0;
        opacity: 0.16;
        z-index: rootZIndex;
      }
    }
  }
}

.logo-wrapper {
  width: major-width;
  height: 56px;
  background: #39424d;
  position: relative;
  z-index: rootZIndex + 1;
  padding-top: 12px;
  padding-left: 16px;

  .logo {
    display: block;
    width: 32px;
    height: 32px;
    position: relative;

    &:before {
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      position: absolute;
      top: 50%;
      margin-top: -8px;
      left: 50%;
      margin-left: -8px;
      background: center no-repeat url('~@/assets/navigation/nav-menu-grey.svg');
    }
  }
}

.help {
  cursor: pointer;
}

.fiexd-bottom {
  position: absolute !important;
  margin-top: 0 !important;
  bottom: 10px !important;
  width: 158px;
  background: rgba(49, 57, 66, 0.1);
}

.major-nav {
  margin-top: 0px;
  position: relative;
  z-index: rootZIndex + 1;
  overflow-y: scroll;
  height: calc(100% - 56px);
  padding-bottom: 50px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  li {
    margin-top: 16px;
  }

  .nav-tab {
    display: block;
    padding: 8px 0px 8px 56px;
    font-size: 14px;
    color: #ABB9C9;
    position: relative;

    &.is-active {
      background: #414850;
      color: #fff;
    }

    &::before {
      content: '';
      display: block;
      width: 0px;
      height: 16px;
      background: primary;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -8px;
      transition: width 0.2s;
    }

    &.is-active::before {
      width: 4px;
    }

    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 24px;
      top: 50%;
      margin-top: -8px;
      width: 16px;
      height: 16px;
      background: center no-repeat;
      background-size: cover;
    }

    &.workbench::after {
      background-image: url('~@/assets/navigation/nav-workspace-grey.svg');
    }

    &.client::after {
      background-image: url('~@/assets/navigation/nav-clients-grey.svg');
    }

    &.base::after {
      background-image: url('~@/assets/navigation/nav-base-grey.svg');
    }

    &.product::after {
      background-image: url('~@/assets/navigation/nav-product-grey.svg');
    }

    &.order::after {
      background-image: url('~@/assets/navigation/nav-order-grey.svg');
    }

    &.evaluate::after {
      background-image: url('~@/assets/navigation/nav-evaluate-grey.svg');
    }

    &.marketing::after {
      background-image: url('~@/assets/navigation/nav-marketing-grey.svg');
    }

    &.synchronize::after {
      background-image: url('~@/assets/navigation/nav-synchronize-grey.svg');
    }

    &.setting::after {
      background-image: url('~@/assets/navigation/nav-settings-grey.svg');
    }
    &.appcenter::after {
      background-image: url('~@/assets/navigation/appcenter-grey-icon.svg');
    }
    &.help::after {
      background-image: url('~@/assets/navigation/nav-help-grey.svg');
    }

    &.content::after {
      background-image: url('~@/assets/navigation/nav-content-grey.svg');
    }

    &.reportList::after {
      background-image: url('~@/assets/navigation/nav-reportList-grey.svg');
    }

    &.is-active {
      &.workbench::after {
        background-image: url('~@/assets/navigation/nav-workspace-white.svg');
      }

      &.client::after {
        background-image: url('~@/assets/navigation/nav-clients-white.svg');
      }

      &.base::after {
        background-image: url('~@/assets/navigation/nav-base-white.svg');
      }

      &.product::after {
        background-image: url('~@/assets/navigation/nav-product-white.svg');
      }

      &.order::after {
        background-image: url('~@/assets/navigation/nav-order-white.svg');
      }

      &.evaluate::after {
        background-image: url('~@/assets/navigation/nav-evaluate-white.svg');
      }

      &.marketing::after {
        background-image: url('~@/assets/navigation/nav-marketing-white.svg');
      }

      &.synchronize::after {
        background-image: url('~@/assets/navigation/nav-synchronize-white.svg');
      }

      &.setting::after {
        background-image: url('~@/assets/navigation/nav-settings-white.svg');
      }
      &.appcenter::after {
        background-image: url('~@/assets/navigation/appcenter-white-icon.svg');
      }
      &.content::after {
        background-image: url('~@/assets/navigation/nav-content-white.svg');
      }

      &.reportList::after {
        background-image: url('~@/assets/navigation/nav-reportList-white.svg');
      }
    }
  }
}
.major-nav::-webkit-scrollbar {
  display: none;
}
</style>
