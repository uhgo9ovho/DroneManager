<template>
  <div class="data">
    <div class="top">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="预警事件" name="warningEvent"></el-tab-pane>
        <el-tab-pane label="统计报告" name="statisticalReports"></el-tab-pane>
      </el-tabs>
      <div class="operate-box">
        <div
          class="serach-box"
          :class="{ 'lang-search-box': checked }"
        >
          <el-input
            prefix-icon="el-icon-search"
            :placeholder="checkedTip"
            @focus="focus"
            @blur="blur"
            @input="inputChange"
            v-model="searchText"
            clearable
          ></el-input>
        </div>
      </div>
    </div>
    <div>
      <div class="report-selector" v-if="currentTab == 'statisticalReports'">
        <!--        <div class="tab-container">-->
        <el-tabs v-model="activeTab" @tab-click="handleTabClick" type="card">
          <el-tab-pane label="日报" name="daily"></el-tab-pane>
          <el-tab-pane label="周报" name="weekly"></el-tab-pane>
        </el-tabs>
        <!--        </div>-->

        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="handleDateRangeChange"
        ></el-date-picker>
      </div>
    </div>
    <div class="task-list-grid" v-if="currentTab == 'warningEvent'">
      <warning-event ref="warningRef"></warning-event>
    </div>
    <div class="task-list-grid" v-else :key="forceRerender">
      <StatisticalReports :reportParams="params"></StatisticalReports>
    </div>
  </div>
</template>

<script>
import WarningEvent from '../components/WarningEvent.vue'
import StatisticalReports from '../components/StatisticalReports.vue'

export default {
  name: 'Flight',
  data() {
    return {
      activeName: 'warningEvent',
      checked: false,
      searchText: '',
      tableList: [
        {
          taskName: '【全景】比亚迪一期',
          airPort: '西安-周至',
          creater: '侯哥哥',
          status: '待执行',
          round_all: 5,
          round_complete: 2,
          ticket_create_time: '2024-08-01 11:16:04',
          airLine: [
            {
              lineName: '【全景】比亚迪一期',
              lineStatus: '待执行'
            },
            {
              lineName: '【全景】比亚迪二期',
              lineStatus: '已执行'
            },
            {
              lineName: '【全景】比亚迪三期',
              lineStatus: '执行失败'
            }
          ],
          cycle_detail: '周期循环，每1周四执行,生效日期2024-08-01'
        }
      ],
      currentTab: 'warningEvent',
      activeTab: 'daily', // 默认显示日报
      dateRange: [], // 时间范围，初始为空数组，由 el-date-picker 自动填充日期对象
      pickerOptions: {
        shortcuts: [
          {
            text: '最近28天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 28)
              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate(time) {
          return time.getTime() > Date.now() // 只禁用未来日期
        }
      },
      forceRerender:null,


      beginTime: null,
      endTime: null,
      tableType: 1
    }
  },
  created() {
    this.setDefaultDateRange()
  },
  components: {
    WarningEvent,
    StatisticalReports
  },
  computed: {
    params() {
      return {
        beginTime: this.beginTime,
        endTime: this.endTime,
        tableType: this.tableType
      };
    },
    checkedTip() {
      if (this.checked) {
        return "搜索名称";
      }
      return '搜索'
    }
  },
  methods: {
    focus() {
      this.checked = true
    },
    blur() {
      this.checked = false
    },
    handleClick(tab) {
      this.currentTab = tab.name
    },
    addAndEditTask() {
      this.$router.push('/openMap')
    },

    setDefaultDateRange() {
      const now = new Date()
      const start = new Date()
      start.setTime(now.getTime() - 3600 * 1000 * 24 * 28)
      this.beginTime = start.getTime()
      this.endTime = now.getTime()
      this.dateRange = [start, now] // 直接设置日期对象数组
    },
    handleTabClick(tab) {
      this.activeTab = tab.name;
      this.forceRerender = Date.now(); // 使用当前时间戳作为唯一的 key 值
      this.fetchReportData();
    },
    handleDateRangeChange(value) {
      // 无需转换时间范围，el-date-picker 会处理日期对象和显示之间的转换

      this.fetchReportData()
      this.forceRerender = Date.now(); // 使用当前时间戳作为唯一的 key 值

    },
    fetchReportData() {
      let beginTime, endTime
      if (this.dateRange.length === 2) {
        beginTime = this.dateRange[0].getTime()
        endTime = this.dateRange[1].getTime()

        // 检查时间跨度是否超过28天
        if ((endTime - beginTime) / (1000 * 60 * 60 * 24) > 28) {
          return this.$message.error('时间跨度不能超过28天,请选择有效的时间范围')
        }
      } else {
        // 使用默认时间范围
        const now = new Date()
        const start = new Date()
        start.setTime(now.getTime() - 3600 * 1000 * 24 * 28)
        beginTime = start.getTime()
        endTime = now.getTime()
      }

      const tableType = this.activeTab === 'daily' ? 1 : 2

      // 调用接口，以下仅为示例，实际应根据你的后端接口调整
      const params = {
        beginTime: beginTime,
        endTime: endTime,
        tableType: tableType
      }

      this.beginTime=beginTime
      this.endTime=endTime
      this.tableType=tableType
      console.log('接口调用参数:', params)
      // 示例：发送请求
      // axios.post('/api/reports', params).then(response => {
      //   console.log('接口响应:', response);
      // }).catch(error => {
      //   ElMessage.error('请求失败');
      // });
      },
    inputChange(val) {
      if(this.activeName === 'warningEvent') {
        //搜索预警事件名称
        this.$refs.warningRef.searchWarningName(val);
      } else {

      }
    }

  }
}

function formatDateToTimestamp(date) {
  return [date.getTime()]
}
</script>

<style lang="scss" >
.data {
  margin-top: 20px;
  padding-right: 26px;
  padding-left: 32px;

  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .report-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px;

  }

  .task-list-grid {
    flex: 1;
  }

  .operate-box {
    display: flex;

    .serach-box {
      margin-right: 20px;
      width: 100px;
      transition: width 0.5s;

      .el-input {
        border-radius: 20px;
        width: 100%;

        .el-input__inner {
          border-radius: 20px;
          width: 100%;
          border-color: #dcdfe6;
        }
      }
    }

    .lang-search-box {
      width: 360px;
    }

    .create-task-btn {
      .el-button {
        background-color: #000;
        color: #fff;
        border-color: #000;
      }
    }
  }

  .operate-box {
    display: flex;
    margin-right: 20px;
    align-items: center;
    justify-content: space-between;

    .el-dropdown-link {
      color: #448ef7;
      font-size: 14px;
    }

    .el-icon-guijifeihang:before {
      margin-right: 5px;
    }
  }

  .el-tabs {
    .el-tabs__item {
      font-size: 16px;

      &:hover {
        color: #000;
      }
    }

    .el-tabs__nav-wrap::after {
      display: none;
    }

    .el-tabs__active-bar {
      background-color: #000;
    }

    .is-active {
      color: #000;
    }
  }
}
</style>
