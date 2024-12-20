<template>
  <div ref="chart" style="width: 100%; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'PieChart',
  props: {
    questData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },

  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart)

      const option = {
        title: {
          text: '任务类型统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)' // 显示名称、数量、百分比
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: Object.keys(this.questData).map(key => ({
            name: key // 图例名称
          }))
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '50%',
            data: Object.entries(this.questData).map(([key, value]) => ({
              name: key,
              value: value,
              label: {
                show: true,
                formatter: '{b}: {c}' // 显示名称和数量
              }
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      this.chart.setOption(option)
      this.chart.on('finished', this.onChartFinished) // 监听图表渲染完成事件
    },
    onChartFinished() {
      // 图表渲染完成后，转换为 base64 并触发事件
      const base64 = this.chart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      })
      this.$emit('chart-exported', base64)
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
  }
}
</script>

<style scoped>

</style>
