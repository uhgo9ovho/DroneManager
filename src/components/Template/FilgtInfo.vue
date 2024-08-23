<template>
  <div class="task_info">
    <div class="task_back" @click="closeDialog">
      <i class="el-icon-close"></i>
    </div>
    <div class="task-info-wrap">
      <div class="title">【全景】比亚迪一期</div>
      <div class="nest">
        <div class="task-name-type">
          执行机场：西安-周至
          <div class="battery">
            <div class="iconfont el-icon-dianliang icon"></div>
          </div>
        </div>
      </div>
      <div class="select">
        <span>选择航线 (1) </span>
        <div class="list">
          <div class="li" v-for="(item, index) in options" :key="index">
            <el-radio v-model="item.value" label="1">{{ item.label }}</el-radio>
            <div class="task-status task-executed">{{ item.status }}</div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="infos">
          <div class="info">
            <span>预计耗时</span>
            <div>10.8分钟</div>
          </div>
          <div class="info">
            <span>预计里程</span>
            <div>6810米</div>
          </div>
          <div class="info">
            <span>照片数量</span>
            <div>19张</div>
          </div>
        </div>
        <div class="fly blueBtnColor">
          <el-button icon="iconfont el-icon-ico">起飞</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "比亚迪一期",
          label: "比亚迪一期",
          status: "待执行",
        },
      ],
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>

<style lang="scss">
.task_info {
  width: 440px;
  position: relative;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  height: 100%;
  background: #fff;
  box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.050980392156862744);
  border-radius: 0 12px 12px 0;
  .task_back {
    overflow: hidden;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 18px;
    position: absolute;
    right: -50px;
    top: 0px;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    font-size: 16px;
    cursor: pointer;
    color: #fff;
  }
  .task-info-wrap {
    width: 100%;
    height: 100%;
    padding-left: 23px;
    overflow: hidden;
    position: relative;
    border-radius: 12px;
    background-color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    .title {
      margin-top: 46px;
      margin-right: 20px;
      height: 24px;
      font-weight: 500;
      font-size: 16px;
      color: #1d1d1f;
      text-align: center;
      line-height: 24px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .nest {
      margin-top: 6px;
      margin-right: 20px;
      height: 18px;
      font-weight: 400;
      font-size: 12px;
      color: #6e6e73;
      text-align: center;
      line-height: 18px;
      .task-name-type {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        .battery {
          width: 17px;
          min-height: 10px;
          max-height: 10px;
          border-radius: 2px;
          color: red;
          position: relative;
          display: flex;
          align-items: center;
          margin-left: 8px;
          .icon {
            color: #6c9b76;
          }
        }
      }
    }
    .select {
      margin-top: 32px;
      margin-right: 8px;
      height: 445px;
      .list {
        height: calc(100% - 32px);
        overflow-y: auto;
        margin-top: 8px;
        padding-right: 13px;
        width: 100%;
        .li {
          display: flex;
          align-items: center;
          width: 370px;
          height: 48px;
          border-radius: 12px;
          font-weight: 400;
          font-size: 14px;
          padding: 0 12px;
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          justify-content: space-between;
          .task-status {
            justify-content: center;
            box-sizing: border-box;
            border: 1px solid #e9e9eb;
            caret-color: transparent;
            cursor: pointer;
            width: 52px;
            height: 24px;
            line-height: 28px;
            border-radius: 14px;
            border: 0;
            font-size: 12px;
            text-align: center;
          }
          .task-executed {
            color: #e6a23c;
            background: #fcf6ec;
          }
        }
      }
    }
    .footer {
      border-top: 1px solid rgba(226, 226, 228, 0.5019607843137255);
      height: 150px;
      padding: 24px 4px 16px 4px;
      .infos {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
        .info {
          width: 120px;
          height: 40px;
          display: flex;
          flex-direction: column;
          font-weight: 400;
          font-size: 14px;
          justify-content: space-around;
          align-items: center;
          span {
            font-size: 12px;
            color: #86868c;
          }
        }
      }
      .fly {
        .el-button {
          padding: 0 12px;
          width: 376px;
          height: 44px;
          display: flex;
          background: #0271e3;
          border-radius: 100px;
          font-size: 16px;
          color: #fff;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          padding: 0;
        }
      }
    }
  }
}
</style>