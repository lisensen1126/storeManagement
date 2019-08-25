<template lang="pug">
  .section-layout
    .content-wrapper
      .step-content(v-if="step_num != 4 && step_num != 5")
        el-steps.step(:active="step_num", simple)
          el-step(title="确认报名信息", icon="el-icon-edit")
          el-step(title="确认收到物料", icon="el-icon-upload")
          el-step(title="物料拍照", icon="el-icon-picture")
          el-step(title="优惠券配置")
        step-one(v-if="step_num == 0", v-on:stepOne="stepFn", v-on:stepViewOne="fetchStep")
        step-two(v-if="step_num == 1", v-on:stepTwo="stepFn", v-on:stepViewTwo="fetchStep")
        step-three(v-if="step_num == 2", v-on:stepThree="stepFn", v-on:stepViewThree="fetchStep")
        step-four(v-if="step_num == 3", v-on:stepFour="stepFn", v-on:stepViewFour="fetchStep")
      .step-success(v-if="step_num == 4 || step_num == 5")
        .success
          .font.el-icon-success
          .title 您已成功报名支付立减活动
          .info 活动将于2019年7月22日开启，敬请期待！
          .more(@click="goDetail") 更多活动详情
          a.button.primary(@click="goBack()") 我知道了
</template>

<script>
import Api from '@/mixins/modules/AppCenter'
import StepOne from '@/components/appCenter/model/StepOne'
import StepTwo from '@/components/appCenter/model/StepTwo'
import StepThree from '@/components/appCenter/model/StepThree'
import StepFour from '@/components/appCenter/model/StepFour'
export default {
  name: 'activeSignUp',
  components: {
    StepOne,
    StepTwo,
    StepThree,
    StepFour,
  },
  mixins: [Api],
  data () {
    return {
      step_num: 0,
    }
  },
  mounted () {
    this.step_num = this.$route.query.step - 1
  },
  methods: {
    // 步骤组件返回的数据
    stepFn (data) {
      this.step_num = data
      this.$router.replace({
        name: 'ActiveSignUpStep',
        query: {
          step: data + 1,
        },
      })
    },

    // 获取报名到哪一步了，步骤
    async fetchStep () {
      try {
        const {result, response} = await this.getActiveCurstepAPi()
        if (response.status === 200 && result.code === 0) {
          this.stepFn(result.data.step - 1)
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取报名步骤失败',
            content: `服务异常，请稍后再试（${result.message}）`,
          })
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 返回上一页
    goBack () {
      this.$router.replace({name: 'allApp'})
    },

    // 去活动介绍页
    goDetail () {
      this.$router.push({
        name: 'ActiveSignUpDetail',
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.success
  width 600px
  height auto
  margin 0 auto
  text-align center
  padding-top 60px
  .font
    font-size 100px
    color #67C23A
  .title
    font-size 24px
    color #333
    font-weight 600
    padding-top 60px
    padding-bottom 20px
  .info
    font-size 14px
    color #666
    padding-bottom 20px
  .more
    color #409EFF
    font-size 14px
    cursor pointer
  .more:hover
    text-decoration underline
  .button
    margin-top 40px
    width 180px
</style>
