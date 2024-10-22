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
          <el-form-item label="任务类型" prop="taskType">
            <el-radio-group v-model="ruleForm.taskType" @input="changeType">
              <el-radio-button label="拍照"></el-radio-button>
              <el-radio-button label="直播"></el-radio-button>
              <el-radio-button label="全景"></el-radio-button>
              <el-radio-button label="三维"></el-radio-button>
              <el-radio-button label="正射"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="航线文件" prop="airLine">
            <el-upload
              class="upload-demo"
              action="/dev-api/wayline/importKmz"
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
import { addTask } from "@/api/TaskManager.js";
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
      if(this.settingInfo) {
        callback()
      } else {
        callback(new Error('请设置排期'))
      }
    };
    return {
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
    validatePass(rule, value, callback) {
      if (!this.fileArr.length) {
        if (!this.hasExist) callback(new Error("请选择航线文件"));
        callback(new Error("该文件名称已经存在，请更改名称"));
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
            taskName: this.ruleForm.taskName,
            taskType: this.taskTypeValue,
            taskAddress: "陕西省咸阳市",
            schedulingType: this.inspectionValue,
            timesType: this.frequencyValue,
            airlineNumber: this.airlineNumber, //航线数量
            startTime: this.starttime,
            endTime: this.endtime,
            dateArrays: this.valArr,
            wrjAirlineFiles: this.fileArr,
            note: this.settingInfo,
          };
          if (!params.timesType) delete params["dateArrays"];

          addTask(params)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg);
                this.loading = false;
                this.outBtn();
              } else {
                this.loading = false;
                this.$message.success(res.msg);
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