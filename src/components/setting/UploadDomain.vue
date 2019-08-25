<template lang="pug">
  .control(:class="[{ 'is-error': validator && validator.$error}]")
    .btn-wrapper
      .button-group
        a.button.small
          span(v-text="isLoading ? '上传中...' : '上传文件'")
          input.button.small.file.input(
          type="file"
          title="请选择文件"
          :class="{'disabled':isLoading}"
          :id="componentId",
          @change="commit")
    .error-icon(v-show="validator && validator.$error")
    .error-info(v-show="validator && validator.$error", v-text="errorInfo")

</template>

<script>
import fileUploader from '@/mixins/utilities/fileUploader'
export default {
  name: 'UploadDomain',
  props: {
    validator: {
      type: Object,
      default () {
        return null
      },
    },
    errorInfo: {
      type: String,
      default () {
        return ''
      },
    },
  },
  mixins: [fileUploader],
  data () {
    return {
      componentId: '',
      isLoading: false,
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    commit (e) {
      if (this.isLoading) return

      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      const file = files[0]
      const maxSize = 5120 * 1024
      if (!/text\/plain/i.test(file.type)) {
        this.$store.dispatch('showMessage', {
          title: '文件格式不正确',
          content: '允许的文件格式：txt',
        })
        e.target.value = null
        return
      }
      if (file.size > maxSize) {
        this.$store.dispatch('showMessage', {
          title: '文件尺寸太大',
          content: '允许的文件尺寸: 不超过5M',
        })
        e.target.value = null
        return
      }

      this.isLoading = true
      this.uploadFile(file).then(({response, result}) => {
        this.isLoading = false
        if (response.status === 200 && result.code === 0) {
          this.$emit('input', result)
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '上传失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
          })
        }
        e.target.value = null
      })
    },
  },
  mounted () {
    this.componentId = 'file_id_' + new Date().getTime()
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins'
.error-info
  z-index 30
.btn-wrapper
  padding 0
.is-error .btn-wrapper
  border: 1px solid #eb4e38;
.button
  position relative
  margin-top 1px
  .file
    position: absolute;
    top: 0;
    left: 0;
    width: 82px;
    height: 32px;
    opacity: 0;
    cursor pointer
</style>
