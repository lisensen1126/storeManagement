<template lang="pug">
  .section-layout
    .content-wrapper
      h2.header-title
        .title {{info.title}}
        .time(v-if="info.created_at != 0") 发布人：壳保养智慧门店 &nbsp;&nbsp; 发布时间：{{info.created_at}}
      .order-box(v-html="info.content" v-if="info.type != 'system_notice'")
      .order-box(v-html="info.info.content" v-if="info.type == 'system_notice'")
      .button-group
          a.button.large(@click="goBack") 返回

</template>

<script>
import Api from '@/mixins/modules/messageNotice'
import FormDate from '@/mixins/utilities/formateDate'

export default {
  name: 'MsgaDetail',
  mixins: [Api, FormDate],
  data () {
    return {
      isInitiated: false,
      tradeOrderId: '',
      theadConfig: [
        {
          name: '商品/服务',
          width: '240',
        },
        {
          name: '数量',
          width: '100',
        },
      ],
      info: {},
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.query.id) {
        this.getInfo(this.$route.query.id)
      }
    },
  },
  methods: {
    // 获取订单详情
    async getInfo (id) {
      try {
        const { response, result } = await this.getMessageDetail({
          id: id,
        })
        if (response.status === 200 && result.code === 0) {
          this.info = result.data
          this.info.created_at = this.formateDate(result.data.created_at)
          this.$store.dispatch('synchronizeOlist')    // 调用消息公告列表
          this.$store.dispatch('synchronizeMsgCount')  // 获取未读消息总数
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取订单详情失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取订单详情失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    goBack () {
      this.$router.replace({
        name: 'messageList',
      })
    },
  },

  mounted () {
    this.tradeOrderId = this.$route.query.id
    if (this.tradeOrderId) {
      this.getInfo(this.tradeOrderId) // 获取订单详情
    }
    // sessionStorage.setItem('closeKey', 0)
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';
.button-group {
  margin-top : 16px;
  margin-left: 20px;
}
.content-first {
  line-height: 16px;
}

.header-title {
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing border-box;
  padding: 26px 24px;
  .time{
    color: #747474;
    font-size: 12px;
  }
}

.order-box {
  padding: 20px 30px;
  font-size: 14px;
  line-height: 25px;
  border-bottom: 1px solid #eee;
  img {
    max-width: 500px;
    height: auto;
  }

  .title {
    width: 15%;
    text-align: right;
    font-weight: bold;
    padding-top: 10px;
    padding-bottom: 5px;
  }

  dl {
    float: left;
    padding-top: 10px;
    width: 50%;
    overflow: hidden;

    dt {
      float: left;
      width: 30%;
      color: #222;
      text-align: right;
    }

    dd {
      float: left;
      width: 70%;
      color: #747474;
      box-sizing: border-box;
      padding-left: 20px;
    }
  }

  .cright {
    padding-left: 200px;

    .ctd {
      width: 90%;
    }
  }
}

.order-box >>> img {
  max-width: 500px;
  height: auto;
  display: block;
}

</style>
