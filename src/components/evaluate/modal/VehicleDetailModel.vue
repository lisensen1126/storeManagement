<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title 项目详情
      .field-group
        .field
          label.label 项目名称：
          span {{project_detail.name}}
        .field
          label.label 更换里程：
          span {{project_detail.exchange_mile}}
        .field
          label.label 检测里程：
          span {{project_detail.inspect_mile}}
        .field
          label.label 项目提示：
          span {{project_detail.tip}}
        .field
          label.label 检测点：
          div(v-for="(item,index) in project_detail.point")
            span {{index+1}}、{{item}}
        .field
          label.label 异常问题：
          div(v-for="(item,index) in project_detail.exception")
            span {{index+1}}、{{item}}
        .field
          label.label 异常建议：
          div(v-for="(item,index) in project_detail.suggest")
            span {{index+1}}、{{item}}
</template>

<script>
import Api from '@/mixins/modules/evaluate'
export default {
  name: 'VehicleDetailModel',
  mixins: [Api],
  components: {
  },
  props: {
    project: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      project_id: '', // 项目详情
      project_detail: {},
    }
  },
  methods: {
    // 获取项目详情
    async fetchProjectItem () {
      try {
        const { response, result } = await this.getProjectDetailApi({
          id: this.project_id,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.project_detail = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取场景项目详情失败',
              content: result.message,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取场景项目详情失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取场景项目详情失败',
          content: err,
        })
      }
    },
  },
  mounted () {
    this.project_id = this.project
    this.fetchProjectItem()
  },
}
</script>

<style lang="stylus" scoped>
.label
  font-size 15px
  color #333333
  font-weight 600
div
  font-size 13px
  color #999999
  span
    display inline-block
    margin-top 5px
</style>
