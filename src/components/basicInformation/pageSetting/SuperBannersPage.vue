<template lang="pug">
  .section-layout.contentss
    .section-filter.is-horizontal.section-filter-none
      span.add-button(@click="addItem()")
    empty-page(v-if="!(list && list.length) && showPage", :tip="mini_type==2?'当前没有本店活动':'当前没有品牌日'")
    .content-wrapper.list-wrapper.table-data(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(customer, index) in list")
              td
                .field.is-horizontal.image-super
                  upload-pic(v-model="customer.pic", img-type="customer.pic",:img-id="index", is-original=true, :isDisabled="customer.locking === 2")
                .cuselct
                  custom-input(v-model="customer.brand_name", maxlength=30, :isDisabled="customer.locking === 2", :validator="$v.list.$each[index].brand_name", placeholder="请输入活动名称", error-info="活动名称必填")
              td.tr-p
                .icon-img
                  div(v-if="customer.locking !== 2")
                    .up(v-if="index !== lock_length", @click="sortItem(index, 'up')")
                    .down(v-if="index !== list.length-1", @click="sortItem(index, 'down')")
              td
                .simple-td(v-if="customer.value_type === 1") 商品信息
                .simple-td(v-if="customer.value_type === 2") 服务信息
                .simple-td(v-if="customer.value_type === 3") 商品分类
                .simple-td(v-if="customer.value_type === 4") 服务分类
                .simple-td(v-if="customer.value_type === 5") 平台内容
                .simple-td(v-if="customer.value_type === 6") 品牌馆
                .simple-td(v-if="customer.value_type === 7") 评论
                .simple-td(v-if="customer.value_type === 8") 抽奖
                .simple-td(v-if="customer.value_type === 9") 商品分类列表
                .simple-td(v-if="customer.value_type === 10") 服务分类列表
                .simple-td(v-if="customer.value_type === 11") 门店内容
                .simple-td(v-if="customer.value_type === 12") 敬请期待
              td
                .operation-td
                  a.operation-link.left(v-if="customer.locking !== 2", @click="openSetting(index, customer.id)") 设置
                    ul.setting-block(v-if="customer.setting_block === true")
                      li(v-for="setItem in setList", @click.stop="goSettingBlock(setItem.type,index)", v-text="setItem.name")
                  a.operation-link(v-if="customer.locking !== 2", @click="deleteItem(index)") 删除
                  div(v-if="customer.locking === 2")
                    span.status-locked
                    span 已锁定
    .btn-wrapper
      .button-group
        a.button.primary.large(@click="saveData") 保存
    choose-product(v-model="show_product", v-if="show_product", :id="setting_id", @resolve="getProduct")
    choose-service(v-model="show_service", v-if="show_service", :id="setting_id", @resolve="getService")
    choose-brand(v-model="show_brand", v-if="show_brand", :id="setting_id", @resolve="getBrand")
    choose-platform-content(v-model="show_platform_content", v-if="show_platform_content", :id="setting_id", @resolve="getContent")
    choose-store-content(v-model="show_store_content", v-if="show_store_content", :id="setting_id", @resolve="getStoreContent")
    choose-lottery(v-model="choose_lottery", v-if="choose_lottery", @resolve="getChooseLottery", :id="setting_id")
    first-product-category(v-model="pro_fir_cate", v-if="pro_fir_cate", @resolve="getProFirCate", :id="setting_id")
    second-product-category(v-model="pro_sec_cate", v-if="pro_sec_cate", @resolve="getProSecCate", :id="setting_id")
    first-service-category(v-model="ser_fir_cate", v-if="ser_fir_cate", @resolve="getSerFirCate", :id="setting_id")
    second-service-category(v-model="ser_sec_cate", v-if="ser_sec_cate", @resolve="getSerSecCate", :id="setting_id")
</template>

<script>
// 品牌
import ChooseBrand from '@/components/basicInformation/modal/ChooseBrand'
// 商品信息
import ChooseProduct from '@/components/basicInformation/modal/ChooseProduct'
// 服务信息
import ChooseService from '@/components/basicInformation/modal/ChooseService'
// 抽奖
import ChooseLottery from '@/components/basicInformation/modal/ChooseLottery'
// 平台内容
import ChoosePlatformContent from '@/components/basicInformation/modal/ChoosePlatformContent'
// 门店内容
import ChooseStoreContent from '@/components/basicInformation/modal/ChooseStoreContent'
// 商品分类
import FirstProductCategory from '@/components/basicInformation/modal/FirstProductCategory'
// 商品分类列表
import SecondProductCategory from '@/components/basicInformation/modal/SecondProductCategory'
// 服务分类
import FirstServiceCategory from '@/components/basicInformation/modal/FirstServiceCategory'
// 服务分类列表
import SecondServiceCategory from '@/components/basicInformation/modal/SecondServiceCategory'
import CustomInput from '@/components/generics/form/CustomInput'
import EmptyPage from '@/components/generics/EmptyPage'
import UploadPic from '@/components/generics/form/UploadPic'
import adminApi from '@/mixins/modules/basicInformation'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { wordLength } from '@/mixins/custom-validators/custom-validators'
import { mapGetters } from 'vuex'
export default {
  name: 'spuerBannersPage',
  mixins: [adminApi, validationMixin],
  components: {
    CustomInput,
    EmptyPage,
    UploadPic,
    ChooseBrand,
    ChooseProduct,
    ChooseService,
    ChoosePlatformContent,
    ChooseStoreContent,
    ChooseLottery,
    FirstProductCategory,
    SecondProductCategory,
    FirstServiceCategory,
    SecondServiceCategory,
  },
  data () {
    return {
      setting_id: '',
      show_brand: false,      // 控制品牌馆显隐
      pro_fir_cate: false,    // 控制选择商品分类项显隐
      pro_sec_cate: false,    // 控制选择商品分类列表显隐
      ser_fir_cate: false,     // 控制选择服务分类项显隐
      ser_sec_cate: false,    // 控制选择服务分类列表显隐
      show_product: false,    // 控制商品显隐
      show_service: false,    // 控制服务显隐
      show_platform_content: false,     // 控制内容显隐
      show_store_content: false,        // 控制门店显隐
      choose_lottery: false,    // 控制抽奖显隐
      showPage: false,              // 缺省页控制
      lock_length: 0,    // 锁定 Banner 图长度
      theadConfig: [{
        name: '活动名称',
        width: '345',
      }, {
        name: '排序',
        width: '200',
      }, {
        name: '跳转类型',
        width: '200',
      }, {
        name: '操作',
        width: '200',
      }],
      list: [],
      // 设置浮层
      setting_block: false,
      setList: [
        {
          name: '商品信息',
          type: 1,
        },
        {
          name: '服务信息',
          type: 2,
        },
        {
          name: '商品分类',
          type: 3,
        },
        {
          name: '服务分类',
          type: 4,
        },
        {
          name: '平台内容',
          type: 5,
        },
        {
          name: '品牌馆',
          type: 6,
        },
        {
          name: '评论',
          type: 7,
        },
        {
          name: '抽奖',
          type: 8,
        },
        {
          name: '商品分类列表',
          type: 9,
        },
        {
          name: '服务分类列表',
          type: 10,
        },
        {
          name: '门店内容',
          type: 11,
        },
        {
          name: '敬请期待',
          type: 12,
        },
      ],
    }
  },
  validations: {
    list: {
      $each: {
        brand_name: {
          required,
          validate (val) {
            return this.wordLength(val) <= 30
          },
        },
      },
    },
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
  },
  methods: {
    wordLength,
    // 添加内容
    addItem () {
      this.list.forEach(function (item) {
        item.setting_block = false
      })
      if (this.list.length >= 10) {
        if (this.mini_type === 2) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '最多添加10个本店活动',
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '最多添加10个超级品牌日',
          })
        }
        return
      }
      let id = 1
      if (this.list.length > 0) {
        id = Number(this.list[this.list.length - 1].id) + 1
      }
      let obj = {
        id: id,
        pic: '',
        brand_name: '',
        value_type: '',
        value_content: {},
        setting_block: false,
      }
      this.list.splice(this.lock_length, 0, obj)
      // this.list.unshift(obj)
    },
    /**
     * 设置
     * @ item
     */
    openSetting (index, id) {
      let self = this
      for (var i = 0; i < this.list.length; i++) {
        if (i === parseInt(index)) {
          self.list[i].setting_block = !self.list[i].setting_block
        } else {
          self.list[i].setting_block = false
        }
      }
      this.setting_id = id
      this.index = index
    },
    /**
     * 选择设置项
     * @ item
     */
    goSettingBlock (type, index) {
      switch (type) {
        case 1:
          this.show_product = true
          break
        case 2:
          this.show_service = true
          break
        case 3:
          this.pro_fir_cate = true
          break
        case 4:
          this.ser_fir_cate = true
          break
        case 5:
          this.show_platform_content = true
          break
        case 6:
          this.show_brand = true
          break
        case 8:
          this.choose_lottery = true
          break
        case 9:
          this.pro_sec_cate = true
          break
        case 10:
          this.ser_sec_cate = true
          break
        case 11:
          this.show_store_content = true
          break
      }
      this.list.forEach(function (item) {
        item.setting_block = false
      })
      if (type === 12 || type === 7) {
        this.list[index].value_type = type
      }
    },
    /**
     * 排序
     * @index {int} 序列号
     * @type {string} up or down
     */
    sortItem (index, type) {
      let arr = [...this.list]
      this.list = []
      let temp = arr[index]
      // 向上移动
      if (type === 'up') {
        arr[index] = arr[index - 1]
        arr[index - 1] = temp
      }
      // // 向下移动
      if (type === 'down') {
        arr[index] = arr[index + 1]
        arr[index + 1] = temp
      }
      this.list = [...arr]
    },
    /**
     * 删除 item
     * @index {int} 序列号
     */
    deleteItem (index) {
      this.list.splice(index, 1)
    },
    // 验证数据
    validateData () {
      let _this = this
      let pass = true
      // if (!_this.list || !_this.list.length) {
      //   _this.$store.dispatch('showMessage', {
      //     type: 'failure',
      //     title: '商品内容不能为空',
      //     content: '商品内容不能为空',
      //   })
      //   pass = false
      //   return pass
      // }
      for (let i = 0; i < _this.list.length; i++) {
        let item = _this.list[i]
        if (!item.pic) {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '商品图片不能为空',
          })
          pass = false
          return
        }
        if (!item.brand_name) {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '活动内容不能为空',
          })
          pass = false
          return
        }
        if (!item.value_type) {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '跳转参数类型不能为空',
          })
          pass = false
          return
        }
      }
      return pass
    },
    // 保存
    async saveData () {
      this.$v.$touch()
      if (this.$v.$error) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '活动名称必填',
        })
        return
      }
      let res = this.validateData()
      if (!res) {
        return false
      }
      let params = []
      this.list.forEach(item => {
        let obj = {}
        obj.id = item.id
        obj.pic = item.pic
        obj.brand_name = item.brand_name
        obj.value_type = item.value_type
        obj.value_content = item.value_content
        if (item.locking !== 2) {
          params.push(obj)
        }
      })
      try {
        const { response, result } = await this.saveSuperBanner({
          data: params,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '保存成功',
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '保存失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取列表信息
    async fetchData () {
      this.lock_length = 0
      try {
        const { response, result } = await this.getSuperBannerList()
        if (response.status === 200) {
          if (result.code === 0) {
            this.list = result.data.map(item => {
              item.setting_block = false
              if (item.locking === 2) {
                this.lock_length++
              }
              return item
            })
            this.showPage = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取列表失败',
              content: `${response.status} ${result.message}`,
            })
            this.showPage = false
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取列表失败',
            content: `${response.status} ${result.message}`,
          })
          this.showPage = false
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取列表失败',
          content: `错误：${err}`,
        })
        this.showPage = false
      }
    },
    /**
  * 选择商品信息的回调处理
  * @param {Object} 已选商品的数据
  * @id {Number, String} 触发该弹框的id
  */
    getProduct (params, id) {
      let arr = {
        id: '',
      }
      arr.id = params.product_id
      this.list[this.index].id = params.product_id
      this.list[this.index].brand_name = params.name
      this.list[this.index].pic = params.product_pic
      this.list[this.index].value_type = 1
      this.list[this.index].value_content = arr
    },
    /**
  * 选择服务信息的回调处理
  * @param {Object} 已选商品的数据
  * @id {Number, String} 触发该弹框的id
  */
    getService (params, id) {
      let arr = {
        id: '',
      }
      arr.id = params.basic_spu_id
      this.list[this.index].id = params.basic_spu_id
      this.list[this.index].brand_name = params.name
      this.list[this.index].pic = params.product_pic
      this.list[this.index].value_type = 2
      this.list[this.index].value_content = arr
    },
    /**
  * 选择品牌馆的回调处理
  * @param {Object} 已选商品的数据
  * @id {Number, String} 触发该弹框的id
  */
    getBrand (params, id) {
      let arr = {
        id: '',
      }
      arr.id = params.id
      this.list[this.index].id = params.id
      this.list[this.index].brand_name = params.name
      this.list[this.index].pic = params.cover
      this.list[this.index].value_type = 6
      this.list[this.index].value_content = arr
    },
    /**
  * 选择抽奖的回调处理
  * @param {Object} 已选商品的数据
  * @id {Number, String} 触发该弹框的id
  */
    getChooseLottery (params, id) {
      let arr = {
        id: '',
      }
      arr.id = params.activity_id
      this.list[this.index].id = params.activity_id
      this.list[this.index].brand_name = params.name
      // this.list[this.index].pic = ''
      this.list[this.index].value_type = 8
      this.list[this.index].value_content = arr
    },
    /**
  * 选择平台内容的回调处理
  * @param {Object} 已选商品的数据
  * @id {Number, String} 触发该弹框的id
  */
    getContent (params, id) {
      let arr = {
        id: '',
      }
      arr.id = params.id
      this.list[this.index].id = params.id
      this.list[this.index].brand_name = params.title
      this.list[this.index].pic = params.cover
      this.list[this.index].value_type = 5
      this.list[this.index].value_content = arr
      console.log(params)
    },
    /**
   * 选择门店内容的回调处理
   * @param {Object} 已选商品的数据
   * @id {Number, String} 触发该弹框的id
   */
    getStoreContent (params, id) {
      let arr = {
        id: '',
      }
      arr.id = params.id
      this.list[this.index].id = params.id
      this.list[this.index].brand_name = params.title
      this.list[this.index].value_type = 11
      this.list[this.index].value_content = arr
    },
    // 选择商品分类
    getProFirCate (params, id) {
      let arr = {
        id: '',
      }
      arr.id = params.category_id
      this.list[this.index].id = params.category_id
      this.list[this.index].brand_name = params.category_name
      this.list[this.index].value_type = 3
      this.list[this.index].value_content = arr
    },
    // 选择商品分类列表
    getProSecCate (params, id) {
      let arr = {
        category_id: 0,
        parent_id: 0,
      }
      if (params.level === 1) {
        arr.parent_id = params.category_id
      }
      if (params.level === 2) {
        arr.category_id = params.category_id
      }
      this.list[this.index].id = params.category_id
      this.list[this.index].brand_name = params.category_name
      this.list[this.index].value_type = 9
      this.list[this.index].value_content = arr
    },
    // 选择服务分类
    getSerFirCate (params, id) {
      let arr = {
        id: '',
      }
      arr.id = params.category_id
      this.list[this.index].id = params.category_id
      this.list[this.index].brand_name = params.category_name
      this.list[this.index].value_type = 4
      this.list[this.index].value_content = arr
    },
    // 选择服务分类列表
    getSerSecCate (params, id) {
      let arr = {
        category_id: 0,
        parent_id: 0,
      }
      if (params.level === 1) {
        arr.parent_id = params.category_id
      }
      if (params.level === 2) {
        arr.category_id = params.category_id
      }
      this.list[this.index].id = params.product_id
      this.list[this.index].brand_name = params.category_name
      this.list[this.index].value_type = 10
      this.list[this.index].value_content = arr
    },
  },
  mounted () {
    this.fetchData()
    // C版小程序将超级品牌日改成本店内容，mini_type=1：B版（综合版），2：C版（保养版），3：定制版
    this.mini_type = parseInt(this.currentUser.store.mini_type)
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.list-wrapper {
  padding-bottom: 120px !important;
}

.contentss {
  height: calc(100% - 48px);
}

.table-data {
  height: calc(100% - 90px) !important;
}

.section-filter-none.is-horizontal {
  height: 0;
  padding: 0;
}

.section-filter .add-button {
  bottom: initial;
}

.section-layout {
  position: relative;
  padding-top: 0;

  .add-button {
    position: absolute;
    right: 40px;
    top: 0;
    z-index: 10000;
  }
}

table td {
  vertical-align: middle;
}

.cuselct {
  width: 345px;
  margin-top: 5px;
}

.emp {
  margin-top: 40px;
}

.upc {
  width: 73px;
  height: 32px;
}

.content {
  display: flex;
  justify-content: start;
}

.pp {
  position: relative;
}

.haha, .add-icon, .category-icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  background: url('~@/assets/icons/button-add.svg') no-repeat center center;
  background-size: cover;
  margin-right: 6px;
  margin-top: 8px;
}

.category-icon {
  background-image: url('~@/assets/icons/button-catrgory.svg');
}

.page-selector {
  label {
    z-index: 5;
  }
}

.right-box {
  display: flex;
  position: absolute;
  bottom: 20px;
  right: 30px;
}

.xi {
  align-self: flex-end;
}

.bian {
  height: 16px;
  font-size: 13px;
  font-family: MicrosoftYaHei;
  color: rgba(47, 171, 221, 1);
  line-height: 16px;
  padding-right: 17px;
  margin-right: 0;
}

.del {
  padding-left: 17px;
  color: rgba(235, 78, 56, 1) !important;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

.button {
  padding: 0 10px;
}

.btn-wrapper {
  margin-top: 20px;
  padding-right: 70px;
  text-align: right;
  text-align: right;
  position: fixed;
  bottom: 40px;
  right: 0;
  padding: 23px 40px 0;

  .large {
    width: 120px;
  }
}

.username {
  line-height: 36px;
}

.button-import:hover a {
  position: relative;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
  color: #121212;
  top: -1px;
}

.subFile {
  width: 74px;
  height: 32px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}

.position-relative {
  position: relative;
}

.upload-pic.is-normal, .field.is-horizontal {
  width: 345px !important;
  height: 175px !important;

  img {
    width: 100%;
    height: 100%;
  }
}

.tr-p {
  position: relative;
}

.up, .down {
  position: absolute;
  top: 100px;
  width: 20px;
  height: 30px;
  opacity: 0.5;
  cursor: pointer;

  &.is-disable {
    opacity: 0.2;
    pointer-events: none;
  }

  &:hover {
    opacity: 1;
  }
}

.up {
  left: 0;
  background: center no-repeat url('~@/assets/icons/move-up.svg');
  background-size: 20px 30px;
}

.down {
  left: 25px;
  background: center no-repeat url('~@/assets/icons/move-down.svg');
  background-size: 20px 30px;
}

.delete {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  background: center no-repeat url('~@/assets/icons/trash.svg');
  cursor: pointer;
}

.operation-link {
  position: relative;
  margin-right: 10px;
}

.setting-block {
  position: absolute;
  top: -85px;
  left: 30px;
  background: #f0f1f2;
  z-index: 1000;
  width: 110px;
  box-sizing: border-box;
  border-radius: 2px;
  height: 220px;
  overflow: hidden;
  overflow-y: scroll;

  li {
    color: #999;
    padding: 10px;
    line-height: 12px;
    font-size: 12px;
  }

  li:hover {
    background: #ffc723;
    color: white;
  }
}

.status-locked {
  display: block;
  float: left;
  margin-top: 10px;
  width: 16px;
  height: 16px;
  margin-right: 3px;
  background-image: url('~@/assets/lock.svg');
}
</style>
