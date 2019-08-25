<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slide_visible", :is-slim="true", @input="toggleSidePannel")
      image-detail(v-if="true", :current-image-array="current_array")
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 编辑拼团服务
      .form-wrapper
        .field-group
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
          .field.is-horizontal.custom-select
            label.label 成团人数
            custom-select(v-model="num", :list="group_num", error-info="请选择成团人数", :validator="$v.num")
          .field.is-horizontal.custom-select
            label.label 成团有效期
            custom-select(v-model="time", :list="group_time", error-info="请选择成团有效期", :validator="$v.time")
          .field.is-horizontal
            label.label 服务价格
            .field-content(v-if="item.mini_price == '0.00'", v-text="item.sell_price + '元'")
            .field-content(v-else, v-text="item.mini_price + '元'")
          .field.is-horizontal
            label.label 拼团价格
            .sku-price
              custom-input(input-type="hasUnit", v-model="group_price", error-info="请输入大于0小于99999的价格精确到小数点后2位", :validator="$v.group_price", need-type="float", placeholder="请输入价格")
                span(slot="unitName") 元
          .field.is-horizontal
            label.label 服务详情
            .control(v-if="item.content.length === 0") - -
            .control.image-wrapper(v-else, @click="toggleSidePannel(item.content)")
              img.img-detail(v-for="(cell, index) in item.content",:src="item.content[index]")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="saveData") 保存并开始
          a.button.large(@click="cancel") 取消
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import productServiceMixin from '@/mixins/modules/productService'
  import {validationMixin} from 'vuelidate'
  import uploadImgModel from '@/components/basicInformation/modal/uploadImgModel'
  import OpenImage from '@/components/generics/OpenImage'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import ImageDetail from '@/components/productService/ImageDetail'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import GroupApi from '@/mixins/modules/Group'
  import {required, between} from 'vuelidate/lib/validators'
  import {priceFormat} from '@/mixins/custom-validators/custom-validators'
  import MathFun from '@/mixins/utilities/math'
  export default {
    name: 'groupServeEdit',
    mixins: [validationMixin, productServiceMixin, GroupApi, MathFun],
    components: {
      uploadImgModel,
      OpenImage,
      ImageDetail,
      SlideOutModal,
      CustomSelect,
      CustomInput,
    },
    data () {
      return {
        slide_visible: false, // 左边弹框
        basic_spu_id: '',
        current_array: [],
        num: null,
        time: null,
        group_price: '', // 成团价
        group_num: [{ // 成团人数
          id: 2,
          name: '2',
        }, {
          id: 3,
          name: '3',
        }, {
          id: 4,
          name: '4',
        }, {
          id: 5,
          name: '5',
        }],
        group_time: [{ // 成团有效期
          id: 24,
          name: '24小时',
        }, {
          id: 36,
          name: '36小时',
        }, {
          id: 48,
          name: '48小时',
        }],
        item: {
          product_name: '', // 服务库名称
          name: '', // 名称
          category: null, // 分类
          mini_price: '', // 服务价格
          desc: '', // 服务简述
          pic: '', // 服务图示
          content: [],
        },
      }
    },
    validations: {
      num: {
        required,
      },
      time: {
        required,
      },
      group_price: {
        required,
        between: between(0.01, 99999),
        priceFormat,
      },
    },
    methods: {
      // 取消操作
      cancel () {
        this.$store.dispatch('showMessage', {
          title: '提示',
          content: '取消后当前设置将不会被保存，是否取消',
          isRejectable: 1,
          resolve: () => {
            this.goBack()
          },
        })
      },
      // 返回操作
      goBack () {
        this.$router.go(-1)
      },
      async changeApi (id, status) {
        let params = {id: id}
        try {
          const {response, result} = await this.statusChangeApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              if (result.message === 'success') {
                this.$store.dispatch('showMessage', {
                  type: 'success',
                  title: `${parseInt(status) === 1 ? '开始' : '结束'}成功`,
                  autoClose: true,
                })
                this.$router.push({
                  name: 'mangeList',
                })
              } else {
                this.$store.dispatch('showMessage', {
                  type: 'failure',
                  title: `${parseInt(status) === 1 ? '开始' : '结束'}失败`,
                })
                return false
              }
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: `${parseInt(status) === 1 ? '开始' : '结束'}失败`,
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: `${parseInt(status) === 1 ? '开始' : '结束'}失败`,
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '开始结束失败')
        }
      },
      // 保存数据
      saveData () {
        this.$v.$touch()
        if (this.$v.$error) {
          return
        }
        this.$store.dispatch('showMessage', {
          title: '确认要保存吗',
          isRejectable: 1,
          resolve: () => {
            this.editGroup()
          },
        })
      },
      // 保存拼团接口
      async editGroup () {
        let params = {
          id: this.id,
          product_id: this.item.basic_spu_id,
          num: this.num.id,
          time: this.time.id,
          sku: [{
            sku_id: 0,
            group_price: this.group_price * 100,
            enable: 1,
          }],
        }
        try {
          const {response, result} = await this.editGroupApi(params)
          if (response.status === 200) {
            if (result.code === 0 && result.message === 'success') {
              // this.changeApi(this.id, 1)
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '成功',
                content: '拼团编辑成功',
                resolve: () => {
                  this.$router.push({
                    name: 'mangeList',
                  })
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '拼团编辑失败',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '拼团编辑失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '拼团编辑失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
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
              this.current_array = result.data.content
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
      // 获取拼团服务详情
      async getServe () {
        try {
          const {response, result} = await this.groupDetailApi({
            id: this.id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.group_num.forEach(item => {
                if (item.id === result.data.num) this.num = item
              })
              this.group_time.forEach(item => {
                if (item.id === result.data.time) this.time = item
              })
              this.group_price = (result.data.product_sku[0].group_price / 100).toFixed(2)
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
      // 查看sku详情
      toggleSidePannel (imgs) {
        this.slide_visible = !this.slide_visible
        this.current_array = imgs
      },
    },
    mounted () {
      this.basic_spu_id = this.$route.query.basic_spu_id
      this.id = this.$route.query.id
      if (this.basic_spu_id) {
        this.getData() // 获取服务详情
        this.getServe() // 获取拼团服务详情
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
  .nav-back-btn
    position absolute
    top 36px
    left 16px
    width 32px
    height 32px
    border-radius 100%
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
    cursor pointer
    z-index 2
  .sku-price
    width 200px
  .field-content
    font-size: 13px
    line-height: 16px
    color: #353535
  .field-textarea
    width 300px
  .img-detail
    display inline-block
    width 60px
    height 60px
    border-radius 5px
    cursor pointer
    margin-right 10px
</style>

