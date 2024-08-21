<template>
  <el-drawer
    title="个性化"
    :visible.sync="personalizationShow"
    :before-close="handleClose"
    custom-class="personalization-dialog"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-position="top"
    >
      <el-form-item prop="orgName" label="平台名称">
        <el-input v-model="ruleForm.orgName"></el-input>
      </el-form-item>
      <el-form-item prop="webLogo" label="平台LOGO图片">
        <div class="upload">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/common/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="myHeaders"
          >
            <img
              v-if="ruleForm.webLogo"
              :src="ruleForm.webLogo"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">网页logo</div>
          </el-upload>
          <el-upload
            class="avatar-uploader"
            action="/dev-api/common/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload2"
            :headers="myHeaders"
          >
            <img
              v-if="ruleForm.platformLogo"
              :src="ruleForm.platformLogo"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">平台logo</div>
          </el-upload>
        </div>
        <div class="tip">上传图片为正方形：</div>
        <div class="tip">
          网页logo推荐尺寸为16x16像素或32x32像素或64x64像素
          平台logo尺寸最小100*100px，格式png,jpg
        </div>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button class="clear-btn" @click="handleClose">取消</el-button>
      <el-button class="save-btn" @click="handleSave">保存</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { getToken } from "@/utils/auth";
import { imgUrl, editOrgInfo, getDepartmentList } from "@/api/user.js";
export default {
  name: "PersonalizationDialog",
  props: {
    personalizationShow: {
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
      ruleForm: {
        orgName: "",
        logo: "",
        webLogo: "",
        platformLogo: "",
      },
      webUrl: "",
      palteUrl: "",
      rules: {},
      myHeaders: {
        Authorization: "Bearer " + getToken(),
        tenant: "test",
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit("personalizationHandle");
    },
    handleSave() {
      const params = {
        id: this.itemRow.id,
        orgId: this.itemRow.orgId,
        createId: this.itemRow.createId,
        orgDeptName: this.ruleForm.orgName,
        webLogo: this.webUrl,
        platformLogo: this.palteUrl,
        platformName: this.ruleForm.orgName,
      };
      editOrgInfo(params).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.$emit("editGXH");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    beforeAvatarUpload() {},
    handleAvatarSuccess(res) {
      this.webUrl = res.url;
      if (res.code == 200) {
        imgUrl(res.url).then((re) => {
          console.log(re);
          this.ruleForm.webLogo = URL.createObjectURL(re);
          this.$message.success("上传成功");
        });
      }
    },
    handleAvatarSuccess2(res) {
      this.palteUrl = res.url;
      if (res.code == 200) {
        imgUrl(res.url).then((re) => {
          this.$message.success("上传成功");
          this.ruleForm.platformLogo = URL.createObjectURL(re);
        });
      }
    },
    beforeAvatarUpload2() {},
    //获取组织列表
    getorgList() {
      let _this = this;
      const params = {
        pageSize: 10,
        pageNum: 1,
      };
      getDepartmentList(params).then((res) => {
        if (res.code === 200) {
          const rows = res.rows;
          let currentOrg = rows.filter(
            (item) => item.orgId == this.itemRow.orgId
          )[0];
          _this.webUrl = currentOrg.webLogo;
          _this.palteUrl = currentOrg.platformLogo;
          const getWebUrl = imgUrl(currentOrg.webLogo);
          const getPlateFormUrl = imgUrl(currentOrg.platformLogo);
          Promise.all([getWebUrl, getPlateFormUrl]).then((values) => {
            _this.ruleForm.webLogo = URL.createObjectURL(values[0]);
            _this.ruleForm.platformLogo = URL.createObjectURL(values[1]);
          });
        }
      });
    },
  },
  mounted() {
    this.ruleForm.orgName = this.itemRow.orgDeptName;

    this.getorgList();
  },
};
</script>

<style lang="scss">
.personalization-dialog {
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
    .el-form {
      flex: 1;
      .upload {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .avatar-uploader {
          margin-right: 20px;
        }
      }
      .tip {
        margin-top: 20px;
        font-weight: 400;
        font-size: 13px;
        color: #86868c;
        line-height: 22px;
      }
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload__tip {
      font-weight: 400;
      font-size: 14px;
      color: #1d1d1f;
      text-align: center;
      line-height: 18px;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
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