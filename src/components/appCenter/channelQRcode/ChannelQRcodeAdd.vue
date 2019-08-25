<template lang="pug">
  //- 渠道二维码列表 - 新增页面
  .section-layout
    choose-product(v-model="show_product", v-if="show_product", @resolve="getProduct")
    choose-service(v-model="show_service", v-if="show_service", @resolve="getService")
    choose-card(v-model="show_card", v-if="show_card", @resolve="getCard")
    choose-platform-content(v-model="show_platform_content", v-if="show_platform_content", @resolve="getContent")
    choose-store-content(v-model="show_store_content", v-if="show_store_content", @resolve="getStoreContent")
    choose-group(v-model="show_group", v-if="show_group", @resolve="getGroup")
    choose-spike(v-model="show_spike", v-if="show_spike", @resolve="getSpike")
    //- send-case(v-model="show_case", v-if="show_case", :obj="template", :store="store_info")
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2(v-if="isEdit") 内容编辑
      h2(v-if="!isEdit") 新建
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 名称
            custom-input(v-model="info.name", maxlength=30, placeholder="请输入二维码名称", :validator="$v.info.title", error-info="名称不能为空")
          .field.is-horizontal
            label.label 分类
            custom-select(v-model="info.type", :list="type_list", nameField="name", :validator="$v.info.type", error-info="分类必选")
          .field.is-horizontal
            label.label 跳转页面
            custom-input.jumpInput(v-model = "selected_jump")
            custom-select.jumpSelect(v-model="info.jump", :list="jump_list", nameField="name", :validator="$v.info.jump", error-info="跳转页面必选" @input="getJump")
          .field.is-horizontal
            label.label 门店参数
            custom-select(v-model="info.store", :list="stores_list", nameField="store_name"  :validator="$v.info.store", error-info="门店参数必选")
          .field.is-horizontal
            label.label 员工参数
            custom-select(v-model="info.employee", :list="employee_list",nameField="memUsername" :show-search="true"  :validator="$v.info.employee", error-info="员工参数必选")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="saveData") 保存
          a.button.primary.large(@click="goBack") 取消
</template>

<script>
import Api from '@/mixins/modules/Content'
import upLoadApi from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import UploadPic from '@/components/generics/form/UploadPic'
import RichEditor from '@/components/generics/form/RichEditor'
// import UEditor from '@/components/generics/form/UEditor'
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import Utils from '@/mixins/utilities/utils'
import ChooseGoods from '@/components/content/modal/ChooseGoods'
import ChooseMaintenance from '@/components/content/modal/ChooseMaintenance'
import { mapGetters } from 'vuex'
// 获取员工列表
import employee from '@/mixins/modules/employee'
// 商品信息
import ChooseProduct from '@/components/basicInformation/modal/ChooseProduct'
// 服务信息
import ChooseService from '@/components/basicInformation/modal/ChooseService'
  // 养护卡
import ChooseCard from '@/components/basicInformation/modal/ChooseCard'
// 平台内容
import ChoosePlatformContent from '@/components/basicInformation/modal/ChoosePlatformContent'
// 门店内容
import ChooseStoreContent from '@/components/basicInformation/modal/ChooseStoreContent'
  // 拼团
import ChooseGroup from '@/components/marketing/modal/ChooseGroupModal'
  // 秒杀
import ChooseSpike from '@/components/marketing/modal/ChooseSpikeModal'
/**
 * @vue
 */
export default {
  name: 'ChannelQRcodeEdit',
  mixins: [validationMixin, Api, upLoadApi, Utils, employee],
  components: {
    CustomInput,
    CustomSelect,
    UploadPic,
    RichEditor,
    ChooseGoods,
    ChooseMaintenance,
    ChooseStoreContent,
    ChoosePlatformContent,
    ChooseGroup,
    ChooseCard,
    ChooseProduct,
    ChooseService,
    ChooseSpike,
    // UEditor,
  },
  data () {
    return {
      info: {
        id: '',
        jump: {
          name: '请选择跳转页面',
          type: '',
        },
        type: {}, // 选择的二维码分类 1线上渠道 2线下渠道
        store: {},  // 选择的门店
        employee: {}, // 选择的员工对象
        name: '',
        path: '', // 跳转的页面名字
        scenes: '', // 扫描二维码带的参数
      },
      scenes: {}, // 二维码参数的辅助说明
      isEdit: true,
      type_list: [
        {
          id: 1,
          name: '线上渠道',
        },
        {
          id: 2,
          name: '线下渠道',
        },
      ],
      show_case: false,      // 控制展示案例的显隐
      show_card: false,      // 控制养护卡显隐
      show_product: false,    // 控制商品显隐
      show_service: false,    // 控制服务显隐
      show_platform_content: false,     // 控制平台内容显隐
      show_store_content: false, // 控制门店内容的显隐
      show_group: false, // 控制拼团的显隐
      show_spike: false, // 控制秒杀的显隐
      now_jump: null,
      value_content: null, // 跳转的内容
      selected_jump: '', // 已选择的内容显示在左侧select框
      employee_list: [],
    }
  },
  watch: {
    // 'info.store_id': function (val) {
    //   console.log(val)
    // },
  },
  computed: {
    ...mapGetters({
      current_store: 'currentStore',
      stores_list: 'stores',
    }),
    jump_list () {
      let list = [
        {
          name: '首页',
          type: 0,
        },
        {
          name: '商品信息',
          type: 1,
        },
        {
          name: '服务信息',
          type: 2,
        },
        {
          name: '平台内容',
          type: 3,
        },
        {
          name: '门店内容',
          type: 4,
        },
        {
          name: '养护卡',
          type: 5,
        },
        {
          name: '拼团',
          type: 6,
        },
        {
          name: '秒杀',
          type: 7,
        },
        {
          name: '车辆信息完善',
          type: 8,
        },
        {
          name: '优惠券列表',
          type: 9,
        },
      ]
      return list
      // return list.filter(item => {
      //   return item.id.indexOf(this.template.id) >= 0
      // })
    },
  },
  methods: {
    // 选择跳转页面回调
    getJump (val) {
      // 0 不选择 1 选择商品 2 服务 3平台内容 4 门店内容 5 养护卡 6 拼团 7 添加车辆 8 领券中心
      switch (this.info.jump.type) {
        case 0:
          this.value_content = null
          this.selected_jump = '首页'
          this.value_content = {url: 'pages/index/index'}
          console.log('跳转页面', this.value_content.url)
          break
        case 1:
          // 显示商品弹框
          this.show_product = true
          break
        case 2:
          // 显示服务弹框
          this.show_service = true
          break
        case 3:
          // 显示平台内容弹框
          this.show_platform_content = true
          break
        case 4:
          // 显示门店内容弹框
          this.show_store_content = true
          break
        case 5:
          // 显示养护卡弹框
          this.show_card = true
          break
        case 6:
          // 显示拼团弹框
          this.show_group = true
          break
        case 7:
          // 显示秒杀弹框
          this.show_spike = true
          break
        case 8:
          // 车辆信息完善
          this.selected_jump = '车辆信息完善'
          this.value_content = {url: 'pages/vehicle/vehicleAdd/vehicleAdd?is_server=1&is_first=2'}
          console.log('跳转页面', this.value_content.url)
          break
        case 9:
          // 优惠券列表
          this.selected_jump = '优惠券列表'
          this.value_content = {url: 'pages/coupon/voucher/voucher'}
          console.log('跳转页面', this.value_content.url)
          break
      }
    },
    /**
       * 选择商品弹框的回调处理
       * @param {Object} 已选商品的数据
       */
    getProduct (params) {
      let arr = {
        spu_id: params.product_id,
        sku_id: params.mini_price_sku,
      }
      let url = 'pages/mall/goodsDetail/goodsDetail?spu_id=' + arr.spu_id + '&sku_id=' + arr.sku_id
      arr.url = url
      this.value_content = arr
      this.selected_jump = params.name
      console.log('跳转页面', this.value_content.url)
      // this.now_jump = JSON.parse(JSON.stringify(this.jump))
    },
    /**
       * 选择服务弹框的回调处理
       * @param {Object} 已选服务的数据
       */
    getService (params) {
      let arr = {
        spu_id: params.basic_spu_id,
      }
      let url = 'pages/mall/serviceDetail/serviceDetail?spu_id=' + params.basic_spu_id
      arr.url = url
      this.value_content = arr
      this.selected_jump = params.name
      console.log('跳转页面', this.value_content.url)
      // this.now_jump = JSON.parse(JSON.stringify(this.jump))
    },
    /**
       * 选择养护卡弹框的回调处理
       * @param {Object} 已选养护卡的数据
       */
    getCard (params) {
      let arr = {
        id: params.id,
        url: 'pages/card/purchaseDetails/purchaseDetails?card_id=' + params.id,
      }
      this.value_content = arr
      this.selected_jump = params.name
      console.log('跳转页面', this.value_content.url)
      // this.now_jump = JSON.parse(JSON.stringify(this.jump))
    },
    /**
       * 选择拼团弹框的回调处理
       * @param {Object} 已选养拼团的数据
       */
    getGroup (params) {
      let arr = {
        id: params.id,
        spu_id: params.basic_spu_id,
        sku_id: params.mini_price_sku || 0,
      }
      let url = ''
      // 商品
      if (params.type === 1) {
        url = 'pages/spilkeGroup/groupGoodsDetail/groupGoodsDetail?spu_id=' + arr.spu_id + '&sku_id=' + arr.sku_id + '&share=1&group_product_id=' + arr.id
      }
      // 服务
      if (params.type === 2) {
        url = 'pages/spilkeGroup/groupServiceDetail/groupServiceDetail?spu_id=' + arr.spu_id + '&group_product_id= ' + arr.id + '&share=1'
      }
      // 养护卡
      if (params.type > 2) {
        url = 'pages/spilkeGroup/groupPurchaseDetail/groupPurchaseDetail?card_id=' + arr.spu_id + '&group_product_id=' + arr.id + '&share=1'
      }
      arr.url = url
      this.value_content = arr
      this.selected_jump = params.id
      console.log('跳转页面', this.value_content.url)
      // this.now_jump = JSON.parse(JSON.stringify(this.jump))
    },
    getSpike (params) {
      let arr = {
        id: params.product.id,
        spu_id: params.product.basic_spu_id,
        sku_id: params.product.mini_price_sku || 0,
      }
      let url = ''
      // 商品
      if (params.product.type === 1) {
        this.info.path = 'pages/spilkeGroup/timeLimitGoodsDetail/timeLimitGoodsDetail'
        this.info.scenes = '16,0'
        this.scenes = {
          from_type: 16,
          from_id: 0,
        }
        url = 'pages/spilkeGroup/timeLimitGoodsDetail/timeLimitGoodsDetail?seckill_id=' + params.product.seckill_id + 'spu_id=' + arr.spu_id + '&sku_id=' + arr.sku_id
      }
      // 服务
      if (params.product.type === 2) {
        url = 'pages/spilkeGroup/timeLimitServiceDetail/timeLimitServiceDetail?seckill_id=' + params.product.seckill_id + 'spu_id=' + arr.spu_id
      }
      // 养护卡
      if (params.product.type > 2) {
        url = 'pages/spilkeGroup/timeLimitPurchaseDetail/timeLimitPurchaseDetail?card_id=' + arr.spu_id + 'seckill_id=' + params.product.seckill_id
      }
      arr.url = url
      this.value_content = arr
      this.selected_jump = params.id
      console.log('跳转页面', this.value_content.url)
      // this.now_jump = JSON.parse(JSON.stringify(this.jump))
    },
    /**
       * 选择门店内容弹框的回调处理
       * @param {Object} 已选内容的数据
       */
    getStoreContent (params) {
      let arr = {
        id: params.id,
        url: 'pages/article/article?content_type=2&id=' + params.id,
      }
      this.value_content = arr
      this.selected_jump = params.title
      console.log('跳转页面', this.value_content.url)
      // this.now_jump = JSON.parse(JSON.stringify(this.jump))
    },
    /**
       * 选择平台内容弹框的回调处理
       * @param {Object} 已选内容的数据
       */
    getContent (params) {
      let arr = {
        id: params.id,
        url: 'pages/article/article?content_type=1&id=' + params.id,
      }
      this.value_content = arr
      // this.now_jump = JSON.parse(JSON.stringify(this.jump))
      this.selected_jump = params.title
      console.log('跳转页面', this.value_content.url)
    },
    // 获取门店列表

    // 获取员工列表
    // 获取列表数据
    async fetchEmployeeListData () {
      var self = this
      try {
        const {response, result} = await this.getEmployeeList({
          pageNum: 1,
          pageSize: 999,
          // 此处下拉框包含搜索框选项，需显示所有的员工
        })
        if ((result && result.code === 0) || ((!result || result.code === undefined || result.code === 0) && response && response.status === 200)) {
          self.employee_list = result.list
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取员工列表失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取员工列表失败',
          content: `服务异常，请稍后再试 ${err}`,
        })
      }
    },
    // 返回
    goBack () {
      this.$router.push({
        name: 'channelQRcode',
        query: {
          save: 1,
        },
      })
    },
    // 获取详情
    async getInfo () {
      try {
        const {response, result} = await this.ContentDetailApi({
          id: this.id,
        })
        if (response.status === 200) {
          this.info = result.data
          this.brand = {
            brand_id: result.data.brand_id,
            brand_name: result.data.brand_name,
          }
          this.info.product.forEach(item => {
            if (item.remark === null) item.remark = ''
          })
          this.info.product = [...result.data.product]
          this.$refs.editor.info(result.data.content)
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取详情出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌列表失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 验证二维码名称不能重复，需要获取所有二维码的名称
    async validateData () {
      let self = this
      let pass = true
      if (!self.info.title) {
        self.$store.dispatch('showMessage', {
          type: 'failure',
          title: ' 分类不能为空',
        })
        pass = false
        return pass
      }
      return pass
    },
    // 保存数据
    async saveData () {
      let self = this
      self.$v.$touch()
      if (self.$v.$error) return

      // 验证数据
      // let res = this.validateData()
      // if (!res) {
      //   return false
      // }
      try {
        let params = {
          qr_code: {
            cid: self.info.type,
            name: self.info.name,
            path: self.info.path,
            scenes: self.info.scenes + `,${self.info.store.store_id},`,
            jump_type: self.info.jump.type,
            jump_name: self.info.jump.name,
          },
          scenes: self.info.scenes,
        }
        const {response, result} = await self.addChannelQRcodeApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '保存成功',
              resolve: () => {
                // 返回上一级
                this.$router.replace({
                  name: 'channelQRcodeList',
                })
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存内容出错',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存内容出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '保存内容出错',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
  },
  mounted () {
    this.id = this.$route.query.id
    if (this.$route.query.isAdd) {
      console.log('新建，清空数据')
    } else {
      console.log('需要拿id去取数据')
    }
    // this.getInfo()
    // 获取员工列表
    this.fetchEmployeeListData()
  },
  validations: {
    info: {
      name: {
        required,
      },
      type: {
        required,
      },
      jump: {
        type: {
          required,
        },
        required,
      },
      store: {
        required,
      },
      employee: {
        required,
      },
    },
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
label.label
  font-size 13px
.upload-pic
  width 88px
  height 88px
  margin-right 8px
.long-field
  width 750px !important
.goods-item
  border: 1px solid #c2c2c2
  padding 8px 10px
  border-radius 5px
  float left
  margin-right 15px
  display flex
  justify-content space-between
  align-items center
  width 300px
  margin-bottom 10px
  .img
    width 50px
    height 50px
    img
      width 100%
      height 100%
  .pro-name
    font-size 13px
    width 180px
    color #333
  .delete-btn
    cursor pointer
    font-size 13px
    color red
.jumpInput{
  margin-right:10px;
}
.jumpSelect{
  background: #ffbb29;
  width: 140px;
  /deep/ input{
    background: #ffbb29;
  }
}
</style>
