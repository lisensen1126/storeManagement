<template lang="pug">
  .section-layout
    .content-wrapper
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 小程序头像
            .control.upLoad-image
              .upload-pic
                up-meituan(img-type="6", v-model="info.headimg", :hasSecondAction="is_del", img-id='1')
          .field.is-horizontal
            label.label
            .tip-description 小程序头像一年内可申请5次修改，头像不允许涉及政治敏感与色情;图片格式必须为：png,bmp,jpeg,jpg,gif；不可大于2M；建议使用png格式图片，以保持最佳效果；建议图片尺寸为144px*144px
          .field.is-horizontal
            label.label 小程序介绍
            .control
              custom-textarea.textarea(placeholder="请输入小程序介绍", v-model="info.introduce", :validator="$v.info.introduce", error-info="小程序介绍必填", maxlength=120)
          .field.is-horizontal
            label.label
            .tip-description(style="white-space: nowrap;") 注: 后期修改小程序名称及头像, 需在微信公众平台登录修改, 点击查看
              a.blue(@click="showModal") 操作说明
      tips-reference(v-if="is_open_reference", :imgUrl="imgUrl", @close="closeModal")
      .btn-wrapper
        .button-group
          a.button.primary.large.width-150(@click="submitClick") 提交
</template>

<script>
import CustomTextarea from '@/components/generics/form/CustomTextarea'
import UpMeituan from '@/components/openStore/modal/UpMeituanImage'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import OpenStoreMixin from '@/mixins/modules/OpenStore'
import TipsReference from '@/components/openStore/modal/TipsReference'
export default {
  name: 'miniProgramSecond',
  mixins: [validationMixin, OpenStoreMixin],
  components: {
    CustomTextarea,
    UpMeituan,
    TipsReference,
  },
  data () {
    return {
      info: {
        headimg: '',
        introduce: '',
      },
      is_del: false, // 是否开启删除图片按钮
      is_open_reference: false,
      imgUrl: 'https://oss1.chedianai.com/images/assets/mini-program-second-img.png',
    }
  },
  validations: {
    info: {
      introduce: {
        required,
      },
    },
  },
  methods: {
    // 展示"操作说明"样例
    showModal () {
      this.is_open_reference = true
    },
    // 关闭"操作说明"样例
    closeModal () {
      this.is_open_reference = false
    },
    // 点击提交
    async submitClick () {
      let _this = this
      _this.$v.$touch()
      if (_this.$v.$error) {
        return false
      }
      if (!_this.info.headimg) {
        _this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请上传小程序头像',
        })
        return
      }
      let params = {
        headimg: _this.info.headimg,
        introduce: _this.info.introduce,
        x1: 0, // 图片裁剪参数
        y1: 1, // 图片裁剪参数
        x2: 0, // 图片裁剪参数
        y2: 1, // 图片裁剪参数
      }
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '请确定信息无误后提交!',
        isRejectable: true,
        resolve: () => {
          this.miniPerfectInfo(params)
        },
      })
    },
    async miniPerfectInfo (params) {
      let _this = this
      try {
        const { response, result } = await _this.miniUpdateInfoApi(params)
        if (response.status === 200 && result.code === 0) {
          _this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '提交信息成功',
          })
          // this.getInfo()
        } else {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提交信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提交信息失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 获取小程序基本信息
    async getInfo () {
      let _this = this
      try {
        const { response, result } = await _this.getMiniInfoApi()
        if (response.status === 200 && result.code === 0) {
          _this.info.introduce = result.data.introduce ? result.data.introduce : '实现以“车主”为中心，全新全意用最智能的方式服务好每位“车主”。'
          _this.info.headimg = result.data.headimg ? result.data.headimg : ''
        } else {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取小程序基本信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取小程序基本信息失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
  },
  mounted () {
    this.getInfo()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.section-layout
  height calc(100% - 56px)
  overflow-y auto
.content-wrapper
  height calc(100% - 106px)
  overflow-y auto
.width-150
  width 150px !important
.tip-description
  font-size 12px
  line-height 16px
  color red
  margin-top 0px
.m-l-15
  margin-left 15px
.upload-pic
  width 88px
  height 88px
  margin-right 8px
.image-wrapper
  display flex
  align-items center
  .image-item
    display flex
    align-items center
    margin-right 20px
    &:last-child
      margin-right 0
    span.tooltip-text
      padding-right 30px
      font-size 14px
      color #000
.tooltip-text
  font-size 12px
  color #FF0000
.blue
  margin-left 5px
  color #00F
</style>
