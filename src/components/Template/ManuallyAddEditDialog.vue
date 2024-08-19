<template>
  <el-drawer
    :title="title"
    :visible.sync="manuallyVisible"
    :before-close="handleClose"
    custom-class="manually-dialog"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      height="500px"
      ref="ruleForm"
    >
      <el-form-item label="姓名" prop="name">
        <el-input placeholder="请输入名称" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input
          placeholder="请输入联系方式"
          v-model="ruleForm.phone"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          placeholder="请输入密码"
          v-model="ruleForm.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-input
          placeholder="请输入部门"
          v-model="ruleForm.department"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button class="clear-btn" @click="handleClose">取消</el-button>
      <el-button class="save-btn" @click="handleSave">保存</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { addUser, editUserInfo } from "@/api/user.js";
export default {
  name: "ManuallyAddDialog",
  props: {
    manuallyVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    itemRow: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      ruleForm: {
        name: "",
        phone: "",
        department: "",
        password: "",
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        department: [
          { required: true, message: "请输入部门", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit("menuallyClose");
    },
    handleSave() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (this.title == "添加成员") {
            const params = {
              userName: this.ruleForm.name,
              nickName: this.ruleForm.name,
              phonenumber: this.ruleForm.phone,
              password: this.ruleForm.password,
              orgId: +this.$store.getters.orgId,
              roleIds: [2]
            }
            addUser(params).then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg);
                this.$emit('updateList');
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {
    if (this.title == "编辑成员") {
      console.log(this.itemRow);
      this.ruleForm.name = this.itemRow.userName;
      this.ruleForm.phone = this.itemRow.phonenumber;
      this.ruleForm.department = this.itemRow.orgName;
    }
  },
};
</script>

<style lang="scss">
.manually-dialog {
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
  }
  .el-form {
    flex: 1;
  }
  .el-input {
    .el-input__inner {
      border: 1px solid transparent !important;
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 10px;
      height: 36px;
      line-height: 36px;
    }
  }
  .el-textarea {
    .el-textarea__inner {
      border: 1px solid transparent !important;
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 10px;
      height: 120px;
    }
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
</style>