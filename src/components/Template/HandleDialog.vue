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
        type="textarea"
        placeholder="请输入内容"
        v-model="textarea"
        :autosize="{ minRows: 6 }"
      >
      </el-input>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :limit="3"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
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
export default {
  name: "NeglectDialog",
  props: {
    handleVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      eventName: "",
      textarea: "",
      fileList: []
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeHandleDialog");
    },
    sureBtn() {
      this.closeDialog();
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