<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slide_visible", :is-slim="true", @input="toggleSidePannel")
      image-detail(v-if="true", :current-image-array="current_array")
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2(v-text="type === 1 ? '查看秒杀商品' : type === 2  ?  '查看秒杀服务' : '查看秒杀养护卡'")
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 开始时间
            .field-content(v-text="start_time")
          .field.is-horizontal
            label.label 结束时间
            .field-content(v-text="end_time")
          .field.is-horizontal
            label.label 限购数量
            .field-content(v-text="limit_number + '件/人'")
        .field-group(v-if="type - 0 === 3")
        .field-group(v-if="type - 0 === 1")
          .field.is-horizontal
            label.label 商品名称
            .field-content(v-text="info.name")
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
        .field-group(v-if="type - 0 === 1")
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
              .sku-box(v-for="(sku, index) in sku_data")
                .sku-txt(v-text="sku.name")
                .sku-img.width-110.m-r-0
                  .upload-pic-default
                    img(:src='sku.pic')
                .sku-txt
                  .fl.m-r-20(:class="{'a-text': sku.content && sku.content.length > 0}",@click="toggleSidePannel(sku.content)",v-text="sku.content && sku.content.length > 0 ? '查看':'暂无内容'")
                .sku-txt(v-text="'￥'+sku.sell_price")
                .sku-price.m-r-20.sku-txt(v-text="'￥'+sku.limit_price")
                .sku-price.sku-txt(v-text="sku.inventory_total + '件'")
                .sku-txt.width-200.p-l-60
                  .simple-td
                    .switch
                      input(type="checkbox", :id="'display' + index", v-model="sku.is_selected", disabled)
                      label(:for="'display' + index")
        .field-group(v-if="type - 0 === 2")
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
            .field-content(v-text="limit_price + '元'")
          .field.is-horizontal
            label.label 活动数量
            .field-content(v-text="inventory_total + '件'")
          .field.is-horizontal
            label.label 服务详情
            .control(v-if="item.content.length === 0") - -
            .control.image-wrapper(v-else, @click="toggleSidePannel(item.content)")
              img.img-detail(v-for="(cell, index) in item.content",:src="item.content[index]")
      .btn-wrapper
        .button-group
          a.button.primary.large(v-if="status", @click="changeStatus") 立即结束
          a.button.large(v-if="!status", @click="deleteItem") 删除
          a.button.large(@click="goBack") 返回
</template>

<script>
import productServiceMixin from '@/mixins/modules/productService'
import OpenImage from '@/components/generics/OpenImage'
import SlideOutModal from '@/components/generics/SlideOutModal'
import ImageDetail from '@/components/productService/ImageDetail'
import spikeApi from '@/mixins/modules/Spike'
import FormateDate from '@/mixins/utilities/formateDate'
export default {
  name: 'spikeServeAdd',
  mixins: [productServiceMixin, spikeApi, FormateDate],
  components: {
    OpenImage,
    ImageDetail,
    SlideOutModal,
  },
  data () {
    return {
      slide_visible: false, // 左边弹框
      start_time: '', // 开始时间
      end_time: '', // 结束时间
      limit_price: '', // 秒杀价格
      limit_number: '', // 限制数量
      inventory_total: '', // 活动数量
      type: '', // 判断是商品还是服务
      id: '',
      current_array: [],
      item: {
        product_name: '', // 服务库名称
        name: '', // 名称
        category: null, // 分类
        mini_price: '', // 服务价格
        desc: '', // 服务简述
        pic: '', // 服务图示
        content: [], // 特色服务
      },
      info: { // 商品
        name: '',
        product_id: '',
        product_name: '',
        brand_name: '',
        category_id: '',
        product_pics: [], // 主图
        attribute_data: [],
      },
      sku_data: [],
      status: true,
    }
  },
  methods: {
    // 秒杀删除
    async deleteItem () {
      this.$store.dispatch('showMessage', {
        type: 'warning',
        title: '确认',
        content: '确认要删除该秒杀活动？',
        isRejectable: 1,
        resolve: () => {
          this.deleteItemFun()
        },
      })
    },
    async deleteItemFun () {
      try {
        const {response, result} = await this.seckillDeleteApi({id: this.id})
        if (response.status === 200 && result.code === 0) {
          this.$router.replace({
            name: 'spikeList',
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '秒杀活动删除失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '秒杀活动删除失败',
          content: `错误: ${err}`,
        })
      }
    },
    /*
    * 停止开启秒杀商品
    * */
    changeStatus () {
      let _this = this
      this.$store.dispatch('showMessage', {
        title: `确认${_this.status ? '结束' : '开始'}吗？`,
        isRejectable: 1,
        resolve: () => {
          if (_this.status) {
            this.changeApi()
          } else {
            this.$router.push({
              name: _this.type === 1 ? 'spikeGoodEdit' : 'spikeServeEdit',
              query: {
                id: _this.id,
              },
            })
          }
        },
      })
    },
    // 秒杀开启关闭接口
    async changeApi () {
      let enable = 2
      try {
        const { response, result } = await this.statusChangeApi({
          id: this.id,
          enable: 2,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            if (result.message === 'success') {
              this.$store.dispatch('showMessage', {
                type: 'success',
                title: `${parseInt(enable) === 1 ? '开启' : '结束'}成功`,
                autoClose: true,
              })
              await this.getData()
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: `${parseInt(enable) === 1 ? '开启' : '结束'}失败`,
              })
              return false
            }
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: `${parseInt(enable) === 1 ? '开启' : '结束'}失败`,
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: `${parseInt(enable) === 1 ? '开启' : '结束'}失败`,
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 返回操作
    goBack () {
      this.$router.push({
        name: 'spikeList',
        query: {
          save: 1,
        },
      })
    },
    // 获取服务详情
    async getData () {
      try {
        const { response, result } = await this.spikeDetailApi({
          id: this.id,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.limit_number = result.data.product.limit_number
            this.start_time = this.formateDate(result.data.start_time, true, 2)
            this.end_time = this.formateDate(result.data.end_time, true, 2)
            if (this.type - 0 === 2) {
              result.data.product.sell_price = (result.data.product.sell_price / 100).toFixed(2)
              this.item = result.data.product
              this.limit_price = (result.data.product.sku[0].limit_price / 100).toFixed(2)
              this.inventory_total = result.data.product.sku[0].inventory_total + result.data.product.sku[0].sales_total
              this.current_array = result.data.product.content
            } else {
              let info = result.data.product
              info.product_pics = [info.pic]
              this.info = result.data.product
              let sku = result.data.product.sku
              sku.forEach(v => {
                v.is_selected = true
                if (v.enable === 2) {
                  v.is_selected = false
                }
                v.limit_price = (v.limit_price / 100).toFixed(2)
                v.sell_price = (v.sell_price / 100).toFixed(2)
                v.inventory_total = v.inventory_total + v.sales_total
              })
              this.sku_data = sku
            }
            if (result.data.status - 0 === 3) {
              this.status = false
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '秒杀详情获取失败',
              content: `出错啦！${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '秒杀详情获取失败',
            content: result.message,
          })
        }
      } catch (err) {
        console.error(err, '秒杀详情')
      }
    },
    // 查看服务详情
    toggleSidePannel (imgs) {
      this.slide_visible = !this.slide_visible
      this.current_array = imgs
    },
  },
  mounted () {
    this.id = this.$route.query.id - 0
    this.type = this.$route.query.spike_type - 0
    if (this.id) {
      this.getData() // 获取服务详情
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.img-detail
  width 60px
  height 60px
  border-radius 4px
.limit-num
  width 200px
.nav-back-btn
  position absolute
  top -36px
  left 16px
  width 32px
  height 32px
  border-radius 100%
  background #CED3DC center no-repeat url('~@/assets/back.svg')
  background-size 16px
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, 0.08)
  cursor pointer
  z-index 999
.field-content
  font-size 13px
  line-height 16px
  color #353535
.service-status
  padding-left 7px
  font-size 13px
  color darker
  margin-right 20px
.radio + .radio
  margin-left 28px
.cus_imgs
  display flex
  .img
    width 60px
    height 60px
    margin-right 5px
.sku-box
  display flex
  align-items center
  margin-top 20px
  .sku-txt
    width 110px
    font-size 12px
    color #888
    padding-right 20px
  .sku-img
    width 60px
    height 60px
    margin-right 20px
  .sku-price
    width 140px
.sku-img>.upload-pic
  width 60px !important
  height 60px !important
.upload-pic-default
  width 60px !important
  height 60px !important
  img
    width 100%
    height 100%
.picture-description
  font-size 12px
  line-height 16px
  color lightGrey
  white-space nowrap
  margin-top 8px
.rich-eidtor-description
  margin-bottom 8px
.contentcc
  width 100%
  .cc
    float left
    margin-bottom 10px
    margin-left 10px
    width auto
.gray
  color #666 !important
/* new */
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
.section-layout
  height calc(100% - 48px)
</style>

