<template>
  <div class="neglect">
    <el-dialog
      title="事件办结"
      :visible.sync="handleVisible"
      width="576px"
      :before-close="closeDialog"
    >
      <div class="report-title">事件名称</div>
      <div class="row">
        <el-input v-model="eventName"></el-input>
      </div>
      <div class="report-title">事件描述</div>
      <el-input
        maxlength="200"
        type="textarea"
        placeholder="请输入内容"
        v-model="textarea"
        :autosize="{ minRows: 6 }"
      >
      </el-input>
      <el-upload
        class="upload-demo"
        action="/prod-api/common/upload"
        :headers="headers"
        multiple
        :limit="3"
        :file-list="fileList"
        :on-success="successUpload"
        list-type="picture-card"
      >
        <i slot="default" class="el-icon-plus"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" class="cancel-btn">取 消</el-button>
        <el-button type="primary" @click="sureBtn" class="ok-btn"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { updateWarningStatusAPI } from "@/api/TaskManager.js";
import image from "@/assets/images/AI.png";
export default {
  name: "NeglectDialog",
  props: {
    handleVisible: {
      type: Boolean,
      default: false,
    },
    itemRow: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      eventName: "",
      textarea: "",
      fileList: [],
      url: "",
      src: image,
    };
  },
  computed: {
    headers() {
      return {
        Authorization: "Bearer " + getToken(),
        tenant: "test",
      };
    },
    defaultImg() {
      return this.src;
    },
  },
  mounted() {
    this.eventName = this.itemRow.warnName;
  },
  methods: {
    successUpload(res) {
      this.url = res.url;
    },
    closeDialog() {
      this.$emit("closeHandleDialog");
    },
    sureBtn() {
      const params = {
        warnId: this.itemRow.id,
        status: "3", //办结
        remark: `${this.eventName} ${this.textarea}`,
        photo: this.url,
      };
      updateWarningStatusAPI(params).then((res) => {
        if (res.code === 200) {
          this.$message.success("事件状态更新成功！");
          this.$emit("updateList");
          this.closeDialog();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.neglect {
  .el-dialog {
    .report-title {
      font-weight: 500;
      font-size: 14px;
      color: #1d1d1f;
      line-height: 22px;
      margin-bottom: 8px;
    }
    .row {
      margin-bottom: 10px;
      .el-input__inner {
        border: 1px solid transparent !important;
        background-color: rgba(0, 0, 0, 0.04);
        border-radius: 10px;
      }
    }
    .el-textarea__inner {
      border: 1px solid transparent !important;
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .dialog-footer {
      .cancel-btn {
        width: 92px;
        height: 36px;
        border-radius: 100px;
        justify-content: center;
        font-weight: 500;
        font-size: 14px;
        text-align: center;
        line-height: 22px;
        cursor: pointer;
        padding: 0;
      }
      .ok-btn {
        width: 92px;
        height: 36px;
        border-radius: 100px;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        font-weight: 500;
        font-size: 14px;
        text-align: center;
        line-height: 22px;
        cursor: pointer;
        background: #0271e3;
        padding: 0;
        color: #fff;
      }
    }
  }
}
</style>
