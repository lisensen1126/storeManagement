<template lang="pug">
  .section-layout
    .content-wrapper
      h2 ATF设置
      .form-wrapper
        .field-group
          .field.is-horizontal
            .label 换油方式
              label
                checkbox(v-model="form_item.circulating" :list="list" @isCheckboxFun="changeSelect('circulating')")
                span 循环换油
              label
                checkbox(v-model="form_item.gravity" :list="list" @isCheckboxFun="changeSelect('gravity')")
                span 重力换油
      .btn-wrapper
        .button-group
          button.button.primary.large(:class="{'disabled':isNoSelect}", :disabled="isNoSelect" @click="save") 保存
</template>

<script>
import Checkbox from '@/components/generics/form/Checkbox'
import Api from '@/mixins/modules/evaluate'
import { mapGetters } from 'vuex'
export default {
  mixins: [Api],
  components: {
    Checkbox,
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
    getStoreId () {
      return this.currentUser.store_id
    },
    isNoSelect () {
      return !this.form_item.circulating.is_select && !this.form_item.gravity.is_select
    },
  },
  data () {
    return {
      form_item: {
        circulating: {            // 循环换油
          product_id: 'circulating',
          is_select: false,
        },
        gravity: {                // 重力换油
          product_id: 'gravity',
          is_select: false,
        },
      },
      list: [],
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      try {
        const {response, result} = await this.fetchProjectApi({
          store_id: this.getStoreId,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(item => {
            if (item.key === 'gravity' || item.key === 'circulating') {
              this.form_item[item.key].id = item.id
              this.form_item[item.key].key = item.key
              this.form_item[item.key].value = item.value
              this.form_item[item.key].is_select = item.value === 'on'
            }
          })
        } else {
          throw new Error({ response, result })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取信息失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    async save () {
      let data = [
        {
          id: this.form_item.circulating.id,
          value: this.form_item.circulating.value,
        },
        {
          id: this.form_item.gravity.id,
          value: this.form_item.gravity.value,
        },
      ]
      try {
        const {response, result} = await this.updateIMApi({
          data: data,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '保存成功',
          })
        } else {
          throw new Error({ response, result })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '保存失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    changeSelect (name) {
      this.form_item[name].value = this.form_item[name].is_select ? 'on' : 'off'
    },
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';
  .field.is-horizontal
    .label
      font-size 12px
      line-height 16px
      color #666
      margin-bottom 6px
      display block
      flex 1
      label
        margin-left 26px
        cursor pointer
        user-select none
        .checkbox
          display inline-block
          margin-right 0
</style>
