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
    <div class="task-list-grid" v-if="currentTab == 'warningEvent'">
      <warning-event ref="warningRef"></warning-event>
    </div>
    <div class="task-list-grid" v-else>
      <StatisticalReports></StatisticalReports>
    </div>
  </div>
</template>

<script>
import WarningEvent from "../components/WarningEvent.vue";
import StatisticalReports from "../components/StatisticalReports.vue";
export default {
  name: "Flight",
  data() {
    return {
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
    };
  },
  components: {
    WarningEvent,
    StatisticalReports
  },
  computed: {
    checkedTip() {
      if (this.checked) {
        return "搜索名称";
      }
      return "搜索";
    },
  },
  methods: {
    focus() {
      this.checked = true;
    },
    blur() {
      this.checked = false;
    },
    handleClick(tab) {
      this.currentTab = tab.name;
    },
    addAndEditTask() {
      this.$router.push('/openMap')
    },
    inputChange(val) {
      if(this.activeName === 'warningEvent') {
        //搜索预警事件名称
        this.$refs.warningRef.searchWarningName(val);
      } else {

      }
    }
  },
};
</script>

<style lang="scss">
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