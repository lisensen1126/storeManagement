<template lang="pug">
  .section-layout
    .content-wrapper
      h2 {{!is_edit? '新建养护卡' : '编辑养护卡'}}
      .form-wrapper
        .group-title 基本信息
        .field-group
          .field.is-horizontal
            label.label 名称
            custom-input(v-model.trim="info.name"
            placeholder="请输入养护卡名称"
            maxlength="10"
            :validator="$v.info.name"
            error-info="养护卡名称必填且小于等于10个字")
          .field.is-horizontal(style="width: 800px;")
            label.label 卡面
            .cover-list(style='flex-wrap: wrap;')
              .cover(
              v-if="cove_list && cove_list.length"
              :class = "item.image_url == info.image_url ? 'checked' : ''"
              v-for="(item, index) in cove_list"
              @click="chooseCove(item)")
                img(:src="scaleImage(item.image_url, 1, 112, 70)")

              //- 可选的上传图片组件，可自己创建卡面
              .optional-image(:class="store_build == info.image_url && is_image_customized ? 'checked' : ''")
                optional-upload(v-model="store_build", @optionalImage="optionalPic", :img-type="''", :img-id="101", @input="optionalPicBack")

              .cover-null(v-if="cove_list && !cove_list.length") 暂无封面,请联系管理员添加养护卡封面
          .field.is-horizontal(style="margin-top: 4px; font-size: 13px;color: red")
            label.label
            .tips 为了更好的展示效果，建议上传卡面尺寸1035X642，大小小于1M
          .field.is-horizontal
            label.label 分类
            custom-select(
            v-model="info.classify",
            :list="classify_list",
            ref="typeSelect",
            nameField="name",
            :validator="$v.info.classify"
            error-info="分类不能为空")
          .field.is-horizontal.width-563
            label.label 使用次数
            custom-input(
            v-model.number="info.num"
            type="number"
            input-type="hasCount"
            maxlength="2"
            need-type='number'
            placeholder="请输入使用次数"
            :validator="$v.info.num"
            error-info="使用次数必须是1-99正整数")
              span(slot="countInfo") 次 
            .marginl-20
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", content="使用次数是指本养护卡可使用卡内项目的次数，免激活项目次数不计入该次数中。")
                .el-icon-question(slot="reference")
          .field.is-horizontal
            label.label 销售价格
            custom-input(
            v-model="info.price"
            input-type="hasCount"
            need-type='float'
            placeholder="请输入销售价格",
            :validator="$v.info.price"
            error-info="请输入大于0小于999999.99的价格精确到小数点后2位")
              span(slot="countInfo") 元
          .field.is-horizontal
            label.label 卡片原价
            custom-input(
            v-model="info.origin_price"
            input-type="hasCount"
            need-type='float'
            placeholder="请输入原价",
            :validator="$v.info.origin_price"
            error-info="请输入大于0小于999999.99的价格精确到小数点后2位")
              span(slot="countInfo") 元
          .field.is-horizontal
            label.label 图文详情
            .upLoad-image
              upload-pic(v-model="info.content", img-type="info.content",img-id="1")
              .txt 建议图片宽度900px，不大于5M
        .group-title 使用须知
        .field-group
          .field.is-horizontal
            label.label 有效期
            custom-input(
            v-model.number="info.expiry"
            input-type="hasCount"
            need-type='number'
            maxlength="2"
            placeholder="请输入有效期"
            :validator="$v.info.expiry"
            error-info="有效期必须是1-99正整数")
              span(slot="countInfo") 月
          .field.is-horizontal
            label.label 使用规则
            rich-editor(
            v-model="info.description"
            class="description"
            style="width: 500px"
            ref="editor"
            :validator="$v.info.description"
            error-info="规则必填")
        .group-title
          span 卡内项目 (项目总次数不可少于卡使用次数，最终项目次数将不计入卡使用次数)
          div
            a.button.primary.large(@click="addGoods") 新增项目
        .content-wrapper.list-wrapper(style="overflow: inherit;")
          .table-wrapper(style="overflow: inherit;")
            table.table
              thead
                tr
                  td(width="80") 项目名称
                  td(width="80") 项目描述
                  td(width="100") 次数（小于等于卡使用次数）
                  td(width="80") 是否为最终项目
                  td(width="60") 操作
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
                      placeholder="项目描述"
                      :validator="$v.items.$each[index].description"
                      error-info="项目描述必填且小于等下30个字")
                  td
                    .simple-td.has-text
                      custom-input(
                      v-model="item.num"
                      :isDisabled="item.is_end"
                      input-type="hasCount"
                      need-type='number'
                      placeholder="请输入次数"
                      :validator="$v.items.$each[index].num"
                      error-info="使用次数必须是小于100的正整数")
                        span(slot="countInfo") 次
                  td
                    .simple-td
                      .switch
                        input(type="checkbox", :id="index", v-model="item.is_end" @change="isEndChange(item, index)")
                        label(:for="index")
                  td
                    .operation-td
                      span.operation-link(@click="deleteGoods(index)") 删除
            empty-page(v-if="items && !items.length", :tip="'暂无项目'")
        .group-title
          span 免激活项目
          div
            a.button.primary.large(@click="addProject") 新增项目
        .content-wrapper.list-wrapper(v-if="project && project.length > 0", style="overflow: inherit;")
          .table-wrapper(style="overflow: inherit;")
            table.table
              thead
                tr
                  td(width="80") 项目名称
                  td(width="80") 项目描述
                  td(width="80") 免激活次数（未填写视为不限次)
                  td(width="80") 免激活时间
                  td(width="80") 操作
              tbody.hide-hover
                tr(v-for="(item, index) in project")
                  td
                    .simple-td
                      custom-input(
                      v-model="item.name"
                      :list="arr_name"
                      maxlength="15"
                      placeholder="项目名称"
                      :validator="$v.project.$each[index].name"
                      error-info="项目名称必填且小于等下15个字")
                  td
                    .simple-td
                      custom-input(
                      v-model="item.description"
                      maxlength="30"
                      placeholder="项目描述"
                      :validator="$v.project.$each[index].description"
                      error-info="项目描述必填且小于等于30个字")
                  td
                    .simple-td.has-text
                      custom-input(
                      v-model="item.num"
                      type="number"
                      input-type="hasCount"
                      need-type='number'
                      placeholder="无限次"
                      :validator="$v.project.$each[index].num"
                      error-info="使用次数必须是小于100的正整数")
                        span(slot="countInfo") 次
                  td
                    .simple-td.has-text
                      custom-input(
                      v-model="item.expiry"
                      type="number"
                      input-type="hasCount"
                      need-type='number'
                      placeholder="请输入免激活时间"
                      :validator="$v.project.$each[index].expiry"
                      error-info="必须是1-99正整数")
                        span(slot="countInfo") 月
                  td
                    .operation-td
                      span.operation-link(@click="deleteProject(index)") 删除
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="goSettingRelation") 设置关联商品
          a.button.large(@click="cancleCreate") 取消
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import SelectTime from '@/components/generics/SelectTime'
  import UploadPic from '@/components/generics/form/UploadPic'
  import EmptyPage from '@/components/generics/EmptyPage'
  import RichEditor from '@/components/generics/form/RichEditor'
  import Api from '@/mixins/modules/productService'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  import { wordLength } from '@/mixins/custom-validators/custom-validators'
  import imageScale from '@/mixins/utilities/imageScale'

  // 可选中的上传图片组件
  import OptionalUpload from '@/components/productService/modal/OptionalUploadPic'

  export default {
    name: 'maintenanceCardAdd',
    mixins: [validationMixin, Api, imageScale],
    components: {
      CustomInput,
      CustomSelect,
      SelectTime,
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
            num: 1,
            is_end: false,
          },
        ],
        // 免激活项目
        project: [],
        is_edit: false, // 是否处于编辑状态
        cove_list: [], // 封面列表
        classify_list: [], // 分类列表
        card: null, // 临时缓存信息
        temp_goods_list: [],
        temp_serves_list: [],
        arr_name: [], // 所有商品服务名称
        store_build: '',       // 门店自建卡面零时的展示
        is_image_customized: false,   // 是否时自建的卡面
      }
    },
    methods: {
      // 获取分类数据
      async getClassifyData () {
        try {
          const { response, result } = await this.upkeepCategoryApi()
          if (response.status === 200 && result.code === 0) {
            this.classify_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡分类失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error('养护卡分类', err)
        }
      },
      // 获取模版列表
      async getTemplateList () {
        let _this = this
        try {
          const { response, result } = await this.getTemplateListApi({
            status: 1, // 1启用 2禁用
          })
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
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '养护卡模板')
        }
      },
      // 获取商养护卡详情  返回的数据需要处理
      async fetchDetail () {
        let _this = this
        try {
          const { response, result } = await this.upkeepDetailApi({
            id: this.$route.query.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.info = result.data.info
            this.info.price = (result.data.info.price / 100).toFixed(2)
            this.info.origin_price = (result.data.info.origin_price / 100).toFixed(2)
            // 如果自建卡面的字段is_image_customized = 1则需要将自建卡面字段is_image_customized，store_build附上值，
            if (this.info.is_image_customized === 1) {
              this.is_image_customized = true
              this.store_build = this.info.image_url
            } else {
              this.is_image_customized = false
              this.store_build = ''
            }
            let obj = this.classify_list.find(item => _this.info.category_id ? item.id === _this.info.category_id : false) || {}
            this.$refs.typeSelect.selectCandidate(obj)
            this.$refs.editor.info(this.info.description)
            let arr = []
            let brr = []
            result.data.item.forEach(v => {
              v.num === 0 ? v.num = '' : v.num = v.num
              v.is_end === 1 ? v.is_end = true : v.is_end = false
              if (v.type === 1) {
                arr.push(v)
              } else {
                brr.push(v)
              }
            })
            this.items = arr
            this.project = brr
            this.getClassifyData() // 分类
            this.getTemplateList() // 模版
            // 处理所选的商品服务
            let service = []
            let goods = []
            let oldContion = []
            result.data.condition.forEach(item => {
              let obj = {
                category_name: item.category_name_one + '/' + item.category_name_two,
                product_pic: item.image_url,
                product_id: item.sku_id,
                product_name: item.name,
                type: item.type,
              }
              let obj2 = {
                category_name: item.category_name_one + '/' + item.category_name_two,
                product_pic: item.image_url,
                product_id: item.sku_id,
                product_name: item.name,
                type: item.type,
                id: item.id,
              }
              if (item.type === 1) {
                goods.push(obj)
              } else {
                service.push(obj)
              }
              oldContion.push(obj2)
            })
            this.temp_goods_list = goods
            this.temp_serves_list = service
            sessionStorage.setItem('oldContion', JSON.stringify(oldContion))
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡详情失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '养护卡详情')
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
        console.log(this.store_build)
        if (this.store_build === '') return false
        this.is_image_customized = true
        this.info.image_url = this.store_build
      },

      // 自定义卡面上传图片回调
      optionalPicBack (e) {
        this.is_image_customized = true
        this.info.image_url = this.store_build
      },

      // 删除图片
      deleteImage (url) {
        const index = this.info.content.findIndex(val => val === url)
        this.info.content.splice(index, 1)
      },
      // 是否最后项目(最终项目只能出现一个)
      isEndChange (object, index) {
        if (object.is_end) {
          object.num = 1
          this.items.map((item, i) => {
            item.is_end = i === index
            return item
          })
        }
      },
      // 添加项目
      addGoods () {
        let object = {
          id: 0,
          name: '',
          description: '',
          num: 1,
          is_end: false,
        }
        if (this.is_edit) object.id = 0
        this.items.push(object)
      },
      // 添加免激活项目
      addProject () {
        let object = {
          id: 0,
          name: '',
          description: '',
          time: '',
          num: '',
        }
        if (this.is_edit) object.id = 0
        this.project.push(object)
      },
      /**
       * 删除项目
       * index 序列
       */
      deleteGoods (index) {
        this.items.splice(index, 1)
      },
      /**
       * 删除免激活项目
       * index 序列
       */
      deleteProject (index) {
        this.project.splice(index, 1)
      },
      // 取消创建
      cancleCreate () {
        this.$router.push({
          name: 'cardManagementList',
        })
      },
      // 去设置关联商品
      goSettingRelation () {
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
        // 规则不能输入空格
        let str = this.info.description.replace(/\s+/g, '')
        if (str === '<p></p>') {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '规则不能输入空格',
          })
          return
        }
        // 1. 图文详情不能为空
        if (!this.info.content) {
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
            content: '卡内项目不能为空',
          })
          return
        }
        let isNum = false
        let tempItem = JSON.parse(JSON.stringify(this.items))
        tempItem.forEach(item => {
          if (item.num > this.info.num) {
            isNum = true
          }
        })
        // 单个项目不能大于项目次数
        if (isNum) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '项目次数不可大于使用次数',
          })
          return
        }
        // 3. 项目总次数不可少于使用次数
        let tempNum = 0
        tempItem.forEach((item, i) => {
          if (!item.is_end) tempNum += parseInt(item.num)
        })
        if (tempNum < parseInt(this.info.num)) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '项目总次数不可少于使用次数',
          })
          return
        }
        // 4 项目月份不可少于月份
        let isBig = false
        this.project.forEach(item => {
          if (item.expiry > this.info.expiry) {
            isBig = true
          }
        })
        if (isBig) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '免激活项目时间不能大于卡的有效期',
          })
          return
        }

        // 设置缓存
        this.info.is_image_customized = this.is_image_customized ? 1 : 2
        let card = {
          info: this.info,
          items: this.items,
          project: this.project,
          temp_serves_list: this.temp_serves_list,
          temp_goods_list: this.temp_goods_list,
        }
        console.log(card, '传的数据')
        sessionStorage.setItem('card', JSON.stringify(card))
        // 跳转页面
        this.$router.push({
          name: 'cardManagementAddTwo',
        })
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
        num: {
          required,
          validate (val) {
            return /^[1-9][0-9]?$/.test(val)
          },
        },
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
            return /^[1-9][0-9]?$/.test(val)
          },
        },
        description: {
          validate (val) {
            if (val === '') {
              this.$store.dispatch('showMessage', {
                type: 'warning',
                title: '警告',
                content: '规则必填',
              })
              return false
            } else {
              return true
            }
          },
        },
      },
      project: {
        $each: {
          name: {required},
          description: {required},
          num: {
            validate (val) {
              return /^[1-9][0-9]?$|^ *$/.test(val)
            },
          },
          expiry: {
            required,
            validate (val) {
              return /^[1-9][0-9]?$/.test(val)
            },
          },
        },
      },
      items: {
        $each: {
          name: {required},
          description: {required},
          num: {
            required,
            validate (val) {
              return /^[1-9][0-9]?$|^ *$/.test(val)
            },
          },
        },
      },
    },
    mounted () {
      // if (!JSON.parse(sessionStorage.getItem('cardType'))) {
      //   // 如果type 有值, 先清空缓存
      //   let type = this.$route.query.type
      //   if (type) {
      //     sessionStorage.setItem('card', null)
      //   }
      //   sessionStorage.setItem('cardType', null)
      // }
      let card = JSON.parse(sessionStorage.getItem('card'))
      console.log(card, '养护卡')
      sessionStorage.setItem('card', null)
      // 此处添加判断this.$route.query.edit !== 0 ,0代表是新添加是因为在第一次添加养护卡的时候，会把信息存到缓存里，第二次添加的时候不用拿缓存里的，需要重新填写数据
      if (card && this.$route.query.edit !== 0) {
        this.card_id = this.$route.query.id
        this.card = card || null
        if (!this.card_id && this.card) {
          this.info = card.info
          // card.items.forEach(v => {
          //   if (v.is_end === 1) {
          //     v.is_end = true
          //   } else {
          //     v.is_end = false
          //   }
          // })
          card.project.forEach(v => {
            v.is_end = false
            if (v.num === 0) v.num = ''
          })
          this.items = card.items
          this.project = card.project
          // this.classify = this.info.classify
          this.$refs.editor.info(this.info.description)
          this.temp_serves_list = this.card.temp_serves_list
          this.temp_goods_list = this.card.temp_goods_list
        }
      }
      this.getClassifyData() // 分类
      this.getTemplateList() // 模版
      if (this.$route.query.id && this.$route.query.edit - 0 === 2) {
        this.is_edit = true
        this.fetchDetail()  // 获取养护卡详情（编辑）
      }
      this.getPSName()
    },
    // keeplive  进入
    activated () {
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
  }
  .hide-hover{
    tr:hover{
      box-shadow: none;
    }
    tr:hover td:first-child{
      border-left: 2px solid transparent
    }
    tr td {
    padding-right: 10px;
  }
  tr td.has-text{
    padding-right: 30px;
  }
  }

  .default{
    width: 100%;
    line-height: 200px;
    text-align: center;
    color: #999;
  }


  .cover-list{
    display: flex;
    justify-content: flex-start;
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
.marginl-20
  margin-left: 20px
.width-563
  width: 563px !important
</style>
