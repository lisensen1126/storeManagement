<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slide_visible", :is-slim="true", @input="toggleSidePannel")
      image-detail(v-if="true", :current-image-array="currebt_array")
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 添加秒杀服务
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 开始时间
            date-picker(type="singleWithTime", v-model="start_time", :options="start_time_options", error-info="请选择秒杀开始时间", :validator="$v.start_time")
          .field.is-horizontal
            label.label 结束时间
            date-picker(type="singleWithTime", v-model="end_time", :options="end_time_options", error-info="请选择秒杀结束时间", :validator="$v.end_time")
          .field.is-horizontal
            label.label 限购数量
            .limit-num
              custom-input(input-type="hasUnit", placeholder="请输入限购数量", v-model="limit_number", error-info="请输入大于0小于99999的整数", :validator="$v.limit_number", need-type="number")
                span(slot="unitName") 件/人
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
          .field.is-horizontal
            label.label 服务价格
            .field-content(v-text="item.sell_price + '元'")
          .field.is-horizontal
            label.label 秒杀价格
            .sku-price
              custom-input(input-type="hasUnit", placeholder="请输入秒杀价格", v-model="limit_price", error-info="请输入大于0小于99999的价格精确到小数点后2位", :validator="$v.limit_price", need-type="float")
                span(slot="unitName") 元
          .field.is-horizontal
            label.label 活动数量
            .sku-price
              custom-input(input-type="hasUnit", placeholder="请输入活动数量", v-model="inventory_total", error-info="请输入大于0小于99999的整数", :validator="$v.inventory_total", need-type="number")
                span(slot="unitName") 件
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
  import OpenImage from '@/components/generics/OpenImage'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import ImageDetail from '@/components/productService/ImageDetail'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import DatePicker from '@/components/generics/form/DatePicker'
  import {required, between} from 'vuelidate/lib/validators'
  import spikeApi from '@/mixins/modules/Spike'
  import {priceFormat, quantityFormat} from '@/mixins/custom-validators/custom-validators'
  import FormateDate from '@/mixins/utilities/formateDate'
  export default {
    name: 'spikeServeAdd',
    mixins: [validationMixin, productServiceMixin, spikeApi, FormateDate],
    components: {
      OpenImage,
      ImageDetail,
      SlideOutModal,
      CustomSelect,
      CustomInput,
      DatePicker,
    },
    data () {
      return {
        slide_visible: false, // 左边弹框
        start_time: '', // 开始时间
        end_time: '', // 结束时间
        limit_price: '', // 秒杀价格
        limit_number: '', // 限制数量
        inventory_total: '', // 活动数量
        // 选择时分默认
        end_time_options: {
          defaultHour: 23,
          defaultMinute: 59,
          minuteIncrement: 1,
        },
        start_time_options: {
          defaultHour: 0,
          defaultMinute: 0,
          minuteIncrement: 1,
        },
        id: '',
        currebt_array: [],
        item: {
          product_name: '', // 服务库名称
          name: '', // 名称
          category: null, // 分类
          mini_price: '', // 服务价格
          desc: '', // 服务简述
          pic: '', // 服务图示
          content: [], // 特色服务
        },
      }
    },
    validations: {
      start_time: {
        required,
      },
      end_time: {
        required,
      },
      inventory_total: {
        required,
        between: between(1, 99999),
        validate (val) {
          return val && quantityFormat(val)
        },
      },
      limit_number: {
        required,
        between: between(1, 99999),
        validate (val) {
          return val && quantityFormat(val)
        },
      },
      limit_price: {
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
      // 保存数据
      saveData () {
        this.$v.$touch()
        if (this.$v.start_time.$error || this.$v.end_time.$error || this.$v.limit_number.$error) {
          document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
          return
        }
        if (this.$v.$error) {
          return
        }
        let nowTime = Date.parse(new Date()) / 1000
        let time = this.start_time
        time = (new Date(time.replace(/-/g, '/'))).getTime() / 1000
        if (nowTime > time) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '秒杀编辑失败',
            content: '开始时间要大于当前时间',
          })
          return
        }
        let time2 = this.end_time
        time2 = (new Date(time2.replace(/-/g, '/'))).getTime() / 1000
        if (time > time2) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '秒杀编辑失败',
            content: '结束时间要大于开始时间',
          })
          return
        }
        let params = {
          start_time: (new Date(this.start_time.replace(/-/g, '/'))).getTime() / 1000,
          end_time: (new Date(this.end_time.replace(/-/g, '/'))).getTime() / 1000,
          product: {
            name: this.item.name,
            product_id: this.item.product_id,
            limit_number: this.limit_number - 0,
            basic_spu_id: this.item.basic_spu_id,
            type: 2,
            sku: [{
              sku_id: 0,
              basic_sku_id: 0,
              value: '',
              limit_price: this.limit_price * 100,
              inventory_total: this.inventory_total - 0,
              enable: 1,
            }],
          },
        }
        this.$store.dispatch('showMessage', {
          title: '确认要保存吗',
          isRejectable: 1,
          resolve: () => {
            this.addSpike(params)
          },
        })
      },
      /*
      * 添加秒杀服务
      * params 提交数据
      * */
      async addSpike (params) {
        try {
          const {response, result} = await this.addSpikeApi(params)
          if (response.status === 200) {
            if (result.code === 0 && result.message === 'success') {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '成功',
                content: '秒杀编辑成功',
                resolve: () => {
                  this.$router.push({
                    name: 'spikeList',
                  })
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '秒杀编辑失败',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '秒杀编辑失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '秒杀编辑失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 返回
      goBack () {
        this.$router.replace({
          name: 'spikeList',
          query: {
            save: 1
          },
        })
      },
      // 获取服务详情
      async getData () {
        try {
          const {response, result} = await this.spikeDetailApi({
            id: this.id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              result.data.product.sell_price = (result.data.product.sell_price / 100).toFixed(2)
              this.item = result.data.product
              this.limit_price = (result.data.product.sku[0].limit_price / 100).toFixed(2)
              this.inventory_total = result.data.product.sku[0].inventory_total + result.data.product.sku[0].sales_total
              this.limit_number = result.data.product.limit_number
              this.currebt_array = result.data.product.content
              this.start_time = this.formateDate(result.data.start_time, true, 2)
              this.end_time = this.formateDate(result.data.end_time, true, 2)
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
      // 查看服务详情
      toggleSidePannel (imgs) {
        this.slide_visible = !this.slide_visible
        this.currebt_array = imgs
      },
    },
    mounted () {
      this.id = this.$route.query.id
      if (this.id) {
        this.getData() // 获取服务详情
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
  .limit-num
    width 200px
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
  .img-detail
    display inline-block
    width 60px
    height 60px
    border-radius 5px
    cursor pointer
    margin-right 10px
</style>
