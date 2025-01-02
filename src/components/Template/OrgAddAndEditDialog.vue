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
        <el-input v-model="form.orgName" placeholder="请输入组织名称" />
      </el-form-item>
      <el-form-item label="省市区县" prop="ad">
        <el-input v-model="form.ad" placeholder="请输入省市区县" />
      </el-form-item>
      <el-form-item label="负责人" prop="head">
        <el-input v-model="form.head" placeholder="请输入负责人" />
      </el-form-item>
      <el-form-item label="联系电话" prop="headPhone">
        <el-input v-model="form.headPhone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="平台名称" prop="platformName">
        <el-input v-model="form.platformName" placeholder="请输入平台名称" />
      </el-form-item>
      <el-form-item label="绑定码" prop="bindCode">
        <el-input v-model="form.bindCode" placeholder="请输入6位数字的绑定码" />
      </el-form-item>
      <el-form-item label="经度" prop="lng">
        <el-input v-model="form.lng" placeholder="请输入经度" />
      </el-form-item>
      <el-form-item label="纬度" prop="lat">
        <el-input v-model="form.lat" placeholder="请输入纬度" />
      </el-form-item>
      <el-form-item label="平台logo" prop="platformLogo">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过2M
          </div>
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
      rules: {},
      fileList: [],
      imageUrl: "",
      uploadUrl: "/dev-api/common/upload",
      loading: false,
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
    console.log(this.title);
    
    if(this.editRow) {
        this.form = {
            ...this.editRow,
            lng: this.editRow.location ? this.editRow.location.split(',')[0] : '',
            lat: this.editRow.location ? this.editRow.location.split(',')[1] : '',
        };
    }
  },
  methods: {
    handleSubmit() {
      this.loading = true;
      const params = {
        ...this.form,
        location: this.form.lng + "," + this.form.lat,
      };
      if (this.editRow) {
        //编辑保存
        editOrgAPI(params).then(res => {
            if(res.code === 200) {
                this.loading = false;
                this.$message.success("编辑组织成功");
                this.handleCancel();
                this.$emit("updateList");
            } else {
                this.loading = false;
            }
        })
      } else {
        addOrgAPI(params)
          .then((res) => {
            if (res.code === 200) {
              this.loading = false;
              this.$message.success("新增组织成功");
              this.handleCancel();
              this.$emit("updateList");
            } else {
              this.loading = false;
            }
          })
          .catch((err) => {
            this.loading = false;
          });
      }
    },
    handleCancel() {
      this.$emit("updateDialogVisible", false);
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res, file);
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
