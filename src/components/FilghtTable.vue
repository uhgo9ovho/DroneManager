<template>
  <div class="flight-table">
    <common-table
      :tableList="filghtList"
      :columns="columns"
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    >
      <!-- 自定义表头 -->
      <template #taskName-header>
        <span>任务名称/类型</span>
        <el-dropdown @command="nameCommand">
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in nameOptions"
              :key="index"
              :command="item"
              >{{ item }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template #airPort-header>
        <span>机场</span>
        <el-dropdown>
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template #status-header>
        <span>本轮状态</span>
        <el-dropdown @command="statusCommand">
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in statusOptions"
              :key="index"
              :command="item"
              >{{ item }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <!-- 内容插槽 -->
      <template #taskName="{ row }">
        <table-name-info :row="row"></table-name-info>
      </template>
      <template #creater="{ row }">
        <div>{{ row.taskCreateTime }}</div>
        <div>{{ row.nickName }}</div>
      </template>
      <template #status="{ row }">
        <el-tag :type="statusType(row.taskStatus)">{{
          row.taskStatus | filterStatus
        }}</el-tag>
        <span style="margin-left: 10px"
          >当前轮次/总轮次({{ row.currentRound }}/{{ row.totalRound }})</span
        >
      </template>
      <template #operate="{ row }">
        <div class="operate-box">
          <el-button type="text" @click="detailsBtn(row.taskId)"
            >详情</el-button
          >
          <el-dropdown @command="operateCommand">
            <span class="el-dropdown-link el-icon-more"></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in operateOptions"
                :key="index"
                :command="beforeHandleCommand(row, item.label)"
                :style="{ color: item.color }"
                ><i class="iconfont" :class="item.icon"></i>
                {{ item.label }}</el-dropdown-item
              >
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
            @click="flightBtn"
            >飞行</el-button
          >
        </div>
      </template>
    </common-table>
    <!-- 详情弹窗、飞行弹窗 -->
    <div v-if="flightVisible">
      <flight-dialog
        @closeDialog="closeDialog"
        :detailsShow="detailsShow"
        :filghtShow="filghtShow"
        :taskId="taskId"
      ></flight-dialog>
    </div>
    <!-- 全景预览弹窗 -->
    <div v-if="panoramicVisible">
      <PanoramicDialog @closeQJDialog="closeQJDialog"></PanoramicDialog>
    </div>
    <!-- 飞行排期弹窗 -->
    <div v-if="flyDateVisible">
      <FlightDataDialog
        :flyDateVisible="flyDateVisible"
        @closeFlightDateDialog="closeFlightDateDialog"
      ></FlightDataDialog>
    </div>
  </div>
</template>

<script>
import CommonTable from "./CommonTable.vue";
import TableNameInfo from "./Template/TableNameInfo.vue";
import FlightDialog from "./Template/FlightDialog.vue";
import PanoramicDialog from "./Template/PanoramicDialog.vue";
import FlightDataDialog from "./Template/FlightDataDialog.vue";
import { taskListAPI, deleteTaskAPI } from "@/api/TaskManager.js";
export default {
  name: "FlightTable",
  props: {},
  data() {
    return {
      total: 0,
      detailsShow: false,
      flightVisible: false,
      filghtShow: false,
      panoramicVisible: false,
      flyDateVisible: false,
      filghtList: [],
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
      nameOptions: [
        "全部类型",
        "拍照",
        "直播",
        "全景",
        "三维",
        "正射",
        "全覆盖",
      ],
      statusOptions: [
        "全部状态",
        "已挂起",
        "执行终止",
        "待审核",
        "审核中",
        "待执行",
        "执行中",
        "制作中",
        "制作失败",
        "已完成",
        "已过期",
        "执行失败",
      ],
      operateOptions: [
        {
          label: "成果",
          icon: "el-icon-zhaochengguo",
        },
        {
          label: "排期",
          icon: "el-icon-paiqi",
        },
        {
          label: "挂起",
          icon: "el-icon-3duihuacopy",
        },
        {
          label: "删除",
          icon: "el-icon-shanchu",
          color: "red",
        },
      ],
      pageNum: 1,
      pageSize: 10,
      taskId: 0,
    };
  },
  mounted() {
    this.initList();
  },
  filters: {
    filterStatus(val) {
      let value = "";
      switch (val) {
        case 0:
          value = "待审核";
          break;
        case 1:
          value = "待执行";
          break;
        case 2:
          value = "执行中";
          break;
        case 3:
          value = "已完成";
          break;
        default:
          break;
      }
      return value;
    },
  },
  computed: {
    statusType(status) {
      return function (status) {
        switch (status) {
          case 2:
            return "";
          case 3:
            return "success";
          case 1:
            return "primary";
          case 0:
            return "info";
          default:
            return "";
        }
      };
    },
  },
  methods: {
    initList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      taskListAPI(params).then((res) => {
        if (res.code === 200) {
          this.filghtList = res.rows;
          this.total = res.total;
        }
      });
    },
    sizeChange(params) {
      taskListAPI(params).then((res) => {
        if (res.code === 200) {
          this.filghtList = res.rows;
          this.total = res.total;
        }
      });
    },
    pageChange(params) {
      taskListAPI(params).then((res) => {
        if (res.code === 200) {
          this.filghtList = res.rows;
          this.total = res.total;
        }
      });
    },
    nameCommand(itemCommand) {
      console.log(itemCommand);
    },
    statusCommand(itemCommand) {},
    beforeHandleCommand(row, label) {
      return {
        row,
        label
      };
    },
    operateCommand(itemCommand) {
      console.log(itemCommand);
      switch (itemCommand.label) {
        case "成果":
          this.panoramicVisible = true;
          break;
        case "排期":
          this.flyDateVisible = true;
          break;
        case "挂起":
          break;
        case "删除":
          this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              deleteTaskAPI(itemCommand.row.taskId).then((res) => {
                if (res.code === 200) {
                  this.initList()
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                } else {
                  this.$message.error('删除失败')
                }
              });
            });
          break;
        default:
          break;
      }
    },
    detailsBtn(taskId) {
      this.taskId = taskId;
      this.flightVisible = true;
      this.filghtShow = false;
      this.detailsShow = true;
    },
    flightBtn() {
      this.flightVisible = true;
      this.detailsShow = false;
      this.filghtShow = true;
    },
    closeDialog() {
      this.flightVisible = false;
    },
    closeQJDialog() {
      this.panoramicVisible = false;
    },
    closeFlightDateDialog() {
      this.flyDateVisible = false;
    },
  },
  components: {
    CommonTable,
    TableNameInfo,
    FlightDialog,
    PanoramicDialog,
    FlightDataDialog,
  },
};
</script>

<style lang="scss">
.flight-table {
  .filter-icon {
    margin-left: 5px;
    vertical-align: text-top;
    &:hover {
      cursor: pointer;
      transform: scale(1.3);
    }
  }
}
</style>