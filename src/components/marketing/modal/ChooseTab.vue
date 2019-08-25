<template lang="pug">
  div.choose-tab2
    el-cascader( v-model="value"
    :options="options"
    @active-item-change="handleItemChange"
    :props="props"
    size="small"
    @change="changeValue")
</template>

<script>
  import productServiceMixin from '@/mixins/modules/productService'
  export default {
    name: 'ChooseTab',
    mixins: [productServiceMixin],
    props: {
      default: {
        type: Array,
        default: [],
      },
    },
    data () {
      return {
        value: [], // 选择分类 一位数组
        options: [{
          category_id: 0,
          category_name: '全部',
        }, {
          category_id: 1,
          category_name: '商品',
          cities: [],
        }, {
          category_id: 2,
          category_name: '服务',
          cities: [],
        }, {
          category_id: 3,
          category_name: '养护卡',
          cities: [],
        }],
        props: {
          value: 'category_id',
          label: 'category_name',
          children: 'cities',
        },
        good_first: [], // 商品分类一级
        good_second: [], // 商品分类二级
        serve_first: [], // 服务分类一级
        serve_second: [], // 服务分类二级
        card_list: [], // 养护卡一级分类
      }
    },
    methods: {
      // 获取分类id 传给父级
      changeValue () {
        this.$emit('success', this.value)
      },
      // 父级重置
      parentMsg () {
        this.value = []
      },
      // 选择分类时执行的方法
      handleItemChange (val) {
        let length = val.length
        let _this = this
        // 【全部商品】/ 【全部服务】
        if (length === 1) {
          setTimeout(_ => {
            if (val[0] === 2) {
              this.options[val[0]].cities = _this.serve_first
            }
            if (val[0] === 1) {
              this.options[val[0]].cities = _this.good_first
            }
            if (val[0] === 3) {
              this.options[val[0]].cities = _this.card_list
            }
          }, 300)
        }
        // 选择了二级分类
        if (length === 2) {
          let nowIndex = 0
          this.getClassify(val[0], val[1])
          let arr = []
          switch (val[0]) {
            case 1:
              arr = this.good_first
              break
            case 2:
              arr = this.serve_first
              break
            case 3:
              arr = this.card_list
              break
            default:
              break
          }
          // 获取一级分类默认点击的index
          arr.forEach((item, index) => {
            if (item.category_id === val[1]) nowIndex = index
          })
          setTimeout(_ => {
            switch (val[0]) {
              case 1:
                this.options[val[0]].cities[nowIndex].cities = _this.good_second
                break
              case 2:
                this.options[val[0]].cities[nowIndex].cities = _this.serve_second
                break
              default:
                break
            }
          }, 500)
        }
      },
      /*
      *   获取分类数据
      *   type 1商品2服务
      *   parentId  父级id
      * */
      async getClassify (type, parentId) {
        try {
          const {response, result} = await this.fetchCategory({
            type: type,
            parent_id: parentId,
            hide_loading: true,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              let data = result.data
              data.forEach(item => {
                if (parentId - 0 === 0) {
                  item.cities = []
                }
              })
              data.unshift({
                category_id: 0,
                category_name: '全部',
              })
              if (type === 1 && parentId === 0) this.good_first = data
              if (type === 2 && parentId === 0) this.serve_first = data
              if (type === 1 && parentId > 0) this.good_second = data
              if (type === 2 && parentId > 0) this.serve_second = data
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: `获取${type === 1 ? '商品' : '服务'}分类失败`,
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取商品分类失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err)
        }
      },
      async getCardClassify () {
        try {
          const { response, result } = await this.upkeepCategoryApi()
          if (response.status === 200 && result.code === 0) {
            result.data.forEach(item => {
              item.category_id = item.id
              item.category_name = item.name
            })
            result.data.unshift({
              category_id: 0,
              category_name: '全部',
            })
            this.card_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡分类列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '养护卡分类')
        }
      },
      // 展示默认一二级
      showDefault () {
        let _this = this
        if (this.default.length === 1) {
          // 一级
          this.value = this.default
        } else {
          setTimeout(_ => {
            switch (this.default[0]) {
              case 1:
                _this.options[this.default[0]].cities = _this.good_first
                break
              case 2:
                _this.options[this.default[0]].cities = _this.serve_first
                break
              case 3:
                _this.options[this.default[0]].cities = _this.card_list
                break
              default:
                break
            }
            if (_this.default[1] === 0) {
              // 二级
              _this.value = this.default
            } else {
              // 三级
              _this.showThree(this.default[0])
            }
          }, 500)
        }
      },
      /*
      *  展示3级
      *  type  1商品2服务
      * */
      showThree (type) {
        let _this = this
        let nowIndex = 0
        let arr = []
        switch (type) {
          case 1:
            arr = _this.good_first
            break
          case 2:
            arr = _this.serve_first
            break
          case 3:
            arr = this.card_list
            break
          default:
            break
        }
        // 获取一级分类默认点击的index
        arr.forEach((item, index) => {
          if (item.category_id === this.default[1]) nowIndex = index
        })
        _this.getClassify(_this.default[0], _this.default[1])
        setTimeout(_ => {
          switch (_this.default[0]) {
            case 1:
              this.options[_this.default[0]].cities[nowIndex].cities = _this.good_second
              break
            case 2:
              this.options[_this.default[0]].cities[nowIndex].cities = _this.serve_second
              break
            default:
              break
          }
          _this.value = _this.default
        }, 500)
      },
    },
    async mounted () {
      this.getClassify(1, 0)
      this.getClassify(2, 0)
      this.getCardClassify()
      // 传默认数组(回显)
      if (this.default.length) {
        this.showDefault()
      }
    },
  }
</script>

<style lang="stylus">
  .choose-tab2
    .el-cascader--small
      border: 1px solid #c2c2c2
      border-radius 3px
    .el-input__inner
      border: none
    .el-input--small .el-input__inner
      line-height 30px
      height 30px
    .el-cascader--small
      line-height 30px
</style>
