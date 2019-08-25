<template lang="pug">
.slide-layout
  .slide-title 推荐客户
  .list-checkbox
    .list-item(v-for="(item, index) in list")
      .checkbox
        input(type="checkbox", :id="'type' + index", v-model="item.checked")
        label(:for="'type' + index", v-text="item.name")
      el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="item.desc")
        .el-icon-question(slot="reference")
      .num(v-if="item.id === 1") {{info.all_customer}}人
      .num(v-if="item.id === 2") {{info.register_customer}}人
      .num(v-if="item.id === 3") {{info.unregistered_customer}}人
      .num(v-if="item.id === 4") {{info.place_order_customer}}人
  .btn
    button.button.large.primary(@click="saveInfo" v-text="'确定'")
</template>

<script>
import Api from '@/mixins/modules/marketing'
export default {
  name: 'MessageType',
  mixins: [Api],
  components: {
  },
  props: {
    id: {
      type: [String, Number],    // id = 3时，只展示小程序下单用户，小程序注册用户
    },
  },
  data () {
    return {
      list: [
        {
          name: '系统全部客户',
          checked: false,
          id: 1,
          desc: '智慧门店系统中的全部客户',
        },
        {
          name: '小程序注册用户',
          checked: false,
          id: 2,
          desc: '已完成智慧门店小程序注册的客户',
        },
        {
          name: '小程序未注册用户',
          checked: false,
          id: 3,
          desc: '来自于ERP数据同步和车检临时录入的客户，且客户还未注册小程序',
        },
        {
          name: '小程序下单用户',
          checked: false,
          id: 4,
          desc: '已经在智慧门店小程序成功完成商品、服务或养护卡下单的客户',
        },
      ],
      info: {},
    }
  },
  methods: {
    // 获取分类id
    saveInfo () {
      let brandIds = []
      this.list.forEach(v => {
        if (v.checked) {
          brandIds.push(v.id)
        }
      })
      if (brandIds.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '温馨提示',
          content: '请选择推荐客户',
        })
        return false
      }
      this.$emit('success', brandIds)
    },
    // 获取分类数据
    async fetchCategory () {
      try {
        const {response, result} = await this.getSmsCategoryApi()
        if (response.status === 200 && result.code === 0) {
          this.info = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取推荐客户失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取推荐客户失败',
          content: '服务异常，请稍后再试',
        })
      }
    },
  },
  mounted () {
    // id = 3时，只展示小程序下单用户，小程序注册用户
    if (this.id - 0 === 3) {
      this.list = [
        {name: '小程序注册用户', checked: false, id: 2, desc: '已完成智慧门店小程序注册的客户'},
        {name: '小程序下单用户', checked: false, id: 4, desc: '已经在智慧门店小程序成功完成商品、服务或养护卡下单的客户'},
      ]
    }
    this.fetchCategory()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.list-checkbox
  padding-bottom 30px
  .list-item
    height 30px
    line-height 30px
    .checkbox label
      padding-left 30px
  .num
    float right 
    font-size 12px
    color #666
</style>
