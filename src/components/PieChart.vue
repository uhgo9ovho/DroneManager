<script>
import * as echarts from 'echarts';

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
      chart: null,
    };
  },
  mounted() {
    this.initChart();
    this.chart = echarts.init(this.$refs.chart);
  },
  watch: {
    // 监听option的变化，以便在数据更新时重新渲染图表
    option: {
      handler(newVal) {
        this.updateChartData(newVal.quest);
      },
      deep: true, // 深度监听对象内部属性的变化
      immediate: true // 在组件创建时立即执行一次监听器
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);

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
            name: key, // 图例名称
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
      };

      this.chart.setOption(option);
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>

<template>
  <div ref="chart" style="width: 100%; height: 400px;"></div>
</template>

<style scoped>

</style>
