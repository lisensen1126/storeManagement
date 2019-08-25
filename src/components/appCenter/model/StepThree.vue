<!--活动报名步骤一-->
<template lang="pug">
  .model
    h2 上传物料陈列照片
      a.more(@click="goDetail()") 更多活动详情
    .form-wrapper
      .tip 拍照上传物料照片，不知道怎么拍？
        a.more(@click="see") 点击查看
      .image-wrapper
        .upload-pic(v-for="(item, index) in product_pics")
          upload-img-model(v-model="product_pics[index]", img-type="info", :has-second-action="true", @other="deleteImage(index)")
        .upload-pic(v-if="product_pics.length < 3")
          upload-img-model(v-model="product_pics[product_pics.length]", img-type="info", :has-second-action="true", @other="deleteImage")
    .btn-wrapper
      .button-group
        a.button.primary(@click="saveStep()") 我已确认陈列
</template>

<script>
import UploadImgModel from '@/components/basicInformation/modal/uploadImgModel'
import Api from '@/mixins/modules/AppCenter'
import Images from '@/assets/chenglie.jpg'
export default {
  name: 'stepThree',
  components: {
    UploadImgModel,
  },
  mixins: [Api],
  data () {
    return {
      product_pics: [], // 主图
    }
  },

  methods: {
    goDetail () {
      this.$router.push({
        name: 'ActiveSignUpDetail',
      })
    },
    // 预览提示
    see () {
      this.$alert(`
      <div style="max-height: 400px; overflow-y: auto">
        <img src=${Images} width="100%"/>
      </div>`, '物料拍照样例', {
        dangerouslyUseHTMLString: true,
      })
      let dom = document.getElementsByClassName('el-message-box')[0]
      dom.style.width = 650 + 'px'
    },
    // 删除图片
    deleteImage (index) {
      this.$delete(this.product_pics, index)
    },

    // 保存
    async saveStep () {
      try {
        const {result, response} = await this.setActiveInfoApi({
          step: 3,
          pics: this.product_pics,
        })
        if (response.status === 200 && result.code === 0) {
          this.$emit('stepThree', 3)
        } else if (response.status === 200 && result.code === 41232) {
          this.$store.dispatch('showMessage', {
            title: '提示',
            content: result.message,
            isRejectable: 1,
            resolve: () => {
              this.$emit('stepViewThree', 1)
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: `服务异常，请稍后再试（${result.message}）`,
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
  },
  mounted () {
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.model
  width 100%
  height 100%
  .more
    color #409EFF
    font-size 14px
    margin-left 10px
  .more:hover
    text-decoration underline
  .form-wrapper
    padding-bottom 40px
    .tip
      font-size 14px
      padding-bottom 20px
  .btn-wrapper
    padding: 23px 185px 10px
  .upload-pic
    width 88px
    height 88px
    margin-right 8px
  .image-wrapper
    display flex
    flex-direction row
  .el-message-box
    width 600px !important
</style>
