<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="org-add-and-edit-dialog"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="组织名称" prop="orgName">
        <el-input v-model.trim="form.orgName" placeholder="请输入组织名称" />
      </el-form-item>
      <el-form-item label="省市区县" prop="ad">
        <el-input
          :disabled="title == '编辑组织'"
          v-model.trim="form.ad"
          placeholder="请输入省市区县"
        />
      </el-form-item>
      <el-form-item label="负责人" prop="head">
        <el-input
          :disabled="title == '编辑组织'"
          v-model.trim="form.head"
          placeholder="请输入负责人"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="headPhone">
        <el-input
          :disabled="title == '编辑组织'"
          v-model.trim="form.headPhone"
          placeholder="请输入联系电话"
        />
      </el-form-item>
      <el-form-item label="平台名称" prop="platformName">
        <el-input
          :disabled="title == '编辑组织'"
          v-model.trim="form.platformName"
          placeholder="请输入平台名称"
        />
      </el-form-item>
      <el-form-item label="绑定码" prop="bindCode">
        <el-input
          :disabled="title == '编辑组织'"
          v-model.trim="form.bindCode"
          placeholder="请输入6位数字的绑定码"
        />
      </el-form-item>
      <el-form-item label="经度" prop="lng">
        <el-input
          @input="handleInputLng"
          :disabled="title == '编辑组织'"
          v-model.trim="form.lng"
          placeholder="请输入经度"
        />
      </el-form-item>
      <el-form-item label="纬度" prop="lat">
        <el-input
          :disabled="title == '编辑组织'"
          v-model.trim="form.lat"
          placeholder="请输入纬度"
          @input="handleInputLat"
        />
      </el-form-item>
      <el-form-item label="平台logo" prop="platformLogo">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :limit="1"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="handleSubmit" :loading="loading"
          >确定</el-button
        >
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { addOrgAPI, editOrgAPI } from "@/api/orgModel";
import { getToken } from "@/utils/auth";
export default {
  name: "OrgAddAndEditDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "新增组织",
    },
    editRow: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        platformLogo: "",
        orgName: "",
        ad: "",
        head: "",
        headPhone: "",
        platformName: "",
        bindCode: "",
        lng: "",
        lat: "",
      },
      rules: {
        orgName: [
          { required: true, message: "请输入组织名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "组织名称长度在3 到 10个字符",
            trigger: "blur",
          },
        ],
        ad: [{ required: true, message: "请输入省市区县", trigger: "blur" }],
        head: [{ required: true, message: "请输入负责人", trigger: "blur" }],
        headPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "联系电话长度在11个字符",
            trigger: "blur",
          },
        ],
        platformName: [
          { required: true, message: "请输入平台名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "平台名称长度在3 到 10个字符",
            trigger: "blur",
          },
        ],
        bindCode: [
          { required: true, message: "请输入绑定码", trigger: "blur" },
          { min: 6, max: 6, message: "绑定码长度在6个字符", trigger: "blur" },
        ],
        lng: [{ required: true, message: "请输入经度", trigger: "blur" }],
        lat: [{ required: true, message: "请输入纬度", trigger: "blur" }],
      },
      fileList: [],
      imageUrl: "",
      uploadUrl: process.env.VUE_APP_BASE_API + "/common/upload",
      loading: false,
      url: "",
    };
  },
  computed: {
    headers() {
      return {
        Authorization: "Bearer " + getToken(),
        tenant: "test",
      };
    },
  },
  mounted() {
    if (this.title == "编辑组织") {
      this.form = {
        ...this.editRow,
        lng: this.editRow.location ? this.editRow.location.split(",")[0] : "",
        lat: this.editRow.location ? this.editRow.location.split(",")[1] : "",
      };
      this.imageUrl =
        "https://htwurenji.oss-cn-beijing.aliyuncs.com" +
        this.form.platformLogo;
    }
  },
  methods: {
    handleInputLng(value) {
      // 只允许数字和小数点
      const validValue = value.replace(/[^0-9.]/g, "");

      // 防止多个小数点
      const dotCount = validValue.split(".").length - 1;
      if (dotCount > 1) {
        this.form.lng = validValue.slice(0, -1); // 删除最后一个小数点
      } else {
        this.form.lng = validValue;
      }
    },
    handleInputLat(value) {
      // 只允许数字和小数点
      const validValue = value.replace(/[^0-9.]/g, "");

      // 防止多个小数点
      const dotCount = validValue.split(".").length - 1;
      if (dotCount > 1) {
        this.form.lat = validValue.slice(0, -1); // 删除最后一个小数点
      } else {
        this.form.lat = validValue;
      }
    },
    handleSubmit() {
      this.loading = true;
      const params = {
        ...this.form,
        location: this.form.lng + "," + this.form.lat,
      };
      if (this.title === "编辑组织") {
        //编辑保存
        this.$refs["formRef"].validate((valid) => {
          if (valid) {
            editOrgAPI(params).then((res) => {
              if (res.code === 200) {
                this.loading = false;
                this.$message.success("编辑组织成功");
                this.handleCancel();
                this.$emit("updateList");
              } else {
                this.loading = false;
                this.$message.error(res.msg);
              }
            });
          } else {
            console.log("error submit!!");
            this.loading = false;
            return false;
          }
        });
      } else {
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            addOrgAPI(params)
              .then((res) => {
                if (res.code === 200) {
                  this.loading = false;
                  this.$message.success("新增组织成功");
                  this.handleCancel();
                  this.$emit("updateList");
                } else {
                  this.loading = false;
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message.error("操作失败");
              });
          } else {
            console.log("error submit!!");
            this.loading = false;
            return false;
          }
        });
      }
    },
    handleCancel() {
      this.$emit("updateDialogVisible", false);
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res, file);
      this.form.platformLogo = res.url;
    },
    beforeAvatarUpload(file) {
      console.log(file);
      const isJPG =
        file.type === "image/jpeg"
          ? true
          : file.type === "image/png"
          ? true
          : false;
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style scoped>
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
<style lang="scss">
.org-add-and-edit-dialog .el-dialog__body {
  max-height: 80vh;
  overflow-y: auto;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
