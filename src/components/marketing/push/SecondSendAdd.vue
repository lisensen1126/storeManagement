<template lang="pug">
  .section-layout
    choose-product(v-model="show_product", v-if="show_product", @resolve="getProduct")
    choose-service(v-model="show_service", v-if="show_service", @resolve="getService")
    choose-card(v-model="show_card", v-if="show_card", @resolve="getCard")
    choose-platform-content(v-model="show_platform_content", v-if="show_platform_content", @resolve="getContent")
    choose-store-content(v-model="show_store_content", v-if="show_store_content", @resolve="getStoreContent")
    choose-group(v-model="show_group", v-if="show_group", @resolve="getGroup")
    send-case(v-model="show_case", v-if="show_case", :obj="template", :store="store_info")
    .content-wrapper
      .steps-box
        .step-item.step-is-active
          div.step-right
          span.no-icon 1
          span.text 发给谁
        .step-item.step-is-active
          div.step-right
          div.step-right-blue
          span.no-icon 2
          span.text 发什么
        .step-item
          div.step-right
          div.step-right-last
          span.no-icon 3
          span.text 完成创建
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 推送标题
            custom-input(v-model="title", 
              error-info="推送标题且小于等于20个字", 
              :validator="$v.title", 
              placeholder="请输入推送标题，仅后台可见"
              maxlength="20")
          .field.is-horizontal.custom-select
            label.label 推送模板
            custom-select(v-model="template", 
              :list="template_list",
              error-info="请选择模板", 
              :validator="$v.template",
              placeholder="请选择模板")
          //- 中间模板
          .wrapper-box(v-if="template")
            .left-box
              .top-warp
                .title {{template.name}}
                .blue(@click="showCase") 填写案例
              .form-item
                .label(v-text="template.id === 'AT0407' ? '活动名称' : template.id === 'AT2124' ? '保养提醒' : template.id === 'AT0911' ? '商品名称' : '温馨提示'") 
                textarea.textarea(v-model="content.first", maxLength="100")
              .form-item
                .label(v-text="template.id === 'AT0407' ? '活动日期' : template.id === 'AT2124' ? '保养项目' : template.id === 'AT0911' ? '商品价格' : '服务地址'")
                textarea.textarea(v-model="content.second", maxLength="100")
              .form-item(v-if="template.id !== 'AT0871'")
                .label(v-text="template.id === 'AT0407' ? '打卡主题' : template.id === 'AT2124' ? '门店名称' : '拼团价格'")
                textarea.textarea(v-model="content.third", maxLength="100")
              .form-item(v-if="template.id !== 'AT0871' && template.id !== 'AT0407'")
                .label(v-text="template.id === 'AT0407' ? '温馨提示' : template.id === 'AT2124' ? '门店地址' : '拼团人数'")
                textarea.textarea(v-model="content.fourth", maxLength="100")
              .form-item(v-if="template.id === 'AT0911'")
                .label 拼团结束时间
                textarea.textarea(v-model="content.fifth", maxLength="100")
              //- .form-item(v-if="template.id === 'AT0911'")
              //-   .label 温馨提示
              //-   textarea.textarea(v-model="content.sixth", maxLength="100")
            .right-box
              .top-warp
                .title 模板预览
              .store-info
                .info(v-if="store_info")
                  img.store-img(:src="store_info.image")
                  .store-name {{store_info.name}}
                .dot
                  .dot-item
                  .dot-item
                  .dot-item
              .content
                .title {{template.name}}
                .form-item
                  .label(v-text="template.id === 'AT0407' ? '活动名称' : template.id === 'AT2124' ? '保养提醒' : template.id === 'AT0911' ? '商品名称' : '温馨提示'") 
                  .value(v-text="content.first")
                .form-item
                  .label(v-text="template.id === 'AT0407' ? '活动日期' : template.id === 'AT2124' ? '保养项目' : template.id === 'AT0911' ? '商品价格' : '服务地址'")
                  .value(v-text="content.second")
                .form-item(v-if="template.id !== 'AT0871'")
                  .label(v-text="template.id === 'AT0407' ? '打卡主题' : template.id === 'AT2124' ? '门店名称' : '拼团价格'")
                  .value(v-text="content.third")
                .form-item(v-if="template.id !== 'AT0871' && template.id !== 'AT0407'")
                  .label(v-text="template.id === 'AT0407' ? '温馨提示' : template.id === 'AT2124' ? '门店地址' : '拼团人数'")
                  .value(v-text="content.fourth")
                .form-item(v-if="template.id === 'AT0911'")
                  .label 拼团结束时间
                  .value(v-text="content.fifth")
                //- .form-item(v-if="template.id === 'AT0911'")
                //-   .label 温馨提示
                //-   .value(v-text="content.sixth")
              .f-item
                .item-name 进入小程序查看
                img.icon(src="https://oss1.chedianai.com/mange/arrow_right.png")
              .f-item  
                .item-name 拒收通知
                img.icon(src="https://oss1.chedianai.com/mange/arrow_right.png")
          //- 下方选择
          .field.is-horizontal.custom-select
            label.label 跳转页
            .choose-box
              .choose
                custom-select(v-model="jump", 
                  :list="jump_list", 
                  placeholder="请选择页面分类",
                  @input="getJump")
              .tip 这里设置小程序通知的跳转页面，若不选择，则该服务通知不会向用户展示跳转入口。
          .field.is-horizontal.custom-select
            label.label 温馨提示
            div
              div.tip 1、建议尽可能使用指定用户进行推送，实现精细化运营，缩小推送范围；
              div.tip 
                span 2、请遵守 
                span.blue(@click="goPage") 《微信小程序运营规范》
                span ，尽量减少违规内容，避免微信官方惩罚；
              div.tip 3、建议控制推送频率，尽量不要让一位用户在一天内收到多条推送。
      .btn-wrapper
        .button-group
          a.button.large(@click="goBack()") 上一步
          a.button.primary.large(@click="saveData") 发送
</template>

<script>
  import { wordLength } from '@/mixins/custom-validators/custom-validators'
  // 案例展示
  import SendCase from '@/components/marketing/modal/SendCase'
  // 门店内容
  import ChooseStoreContent from '@/components/basicInformation/modal/ChooseStoreContent'
  // 平台内容
  import ChoosePlatformContent from '@/components/basicInformation/modal/ChoosePlatformContent'
  // 拼团
  import ChooseGroup from '@/components/marketing/modal/ChooseGroupModal'
  // 养护卡
  import ChooseCard from '@/components/basicInformation/modal/ChooseCard'
  // 商品信息
  import ChooseProduct from '@/components/basicInformation/modal/ChooseProduct'
  // 服务信息
  import ChooseService from '@/components/basicInformation/modal/ChooseService'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import {required} from 'vuelidate/lib/validators'
  import {validationMixin} from 'vuelidate'
  import { mapGetters } from 'vuex'
  import Api from '@/mixins/modules/marketing'
  export default {
    name: 'secondSendAdd',
    mixins: [validationMixin, Api],
    components: {
      CustomSelect,
      CustomInput,
      ChooseStoreContent,
      ChoosePlatformContent,
      ChooseGroup,
      ChooseCard,
      ChooseProduct,
      ChooseService,
      SendCase,
    },
    watch: {
      // 监听模板选择
      'template' () {
        if (this.first_content) {
          this.first_content = false
        } else {
          this.content = {
            first: '',
            second: '',
            third: '',
            fourth: '',
            fifth: '',
            sixth: '',
          }
          this.jump = {
            name: '不选择',
            type: 0,
            id: ['AT0407', 'AT2124', 'AT0911', 'AT0871'],
          }
          this.value_content = null
        }
      },
      // 监听商品弹框选择
      'show_product' () {
        // 商品弹框直接点取消
        if (!this.show_product) {
          // 判断选择跳转页面之前是否有跳转内容 有的话重置不选择
          if (this.value_content === null) {
            this.jump = this.jump_list[0]
          } else {
            this.first_enter = true
            this.jump = this.now_jump
          }
        }
      },
      // 监听服务弹框选择
      'show_service' () {
        // 服务弹框直接点取消
        if (!this.show_service) {
          // 判断选择跳转页面之前是否有跳转内容 有的话重置不选择
          if (this.value_content === null) {
            this.jump = this.jump_list[0]
          } else {
            this.first_enter = true
            this.jump = this.now_jump
          }
        }
      },
      // 监听平台内容弹框选择
      'show_platform_content' () {
        // 平台内容弹框直接点取消
        if (!this.show_platform_content) {
          // 判断选择跳转页面之前是否有跳转内容 有的话重置不选择
          if (this.value_content === null) {
            this.jump = this.jump_list[0]
          } else {
            this.first_enter = true
            this.jump = this.now_jump
          }
        }
      },
      // 监听门店内容弹框选择
      'show_store_content' () {
        // 门店内容弹框直接点取消
        if (!this.show_store_content) {
          // 判断选择跳转页面之前是否有跳转内容 有的话重置不选择
          if (this.value_content === null) {
            this.jump = this.jump_list[0]
          } else {
            this.first_enter = true
            this.jump = this.now_jump
          }
        }
      },
      // 监听养护卡弹框选择
      'show_card' () {
        // 养护卡内容弹框直接点取消
        if (!this.show_card) {
          // 判断选择跳转页面之前是否有跳转内容 有的话重置不选择
          if (this.value_content === null) {
            this.jump = this.jump_list[0]
          } else {
            this.first_enter = true
            this.jump = this.now_jump
          }
        }
      },
      // 监听拼团弹框选择
      'show_group' () {
        if (!this.show_group) {
          // 判断选择跳转页面之前是否有跳转内容 有的话重置不选择
          if (this.value_content === null) {
            this.jump = this.jump_list[0]
          } else {
            this.first_enter = true
            this.jump = this.now_jump
          }
        }
      },
    },
    computed: {
      ...mapGetters({
        currentStore: 'currentStore',
      }),
      jump_list () {
        let list = [
          {
            name: '不选择',
            type: 0,
            id: ['AT0407', 'AT2124', 'AT0911', 'AT0871'],
          },
          {
            name: '商品信息',
            type: 1,
            id: ['AT0407', 'AT2124'],
          },
          {
            name: '服务信息',
            type: 2,
            id: ['AT0407', 'AT2124'],
          },
          {
            name: '平台内容',
            type: 3,
            id: ['AT0407'],
          },
          {
            name: '门店内容',
            type: 4,
            id: ['AT0407'],
          },
          {
            name: '养护卡',
            type: 5,
            id: ['AT0407', 'AT2124'],
          },
          {
            name: '拼团',
            type: 6,
            id: ['AT0407', 'AT0911', 'AT2124'],
          },
          {
            name: '车辆信息完善',
            type: 7,
            id: ['AT0407', 'AT0871'],
          },
          {
            name: '优惠券列表',
            type: 8,
            id: ['AT0407', 'AT2124'],
          },
        ]
        return list.filter(item => {
          return item.id.indexOf(this.template.id) >= 0
        })
      },
    },
    data () {
      return {
        step_num: 1,
        store_info: null, // 小程序的信息
        now_jump: null,
        content: {
          first: '',
          second: '',
          third: '',
          fourth: '',
          fifth: '',
          sixth: '',
        },
        show_case: false,      // 控制展示案例的显隐
        show_card: false,      // 控制养护卡显隐
        show_product: false,    // 控制商品显隐
        show_service: false,    // 控制服务显隐
        show_platform_content: false,     // 控制平台内容显隐
        show_store_content: false, // 控制门店内容的显隐
        show_group: false, // 控制拼团的显隐
        title: '', // 推送标题
        template: {
          id: 'AT0407',
          name: '打卡提醒',
        }, // 模板
        // 模板列表
        template_list: [{
          id: 'AT0407',
          name: '打卡提醒',
        }, {
          id: 'AT2124',
          name: '保养到期提醒',
        }, {
          id: 'AT0911',
          name: '拼团待成团提醒',
        }, {
          id: 'AT0871',
          name: '信息完善通知',
        }],
        // jump_list: [],
        jump: null,
        value_content: null, // 跳转的内容
        first_enter: false, // 第一次进入
        first_content: false,
      }
    },
    validations: {
      title: {
        required,
        validate (val) {
          return wordLength(val) <= 20
        },
      },
      template: {
        required,
      },
    },
    methods: {
      // select 成功回调
      getJump (val) {
        // 0 不选择 1 选择商品 2 服务 3平台内容 4 门店内容 5 养护卡 6 拼团 7 添加车辆 8 领券中心
        switch (this.jump.type) {
          case 0:
            this.value_content = null
            break
          case 1:
            this.show_product = true
            break
          case 2:
            this.show_service = true
            break
          case 3:
            this.show_platform_content = true
            break
          case 4:
            this.show_store_content = true
            break
          case 5:
            this.show_card = true
            break
          case 6:
            this.show_group = true
            break
          case 7:
            this.value_content = {url: 'pages/vehicle/vehicleAdd/vehicleAdd?is_server=1&is_first=2'}
            break
          case 8:
            this.value_content = {url: 'pages/coupon/voucher/voucher'}
            break
        }
      },
      // 保存
      saveData () {
        this.$v.$touch()
        if (this.$v.$error) {
          document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
          return false
        }
        let content = []
        let obj = this.content
        Object.keys(obj).forEach(key => {
          if (obj[key]) {
            content.push(obj[key])
          }
        })
        // 判断信息是否填写完整
        if ((this.template.id === 'AT2124' && content.length !== 4) || (this.template.id === 'AT0407' && content.length !== 3) || (this.template.id === 'AT0871' && content.length !== 2) || (this.template.id === 'AT0911' && content.length !== 5)) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '请填写全模板信息',
          })
          return false
        }
        // 用户手机号
        let phones = JSON.parse(sessionStorage.getItem('PHONE_LIST'))
        let mobiles = []
        if (phones.length > 0) {
          phones.forEach(item => {
            mobiles.push(item.mobile)
          })
        }
        let params = {
          send_type: 1,
          title: this.title,
          library_id: this.template.id,
          template_name: this.template.name,
          value_type: this.jump ? this.jump.type : 0,
          value_content: this.value_content || '',
          range: sessionStorage.getItem('EFFECYIVE_TYPE') - 0,
          mobiles,
          content,
        }
        this.$store.dispatch('showMessage', {
          title: '信息提示',
          content: '点击确认后用户将直接收到此模板消息，且不可撤回，请确认是否要发送',
          isRejectable: 1,
          resolve: () => {
            this.sendMessage(params)
          },
        })
      },
      /**
       * 发送模板消息
       * params
       */
      async sendMessage (params) {
        try {
          const {response, result} = await this.addPushApi(params)
          if (response.status === 200 && result.code === 0) {
            sessionStorage.setItem('PHONE_LIST', '')
            sessionStorage.setItem('EFFECYIVE_TYPE', '')
            sessionStorage.setItem('push-second', '')
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '推送成功',
              resolve: () => {
                this.$router.replace({
                  name: 'sendResult',
                })
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '添加推送失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.err(err, '添加推送失败')
        }
      },
      // 返回上一步
      goBack () {
        let obj = {
          content: this.content,
          template_id: this.template.id,
          title: this.title,
          value_content: this.value_content,
          type: this.jump ? this.jump.type : null,
        }
        sessionStorage.setItem('push-second', JSON.stringify(obj))
        // this.$router.replace({
        //   name: 'firstSendAdd',
        //   query: {
        //     id: this.$route.query.id,
        //   },
        // })
        this.$router.go(-1)
      },
      // 展示案例
      showCase () {
        this.show_case = true
      },
      // 去小程序页面
      goPage () {
        window.open('https://developers.weixin.qq.com/miniprogram/product/#_6-%E4%BF%A1%E6%81%AF%E5%86%85%E5%AE%B9%E8%A7%84%E8%8C%83')
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
        this.now_jump = JSON.parse(JSON.stringify(this.jump))
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
        this.now_jump = JSON.parse(JSON.stringify(this.jump))
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
        this.now_jump = JSON.parse(JSON.stringify(this.jump))
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
        this.now_jump = JSON.parse(JSON.stringify(this.jump))
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
        this.now_jump = JSON.parse(JSON.stringify(this.jump))
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
        this.now_jump = JSON.parse(JSON.stringify(this.jump))
      },
      // 获取门店信息 getStoreInfoApi
      async getStoreInfo () {
        try {
          const {response, result} = await this.getStoreInfoApi()
          if (response.status === 200 && result.code === 0) {
            this.store_info = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取门店信息失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.err(err, '获取门店信息失败')
        }
      },
    },
    mounted () {
      this.getStoreInfo()
      let obj = sessionStorage.getItem('push-second')
      // 判断第二步是否有缓存
      if (obj) {
        // 判断是否第一次进入
        this.first_enter = true
        this.first_content = true
        obj = JSON.parse(obj)
        // 获取模板
        this.template_list.forEach(item => {
          if (item.id === obj.template_id) {
            this.template = item
          }
        })
        // 标题
        this.title = obj.title
        // 跳转参数
        this.value_content = obj.value_content
        // 跳转页面
        this.jump_list.forEach(item => {
          if (item.type === obj.type - 0) {
            this.jump = item
            this.now_jump = item
          }
        })
        // 模板内容
        this.content = obj.content
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
  .form-wrapper
    border-top 0
  .steps-box
    width 100%
    height 50px
    display flex
    justify-content start
    background #d3d3d3
    .step-item
      width 33.3%
      line-height 50px
      height 50px
      color white
      margin-right 30px
      font-size 16px
      box-sizing border-box
      padding-left 30px
      position relative
      .no-icon
        float: left
        width 20px
        height 20px
        border 1px solid white
        border-radius 20px
        line-height 20px
        text-align center
        margin 16px 6px 0 0
      .text
        float: left
    .step-is-active
      background #2fabdd
    .step-item:after
      content: ""
      border-top 25px solid transparent
      border-bottom 25px solid transparent
      border-left 25px solid #d3d3d3
      position absolute
      top 0
      right -25px
      z-index 9
    .step-is-active:after
      border-left 25px solid #2fabdd
    .step-right-blue
      width: 30px
      height: 50px
      position: absolute
      background: #2fabdd
      top: 0
      left: -29px
    .step-right
      border-top 25px solid transparent
      border-bottom 25px solid transparent
      border-left 25px solid white
      position absolute
      top 0
      right -25px
      z-index 8
    .step-right-last
      width: 29px
      height: 50px
      position: absolute
      background: white
      top: 0
      right: -30px
  .choose-box
    width 800px
    padding 20px 20px 8px 10px
    border 1px solid #f3f3f3
    .choose
      width 200px
    .tip
      width 650px
      font-size 12px
      margin-top 8px
  .field
    .label
      margin-top 0 !important
  .wrapper-box
    display flex
    justify-content start
    box-sizing border-box
    padding 20px 0
    width 100%
    padding-left 121px
    .right-box
      width 400px
      background #f3f3f3
      padding 20px
      font-size 12px
      .f-item
        background white
        margin-top 1px
        display flex
        justify-content space-between
        box-sizing border-box
        padding 0 10px
        color black
        font-size 12px
        line-height 35px
        .icon
          margin-top 11px
          width 8px
          height 13px
      .content
        background white
        margin-top 1px
        padding 5px
        .title
          font-size 16px
          color black
          line-height 30px
          font-weight 500
          margin-bottom 10px
        .form-item
          display flex
          justify-content start
          margin-bottom 15px
          .label
            width 110px
            color gray
            font-size 14px
            box-sizing border-box
            padding-left 4px
          .value
            width 240px
            color black
            font-size 12px
            line-height 16px
            box-sizing border-box
            padding-right 20px
            white-space normal
            word-break break-word
            word-wrap break-word
            white-space pre-wrap
      .top-warp
        display flex
        justify-content space-between
        margin-bottom 20px
        .title
          font-size 16px
          color black
      .store-info
        display flex
        justify-content space-between
        background white
        box-sizing border-box
        padding 10px
        .info
          display flex
          justify-content start
          .store-img
            width 30px
            height 30px
            border-radius 30px
            margin-right 10px
          .store-name
            font-size 14px
            color black
            line-height 30px
        .dot
          .dot-item
            width 3px
            height 3px
            border-radius 3px
            background gray
            margin-top 5px
    .left-box
      width 400px
      box-sizing border-box
      padding 20px
      font-size 12px
      color gray
      border 1px solid #f3f3f3
      .top-warp
        display flex
        justify-content space-between
        margin-bottom 20px
        .title
          font-size 16px
          color black
      .form-item
        display flex
        justify-content space-between
        margin-bottom 20px
        .label
          line-height 60px
        .textarea
          width 270px
          height 60px
  .tip
    width 450px
    color gray
    font-size 12px
    margin-bottom 5px
  .blue
    color #2fabdd
    cursor pointer
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
