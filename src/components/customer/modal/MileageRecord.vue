<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 里程记录
        .close-button(@click="modalClose")
      .modal-body
        .table-wrapper(v-if="data_list.length>0")
          table
            thead
              tr
                td 更新时间
                td 里程
            tbody
              tr(v-for="(item,index) in data_list" :key="index")
                td {{item.created_at | formatTime}}
                td {{item.mileage}} KM
        empty-page(v-else, tip="暂无记录")
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import EmptyPage from '@/components/generics/EmptyPage'
  import modalInteractions from '@/mixins/utilities/modalInteractions'
  import clientMixin from '@/mixins/modules/customer'

  export default {
    name: 'MileageRecord',
    components: {
      ModalDialog,
      EmptyPage,
    },
    mixins: [modalInteractions, clientMixin],
    props: {
      vehicleId: {
        type: [String, Number],
      },
    },
    data () {
      return {
        data_list: [
        ],
      }
    },
    computed: {
    },
    methods: {
      async fetchData () {
        try {
          const {response, result} = await this.fetchMileageRecordApi({
            vehicle_id: this.vehicleId,
          })
          if (response.status === 200) {
            this.data_list = result.data
          } else {
            throw new Error(result.message)
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取信息失败',
            content: `出错啦！错误信息：${err}`,
          })
        }
      },
    },
    mounted () {
      this.fetchData()
    },
    filters: {
      formatTime (time) {
        let d = new Date(time * 1000)
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      },
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-body
    padding 16px
    max-height 480px
    min-height 300px
    display flex
    flex-direction column
    background standBackground
    .table-wrapper
      padding 16px
      height 100%
      flex-grow 1
      font-size 13px
      line-height 16px
      background-color #FFF
      table
        width 100%
        thead
          td
            height 24px
        tbody
          line-height 20px
</style>
