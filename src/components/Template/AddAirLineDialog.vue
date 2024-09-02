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
        <div class="add-title">添加航线</div>
        <div style="flex: 1 1 0%"></div>
        <el-input
          placeholder="请输入任务或航线名称"
          v-model="taskName"
        ></el-input>
        <i class="el-icon-close" @click="handleClose"></i>
      </div>
      <div class="add-task-content">
        <div class="select-task-title">已选航线</div>
        <div class="select-task">【全覆盖】西安-周至-3000mB01</div>
      </div>
      <div class="add-task-list">
        <div class="add-task-left-list">
          <div
            class="left-item"
            :class="{ 'left-item-selected': item.ticket_id == currentId }"
            v-for="item in airLineList"
            :key="item.ticket_id"
            @click="checkedLine(item.ticket_id)"
          >
            <div class="hidden_line" style="flex: 1 1 0%; text-align: start">
              {{ item.ticket_name }} ({{ item.airlines.length }})
            </div>
          </div>
        </div>
        <div class="add-task-right-list">
          <div
            class="right-item"
            :class="{'right-item-selected': item.airline_code == code}"
            v-for="item in currentList"
            :key="item.airline_code"
            @click="selectAirLine(item.airline_code)"
          >
            <div class="hidden_line">{{ item.airline_name }}</div>
            <i class="el-icon-check" v-if="item.airline_code == code"></i>
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
import { mockList6 } from "@/utils/mock.js";
export default {
  name: "AddAirLineDialog",
  props: {
    addAirShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      taskName: "",
      airLineList: [],
      currentId: 0,
      code: ""
    };
  },
  computed: {
    currentList() {
      if (this.currentId) {
        const currentArr = mockList6.filter(
          (item) => item.ticket_id == this.currentId
        )[0].airlines;
        console.log(currentArr);
        return currentArr;
      } else {
        return []
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit("closeLineDialog");
    },
    sureBtn() {
      this.handleClose();
    },
    checkedLine(id) {
      this.currentId = id;
    },
    selectAirLine(code) {
        this.code = code;
    }
  },
  mounted() {
    console.log(mockList6);
    this.airLineList = mockList6;
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