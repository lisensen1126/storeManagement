<template lang="pug">
  .content-wrapper
    .content-wrapper
      h2.title 操作视频
      .video-box
        .video-content(v-if="i === 0")
          video(controls, width="100%", height="100%")
            source(src="https://oss1.chedianai.com/video/shell/kuaisukaitong1.0.mp4", type="video/mp4")
        .video-content(v-if="i === 1")
          video(controls, width="100%", height="100%")
            source(src="https://oss1.chedianai.com/video/shell/renlianshibie.mp4", type="video/mp4")
        .video-list
          p(v-for="(item, index) in list", :key="index", :class="{active: index === i}", @click="switchChange(index)")
            span {{item}}

</template>

<script type="text/ecmascript-6">
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
export default {
  name: 'operationVideo',
  mixins: [],
  components: {
    OpenStoreTitle,
  },
  data () {
    return {
      list: ['快速开通', '人脸识别'],
      i: 0,
    }
  },
  methods: {
    // 切换
    switchChange (index) {
      this.i = index
    },
  },
  mounted () {

  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/modules/creation-modal'
.content-wrapper
  padding 24px
  height calc(100% - 56px)
  overflow-y auto
.content-wrapper
  height calc(100% - 56px)
.title
  padding 15px 24px
  display flex
  justify-content space-between
  align-items center
  flex-shrink 0
  height 55px
.video-box
  display flex
  height 100%
  .video-content
    flex 1
  .video-list
    flex 0 0 200px
    border-left 1px solid #ddd 
    p
      padding 14px  
      cursor pointer
      &:hover
        color #ffbb29
      &.active
        color #ffbb29
</style>
