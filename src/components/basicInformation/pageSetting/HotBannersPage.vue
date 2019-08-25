<template lang="pug">
  .section-layout.content-box
    .section-filter.is-horizontal.section-filter-none
      span.add-button(@click="addItem()")
    empty-page(v-if="!(hot_banner_list && hot_banner_list.length) && showPage", :tip="'当前没有爆款'")
    .content-wrapper.list-wrapper(v-if="hot_banner_list && hot_banner_list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="80") 商品/服务信息
              td(width="60") 型号
              td(width="70") 排序
              td(width="70") 跳转类型
              td(width="140") 操作
          tbody(v-if="hot_banner_list.length")
            tr(v-for="(item, index) in hot_banner_list")
              td
                upload-pic.cover-img(v-model="item.pic_url", :img-id="index", :default-img="defaultImgSrc", is-original=true)

              td
                .simple-td( v-if='item.product_name', v-text="item.product_name")
                .simple-null(v-else) - -
              td.tr-p
                .up(v-if="index !== 0", @click="sortItem(index, 'up')")
                .down(v-if="index !== hot_banner_list.length-1", @click="sortItem(index, 'down')" )
              td
                .simple-td(v-if="item.type === 1") 商品信息
                .simple-td(v-if="item.type === 2") 服务信息
                .simple-td(v-if="item.type === 16") 养护卡
              td
                .operation-td
                  a.operation-link.left(@click="openSetting(item, index)") 设置
                    ul.setting-block(v-if="item.setting_block === true")
                      li(v-for="(setItem, cindex) in setList", @click.stop="goSettingBlock(setItem, item, index)", v-text="setItem.name")
                  a.operation-link(@click="deleteItem(index)")  删除
          .tfoot(v-if="hot_banner_list.length")
    .btn-wrapper
      .button-group
        a.button.primary.large(@click="saveData") 保存
    // 选择商品弹框
    choose-product(v-model="show_product", v-if="show_product", :id="currentItem.product_id", @resolve="getProduct")

    // 选择服务弹框
    choose-service(v-model="show_service", v-if="show_service", :id="currentItem.product_id", @resolve="getService")

    choose-card(v-model="show_card", v-if="show_card", :id="currentItem.product_id", @resolve="getCard")
</template>

<script>

  import imageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import UploadPic from '@/components/generics/form/UploadPic'
  import ChooseProduct from '@/components/basicInformation/modal/ChooseProduct'
  import ChooseService from '@/components/basicInformation/modal/ChooseService'
  import adminApi from '@/mixins/modules/basicInformation'
  // 养护卡
  import ChooseCard from '@/components/basicInformation/modal/ChooseCard'

  export default {
    name: 'hotBannersPage',

    data () {
      return {
        // 默认图片
        defaultImgSrc: '',
        // 设置浮层
        setting_block: false,
        // 选择弹窗展示隐藏
        show_product: false,
        show_service: false,
        // 缺省页的控制
        showPage: false,
        show_card: false,
        hot_banner_list: [],
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
            name: '养护卡',
            type: 16,
          },
        ],
      }
    },

    mixins: [imageScale, adminApi],
    components: {
      EmptyPage,
      UploadPic,
      ChooseProduct,
      ChooseService,
      ChooseCard,
    },
    async mounted () {
      await this.fetchData()
    },
    methods: {
      /**
       * 获取爆品列表
       * @returns {Promise<void>}
       */
      async fetchData () {
        try {
          const {response, result} = await this.hotList()
          if (response.status === 200 && result.code === 0) {
            result.data.forEach(function (item) {
              item.setting_block = false
            })
            this.showPage = true
            this.hot_banner_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取爆品列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
            this.showPage = false
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取爆品列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
          this.showPage = false
        }
      },

      /**
       * 选择商品弹框的回调处理
       * @param {Object} 已选商品的数据
       * @id {Number, String} 触发该弹框的id
       */
      getProduct (params) {
        this.formateData(params)
      },

      /**
       * 选择服务弹框的回调处理
       * @param {Object} 已选服务的数据
       * @id {Number, String} 触发该弹框的id
       */
      getService (params) {
        let _this = this
        let index = this.currentIndex
        this.hot_banner_list[index].product_id = params.basic_spu_id
        this.hot_banner_list[index].product_name = params.name
        this.hot_banner_list[index].pic_url = params.pic
        this.hot_banner_list[index].type = _this.currentSelectItem.type
      },

      /**
       * 选择养护卡的回调处理
       * @param {Object} 已选品牌馆的数据
       * @id {Number, String} 触发该弹框的id
       */
      getCard (params, id) {
        let arr = {
          id: params.id,
        }
        this.hot_banner_list.forEach(item => {
          if (item.product_id === id) {
            item.pic_url = params.image_url
            item.product_id = params.id
            item.product_name = params.name
            item.value_content = arr
            item.type = 16
          }
        })
      },

      /**
       * @param {Object} 已选商品的数据
       * */
      formateData (params) {
        let _this = this
        let index = this.currentIndex
        this.hot_banner_list[index].product_id = params.product_id
        this.hot_banner_list[index].product_name = params.name
        this.hot_banner_list[index].pic_url = params.sku_pic
        this.hot_banner_list[index].type = _this.currentSelectItem.type
      },

      /**
       * 新增爆品
       * @index {int} 序列号
       * @type {string} up or down
       */
      addItem () {
        this.hot_banner_list.forEach(function (item) {
          item.setting_block = false
        })
        if (this.hot_banner_list.length >= 4) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '最多添加4个爆款',
          })
          return
        }
        let arr = [...this.hot_banner_list]
        this.hot_banner_list = []
        arr.unshift({
          pic_url: '',
          product_name: '',
          type: 0,
          product_id: 0 - arr.length,
          setting_block: false,
        })
        this.hot_banner_list = [...arr]
      },

      /**
       * 排序
       * @index {int} 序列号
       * @type {string} up or down
       */
      sortItem (index, type) {
        let arr = [...this.hot_banner_list]
        this.hot_banner_list = []
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
        this.hot_banner_list = [...arr]
      },

      /**
       * 打开设置模块框
       * @ item
       */
      openSetting (items, index) {
        let self = this
        for (var i = 0; i < this.hot_banner_list.length; i++) {
          if (i === parseInt(index)) {
            self.hot_banner_list[i].setting_block = !self.hot_banner_list[i].setting_block
          } else {
            self.hot_banner_list[i].setting_block = false
          }
        }
      },

      /**
       * 选择模块项
       * @ item
       */
      goSettingBlock (selectItem, item, index) {
        this.hot_banner_list.forEach(function (item) {
          item.setting_block = false
        })
        this.currentSelectItem = selectItem
        this.currentItem = item
        this.currentIndex = index
        switch (this.currentSelectItem.type) {
          case 1:
            this.show_product = true
            this.show_service = false
            this.show_card = false
            break
          case 2:
            this.show_service = true
            this.show_product = false
            this.show_card = false
            break
          case 16:
            this.show_service = false
            this.show_product = false
            this.show_card = true
            break
        }
      },

      /**
       * 删除爆品
       * @ item  品牌馆对象
       */
      deleteItem (index) {
        this.hot_banner_list.splice(index, 1)
      },

      /**
       * 保存操作
       * */
      async saveData () {
        let self = this
        let params = []
        let isCanSave = true
        let isCanSaveImg = true
        let isSaveType = true
        self.hot_banner_list.forEach(function (e, i) {
          if (!e.product_id) {
            isCanSave = false
          }
          if (!e.pic_url) {
            isCanSaveImg = false
          }
          if (!e.type) {
            isSaveType = false
          }
        })
        if (!isCanSave) {
          self.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: '数据不合法',
          })
          return false
        }
        if (!isCanSaveImg) {
          self.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: '图片不能为空',
          })
          return false
        }
        if (!isSaveType) {
          self.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: '跳转数据类型不能为空',
          })
          return false
        }
        self.hot_banner_list.forEach(function (item) {
          if (item.product_id && item.pic_url && item.type) {
            params.push({
              product_id: item.product_id,
              pic_url: item.pic_url,
              type: item.type,
            })
          }
        })
        try {
          const {response, result} = await this.updateHotList({ list: params })
          if (response.status === 200 && result.code === 0) {
            self.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '保存成功',
              resolve: () => {
                this.$emit('success')
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存失败',
              content: `${result.message}`,
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
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .list-wrapper
    padding-bottom 120px!important
  .section-filter-none.is-horizontal
    height 0
    padding 0
  .section-filter .add-button
    bottom initial
  .section-layout
    padding-top 0!important
  .section-filter
    height 0
    padding 0
  .operation-link
    position relative
  table td
    vertical-align middle
  .setting-block
    position absolute
    top: 6px
    left 32px
    background #f0f1f2
    z-index 1000
    width 70px
    box-sizing border-box
    border-radius 2px
    li
      color: #999
      padding 10px
      line-height 12px
      font-size 12px
    li:hover
      background #ffc723
      color: white
  .content-box
    height: calc(100% - 48px)
  .cover-img img
    height 102px
  .section-filter
    display flex
    justify-content space-between
  .name_keyword-wrapper
    width 244px
  .button
    align-items center
  .give-icon
    display none
  .left
    margin-right 10px !important
  .add-icon
    display inline-flex
    width 16px
    height 16px
    background url('~@/assets/icons/button-add.svg') no-repeat center center
    background-size cover
    margin-right 6px
  .gray
    color #989ba1
  .justify-center
    justify-content center
  .operation-link
    margin-right 0
  .text-overflow
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  .section-layout
    position relative
    padding-top 40px
    .add-button
      position absolute
      right 40px
      top 0
  .tr-p
    position relative
    .up
    .down
      position absolute
      top 47px
      width 20px
      height 30px
      opacity .5
      cursor pointer
      &.is-disable
        opacity .2
        pointer-events none
      &:hover
        opacity 1
    .up
      left 0
      background center no-repeat url('~@/assets/icons/move-up.svg')
      background-size 20px 30px
    .down
      left 25px
      background center no-repeat url('~@/assets/icons/move-down.svg')
      background-size 20px 30px
    .delete
      position absolute
      top 8px
      right 8px
      width 16px
      height 16px
      background center no-repeat url('~@/assets/icons/trash.svg')
      cursor pointer
  .btn-wrapper
    margin-top 20px
    text-align right
    position fixed
    bottom 40px
    right 0
    padding 23px 40px 0
    .large
      width 120px
</style>


