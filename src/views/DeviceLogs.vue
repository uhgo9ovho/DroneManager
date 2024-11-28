<template>
  <div class="device-log">
    <common-table
      :tableList="deviceList"
      :columns="columns"
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    >
      <template #level="{ row }">
        <el-tag :type="row.level | filterType">{{
          row.level | filterLevel
        }}</el-tag>
      </template>
      <template #module="{ row }">
        {{ row.module | filterModule }}
      </template>
    </common-table>
  </div>
</template>

<script>
import CommonTable from "../components/CommonTable.vue";
import { deviceInfoAPI } from "@/api/TaskManager.js";
export default {
  data() {
    return {
      deviceList: [],
      columns: [
        {
          prop: "level",
          label: "日志类型",
          showOverflowTooltip: true,
          slot: true,
        },
        {
          prop: "module",
          label: "模块",
          showOverflowTooltip: true,
          slot: true,
        },
        {
          prop: "messageZh",
          label: "报警信息",
          minWidth: 200,
        },
        {
          prop: "createTime",
          label: "预警时间",
          showOverflowTooltip: false,
        },
      ],
      total: 0,
      pageNum: 1,
      pageSize: 10,
    };
  },
  filters: {
    filterLevel(level) {
      switch (level) {
        case 0:
          return "通知";
        case 1:
          return "轻微警告";
        case 2:
          return "严重警告";
        default:
          break;
      }
    },
    filterType(level) {
      switch (level) {
        case 0:
          return "";
        case 1:
          return "warning";
        case 2:
          return "danger";
        default:
          break;
      }
    },
    filterModule(module) {
      switch (module) {
        case 0:
          return "飞行任务";
        case 1:
          return "设备管理";
        case 2:
          return "媒体";
        case 3:
          return "hms";
        default:
          break;
      }
    },
  },
  components: {
    CommonTable,
  },
  methods: {
    getDeviceList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      deviceInfoAPI(params).then((res) => {
        if (res.code === 200) {
          this.deviceList = res.rows;
          this.total = res.total;
        }
      });
    },
    pageChange(params) {
      this.pageNum = params.pageNum;
      this.pageSize = params.pageSize;
      this.getDeviceList();
    },
    sizeChange(params) {
      this.pageNum = params.pageNum;
      this.pageSize = params.pageSize;
      this.getDeviceList();
    },
  },
  mounted() {
    this.getDeviceList();
  },
};
</script>

<style lang="scss">
.device-log {
  width: 100%;
  margin-top: 80px;
  padding-right: 26px;
  padding-left: 32px;
}
</style>