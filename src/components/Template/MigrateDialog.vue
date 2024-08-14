<template>
  <el-drawer
    title="迁移成员"
    :visible.sync="mirgrateVisible"
    :before-close="handleClose"
    custom-class="mirgrate-dialog"
  >
    <div class="mirgrate-box">
      <div class="title">迁移人员目标部门</div>
      <div class="mirgrate-list"></div>
    </div>
    <div class="btn">
      <el-button class="clear-btn">取消</el-button>
      <el-button class="save-btn">保存</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "MigrateDialog",
  props: {
    mirgrateVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleClose() {
      this.$emit("mirgrateHandle");
    },
  },
};
</script>

<style lang="scss">
.mirgrate-dialog {
  width: 420px;
  .el-drawer__header {
    color: #000;
    font-weight: bold;
  }
  .el-drawer__body {
    padding: 10px 20px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    .mirgrate-box {
        flex: 1;
        background-color: pink;
        overflow: auto;
    }
    .btn {
      display: flex;
      .clear-btn {
        width: 136px;
        height: 40px;
        line-height: 40px;
        border-radius: 50px;
        font-weight: 550;
        font-size: 16px;
        text-align: center;
        padding: 0;
      }
      .save-btn {
        flex: 1;
        margin-left: 16px;
        color: #fff;
        height: 40px;
        line-height: 40px;
        border-radius: 50px;
        font-weight: 550;
        font-size: 16px;
        text-align: center;
        background: #0271e3;
        padding: 0;
        cursor: pointer;
      }
    }
  }
}
</style>