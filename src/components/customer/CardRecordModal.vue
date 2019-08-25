<!--养护卡 使用记录-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 核销记录
        .close-button(@click="modalClose")
      .modal-body
        .table-wrapper(v-if="list.length !== 0")
          table.table
            thead
              tr
                td(width="120") 使用日期
                td(width="120") 使用项目
                td(width="120") 使用进度
            tbody
              tr(v-for="item in list")
                td
                  .multi-content-td(v-if="item.created_at") {{formateDate(item.created_at, true, 2)}}
                td
                  .multi-content-td(v-if="item.name") {{item.name}}
                td
                  .simple-td(v-if="item.num") {{item.times}}/{{item.num}}
                  .simple-td(v-else) 已使用{{item.times}}次
        empty-page(v-if="list.length === 0", tip="当前没有使用记录")
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Api from '@/mixins/modules/customer'
  import FormateDate from '@/mixins/utilities/formateDate'
  export default {
    name: 'CardRecordModal',
    components: {
      ModalDialog,
      EmptyPage,
    },
    mixins: [ModalInteractions, Api, FormateDate],
    props: {
      id: {
        type: [String, Number],
      },
    },
    data () {
      return {
        list: [],
      }
    },
    methods: {
      // 获取养护卡详情
      async fetchCardUserList () {
        try {
          const { response, result } = await this.fetchCardUserApi({
            upkeep_no: this.id,
          })
          if (response.status === 200 && result.code === 0) {
            // result.data.forEach((item, index) => {
            //   item.id = index
            // })
            // let uniqArr = this.uniq(result.data)
            // let tempArr = result.data
            // let waitArr = []
            // let resultArr = [] // 结果数组
            // // 更具upkeep_item_id归类相同 id 的对象
            // uniqArr.forEach(a => {
            //   let z = []
            //   tempArr.forEach(b => {
            //     if (a.upkeep_item_id === b.upkeep_item_id) {
            //       z.push(b)
            //     }
            //   })
            //   waitArr.push(z)
            // })
            // // 统计waitArr数组中归类的对象，并且加上index      【arr = [[],[]]使用forEach会抛异常】
            // for (let i = 0; i < waitArr.length; i++) {
            //   waitArr[i].forEach((v, index) => {
            //     v.index = index + 1
            //     resultArr.push(v)
            //   })
            // }
            // // tempArr.forEach(item => {
            // //
            // // })
            // // 时间倒序排列,数据赋值
            this.list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡使用记录失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡使用记录失败',
            content: err,
          })
        }
      },
      uniq (array) {
        let temp = []
        let index = []
        let l = array.length
        for (let i = 0; i < l; i++) {
          for (let j = i + 1; j < l; j++) {
            if (array[i].upkeep_item_id - 0 === array[j].upkeep_item_id - 0) {
              i++
              j = i
            }
          }
          temp.push(array[i])
          index.push(i)
        }
        return temp
      },
    },
    mounted () {
      this.fetchCardUserList()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  td,.multi-content-td
    vertical-align: middle
  .modal-header
    padding 20px 24px
  .modal-body
    position relative
    height 420px
    display flex
    flex-direction column
  .table-wrapper
    padding 8px 16px
    flex-grow 1
    background standBackground
    .item-content
      max-width 343px
      margin-right 16px
      font-size 13px
      line-height 16px
      flex-grow 1
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
  .simple-td
    height 32px
    line-height 32px
    display flex
    align-items center
</style>
