<template>
  <div class="reset_pass">
    <el-dialog
      title="修改密码"
      :visible.sync="resetVisible"
      :before-close="handleClose"
      append-to-body
      class="reset_dialog"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input
            type="password"
            v-model="ruleForm.oldPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { oldPassAPI, changePassAPI } from "@/api/user.js";
export default {
  name: "ResetPassDialog",
  props: {
    resetVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateOldPass = (rule, value, callback) => {
      if (!value) return callback(new Error("请输入原密码"));
      oldPassAPI(value).then((res) => {
        if (res.isPass) {
          //密码正确
          callback();
        } else {
          callback(new Error("原密码不正确,请重新输入"));
        }
      });
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        oldPass: "",
      },
      rules: {
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
        oldPass: [
          {
            required: true,
            trigger: "blur",
            validator: validateOldPass,
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            oldPass: this.ruleForm.oldPass,
            newPass: this.ruleForm.pass,
            newPassAgain: this.ruleForm.checkPass,
          };
          changePassAPI(params).then((res) => {
            if(res.code === 200) {
                this.$message.success(res.msg + '，请重新登录')
                this.$emit("outLogin");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClose() {
      this.$emit("closeResetDialog");
    },
  },
};
</script>

<style lang="scss">
</style>