<template>
  <div class="flight">
    <div class="top">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="飞行任务" name="first"> </el-tab-pane>
        <el-tab-pane label="飞行排期" name="second"></el-tab-pane>
        <el-tab-pane label="飞行记录" name="third"></el-tab-pane>
      </el-tabs>
      <div class="operate-box">
        <div class="serach-box" :class="{ 'lang-search-box': checked }">
          <el-input
            prefix-icon="el-icon-search"
            :placeholder="checkedTip"
            @focus="focus"
            @blur="blur"
            v-model="searchText"
            clearable
          ></el-input>
        </div>
        <div class="create-task-btn">
          <el-button round icon="el-icon-plus">新建任务</el-button>
        </div>
      </div>
    </div>
    <div class="task-list-grid">
      <common-table :tableList="mockTableList" :columns="columns">
        <template #taskName="{ row }">
          <table-name-info :row="row"></table-name-info>
        </template>
        <template #creater="{ row }">
          <div>{{ row.creater }}</div>
          <div>{{ row.ticket_create_time }}</div>
        </template>
        <template #status="{ row }">
          <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
          <span style="margin-left: 10px"
            >当前轮次/总轮次({{ row.round_complete }}/{{ row.round_all }})</span
          >
        </template>
        <template #operate>
          <div class="operate-box">
            <el-button type="text">详情</el-button>
            <el-dropdown>
              <span class="el-dropdown-link el-icon-more"> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              type="primary"
              round
              size="mini"
              class="iconfont el-icon-guijifeihang"
              style="width: 84px; height: 32px; padding: 0; line-height: 32px; font-size: 14px;"
              >飞行</el-button
            >
          </div>
        </template>
      </common-table>
    </div>
  </div>
</template>

<script>
import CommonTable from "../components/CommonTable.vue";
import TableNameInfo from "../components/Template/TableNameInfo.vue";
import mockList from '@/utils/mock.js';
export default {
  name: "Flight",
  data() {
    return {
      activeName: "first",
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
      columns: [
        {
          prop: "taskName",
          label: "任务名称/类型",
          showOverflowTooltip: true,
          slot: true,
          minWidth: "200",
        },
        {
          prop: "airPort",
          label: "机场",
          showOverflowTooltip: true,
        },
        {
          prop: "creater",
          label: "创建人/时间",
          showOverflowTooltip: false,
          slot: true,
        },
        {
          prop: "status",
          label: "本轮状态",
          showOverflowTooltip: false,
          slot: true,
        },
        {
          prop: "operate",
          label: "操作",
          showOverflowTooltip: false,
          width: "200px",
          slot: true,
        },
      ],
    };
  },
  components: {
    CommonTable,
    TableNameInfo,
  },
  computed: {
    mockTableList() {
      return mockList
    },
    checkedTip() {
      if (this.checked) {
        return "搜索任务名称、机场、创建人";
      }
      return "搜索";
    },
    statusType(status) {
      return function (status) {
        switch (status) {
          case "制作中":
            return "";
          case "已完成":
            return "success";
          case "制作失败":
            return "danger";
          case "待执行":
            return "warning";
          case "已过期":
            return "info";
          default:
            return "";
        }
      };
    },
  },
  methods: {
    focus() {
      this.checked = true;
    },
    blur() {
      this.checked = false;
    },
    handleClick() {},
    row(row) {
      console.log(row);
    },
  },
};
</script>

<style lang="scss">
.flight {
  margin-top: 20px;
  padding-right: 20px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .task-list-grid {
    flex: 1;
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
    width: 180px;
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
}
</style>