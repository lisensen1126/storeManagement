<template>
  <ul class="tree-menu">
    <li v-for="(item, index) in data" @click.stop="toggle(item, index)">
      <span class="name">
        <span v-if="scope[index]" class="jian"></span><span v-if="!scope[index]" class="jian zuo"></span><span class="icon"></span><span class="txt">{{ item[name] || item.dpName }}</span>
      </span>
      <!-- 二级 -->
      <ul class="tree-menu" id="children" v-if="scope[index]">
        <li v-for="(cell, inde) in item.children" v-bind:class="childrenId===cell.dpId ? 'isactive' : ''"  @click.stop="getName(cell,inde)">
          <span class="name">
            <span class="xiala"></span><span class="icon"></span><span class="txt">{{ cell[name] || cell.dpName }}</span>
          </span>
          <!-- 三级 -->
          <!--<ul class="tree-menu" id="three" v-if="threeshow === cell.dpId">-->
          <!--<li v-for="(items, i) in two" @click.stop="getName(items)" v-bind:class="threeId===items.dpId ? 'isactive' : ''">{{items.dpName}}</li>-->
          <!--</ul>-->
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'treeMenu',
    props: {
      data: Array,
      name: String,
      loading: Boolean,
    },
    data () {
      return {
        folderIconList: [],
        loadingIconList: [],
        scope: {},
        childrenId: undefined,
        threeId: undefined,
        threeshow: undefined,
        two: [],
      }
    },
    created () {
      this.data.forEach((item, index) => {
        if (item.children && item.children.length) {
          this.folderIconList[index] = 'folder'
        }
      })
    },
    methods: {
      getName (item, index) {
        this.threeId = item.dpId
        this.$emit('getSM', item)
      },
      doTask (index) {
        this.$set(this.scope, index, !this.scope[index])
        this.folderIconList[index] = this.scope[index] ? 'folder-open' : 'folder'
      },
      getChildren (item, index) {
        this.childrenId = item.dpId
        this.getThree()
      },
      changeChildren () {
        this.$set(this.scope, 0, false)
        this.folderIconList[0] = this.scope[0] ? 'folder-open' : 'folder'
        // this.toggle(this.data[0], 0, 9)
      },
      toggle (item, index, num = 2) {
        var self = this
        if (num === 9) {
          this.$emit('getSubMenu', item, num, (subMenuList) => {
            if (subMenuList && subMenuList.length) {
              var arr = self.data
              self.data = []
              arr[0].children = []
              arr[0].children = subMenuList
              self.data = arr
            }
          })
        } else {
          this.$emit('getSubMenu', item, num, (subMenuList) => {
            if (subMenuList && subMenuList.length) {
              this.doTask(index)
            }
          })
        }
      },
      getThree () {
        if (this.threeshow === undefined) {
          this.threeshow = this.childrenId
        } else {
          this.threeshow = undefined
        }
      },
    },
    mounted () {
      this.data = this.data
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .tree-menu {
    list-style: none;
    border-top: 1px solid rgba(0,0,0,0.1);
  }
  .tree-menu li {
    line-height: 59px;
    // width:318px;
    background:rgba(255,255,255,1);
    border-radius:3px;
  }
  .jian{
    width 7px
    height 13px
    display inline-block
    margin-right 9px
    margin-left 23px
    background no-repeat center url("~@/assets/zx/xia.png")
  }
  .zuo{
    background no-repeat center url("~@/assets/zx/you.png")
  }
  .name{
    width:169px;
    height:13px;
    font-size:13px;
    font-family:MicrosoftYaHei;
    color:rgba(53,53,53,1);
    line-height:13px;
  }
  .name .icon{
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right 2px
    position: relative;
    top: 3px;
    background no-repeat url("~@/assets/zx/store-icon.png")
    background-size 16px 16px
  }
  .txt{
  }
  #children .name .icon{
    background no-repeat url("~@/assets/zx/noc.png")
    background-size 16px 16px
  }
  #children, #three{
    background:#F7F7F7 ;
  }
  .xiala{
    display inline-block
    width 32px
  }
  #children li{
    border: none;
    // width: 270px;
    margin: 0 auto;
    line-height:64px;
    background:#F7F7F7;
  }
  #children>.isactive{
    background:rgba(255,255,255,1);
    box-shadow:0px 2px 8px 0px rgba(0,0,0,0.08);
    border:1px solid rgba(229,229,229,1);
  }
  #three li{
    font-size:13px;
    width: 236px;
    font-family:MicrosoftYaHei;
    color:rgba(53,53,53,1);
    line-height:50px;
    margin-left 32px;
    padding-left 32px
  }
  #three .isactive{
    color: #FFBB29
    background white
  }
  #children>li:hover{
    background:rgba(255,255,255,1);
    box-shadow:0px 2px 8px 0px rgba(0,0,0,0.08);
    border:1px solid rgba(229,229,229,1);
  }
</style>
