<template lang="pug">
  .slide-layout
    .slide-title(v-if="is_edit") 编辑回复
    .slide-title(v-else, v-text="'回复评论'")
    .field-group
      .field
        label.label 评论内容
        .comment
          .til(v-text="item.comment_content")
          .pic
            span(v-for="(item, index) in item.comment_image")
              img(:src="item.image_url")
      .field
        label.label 回复内容
        textarea.textarea(placeholder="回复内容", v-model.trim="comment_content")
      .field
        button.button.large.primary(@click="saveInfo" v-text="'保存'")
</template>

<script>
  import imageScale from '@/mixins/utilities/imageScale'
  import CustomInput from '@/components/generics/form/CustomInput'
  import {validationMixin} from 'vuelidate'
  import Api from '@/mixins/modules/evaluate'
  export default {
    mixins: [validationMixin, Api, imageScale],
    components: {
      CustomInput,
    },
    props: {
      item: null,
    },
    // 数据初始化
    data () {
      return {
        comment_content: '',
        is_edit: false,
      }
    },
    methods: {
      // 保存操作
      saveInfo () {
        if (!this.comment_content) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '回复失败',
            content: '内容不能为空',
          })
          return false
        }
        let params = {
          comment_content: this.comment_content,
        }
        if (this.is_edit) {
          params.comment_id = this.item.sub_comment[0].comment_id
          this.updateApi(params)
        } else {
          params.comment_id = this.item.comment_id
          this.saveApi(params)
        }
      },
      /*
      * 保存接口
      * @params 接口参数
      * */
      async saveApi (params) {
        try {
          const {response, result} = await this.fetchCommentStoreReply(params)
          // 判断接口是否成功
          if (response.status !== 200) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '回复失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
            return false
          }
          // 判断是否有参数错误
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '回复失败',
              content: `${result.message}`,
            })
            return false
          }
          this.$emit('callback')
        } catch (err) {
        }
      },
      /*
     * 更新接口
     * @params 接口参数
     * */
      async updateApi (params) {
        try {
          const {response, result} = await this.uodateRecordApi(params)
          // 判断接口是否成功
          if (response.status !== 200) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '回复编辑失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
            return false
          }
          // 判断是否有参数错误
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '回复失败',
              content: `${result.message}`,
            })
            return false
          }
          this.$emit('callback')
        } catch (err) {
        }
      },
    },
    mounted () {
      if (this.item.sub_comment && this.item.sub_comment.length > 0) {
        this.is_edit = true
        this.comment_content = this.item.sub_comment[0].comment_content
      }
      // if (this.item.sub_comment && this.item.sub_comment[0] && this.item.sub_comment[0].comment_content) {
      //   this.is_edit = true
      // }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .comment
    padding-top 5px
    .til
      font-size: 14px
    .pic
      span
        display inline-block
        padding: 8px 5px 0 0
        img
          width 40px
          height 40px
</style>
