<template lang="pug">
  .section-layout
    .content-wrapper
      h2 {{!is_edit? '新建次卡' : '编辑次卡'}}
      .form-wrapper
        .group-title 基本信息
        .field-group
          .field.is-horizontal
            label.label 名称
            custom-input(v-model.trim="info.name"
            maxlength="10"
            placeholder="请输入养护卡名称"
            :validator="$v.info.name"
            error-info="养护卡名称必填且小于等于10个字"
            )
          .field.is-horizontal(style="width: 800px")
            label.label 卡面
            .cover-list
              .cover(
              v-if="cove_list && cove_list.length"
              :class = "item.image_url === info.image_url ? 'checked' : ''"
              v-for="(item, index) in cove_list"
              @click="chooseCove(item)")
                img.is-click(:src="scaleImage(item.image_url, 1, 112, 70)")

              //- 可选的上传图片组件，可自己创建卡面
              .optional-image(:class="store_build == info.image_url && is_image_customized ? 'checked' : ''")
                optional-upload(v-model="store_build", @optionalImage="optionalPic", :img-type="''", :img-id="100", @input="optionalPicBack")

              .cover-null(v-if="cove_list && !cove_list.length") 暂无封面,请联系管理员添加养护卡封面
          .field.is-horizontal(style="margin-top: 4px; font-size: 13px;color: red")
            label.label
            .tips 为了更好的展示效果，建议上传卡面尺寸1035X642，大小小于1M
          .field.is-horizontal
            label.label 分类
            custom-select(
            v-model="classify",
            :list="classify_list",
            nameField="name",
            @input="changeClassify",
            :show-search="false"
            :validator="$v.info.classify"
            error-info="分类不能为空")
          .field.is-horizontal
            label.label 销售价格
            custom-input(
            v-model="info.price"
            input-type="hasCount"
            need-type="float"
            placeholder="请输入销售价格",
            :validator="$v.info.price"
            error-info="请输入大于0小于999999.99的价格精确到小数点后2位")
              span(slot="countInfo") 元
          .field.is-horizontal
            label.label 卡片原价
            custom-input(
            v-model="info.origin_price"
            input-type="hasCount"
            need-type="float"
            placeholder="请输入卡片原价",
            :validator="$v.info.origin_price"
            error-info="请输入大于0小于999999.99的价格精确到小数点后2位")
              span(slot="countInfo") 元
          .field.is-horizontal
            label.label 图文详情
            .upLoad-image
              upload-pic(v-model="info.content", img-type="info.content", :img-id="22")
              .txt 图片宽度建议900px，不能大于5M
        .group-title 使用须知
        .field-group
          .field.is-horizontal
            label.label 有效期
            custom-input(
            v-model.number="info.expiry"
            need-type="number"
            input-type="hasCount"
            maxlength="2"
            placeholder="请输入有效期"
            :validator="$v.info.expiry"
            error-info="有效期必填并且是1-99的整数")
              span(slot="countInfo") 月
          .field.is-horizontal(style="width: 620px")
          .field.is-horizontal
            label.label 使用规则
            rich-editor(
            v-model="info.description"
            class="description"
            style="width: 500px"
            ref="editor")
        .group-title
          span 卡内项目
          div
            a.button.primary.large(@click="addGoods") 新增项目
        .content-wrapper.list-wrapper
          .table-wrapper
            table.table
              thead
                tr
                  td(width="80") 项目名称
                  td(width="80") 项目描述
                  td(width="80") 次数（未填写视为不限次)
                  td(width="80") 操作
              tbody.hide-hover(v-if="items && items.length")
                tr(v-for="(item, index) in items")
                  td
                    .simple-td
                      custom-input(
                      v-model="item.name"
                      :list="arr_name"
                      maxlength="15"
                      placeholder="项目名称"
                      :validator="$v.items.$each[index].name"
                      error-info="项目名称必填且小于等下15个字")
                  td
                    .simple-td
                      custom-input(
                      v-model="item.description"
                      maxlength="30"
                      :open-show-big ="true"
                      placeholder="项目描述"
                      :validator="$v.items.$each[index].description"
                      error-info="项目描述必填且小于等下30个字")
                  td
                    .simple-td.has-text
                      custom-input(
                      v-model="item.num"
                      input-type="hasCount"
                      placeholder="无限次"
                      need-type="number"
                      :validator="$v.items.$each[index].num"
                      error-info="请输入1-99的整数")
                        span(slot="countInfo") 次
                  td
                    .operation-td
                      span.operation-link(@click="deleteGoods(index)") 删除
            empty-page(v-if="items && !items.length", :tip="'暂无项目'")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="saveData") 完成
          a.button.large(@click="cancleCreate") 取消
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import CustomTextarea from '@/components/generics/form/CustomTextarea'
  import SelectTime from '@/components/generics/SelectTime'
  import UploadPic from '@/components/generics/form/UploadPic'
  import EmptyPage from '@/components/generics/EmptyPage'
  import imageScale from '@/mixins/utilities/imageScale'
  import RichEditor from '@/components/generics/form/RichEditor'

  import Api from '@/mixins/modules/productService'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  import { wordLength } from '@/mixins/custom-validators/custom-validators'

  // 可选中的上传图片组件
  import OptionalUpload from '@/components/productService/modal/OptionalUploadPic'

  export default {
    name: 'CardSelfBuild',
    mixins: [validationMixin, Api, imageScale],
    components: {
      CustomInput,
      CustomSelect,
      SelectTime,
      CustomTextarea,
      EmptyPage,
      UploadPic,
      RichEditor,
      OptionalUpload,
    },
    data () {
      return {
        // 基本信息
        info: {
          name: '',
          cover_checked_id: 0,
          image_url: '',
          classify: null,
          num: 1,
          origin_price: '', // 原价
          price: '', // 价格
          content: '', // 图文详情, 一张图
          expiry: '', // 有效期
          begin_time: '', // 开始时间
          end_time: '', // 结束时间
          description: '', // 使用规则
        },
        // 项目
        items: [
          {
            name: '',
            description: '',
            price: '',
            num: '',
            is_end: false,
          },
        ],
        is_edit: false, // 是否处于编辑状态
        card_id: '', // 养护卡 id
        cove_list: [], // 封面列表
        classify: {}, // 选中分类
        classify_list: [], // 分类列表
        card: null, // 临时缓存信息
        arr_name: [], // 所有商品服务名称
        store_build: '',       // 门店自建卡面零时的展示
        is_image_customized: false,   // 是否时自建的卡面
      }
    },
    methods: {
      // 保存
      saveData () {
        this.$v.$touch()
        if (this.$v.info.name.$error || this.$v.info.classify.$error || this.$v.info.price.$error || this.$v.info.origin_price.$error) {
          document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
          return
        }
        if (this.$v.info.expiry.$error) {
          document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 350)
          return
        }
        if (this.$v.$error) {
          return
        }
        if (this.info.description) {
          let str = this.info.description.replace(/\s+/g, '')
          if (str === '<p></p>') {
            this.$store.dispatch('showMessage', {
              type: 'warning',
              title: '警告',
              content: '规则不能输入空格',
            })
            return
          }
        }
        // 1. 图文详情不能为空
        if (!this.info.content) {
          document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 350)
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '图文详情不能为空',
          })
          return
        }
        // 2. 项目不能为空
        if (this.items && !this.items.length) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '项目不能为空',
          })
          return
        }
        let params = {
          info: {
            name: this.info.name,
            image_url: this.info.image_url,
            category_id: this.info.classify.id,
            price: this.info.price * 100,
            origin_price: this.info.origin_price * 100,
            content: this.info.content,
            expiry: this.info.expiry,
            description: this.info.description ? this.info.description : '',
            is_image_customized: this.is_image_customized ? 1 : 2,
          },
        }
        let arr = []
        this.items.forEach(item => {
          let obj = {
            price: 0,
            num: item.num === '' ? 0 : item.num,
            is_end: 2,
            description: item.description,
            name: item.name,
          }
          if (this.card_id) {
            obj.id = item.id
          }
          arr.push(obj)
        })
        params.item = arr
        if (this.card_id) {
          params.info.id = this.card_id - 0
          this.updateInfo(params)
        } else {
          this.saveInfo(params)
        }
      },
      /*
      * 添加接口
      * params 请求数据
      * */
      async saveInfo (params) {
        try {
          const {response, result} = await this.upkeepAddApi(params)
          if (response.status === 200) {
            if (result.code && result.code !== 0) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '养护卡添加失败',
                content: `${result.message}`,
              })
              this.isLoading = false
              return false
            }
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '养护卡添加成功',
              resolve: () => {
                this.$router.push({
                  name: 'cardManagementList',
                })
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '养护卡编辑失败',
              content: `${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '养护卡添加失败',
            content: `服务异常，请稍后再试（${err.message}）`,
          })
        }
      },
      // 养护卡编辑操作
      async updateInfo (obj) {
        try {
          obj.info.id = this.card_id
          const {response, result} = await this.upkeepSaveApi(obj)
          if (response.status === 200) {
            if (result.code && result.code !== 0) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '养护卡编辑失败',
                content: `${result.message}`,
              })
              this.isLoading = false
              return false
            }
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '养护卡编辑成功',
              resolve: () => {
                this.$router.push({
                  name: 'cardManagementList',
                })
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '养护卡编辑失败',
              content: `${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '养护卡编辑失败',
            content: `服务异常，请稍后再试（${err.message}）`,
          })
        }
      },
      // 获取详情
      async getDetail () {
        try {
          const { response, result } = await this.upkeepDetailApi({
            id: this.card_id,
          })
          if (response.status === 200 && result.code === 0) {
            this.info = result.data.info
            this.info.classify = {
              id: this.info.category_id,
              name: this.info.category_name,
            }
            // this.is_image_customized = this.info.is_image_customized === 1 ? true : false
            // 如果自建卡面的字段is_image_customized = 1则需要将自建卡面字段is_image_customized，store_build附上值，
            if (this.info.is_image_customized === 1) {
              this.is_image_customized = true
              this.store_build = this.info.image_url
            } else {
              this.is_image_customized = false
              this.store_build = ''
            }
            this.info.price = this.info.price / 100
            this.info.origin_price = this.info.origin_price / 100
            this.items = result.data.item.map(item => {
              item.price = item.price / 100
              item.num = item.num === 0 ? '' : item.num
              return item
            })
            this.$refs.editor.info(this.info.description)
            this.getClassifyData() // 分类数据
            this.getTemplateList() // 封面模版
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡详情失败',
              content: '获取养护卡详情失败，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡详情失败',
            content: `服务异常，请稍后再试（${
              err.response ? err.response.status : err
              }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 获取所有商品、服务名称, 供项目名称输入联想
      async getPSName () {
        try {
          const { response, result } = await this.getPSNameApi({
            id: this.card_id,
          })
          if (response.status === 200 && result.code === 0) {
            this.arr_name = result.data
          }
        } catch (err) {
          console.error('getPSName', err)
        }
      },
      // 获取分类数据
      async getClassifyData () {
        try {
          const { response, result } = await this.upkeepCategoryApi()
          if (response.status === 200 && result.code === 0) {
            this.classify_list = result.data
            // 如果是编辑
            if (this.is_edit) {
              this.classify_list.forEach(item => {
                if (item.id === this.info.category_id) {
                  this.classify = item
                }
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡分类失败',
              content: '获取养护卡分类失败，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡分类失败',
            content: `服务异常，请稍后再试（${
              err.response ? err.response.status : err
              }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 获取模版
      async getTemplateList () {
        let _this = this
        try {
          const { response, result } = await this.getTemplateListApi()
          if (response.status === 200 && result.code === 0) {
            this.cove_list = result.data
            // 没有数据
            if (result.data && !result.data.length) {
              return
            }

            // 新建默认第一个,  编辑、 如果已选模版被禁用, 也要默认第一个
            if (this.is_edit) {
              let has = this.cove_list.some(item => {
                return item.image_url === _this.info.image_url
              })
              // 出去自建卡面，其他情况显示第一个
              if (!has && this.info.is_image_customized !== 1) {
                this.info.image_url = result.data[0].image_url
              }
            } else {
              this.info.image_url = result.data[0].image_url
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡封面模版失败',
              content: '获取养护卡封面模版失败，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡封面模版失败',
            content: `服务异常，请稍后再试（${
              err.response ? err.response.status : err
              }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      /**
       * 选中封面
       * item 选中的item
       */
      chooseCove (item) {
        this.info.cover_checked_id = item.id
        this.info.image_url = item.image_url
        // 选中壳牌养护卡卡面时，将自建的卡面选中样式去除
        this.is_image_customized = false
      },

      // 选中图片
      optionalPic (e) {
        if (this.store_build === '') return false
        this.is_image_customized = true
        this.info.image_url = this.store_build
      },

      // 自定义卡面上传图片回调
      optionalPicBack (e) {
        this.is_image_customized = true
        this.info.image_url = this.store_build
      },

      // 选择分类
      changeClassify (e) {
        this.info.classify = {
          id: e.id,
          name: e.name,
        }
      },
      // 删除图片
      deleteImage (url) {
        const index = this.info.content.findIndex(val => val === url)
        this.info.content.splice(index, 1)
      },
      // 添加项目
      addGoods () {
        let object = {
          name: '',
          description: '',
          price: '',
          num: '',
          is_end: false,
        }
        if (this.card_id) object.id = 0
        this.items.push(object)
      },
      /**
       * 删除项目
       * index 序列
       */
      deleteGoods (index) {
        this.items.splice(index, 1)
      },
      // 取消创建
      cancleCreate () {
        this.$router.push({
          name: 'cardManagementList',
        })
      },
    },
    validations: {
      info: {
        name: {
          required,
          validate (val) {
            return wordLength(val) <= 10
          },
        },
        classify: {required},
        price: {
          required,
          validate (val) {
            return /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9][0-9]{0,5}(\.\d{1,2}){0,1}$/.test(val)
          },
        },
        origin_price: {
          required,
          validate (val) {
            return /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9][0-9]{0,5}(\.\d{1,2}){0,1}$/.test(val)
          },
        },
        expiry: {
          required,
          validate (val) {
            return /^\+?(([1-9]\d?)|(99)|(1))$/.test(val)
          },
        },
      },
      items: {
        $each: {
          name: {required},
          num: {
            validate (val) {
              if (val === '') {
                return true
              } else {
                return /^\+?(([1-9]\d?)|(99)|(1))$/.test(val)
              }
            },
          },
          description: {required},
        },
      },
    },
    mounted () {
      this.card_id = this.$route.query.id
      if (this.card_id) {
        this.is_edit = true
        this.getDetail()
      } else {
        this.getClassifyData() // 分类数据
        this.getTemplateList() // 封面模版
      }
      this.getPSName()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal';

  .btn-wrapper .button.primary{
    width: 145px;
  }
  .content-wrapper.list-wrapper{
    margin-left: 0;
    min-height 300px;
  }
  .hide-hover{
    tr:hover{
      box-shadow: none;
    }
    tr:hover td:first-child{
      border-left: 2px solid transparent
    }
    tr td {
    padding-right: 10px
    }
    tr td.has-text{
      padding-right: 30px;
    }
  }
  .is-click
    cursor pointer
  .select-time
    width 80px !important

  .default{
    width: 100%;
    line-height: 200px;
    text-align: center;
    color: #999;
  }


  .cover-list{
    display: flex;
    justify-content: flex-start;
    -webkit-flex-wrap:wrap;
    flex-wrap:wrap;
    .cover{
      margin-right: 10px;
      width: 118px;
      height: 76px;
      background: #fefefe;
      border: 3px solid #fefefe;
    }
    .cover.checked{
      border:3px solid #ffc723
    }
    .cover-null{
      font-size: 12px
    }
    .optional-image {
      width: 118px;
      height: 76px;
      background: #fefefe;
      border: 3px solid #fefefe;
    }
    .optional-image.checked{
      border:3px solid #ffc723
    }
  }

  .upLoad-image
    display inline-block
    margin-top 4px
    .txt
      font-size 12px
      color #666
      margin-top 12px

  .group-title{
    font-size: 12px;
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    padding-right: 40px;
    // align-items: center;
  }

  .table-wrapper .empty-page-wrapper {
    min-height 300px
  }

  .simple-td {
    overflow visible
  }

  .description
    width 400px
    >>> .ql-toolbar
      display none
    >>> .ql-container
      border-top 1px solid #ccc !important
</style>
