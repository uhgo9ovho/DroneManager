<template>
  <div class="flight-table">
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
            style="
              width: 84px;
              height: 32px;
              padding: 0;
              line-height: 32px;
              font-size: 14px;
            "
            >飞行</el-button
          >
        </div>
      </template>
    </common-table>
  </div>
</template>

<script>
import CommonTable from "./CommonTable.vue";
import mockList from "@/utils/mock.js";
import TableNameInfo from "./Template/TableNameInfo.vue";
export default {
  name: "FlightTable",
  props: {},
  data() {
    return {
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
  computed: {
    mockTableList() {
      return mockList;
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
  components: {
    CommonTable,
    TableNameInfo
  },
};
</script>

<style lang="scss">
.flight-table {
}
</style>