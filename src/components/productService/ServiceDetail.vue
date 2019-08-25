<template lang="pug">
  .section-layout
    .content-wrapper
      h2 服务详情
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 服务库名称
            .field-content(v-text="item.product_name")
          .field.is-horizontal
            label.label 服务名称
            .field-content(v-text="item.name")
          .field.is-horizontal
            label.label 服务图示
            open-image(v-if="item.pic",img-type="1",:img-url="item.pic",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="0", border-radius="5")
          .field.is-horizontal
            label.label 服务品牌
            .field-content(v-text="(item.brands && item.brands.brand_name)?item.brands.brand_name:'- -'")
          .field.is-horizontal
            label.label 服务分类
            .field-content(v-text="item.category_name")
          .field.is-horizontal
            label.label 服务简述
            .field-content.field-textarea(v-if="item.desc === ''",) - -
            .field-content.field-textarea(v-text="item.desc", v-else)
          .field.is-horizontal
            label.label 备注
            .field-content(v-text="item.remark && item.remark.length > 0 ? item.remark : '- -'")
          .field.is-horizontal
            label.label 建议价格
            .field-content(v-if="item.sell_price == '0.00'",) - -
            .field-content(v-else) {{item.sell_price ? item.sell_price + '元' : ''}}
          .field.is-horizontal
            label.label 服务价格
            .field-content(v-if="item.mini_price == '0.00'", v-text="item.sell_price + '元'")
            .field-content(v-else) {{item.mini_price ? item.mini_price + '元' : ''}}
          .field.is-horizontal
            label.label 服务详情
            .control(v-if="item.content && item.content.length === 0") - -
            .control.image-wrapper(v-else)
              img.img-detail(v-for="(cell, index) in item.content",:src="item.content[index]")
      .btn-wrapper
        .button-group
          a.button.primary.large(v-if="item.is_sale == 2", @click="setSellingState()") 上架
          a.button.primary.large(v-if="item.is_sale == 1", @click="setSellingState()") 下架
          a.button.large(@click="goBack") 返回
</template>

<script>
import productServiceMixin from '@/mixins/modules/productService'
import RichEditor from '@/components/generics/form/RichEditor'
import UploadPic from '@/components/generics/form/UploadPic'
import {validationMixin} from 'vuelidate'
import uploadImgModel from '@/components/basicInformation/modal/uploadImgModel'
import OpenImage from '@/components/generics/OpenImage'
import MathFun from '@/mixins/utilities/math'
export default {
  name: 'serviceDetail',
  mixins: [validationMixin, productServiceMixin, MathFun],
  components: {
    UploadPic,
    RichEditor,
    uploadImgModel,
    OpenImage,
  },
  data () {
    return {
      basic_spu_id: '',
      isDisabled: false,
      showSelector: false,
      categoryList: [],
      item: {
        product_name: '', // 服务库名称
        name: '', // 名称
        category: null, // 分类
        mini_price: '', // 服务价格
        desc: '', // 服务简述
        pic: '', // 服务图示
        content: '', // 特色服务
      },
    }
  },
  methods: {
    // 返回操作
    goBack () {
      if (this.$route.query.from) {
        this.$router.push({
          name: 'serviceList',
          query: {
            save: 1,
          },
        })
      } else {
        this.$router.back(-1)
      }
    },
    // 获取服务详情
    async getData () {
      let self = this
      try {
        const {response, result} = await this.fetchServiceDetail(this.basic_spu_id)
        if (response.status === 200) {
          if (result.code === 0) {
            result.data.mini_price = self.accDiv(result.data.mini_price, 100).toFixed(2)
            result.data.sell_price = self.accDiv(result.data.sell_price, 100).toFixed(2)
            this.item = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '服务详情获取失败',
              content: `出错啦！${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '服务详情获取失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '服务详情获取失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 上架操作
    async setSellingState () {
      try {
        const {response, result} = await this.serviceShelves(this.basic_spu_id)
        if (response.status === 200 && result.code === 0) {
          if (result.code === 1006) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '服务上下架操作失败',
              content: '失败原因：服务信息不完整',
            })
          }
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '服务上下架操作成功',
              resolve: () => {
                this.$router.replace({
                  name: 'serviceList',
                })
              },
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '温馨提示',
            content: result.message,
          })
        }
      } catch (err) {
        console.error('上下架接口', err)
      }
    },
  },
  mounted () {
    this.basic_spu_id = this.$route.params.id
    if (this.basic_spu_id) {
      this.getData() // 获取服务详情
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.field-content
  font-size: 13px
  line-height: 16px
  color: #353535
.field-textarea
  width 300px
.upload-pic
  display inline-block
  margin-top 4px
  width 88px
  height 88px
  margin-right 8px
.img-detail
  display block
  width 375px
  height auto
.cus_imgs {
  display: flex;

  .img {
    margin-right: 5px;
  }
}
</style>
