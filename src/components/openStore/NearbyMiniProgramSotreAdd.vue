<template lang="pug">
  .section-layout
    .content-wrapper
      open-store-title(title="附近的小程序-添加门店", :isShowBack="true")
      <!-- 基本信息 -->
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label-title 基本信息
          .field.is-horizontal.w-all
            label.label 地理位置
            custom-select.m-l-10(:list="province_list", nameField="fullname", v-model="province", @input="changeprovince", :show-search="true")
            custom-select.m-l-10(:list="city_list", nameField="fullname", v-model="city", @input="changecity", :show-search="true", v-show="city_list.length")
            custom-select.m-l-10(:list="country_list", nameField="fullname", v-model="country", @input="changecountry", :show-search="true", v-show="country_list.length")
            .store_name.m-l-10
              custom-input(v-model="search_store_name", placeholder="请输入门店名称", @keyupEnter="searchStore")
            .search-btn.m-l-10
              a.button.large(@click="searchStore") 搜索
          .field.is-horizontal(v-show="markers.length")
            label.label 
            .text 共找到 
            span.red {{markers.length}} 
            span.text(style="margin-right: 15px") 家门店
            .text 找不到合适门店？
            a.blue(style="font-size: 12px", href="http://ugc.map.qq.com/AppBox/Landlord/login.html", target="_bank") 创建新门店
          .field.is-horizontal.w-all
            label.label 地理定位
            .map-box
              .container(ref="container")
              .store-list(v-if="markers.length")
                ul.markers-box
                  li.marker-item(:class="marker_index === index ? 'active' : ''", v-for="(item, index) in markers", @click="showMapMarker(item, index)")
                    p.name {{item.branch_name}}
                    p.address 地址: {{item.address}}
                    p.tel 电话: {{item.telephone ? item.telephone : '暂无'}}
                    a.btn(@click="importStore(item)") 导入该门店信息 
                  el-pagination(small, layout="prev, pager, next", :total="pagination_data.total", @current-change="currentChange", @prev-text="currentChange", @next-text="currentChange")
          .field.is-horizontal.w-all 
            label.label 门店名称
            .field-content.store-name {{submit_data.store_name}}
            .text(v-if="!submit_data.store_name") 门店名称是按照所选地理位置自动拉取腾讯地图门店名称，如需修改请重新选择地图地点或重新
            a.text.blue(v-if="!submit_data.store_name", href="http://ugc.map.qq.com/AppBox/Landlord/login.html", target="_bank") 创建地点
          .field.is-horizontal.w-all(v-if="submit_data.store_name")
            label.label
            .text 门店名称是按照所选地理位置自动拉取腾讯地图门店名称，如需修改请重新选择地图地点或重新
            a.text.blue(href="http://ugc.map.qq.com/AppBox/Landlord/login.html", target="_bank") 创建地点
          .field.is-horizontal
            label.label 门店图片
            .control.image-wrapper               
              .upload-pic(v-for="(item, index) in store_pic_arr" :key="index")
                up-image(img-type="10", v-model="store_pic_arr[index]", :imgId="index",  @input="storePicChange", @other="storePicDel")               
              .upload-pic(v-if="store_pic_arr.length < 9")
                up-image(img-type="10", :imgId="store_pic_arr.length",  @input="storePicChange")
          .field.is-horizontal
            label.label
            .text 请上传门店图片如门店外景、环境设施、商品服务等，图片将展示在微信客户端的门店页。最多可上传9个图片，文件格式为png、jpeg、jpg，大小不超过1M。
          .field.is-horizontal
            label.label 客服电话
            custom-input(v-model="submit_data.contract_phone", placeholder="请输入客服电话", :validator="$v.submit_data.contract_phone", error-info="请输入客服电话",)
          .field.is-horizontal
            label.label
            .text 固定电话需加区号；区号、分机号均用“-”连接
          .field.is-horizontal.w-all
            label.label 营业时间
            .control.select-box-wrapper
              select-time(v-model="start_hours", :validator="$v.start_hours", error-info="请选择时间")
              select-time(v-model="start_minutes", :isHours="false", :validator="$v.start_minutes", error-info="请选择时间")
            .middle -
            .control.select-box-wrapper
              select-time(v-model="end_hours", :validator="$v.end_hours", error-info="请选择时间")
              select-time(v-model="end_minutes", :isHours="false", :validator="$v.end_minutes", error-info="请选择时间")
          .field.is-horizontal
            label.label
            .text 24小时制，如10：00-20：30
      <!-- 资质信息 -->
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label-title 资质信息
          .field.is-horizontal
            label.label 经营资质主体
            .radio-wrapper
              .type-item
                .radio
                  input(type="radio", id="public", :value="1", v-model="main_part_type", @change="partTypeChange")
                  label(for="public") 公众号帐号主体 
                  .text.f-13 {{license_name}}
          .field.is-horizontal.w-all
            label.label
            .radio-wrapper
              .type-item
                .radio
                  input(type="radio", id="relevant", :value="2", v-model="main_part_type", @change="partTypeChange")
                  label(for="relevant") 相关主体 
                  .text.f-13 (若地点的经营资质名称与帐号主体名称不一致，请选择相关主体。)  
                  a.blue.f-13(href="https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=115460689909CFo4&version=1&lang=zh_CN&platform=2&token=414296242", target="_bank") 操作指引
          .relevant-group.m-t-40
            .field.is-horizontal
              label.label 经营资质名称
              custom-input(placeholder="经营资质名称", v-model="submit_data.company_name", :validator="$v.submit_data.company_name", error-info="请输入经营资质名称")
            .field.is-horizontal
              label.label 
              .text 请填写营业执照名称，或组织机构代码证名称。
            .field.is-horizontal
              label.label 经营资质证件号
              custom-input(placeholder="请输入经营资质证件号", v-model="submit_data.credential", :open-show-big="true", :validator="$v.submit_data.credential", error-info="请输入经营资质证件号")
            .field.is-horizontal
              label.label 
              .text 请填写15位营业执照注册号或9位组织机构代码（如12345678-9）或18位或20位统一社会信用代码
            .field.is-horizontal(v-if="main_part_type === 2")
              label.label 相关证明材料
              .control.image-wrapper
                .upload-pic
                  up-meituan(img-type="6", v-model="submit_data.qualification_list", :hasSecondAction="is_del", img-id='10')
            .field.is-horizontal(v-if="main_part_type === 2")
              label.label
              .text 提交能证明此经营资质主体与帐号主体相关的证明材料。文件格式为png、jpeg、jpg，大小不超过5M。
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
          //- .field.is-horizontal.w-all
          //-   label.label 门店直达
          //-   .checkbox
          //-     input(type="checkbox", :id="1", v-model="store_direct")
          //-     label 将第一项门店服务前置展示在门店列表中，让用户更快捷的使用服务
          //-     .blue.f-13(@click="showModal") 查看示例
      .btn-wrapper
        .button-group
          a.button.large.isDisabled(@click="goBack") 取消
          a.button.primary.large.isDisabled(@click="submit") 保存
    service-add-modal(v-if="is_show", ref="serviceAddModal", :serviceList="service_list", :appId="app_id", :currentData="current_data" :isEdit="is_edit" @resolve="addService", @input="close")
    account-reference(v-if="is_open_reference", :imgUrl="img_url", @close="closeModal")

</template>
<script type="text/ecmascript-6">
import OpenStoreTitle from '@/components/openStore/modal/OpenStoreTitle'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import UpMeituan from '@/components/openStore/modal/UpMeituanImage'
import UpImage from '@/components/openStore/modal/UpImage'
import SelectTime from '@/components/generics/SelectTime'
import ServiceAddModal from '@/components/openStore/modal/ServiceAddModal'
import AccountReference from '@/components/openStore/modal/AccountReference'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import Api from '@/mixins/modules/OpenStore'
import { mapGetters } from 'vuex'
import { root } from '@/plugins/Fetch'
// import { TMap } from '@/plugins/TMap'
export default {
  name: 'nearbyMiniProgramSotreAdd',
  mixins: [Api, validationMixin],
  components: {
    OpenStoreTitle,
    CustomInput,
    CustomSelect,
    UpMeituan,
    UpImage,
    SelectTime,
    ServiceAddModal,
    AccountReference,
  },
  validations: {
    submit_data: {
      contract_phone: { required },
      company_name: { required },
      credential: { required },
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
      is_show: false, // 是否显示添加服务模态框
      marker_index: 0, // 当前选中的marker
      // key: 'CRCBZ-IM6KF-IVYJT-JN4DH-YGVTK-XLBVE', // 腾讯地图key
      is_del: false, // 图片能否删除
      is_edit: false, // 服务是否编辑
      is_open_reference: false,
      img_url: 'https://oss1.chedianai.com/images/assets/add-example.jpg',

      province_list: [], // 省列表
      province: {}, // 省
      city_list: [], // 城市列表
      city: {}, // 城市
      country_list: [], // 区列表
      country: {}, // 区
      search_store_name: '', // 搜索的门店名称
      pagination_data: {
        current_page: 1, // 当前页数
        per_page: 10, // 每页个数
        last_page: 1,
        total: 1, // 总数
      },

      markers: [], // 门店列表
      mapView: '', // 地图
      mapInfoWindow: '', // 信息提示框
      markersArray: [], // 标注点数组
      mapData: [], // 地图数据


      main_part_type: 1, // 公众号帐号主体 - 1: 公众号主体, 2: 相关主体
      license_name: '', // 经营资质名称
      license_code: '', // 经营资质证件号

      service_list: [], // 服务列表
      app_id: '',
      service_desc: '', // 服务描述
      store_direct: false, // 门店直达
      current_data: [], // 当前服务数据

      store_data: {}, // 选择的门店
      store_pic_arr: [], // 门店图片数组
      store_pic: '', // 门店图片
      start_hours: '08', // 开始小时
      start_minutes: '00', // 开始分钟
      end_hours: '18', // 结束小时
      end_minutes: '30', // 结束分钟

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
      if (!this.submit_data.store_name) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请先导入门店信息',
        })
        return
      }
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      if (!this.store_pic_arr.length) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请上传门店图片',
        })
        return
      }
      if (this.main_part_type === 2 && !this.submit_data.qualification_list) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请上传相关证明材料',
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
      this.submit_data.pic_list.list = this.store_pic_arr
      let params = {
        params: { ...this.submit_data },
      }
      try {
        const { response, result } = await this.addStoreApi(params)
        if (response.status === 200 && result.code === 0) {
          this.$router.replace({
            name: 'nearbyMiniProgramSotreList',
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加门店失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '添加门店失败',
          content: `错误：${err}`,
        })
      }
    },
    // 返回
    goBack () {
      this.$router.go(-1)
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
    // 展示"门店直达"样例
    showModal () {
      this.is_open_reference = true
    },
    // 关闭"门店直达"样例
    closeModal () {
      this.is_open_reference = false
    },
    /*
      *  改变省
      *  q 省对象
      * */
    changeprovince (q) {
      this.province = q
      this.city_list = []
      this.country_list = []
      this.city = {}
      this.country = {}
      this.getAdress(2)
    },
    /*
    *  改变城市
    *  q 城市对象
    * */
    changecity (q) {
      this.country_list = []
      this.city = q
      this.getAdress(3)
      this.country = {}
    },
    /*
   *  改变区
   *  q 区对象
   * */
    changecountry (q) {
      this.country = q
    },
    /*
    * 获取地址
    *  @level 省市区
    * */
    async getAdress (level = 1) {
      let params = {
        level: level,
        parent_id: 0,
      }
      if (level === 2) {
        params.parent_id = this.province.id
      }
      if (level === 3) {
        params.parent_id = this.city.id
      }
      try {
        const { response, result } = await this.getminiProgramLocationApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            if (level === 1) {
              this.province_list = result.data
            }
            if (level === 2) {
              this.city_list = result.data
            }
            if (level === 3) {
              this.country_list = result.data
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取地址列表失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取地址列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取地址列表失败',
          content: `错误：${err}`,
        })
      }
    },
    // 经营资质主体切换
    partTypeChange () {
      if (this.main_part_type === 1) {
        this.submit_data.company_name = this.license_name
        this.submit_data.credential = this.license_code
        this.submit_data.qualification_list = ''
      } else {
        this.submit_data.company_name = ''
        this.submit_data.credential = ''
      }
    },
    // 上传门店图片成功回调
    storePicChange (url, index) {
      this.store_pic_arr.splice(index, 1, url)
      // this.store_pic_arr.splice(index, 1, `${root}/quick/qualification/image_url?url=${url}`)
    },
    // 删除门店图片
    storePicDel (url) {
      this.store_pic_arr.splice(this.store_pic_arr.indexOf(url), 1)
    },
    // 导入门店信息
    importStore (item) {
      this.store_data = item
      this.submit_data.map_poi_id = this.store_data.sosomap_poi_uid
      this.submit_data.store_name = this.store_data.branch_name
      this.submit_data.address = this.store_data.address
      this.submit_data.contract_phone = this.store_data.telephone
      this.markers = []
    },
    // 搜索门店
    async searchStore () {
      if (!Object.keys(this.city).length || !this.search_store_name) {
        return false
      }
      let params = {
        keyword: this.search_store_name,
        per_page: this.pagination_data.per_page,
        page: this.pagination_data.current_page,
      }
      if (Object.keys(this.country).length) {
        params.district_id = this.country.id
      } else {
        params.district_id = this.city.id
      }
      try {
        const { response, result } = await this.searchStoreApi(params)
        if (response.status === 200 && result.code === 0) {
          this.markers = result.data
          this.initMap(this.markers)
          this.pagination_data = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店列表失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取门店列表失败',
          content: `错误：${err}`,
        })
      }
    },
    // 改变页数回调
    currentChange (page) {
      this.pagination_data.current_page = page
      this.searchStore()
    },
    // 创建地图标记弹出框信息
    createInfoWindowContent (item) {
      // let href = window.location.origin + '/content-detail?hotelId=' + item.id
      // + '&orderType=' + item.orderType  (拼接其他参数)
      return `<div style="width: 200px; line-height: 16px; font-size: 12px;">                
                <p>${item.branch_name}</p>                
                <p>${item.address}</p>                
                <p>${item.telephone}</p>  
              </div>`
    },
    // 清除已有的地图标记
    clearOverlays () {
      if (this.markersArray) {
        this.markersArray.map(item => {
          item.setMap(null)
        })
      }
    },
    // 列表和地图联动
    showMapMarker (listItem, index) {
      this.marker_index = index
      // eslint-disable-next-line no-undef
      let center = new qq.maps.LatLng(listItem.latitude, listItem.longitude)
      this.mapView.setCenter(center) // 设置地图中心点坐标。
      this.mapData.map(item => {
        // eslint-disable-next-line no-undef
        let marker = new qq.maps.Marker({
          // eslint-disable-next-line no-undef
          position: new qq.maps.LatLng(item.latitude, item.longitude),
          map: this.mapView,
          data: item,
        })
        // eslint-disable-next-line no-undef
        qq.maps.event.addListener(marker, 'click', (e) => {
          this.mapInfoWindow.open()
          this.mapInfoWindow.setContent(this.createInfoWindowContent(e.target.data))
          this.mapInfoWindow.setPosition(e.latLng)
        })
        this.markersArray.push(marker)
      })
      // 当前点击的列表项显示对应标注
      this.mapInfoWindow.open()
      let listItemTemp = {
        id: listItem.id,
        branch_name: listItem.branch_name,
        address: listItem.address,
        telephone: listItem.telephone,
      }
      this.mapInfoWindow.setContent(this.createInfoWindowContent(listItemTemp))
      this.mapInfoWindow.setPosition(center)
    },
    // 初始化地图
    async initMap (arr) {
      // TMap(this.key).then(qq => {
      this.clearOverlays()
      let element = this.$refs.container
      // 创建地图，设置地图中心点
      let center = null
      // if (this.markers.length) {
      if (arr.length) {
        // eslint-disable-next-line no-undef
        center = new qq.maps.LatLng(arr[0].latitude, arr[0].longitude)
      } else {
        // eslint-disable-next-line no-undef
        center = new qq.maps.LatLng(39.916527, 116.397128)
      }
      if (this.mapView) {
        this.mapView.setCenter(center)
      } else {
        // eslint-disable-next-line no-undef
        this.mapView = new qq.maps.Map(element,
          {
            center: center,
            zoom: 13,
          }
        )
        // 创建信息提示窗
        // eslint-disable-next-line no-undef
        this.mapInfoWindow = new qq.maps.InfoWindow({
          map: this.mapView,
        })
      }
      arr.map(item => {
        // 创建标记
        // eslint-disable-next-line no-undef
        let marker = new qq.maps.Marker({
          // eslint-disable-next-line no-undef
          position: new qq.maps.LatLng(item.latitude, item.longitude),
          map: this.mapView,
          // 将数据信息赋值给marker的data属性，用做点击显示与跳转
          data: item,
        })
        // 获取标记的点击事件
        // eslint-disable-next-line no-undef
        qq.maps.event.addListener(marker, 'click', (e) => {
          this.mapInfoWindow.open()
          this.mapInfoWindow.setContent(this.createInfoWindowContent(e.target.data))
          this.mapInfoWindow.setPosition(e.latLng)  // 提示窗位置
        })
        // 存放所有marker
        this.markersArray.push(marker)
      })
      // })
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
    // 获取门店资质信息
    async getQualification () {
      try {
        let { response, result } = await this.getQualificationApi()
        if (response.status === 200 && result.code === 0) {
          if (!(result.data instanceof Array)) {
            this.submit_data.company_name = result.data.license_name
            this.submit_data.credential = result.data.license_code

            this.license_name = result.data.license_name
            this.license_code = result.data.license_code
            this.app_id = result.data.app_id
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店资质信息失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取门店资质信息失败',
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
    this.initMap(this.markers) // 初始化地图
    this.getAdress() // 获取省市区
    this.getQualification() // 获取门店资质
    this.getWxOfficialService() // 获取微信官方服务
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/modules/creation-modal'
.section-layout
  height calc(100% - 56px)
  overflow-y auto
.form-wrapper
  .w-all
    width 100%
    .select-time
      width 90px
.desc
  color #ffbb29
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
.f-13
  margin-left 10px
  font-size 13px
  line-height 16px
.m-t-40
  margin-top 40px
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
.custom-select
  .custom-select-area
    width 130px
.m-l-10
  margin-right 10px
.search-btn
  width 90px
  .button.large
    width 100%
    height 32px
    line-height 30px
    font-size 12px
.map-box
  display flex
  width 600px
  height 300px
  // overflow-y auto
  .container
    width 700px
    height 300px
  .store-list
    width 350px
    height 300px
    border 1px solid #E7E7EB
    border-left 0
.markers-box
  height 300px
  overflow-y auto
  .marker-item
    padding 10px
    font-size 13px
    line-height 17px
    cursor pointer
    &.active
      background #eee
    .address, .tel
      color #7B7B7B
    .btn
      color #0000FF
.store-name
  font-size 13px
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
</style>
