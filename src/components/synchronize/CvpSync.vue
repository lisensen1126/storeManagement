<template lang="pug">
  .section-layout
    .content-wrapper(v-if="info.length>0")
      h2 CVP功能
      .form-wrapper(v-if="info.length>0")
        .field-group
          .field(v-if="info.length>0",v-for="(item,index) in info")
            .field-content(v-text="(index+1)+ '.    ' +item")
    empty-page(v-if="info.length<=0", tip="该门店暂无CVP信息")
</template>

<script>
import synchronize from '@/mixins/modules/synchronize'
import EmptyPage from '@/components/generics/EmptyPage'
/**
 * @vue
 */
export default {
  name: 'cvpSync',
  mixins: [synchronize],
  components: {
    EmptyPage,
  },
  data () {
    return {
      info: [],
    }
  },
  computed: {
  },
  methods: {
    // 获取CVP
    async getInfo () {
      try {
        const {response, result} = await this.fetchCvp()
        if (response.status === 200 && result.code === 0) {
          this.info = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取CVP信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取CVP信息失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
  },
  mounted () {
    this.getInfo() // 获取CVP
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';
.field-content
  font-size: 13px
  line-height: 16px
  color: #353535
.form-wrapper, .field-group
  border-bottom: none
</style>
