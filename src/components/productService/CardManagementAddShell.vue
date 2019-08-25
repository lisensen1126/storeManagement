<template lang="pug">
.section-layout
  .content-wrapper
    h2 {{!is_edit? '新建养护卡' : '编辑养护卡'}}
    .form-wrapper
      .group-title 基本信息
      .field-group
        .field.is-horizontal
          label.label 默认名称
          .detail-txt {{info.origin_name}}
        .field.is-horizontal
          label.label 自定义名称
          custom-input(v-model.trim="info.name"
            placeholder="请输入养护卡名称"
            maxlength="10"
            :validator="$v.info.name"
            error-info="养护卡名称必填且小于等于10个字")
        .field.is-horizontal
          label.label 卡面
          .cover-list
            open-image(
              v-if="info.image_url",
              img-type="1",
              :img-url="info.image_url",
              key-name="",
              mini-width="161",
              mini-height="100",
              margin-bottom="0",
              margin-right="5",
              border-radius="5")
        .field.is-horizontal
          label.label 分类
          .detail-txt {{info.category_name}}
        .field.is-horizontal.width-563
          label.label 使用次数
          custom-input(
            v-model.number="info.num"
            input-type="hasCount"
            need-type='number'
            maxlength="2"
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
          open-image(
              v-if="info.content",
              img-type="1",
              :img-url="info.content",
              key-name="",
              mini-width="80",
              mini-height="80",
              margin-bottom="0",
              margin-right="5",
              border-radius="5")
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
      .field-group
        .field.is-horizontal
          label.label 关联商品
          a.button.primary.large(@click="showGoods") 查看关联商品
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
                td(width="80") 次数（小于等于卡使用次数）
                td(width="80") 是否为最终项目
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
                      placeholder="项目描述"
                      :validator="$v.items.$each[index].description"
                      error-info="项目描述必填且小于等下30个字")
                td
                  .simple-td.has-text
                    custom-input(
                      v-model="item.num"
                      input-type="hasCount"
                      placeholder="请输入次数"
                      need-type="number"
                      maxlength="2"
                      :validator="$v.items.$each[index].num"
                      error-info="请输入1-99的整数"
                      :is-disabled = "item.is_end")
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
                    error-info="项目描述必填且小于等下30个字")
                td
                  .simple-td.has-text
                    custom-input(
                    v-model="item.num"
                    need-type="number"
                    :isDisabled="item.is_end"
                    input-type="hasCount"
                    placeholder="无限次"
                    :validator="$v.project.$each[index].num"
                    error-info="使用次数必须是小于100的正整数")
                      span(slot="countInfo") 次
                td
                  .simple-td.has-text
                    custom-input(
                    v-model="item.expiry"
                    need-type="number"
                    input-type="hasCount"
                    placeholder="请输入免激活时间"
                    :validator="$v.project.$each[index].expiry"
                    error-info="必须是1-99正整数")
                      span(slot="countInfo") 月
                td
                  .operation-td
                    span.operation-link(@click="deleteProject(index)") 删除
    .btn-wrapper
      .button-group
        a.button.primary.large(@click="submitData") 提交
        a.button.large(@click="cancleCreate") 取消
    card-goods-modal(v-model="show_card_goods" v-if="show_card_goods", type="1" :id="(need_pid - 0 === 2 || info.pid === 0) ? card_id : info.pid", :need_type="info.pid === 0 && is_edit")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import CustomTextarea from '@/components/generics/form/CustomTextarea'
import SelectTime from '@/components/generics/SelectTime'
import UploadPic from '@/components/generics/form/UploadPic'
import EmptyPage from '@/components/generics/EmptyPage'
import imageScale from '@/mixins/utilities/imageScale'
import OpenImage from '@/components/generics/OpenImage'
import CardGoodsModal from '@/components/customer/CardGoodsModal'
import RichEditor from '@/components/generics/form/RichEditor'
import Api from '@/mixins/modules/productService'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { wordLength } from '@/mixins/custom-validators/custom-validators'

export default {
  name: 'maintenanceCardAddShell',
  mixins: [validationMixin, Api, imageScale],
  components: {
    CustomInput,
    CustomSelect,
    SelectTime,
    CustomTextarea,
    EmptyPage,
    UploadPic,
    OpenImage,
    CardGoodsModal,
    RichEditor,
  },
  data () {
    return {
      need_pid: this.$route.query.need_pid ? this.$route.query.need_pid : 1,
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
        pid: '',
      }, // 基本信息
      project: [], // 免激活项目
      items: [], // 项目
      card_id: '', // id
      is_edit: false, // 编辑
      show_card_goods: false, // 查看关联项目
      arr_name: [], // 联想
    }
  },
  methods: {
    // 获取详情
    async getDetail () {
      try {
        const { response, result } = await this.upkeepDetailApi({
          id: this.card_id,
        })
        if (response.status === 200 && result.code === 0) {
          if (!this.is_edit) result.data.info.origin_name = result.data.info.name
          this.info = result.data.info
          this.info.price = parseInt(this.info.price) / 100
          this.info.origin_price = parseInt(this.info.origin_price) / 100
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
    // 是否最后项目
    isEndChange (object, index) {
      if (object.is_end) {
        this.items.map((item, i) => {
          item.is_end = i === index
          if (i === index) {
            item.num = 1
          }
          return item
        })
      }
    },
    // 添加项目
    addGoods () {
      let object = {
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
    // 查看关联商品
    showGoods () {
      this.show_card_goods = true
    },
    // 提交数据验证
    submitData () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      let str = this.info.description.replace(/\s+/g, '')
      if (str === '<p></p>') {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '规则不能输入空格',
        })
        return
      }
      // 1. 项目不能为空
      if (this.items && !this.items.length) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '卡内项目不能为空',
        })
        return
      }

      // 2. 项目总次数不可少于使用次数
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
      // 2.2  没有无限次, 计算总次数是否不小于使用次数
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
        if (item.time > this.info.expiry) {
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
      // 准备提交
      let params = {
        info: {
          num: this.info.num,
          origin_price: (this.info.origin_price - 0) * 100, // 原价
          price: (this.info.price - 0) * 100, // 价格
          expiry: this.info.expiry, // 有效期
          description: this.info.description, // 使用规则
          name: this.info.name,
        },
      }
      let item = []
      let arr = this.items
      arr.forEach(v => {
        let obj = {
          id: v.id,
          name: v.name,
          description: v.description,
          price: 0,
          num: v.num === '' ? 0 : v.num,
          is_end: v.is_end ? 1 : 2,
          type: 1,
          expiry: 0,
        }
        item.push(obj)
      })
      let brr = this.project
      if (this.project.length) {
        brr.forEach(cell => {
          let obj = {
            id: cell.id,
            num: cell.num === '' ? 0 : cell.num,
            type: 2,
            expiry: cell.expiry - 0,
            is_end: 2,
            price: 0,
            name: cell.name,
            description: cell.description,
          }
          item.push(obj)
        })
      }
      params.item = item
      // 编辑
      if (this.is_edit) {
        params.info.id = this.card_id
        this.editInfo(params)
      } else {
        params.id = this.card_id
        this.addInfo(params)
      }
    },
    // 添加
    async addInfo (obj) {
      try {
        const {response, result} = await this.upkeepDepotAddApi(obj)
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
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '养护卡添加失败',
          content: `服务异常，请稍后再试（${err.message}）`,
        })
      }
    },
    // 编辑
    async editInfo (obj) {
      try {
        const {response, result} = await this.upkeepDepotSaveApi(obj)
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
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '养护卡编辑失败',
          content: `服务异常，请稍后再试（${err.message}）`,
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
  },
  validations: {
    info: {
      name: {
        required,
        validate (val) {
          return wordLength(val) <= 10
        },
      },
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
        num: {
          required,
          validate (val) {
            return /^\+?(([1-9]\d?)|(99)|(0))$/.test(val)
          },
        },
        description: {required},
      },
    },
  },
  mounted () {
     // 获取所有商品、服务名称, 供项目名称输入联想
    this.getPSName()
    this.card_id = this.$route.query.id
    if (this.card_id) {
      this.getDetail()
    }
    if (this.$route.query.edit - 0 === 2) {
      this.is_edit = true
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';

.detail-txt{
  font-size: 12px
}

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

