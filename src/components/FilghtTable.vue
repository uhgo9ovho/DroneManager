<template>
  <div class="flight-table">
    <common-table
      :tableList="filghtList"
      :columns="columns"
      :total="total"
      :pageSize="pageSize"
      :pageNum="pageNum"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    >
      <!-- 自定义表头 -->
      <template #taskName-header>
        <span>任务名称/类型</span>
        <el-dropdown @command="nameCommand" trigger="click">
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in nameOptions"
              :key="index"
              :command="item"
              :class="{ dropdown_selected: dropdownName == item }"
              >{{ item }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template #status-header>
        <span>任务状态</span>
        <el-dropdown @command="statusCommand" trigger="click" v-if="!isWork">
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item) in statusOptions"
              :key="item.index"
              :command="item.name"
              :class="{ dropdown_selected: dropdownStatus == item.name }"
              >{{ item.name }}
            </el-dropdown-item>
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
      <template #status="{ row }" v-if="!isWork">
        <el-tag :type="statusType(row.taskStatus)"
          >{{ row.taskStatus | filterStatus }}
        </el-tag>
        <span style="margin-left: 10px"
          >当前轮次/总轮次({{ row.currentRound ? row.currentRound : 0 }}/{{
            row.totalRound ? row.totalRound : 0
          }})</span
        >
      </template>
      <template #approvalStatus="{ row }" v-if="isWork">
        <el-tag :type="approvalStatusType(row.approvalStatus)"
          >{{ row.approvalStatus | filterApprovalStatus }}
        </el-tag>
      </template>
      <template #operate="{ row }">
        <div class="operate-box">
          <el-button
            type="text"
            @click="detailsBtn(row)"
            v-permissions="'wurenji:task:query'"
            >详情</el-button
          >
          <el-dropdown @command="operateCommand">
            <span class="el-dropdown-link el-icon-more"></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in operateOptions(row.taskStatus)"
                :key="index"
                :command="beforeHandleCommand(row, item.label)"
                :style="{ color: item.color }"
                v-show="
                  !(item.label == '成果' && row.taskType !== 2) &&
                  !(
                    (item.label == '挂起' ||
                      item.label == '取消挂起' ||
                      item.label == '排期') &&
                    row.taskStatus == 3
                  )
                "
                v-permissions="item.permission"
                ><i class="iconfont" :class="item.icon"></i>
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-if="isWork"
            type="primary"
            round
            size="small"
            class="el-icon-edit-outline"
            @click="workBtn(row)"
            style="
              width: 84px;
              height: 32px;
              padding: 0;
              line-height: 32px;
              font-size: 14px;
            "
            >办结</el-button
          >
          <el-button
            type="primary"
            round
            size="mini"
            class="iconfont el-icon-guijifeihang"
            v-permissions="'wurenji:scheduling:fly'"
            v-else
            style="
              width: 84px;
              height: 32px;
              padding: 0;
              line-height: 32px;
              font-size: 14px;
            "
            @click="flightBtn(row)"
            >飞行
          </el-button>
        </div>
      </template>
    </common-table>
    <!-- 详情弹窗、飞行弹窗 -->
    <div v-if="flightVisible">
      <flight-dialog
        @closeDialog="closeDialog"
        :detailsShow="detailsShow"
        :filghtShow="filghtShow"
        :row="row"
      ></flight-dialog>
    </div>
    <!-- 全景预览弹窗 -->
    <div v-if="panoramicVisible">
      <PanoramicDialog
        @closeQJDialog="closeQJDialog"
        :flightDataInfo="flightDataInfo"
      ></PanoramicDialog>
    </div>
    <!-- 飞行排期弹窗 -->
    <div v-if="flyDateVisible">
      <FlightDataDialog
        :flyDateVisible="flyDateVisible"
        :flightDataInfo="flightDataInfo"
        @closeFlightDateDialog="closeFlightDateDialog"
        @changeVisible="changeVisible"
      ></FlightDataDialog>
    </div>

    <el-dialog title="确定要挂起该任务？" :visible.sync="hangupVisible" center>
      <span
        >挂起任务后该任务下所有航线将取消排期，不会被执行。恢复任务后，可能需要重新设置排期！</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="hangupVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSuspend">确 定</el-button>
      </span>
    </el-dialog>
    <!--    </div>-->
  </div>
</template>

<script>
import CommonTable from "./CommonTable.vue";
import TableNameInfo from "./Template/TableNameInfo.vue";
import FlightDialog from "./Template/FlightDialog.vue";
import PanoramicDialog from "./Template/PanoramicDialog.vue";
import FlightDataDialog from "./Template/FlightDataDialog.vue";
import {
  taskListAPI,
  deleteTaskAPI,
  upDataTaskStatusAPI,
  workListAPI,
  orderApprovalAPI,
} from "@/api/TaskManager.js";

export default {
  name: "FlightTable",
  props: {
    isWork: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isWork(val) {
      if (val) {
        //工单
        this.columns = [
          {
            prop: "taskName",
            label: "任务名称/类型",
            showOverflowTooltip: true,
            slot: true,
            minWidth: "220",
          },
          {
            prop: "airportName",
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
            prop: "approvalStatus",
            label: "工单状态",
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
        ];
      } else {
        this.columns = [
          {
            prop: "taskName",
            label: "任务名称/类型",
            showOverflowTooltip: true,
            slot: true,
            minWidth: "220",
          },
          {
            prop: "airportName",
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
            label: "任务状态",
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
        ];
      }
      this.initList();
    },
  },
  data() {
    return {
      taskId: "",
      wrjFullview: null,
      flightDataInfo: {},
      total: 0,
      detailsShow: false,
      flightVisible: false,
      filghtShow: false,
      panoramicVisible: false,
      flyDateVisible: false,
      hangupVisible: false,
      filghtList: [],
      taskName: "",
      columns: [
        {
          prop: "taskName",
          label: "任务名称/类型",
          showOverflowTooltip: true,
          slot: true,
          minWidth: "220",
        },
        {
          prop: "airportName",
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
          label: "任务状态",
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
        "红外",
        // '全覆盖'
      ],
      statusOptions: [
        {index:0,name:"全部状态"},
        {index:2,name:"待执行"},
        {index:3,name:"执行中"},
        {index:4,name:"已完成"},
        {index:5,name:"挂起"}
      ],
      pageNum: 1,
      pageSize: 10,
      row: {},
      dropdownName: "全部类型",
      dropdownStatus: "全部状态",
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
        case 4:
          value = "已挂起";
          break;
        default:
          break;
      }
      return value;
    },
    filterApprovalStatus(val) {
      let value = "";
      switch (val) {
        case 1:
          value = "审核通过";
          break;
        case 2:
          value = "被驳回";
        default:
          value = "待审核";
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
          case 4:
            return "info";
          default:
            return "";
        }
      };
    },
    taskType(status) {
      return function (status) {
        switch (status) {
          case "拍照":
            return 0;
          case "直播":
            return 1;
          case "全景":
            return 2;
          case "正射":
            return 3;
          case "三维":
            return 4;
          default:
            return "";
        }
      };
    },
    approvalStatusType(status) {
      return function (status) {
        let value = "";
        switch (status) {
          case 1:
            value = "success";
            break;
          case 2:
            value = "danger";
          default:
            value = "info";
            break;
        }
        return value;
      };
    },
    taskTypeStatus(status) {
      return function (status) {
        switch (status) {
          case "拍照":
            return 0;
          case "直播":
            return 1;
          case "全景":
            return 2;
          case "正射":
            return 3;
          case "三维":
            return 4;
          case "红外":
            return 5;
          default:
            return "";
        }
      };
    },
    currentStatus() {
      return function (status) {
        switch (status) {
          case "待审核":
            return 0;
          case "待执行":
            return 1;
          case "执行中":
            return 2;
          case "已完成":
            return 3;
          case "挂起":
            return 4;
          default:
            return "";
        }
      };
    },
    operateOptions() {
      return function (taskStatus) {
        if (taskStatus === 4) {
          //已挂起
          return [
            {
              label: "成果",
              icon: "el-icon-zhaochengguo",
              permission: "wurenji:task:query",
            },
            {
              label: "排期",
              icon: "el-icon-paiqi",
              permission: "wurenji:task:edit",
            },
            {
              label: "取消挂起",
              icon: "el-icon-3duihuacopy",
              permission: "wurenji:task:guaqi",
            },
            {
              label: "删除",
              icon: "el-icon-shanchu",
              color: "red",
              permission: "wurenji:task:remove",
            },
          ];
        } else {
          return [
            {
              label: "成果",
              icon: "el-icon-zhaochengguo",
              permission: "wurenji:task:query",
            },
            {
              label: "排期",
              icon: "el-icon-paiqi",
              permission: "wurenji:task:edit",
            },
            {
              label: "挂起",
              icon: "el-icon-3duihuacopy",
              permission: "wurenji:task:guaqi",
            },
            {
              label: "删除",
              icon: "el-icon-shanchu",
              color: "red",
              permission: "wurenji:task:remove",
            },
          ];
        }
      };
    },
  },
  methods: {
    workBtn(row) {
      this.$confirm("确认驳回吗？", "提示", {
        confirmButtonText: "通过",
        cancelButtonText: "驳回",
        type: "warning",
        distinguishCancelAndClose: true,
      })
        .then(() => {
          const params = {
            taskId: row.taskId,
            approvalStatus: 1,
          };
          orderApprovalAPI(params).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: res.msg,
              });
              this.initList();
            }
          });
        })
        .catch((action) => {
          if (action === "cancel") {
            const params = {
              taskId: row.taskId,
              approvalStatus: 2,
            };
            orderApprovalAPI(params).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: res.msg,
                });
                this.initList();
              }
            });
          }
        });
    },
    upDataTaskStatus() {
      upDataTaskStatusAPI(this.taskId).then((res) => {
        if (res.code === 200) {
          this.taskId = "";
          this.initList();
          this.$message({
            type: "success",
            message: res.msg,
          });
        } else {
          this.$message.error("挂起失败");
        }
      });
    },

    handleSuspend() {
      this.hangupVisible = false;
      this.upDataTaskStatus();
    },

    searchTableName(val) {
      this.taskName = val;
      this.pageNum = 1;
      this.initList();
    },

    changeVisible() {
      this.flyDateVisible = false;
      this.initList();
    },
    initList() {
      console.log(this.dropdownStatus)
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        taskName: this.taskName,
        taskStatus:this.currentStatus(this.dropdownStatus)
      };
      if (this.isWork) {
        workListAPI(params).then((res) => {
          if (res.code === 200) {
            this.filghtList = res.rows;
            this.total = res.total;
          }
        });
      } else {
        taskListAPI(params).then((res) => {
          if (res.code === 200) {
            this.filghtList = res.rows;
            this.total = res.total;
          }
        });
      }
    },
    sizeChange(params) {
      this.pageNum = params.pageNum;
      this.pageSize = params.pageSize;
      params.taskName = this.taskName;
      params.task_type = this.taskTypeStatus(this.dropdownName);
      params.taskStatus = this.currentStatus(this.dropdownStatus);
      if (this.isWork) {
        workListAPI(params).then((res) => {
          if (res.code === 200) {
            this.filghtList = res.rows;
            this.total = res.total;
          }
        });
      } else {
        taskListAPI(params).then((res) => {
          if (res.code === 200) {
            this.filghtList = res.rows;
            this.total = res.total;
          }
        });
      }
    },
    pageChange(params) {
      this.pageNum = params.pageNum;
      this.pageSize = params.pageSize;
      params.taskName = this.taskName;
      params.task_type = this.taskTypeStatus(this.dropdownName);
      params.taskStatus = this.currentStatus(this.dropdownStatus);
      if (this.isWork) {
        workListAPI(params).then((res) => {
          if (res.code === 200) {
            this.filghtList = res.rows;
            this.total = res.total;
          }
        });
      } else {
        taskListAPI(params).then((res) => {
          if (res.code === 200) {
            this.filghtList = res.rows;
            this.total = res.total;
          }
        });
      }
    },
    nameCommand(itemCommand) {
      this.dropdownName = itemCommand;
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        task_type: this.taskTypeStatus(itemCommand),
        taskName: this.taskName,
        taskStatus: this.currentStatus(this.dropdownStatus)
      };
      if (this.isWork) {
        workListAPI(data).then((res) => {
          if (res.code === 200) {
            this.filghtList = res.rows;
            this.total = res.total;
          }
        });
      } else {
        taskListAPI(data).then((res) => {
          this.filghtList = res.rows;
          this.total = res.total;
        });
      }
    },
    statusCommand(itemCommand) {
      console.log(itemCommand);

      this.dropdownStatus = itemCommand;
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        taskStatus: this.currentStatus(itemCommand),
        task_type: this.taskTypeStatus(this.dropdownName)
    };
      if (this.isWork) {
        workListAPI(params).then((res) => {
          if (res.code === 200) {
            this.filghtList = res.rows;
            this.total = res.total;
          }
        });
      } else {
        taskListAPI(data).then((res) => {
          this.filghtList = res.rows;
          this.total = res.total;
        });
      }
    },
    beforeHandleCommand(row, label) {
      return {
        row,
        label,
      };
    },
    operateCommand(itemCommand) {
      console.log(itemCommand);
      switch (itemCommand.label) {
        case "成果":
          this.panoramicVisible = true;
          this.flightDataInfo = itemCommand.row;
          break;
        case "排期":
          this.flightDataInfo = itemCommand.row;
          this.flyDateVisible = true;
          break;
        case "挂起":
          this.hangupVisible = true;
          this.taskId = itemCommand.row.taskId;
          console.log("taskId:", this.taskId);
          console.log("挂起被点击");
          break;
        case "取消挂起":
          this.taskId = itemCommand.row.taskId;
          this.upDataTaskStatus();
          break;
        case "删除":
          this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            deleteTaskAPI(itemCommand.row.taskId).then((res) => {
              if (res.code === 200) {
                this.initList();
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              } else {
                this.$message.error("删除失败");
              }
            });
          });
          break;
        default:
          break;
      }
    },
    detailsBtn(row) {
      this.row = row;
      this.flightVisible = true;
      this.filghtShow = false;
      this.detailsShow = true;
    },
    flightBtn(row) {
      this.row = row;
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

.el-dialog {
  background: #fff;
  border-radius: 12px;
  padding: 24px 24px 16px 32px;
  overflow: hidden; /* 防止内容溢出 */
  // top: 40% !important;
  // transform: translateY(-50%) !important;
  width: 470px;
  //height: 230px;
}
</style>
