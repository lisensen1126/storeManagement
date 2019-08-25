<template lang="pug">
  .slide-layout
    .slide-title 卡片内容
      .form-wrapper(v-if="user_info.customer.name")
        h2.title-info 用户信息
        .field-group
          .field.is-horizontal
            label.label 昵称
            .field-content(v-text="user_info.customer.name ? user_info.customer.name : '--'")
          .field.is-horizontal
            label.label 手机号
            .field-content(v-text="user_info.customer.mobile ? user_info.customer.mobile : '--'")
          .field.is-horizontal
            label.label 车牌号
            .field-content(v-text="user_info.customer.license_plate ? user_info.customer.license_plate : '--'")
          .field.is-horizontal
            label.label 头像
            .field-content
              open-image(img-type="1",:img-url="user_info.customer.avatar && user_info.customer.avatar.length > 0 ? user_info.customer.avatar: '../../../assets/user-avatar.png'",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="5", border-radius="5")
      .form-wrapper(v-if="info.info")
        h2.title-info 基本信息
        .field-group
          .field.is-horizontal
            label.label 名称
            .field-content(v-if="info.info.name",v-text="info.info.name")
          .field.is-horizontal
            label.label 卡面
            .field-content
              open-image(img-type="1",:img-url="info.info.image_url ? info.info.image_url : ''",key-name="",mini-width="161",mini-height="100",margin-bottom="0", margin-right="5", border-radius="5")
          .field.is-horizontal
            label.label 分类
            .field-content(v-if="info.info.category_name",v-text="info.info.category_name")
          .field.is-horizontal(v-if="type === 1")
            label.label 使用次数
            .field-content(v-if="info.info",v-text="info.info.num + '次'")
          .field.is-horizontal
            label.label 销售价格
            .field-content(v-if="info.info.price") {{info.info.price / 100}}元
          .field.is-horizontal
            label.label 卡片原价
            .field-content {{info.info.origin_price / 100}}元
          .field.is-horizontal
            label.label 图文详情
            .field-content
              open-image(img-type="1",:img-url="info.info.content ? info.info.content : ''",key-name="",mini-width="161",mini-height="100",margin-bottom="0", margin-right="5", border-radius="5")
      .form-wrapper
        h2.title-info 使用须知
        .field-group
          .field.is-horizontal
            label.label 有效期
            .field-content(v-if="info.info && info.info.expiry",v-text="info.info.expiry+ '月'") 96月
          .field.is-horizontal(v-if="info.info && type === 1 && info.info.begin_time")
          .field.is-horizontal
            label.label 使用规则
            .field-content(v-if="info.info && info.info.description",v-html="info.info.description") 一段使用规则描述，描述的是使用规则的文本，支持换行
      .form-wrapper
        .field-group.is-horizontal
          a.button.primary(@click="showItem") 查看卡内项目
          a.button.primary(@click="showRecord") 查看使用记录
    card-project-modal(v-model="show_card_project" v-if="show_card_project", :id="id")
    card-record-modal(v-model="show_card_record" v-if="show_card_record", :id="user_info.upkeep_no")
</template>

<script>
  import imageScale from '@/mixins/utilities/imageScale'
  // import clientMixin from '@/mixins/modules/customer'
  import clientMixin from '@/mixins/modules/workbench'
  import OpenImage from '@/components/generics/OpenImage'
  import CardProjectModal from '@/components/customer/CardProjectModal'
  import CardRecordModal from '@/components/customer/CardRecordModal'

  export default {
    name: 'CardManagementDetail',
    mixins: [imageScale, clientMixin],
    components: {
      OpenImage,
      CardProjectModal,
      CardRecordModal,
    },
    props: {
      user_info: {
        type: Object,
        default: {
          customer: {
            name: '',
            mobile: '',
            license_plate: '',
            avatar: '',
          },
        },
      },
    },
    data () {
      return {
        id: null,
        info: {},
        img: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJGzHicI1Hunibia1NzKxs17bpb9uc1hgzZVPibHO1PRQSP25tX6gFpPULuibPicwiaZeZHaFETo6IIlH8FA/132?imageView2/1/w/36/h/36',
        show_card_project: false,
        show_card_record: false,
        type: 1,
      }
    },
    computed: {
    },
    methods: {
      // 获取养护卡详情
      async fetchDetail () {
        try {
          const { response, result } = await this.getCardManagementDetailTwoApi({
            id: this.id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.info = result.data
              this.type = result.data.info.type
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取养护卡详情失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡详情失败',
              content: `出错啦！${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡详情失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      showItem () {
        this.show_card_project = true
      },
      showRecord () {
        this.show_card_record = true
      },
    },
    mounted () {
      this.id = this.user_info.card_id
      this.fetchDetail()
    },
  }
</script>

<style lang="stylus" scoped>
.field-content
  font-size 14px
  color #666
.field.is-horizontal .label
  flex 0 0 50px
.title-info
  font-size 16px
.slide-layout .field
  margin-top 12px
.form-wrapper
  border-top 1px solid #ddd
  padding 8px 0
  .button
    margin-right 20px
    margin-top 15px
</style>

