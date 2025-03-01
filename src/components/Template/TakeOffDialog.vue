<template>
  <div class="take_off_dialog">
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      top="50vh"
      :before-close="handleClose"
    >
      <div class="flyDialogBody">
        <div class="tips">
          <div class="delSvg el-icon-warning"></div>
          <div class="delContent">
            {{ isDel ? "删除排期" : "确定立即起飞？" }}
          </div>
        </div>
        <div v-if="isDel" class="delDialogBodyText">
          <span
            >是否要删除本次排期？删除后不影响其他周期任务，但不可恢复，请谨慎操作！</span
          >
        </div>
        <div class="task-info-wrap" v-else>
          <div class="task-item" v-for="(item, index) in options" :key="index">
            <div class="task-item-title">{{ item.label }}</div>
            <div class="task-item-value">{{ item.value }}</div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="sureBtn" :loading="loading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { takeoffAPI, delSortDataAPI } from "@/api/TaskManager";
export default {
  name: "TakeOffDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    isDel: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      loading: false,
      options: [
        {
          label: "预计耗时",
          value: "8分钟",
        },
        {
          label: "预计里程",
          value: "4322米",
        },
        {
          label: "照片数量",
          value: "19张",
        },
      ],
    };
  },
  methods: {
    handleClose() {
      this.$emit("handleClose");
    },
    sureBtn() {
      this.loading = true;
      if (this.isDel) {
        const params = {
          scheduledId: this.info.scheduledId,
          delFlag: 0,
        };
        delSortDataAPI(params)
          .then((res) => {
            if (res.code === 200) {
              this.$emit('updateData');
              this.$message.success("删除成功");
              this.loading = false;
              this.handleClose();
            }else{
              this.$message.error(res.msg);
              this.loading = false;
              this.handleClose();
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error("删除失败");
            this.handleClose();
          });
      } else {
        const params = {
          airlineId: this.info.airlineId,
          wayLineId: this.info.wayLineId,
          sign: this.info.sign,
          objectKey: this.info.objectKey,
          taskId: this.info.taskId,
          taskName: this.info.taskName,
          workspaceId: localStorage.getItem("workspaceId"),
          taskType: this.info.taskType,
          scheduledId: this.info.scheduledId
        };
        takeoffAPI(params)
          .then((res) => {
            this.loading = false;
            if (res.code == 200) {
              this.$message.success("起飞成功");
              this.handleClose();
              this.$router.push("/videoMap");
            } else {
              this.$message.error(res.msg);
              this.handleClose();
            }
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>

<style lang="scss">
.take_off_dialog {
  .el-dialog {
    border-radius: 12px;
  }
  .flyDialogBody {
    font-size: 14px;
    .tips {
      display: flex;
      align-items: center;
      .delSvg {
        font-size: 24px;
        margin-right: 8px;
        color: #efb041;
      }
      .delContent {
        flex: 1;
        display: flex;
        align-items: center;
        font-weight: 600;
        font-size: 16px;
        color: #1d1d1f;
        height: 20px;
      }
    }
    .task-info-wrap {
      margin-top: 24px;
      padding: 0 15px;
      display: flex;
      flex-direction: row;
      .task-item {
        border-left: 1px solid rgba(226, 226, 228, 0.7);
        padding-left: 17px;
        flex: 1;
        .task-item-title {
          font-weight: 400;
          font-size: 12px;
          color: #86868c;
          text-align: center;
          line-height: 16px;
          height: 16px;
        }
        .task-item-value {
          margin-top: 4px;
          font-weight: 400;
          font-size: 14px;
          color: #1d1d1f;
          text-align: center;
          line-height: 20px;
          height: 20px;
        }
      }
    }
    .delDialogBodyText {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 14px;
      color: #1d1d1f;
      margin-top: 20px;
    }
  }
}
</style>
