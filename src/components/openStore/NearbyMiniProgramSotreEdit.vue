<template lang="pug">
  .section-layout
    .content-wrapper
      open-store-title(title="附近的小程序-修改门店", :isShowBack="true")
      <!-- 基本信息 -->
      .form-wrapper(v-if="store_data.service_infos_json")
        .field-group
          .field.is-horizontal
            label.label-title 基本信息
          .field.is-horizontal
            label.label 地理位置
            .field-content {{store_data.address}}
          .field.is-horizontal
            label.label 地图标注
            .map-box
              .container(ref="container")
          .field.is-horizontal
            label.label 门店名称
            .field-content.store-name {{store_data.store_name}}
          .field.is-horizontal.w-all
            label.label
            .text 门店名称是按照所选地理位置自动拉取腾讯地图门店名称，如需修改请重新选择地图地点或重新
            a.text.blue(href="http://ugc.map.qq.com/AppBox/Landlord/login.html", target="_bank") 创建地点
          .field.is-horizontal
            label.label 门店图片
            .control.image-wrapper               
              .upload-pic(v-for="(item, index) in store_data.pic_list_json.list" :key="index")
                up-image(img-type="10", v-model="store_data.pic_list_json.list[index]", :imgId="index", :isSplit="false",  @input="storePicChange", @other="storePicDel")               
              .upload-pic(v-if="store_data.pic_list_json.list.length < 9")
                up-image(img-type="10", :imgId="store_data.pic_list_json.list.length", :isSplit="false"  @input="storePicChange")
          .field.is-horizontal
            label.label
            .text 请上传门店图片如门店外景、环境设施、商品服务等，图片将展示在微信客户端的门店页。最多可上传9个图片，文件格式为png、jpeg、jpg，大小不超过1M。
          .field.is-horizontal
            label.label 客服电话
            custom-input(v-model="store_data.contract_phone", placeholder="请输入客服电话", :validator="$v.store_data.contract_phone", error-info="请输入客服电话",)
          .field.is-horizontal
            label.label
            .text 固定电话需加区号；区号、分机号均用“-”连接
          .field.is-horizontal.w-all
            label.label 营业时间
            .control.select-box-wrapper
              select-time(v-model="start_hours")
              select-time(v-model="start_minutes", :isHours="false")
            .middle -
            .control.select-box-wrapper
              select-time(v-model="end_hours")
              select-time(v-model="end_minutes", :isHours="false")
          .field.is-horizontal
            label.label
            .text 24小时制，如10：00-20：30
          .field.is-horizontal
              label.label 相关证明材料
              .control.image-wrapper
                .upload-pic
                  up-meituan(img-type="6", v-model="qualification_list", :hasSecondAction="true", img-id='10',  @other="picDel")
      <!-- 功能服务 -->
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label-title 功能服务
          .field.is-horizontal
            label.label 门店服务
            .text 最多可选择添加9项服务（5个标准服务、4个自定义服务），其中有外送、快递、充电、预约、挂号、点餐、乘车、排队、缴费、购票、预订、到店自提任意一个服务认证的小程序按距离排序优先展示，其他服务标签（仅有优惠、买单、会员）及无标签的小程序将在折叠展示。
          .field.is-horizontal.service-data-group(v-for="(item, index) in current_data", :key="index", v-if="current_data.length")
            label.label 
            div.button.large(@click="editService(item)")
              div {{item.current_service.id !== 0 ? item.current_service.name : item.custom_name}}
              div.desc {{item.current_service.id !== 0 ? item.service_desc : ''}}
            .el-icon-remove(style="margin-left: 10px;", @click="removeService(index, item.current_service.id)")
          .field.is-horizontal.service-group
            label.label 
            a.button.large(@click="addServiceShow") 添加一项服务
      .btn-wrapper
        .button-group
          a.button.large.isDisabled(@click="goBack") 返回
          a.button.primary.large.isDisabled(@click="submit") 保存
      service-add-modal(v-if="is_show", ref="serviceAddModal", :serviceList="service_list", :appId="store_data.appid", :currentData="current_data" :isEdit="is_edit" @resolve="addService", @input="close")
</template>

<script type="text/ecmascript-6">
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import UpImage from '@/components/openStore/modal/UpImage'
import UpMeituan from '@/components/openStore/modal/UpMeituanImage'
import CustomInput from '@/components/generics/form/CustomInput'
import SelectTime from '@/components/generics/SelectTime'
import ServiceAddModal from '@/components/openStore/modal/ServiceAddModal'
import Api from '@/mixins/modules/OpenStore'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import { root } from '@/plugins/Fetch'
export default {
  name: 'nearbyMiniProgramSotreEdit',
  mixins: [Api, validationMixin],
  components: {
    OpenStoreTitle,
    UpImage,
    UpMeituan,
    CustomInput,
    SelectTime,
    ServiceAddModal,
  },
  validations: {
    store_data: {
      contract_phone: { required },
    },
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      wxStatus: 'wxStatus',
    }),
  },
  data () {
    return {
      root,
      poi_id: '',
      store_data: {},
      start_hours: '08', // 开始小时
      start_minutes: '00', // 开始分钟
      end_hours: '18', // 结束小时
      end_minutes: '30', // 结束分钟
      is_show: false, // 是否显示添加服务模态框
      is_edit: false, // 服务是否编辑
      service_list: [], // 服务列表
      current_data: [], // 当前服务数据
      qualification_list: '', // 证明材料
      submit_data: { // 提交的数据
        poi_id: '', // 门店 poi_id 创建新的门店，poi_id字段为空
        map_poi_id: '', // 门店 map_poi_id 腾讯地图那边有些数据不一致，如果不填map_poi_id的话，小概率会提交失败！
        is_comm_nearby: 1,
        kf_info: {
          open_kf: false, // 关闭客服功能
          kf_headimg: '', // 头像链接
          kf_name: '', // 客服名称
        },
        store_name: '', // 门店名字
        address: '', // 门店地址
        pic_list: { // 门店图片集合
          list: [],
        },
        contract_phone: '', // 联系电话
        hour: '', // 营业时间，格式11:11-12:12

        company_name: '', // 主体名称
        credential: '', // 资质号
        qualification_list: '', // 相关证明材料

        service_infos: { // 服务标签列表
          service_infos: [],
        },
      },
    }
  },
  methods: {
    // 提交
    async submit () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      if (!this.store_data.pic_list_json.list.length) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请上传门店图片',
        })
        return
      }
      if (!this.current_data.length) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请添加门店服务',
        })
        return
      }

      for (let key in this.store_data) {
        if (this.submit_data.hasOwnProperty(key)) {
          this.submit_data[key] = this.store_data[key]
        }
      }

      let arr = []
      this.current_data.forEach(item => {
        arr.push({
          id: item.current_service.id,
          type: item.current_service.type,
          name: item.current_service.id !== 0 ? item.current_service.name : item.custom_name,
          appid: item.app_id,
          path: item.page_route,
          desc: item.service_desc,
        })
      })
      this.submit_data.service_infos.service_infos = arr
      this.submit_data.hour = `${this.start_hours}:${this.start_minutes}-${this.end_hours}:${this.end_minutes}`
      this.submit_data.credential = this.store_data.qualification_info.qualification_num
      this.submit_data.is_comm_nearby = 1
      this.submit_data.qualification_list = this.qualification_list
      this.submit_data.pic_list = JSON.parse(JSON.stringify(this.store_data.pic_list_json))
      let params = {
        params: { ...this.submit_data },
      }
      try {
        const { response, result } = await this.updateStoreApi(params)
        if (response.status === 200 && result.code === 0) {
          this.$router.replace({
            name: 'nearbyMiniProgramSotreList',
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '编辑门店失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '编辑门店失败',
          content: `错误：${err}`,
        })
      }
    },
    /**
     * 编辑服务
     * @item 当前服务
     */
    editService (item) {
      this.is_show = true
      this.$nextTick(() => {
        this.$refs.serviceAddModal.service_data = item
        if (item.custom_name) {
          this.$refs.serviceAddModal.service_data.service_desc = item.custom_name
        }
        this.is_edit = true
      })
    },
    /**
     * 删除一项服务
     * @index 要删除的服务下标 @id 服务类型: 999为自定义类型
     */
    removeService (index, id) {
      this.current_data.splice(index, 1)
    },
    /**
     * 添加服务模态框 - 确定
     * @data 服务数据
     */
    addService (data) {
      if (!this.is_edit) {
        this.current_data.push(data)
      }
      this.is_show = false
      this.is_edit = false
    },
    // 添加服务
    addServiceShow () {
      this.is_show = true
    },
    // 添加服务模态框 - 取消
    close () {
      this.is_show = false
    },
    // 上传门店图片成功回调
    storePicChange (url, index) {
      // this.store_data.pic_list_json.list.splice(index, 1, url)
      this.store_data.pic_list_json.list.splice(index, 1, `${root}/quick/qualification/image_url?url=${url}`)
    },
    // 删除门店图片
    storePicDel (url) {
      this.store_data.pic_list_json.list.splice(this.store_data.pic_list_json.list.indexOf(url), 1)
    },
    // 上传资料图片
    picDel (url) {
      this.qualification_list = ''
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
    // 获取腾讯服务列表
    async getWxOfficialService () {
      try {
        let { response, result } = await this.getWxOfficialServiceApi()
        if (response.status === 200 && result.code === 0) {
          this.service_list = result.data
          this.service_list.push({
            id: 0,
            name: '自定义',
            type: 2,
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务列表信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取服务列表信息失败',
          content: `错误: ${err}`,
        })
      }
    },
    // 获取门店详情
    async getStoreDetail () {
      try {
        let { response, result } = await this.getStoreDetailApi({ poi_id: this.poi_id })
        if (response.status === 200 && result.code === 0) {
          this.store_data = result.data
          this.formatDate(this.store_data.hour)
          this.store_data.service_infos_json.service_infos.forEach(item => {
            this.current_data.push(
              {
                app_id: item.appid,
                page_route: item.path,
                service_desc: item.desc,
                custom_name: item.id !== 0 ? '' : item.name,
                current_service: {
                  id: item.id,
                  name: item.id !== 0 ? item.name : '自定义',
                  icon_url: item.icon_url,
                  type: item.type,
                },
              }
            )
          })
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
    // 格式化时间
    formatDate (str) {
      let hourArr = str.split('-')
      let hourStr = hourArr[0] + ':' + hourArr[1]
      let arr = hourStr.split(':')
      this.start_hours = arr[0]
      this.start_minutes = arr[1]
      this.end_hours = arr[2]
      this.end_minutes = arr[3]
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
    this.getWxOfficialService()
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/modules/creation-modal'
.section-layout
  height calc(100% - 56px)
  overflow-y auto
.form-wrapper
  border-bottom 0
  .w-all
    width 100%
    .select-time
      width 90px
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
.label-title
  font-size 15px
  font-weight bold
  border-left 3px solid #ffbb29
  padding-left 6px
  position relative
  left -9px
  line-height 1
.text
  line-height 14px
  font-size 12px
  color #999
  // white-space nowrap
.red
  margin 0 5px
  font-size 12px
  color #f00
.blue
  margin-left 10px
  color #0000FF
.image-wrapper
  display flex
  flex-direction row
  align-items center
  .upload-pic
    float left
.upload-pic
  width 88px
  height 88px
  margin-right 8px
.field.is-horizontal .select-box-wrapper
  flex-grow 0
.middle
  margin 0 10px
.service-data-group
  &:hover
    .el-icon-remove
      display block
  .button.large
    display flex
    justify-content space-between
    width 300px
    font-size 13px
.service-group
  .button.large
    display inline-block
    width 300px
    font-size 13px
    text-align left
.el-icon-remove
  display none
  cursor pointer
  color #ffbb29
  &::before
    font-size 20px
.desc
  color #ffbb29
</style>
