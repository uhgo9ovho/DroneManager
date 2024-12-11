<template>
  <div class="create-task">
    <div class="task-title">
      <div class="title">新建任务</div>
      <el-button icon="el-icon-switch-button" @click="outBtn">退出</el-button>
    </div>
    <el-divider></el-divider>
    <div class="form-box">
      <div class="form">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item label="任务名称" prop="taskName">
            <el-input
              v-model="ruleForm.taskName"
              placeholder="请输入任务名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="设置航线">
            <div class="date-type-switch">
              <div class="type-switch">
                <div
                  :class="[isImport ? 'date-select' : 'date-unselect']"
                  @click="showImport"
                >
                  导入航线
                </div>
                <div
                  :class="[!isImport ? 'date-select' : 'date-unselect']"
                  @click="showDraw"
                >
                  绘制航线
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="任务类型" prop="taskType">
            <el-radio-group v-model="ruleForm.taskType" @input="changeType">
              <el-radio-button label="拍照"></el-radio-button>
              <el-radio-button label="直播"></el-radio-button>
              <el-radio-button label="全景"></el-radio-button>
              <el-radio-button label="三维"></el-radio-button>
              <el-radio-button label="正射"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="航线文件" prop="airLine" v-if="isImport">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="headers"
              multiple
              :data="uploadData"
              :on-change="fileChange"
              :on-success="successUpload"
              :on-remove="removeFile"
            >
              <el-button size="small" type="primary" icon="el-icon-plus"
                >导入文件</el-button
              >
            </el-upload>
          </el-form-item>
          <el-form-item label="飞行排期" prop="date">
            <el-button class="date-btn" @click="openSettingDate"
              >排期设置</el-button
            >
            <div class="date-box">
              <div class="date">{{ settingInfo }}</div>
              <el-button type="text" @click="openSettingDate">修改</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <el-divider></el-divider>
      <div class="next-box">
        <el-button class="next-btn" :loading="loading" @click="addTaskBtn"
          >完成</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { addAndEditTask } from "@/api/TaskManager.js";
import { mapState } from "vuex";
export default {
  name: "CreateForm",
  props: {
    settingInfo: {
      type: String,
      default: "",
    },
    starttime: {
      type: String,
      default: "",
    },
    endtime: {
      type: String,
      default: "",
    },
    frequencyValue: {
      type: Number,
      default: "",
    },
    inspectionValue: {
      type: Number,
      default: "",
    },
    valArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (this.settingInfo) {
        callback();
      } else {
        callback(new Error("请设置排期"));
      }
    };
    return {
      uploadMsg: "",
      uploadUrl: process.env.VUE_APP_BASE_API + "/wayline/importKmz",
      isImport: true, //是否是导入航线
      hasExist: false,
      loading: false,
      fileArr: [],
      airlineNumber: 0,
      taskTypeValue: 0,
      ruleForm: {
        taskName: "",
        taskType: "",
        airLine: "",
        date: this.settingInfo,
      },
      rules: {
        taskName: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
        ],
        taskType: [
          { required: true, message: "请选择任务类型", trigger: "change" },
        ],
        airLine: [{ validator: this.validatePass, trigger: "change" }],
        date: [{ validator: validatePass2, trigger: "change" }],
      },
    };
  },
  computed: {
    ...mapState("changeStatus", ["airlineList"]),
    headers() {
      return {
        Authorization: "Bearer " + getToken(),
        tenant: "test",
      };
    },
    uploadData() {
      console.log(this.workspaceId, "asdsad");

      return {
        workspaceId: this.$store.getters.workspaceId,
      };
    },
  },
  methods: {
    showImport() {
      this.isImport = true;
      this.$emit("changeDownContentShow", false);
    },
    showDraw() {
      this.isImport = false;
      this.$emit("changeDownContentShow", true);
    },
    validatePass(rule, value, callback) {
      if (!this.isImport) callback(); //不是导入的方式 不校验
      if (!this.fileArr.length) {
        if (!this.hasExist) callback(new Error("请选择航线文件"));
        callback(new Error(this.uploadMsg));
      } else {
        callback();
      }
    },
    removeFile(file) {
      this.fileArr = this.fileArr.filter((item) => item.uid != file.uid);
    },
    successUpload(res, file) {
      if (res.code == 200) {
        let response = { ...res.airline };
        response["uid"] = file.uid;
        this.fileArr.push(response);
        this.hasExist = false;
      } else {
        this.hasExist = true;
        this.uploadMsg = res.msg;
      }
      this.$refs["ruleForm"].validateField(["airLine"]);
    },
    openSettingDate() {
      this.$emit("openSettingDate");
    },
    outBtn() {
      this.$router.push("/flight");
    },
    fileChange(file, files) {
      this.airlineNumber = files.length;
    },
    changeType(type) {
      switch (type) {
        case "拍照":
          this.taskTypeValue = 0;
          break;
        case "直播":
          this.taskTypeValue = 1;
          break;
        case "全景":
          this.taskTypeValue = 2;
          break;
        case "三维":
          this.taskTypeValue = 4;
          break;
        case "正射":
          this.taskTypeValue = 3;
          break;
        default:
          break;
      }
    },
    addTaskBtn() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = {
            lineTaskType: this.isImport ? 2 : 1, //绘制1  导入2
            taskName: this.ruleForm.taskName,
            taskType: this.taskTypeValue,
            taskAddress: "陕西省咸阳市",
            schedulingType: this.inspectionValue,
            timesType: this.frequencyValue,
            airlineNumber: this.isImport ? this.airlineNumber : this.airlineList.length, //航线数量
            startTime: this.starttime,
            endTime: this.endtime,
            dateArrays: this.valArr,
            wrjAirlineFiles: this.fileArr, //导入的时候传这个
            lineFileCache: this.airlineList, //绘制的时候传这个
            note: this.settingInfo,
            orgId: localStorage.getItem("org_id"),
          };
          if (!params.timesType) delete params["dateArrays"];
          if(params.lineTaskType == 1) {
            delete params['wrjAirlineFiles']
          } else {
            delete params['lineFilecache']
          }
          addAndEditTask(params)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg);
                this.loading = false;
                this.outBtn();
              } else {
                this.loading = false;
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.create-task {
  position: absolute;
  top: calc(15vh - 52px);
  right: 24px;
  width: 353px;
  height: 634px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  border-radius: 12px 12px 12px 12px;
  padding: 0 24px;
  z-index: 2;
  .task-title {
    width: 100%;
    height: 65px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 30;
      margin: 0px 60px 30px auto;
      font-weight: 600;
      font-size: 18px;
      color: #000000;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    .el-button {
      width: 70px;
      height: 32px;
      padding: 0;
      line-height: 32px;
      background: #f5f5f6;
      border-radius: 60px 60px 60px 60px;
      border: 0;
      color: #000;
    }
  }
  .el-divider--horizontal {
    margin: 0;
  }
  .form-box {
    margin-top: 20px;
    overflow: auto;
    .date-type-switch {
      .type-switch {
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        flex-direction: row;
        background: #ebebec;
        padding: 0.2777777778vh;
        border-radius: 0.7407407407vh;
        cursor: pointer;
        .date-select {
          width: 150px;
          height: 32px;
          font-weight: 550;
          font-size: 14px;
          color: #1d1d1f;
          letter-spacing: 0;
          text-align: center;
          line-height: 32px;
          background: #fff;
          border-radius: 8px;
        }
        .date-unselect {
          width: 150px;
          height: 32px;
          font-weight: 400;
          font-size: 14px;
          color: #86868c;
          letter-spacing: 0;
          text-align: center;
          line-height: 32px;
          background: #ebebec;
          border-radius: 8px;
          user-select: none;
        }
      }
    }
    .form {
      height: 480px;
      overflow: auto;
    }
    .el-form-item__label {
      color: #000;
    }
    .el-input {
      width: 304px;
      height: 40px;
      background: #f5f5f5;
      border-radius: 10px 10px 10px 10px;
      .el-input__inner {
        width: 304px;
        height: 40px;
        background: #f5f5f5;
        border-radius: 10px 10px 10px 10px;
        border: 0;
      }
    }
    .el-radio-group {
      .el-radio-button {
        width: 60px;
        .el-radio-button__inner {
          padding: 12px 16px;
        }
      }
    }
    .upload-demo {
      position: relative;
      .el-upload {
        .el-button {
          width: 137px;
          height: 40px;
          background: rgba(2, 113, 227, 0.2);
          border-radius: 10px 10px 10px 10px;
          border: 1px solid #0271e3;
          color: #0271e3;
          font-weight: 400;
          font-size: 14px;
        }
      }
    }
    .date-btn {
      width: 137px;
      height: 40px;
      background: rgba(2, 113, 227, 0.2);
      border-radius: 10px 10px 10px 10px;
      border: 1px solid #0271e3;
      font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 30;
      font-weight: 400;
      font-size: 14px;
      color: #0271e3;
      line-height: 17px;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
    .date-box {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
  }
  .next-box {
    margin-top: 20px;
    width: 304px;
    .next-btn {
      width: 100%;
      height: 40px;
      background: #0271e3;
      border-radius: 104px 104px 104px 104px;
      font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 30;
      font-weight: 400;
      font-size: 14px;
      color: #ffffff;
      line-height: 17px;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
  }
}
</style>