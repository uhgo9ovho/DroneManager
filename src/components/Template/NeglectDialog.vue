<template>
  <div class="neglect">
    <el-dialog
      title="忽略事件"
      :visible.sync="neglectVisible"
      width="576px"
      :before-close="closeDialog"
    >
      <div class="row">
        <el-select v-model="nature">
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="textarea"
        :autosize="{ minRows: 6 }"
      >
      </el-input>
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
import { updateWarningStatusAPI } from "@/api/TaskManager.js";
export default {
  name: "NeglectDialog",
  props: {
    neglectVisible: {
      type: Boolean,
      default: false,
    },
    itemRow: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      nature: "",
      textarea: "",
      options: [
        {
          value: "事件已处置",
          label: "事件已处置",
        },
        {
          value: "重复报件",
          label: "重复报件",
        },
        {
          value: "已报备，无需上报处理",
          label: "已报备，无需上报处理",
        },
        {
          value: "归属地不明，无法处理",
          label: "归属地不明，无法处理",
        },
        {
          value: "无效事件",
          label: "无效事件",
        },
        {
          value: "失时效性事件",
          label: "失时效性事件",
        },
        {
          value: "其他",
          label: "其他",
        },
      ],
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeNeglectDialog");
    },
    sureBtn() {
      const params = {
        warnId: this.itemRow.id,
        status: "5", //忽略
        remark: `${this.nature} ${this.textarea}`
      }
      updateWarningStatusAPI(params).then((res) => {
        if (res.code === 200) {
          this.closeDialog();
          this.$message.success('事件状态更新成功！');
          this.$emit('updateList')
        }
      });
    },
  },
};
</script>

<style lang="scss">
.neglect {
  .el-dialog {
    .row {
      margin-bottom: 10px;
      .el-select {
        .el-input__inner {
          border: 1px solid transparent !important;
          background-color: rgba(0, 0, 0, 0.04);
          border-radius: 10px;
        }
      }
    }
    .el-textarea__inner {
      border: 1px solid transparent !important;
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 10px;
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