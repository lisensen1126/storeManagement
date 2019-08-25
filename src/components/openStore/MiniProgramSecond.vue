<template lang="pug">
  .section-layout
    timer-shaft(:high-light="3")
    .content-wrapper
      open-store-title(title="小程序申请二：小程序信息完善")
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 小程序名称
            custom-input(v-model="info.name", maxlength=30, placeholder="请输入小程序名称", :validator="$v.info.name", error-info="小程序名称不能为空且不大于30字", need-type="no_space")
            a.button.primary.m-l-15(@click="checkName", :class="{'disabled': info.name.length <= 0}") 检测名称
          .field.is-horizontal(v-if="show_prove")
            label.label 上传证明资料
            .image-wrapper
              .upload-pic
                up-mini-image(img-type="6", v-model="info.prove", :hasSecondAction="true", img-id='1')
          .field.is-horizontal(v-if="show_prove")
            label.label
            .tip-description 注：你申请的名称可能涉及特定主体姓名或名称，请提供可确认主体材料与名称对应的材料，或提供《商标注册证》等其他材料，以证明你有权合理且善意使用该名称，否则可能审核不通过。
          .field.is-horizontal
            label.label 小程序头像
            .control.upLoad-image
              .upload-pic
                up-meituan(img-type="6", v-model="info.headimg", :hasSecondAction="is_del", img-id='2')
          .field.is-horizontal
            label.label
            .tip-description 头像不允许涉及政治敏感与色情;图片格式必须为：png,bmp,jpeg,jpg,gif；不可大于2M；建议使用png格式图片，以保持最佳效果；建议图片尺寸为144px*144px
          .field.is-horizontal
            label.label 小程序介绍
            .control
              custom-textarea.textarea(placeholder="请输入小程序介绍", v-model="info.introduce", :validator="$v.info.introduce", error-info="小程序介绍必填", maxlength=120)
          .field.is-horizontal
            label.label
            .tip-description(style="white-space: nowrap;") 注：请谨慎填写小程序完善信息，若后期修改需在微信公众平台登录修改，点击查看
              a.blue(@click="showModal") 操作说明
      tips-reference(v-if="is_open_reference", :imgUrl="imgUrl", @close="closeModal")

      .btn-wrapper
        .button-group
          a.button.primary.large.width-150(@click="submitClick") 提交信息并授权
</template>

<script>
import TimerShaft from '@/components/openStore/modal/TimerShaft'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomTextarea from '@/components/generics/form/CustomTextarea'
import UpMeituan from '@/components/openStore/modal/UpMeituanImage'
import UpMiniImage from '@/components/openStore/modal/UpMiniImage'
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import TipsReference from '@/components/openStore/modal/TipsReference'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import OpenStoreMixin from '@/mixins/modules/OpenStore'
import { mapGetters } from 'vuex'
export default {
  name: 'miniProgramSecond',
  mixins: [validationMixin, OpenStoreMixin],
  components: {
    TimerShaft,
    CustomInput,
    CustomTextarea,
    UpMeituan,
    UpMiniImage,
    OpenStoreTitle,
    TipsReference,
  },
  data () {
    return {
      info: {
        name: '',
        headimg: '',
        introduce: '',
        prove: '',
      },
      is_del: false, // 是否开启删除图片按钮
      show_prove: 0, // 是否展示上传证明材料模块
      prove_pass: 0, // 名称检测是否通过
      is_open_reference: false,
      imgUrl: 'https://oss1.chedianai.com/images/assets/mini-program-second-img.png',
    }
  },
  validations: {
    info: {
      name: {
        required,
      },
      introduce: {
        required,
      },
    },
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      wxStatus: 'wxStatus',
    }),
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
    // 检测小程序名称
    async checkName () {
      let _this = this
      if (!_this.info.name) {
        return false
      }
      try {
        const { response, result } = await _this.miniWxVerifyNameApi({
          name: _this.info.name.trim(),
        })
        if (response.status === 200 && result.code === 0) {
          _this.show_prove = 0 // 考虑用户名校验失败后，再次输入名称却校验成功，则不该显示证明材料模块
          _this.prove_pass = 1 // 名称检测通过
          _this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '温馨提示',
            content: '您的小程序名称已检测成功，可正常使用。',
            resolve: () => { },
          })
        } else if (result.code === 19041715) {
          _this.show_prove = 1
        } else {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '检测小程序名称失败',
            content: `${result.message}`,
          })
          _this.show_prove = 0
        }
      } catch (err) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '检测小程序名称失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 点击提交
    async submitClick () {
      let _this = this
      _this.$v.$touch()
      if (_this.$v.$error) {
        return false
      }
      if (_this.show_prove && !_this.info.prove) {
        _this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请上传证明资料',
        })
        return
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
        name: _this.info.name.trim(),
        headimg: _this.info.headimg,
        introduce: _this.info.introduce,
        x1: 0, // 图片裁剪参数
        y1: 1, // 图片裁剪参数
        x2: 0, // 图片裁剪参数
        y2: 1, // 图片裁剪参数
      }
      if (_this.prove_pass === 0 && _this.info.prove) {
        params.prove = _this.info.prove
      }
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '后期修改信息需向微信支付额外费用且修改操作复杂，请确定信息无误后提交!',
        isRejectable: 1,
        resolve: () => {
          this.miniPerfectInfo(params)
        },
      })
    },
    async miniPerfectInfo (params) {
      let _this = this
      try {
        const { response, result } = await _this.miniPerfectInfoApi(params)
        if (response.status === 200 && result.code === 0) {
          _this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '提交信息成功',
            resolve: () => {
              _this.$router.push({
                name: 'miniProgramSecondWait',
              })
            },
          })
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
          _this.info.name = result.data.name ? result.data.name : ''
          _this.info.prove = result.data.prove ? result.data.prove : ''
          _this.info.introduce = result.data.introduce ? result.data.introduce : '实现以“车主”为中心，全新全意用最智能的方式服务好每位“车主”。'
          _this.info.headimg = result.data.headimg ? result.data.headimg : ''
          if (_this.info.name) {
            _this.checkName() // 检测小程序名称
          }
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
    // 更新step字段
    async updateUserInfo () {
      try {
        const { response, result } = await this.fetchUserInfoApi()
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('updateUser', result.data)
          if (this.currentUser.step >= 3) {
            this.getInfo() // 获取小程序基本信息
          } else {
            this.redirectFun()
          }
        }
        return { response, result }
      } catch (err) {
        throw err
      }
    },
    // 重定向
    redirectFun () {
      let type = this.currentUser.step // 主流程
      let wxStatus = this.wxStatus // 企业微信
      let nearbyStatus = this.currentUser.nearby_status // 附近小程序
      let flag = this.currentUser.mini_status === 1 || this.currentUser.mini_status === 4 // 未提交
      switch (type) {
        case 1:
          this.$router.push({
            name: 'storeAptitude',
          })
          break
        case 2:
          if (flag) {
            this.$router.push({
              name: 'miniProgramFirst',
            })
          } else {
            this.$router.push({
              name: 'miniProgramFirstWait',
            })
          }
          break
        case 3:
          if (flag) {
            this.getInfo() // 获取小程序基本信息
          } else {
            this.$router.push({
              name: 'miniProgramSecondWait',
            })
          }
          break
        case 4:
          this.$router.push({
            name: 'payMsgFirstWait',
          })
          break
        case 5:
          if (flag) {
            this.$router.push({
              name: 'payMsgSecond',
            })
          } else {
            this.$router.push({
              name: 'payMsgSecondWait',
            })
          }
          break
        case 6:
          if (flag) {
            this.$router.push({
              name: 'payMsgThird',
            })
          } else {
            this.$router.push({
              name: 'payMsgThirdWait',
            })
          }
          break
        case 7:
          if (wxStatus === 2) {
            this.$router.push({
              name: 'enterpriseWeChatRegister',
            })
          } else if (nearbyStatus !== 3) {
            this.$router.push({
              name: 'nearbyMiniProgramCategoryRedirect',
            })
          }
          break
        default:
          break
      }
    },
  },
  mounted () {
    this.$store.dispatch('syncAuthorizeStatus')
    this.updateUserInfo()
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
