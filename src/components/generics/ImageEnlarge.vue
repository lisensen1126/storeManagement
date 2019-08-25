<template>
  <!-- 过渡动画 -->
  <transition name="fade">
    <div class="img-view">
      <!-- 遮罩层 -->
      <div class="img-layer"></div>
      <div class="contentImg">
        <div class="img">
          <img :src="imgSrc[index]" class="imgsss" @click="bigImg">
        </div>
      </div>
      <div class="icon left" @click="left"></div>
      <div class="icon right" @click="right"></div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'imageEnlarge',
    props: {
      imgSrc: Array,
    },
    data () {
      return {
        index: 0,
      }
    },
    methods: {
      left () {
        var index = this.index
        if (index > 0) {
          this.index = index - 1
        }
      },
      right () {
        var r = this.imgSrc.length
        var index = this.index + 1
        if (r > index) {
          this.index = index
        }
      },
      bigImg () {
        // 发送事件
        this.$emit('clickit')
      },
    },
    mounted () {
    },
  }
</script>
<style scoped>
  /*动画*/
  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s linear;
    transform: translate3D(0, 0, 0);
  }

  .fade-enter,
  .fade-leave-active {
    transform: translate3D(100%, 0, 0);
  }


  /* bigimg */

  .img-view {
    width: 100%;
    height: 100%;
    position: fixed;
  }

  /*遮罩层样式*/
  .img-view .img-layer {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
  }
  .contentImg{
    width: 70%;
    height: 100%;
    margin-left: 15%;
    position: relative;
    z-index: 9999;
  }
  .contentImg .img{
    width: 100%;
    display: inline-block;
  }
  .contentImg .img .imgsss{
    width: 400px;
    display: block;
    margin: 0 auto;
  }
  /*!*不限制图片大小，实现居中*!*/
  /*.img-view .img img {*/
    /*width: 100px;*/
    /*display: inline-block;*/
    /*position: absolute;*/
    /*left: 0;*/
    /*right: 0;*/
    /*margin: auto;*/
    /*z-index: 1000;*/
  /*}*/
  .left{
    width: 50px;
    height: 100px;
    background: red;
    position: fixed;
    top: 45%;
    left: 8%;
    z-index: 99999;
  }
  .right{
    width: 50px;
    height: 100px;
    background: #19a0db;
    position: fixed;
    top: 45%;
    right: 8%;
    z-index: 99999;
  }
</style>
