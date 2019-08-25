<template lang="pug">
  .section-layout
    prior-conditions
      service-tab(v-model="current_message_status", :tabs="message_status", :have-icon="false", :have-quantity="false", @input="changeOrderStatus",:lineIndex="lineIndex")
    empty-page(v-if="!(list && list.length) && isInitiated", tip="当前暂无消息数据")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-if="item.type == 'order_consume' || item.type == 'card_consume'" :class="item.is_read == 1 ? 'blod' : 'fine'") 
                  .span.active(v-if="item.is_read == 1") [未读]
                  .span(v-if="item.is_read == 2") [已读] 
                  .span [消费] {{item.title}}     {{formateDate(item.created_at)}}
                .simple-td(v-if="item.type == 'order_appoint'" :class="item.is_read == 1 ? 'blod' : 'fine'") 
                  .span.active(v-if="item.is_read == 1") [未读]
                  .span(v-if="item.is_read == 2") [已读] 
                  .span [预约] {{item.title}}     {{formateDate(item.created_at)}}
                .simple-td(v-if="item.type == 'order_verify'" :class="item.is_read == 1 ? 'blod' : 'fine'") 
                  .span.active(v-if="item.is_read == 1") [未读]
                  .span(v-if="item.is_read == 2") [已读] 
                  .span [核销] {{item.title}}     {{formateDate(item.created_at)}}
                .simple-td(v-if="item.type == 'small_register'" :class="item.is_read == 1 ? 'blod' : 'fine'") 
                  .span.active(v-if="item.is_read == 1") [未读]
                  .span(v-if="item.is_read == 2") [已读] 
                  .span [注册] {{item.title}}     {{formateDate(item.created_at)}}
                .simple-td(v-if="item.type == 'card_transact'" :class="item.is_read == 1 ? 'blod' : 'fine'")
                  .span.active(v-if="item.is_read == 1") [未读]
                  .span(v-if="item.is_read == 2") [已读] 
                  .span [办卡]  {{item.title}}     {{formateDate(item.created_at)}}
                .simple-td(v-if="item.type == 'card_recharge'" :class="item.is_read == 1 ? 'blod' : 'fine'") 
                  .span.active(v-if="item.is_read == 1") [未读]
                  .span(v-if="item.is_read == 2") [已读] 
                  .span [充值]  {{item.title}}     {{formateDate(item.created_at)}}            
                .simple-td(v-if="item.type == 'system_notice'" :class="item.is_read == 1 ? 'blod' : 'fine'") 
                  .span.active(v-if="item.is_read == 1") [未读]
                  .span(v-if="item.is_read == 2") [已读] 
                  .span [系统]  {{item.title}}     {{formateDate(item.created_at)}} 
              td
                .operation-td
                  .operation-link(v-if="item.info.content_type == 1" @click="goDetail(item.id)") 查看详情
                  .operation-link(v-if="item.info.content_type == 2" @click="openNew(item.info.content, item)") 查看详情
                  .operation-link(v-if="!item.info.content_type" @click="goDetail(item.id)") 查看详情
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import PriorConditions from '@/components/generics/PriorConditions'
import ServiceTab from '@/components/generics/ServiceTab'
import EmptyPage from '@/components/generics/EmptyPage'
import Api from '@/mixins/modules/messageNotice'
import Pagination from '@/components/generics/Pagination'
import FormDate from '@/mixins/utilities/formateDate'

export default {
  name: 'MsgsList',
  mixins: [Api, FormDate],
  components: {
    PriorConditions,
    ServiceTab,
    EmptyPage,
    Pagination,
  },
  data () {
    return {
      showImg: false,
      imgsrc: '',
      isInitiated: false,
      lineIndex: 20,
      current_message_status: {
        type: '',
        name: '全部通知',
        params: '',
      },
      message_status: [
        {
          type: '',
          name: '全部通知',
          params: '',
        },
        {
          type: '2',
          name: '系统',
          params: 'system_notice',
        },
        {
          type: '6',
          name: '注册',
          params: 'small_register',
        },
        {
          type: '3',
          name: '预约',
          params: 'order_appoint',
        },
        {
          type: '4',
          name: '核销',
          params: 'order_verify',
        },
        {
          type: '7',
          name: '消费',
          params: 'order_consume',
        },
        {
          type: '10',
          name: '办卡',
          params: 'card_transact',
        },
        {
          type: '9',
          name: '充值',
          params: 'card_recharge',
        },
      ],
      list: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
    }
  },
  methods: {
    // 获取订单列表数据
    async fetchMsgList () {
      let flag = null
      let params = null
      let arr = []
      if (this.current_message_status.params === 'order_consume') {
        arr = ['order_consume', 'card_consume']
      } else {
        arr = [this.current_message_status.params]
      }
      flag = arr.every(cell => {
        return cell === ''
      })
      if (flag) {
        params = {
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        }
      } else {
        params = {
          type: arr,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        }
      }
      try {
        const { response, result } = await this.getMessageLists(params)
        if (response.status === 200 && result.code === 0) {
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取消息列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取消息列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 变更外链阅读状态
    async setMessageState (id) {
      try {
        const { response, result } = await this.changeMessageState({
          id: id,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('synchronizeOlist')    // 调用消息公告列表
          this.$store.dispatch('synchronizeMsgCount')  // 获取未读消息总数
          this.fetchMsgList()
        } else {
          console.log(result)
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 分页跳转
    paging (state) {
      this.paginationData = state
      this.fetchMsgList()
    },
    // tabs 跳转
    changeOrderStatus () {
      this.$set(this.paginationData, 'current_page', 1)
      this.fetchMsgList()
    },
    // 去详情
    goDetail (id) {
      // 做页面缓存数据
      this.$global.paginationData = this.paginationData
      this.$global.current_message_status = this.current_message_status
      this.$router.push({
        name: 'messageDetail',
        query: {
          id: id,
        },
      })
    },
    openNew (e, params) {
      if (params.is_read === 1) this.setMessageState(params.id)
      window.open(e)
    },
  },
  mounted () {
    if (this.$global.paginationData) {
      this.paginationData = this.$global.paginationData
      this.current_message_status = this.$global.current_message_status
    }
    this.fetchMsgList() // 获取订单列表数据
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp';

.bottom-image {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  img {
    height: 100%;
    width: 100%;
  }
}
.span{
  float:left;
}
.fccc {
  width: 100px;
  height: 200px;
  background: red;
}

.blod {
  font-weight: bold;
}

.fine {
  font-weight: normal;
  color: #cccccc
}
.active {
  color: #f00;
}

</style>
