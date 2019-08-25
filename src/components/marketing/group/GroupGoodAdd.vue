<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slide_visible", :is-slim="true", @input="toggleSidePannel")
      image-detail(v-if="true", :current-image-array="current_array")
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 添加拼团商品
      .form-wrapper
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
          .field.is-horizontal.custom-select
            label.label 成团人数
            custom-select(v-model="group.num", :list="group_num", error-info="请选择成团人数", :validator="$v.group.num")
          .field.is-horizontal.custom-select
            label.label 成团有效期
            custom-select(v-model="group.time", :list="group_time", error-info="请选择成团有效期", :validator="$v.group.time")
          .field.is-horizontal
        .field-group(v-if="info.sku_data.length>0")
          .field.is-horizontal.width-100
            label.label SKU设置
            .control
              .sku-title.clearfix
                .title.fl SKU名称
                .title.fl SKU图
                .title.fl.p-l-40 详情图
                .title.fl.p-l-40(v-if="info.source_type == 1") SKU原价
                .title.fl.width-160 成团价格
                .title.fl.width-80.m-l-60 禁用/启用
              <!--禁用的sku隐藏掉 -->
              .sku-box(v-for="(sku, index) in sku_data", v-if="sku.is_enabled === 1 ")
                .sku-txt(v-text="sku.value")
                .sku-img.width-150.m-r-0
                  upload-pic(v-if='info.source_type === 2',v-model="sku.sku_pics[0]", :img-id="index", :default-img="default_img_src", img-type="sku")
                  .upload-pic-default(v-if='info.source_type === 1')
                    img(:src='sku.sku_pics[0]')
                .sku-txt.p-l-40
                  .fl.m-r-20(:class="{'a-text': sku.content && sku.content.length > 0}",@click="toggleSidePannel(sku.content)",v-text="sku.content && sku.content.length > 0 ? '查看':'暂无内容'")
                .sku-txt.p-l-40(v-text="'￥'+sku.sell_price")
                .sku-price
                  custom-input(input-type="hasUnit", v-model="sku.group_price", :validator="$v.sku_data.$each[index].group_price", error-info="请输入大于0小于99999的价格精确到小数点后2位", need-type="float", placeholder="请输入价格")
                    span(slot="unitName") 元
                .sku-txt.width-200.p-l-60
                  .simple-td
                    .switch
                      input(type="checkbox", :id="'display' + index", v-model="sku.is_selected", @change="displayConfirm(sku)")
                      label(:for="'display' + index")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="saveData",) 保存并开始
          a.button.large(@click="cancel") 取消
</template>

<script>
  import ImageDetail from '@/components/productService/ImageDetail'
  import productServiceMixin from '@/mixins/modules/productService'
  import CustomInput from '@/components/generics/form/CustomInput'
  import {between, required} from 'vuelidate/lib/validators'
  import {priceFormat} from '@/mixins/custom-validators/custom-validators'
  import OpenImage from '@/components/generics/OpenImage'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import GroupApi from '@/mixins/modules/Group'
  import UploadPic from '@/components/generics/form/UploadPic'
  import MathFun from '@/mixins/utilities/math'
  export default {
    name: 'GroupGoodAdd',
    mixins: [productServiceMixin, GroupApi, MathFun],
    components: {
      CustomInput,
      OpenImage,
      CustomSelect,
      ImageDetail,
      SlideOutModal,
      UploadPic,
    },
    data () {
      return {
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
        },
        sku_data: [],
        default_img_src: '',
        current_array: [], // 左边弹框展示的数组
        slide_visible: false, // 左边弹框的显隐
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
      }
    },
    validations: {
      group: {
        num: {
          required,
        },
        time: {
          required,
        },
      },
      sku_data: {
        $each: {
          group_price: {
            between: between(0.01, 99999),
            priceFormat,
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
      // 保存
      saveData () {
        this.$v.$touch()
        if (this.$v.$error) {
          return
        }
        let one = false // 是否有一个sku开启
        let isLack = false // 是否确实信息
        this.sku_data.forEach(item => {
          if (item.enable === 1 && item.is_enabled === 1) {
            one = true
            if (!item.group_price) {
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
            content: '拼团商品sku必须有一个开启',
          })
          return
        }
        // 判断开启的sku 数据是否填写
        if (isLack) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'failure',
            title: '提示',
            content: '开启的sku拼团价必须填写',
          })
          return
        }
        this.$store.dispatch('showMessage', {
          title: '确认要保存吗',
          isRejectable: 1,
          resolve: () => {
            this.addGroup()
          },
        })
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
              if (v.is_enabled === 1) {
                v.group_price = ''
                v.is_selected = true
              } else {
                v.is_selected = false
              }
              v.enable = 1
              v.basic_sell_price = self.accDiv(v.basic_sell_price, 100).toFixed(2)
              v.sell_price = self.accDiv(v.sell_price, 100).toFixed(2)
              filterData.push(v)
            })
            result.data.sku_data = filterData
            this.info = result.data
            this.sku_data = this.info.sku_data
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
      // 关闭/开启SKU
      async displayConfirm (sku) {
        sku.enable === 1 ? sku.enable = 2 : sku.enable = 1
      },
      // 返回
      goBack () {
        this.$router.go(-1)
      },
      // 创建拼团商品
      async addGroup () {
        let params = {
          product_id: this.info.product_id,
          num: this.group.num.id,
          time: this.group.time.id,
        }
        let sku = []
        this.sku_data.forEach(item => {
          if (item.is_enabled === 1) {
            let v = {
              sku_id: item.sku_id,
              group_price: item.group_price * 100,
              enable: item.enable,
            }
            sku.push(v)
          }
        })
        params.sku = sku
        try {
          const {response, result} = await this.addGroupApi(params)
          if (response.status === 200) {
            if (result.code === 0 && result.message === 'success') {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '成功',
                content: '拼团开始成功',
                resolve: () => {
                  this.$router.push({
                    name: 'mangeList',
                  })
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '拼团开始失败',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '拼团开始失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '拼团开始失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 查看sku详情
      toggleSidePannel (imgs) {
        if (imgs.length === 0) return
        this.slide_visible = !this.slide_visible
        this.current_array = imgs
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
      width: 150px;
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
      width: 160px;
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
      width 150px
      font-size 12px
      line-height 16px
      color #666
  .width-100
    width 100% !important
  .width-200
    width 200px !important
  .width-150
    width 150px !important
  .width-160
    width 160px !important
  .width-80
    width 80px !important
  .a-text
    color #3a8ee6 !important
    cursor pointer
</style>

