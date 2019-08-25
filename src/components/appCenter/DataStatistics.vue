<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 当前{{good_type === 1 ? '商品' : good_type === 2 ? '服务' : '养护卡'}}：{{spike_name}}
      .form-wrapper
        //- 4个栏目
        .section-filter
          .field-group.is-horizontal
            .field.order-data
              .order-data-title
                label.label-title 订单
                label.label 本月
              .order-data-content
                .order-data-left
                  .all-order 总订单
                  .all-order-num {{card_data.month_orders}}
                  .all-order-per(v-if="card_data.order_increase !== '--'") {{card_data.order_increase}}环比增长
                  .all-order-per(v-else) {{card_data.order_increase}}
                .order-data-right
                  .all-order 海报订单
                  .all-order-num {{card_data.month_poster_orders}}
                  .all-order-per(v-if="card_data.poster_order_increase !== '--'") {{card_data.poster_order_increase}}环比增长
                  .all-order-per(v-else) --
              .order-progress
                <el-progress :text-inside="true" :stroke-width="20" :percentage="card_data.order_poster_proportion" :color="customColor"></el-progress>
                .progress-title 海报订单占总订单量的
                  font(color="red") {{card_data.order_poster_proportion}}%
            .field.order-data
              .order-data-title
                label.label-title 收入
                label.label 本月
              .order-data-content
                .order-data-left
                  .all-order 总收入
                  .all-order-num {{card_data.month_amount}}
                  .all-order-per(v-if="card_data.amount_increase !== '--'") {{card_data.amount_increase}}环比增长
                  .all-order-per(v-else) --
                .order-data-right
                  .all-order 海报收入
                  .all-order-num {{card_data.month_poster_amount}}
                  .all-order-per(v-if="card_data.poster_amount_increase !== '--'") {{card_data.poster_amount_increase}}环比增长
                  .all-order-per(v-else) --
              .order-progress
                <el-progress :text-inside="true" :stroke-width="20" :percentage="card_data.amount_poster_proportion" :color="customColor"></el-progress>
                .progress-title 海报收入占总收入的
                  font(color="red") {{card_data.amount_poster_proportion}}%
            .field.order-data
              .order-data-title
                label.label-title 访客
                label.label 今日
              .order-data-content
                .order-data-left
                  .all-order 总访客
                  .all-order-num {{card_data.today_visitor}}
                  .all-order-per(v-if="card_data.visitor_increase !== '--'") {{card_data.visitor_increase}}环比增长
                  .all-order-per(v-else) --
                .order-data-right
                  .all-order 海报访客
                  .all-order-num {{card_data.today_poster_visitor}}
                  .all-order-per(v-if="card_data.poster_visitor_increase !== '--'") {{card_data.poster_visitor_increase}}环比增长
                  .all-order-per(v-else) --
              .order-progress
                <el-progress :text-inside="true" :stroke-width="20" :percentage="card_data.poster_visitor_proportion" :color="customColor"></el-progress>
                .progress-title 海报访客占总访客的
                  font(color="red") {{card_data.poster_visitor_proportion}}%
            .field.order-data
              .order-data-title
                label.label-title 买家
                label.label 今日
              .order-data-content
                .order-data-left
                  .all-order 总买家
                  .all-order-num {{card_data.today_buyers}}
                  .all-order-per(v-if="card_data.buyers_increase !== '--'") {{card_data.buyers_increase}}环比增长
                  .all-order-per(v-else) --
                .order-data-right
                  .all-order 海报买家
                  .all-order-num {{card_data.today_poster_buyers}}
                  .all-order-per(v-if="card_data.poster_buyers_increase !== '--'") {{card_data.poster_buyers_increase}}环比增长
                  .all-order-per(v-else) --
              .order-progress
                <el-progress :text-inside="true" :stroke-width="20" :percentage="card_data.buyers_poster_proportion" :color="customColor"></el-progress>
                .progress-title 海报买家占总买家的
                  font(color="red") {{card_data.buyers_poster_proportion}}%
        //- 时间筛选
        .time()
          div.day(:class="sale_check_type === 1 ? 'active' : ''", @click="saleCheckTime(1)") 今日
          div.month(:class="sale_check_type === 2 ? 'active' : ''",@click="saleCheckTime(2)") 本月
          date-picker.picker(type="range", placeholder="请选择日期范围", v-model="sale_picker_time", @input="saleCheckTime(3)")
        //- 图表展示
        div.cartogram-chart
          .chart-title
            div.tab-content.trend 销量统计
          div.my-chart(id="my-chart-sale")
        div.cartogram-chart.chart-order
          .chart-title
            div.tab-content.trend 订单统计
          div.my-chart(id="my-chart-order")
</template>

<script>
  import Api from '@/mixins/modules/AppCenter'
  import DatePicker from '@/components/generics/form/DatePicker'
  export default {
    name: 'DataStatistics',
    mixins: [Api],
    components: {
      DatePicker,
    },
    data () {
      return {
        sale_check_type: 1,   // 销量统计 筛选type
        sale_picker_time: '',     // 销量统计时间区间
        customColor: '#EB8705',   // 进度条颜色
        card_data: {},   // 4个统计数据
        chart_data: {},  // 图表数据
        spike_name: '',   // 养护卡/商品名称
        good_type: this.$route.query.good_type - 0,
      }
    },
    methods: {
      // 返回上一页
      goBack () {
        this.$router.push({
          name: 'spikePosterList',
        })
      },
      // 销量统计走势图
      drawSale () {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('my-chart-sale'))
        // 图表参数
        let option = {
          color: ['#89cfdc', '#003c88'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999',
              },
            },
          },
          dataZoom: this.getKeys(this.chart_data.amounts).length > 20 ? [
            {
              type: 'slider',
              show: true,
              start: 0,
              end: this.getProgress(this.getKeys(this.chart_data.amounts).length),
              handleSize: 8,
            },
          ] : [],
          xAxis: [
            {
              type: 'category',
              data: this.getKeys(this.chart_data.amounts),
              axisPointer: {
                type: 'shadow',
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: '收入/元',
              min: 0,
              max: this.chart_data.max_amount > 40 ? this.chart_data.max_amount : 40,
              // interval: this.chart_data.max_amount > 40 ? 10 : 5,
              axisLabel: {
                formatter: '{value} k',
              },
            },
          ],
          series: [
            {
              name: '总收入',
              type: 'bar',
              data: this.getValues(this.chart_data.amounts),
            },
            {
              name: '海报收入',
              type: 'line',
              data: this.getValues(this.chart_data.poster_amounts),
            },
          ],
        }
        // 绘制图表
        myChart.setOption(option, true)
      },
      // 订单统计走势图
      drawOrder () {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('my-chart-order'))
        let option = {
          color: ['#89cfdc', '#003c88'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985',
              },
            },
          },
          dataZoom: this.getKeys(this.chart_data.orders).length > 20 ? [
            {
              type: 'slider',
              show: true,
              start: 0,
              end: this.getProgress(this.getKeys(this.chart_data.orders).length),
              handleSize: 8,
            },
          ] : [],
          xAxis: [
            {
              type: 'category',
              data: this.getKeys(this.chart_data.orders),
              axisPointer: {
                type: 'shadow',
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              min: 0,
              max: this.chart_data.max_orders > 200 ? this.chart_data.max_orders : 200,
              // interval: 50,
              name: '订单数/单',
            },
          ],
          series: [
            {
              name: '总订单',
              type: 'line',
              stack: '总量',
              areaStyle: {normal: {}},
              data: this.getValues(this.chart_data.orders),
            },
            {
              name: '海报订单',
              type: 'line',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'top',
                },
              },
              areaStyle: {normal: {}},
              data: this.getValues(this.chart_data.poster_orders),
            },
          ],
        }
        // 绘制图表
        myChart.setOption(option, true)
      },
      /**
       * 时间切换
       * @type 1 本日 2 本月 0 时间区间
       */
      saleCheckTime (type) {
        if (type === 1) {
          this.sale_picker_time = ''
          this.sale_check_type = 1
          this.getChartsData()
        } else if (type === 2) {
          this.sale_picker_time = ''
          this.sale_check_type = 2
          this.getChartsData()
        } else if (type === 3) {
          if (this.sale_picker_time.length > 0) {
            this.sale_check_type = 3
            this.getChartsData()
          }
        }
        console.log(this.sale_check_type)
      },
      // 获取列表数据
      async getPosterData () {
        try {
          const { response, result } = await this.getPosterStatisticListApi({
            seckill_id: this.$route.query.spike_id,
          })
          if (response.status === 200 && result.code === 0) {
            this.card_data = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取海报数据失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '数据统计')
        }
      },
      // 获取图表数据
      async getChartsData () {
        try {
          const { response, result } = await this.getPosterChartsApi({
            seckill_id: this.$route.query.spike_id,
            end_time: this.sale_picker_time ? new Date(this.sale_picker_time.split(' 至 ')[1] + ' 23:59:59').getTime() / 1000 : '',
            start_time: this.sale_picker_time ? new Date(this.sale_picker_time.split(' 至 ')[0] + ' 00:00').getTime() / 1000 : '',
            date_type: this.sale_check_type === 3 ? 0 : this.sale_check_type,
          })
          if (response.status === 200 && result.code === 0) {
            this.chart_data = result.data
            this.drawSale()
            this.drawOrder()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取海报数据失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '数据统计')
        }
      },
      // 取对象的key值
      getKeys (obj) {
        let arr = []
        arr = Object.keys(obj)
        return arr
      },
      // 取对象的键值
      getValues (obj) {
        let arr = []
        arr = Object.values(obj)
        return arr
      },
      // 计算图表进度条
      getProgress (length) {
        return (10 / length) * 100
      },
    },
    mounted () {
      this.spike_name = this.$route.query.spike_name
      this.getPosterData()
      this.getChartsData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  .section-layout{
    background: #ffffff;
    height: calc(100% - 48px)
    margin: 10px 25px;
    border-radius: 5px;
    padding-bottom: 60px;
  }
  .content-wrapper{
    margin: 0;
    padding 20px 16px 16px;
    overflow-y auto;
    max-height 100%;
  }
  .section-filter{
    padding: 20px 0 20px;
    background: #ffffff;
    height: auto;
  }
  .nav-back-btn{
    position absolute
    top -49px
    left 16px
    width 32px
    height 32px
    border-radius 100%
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
    cursor pointer
    z-index 21
  }
  .order-data{
    height: auto;
    border: 1px solid #eeeeee;
    width: 290px;
    height: 195px;
  }
  .order-data-title{
    border-bottom 1px solid #eeeeee
    display flex
    justify-content space-between
    align-items flex-end
    padding 10px 10px
    .label{
      margin 0
    }
    .label-title{
      font-weight bold
      font-size 14px
    }
  }
  .order-data-content{
    display flex
    justify-content space-between
    align-items center
    padding 0 15px
    .order-data-left, .order-data-right{
      width 135px
      text-align center
    }
    .all-order, .all-order-num{
      color #404040
      font-weight 600
      font-size 16px
      margin-top 10px
    }
    .all-order-num{
      margin-top 8px
    }
    .all-order-per{
      font-size 14px
      color #666
      margin-top 14px
    }
  }
  .order-progress{
    padding 0 15px
    margin-top 16px
    .progress-title{
      font-size 12px
      color #666
      margin-top 10px
      text-align center
    }
  }
  .cartogram-chart{
    width 100%
    height auto 
    border 1px solid #eeeeee
    padding 16px
  }
  .my-chart{
    width: 100%
    height: 350px
  }
  .chart-title{
    display flex
    justify-content space-between
    align-items center
    .trend{
      font-weight 600
      margin-left 10px
    }
  }
  .time {
    border-radius: 3px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .time .day, .time .month{
    width: 78px;
    height: 32px;
    border: 1px solid #D9D9D9;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    border-radius: 3px;
    background: #D9D9D9;
    color: #9A9B9A;
    cursor: pointer;
    margin-right: 8px;
  }
  .active {
    color: #121212!important;
    background: #FFFFFF!important;
  }
  .chart-order{
    margin-top 10px
  }
  .picker{
    width 255px !important
  }
</style>
