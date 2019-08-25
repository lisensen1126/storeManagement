<template lang="pug">
  .slide-layout
    .slide-title {{ vehicleId ? '编辑' : '新增' }}车辆

    .field-group.is-horizontal
      .field.field-select
        label.label 车牌信息
        custom-select(v-model="license_plate_before", :list="car_info_list", :validator="$v.license_plate_before", :show-search="true", error-info="必选项")
      .field.field-input
        custom-input(v-model="license_plate_after",need-type='number_letter', placeholder="请输入车牌号", @blur="appercase('license_plate_after')", :validator="$v.license_plate_after", error-info="车牌号输入不正确")

    .field-group.is-horizontal
      .field.field-select
        label.label 品牌车型
        custom-select.mb_6(v-model="brand", :list="brand_list", @input="fetchCardModels", placeholder="请选择品牌车型", :show-search="true")
        custom-select.mb_6(v-model="model", :list="model_list", @input="fetchCardSales", placeholder="请选择车型", :show-search="true")
        custom-select(v-model="vehicle", :list="vehicle_list", nameField="car_sales_name", placeholder="请选择", :show-search="true")

    .field-group.is-horizontal
      .field.field-input
        label.label 上次保养里程
        custom-input(v-model="mileage", input-type="hasUnit", need-type="number", placeholder="请输入里程", maxlength="6")
          span(slot="unitName") km

    .field
      button.button.large.primary(@click="save") 保存

</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import { required } from 'vuelidate/lib/validators'
  import {validationMixin} from 'vuelidate'
  import clientMixin from '@/mixins/modules/customer'
  export default {
    name: 'CustomerCar',
    mixins: [validationMixin, clientMixin],
    components: {
      CustomInput,
      CustomSelect,
    },
    props: {
      vehicleId: {
        type: [String, Number],
      },
      customerId: {
        type: [String, Number],
      },
    },
    computed: {
      car_info_list () {
        let result = []
        ;[
          '京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '苏', '浙', '皖', '闽',
          '赣', '鲁', '豫', '鄂', '湘', '粤', '琼', '川', '贵', '云', '陕', '甘', '青',
          '台', '蒙', '桂', '宁', '新', '藏', '澳', '军', '海', '航', '警', '使', '领',
        ].forEach(item => result.push({ name: item }))
        return result
      },
    },
    data () {
      return {
        license_plate_before: {},   // 车牌号 - 前
        license_plate_after: '',      // 车牌号 - 后
        brand: {},                  // 品牌名称
        model: {},                  // 车型名称
        vehicle: {},                // 车型库具体销售版本
        mileage: '',                  // 车辆里程
        brand_list: [],               // 选择器 - 品牌车型
        model_list: [],               // 选择器 - 品牌车型
        vehicle_list: [],             // 选择器 - 品牌车型
      }
    },
    mounted () {
      if (this.vehicleId) this.fetchDetail()
      else this.fetchProvinceByIP()
      this.fetchBrands()
    },
    watch: {
      mileage (newVal) {
        if (newVal > 4000000000) {
          this.mileage = 4000000000
        }
      },
    },
    methods: {
      // 根据ip地址获取所在地省份简称
      async fetchProvinceByIP () {
        try {
          const {response, result} = await this.fetchProvinceByIPApi({
            vehicle_id: this.vehicleId,
            customer_id: this.customerId,
          })
          if (response.status === 200) {
            this.license_plate_before = { name: result.data.province }
            console.log(this.license_plate_before)
          } else {
            throw new Error(result.message)
          }
        } catch (e) {
          this.errorDialog(e, '获取所在地省份简称失败')
        }
      },
      async fetchDetail () {
        try {
          const {response, result} = await this.fetchCarDetailApi({
            vehicle_id: this.vehicleId,
            customer_id: this.customerId,
          })
          if (response.status === 200 && result.code === 0) {
            let _d = result.data
            this.license_plate_before = { name: _d.license_plate[0] }
            this.license_plate_after = _d.license_plate.slice(1)
            if (_d.carpart_brand_id) {
              this.brand = {
                id: _d.carpart_brand_id,
                name: _d.brand_name,
                logo_url: _d.logo,
              }
              this.fetchCardModels(this.brand, false)
            }
            if (_d.carpart_model_id) {
              this.model = {
                id: _d.carpart_model_id,
                name: _d.model_name,
              }
              this.fetchCardSales(this.model, false)
            }
            if (_d.carpart_vehicle_id) {
              this.vehicle = {
                id: _d.carpart_vehicle_id,
                sales_name: _d.vehicle_name,
                car_sales_name: `${_d.product_year}款 ${_d.vehicle_name}`,
              }
            }
            this.mileage = _d.mileage
          } else {
            throw new Error(result.message)
          }
        } catch (e) {
          this.errorDialog(e, '查询车辆信息失败')
        }
      },
      async save () {
        try {
          this.$v.$touch()
          if (this.$v.$error) return
          let formData = this.fetchFormData()
          if (this.vehicleId) formData.vehicle_id = this.vehicleId

          const {response, result} = this.vehicleId ? await this.editCarApi(formData) : await this.addCarApi(formData)

          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '保存成功',
              content: `车辆${this.vehicleId ? '修改' : '添加'}成功`,
              resolve: () => {
                this.$emit('success')
              },
            })
          } else {
            throw new Error(result.message)
          }
        } catch (e) {
          this.errorDialog(e, '保存信息失败')
        }
      },
      fetchFormData () {
        let mileage = null
        if (this.mileage === '0' || this.mileage === '') {
          mileage = 0
        } else {
          mileage = this.mileage
        }
        return {
          customer_id: this.customerId,                   // 客户id
          license_plate: `${this.license_plate_before.name}${this.license_plate_after}`,  // 车牌号
          carpart_brand_id: this.brand.id,                // 品牌id
          brand_name: this.brand.name,                    // 品牌名称
          carpart_model_id: this.model.id,                // 车型库车型id
          model_name: this.model.name,                    // 车型名称
          product_year: this.vehicle.product_year,        // 车辆年份
          carpart_vehicle_id: this.vehicle.id,            // 车型库具体销售版本id
          vehicle_name: this.vehicle.sales_name,          // 车型库具体销售版本
          mileage,                                        // 车辆里程（单位：km）
          logo: this.brand.logo_url,
        }
      },
      // 车辆品牌列表
      async fetchBrands () {
        try {
          const {response, result} = await this.fetchCarBrandsApi()
          if (response.status === 200 && result.code === 0) {
            this.brand_list = result.data.all
          } else {
            throw new Error(result.message)
          }
        } catch (e) {
          this.errorDialog(e, '获取车辆品牌失败')
        }
      },
      // 车型列表
      async fetchCardModels (brand, isClear = true) {
        try {
          const {response, result} = await this.fetchCarModelsApi(brand.id)
          if (response.status === 200 && result.code === 0) {
            if (isClear) {
              this.model = {}
              this.vehicle = {}
            }
            this.model_list = result.data
          } else {
            throw new Error(result.message)
          }
        } catch (e) {
          this.errorDialog(e, '获取车型列表失败')
        }
      },
      // 车型具体销售版本列表
      async fetchCardSales (sale, isClear = true) {
        try {
          const {response, result} = await this.fetchCarSalesApi(sale.id)
          if (response.status === 200 && result.code === 0) {
            if (isClear) this.vehicle = {}
            result.data.forEach(item => {
              item.car_sales_name = `${item.product_year}款 ${item.sales_name}`
            })
            this.vehicle_list = result.data
          } else {
            throw new Error(result.message)
          }
        } catch (e) {
          this.errorDialog(e, '获取车型销售版本失败')
        }
      },
      appercase (name) {
        this[name] = this[name].toLocaleUpperCase()
      },
      /**
       * 错误信息弹窗
       * @param error 错误
       * @param title 弹窗标题
       */
      errorDialog (error, title) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: title,
          content: `出错啦！错误信息：${error}`,
        })
      },
    },
    validations: {
      license_plate_before: {
        required,
      },
      license_plate_after: {
        required,
        validate (val) {
          return /^([a-zA-Z]{1})([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf]|[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/.test(val)
        },
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .mb_6
    margin-bottom 6px
  .slide-layout .field
    width 100%
</style>

