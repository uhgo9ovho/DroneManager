<template>
  <div class="data_box">
    <div class="top">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="预警事件" name="warningEvent" v-if="permissions.includes('wurenji:warning:list') || permissions[0] == '*:*:*'"></el-tab-pane>
        <el-tab-pane label="统计报告" name="statisticalReports" v-if="permissions.includes('mngSide:data:report') || permissions[0] == '*:*:*'"></el-tab-pane>
      </el-tabs>
      <div class="report-selector" v-if="currentTab == 'statisticalReports'" v-permissions="'mngSide:data:report'">
        <!--        <div class="tab-container">-->
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="日报" name="daily" v-if="permissions.includes('mngSide:data:report:day') || permissions[0] == '*:*:*'"></el-tab-pane>
          <el-tab-pane label="周报" name="weekly" v-if="permissions.includes('mngSide:data:report:weeks') || permissions[0] == '*:*:*'"></el-tab-pane>
          <el-tab-pane label="月报" name="monthly" v-if="permissions.includes('mngSide:data:report:months') || permissions[0] == '*:*:*'"></el-tab-pane>
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
      <div class="operate-box" v-if="currentTab == 'warningEvent'">
        <div class="serach-box" :class="{ 'lang-search-box': checked }">
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
    <div></div>
    <div class="task-list-grid" v-if="currentTab == 'warningEvent'">
      <warning-event ref="warningRef" v-permissions="'wurenji:warning:list'"></warning-event>
    </div>
    <div class="task-list-grid" v-else :key="forceRerender">
      <StatisticalReports @changeLookUp="changeLookUp" :reportParams="params" v-permissions="'mngSide:data:report'"></StatisticalReports>
    </div>
    <div class="page-wrap" v-if="showLookUp">
      <WordPreviewVue @closeLookUp="closeLookUp" :itemRow="itemRow"></WordPreviewVue>
    </div>
  </div>
</template>

<script>
import WarningEvent from "../components/WarningEvent.vue";
import StatisticalReports from "../components/StatisticalReports.vue";
import WordPreviewVue from "./WordPreview.vue";
export default {
  name: "Flight",
  data() {
    return {
      dayRange:28,
      weekRange: 90,
      monthRange: 365,
      // yearRange: 365,
      permissions: JSON.parse(localStorage.getItem('userPermission')),
      itemRow: null,
      showLookUp: false,
      activeName: "warningEvent",
      checked: false,
      searchText: "",
      tableList: [
        {
          taskName: "【全景】比亚迪一期",
          airPort: "西安-周至",
          creater: "侯哥哥",
          status: "待执行",
          round_all: 5,
          round_complete: 2,
          ticket_create_time: "2024-08-01 11:16:04",
          airLine: [
            {
              lineName: "【全景】比亚迪一期",
              lineStatus: "待执行",
            },
            {
              lineName: "【全景】比亚迪二期",
              lineStatus: "已执行",
            },
            {
              lineName: "【全景】比亚迪三期",
              lineStatus: "执行失败",
            },
          ],
          cycle_detail: "周期循环，每1周四执行,生效日期2024-08-01",
        },
      ],
      currentTab: "warningEvent",
      activeTab: "daily", // 默认显示日报
      dateRange: [], // 时间范围，初始为空数组，由 el-date-picker 自动填充日期对象
      pickerOptions: {
        shortcuts: [
          {
            text: "最近28天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * this.dayRange);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近90天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * this.weekRange);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近365天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * this.monthRange);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
        disabledDate(time) {
          return time.getTime() > Date.now(); // 只禁用未来日期
        },
      },
      forceRerender: null,

      beginTime: null,
      endTime: null,
      tableType: 1,
    };
  },
  created() {
    this.setDefaultDateRange();
  },
  components: {
    WarningEvent,
    StatisticalReports,
    WordPreviewVue,
  },
  computed: {
    params() {
      return {
        beginTime: this.beginTime,
        endTime: this.endTime,
        tableType: this.tableType,
      };
    },
    checkedTip() {
      if (this.checked) {
        return "请输入事件名称";
      }
      return "搜索";
    },
  },
  methods: {
    closeLookUp() {
      this.showLookUp = false;
    },
    changeLookUp(dateTime, date,tableType) {
      this.showLookUp = true;
      this.itemRow = {dateTime,date,tableType};
    },
    focus() {
      this.checked = true;
    },
    blur() {
      this.checked = false;
    },
    handleClick(tab) {
      this.searchText = "";
      this.currentTab = tab.name;
    },
    addAndEditTask() {
      this.$router.push("/openMap");
    },

    setDefaultDateRange() {
      const now = new Date();
      const start = new Date();

      if (this.activeTab === "daily") {
        // 日报，默认28天
        start.setTime(now.getTime() - 3600 * 1000 * 24 * this.dayRange);
      } else if (this.activeTab === "weekly") {
        // 周报，默认90天
        start.setTime(now.getTime() - 3600 * 1000 * 24 * this.weekRange);
      } else if (this.activeTab === "monthly") {
        // 月报，默认365天
        start.setTime(now.getTime() - 3600 * 1000 * 24 * this.monthRange);
      }
      this.beginTime = start.getTime();
      this.endTime = now.getTime();
      this.dateRange = [start, now]; // 直接设置日期对象数组
    },
    handleTabClick(tab) {
      this.activeTab = tab.name;
      this.forceRerender = Date.now(); // 使用当前时间戳作为唯一的 key 值
      // 根据选中的 tab 更新日期选择范围
      this.updateDateRangeByTab(this.activeTab);
      this.fetchReportData();
    },
    // 根据选中的 tab 来更新日期选择范围
    updateDateRangeByTab(activeTab) {
      let start = new Date();
      let end = new Date();

      // 根据选中的报表类型（日报、周报、月报）设置日期范围
      if (activeTab === "daily") {
        start.setTime(end.getTime() - 3600 * 1000 * 24 * this.dayRange); // 设置为28天
        this.pickerOptions.shortcuts = [
          {
            text: "最近28天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * this.dayRange);
              picker.$emit("pick", [start, end]);
            },
          },
        ];
      } else if (activeTab === "weekly") {
        start.setTime(end.getTime() - 3600 * 1000 * 24 * this.weekRange); // 设置为90天
        this.pickerOptions.shortcuts = [
          {
            text: "最近90天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * this.weekRange);
              picker.$emit("pick", [start, end]);
            },
          },
        ];
      } else if (activeTab === "monthly") {
        start.setTime(end.getTime() - 3600 * 1000 * 24 * this.monthRange); // 设置为365天
        this.pickerOptions.shortcuts = [
          {
            text: "最近365天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * this.monthRange);
              picker.$emit("pick", [start, end]);
            },
          },
        ];
      }

      // 更新默认时间范围
      this.dateRange = [start, end];
    },
    handleDateRangeChange(value) {
      this.fetchReportData();
      this.forceRerender = Date.now(); // 使用当前时间戳作为唯一的 key 值
    },
    fetchReportData() {
      let beginTime, endTime;

      if (this.dateRange && this.dateRange.length === 2) {
        beginTime = this.dateRange[0].getTime();
        endTime = this.dateRange[1].getTime();

        // 检查时间跨度是否超过最大限制
        if (this.activeTab === "daily" && (endTime - beginTime) / (1000 * 60 * 60 * 24) > this.dayRange) {
          this.$message.error("时间跨度不能超过28天, 请选择有效的时间范围");
          this.resetDateRangeToDefault(); // 重置日期范围为默认
          return;
        } else if (this.activeTab === "weekly" && (endTime - beginTime) / (1000 * 60 * 60 * 24) > this.weekRange) {
          this.$message.error("时间跨度不能超过90天, 请选择有效的时间范围");
          this.resetDateRangeToDefault(); // 重置日期范围为默认
          return;
        } else if (this.activeTab === "monthly" && (endTime - beginTime) / (1000 * 60 * 60 * 24) > this.monthRange) {
          this.$message.error("时间跨度不能超过365天, 请选择有效的时间范围");
          this.resetDateRangeToDefault(); // 重置日期范围为默认
          return;
        }
      } else {
        // 如果没有选中日期范围，使用默认范围
        this.resetDateRangeToDefault(); // 重置日期范围为默认
      }

      let tableType = 1;
      if(this.activeTab === "daily"){
        tableType = 1;
      } else if(this.activeTab === "weekly"){
        tableType = 2;
      } else {
        tableType = 3;
      }

      const params = {
        beginTime: beginTime,
        endTime: endTime,
        tableType: tableType,
      };

      this.beginTime = beginTime;
      this.endTime = endTime;
      this.tableType = tableType;
      console.log("接口调用参数:", params);
    },

    // 重置日期范围为默认值，依据当前选项
    resetDateRangeToDefault() {
      const now = new Date();
      let start = new Date();

      // 根据当前选项设置默认日期范围
      if (this.activeTab === "daily") {
        // 默认28天
        start.setTime(now.getTime() - 3600 * 1000 * 24 * this.dayRange);
      } else if (this.activeTab === "weekly") {
        // 默认90天
        start.setTime(now.getTime() - 3600 * 1000 * 24 * this.weekRange);
      } else if (this.activeTab === "monthly") {
        // 默认365天
        start.setTime(now.getTime() - 3600 * 1000 * 24 * this.monthRange);
      }

      this.dateRange = [start, now]; // 重置为相应的默认范围
      // 更新本地的 beginTime 和 endTime
      this.beginTime = start.getTime();
      this.endTime = now.getTime();
    },
    inputChange(val) {
      if (this.activeName === "warningEvent") {
        //搜索预警事件名称
        this.$refs.warningRef.searchWarningName(val);
      } else {
      }
    },
  },
};

function formatDateToTimestamp(date) {
  return [date.getTime()];
}
</script>

<style lang="scss">
.data_box {
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
    align-items: center;
    .el-tabs__header {
      margin-bottom: 0;
      margin-right: 20px;
    }
    .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__active-bar {
      height: 32px;
      width: 72px;
      transform: translateX(72px);
      background: #0271e3;
      border-radius: 16px;
      z-index: 0;
      line-height: 32px;
    }

    .is-active {
      color: #fff !important;
    }

    .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item {
      width: 72px;
      line-height: 32px;
      height: 32px;
      font-weight: 600;
      font-size: 14px;
      color: #6e6e73;
      -webkit-transition: color 0.5s;
      transition: color 0.5s;
      letter-spacing: 0;
      text-align: center;
      padding: 0;
    }
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
  .page-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    overflow: auto;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    background-color: rgba(29, 29, 31, 0.8);
    backdrop-filter: blur(5px);
    z-index: 1001;
  }
}
</style>
