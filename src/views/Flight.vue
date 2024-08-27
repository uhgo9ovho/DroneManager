<template>
  <div class="flight">
    <div class="top">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="飞行任务" name="flightTask"></el-tab-pane>
        <el-tab-pane label="飞行排期" name="flightDate"></el-tab-pane>
        <el-tab-pane label="飞行记录" name="flightLog"></el-tab-pane>
      </el-tabs>
      <div class="operate-box">
        <div
          class="serach-box"
          :class="{ 'lang-search-box': checked }"
          v-if="currentTab == 'flightTask' || currentTab == 'flightLog'"
        >
          <el-input
            prefix-icon="el-icon-search"
            :placeholder="checkedTip"
            @focus="focus"
            @blur="blur"
            v-model="searchText"
            clearable
          ></el-input>
        </div>
        <div class="create-task-btn" v-if="currentTab == 'flightTask'">
          <el-button round icon="el-icon-plus" @click="addTask">新建任务</el-button>
        </div>
      </div>
    </div>
    <div class="task-list-grid" v-if="currentTab == 'flightTask'">
      <filght-table></filght-table>
    </div>
    <!-- 飞行记录 -->
    <div class="flight-log" v-if="currentTab == 'flightLog'">飞行记录</div>
    <!-- 飞行排期 -->
    <div class="flight-date" v-if="currentTab == 'flightDate'">
      <flight-date></flight-date>
    </div>
  </div>
</template>

<script>
import FilghtTable from "../components/FilghtTable.vue";
import FlightDate from "../components/FlightDate.vue";
export default {
  name: "Flight",
  data() {
    return {
      activeName: "flightTask",
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

      currentTab: "flightTask",
    };
  },
  components: {
    FilghtTable,
    FlightDate
  },
  computed: {
    checkedTip() {
      if (this.checked) {
        return "搜索任务名称、机场、创建人";
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
    addTask() {
      this.$router.push('/openMap')
    }
  },
};
</script>

<style lang="scss">
.flight {
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