<template lang="pug">
  .section-layout
    .section-filter.is-horizontal.section-filter-none
      span.add-button(@click="addItem()")
    .content-wrapper.list-wrapper(v-if='bannerList.length !== 0')
      .table-wrapper
        table.table
          thead
            tr
              td(width="60") 编号
              td(width="150") 轮播图
              td(width="80") 排序
              td(width="130") 跳转类型
              td(width="150") 操作
          tbody
            tr(v-for="(item, index) in bannerList")
              td
                .simple-td {{item.id}}
              td
                .simple-image
                  upload-pic.upload-pic-style(v-model="item.pic", img-type="item.pic",:img-id="index", is-original=true, :isDisabled="item.locking === 2")
              td
                .icon-img
                  div(v-if="item.locking !== 2")
                    .up(v-if="index !== lock_length", @click="sortItem(index, 'up')")
                    .down(v-if="index !== bannerList.length-1", @click="sortItem(index, 'down')")
              td
                .simple-td(v-if="item.value_type === 1") 商品信息
                .simple-td(v-if="item.value_type === 2") 服务信息
                .simple-td(v-if="item.value_type === 16") 养护卡
                .simple-td(v-if="item.value_type === 3") 商品分类
                .simple-td(v-if="item.value_type === 4") 服务分类
                .simple-td(v-if="item.value_type === 5") 平台内容
                .simple-td(v-if="item.value_type === 6") 品牌馆
                .simple-td(v-if="item.value_type === 7") 评论
                .simple-td(v-if="item.value_type === 8") 抽奖
                .simple-td(v-if="item.value_type === 9") 商品分类列表
                .simple-td(v-if="item.value_type === 10") 服务分类列表
                .simple-td(v-if="item.value_type === 11") 门店内容
                .simple-td(v-if="item.value_type === 12") 敬请期待
              td
                .operation-td
                  a.operation-link.left(v-if="item.locking !== 2" @click="openSetting(index, item.id)") 设置
                    ul.setting-block(v-if="item.setting_block === true")
                      li(v-for="setItem in set_list", @click.stop="goSettingBlock(setItem.type, index)", v-text="setItem.name")
                  a.operation-link(v-if="item.locking !== 2" @click="deleteItem(index)") 删除
                  div(v-if="item.locking === 2")
                    span.status-locked
                    span 已锁定
    // 空页面
    empty-page(v-if="is_empty && bannerList.length === 0", tip="当前没有轮播图")
    div.tip 建议上传尺寸为750x340的jpg/png格式文件，文件不能超过1M。
    .btn-wrapper
      .button-group
        a.button.primary.large(@click="saveData") 保存
    choose-product(v-model="show_product", v-if="show_product", :id="setting_id", @resolve="getProduct")
    choose-service(v-model="show_service", v-if="show_service", :id="setting_id", @resolve="getService")
    choose-brand(v-model="show_brand", v-if="show_brand", :id="setting_id", @resolve="getBrand")
    choose-card(v-model="show_card", v-if="show_card", :id="setting_id", @resolve="getCard")
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
// 养护卡
import ChooseCard from '@/components/basicInformation/modal/ChooseCard'
// 商品信息
import ChooseProduct from '@/components/basicInformation/modal/ChooseProduct'
// 服务信息
import ChooseService from '@/components/basicInformation/modal/ChooseService'
// 抽奖
import ChooseLottery from '@/components/basicInformation/modal/ChooseLottery'
// 内容
import ChoosePlatformContent from '@/components/basicInformation/modal/ChoosePlatformContent'
// 商品分类
import FirstProductCategory from '@/components/basicInformation/modal/FirstProductCategory'
// 商品分类列表
import SecondProductCategory from '@/components/basicInformation/modal/SecondProductCategory'
// 服务分类
import FirstServiceCategory from '@/components/basicInformation/modal/FirstServiceCategory'
// 服务分类列表
import SecondServiceCategory from '@/components/basicInformation/modal/SecondServiceCategory'
import ChooseStoreContent from '@/components/basicInformation/modal/ChooseStoreContent'
import ServiceTab from '@/components/generics/ServiceTab'
import EmptyPage from '@/components/generics/EmptyPage'  // 空页面组件
import UploadPic from '@/components/generics/form/UploadPic'    // 图片上传组建
import AdminApi from '@/mixins/modules/basicInformation'

export default {
  name: 'bannersPage',
  mixins: [AdminApi],
  components: {
    ServiceTab,
    EmptyPage,
    UploadPic,
    ChooseBrand,
    ChooseProduct,
    ChooseService,
    ChoosePlatformContent,
    ChooseLottery,
    ChooseStoreContent,
    FirstProductCategory,
    SecondProductCategory,
    FirstServiceCategory,
    SecondServiceCategory,
    ChooseCard,
  },
  data () {
    return {
      title: '轮播图',
      setting_id: '',
      show_brand: false,      // 控制品牌馆显隐
      show_card: false,      // 控制养护卡显隐
      pro_fir_cate: false,    // 控制选择商品分类项显隐
      pro_sec_cate: false,    // 控制选择商品分类列表显隐
      ser_fir_cate: false,     // 控制选择服务分类项显隐
      ser_sec_cate: false,    // 控制选择服务分类列表显隐
      show_product: false,    // 控制商品显隐
      show_service: false,    // 控制服务显隐
      show_platform_content: false,     // 控制内容显隐
      show_store_content: false,
      choose_lottery: false,    // 控制抽奖显隐
      bannerList: [],
      lock_length: 0,     // 锁定 Banner 长度
      is_empty: false,
      set_list: [
        {
          name: '商品信息',
          type: 1,
        },
        {
          name: '服务信息',
          type: 2,
        },
        {
          name: '养护卡',
          type: 16,
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
  methods: {
    // 添加内容
    addItem () {
      this.bannerList.forEach((item) => {
        item.setting_block = false
      })
      if (this.bannerList.length >= 6) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '最多添加6个轮播图',
        })
        return
      }
      let id = 0
      if (this.bannerList.length > 0) {
        // id = Number(this.bannerList[0].id) - 1
        this.bannerList.map(item => {
          id += Math.abs(Number(item.id))
        })
      }
      let obj = {
        id: 0 - id,
        pic: '',
        value_type: '',
        value_content: {},
        setting_block: false,
      }
      this.bannerList.splice(this.lock_length, 0, obj)
      // this.bannerList.unshift(obj)
    },
    /**
     * 设置
     * @ item
     */
    openSetting (index, id) {
      this.bannerList.forEach(function (item) {
        if (item.id === id) {
          item.setting_block = !item.setting_block
        } else {
          item.setting_block = false
        }
      })
      this.setting_id = id
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
        case 16:
          this.show_card = true
          break
      }
      this.bannerList.forEach(function (item) {
        item.setting_block = false
      })
      if (type === 12 || type === 7) {
        this.bannerList[index].value_type = type
      }
    },
    /**
     * 删除 item
     * @index {int} 序列号
     */
    deleteItem (index) {
      this.bannerList.splice(index, 1)
    },
    /**
     * 排序
     * @index {int} 序列号
     * @type {string} up or down
     */
    sortItem (index, type) {
      if (this.bannerList.length === 1) {
        return
      }
      let arr = [...this.bannerList]
      this.bannerList = []
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
      this.bannerList = [...arr]
    },
    // 保存数据
    saveData () {
      console.log(this.bannerList)
      this.bannerList.forEach(function (item) {
        item.setting_block = false
      })
      // if (this.bannerList.length === 0) {
      //   this.$store.dispatch('showMessage', {
      //     type: 'failure',
      //     title: '提示',
      //     content: '请添加轮播图',
      //   })
      //   return
      // }
      let isImg = false
      this.bannerList.forEach(item => {
        if (!item.pic) {
          isImg = true
        }
      })
      if (isImg) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '轮播图图片必填',
        })
        return
      }
      let isType = false
      this.bannerList.forEach(item => {
        if (!item.value_type) {
          isType = true
        }
      })
      if (isType) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '跳转类型必填',
        })
        return
      }
      this.saveBannerData()
    },
    // 保存接口
    async saveBannerData () {
      let params = []
      this.bannerList.forEach(item => {
        let obj = {}
        obj.pic = item.pic
        obj.value_type = item.value_type
        obj.value_content = item.value_content
        if (item.locking !== 2) {
          params.push(obj)
        }
      })
      try {
        const { result, response } = await this.saveBanner({
          data: params,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '保存成功',
              resolve: () => {
                // 返回上一级
                // this.$router.go(-1)
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存失败',
              content: `出错啦！错误码：${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: '创建发生错误，请稍后再试',
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 获取轮播图列表
    async getBannerListData () {
      this.lock_length = 0
      try {
        const { response, result } = await this.getBannerList()
        this.is_empty = true
        if (response.status === 200) {
          if (result.code === 0) {
            this.bannerList = result.data.map(item => {
              item.setting_block = false
              if (!item.locking) {
                item.locking = 1
              }
              if (item.locking === 2) {
                this.lock_length++
              }
              return item
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取轮播图列表出错',
              content: result.message,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取轮播图列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取轮播图列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    /**
   * 选择商品弹框的回调处理
   * @param {Object} 已选商品的数据
   * @id {Number, String} 触发该弹框的id
   */
    getProduct (params, id) {
      let arr = {
        id: params.product_id,
      }
      this.bannerList.forEach(item => {
        if (item.id === id) {
          item.pic = params.pic
          item.value_content = arr
          item.value_type = 1
        }
      })
    },
    /**
   * 选择服务弹框的回调处理
   * @param {Object} 已选服务的数据
   * @id {Number, String} 触发该弹框的id
   */
    getService (params, id) {
      let arr = {
        id: params.basic_spu_id,
      }
      this.bannerList.forEach(item => {
        if (item.id === id) {
          item.pic = params.pic
          item.value_content = arr
          item.value_type = 2
        }
      })
    },
    /**
     * 选择品牌馆弹框的回调处理
     * @param {Object} 已选品牌馆的数据
     * @id {Number, String} 触发该弹框的id
     */
    getBrand (params, id) {
      let arr = {
        id: params.id,
      }
      this.bannerList.forEach(item => {
        if (item.id === id) {
          item.pic = params.cover
          item.value_content = arr
          item.value_type = 6
        }
      })
    },
    /**
     * 选择品牌馆弹框的回调处理
     * @param {Object} 已选品牌馆的数据
     * @id {Number, String} 触发该弹框的id
     */
    getCard (params, id) {
      let arr = {
        id: params.id,
      }
      this.bannerList.forEach(item => {
        if (item.id === id) {
          item.pic = params.image_url
          item.value_content = arr
          item.value_type = 16
        }
      })
    },
    /**
   * 获取抽奖数据回调处理
   * @param {Object} 已选数据
   * @id {Number, String} 第二参数
   */
    getChooseLottery (params, id) {
      let arr = {
        id: params.activity_id,
      }
      this.bannerList.forEach(item => {
        if (item.id === id) {
          item.value_content = arr
          item.value_type = 8
        }
      })
    },
    /**
   * 选择平台内容弹框的回调处理
   * @param {Object} 已选内容的数据
   * @id {Number, String} 触发该弹框的id
   */
    getContent (params, id) {
      let arr = {
        id: params.id,
      }
      this.bannerList.forEach(item => {
        if (item.id === id) {
          item.pic = params.cover
          item.value_content = arr
          item.value_type = 5
        }
      })
    },
    /**
   * 选择门店内容弹框的回调处理
   * @param {Object} 已选内容的数据
   * @id {Number, String} 触发该弹框的id
   */
    getStoreContent (params, id) {
      let arr = {
        id: params.id,
      }
      this.bannerList.forEach(item => {
        if (item.id === id) {
          item.value_content = arr
          item.value_type = 11
        }
      })
    },
    // 选择商品分类
    getProFirCate (params, id) {
      let arr = {
        id: params.category_id,
      }
      this.bannerList.forEach(item => {
        if (item.id === id) {
          item.value_content = arr
          item.value_type = 3
        }
      })
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
      this.bannerList.forEach(item => {
        if (item.id === id) {
          item.value_content = arr
          item.value_type = 9
        }
      })
    },
    // 选择服务分类
    getSerFirCate (params, id) {
      let arr = {
        id: params.category_id,
      }
      this.bannerList.forEach(item => {
        if (item.id === id) {
          item.value_content = arr
          item.value_type = 4
        }
      })
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
      this.bannerList.forEach(item => {
        if (item.id === id) {
          item.value_content = arr
          item.value_type = 10
        }
      })
    },
  },
  mounted () {
    this.getBannerListData()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';

.section-layout {
  height: calc(100% - 48px);
}

.table-data {
  height: calc(100% - 90px) !important;
}

.content-wrapper {
  background: initial;
  margin-bottom: 0;
  margin-top: 0;
  height: calc(100% - 90px);
}

.section-filter-none.is-horizontal {
  height: 0;
  padding: 0;
}

.empty-page-wrapper {
  padding: 30px 0;
}

.simple-image .upload-pic.is-normal {
  width: 250px;
  height: 113px;
  background-color: gray;
  display: block;
}

.section-filter .add-button {
  bottom: initial;
}

.up, .down {
  position: absolute;
  top: 55px;
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

.btn-wrapper {
  text-align: right;
  position: fixed;
  bottom: 40px;
  right: 0;
  padding: 23px 40px 0;
}

.setting-block {
  position: absolute;
  top: 15px;
  left: 28px;
  background: #f0f1f2;
  width: 100px;
  z-index: 3;
  box-sizing: border-box;
  border-radius: 2px;
  height: calc(100% - 10px);
  overflow-y: auto;

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

.simple-td, .operation-td {
  margin-top: 38px;
}

.status-locked {
  display: block;
  float: left;
  margin-top: 11px;
  width: 16px;
  height: 16px;
  margin-right: 3px;
  background-image: url('~@/assets/lock.svg');
}

.tip {
  position: fixed;
  bottom: 40px;
  padding: 23px 40px 0;
  white-space: nowrap;
  font-size: 14px;
  color: rgb(255, 0, 0);
}
</style>


