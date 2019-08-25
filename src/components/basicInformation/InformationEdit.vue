<template lang="pug">
  .section-layout
    .content-wrapper
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 门店名称
            custom-input(v-model="store.store_name", input-type="hasCount", maxlength=15, placeholder="请输入门店名称", :validator="$v.store.name", error-info="门店名称必填并且小于十五位", is-disabled=true)
          .field.is-horizontal
            label.label 经销商编码
            .field-content(v-text="store.dealer_code?store.dealer_code:'暂无编码'")
          .field.is-horizontal
            label.label 门店编码
            .field-content(v-text="store.store_code?store.store_code:'暂无编码'")
          .field.is-horizontal
            label.label 企业名称
            .field-content(v-text="enterprise_name")

          .field.is-horizontal
            label.label 联系人
            custom-input(placeholder="联系人", v-model="store.contacts", input-type="hasCount", :validator="$v.store.contacts", error-info="请填写联系人")
              span(slot="countInfo") {{wordLength(store.contacts)}}/10
          .field.is-horizontal
            label.label 联系电话
            custom-input(placeholder="联系电话(座机号/手机号)", v-model="store.business_phone",  :maxlength="is_phone", :validator="$v.store.business_phone", error-info="请填写正确的联系电话", need-type="specialTel")
          .field.is-horizontal
            label.label
            span.example 例: xxx-xxxxxxxx （座机号格式）
          .field.is-horizontal.w-all
            label.label 营业开始时间
            .control.select-box-wrapper
              select-time(v-model="store.open_time_hour", :validator="$v.store.open_time_hour", error-info="请选择时间", @input="detectOpenTime", :error-info="openErrorInfo")
              select-time(v-model="store.open_time_minutes", :isHours="false", :validator="$v.store.open_time_minutes", @input="detectOpenTimeMinutes", :error-info="openErrorInfoMinutes")
          .field.is-horizontal.w-all
            label.label 营业结束时间
            .control.select-box-wrapper
              select-time(v-model="store.close_time_hour", :validator="$v.store.close_time_hour", @input="detectCloseTime", :error-info="closeErrorInfo")
              select-time(v-model="store.close_time_minutes", :isHours="false", :validator="$v.store.close_time_minutes", @input="detectCloseTimeMinutes", :error-info="closeErrorInfoMinutes")
        .field-group
          .field.is-horizontal
            label.label 门店地址
            .control.select-box-wrapper
              .select-box
                select(v-model="store.province_id", id="province", @change="getRegions('citylist', store.province_id, false)", :validator="$v.store.province_id")
                  option(value="") 请选择
                  option(v-for="list in provincelist", :value="list.id") {{list.name}}
              .select-box
                select(v-model="store.city_id", id="city", @change="getRegions('districtlist', store.city_id, false)", :validator="$v.store.city_id")
                  option(value="") 请选择
                  option(v-for="list in citylist", :value="list.id") {{list.name}}
              .select-box
                select(v-model="store.district_id", id="district", :validator="$v.store.district_id", @change="getAddress")
                  option(value="") 请选择
                  option(v-for="list in districtlist", :value="list.id") {{list.name}}
                //- custom-select
          .field.is-horizontal
            label.label 详细地址
            custom-input(v-model="store.address", maxlength=50, placeholder="请输入详细地址", :validator="$v.store.address", error-info="请填写详细地址", @blur="getAddress")
          .field.is-horizontal
            label.label 预约电话
            custom-input(placeholder="预约电话", maxlength=11, v-model="store.reservation_phone", :validator="$v.store.reservation_phone", error-info="请填写正确的预约电话", need-type="number")
          .field.is-horizontal
            label.label 地图位置
            location-map(@change="getCoordinate", :address="fulladdress", :lng="+store.lng", :lat="+store.lat" ref="locmap")
        .field-group
          .field.is-horizontal.full-width
            label.label 可预约时段
            set-time-period(:reservationPeriod="store.reservation_period", :weekdayPeriodType="store.workday_reservation_period_type", :weekendPeriodType="store.weekend_reservation_period_type", :endTime="endTime", :startTime="startTime", :isNeedCaculate="isNeedCaculate", @change="getSelectedPeriod")
          .field.is-horizontal.full-width
            label.label 开放预约天数
            .control
              .toggle-group
                .toggle-btns.custom-size(v-for="n in 14")
                  input(type="radio", :id="'reservation_' + n", :value="n", v-model="store.reservation_days")
                  label(:for="'reservation_' + n") {{n}}天
        .field-group
          .field.is-horizontal
            label.label 门店认证
            custom-select(v-model="nowRen", :list="renList",  nameField="title", :is-disabled="true")
        .field-group
          .field.is-horizontal
            label.label 门店服务
            .control.select-box-wrapper
              .select-box.chooses(@mouseover="over()", @mouseout="enter()", @mouseleave="leave()")
                .item-select.pl(@click="getFuwu", v-if="isVisible || nowFuwu.length === 0")
                  .add-icon
                  | 选择服务
                .item-select.show-content
                  span(v-for="(item, index) in nowFuwu")
                    span(v-if="index + 1 !== nowFuwu.length") {{item.title + "、"}}
                    span(v-if="index + 1 === nowFuwu.length") {{item.title}}
        .field-group.video-wrapper-box
          .field.is-horizontal.video-wrapper-box
            label.label 门店视频
            .control.video-wrapper
              .video-add-btn
                span.add-button(@click="addVideo()")
                span.video-length {{store.videos.length}} / 10
                span.biaozhu 注：只支持后缀为.mp4视频地址
              .upload-pic-video(v-if='store.videos && store.videos.length>0',v-for='(item,index) in store.videos')
                upload-pic.upload-pic-style(v-model="item.picture", img-type="item.pic",:img-id="index", is-original=true)
                .upload-text-video
                  label.label 视频地址
                  custom-input(v-model="item.url",placeholder="请输入视频地址")
                a.video-delete(@click='deleteVideo(index)') 删除
        .field-group
          .field.is-horizontal
            label.label 门店环境
            .control.image-wrapper
              .image-tip
                //- span.add-button(@click="addImage('environment')")
                span.image-length {{store.environment.length}} / 10
                span.biaozhu 注：只能上传jpg/jpeg/png后缀格式图片，且不超过5M 第一张图为门店图像图片
              .upload-pic-box
                .upload-pic-item(v-for="(item, index) in store.environment")
                  upload-img-model(v-model="store.environment[index].image_url", img-type="store", :has-second-action="false", @other="deleteImage('environment', index)", need-move="2", @leftMove="leftPic('environment', index)", @rightMove="rightPic('environment',index)", :need-left="index !== 0", :need-right="index !== (store.environment.length -1)")
                  .upload-name
                    custom-input(v-model="store.environment[index].image_name",placeholder="请输入名称",maxlength=10)
                  .image-delete(@click="deleteImage('environment', index)") 删除
                .add-box(@click="addImage('environment')") +
          .field.is-horizontal
            label.label 门店资质
            .control.image-wrapper
              .image-tip
                //- span.add-button(@click="addImage('aptitude')")
                span.image-length {{store.aptitude.length}} / 10
                span.biaozhu 注：只能上传jpg/jpeg/png后缀格式图片，且不超过5M
              .upload-pic-box
                .upload-pic-item(v-for="(item, index) in store.aptitude")
                  upload-img-model(v-model="store.aptitude[index].image_url", img-type="store", :has-second-action="false", @other="deleteImage('aptitude', index)", need-move="2", @leftMove="leftPic('aptitude', index)", @rightMove="rightPic('aptitude',index)", :need-left="index !== 0", :need-right="index !== (store.aptitude.length -1)")
                  .upload-name
                    custom-input(v-model="store.aptitude[index].image_name",placeholder="请输入名称",maxlength=10)
                  .image-delete(@click="deleteImage('aptitude', index)") 删除
                .add-box(@click="addImage('aptitude')") +
          .field.is-horizontal
            label.label 门店设备
            .control.image-wrapper
              .image-tip
                //- span.add-button(@click="addImage('device')")
                span.image-length {{store.device.length}} / 10
                span.biaozhu 注：只能上传jpg/jpeg/png后缀格式图片，且不超过5M
              .upload-pic-box
                .upload-pic-item(v-for="(item, index) in store.device")
                  upload-img-model(v-model="store.device[index].image_url", img-type="store", :has-second-action="false", @other="deleteImage('device', index)", need-move="2", @leftMove="leftPic('device', index)", @rightMove="rightPic('device',index)", :need-left="index !== 0", :need-right="index !== (store.device.length -1)")
                  .upload-name
                    custom-input(v-model="store.device[index].image_name",placeholder="请输入名称",maxlength=10)
                  .image-delete(@click="deleteImage('device', index)") 删除
                .add-box(@click="addImage('device')") +
          .field.is-horizontal
            label.label 门店项目
            .control.image-wrapper
              .image-tip
                //- span.add-button(@click="addImage('item')")
                span.image-length {{store.item.length}} / 10
                span.biaozhu 注：只能上传jpg/jpeg/png后缀格式图片，且不超过5M
              .upload-pic-box
                .upload-pic-item(v-for="(item, index) in store.item")
                  upload-img-model(v-model="store.item[index].image_url", img-type="store", :has-second-action="false", @other="deleteImage('item', index)", need-move="2", @leftMove="leftPic('item', index)", @rightMove="rightPic('item',index)", :need-left="index !== 0", :need-right="index !== (store.item.length -1)")
                  .upload-name
                    custom-input(v-model="store.item[index].image_name",placeholder="请输入名称",maxlength=10)
                  .image-delete(@click="deleteImage('item', index)") 删除
                .add-box(@click="addImage('item')") +
      .btn-wrapper
        .button-group
          a.button.primary.large.isDisabled(@click="inspectData") 保存
    choose-fuwu(v-model="itemfuwu" , v-if="itemfuwu", @resolve="addFuwu", :nowFuwu="nowFuwu", :allFuwu="fuwuList")
</template>

<script>
import basicInformationMixin from '@/mixins/modules/basicInformation'
import ChooseFuwu from '@/components/basicInformation/modal/ChooseFuwu'
import upLoadApi from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import SelectTime from '@/components/generics/SelectTime'
import LocationMap from '@/components/generics/LocationMap'
import SetTimePeriod from '@/components/generics/SetTimePeriod'
import StoreQualificationsModel from '@/components/basicInformation/modal/StoreQualificationsModel'
import uploadImgModel from '@/components/basicInformation/modal/uploadImgModel'
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import Utils from '@/mixins/utilities/utils'
import UploadPic from '@/components/generics/form/UploadPic'
import {wordLength} from '@/mixins/custom-validators/custom-validators'
/**
 * @vue
 */
export default {
  name: 'informationEdit',
  mixins: [validationMixin, basicInformationMixin, upLoadApi, Utils],
  components: {
    CustomInput,
    CustomSelect,
    SelectTime,
    LocationMap,
    SetTimePeriod,
    StoreQualificationsModel,
    uploadImgModel,
    ChooseFuwu,
    UploadPic,
  },
  data () {
    return {
      wordLength,
      is_phone: 11,
      show_brand: true,    // 控制选择商品弹框显隐
      isVisible: false,
      itemfuwu: false, // 选择服务组件
      nowFuwu: [], // 此次所选服务
      fuwuList: [], // 服务列表
      itemren: false, // 选择认证组件
      nowRen: {}, // 此次所选认证
      renList: [], // 服务认证
      flag: false,
      isLoading: false,
      provincelist: [],
      districtlist: [],
      citylist: [],
      closeErrorInfo: '请选择时间',
      openErrorInfo: '请选择时间',
      openErrorInfoMinutes: '请选择时间',
      closeErrorInfoMinutes: '请选择时间',
      fulladdress: '',
      isNeedCaculate: false,
      enterprise_name: '',
      store: {
        store_name: '', // 名称
        banner: '', // 图片地址
        dealer_code: '', // 经销商编码
        store_code: '', // 门店编码
        videos: [],  // 视频列表
        propaganda: [], // 店招图
        environment: [], // 环境
        aptitude: [], // 资质
        device: [], // 设备
        item: [], // 项目
        contacts: '', // 联系人
        business_phone: '', // 联系电话
        open_time_hour: '', // 开始营业时间
        open_time_minutes: '', // 开始营业时间
        close_time_hour: '', // 结束营业时间
        close_time_minutes: '', // 结束营业时间
        address: '', // 地址
        reservation_phone: '', // 预约电话
        lng: '',
        lat: '',
        province_id: '', // 省
        city_id: '', // 市
        district_id: '', // 区
        reservation_days: undefined, // 开放预约天数
        reservation_period: {}, // 可预约时段
        workday_reservation_period_type: '1',
        weekend_reservation_period_type: '1',
        aptitudes: [],
        store_id: null,
      },
      maxAptitudes: 4,
      isUploading: false,
    }
  },
  computed: {
    getParams () {
      var arr = []
      this.nowFuwu.forEach(item => {
        arr.push(item.setting_id)
      })
      return {
        ...this.store,
        open_time: this.store.open_time_hour + ':' + this.store.open_time_minutes,
        close_time: this.store.close_time_hour + ':' + this.store.close_time_minutes,
        enterprise_id: this.store.enterprise.enterprise_id,
        service: arr,
        store_name: this.store.store_name.trim(),
        contacts: this.store.contacts.trim(),
        address: this.store.address.trim(),
      }
    },
    endTime () {
      return {
        hour: this.store.close_time_hour,
        minutes: this.store.close_time_minutes,
      }
    },
    startTime () {
      return {
        hour: this.store.open_time_hour,
        minutes: this.store.open_time_minutes,
      }
    },
  },
  methods: {
    // 向左
    leftPic (type, index) {
      let list = this.store[type]
      this.store[type] = []
      let now = list[index]
      let left = list[index - 1]
      list[index] = left
      list[index - 1] = now
      this.store[type] = list
    },
    // 向右
    rightPic (type, index) {
      let list = this.store[type]
      this.store[type] = []
      let now = list[index]
      let left = list[index + 1]
      list[index] = left
      list[index + 1] = now
      this.store[type] = list
    },
    over () {
      window.clearTimeout(this.hideTimeout)
      this.isVisible = true
    },
    // 鼠标进入
    enter () {
      window.clearTimeout(this.hideTimeout)
      this.hideTimeout = setTimeout(() => {
        this.isVisible = false
      }, 200)
    },
    // 鼠标离开
    leave () {
      this.isVisible = false
    },
    /**
     * index 对应的视频的下标
     */
    deleteVideo (index) {
      this.store.videos.splice(index, 1)
    },
    // 添加视频
    addVideo () {
      if (this.store.videos.length >= 10) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '视频最多添加十个',
        })
        return
      }
      this.store.videos.unshift({
        picture: '',     // 封面图片地址
        url: '',         // 视频地址
      })
    },
    // 校验选择的开始时间的时
    detectOpenTime (val) {
      this.$v.store.open_time_hour.$touch()
    },
    /*
    * 所选服务
    * arr 所选服务
    * */
    addFuwu (arr) {
      this.nowFuwu = arr
    },
    // 控制服务组件
    getFuwu () {
      this.itemfuwu = true
    },
    /*
   * 服务认证展示
   * service 门店服务
   * authentication 服务认证
   * */
    // 校验选择的开始时间的分
    detectOpenTimeMinutes (val) {
      this.$v.store.open_time_minutes.$touch()
    },
    // 校验选择的结束时间的时
    detectCloseTime (val) {
      this.$v.store.close_time_hour.$touch()
    },
    // 校验选择的结束时间的分
    detectCloseTimeMinutes (val) {
      this.$v.store.close_time_minutes.$touch()
    },
    // 填写完地址，自动更正地图上的定位位置
    getAddress () {
      if (!this.store.district_id || !this.store.province_id || !this.store.city_id) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '门店地址必选',
        })
        return
      }
      if (!this.store.address) {
        return
      }
      const province = this.provincelist[document.getElementById('province').selectedIndex - 1].name
      const city = this.citylist[document.getElementById('city').selectedIndex - 1].name
      const district = this.districtlist[document.getElementById('district').selectedIndex - 1].name
      this.fulladdress = province + city + district + this.store.address
      console.log('this.store.address', this.store.address)
      this.$refs.locmap.getLocation({address: this.fulladdress})
    },
    // 获取地图的经纬度
    getCoordinate (params) {
      this.store.lng = params.lng
      this.store.lat = params.lat

      console.log('params', params)
    },
    // 获取选择的可预约时间的参数
    getSelectedPeriod ({flag, reservationPeriod, weekendPeriodType, workdayPeriodType}) {
      this.flag = flag
      if (flag) {
        this.store.reservation_period = {...reservationPeriod}
        this.store.weekend_reservation_period_type = weekendPeriodType
        this.store.workday_reservation_period_type = workdayPeriodType
      }
    },
    // 获取省市区数据
    async getRegions (cate, parentId, flag = true) {
      const {response, result} = await this.fetchRegions({parent_id: parentId})
      if (response.status === 200) {
        switch (cate) {
          case 'citylist':
            this.store.district_id = flag ? this.store.district_id : ''
            this.store.city_id = flag ? this.store.city_id : ''
            this.citylist = []
            this.districtlist = []
            break
          case 'districtlist':
            this.store.district_id = flag ? this.store.district_id : ''
            this.districtlist = []
            break
        }
        this[cate] = result.data
      }
    },
    // 保存操作
    inspectData () {
      if (this.isLoading) {
        return
      }
      this.$v.store.$touch()
      if (this.$v.$error) {
        this.isNeedCaculate = false
      }
      if (this.$v.store.address.$error || this.$v.store.store_name.$error || this.$v.store.contacts.$error || this.$v.store.business_phone.$error || this.$v.store.close_time_hour.$error || this.$v.store.close_time_minutes.$error || this.$v.store.open_time_hour.$error || this.$v.store.open_time_minutes.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        return
      } else if (this.$v.store.reservation_phone.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 300)
        return
      } else if (this.$v.store.district_id.$error || this.$v.store.city_id.$error || this.$v.store.province_id.$error) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '门店地址必选',
        })
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 300)
        return
      } else if (this.$v.store.reservation_days.$error) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请设置开放预约天数',
        })
        return
      } else if (this.$v.store.aptitudes.$error) {
        const len = this.store.aptitudes.length
        for (let i = 0; i < len; i++) {
          if (this.$v.store.aptitudes.$each[i].title.$error) {
            break
          } else if (this.$v.store.aptitudes.$each[i].image_url.$error) {
            this.$store.dispatch('showMessage', {
              type: 'warning',
              title: '警告',
              content: '请上传门店资质图片',
            })
            break
          }
        }
        return
      }
      if (this.nowFuwu.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请选择服务选项',
        })
        return
      }
      let isVideo = false
      this.store.videos.forEach(item => {
        if (!item.url || !item.picture) {
          isVideo = true
        }
      })
      if (isVideo) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '门店视频的封面和视频地址必填',
        })
        return
      }
      // 校验门店环境图片
      let isEnvironment = false
      this.store.environment.forEach(item => {
        if (!item.image_url) {
          isEnvironment = true
        }
      })
      if (isEnvironment) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '门店环境的图片地址必填',
        })
        return
      }
      // 校验门店资质图片
      let isAptitude = false
      this.store.aptitude.forEach(item => {
        if (!item.image_url) {
          isAptitude = true
        }
      })
      if (isAptitude) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '门店资质的图片地址必填',
        })
        return
      }
      // 校验门店设备图片
      let isDevice = false
      this.store.device.forEach(item => {
        if (!item.image_url) {
          isDevice = true
        }
      })
      if (isDevice) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '门店设备的图片地址必填',
        })
        return
      }
      // 校验门店项目图片
      let isItem = false
      this.store.item.forEach(item => {
        if (!item.image_url) {
          isItem = true
        }
      })
      if (isItem) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '门店项目的图片地址必填',
        })
        return
      }
      this.isNeedCaculate = true
      setTimeout(() => {
        if (!this.flag) {
          this.isNeedCaculate = false
        } else {
          if (Object.keys(this.store.reservation_period).length) {
            setTimeout(() => {
              this.editStore()
            }, 0)
          } else {
            this.$store.dispatch('showMessage', {
              type: 'warning',
              title: '警告',
              content: '请添加可预约时段',
            })
            this.isNeedCaculate = false
          }
        }
      }, 0)
    },
    // 提交修改
    async editStore () {
      try {
        if (this.isUploading) {
          return
        }
        this.isUploading = true
        const {response, result} = await this.storeSave(this.getParams)
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '门店修改失败',
              content: `${result.message}`,
            })
            this.isUploading = false
            return false
          }
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '门店修改成功',
            resolve: () => {
              this.$router.go(0)
            },
          })
        } else {
          this.isNeedCaculate = false
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改门店失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
        this.isUploading = false
      } catch (err) {
        this.isNeedCaculate = false
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '修改门店失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
        this.isUploading = false
      }
    },
    // 删除图片
    deleteImage (type, index) {
      this.store[type].splice(index, 1)
    },
    // 添加图片
    addImage (type) {
      if (this.store[type].length >= 10) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '图片最多添加十个',
        })
        return
      }
      this.store[type].push({
        image_name: '',     // 图片名称
        image_url: '',      // 图片地址
      })
    },
    //  获取基本信息详情
    async getStoreDetail () {
      let self = this
      try {
        const {response, result} = await this.fetchStore()
        if (response.status === 200 && result.code === 0) {
          this.enterprise_name = result.data.enterprise.name
          this.getFuwuList(result.data.service)
          this.getRenList(result.data.authentication)
          let imgArray = []
          if (result.data.images.length > 0) {
            for (let i = 0; i < result.data.images.length; i++) {
              imgArray.push(result.data.images[i].image_url)
            }
            result.data.images = imgArray
          }
          result.data.workday_reservation_period_type = result.data.workday_reservation_period_type.toString()
          result.data.weekend_reservation_period_type = result.data.weekend_reservation_period_type.toString()
          this.store.aptitudes.splice(this.store.aptitudes.length, 0, ...result.data.aptitudes)
          this.store = {
            ...this.store,
            ...result.data,
            open_time_hour: result.data.open_time && result.data.open_time.split(':')[0],
            open_time_minutes: result.data.open_time && result.data.open_time.split(':')[1],
            close_time_hour: result.data.close_time && result.data.close_time.split(':')[0],
            close_time_minutes: result.data.close_time && result.data.close_time.split(':')[1],
            aptitudes: this.store.aptitudes,
          }
          this.fulladdress = result.data.province_name + result.data.city_name + result.data.district_name + result.data.address
          setTimeout(() => {
            self.$refs.locmap.lngLatLocation({lng: result.data.lng, lat: result.data.lat})
          }, 500)
          await this.getRegions('citylist', result.data.province_id)
          await this.getRegions('districtlist', result.data.city_id)
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店详情失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取门店详情失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 时间校验函数
    compareTime (compareTarget, curTarget, cate, errorInfo) {
      if (!this.store[curTarget]) {
        this[errorInfo] = '请选择时间'
        return false
      } else {
        if (!this.store[compareTarget]) {
          return true
        } else {
          if (cate === 'startHour' || cate === 'startMinutes') {
            if ((cate === 'startHour' && parseInt(this.store[curTarget]) > parseInt(this.store[compareTarget])) || (cate === 'startMinutes' && this.store.open_time_hour === this.store.close_time_hour && parseInt(this.store[curTarget]) >= parseInt(this.store[compareTarget]))) {
              this[errorInfo] = '开始时间必须小于结束时间'
              return false
            }
          } else {
            if ((cate === 'endHour' && parseInt(this.store[curTarget]) < parseInt(this.store[compareTarget])) || (cate === 'endMinutes') && this.store.open_time_hour === this.store.close_time_hour && parseInt(this.store[curTarget]) <= parseInt(this.store[compareTarget])) {
              this[errorInfo] = '结束时间必须大于开始时间'
              return false
            }
          }
          return true
        }
      }
    },
    /*
    * 服务列表
    * service 门店服务
    * */
    async getFuwuList (service) {
      try {
        const {response, result} = await this.getFWList({
          setting_type: 2,
        })
        if (response.status === 200) {
          this.fuwuList = result.data
          service.forEach(item => {
            result.data.forEach(cell => {
              if (Number(cell.setting_id) === Number(item)) {
                this.nowFuwu.push(cell)
              }
            })
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取服务列表失败',
          content: `错误：${err}`,
        })
      }
    },
    /*
    * 认证列表
    * authentication 门店认证
    * */
    async getRenList (authentication) {
      try {
        const {response, result} = await this.getFWList({
          setting_type: 1,
        })
        if (response.status === 200) {
          this.renList = result.data
          authentication.forEach(item => {
            result.data.forEach(cell => {
              if (Number(cell.setting_id) === Number(item)) {
                this.nowRen = cell
              }
            })
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取认证列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取认证列表失败',
          content: `错误：${err}`,
        })
      }
    },
  },
  watch: {
    // 监听用户输入手机号 判断是为手机还是座机
    'store.business_phone': function (val) {
      if (val.indexOf('-') !== -1) {
        this.is_phone = 13
      } else {
        this.is_phone = 11
      }
    },
  },
  mounted () {
    this.getRegions('provincelist', 0)
    this.getStoreDetail()
  },
  validations: {
    store: {
      store_name: {
        required,
      },
      contacts: {
        required,
        validate (val) {
          return this.wordLength(val) <= 10
        },
      },
      business_phone: {
        required,
        validate (val) {
          return /^[0-9-]*$/.test(val)
        },
      },
      reservation_phone: {
        required,
        validate (val) {
          return /^1\d{10}$/.test(val)
        },
      },
      province_id: {
        required,
      },
      city_id: {
        required,
      },
      district_id: {
        required,
      },
      address: {
        required,
      },
      open_time_hour: {
        validate () {
          return this.compareTime('close_time_hour', 'open_time_hour', 'startHour', 'openErrorInfo')
        },
      },
      open_time_minutes: {
        validate () {
          return this.compareTime('close_time_minutes', 'open_time_minutes', 'startMinutes', 'openErrorInfoMinutes')
        },
      },
      close_time_hour: {
        validate () {
          return this.compareTime('open_time_hour', 'close_time_hour', 'endHour', 'closeErrorInfo')
        },
      },
      close_time_minutes: {
        validate () {
          return this.compareTime('open_time_minutes', 'close_time_minutes', 'endMinutes', 'closeErrorInfoMinutes')
        },
      },
      reservation_days: {
        required,
      },
      aptitudes: {
        $each: {
          title: {
            required,
          },
          image_url: {
            required,
          },
        },
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
// @import '~@/stylus/modules/upload-pic'
.section-layout {
  position: relative;
  height: calc(100% - 56px);
  overflow-y: auto;
}
.form-wrapper
  .w-all
    width 100%
    .select-time
      width 90px
.add-box {
  width: 88px;
  height: 88px;
  text-align: center;
  line-height: 88px;
  color: #ccc;
  border: 1px dashed rgba(0,0,0,0.1);
  background: #fbfbfb;
  font-size: 50px;
  font-weight: 100;
  cursor: pointer;
}
.example {
  font-size 14px
  color #ccc
}
label.label
  font-size 13px
.upload-pic-item
  width 88px
  height 88px
  margin-right 8px
.form-wrapper .field
  width 625px
.form-wrapper .field.full-width
  width 100%
.upload-banner
  width 88px
  height 88px
  overflow hidden
  position relative
  img
    width 100%
    height 100%
  input[type="file"]
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    opacity 0
.period-box-wrapper
  width 360px
  margin-right 18px
.period-box
  width 100%
  border 1px solid #ccc
  background #fcfcfc
  border-radius 2px
.period-box-top
  width 100%
  background #fff
  height 105px
  position relative
  border-bottom 1px solid #ccc
.period-box-item
  width 100%
  height 56px
  box-sizing border-box
  border-bottom 1px solid rgba(0, 0, 0, .06)
  display flex
  flex-direction row
  padding 16px
  .multiple-toggle-btns + .multiple-toggle-btns
    margin-left 12px
  label
    width 56px
.period-select
  display flex
  padding 16px
  box-sizing border-box
  .radio + .radio
    margin-left 79px
  .radio
    &.checked
      &::after
        display block
        content ""
        position absolute
        bottom -21px
        left 4px
        width 8px
        height 8px
        border 1px solid #ccc
        border-right none
        border-bottom none
        transform rotate(45deg)
        background #fff
.period-box-bottom
  background #fcfcfc
  padding 16px 0 0 16px
  box-sizing border-box
  height 96px
  .multiple-toggle-btns
    margin-right 16px
    margin-left 0
    margin-bottom 16px
  .multiple-toggle-btns + .multiple-toggle-btns
    margin-left 0
  label
    width 98px
    padding 0
    text-align center
    font-size 12px
  .button
    width 98px
    height 24px
    font-size 12px
    line-height 24px
.period-box-tip
  width 100%
  padding 16px 16px 0
  color #999
  font-size 12px
  line-height 16px
  display flex
  flex-wrap wrap
  span
    display inline-flex
    margin-left 5px
    position relative
    padding-right 6px
    &::after
      display block
      content ""
      width 1px
      height 12px
      background #999
      position absolute
      top 50%
      right 0
      transform translateY(-50%)
    &:last-child
      &::after
        display none
.toggle-btns.custom-size
  label
    padding 0
    width 40px
.select-box-wrapper
  display flex
.select-box
  flex 1
  select
    width 100%
    border 1px solid #ccc
    height 32px
    box-sizing border-box
    border-radius 2px
    box-sizing border-box
    padding 0 12px
.select-box + .select-box
  margin-left 8px
.is-flex
  display flex
.evaluate-bar
  margin-top 8px
  margin-bottom 6px
  display flex
.star-rate-area
  margin-left 17px
.label-close
  position absolute
  top -8px
  right -8px
  width 15px
  height 15px
  background #fe5942
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05)
  border-radius 50%
  cursor pointer
  &::after
    display block
    content ""
    position absolute
    width 15px
    height 15px
    background url('~@/assets/remove-time.svg')
    left 50%
    top 50%
    transform translate(-50%, -50%)
.image-wrapper {
  .image-tip{
    display: flex;
    align-items: center;
    height: 30px;
    .add-button {
      width: 30px;
      height: 30px;
    }
    .image-length {
      font-size: 13px;
      color: #666;
      // margin-left: 15px;
    }
    .biaozhu {
      margin-left: 10px;
      color: red;
      font-size: 11px;
    }
  }
  .upload-pic-box {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    align-items: center;
    margin-top: 15px;
    margin-bottom: 55px;
    .upload-name{
      margin-top 5px;
      margin-bottom 5px;
      width: 91px;
    }
    .upload-banner + .upload-banner {
      margin-left: 8px;
    }
    .image-delete{
      color: #2fabdd;
      font-size: 13px;
      text-align: center;
      cursor: pointer;
    }
  }
}
.upload-button
  border 1px dashed #f1f1f1
  border-radius 2px
  background #fbfbfb
  cursor pointer
  &::before
    content ''
    display block
    position absolute
    width 40px
    height 30px
    background getImage('cloud-upload.svg') no-repeat center center
    top 50%
    margin-top: -15px
    left 50%
    margin-left -20px
.qualification-cacl
  margin-left 4px
  color #999
.field-content
  font-size: 13px
  line-height: 16px
  color: #353535
.item-select
  width 100%
  height 64px
  box-sizing border-box
  border 1px solid #e5e5e5
  background #fff
  border-radius 2px
  display flex
  align-items center
  justify-content center
  font-size 13px
  color #353535
  cursor pointer
  padding 12px
  .add-icon
    background #ffbb29
    box-shadow 0 2px 5px 0 rgba(0, 0, 0, .08)
    width 24px
    height 24px
    position relative
    margin-right 11px
    border-radius 50%
    &::after
      display block
      content ""
      position absolute
      left 50%
      top 50%
      width 10px
      height 10px
      background url('~@/assets/plus-s.svg') no-repeat
      background-size cover
      transform translate(-50%, -50%)
  .item-pic
    width 40px
    height 40px
    border-radius 2px
    margin-right 12px
    flex-shrink 0
    overflow hidden
    .item-logo
      width 100%
      height 100%
.show-content
  align-items normal
  padding 5px !important
  justify-content normal
.chooses
  position: relative
.pl
  position absolute
.video-wrapper-box
  width: 600px !important
.video-add-btn
  display: flex
  align-items: center
  .add-button
    width: 30px
    height: 30px
  .video-length
    font-size: 13px
    color: #666
    margin-left: 15px
.video-wrapper
  display: block
  .biaozhu
    margin-left: 10px
    color: red
    font-size: 11px
  .upload-pic-video
    display: flex
    flex-direction: row
    flex-grow: 1
    align-items: center
    margin-top: 15px
    justify-content: space-between
    &:first-child
      margin-top: 0
  .upload-text-video
    width: calc(100% - 150px)
    margin-bottom: 26px
  .video-delete
    color: #2fabdd
    font-size: 13px
</style>
