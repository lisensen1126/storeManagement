<template lang="pug">
  div
    slide-out-modal(v-if="slideVisible", @input="toggleSidePannel", :is-medium="true" :is-colorful="true")
      report-detail(:detail="detail")
</template>

<script>
import SlideOutModal from '@/components/generics/SlideOutModal'
import ReportDetail from '@/components/generics/ReportDetail'
import operationMixin from '@/mixins/modules/operation'

export default {
  name: 'SlideOutReportDetail',
  mixins: [operationMixin],
  components: {
    SlideOutModal,
    ReportDetail,
  },
  props: {
    no: [Number, String],
  },
  data () {
    return {
      slideVisible: false,
      detail: undefined,
    }
  },
  methods: {
    toggleSidePannel () {
      this.slideVisible = !this.slideVisible
      this.$emit('input', this.slideVisible)
    },
    async fetchReportDetail (no) {
      try {
        const {result, response} = await this.fetchInspectionReportsDetail(no)
        if (response.status === 200) {
          this.detail = result.data
          this.slideVisible = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '车检报告详情失败',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '车检报告详情失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
  },
  mounted () {
    this.fetchReportDetail(this.no)
  },
}
</script>

<style scoped lang="stylus">
</style>
