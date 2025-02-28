<template>
  <div class="flight">
    <div class="top">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="飞行任务" name="flightTask" v-if="$checkPermission('mngSide:flight:task')"></el-tab-pane>
        <el-tab-pane label="飞行排期" name="flightDate" v-if="$checkPermission('mngSide:flight:schedule')"></el-tab-pane>
        <el-tab-pane label="飞行记录" name="flightLog" v-if="$checkPermission('mngSide:flight:records')"></el-tab-pane>
        <el-tab-pane label="工单审核" name="WorkCompleted" v-if="$checkPermission('mngSide:flight:task')"></el-tab-pane>
      </el-tabs>
      <div class="operate-box">
        <div
          class="serach-box"
          :class="{ 'lang-search-box': checked }"
          v-if="currentTab == 'flightTask' || currentTab == 'flightLog' || currentTab == 'WorkCompleted'"
        >
          <el-input
            prefix-icon="el-icon-search"
            :placeholder="checkedTip"
            @focus="focus"
            @blur="blur"
            v-model="searchText"
            @input="inputChange"
            maxlength="10"
            clearable
          ></el-input>
        </div>
        <div class="create-task-btn" v-if="currentTab == 'flightTask'">
          <el-button round icon="el-icon-plus" @click="addAndEditTask" v-permissions="'wurenji:task:add'">新建任务</el-button>
        </div>
      </div>
    </div>
    <!-- 飞行任务 -->
    <div class="task-list-grid" v-if="currentTab == 'flightTask'">
      <filght-table ref="tableRef" v-permissions="'mngSide:flight:task'" :isWork="false"></filght-table>
    </div>
    <!-- 飞行记录 -->
    <div class="flight-log" v-if="currentTab == 'flightLog'">
      <flight-log ref="logRef"  v-permissions="'mngSide:flight:records'"></flight-log>
    </div>
    <!-- 飞行排期 -->
    <div v-if="currentTab == 'flightDate'">
      <flight-date  v-permissions="'mngSide:flight:schedule'"></flight-date>
    </div>
    <!-- 工单办结 -->
    <div class="task-list-grid" v-if="currentTab == 'WorkCompleted'">
      <FilghtApprovalStatus ref="tableRef" v-permissions="'mngSide:flight:task'" :isWork="true"></FilghtApprovalStatus>
    </div>
  </div>
</template>

<script>
import FilghtTable from "../components/FilghtTable.vue";
import FlightDate from "../components/FlightDate.vue";
import FlightLog from '../components/FlightLog.vue';
import FilghtApprovalStatus from '../components/FilghtApprovalStatus.vue'
export default {
  name: "Flight",
  data() {
    return {
      activeName: "flightTask",
      checked: false,
      searchText: "",
      currentTab: "flightTask",
    };
  },
  components: {
    FilghtTable,
    FlightDate,
    FlightLog,
    FilghtApprovalStatus
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
      this.searchText = '';
      this.currentTab = tab.name;
    },
    addAndEditTask() {
      this.$router.push('/openMap')
    },
    inputChange(val) {
      if(this.activeName === 'flightTask' || this.activeName === 'WorkCompleted') {
        //搜索飞行任务
        this.$refs.tableRef.searchTableName(val);
      } else if(this.activeName === 'flightLog') {
        //搜索飞行记录
        this.$refs.logRef.searchLogName(val);
      }
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
