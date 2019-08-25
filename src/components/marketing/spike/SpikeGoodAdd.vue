<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slideVisible", :is-slim="true", @input="toggleSidePannel")
      image-detail(v-if="true", :current-image-array="currentArray")
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 设置秒杀商品
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
            label.label 商品名称
            .field-content(v-text="info.product_name")
          .field.is-horizontal
            label.label 商品品牌
            .field-content(v-text="info.brand_name")
          .field.is-horizontal
            label.label 商品图片
            .control.cus_imgs(v-if="info.product_pics.length>0")
              open-image(img-type="2",:img-url="info.product_pics",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="5", border-radius="5")
          .field.toggle-group.is-horizontal.custom-select
            label.label 商品分类
            .field-content(v-text="info.category_name")
        .field-group(v-if="info.sku_data.length>0")
          .field.is-horizontal.width-100
            label.label SKU设置
            .control
              .sku-title.clearfix
                .title.fl SKU名称
                .title.fl SKU图
                .title.fl 详情图
                .title.fl SKU原价
                .title.fl.width-160 限时价
                .title.fl.width-140 活动数量
                .title.fl.width-80.m-l-60 禁用/启用
              <!--禁用的sku隐藏掉 -->
              .sku-box(v-for="(sku, index) in sku_data", v-if="sku.is_enabled === 1 ")
                .sku-txt(v-text="sku.value")
                .sku-img.width-110.m-r-0
                  upload-pic(v-if='info.source_type === 2',v-model="sku.sku_pics[0]", :img-id="index", :default-img="defaultImgSrc", img-type="sku")
                  .upload-pic-default(v-if='info.source_type === 1')
                    img(:src='sku.sku_pics[0]')
                .sku-txt
                  .fl.m-r-20(:class="{'a-text': sku.content && sku.content.length > 0}",@click="toggleSidePannel(sku.content)",v-text="sku.content && sku.content.length > 0 ? '查看':'暂无内容'")
                .sku-txt(v-text="'￥'+sku.sell_price")
                .sku-price.m-r-20
                  custom-input(input-type="hasUnit", :is-disabled="is_loading", v-model="sku.limit_price", :validator="$v.sku_data.$each[index].limit_price", error-info="请输入大于0小于99999的价格精确到小数点后2位", need-type="float")
                    span(slot="unitName") 元
                .sku-price
                  custom-input(input-type="hasUnit", :is-disabled="is_loading", v-model="sku.inventory_total", :validator="$v.sku_data.$each[index].inventory_total", error-info="请输入大于0小于99999的整数", need-type="number")
                    span(slot="unitName") 个
                .sku-txt.width-200.p-l-60
                  .simple-td
                    .switch
                      input(type="checkbox", :id="'display' + index", v-model="sku.is_selected", @change="displayConfirm(sku)")
                      label(:for="'display' + index")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData", :class="{'disabled': is_loading}") 保存并开始
          a.button.large(@click="cancel") 取消
</template>

<script>
  import productServiceMixin from '@/mixins/modules/productService'
  import fileUploader from '@/mixins/utilities/fileUploader'
  import CustomInput from '@/components/generics/form/CustomInput'
  import UploadPic from '@/components/generics/form/UploadPic'
  import imageScale from '@/mixins/utilities/imageScale'
  import {between, required} from 'vuelidate/lib/validators'
  import {priceFormat, quantityFormat} from '@/mixins/custom-validators/custom-validators'
  import OpenImage from '@/components/generics/OpenImage'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import DatePicker from '@/components/generics/form/DatePicker'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import ImageDetail from '@/components/productService/ImageDetail'
  import spikeApi from '@/mixins/modules/Spike'
  import MathFun from '@/mixins/utilities/math'
  export default {
    name: 'GroupGoodAdd',
    mixins: [productServiceMixin, fileUploader, imageScale, spikeApi, MathFun],
    components: {
      CustomInput,
      UploadPic,
      OpenImage,
      CustomSelect,
      DatePicker,
      SlideOutModal,
      ImageDetail,
    },
    data () {
      return {
        is_loading: false,
        start_time: '', // 开始时间
        end_time: '', // 结束时间
        limit_number: '', // 限购
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
        group: {
          num: null,
          time: null,
        }, // 拼团商品数据
        info: {
          name: '',
          product_id: '',
          product_name: '',
          brand_name: '',
          category_id: '',
          product_pics: [], // 主图
          sku_data: [],
          attribute_data: [],
          remark: '',    // 备注
        },
        propertyList: [],
        sku_data: [],
        defaultImgSrc: '',
        openFlag: false,
        currentArray: [],
        slideVisible: false,
      }
    },
    computed: {
    },
    validations: {
      start_time: {
        required,
      },
      end_time: {
        required,
      },
      limit_number: {
        required,
        between: between(1, 99999),
        validate (val) {
          return val && quantityFormat(val)
        },
      },
      sku_data: {
        $each: {
          limit_price: {
            between: between(0.01, 99999),
            priceFormat,
          },
          inventory_total: {
            between: between(1, 99999),
            validate (val) {
              if (val === '') return true
              return val && quantityFormat(val)
            },
          },
        },
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
      // sku的开启和禁用
      // 关闭/开启SKU
      async displayConfirm (sku) {
        sku.enable === 1 ? sku.enable = 2 : sku.enable = 1
      },
      // 保存
      inspectData () {
        this.$v.$touch()
        if (this.$v.start_time.$error || this.$v.end_time.$error || this.$v.limit_number.$error) {
          document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
          return
        }
        let one = false // 是否有一个sku开启
        let isLack = false // 是否确实信息
        this.sku_data.forEach(item => {
          if (item.enable === 1 && item.is_enabled === 1) {
            one = true
            if (!item.limit_price || !item.inventory_total) {
              isLack = true
            }
          }
        })
        // 判断至少有一个sku开启
        if (!one) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'failure',
            title: '提示',
            content: '秒杀商品sku必须有一个开启',
          })
          return
        }
        // 判断开启的sku 数据是否填写
        if (isLack) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'failure',
            title: '提示',
            content: '开启的sku限时价或者活动数量必须填写',
          })
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
            title: '创建秒杀失败',
            content: '开始时间要大于当前时间',
          })
          return
        }
        let time2 = this.end_time
        time2 = (new Date(time2.replace(/-/g, '/'))).getTime() / 1000
        if (time > time2) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '创建秒杀失败',
            content: '结束时间要大于开始时间',
          })
          return
        }
        let params = {
          start_time: (new Date(this.start_time.replace(/-/g, '/'))).getTime() / 1000,
          end_time: (new Date(this.end_time.replace(/-/g, '/'))).getTime() / 1000,
          product: {
            name: this.info.product_name,
            product_id: this.info.shop_product_id,
            basic_spu_id: this.info.product_id,
            limit_number: this.limit_number - 0,
            type: 1,
          },
        }
        let sku = []
        this.sku_data.forEach(item => {
          if (item.is_enabled === 1) {
            let v = {
              sku_id: item.shop_sku_id,
              basic_sku_id: item.sku_id,
              value: item.value,
              limit_price: item.limit_price * 100,
              inventory_total: item.inventory_total - 0,
              enable: item.enable,
            }
            sku.push(v)
          }
        })
        params.product.sku = sku
        this.$store.dispatch('showMessage', {
          title: '确认要保存吗',
          isRejectable: 1,
          resolve: () => {
            this.addSpike(params)
          },
        })
      },
      /*
      * 添加秒杀商品
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
                content: '秒杀开始成功',
                resolve: () => {
                  this.$router.push({
                    name: 'spikeList',
                  })
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '秒杀开始失败',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '秒杀开始失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '秒杀开始失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 获取商品详情
      async getData () {
        let self = this
        try {
          const {response, result} = await this.fetchProductDetail(this.product_id)
          if (response.status === 200) {
            if (result.code && result.code !== 0) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '商品详情获取失败',
                content: `${result.message}`,
              })
              return false
            }
            var filterData = []
            result.data.sku_data.forEach(function (v) {
              if (v.content && v.content.length > 0) {
                v.isFlag = true
              } else {
                v.isFlag = false
              }
              v.is_selected = true
              v.enable = 1
              v.inventory_total = ''
              v.limit_price = ''
              v.basic_sell_price = self.accDiv(v.basic_sell_price, 100).toFixed(2)
              v.sell_price = self.accDiv(v.sell_price, 100).toFixed(2)
              filterData.push(v)
            })
            result.data.sku_data = filterData
            this.info = result.data
            this.sku_data = this.info.sku_data
            this.propertyList = this.info.attribute_data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '商品详情获取失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '商品详情获取失败',
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
      // 查看sku详情
      toggleSidePannel (imgs) {
        this.slideVisible = !this.slideVisible
        this.currentArray = imgs
      },
    },
    mounted () {
      this.product_id = this.$route.query.id
      if (this.product_id) {
        this.getData()
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal';
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
  .field-content {
    font-size: 13px;
    line-height: 16px;
    color: #353535;
  }
  .service-status {
    padding-left: 7px;
    font-size: 13px;
    color: darker;
    margin-right: 20px;
  }

  .radio + .radio {
    margin-left: 28px;
  }
  .cus_imgs {
    display: flex;
    .img {
      width: 60px;
      height: 60px;
      margin-right: 5px;
    }
  }

  .sku-box {
    display: flex;
    align-items: center;
    margin-top: 20px;

    .sku-txt {
      width: 110px;
      font-size: 12px;
      color: #888;
      padding-right: 20px;
    }

    .sku-img {
      width: 60px;
      height: 60px;
      margin-right: 20px;
    }

    .sku-price {
      width: 140px;
    }
  }

  .sku-img>.upload-pic {
    width: 60px !important;
    height: 60px !important;
  }

  .upload-pic-default{
    width: 60px !important;
    height: 60px !important;
    img{
      width: 100%;
      height: 100%;
    }
  }

  .picture-description {
    font-size: 12px;
    line-height: 16px;
    color: lightGrey;
    white-space: nowrap;
    margin-top: 8px;
  }

  .rich-eidtor-description {
    margin-bottom: 8px;
  }
  .contentcc
    width 100%
    .cc
      float left
      margin-bottom 10px
      margin-left 10px
      width auto
  .gray
    color #666 !important
  /*new*/
  .m-l-0
    margin-left 0 !important
  .m-r-0
    margin-right 0 !important
  .m-r-20
    margin-right 20px
  .p-l-60
    padding-left 60px
  .m-l-60
    margin-left 60px
  .p-l-40
    padding-left 40px
  .fl
    float left
  .clearfix:after
    display block
    content ''
    clear both
    height 0
  .sku-title
    padding-top 8px
    width 900px
    .title
      float left
      width 110px
      font-size 12px
      line-height 16px
      color #666
  .width-100
    width 100% !important
  .width-200
    width 200px !important
  .width-110
    width 110px !important
  .width-160
    width 160px !important
  .width-80
    width 80px !important
  .width-140
    width 140px !important
  .a-text
    color #3a8ee6 !important
    cursor pointer
</style>
