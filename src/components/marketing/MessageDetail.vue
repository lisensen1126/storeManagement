<template lang="pug">
  .section-layout
    .nav-title 短信发送详情
      .nav-back-btn(@click="goBack")
    .content-wrapper
      .section-setting
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 模版名称
                  .field-content {{info.module_name}}
              .field-group
                .field.is-horizontal
                  label.label 模版分类
                  .field-content {{info.module_category_name}}
              .field-group
                .field.is-horizontal
                  label.label 发送时间
                  .field-content {{info.created_at}}
              .field-group
                .field.is-horizontal
                  label.label 操作门店
                  .field-content {{info.store_name}}
              .field-group
                .field.is-horizontal
                  label.label 短信内容
                  .field-content
                    p.sms {{info.content}}
              .field-group
                .field.is-horizontal
                  label.label
                  .field-content.border
                    .phone.fl(v-for="(item, index) in info.send_list")
                      .text.fl {{item}}
</template>

<script>
import Api from '@/mixins/modules/marketing'
import FormateDate from '@/mixins/utilities/formateDate'
export default {
  name: 'MessageDetail',
  mixins: [Api, FormateDate],
  components: {
  },
  data () {
    return {
      info: {
        module_name: '',
        module_category_name: '',
        created_at: '',
        store_name: '',
        content: '',
        send_list: [],
      },
    }
  },
  methods: {
    // 获取详情
    async fetchDetail () {
      try {
        const {response, result} = await this.getSendDetailApi({
          id: this.$route.query.id,
        })
        if (response.status === 200 && result.code === 0) {
          this.info = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取短信详情失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取短信详情失败',
          content: '服务异常，请稍后再试',
        })
      }
      this.isInitiated = true
    },
    // 返回上一页
    goBack () {
      this.$router.go(-1)
    },
  },
  mounted () {
    this.fetchDetail()
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.form-wrapper .field
  min-width 680px
  font-size 14px
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.clearfix:after{
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden}
.fl{
  float: left;
}
.fr{
  float: right ;
}
.f-12
  font-size 12px
  color red
.field-content
  width 650px
.section-layout
  height 600px
  overflow-y auto
.section-setting
  + .section-setting
    margin-top 16px
  background #ffffff
  padding-bottom 24px
.header-wrapper
  height 56px
  align-items center
  border-bottom 1px solid line
.header-title
  font-size 18px
  line-height 24px
  color darker
  position relative
.level-left
  align-items center
.switch-title
  margin-left 8px
  font-size 13px
  line-height 18px
  word-break keep-all
.form-wrapper
  padding 0
  padding-left 24px
  padding-top 32px
  width 280px
  &.disabled
    opacity .5
.field-group
  + .field-group
    margin-top 24px
  + .clear-phone
    margin-top 0
.m-l-20
  margin-left 20px
.check-but
  padding 4px 6px
  cursor pointer
  border 1px solid #dddddd
  border-radius 3px
  color #666
.link
  font-size 12px
  cursor pointer
  color #5E7BFF
  padding 16px 0 0 0
  border none
  margin-left 10px
.link:hover
  text-decoration underline
.phone-input
  width 300px
.p-tip
  font-size 12px
  color #666
  padding 16px 0 0 4px
.border
  width 650px
  height 200px
  overflow-y auto
  border 1px solid #dddddd
  padding 10px
  .phone
    width 100px
    height 26px
    line-height 24px
    border 1px solid #dddddd
    margin-right 10px
    margin-bottom 6px
    .text
      width 100px
      font-size 12px
      text-align center
.nav-title
  width 100%
  height 48px
  background-color #ffffff
  line-height 48px
  padding-left 60px
.nav-back-btn
  position absolute
  top 9px
  left 16px
  width 32px
  height 32px
  border-radius 100%
  background #CED3DC center no-repeat url('~@/assets/back.svg')
  background-size 16px
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
  cursor pointer
  z-index 2
.sms
  line-height 1.4
</style>

