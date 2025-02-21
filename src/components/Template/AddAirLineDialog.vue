<template>
  <el-dialog
    title="提示"
    :visible.sync="addAirShow"
    width="30%"
    :before-close="handleClose"
    custom-class="air_line_dialog"
  >
    <div class="add-task-wrap">
      <div class="add-task-head">
        <div class="add-title">
          添加航线
          <el-tooltip
            class="item"
            effect="dark"
            content="左边为任务，右边为对应的航线"
            placement="top-start"
          >
            <span class="el-icon-warning-outline"></span>
          </el-tooltip>
        </div>
        <div style="flex: 1 1 0%"></div>
        <el-input
          placeholder="请输入任务名称"
          v-model="taskName"
          clearable
        ></el-input>
        <i class="el-icon-close" @click="handleClose"></i>
      </div>
      <div class="add-task-list">
        <div class="add-task-left-list">
          <div
            class="left-item"
            :class="{ 'left-item-selected': item.taskId == currentId }"
            v-for="item in filteredTasks"
            :key="item.ticket_id"
            @click="checkedLine(item)"
          >
            <div class="hidden_line" style="flex: 1 1 0%; text-align: start">
              {{ item.taskName }} ({{ item.wrjAirlineFiles.length }})
            </div>
          </div>
        </div>
        <div class="add-task-right-list">
          <div
            class="right-item"
            :class="{ 'right-item-selected': item.airlineId == code }"
            v-for="item in currentList"
            :key="item.airlineId"
            @click="selectAirLine(item)"
          >
            <div class="hidden_line" style="margin-top: 20px">
              {{ item.lineName }}
            </div>
            <i class="el-icon-check" v-if="item.airlineId == code"></i>
          </div>
        </div>
      </div>
      <div class="add-task-footer">
        <el-button class="btn-close" @click="handleClose">取消</el-button>
        <el-button type="primary" class="btn-sure" @click="sureBtn"
          >确定</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { taskListAPI, addSchedulingAPI } from "@/api/TaskManager.js";
export default {
  name: "AddAirLineDialog",
  props: {
    addAirShow: {
      type: Boolean,
      default: false,
    },
    startTime: {
      type: String,
      default: "",
    },
    currentDate: {
      type: String,
      default: "",
    },
  },
  watch: {
    currentId(val) {
      if(val) {
        this.code = this.currentList[0].airlineId
      }
    }
  },
  data() {
    return {
      taskName: "",
      airLineList: [],
      currentId: 0,
      code: "",
      checkedItem: null,
    };
  },
  filters: {
    filterType(val) {
      switch (val) {
        case 0:
          return "拍照";
        case 1:
          return "直播";
        case 2:
          return "全景";
        case 3:
          return "正射";
        case 4:
          return "三维";
        default:
          break;
      }
    },
  },
  computed: {
    currentList() {
      if (this.currentId) {
        const currentArr = this.airLineList.filter(
          (item) => item.taskId == this.currentId
        )[0].wrjAirlineFiles;
        return currentArr;
      } else {
        return [];
      }
    },
    filteredTasks() {
      const lowerCaseQuery = this.taskName.toLowerCase();
      return this.airLineList.filter((task) =>
        task.taskName.toLowerCase().includes(lowerCaseQuery)
      );
    },
  },
  methods: {
    initList() {
      const params = {
        pageNum: "",
        pageSize: "",
      };
      taskListAPI(params).then((res) => {
        if (res.code === 200) {
          this.airLineList = res.rows;
          this.currentId = res.rows[0].taskId;
          this.checkedItem = res.rows[0];
        }
      });
    },
    handleClose() {
      this.$emit("closeLineDialog");
    },
    sureBtn() {
      if (!this.code) {
        this.$message.error("请选择航线");
        return;
      }
      if (!this.checkedItem.taskId) {
        this.$message.error("请选择任务");
        return;
      }
      const params = {
        airlineId: this.code, //航线id
        taskId: this.checkedItem.taskId, //任务id
        orgId: localStorage.getItem("org_id"), //组织id
        startTime: `${this.currentDate} ${this.startTime}`,
      };

      addSchedulingAPI(params).then((res) => {
        if (res.code === 200) {
          this.$emit("updateData", this.currentDate);
          this.handleClose();
        } else {
          this.$message.error(res.msg)
        }
      });
    },
    checkedLine(item) {
      this.currentId = item.taskId;
      this.checkedItem = item;
      this.code = "";
    },
    selectAirLine(item) {
      this.code = item.airlineId;
    },
  },
  mounted() {
    this.initList();
  },
};
</script>

<style lang="scss">
.air_line_dialog {
  min-width: 800px;
  max-width: 1200px;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    .add-task-wrap {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      .add-task-head {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .add-title {
          font-weight: 550;
          font-size: 16px;
          color: #1d1d1f;
          line-height: 22px;
        }
        .el-input {
          width: 367px;
          height: 36px;
          .el-input__inner {
            width: 367px;
            height: 36px;
            border-radius: 18px;
            background-color: rgba(0, 0, 0, 0.04);
            border: 1px solid transparent !important;
          }
        }
        .el-icon-close {
          margin-left: 60px;
          font-size: 20px;
          cursor: pointer;
        }
      }
      .add-task-content {
        display: flex;
        margin-top: 20px;
        height: 36px;
        padding-left: 16px;
        .select-task-title {
          font-weight: 400;
          font-size: 14px;
          color: #1d1d1f;
          line-height: 36px;
        }
        .select-task {
          font-weight: 500;
          font-size: 14px;
          color: #0271e3;
          line-height: 36px;
          margin-left: 12px;
        }
      }
      .add-task-list {
        margin-top: 18px;
        width: 100%;
        flex: 1;
        min-height: 310px;
        display: flex;
        flex-direction: row;
        max-height: 40vh;
        overflow: hidden;
        .add-task-left-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: left;
          justify-content: flex-start;
          overflow: auto;
          .left-item {
            height: 40px;
            font-weight: 400;
            font-size: 14px;
            color: #1d1d1f;
            line-height: 40px;
            width: 100%;
            margin-bottom: 4px;
            padding-left: 16px;
            cursor: pointer;
            .hidden_line {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .hidden_line:hover {
              white-space: normal;
              overflow: visible;
              background-color: #f0f0f0; /* 可选，悬浮时的背景色变化 */
              z-index: 1; /* 确保悬浮时显示在其他内容之上 */
              position: relative; /* 确保z-index有效 */
            }
          }
          .left-item-selected {
            font-weight: 550;
            background: #f5f5f6;
            border-radius: 8px;
          }
        }
        .add-task-right-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: left;
          justify-content: flex-start;
          overflow: auto;
          padding-top: 18px;
          .right-item {
            display: flex;
            height: 40px;
            font-weight: 400;
            font-size: 14px;
            color: #1d1d1f;
            line-height: 40px;
            width: 100%;
            margin-bottom: 4px;
            padding-left: 16px;
            padding-right: 16px;
            cursor: pointer;
            justify-content: space-between;
            align-items: center;
          }
          .right-item-selected {
            font-weight: 400;
            font-size: 14px;
            color: #0271e3;
            line-height: 40px;
          }
        }
      }
      .add-task-footer {
        margin-top: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        .btn-close {
          cursor: pointer;
          width: 92px;
          height: 40px;
          background: #e2e2e4;
          border-radius: 100px;
          font-weight: 500;
          font-size: 14px;
          color: #1d1d1f;
          text-align: center;
          line-height: 22px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          border: 0;
        }
        .btn-sure {
          cursor: pointer;
          margin-left: 12px;
          width: 92px;
          height: 40px;
          background: #0271e3;
          border-radius: 100px;
          font-size: 14px;
          color: #fff;
          text-align: center;
          line-height: 22px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
