<template lang="pug">
  .section-layout
    open-store-title(title="附近的小程序-门店详情", :isShowBack="true")
    .content-wrapper
      .form-wrapper(v-if="store_data.service_infos_json")
        .field-group
          .field.is-horizontal
            label.label 当前状态
            .field-content {{formatStatua(store_data.status)}}
            a.blue(href="http://kf.qq.com/faq/170401MbUnim17040122m2qY.html", target="_bank") 操作指引
          //- .field.is-horizontal
          //-   label.label 路径
          //-   //- .field-content pages/index/index
          //-   .field-content {{store_data.service_infos_json.service_infos[0].path}}
          .field.is-horizontal
            label.label 门店名称
            .field-content {{store_data.store_name}}
          .field.is-horizontal
            label.label 地理位置
            .field-content {{store_data.address}}
          .field.is-horizontal
            label.label 营业时间
            .field-content {{store_data.hour}}
          .field.is-horizontal
            label.label 客服电话
            .field-content {{store_data.contract_phone}}
          .field.is-horizontal
            label.label 地图标注
            .map-box
              .container(ref="container")
          .field.is-horizontal
            label.label 门店照片
            .img-box(v-for="(item, index) in store_data.pic_list_json.list")
              img(width="100%", height="100%", :src="item")
          .field.is-horizontal
            label.label 服务能力
            div
              .service-name(v-for="(item, index) in store_data.service_infos_json.service_infos", :key="index")
                span {{item.name}}
        .btn-wrapper
          .button-group
            a.button.large.isDisabled(@click="goBack") 返回
</template>

<script type="text/ecmascript-6">
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import Api from '@/mixins/modules/OpenStore'
import { mapGetters } from 'vuex'
export default {
  name: 'nearbyMiniProgramSotreDetail',
  mixins: [Api],
  components: {
    OpenStoreTitle,
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      wxStatus: 'wxStatus',
    }),
  },
  data () {
    return {
      poi_id: '',
      store_data: {},
    }
  },
  methods: {
    // 格式化状态
    formatStatua (type) {
      let text = ''
      if (type === 3) {
        text = '审核中'
      } else if (type === 4) {
        text = '审核失败'
      } else {
        text = '审核成功'
      }
      return text
    },
    // 返回
    goBack () {
      this.$router.go(-1)
    },
    // 初始化地图
    async initMap (latitude, longitude) {
      this.$nextTick(() => {
        let element = this.$refs.container
        // 创建地图，设置地图中心点
        // eslint-disable-next-line no-undef
        let center = new qq.maps.LatLng(latitude, longitude)
        // eslint-disable-next-line no-undef
        let map = new qq.maps.Map(element,
          {
            center: center,
            zoom: 15,
            draggable: false,
            scrollwheel: false,
            disableDoubleClickZoom: false,
            keyboardShortcuts: false,
            panControl: false,
            panControlOptions: false,
            zoomControl: false,
            scaleControl: false,
            mapTypeControl: false,
          }
        )
        // eslint-disable-next-line no-undef
        new qq.maps.Marker({
          // eslint-disable-next-line no-undef
          position: center,
          // 设置显示Marker的地图
          map,
        })
      })
    },
    // 获取门店详情
    async getStoreDetail () {
      try {
        let { response, result } = await this.getStoreDetailApi({ poi_id: this.poi_id })
        if (response.status === 200 && result.code === 0) {
          this.store_data = result.data
          this.initMap(this.store_data.latitude, this.store_data.longitude)
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店详情失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取门店详情失败',
          content: `错误: ${err}`,
        })
      }
    },
    // 更新step字段
    async updateUserInfo () {
      try {
        const { response, result } = await this.fetchUserInfoApi()
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('updateUser', result.data)
        }
        return { response, result }
      } catch (err) {
        throw err
      }
    },
  },
  mounted () {
    this.$store.dispatch('syncAuthorizeStatus')
    this.updateUserInfo()
    this.poi_id = this.$route.query.id
    this.getStoreDetail()
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/modules/creation-modal'
.section-layout
  height calc(100% - 56px)
  overflow-y auto
.content-wrapper
  margin-top 0
  height calc(100% - 106px)
  overflow-y auto
  background #fff
.form-wrapper
  border-bottom 0
.field-content
  font-size 13px
  line-height 16px
  color #353535
.img-box
  margin-right 12px
  width 88px
  height 88px
.container
  width 800px
  height 300px
.blue
  margin-left 24px
  font-size 13px
  color #0000FF
.service-name
  margin-bottom 12px 
  padding 0 15px
  width 300px
  height 40px
  line-height 40px
  font-size 13px
  text-align left
  border 1px solid #ddd
  border-radius 3px
</style>
