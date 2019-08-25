<template lang="pug">
  .section-layout
    .content-wrapper
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 车检单名称
            custom-input(v-model.trim="class_item.name", input-type="hasCount", :isDisabled="is_edit===2" placeholder="请输入车检单名称", :validator="$v.class_item.name", error-info="车检单名称必填并且小于八字")
              span(slot="countInfo") {{wordLength(class_item.name)}}/8
          .field.is-horizontal
            label.label 车检单介绍
            custom-input(v-model.trim="class_item.desc", input-type="hasCount", :isDisabled="is_edit===2" placeholder="请输入车检单介绍", :validator="$v.class_item.desc", error-info="车检单内容必填并且小于五十字")
              span(slot="countInfo") {{wordLength(class_item.desc)}}/50
      .content-wrapper(v-if="project_list && project_list.length")
        .table-wrapper
          table.table
            thead
              tr
                td(width="30%") 场景名称
                td(width="70%") 关联项目
            tbody
              tr(v-for="(item, index) in project_list", :key="index")
                td
                  .simple-td {{item.name}}
                td
                  .multi-content-td.word-break
                    ul
                      li.vehicle-item(v-for="(info, cindex) in item.items") 
                        .checkbox(style="cursor: default")
                          input(type="checkbox", :id="info.id" :disabled="is_edit===2", v-model="info.selected")
                          label(:id="info.id", style="cursor: default") {{info.name}}
                        span.see(@click="showDetail(info.id)") 查看
    .btn-wrapper
      .button-group
        a.button.primary.large(v-if="is_edit!==2", @click="save") 保存
        a.button.large(@click="goBack") 返回
    //- 项目详情模态框
    slide-out-modal(v-if="slide_detail", @input="showDetail")
      vehicle-detail-model(:project="project_info")
</template>

<script>
import { wordLength } from '@/mixins/custom-validators/custom-validators'
import SlideOutModal from '@/components/generics/SlideOutModal'
import CustomInput from '@/components/generics/form/CustomInput'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import Api from '@/mixins/modules/evaluate'
import VehicleDetailModel from '@/components/evaluate/modal/VehicleDetailModel'

export default {
  name: 'addInspec',
  mixins: [validationMixin, Api],
  components: {
    SlideOutModal,
    CustomInput,
    VehicleDetailModel,
  },
  data () {
    return {
      class_item: {
        name: '', // 车检名称
        desc: '', // 车检内容
      },
      is_select: false,
      slide_detail: false,     // 控制显示
      project_info: 0,
      is_edit: 1,  // 页面样式
      classify_id: '', // 车检单id
      query: {}, // 组装后的数据
      project_list: [], // 场景值
    }
  },
  methods: {
    wordLength,
    // 控制详情模态框显隐
    showDetail (id) {
      this.slide_detail = !this.slide_detail
      this.project_info = parseInt(id)
    },
    // 获取车检单详情
    async getInspectDetail () {
      let params = {
        id: this.classify_id,
      }
      try {
        const { response, result } = await this.getInspectDetailApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.class_item.name = result.data.name
            this.class_item.desc = result.data.desc
            this.project_list = result.data.categories.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取车检单失败',
              content: result.message,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取车检单失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取车检单失败',
          content: err,
        })
      }
    },
    // 获取场景-项目详情
    async getCategoryDetail () {
      try {
        const { response, result } = await this.getCategoryDetailApi()
        if (response.status === 200) {
          if (result.code === 0) {
            this.project_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取场景/项目详情失败',
              content: result.message,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取场景/项目详情失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取场景/项目详情失败',
          content: err,
        })
      }
    },
    // 数据的组装
    save () {
      this.$v.$touch()
      if (this.$v.$error) return
      this.query.name = this.class_item.name
      this.query.desc = this.class_item.desc
      this.query.id = this.classify_id
      let selectItem = []
      this.project_list.forEach(v => {
        v.items.forEach(m => {
          if (m.selected) {
            selectItem.push(m.pivot_id)
          }
        })
      })
      if (selectItem.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '温馨提示',
          content: '请勾选场景的项目值！',
        })
        return
      }
      this.query.pivot_ids = selectItem
      this.assemblyData()
    },
    // 保存数据
    async assemblyData () {
      try {
        const { response, result } = await (this.is_edit === 3 ? this.getInspectEditApi(this.query) : this.is_edit === 1 ? this.getInspectCopyApi(this.query) : this.getInspectCreateApi(this.query))
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '保存成功',
              resolve: () => {
                // 返回上一级
                this.$router.go(-1)
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: this.is_edit === 3 ? '更新车检单失败' : '创建车检单失败',
              content: result.message,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: this.is_edit === 3 ? '更新车检单失败' : '创建车检单失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: this.is_edit === 3 ? '更新车检单失败' : '创建车检单失败',
          content: err,
        })
      }
    },

    // 返回上一页
    goBack () {
      this.$router.go(-1)
    },
  },
  mounted () {
    // edit 1-复制 2-查看 3-编辑 4-添加
    this.is_edit = this.$route.query.edit
    this.classify_id = this.$route.query.classify_id
    if (parseInt(this.is_edit) !== 4) {
      this.getInspectDetail()
    } else {
      this.getCategoryDetail()
    }
  },
  validations: {
    class_item: {
      desc: {
        required,
        validate (val) {
          return this.wordLength(val) <= 50
        },
      },
      name: {
        required,
        validate (val) {
          return this.wordLength(val) <= 8
        },
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.form-wrapper
  border-bottom none
.table tbody tr td
  padding 0
  vertical-align middle
.list-wrapper
  padding 0 20px
  padding-bottom 20px
.btn-wrapper
    padding 12px 40px 12px
.field.is-horizontal .label
  flex: 0 0 100px
.field-group
  border none
.content-wrapper
  margin-bottom 0px
  padding-bottom 0px
.vehicle-item
  width 300px
  line-height 40px
  float left
  margin-right 30px
.table
  background-color #f0f1f2
  border-spacing 0 1px
.see
  color #2fabdd
  float right
  margin-right 100px
  cursor pointer
  font-size 13px
.see:hover
  color #0a71a1
  // text-decoration underline
.table tbody tr td:first-child
  padding-left 13px
</style>
