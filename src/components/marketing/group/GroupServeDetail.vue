<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slideVisible", :is-slim="true", @input="toggleSidePannel")
      image-detail(v-if="true", :current-image-array="current_array")
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 查看拼团服务
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
            .field-content(v-text="item.brand_name ? item.brand_name : '- -'")
          .field.is-horizontal
            label.label 服务分类
            .field-content(v-text="item.category_name")
          .field.is-horizontal.custom-select
            label.label 成团人数
            .field-content(v-text="num + '人'")
          .field.is-horizontal.custom-select
            label.label 成团有效期
            .field-content(v-text="time + '小时'")
          .field.is-horizontal
            label.label 服务价格
            .field-content(v-text="item.sell_price + '元'")
          .field.is-horizontal
            label.label 拼团价格
            .sku-price
              .field-content(v-text="group_price + '元'")
          .field.is-horizontal
            label.label 服务详情
            .control(v-if="item.content.length === 0") - -
            .control.image-wrapper(v-else, @click="toggleSidePannel(item.content)")
              img.img-detail(v-for="(cell, index) in item.content",:src="item.content[index]")
      .btn-wrapper
        .button-group
          a.button.primary.large(v-if="status === 1", @click="changeStatus") 停止
          a.button.large(v-if="status === 2", @click="deleteGroup") 删除
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import productServiceMixin from '@/mixins/modules/productService'
  import OpenImage from '@/components/generics/OpenImage'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import ImageDetail from '@/components/productService/ImageDetail'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import GroupApi from '@/mixins/modules/Group'
  import MathFun from '@/mixins/utilities/math'
  export default {
    name: 'groupServeEdit',
    mixins: [productServiceMixin, GroupApi, MathFun],
    components: {
      OpenImage,
      ImageDetail,
      SlideOutModal,
      CustomSelect,
      CustomInput,
    },
    data () {
      return {
        slideVisible: false, // 左边弹框
        history_product_id: '', // 快照商品id
        current_array: [],
        num: null,
        time: null,
        status: '', // 拼团是否开启停止
        group_price: '', // 成团价
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
    methods: {
      // 删除拼团服务
      deleteGroup () {
        this.$store.dispatch('showMessage', {
          title: '确认删除吗？',
          isRejectable: 1,
          resolve: () => {
            this.deleteApi()
          },
        })
      },
      // 删除接口
      async deleteApi () {
        let _this = this
        try {
          const {response, result} = await this.groupDeleteApi({
            id: _this.id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                type: 'success',
                title: '删除成功',
                autoClose: true,
              })
              _this.$router.push({
                name: 'mangeList',
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '删除失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      /*
      * 停止开启参团商品
      * */
      changeStatus () {
        let _this = this
        this.$store.dispatch('showMessage', {
          title: `确认${_this.status === 1 ? '停止' : '开始'}吗？`,
          isRejectable: 1,
          resolve: () => {
            this.changeApi()
          },
        })
      },
      /*
      * 开启关闭接口
      * */
      async changeApi () {
        let _this = this
        try {
          const {response, result} = await this.statusChangeApi({
            id: _this.id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              if (result.message === 'success') {
                this.$store.dispatch('showMessage', {
                  type: 'success',
                  title: `${_this.status === 1 ? '停止' : '开始'}成功`,
                  autoClose: true,
                })
                _this.getServe()
              } else {
                this.$store.dispatch('showMessage', {
                  type: 'failure',
                  title: `${_this.status === 1 ? '停止' : '开始'}失败`,
                })
                return false
              }
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: `${_this.status === 1 ? '停止' : '开始'}失败`,
                content: `出错了：${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: `${_this.status === 1 ? '停止' : '开始'}失败`,
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: `${_this.status === 1 ? '停止' : '开始'}失败`,
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 返回操作
      goBack () {
        this.$router.go(-1)
      },
      // 获取服务详情
      async getData () {
        let self = this
        try {
          const {response, result} = await this.eventDetailApi({
            history_product_id: self.history_product_id,
            type: 2,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              result.data.mini_price = self.accDiv(result.data.mini_price, 100)
              result.data.sell_price = self.accDiv(result.data.sell_price, 100)
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
              this.num = result.data.num
              this.time = result.data.time
              this.group_price = (result.data.product_sku[0].group_price / 100).toFixed(2)
              this.status = result.data.status
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
        this.slideVisible = !this.slideVisible
        this.current_array = imgs
      },
    },
    mounted () {
      this.history_product_id = this.$route.query.history_product_id
      this.id = this.$route.query.id
      if (this.history_product_id) {
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
