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
          <el-form-item label="任务类型" prop="type">
            <el-radio-group v-model="ruleForm.type">
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
              action=""
              :auto-upload="false"
              multiple
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
        <el-button class="next-btn">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateForm",
  props: {
    settingInfo: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      ruleForm: {
        taskName: "",
        type: "上海",
        airLine: "",
        date: "2024-08-12 10:30",
      },
      rules: {
        taskName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        date: [
          {
            type: "date",
            required: true,
            message: "请设置排期时间",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    openSettingDate() {
      this.$emit("openSettingDate");
    },
    outBtn() {
      this.$router.push("/flight");
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