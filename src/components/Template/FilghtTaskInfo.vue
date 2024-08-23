<template>
  <div class="task_info">
    <div class="task_back" @click="closeDialog">
      <i class="el-icon-close"></i>
    </div>
    <div class="task-info-wrap">
      <div class="state">已完成</div>
      <div class="title_wrap">
        <div class="tag">任务</div>
        <div class="title">【全景】比亚迪一期</div>
      </div>
      <div class="nest">
        <div class="task-name-type">
          <el-popover placement="bottom-start" trigger="click">
            <span slot="reference"
              >1 条航线 <i class="el-icon-arrow-down"></i>，
              周期循环，每1周四执行,生效日期2024-08-01
            </span>
            <span
              style="
                text-overflow: ellipsis;
                word-break: break-word;
                white-space: nowrap;
                overflow: hidden;
                font-family: PingFangSC-Medium;
                font-weight: 500;
                font-size: 14px;
                color: #1d1d1f;
                line-height: 22px;
                margin-bottom: 4px;
                margin-right: 10px;
              "
              >【全景】比亚迪一期</span
            >
            <el-tag size="mini">待执行</el-tag>
          </el-popover>
        </div>
      </div>
      <div class="item">
        <i class="iconfont el-icon-caijixinxizhanshi"></i>
        <div class="msg">采集信息</div>
        <el-divider></el-divider>
      </div>
      <div class="detail">
        <div class="item" v-for="(item, index) in detailOptions" :key="index">
          <div class="top">{{ item.label }}</div>
          <div class="data">{{ item.value }}</div>
        </div>
      </div>
      <div class="single">
        <div class="top">执行机场</div>
        <div class="data">西安-周至</div>
      </div>
      <div class="item">
        <i class="iconfont el-icon-dikuai"></i>
        <div class="msg">地块信息</div>
        <el-divider></el-divider>
      </div>
      <div class="plot">
        <div class="item" v-for="(item, index) in plotOptions" :key="index">
          <div class="top">{{ item.label }}</div>
          <div class="data">{{ item.value }}</div>
        </div>
      </div>
      <div class="single">
        <div class="top">位置详情</div>
        <div class="data">
          陕西省西安市周至县九峰镇,108省道北151米,集财路东北188米附近
        </div>
      </div>
      <div class="item">
        <i class="el-icon-document"></i>
        <div class="msg">创建信息</div>
        <el-divider></el-divider>
      </div>
      <div class="create">
        <div class="item">
          <div class="top">创建者</div>
          <div class="data">侯锦航</div>
        </div>
        <div class="item_org">
          <div class="top">创建组织</div>
          <div class="data">西安集贤工业园区</div>
        </div>
      </div>
      <div class="single">
        <div class="top">备注</div>
        <div class="data">-</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      plotOptions: [
        {
          label: "地块形状",
          value: "面状地块",
        },
        {
          label: "地块半径",
          value: "-米",
        },
      ],
      detailOptions: [
        {
          label: "预计耗时",
          value: "17分钟",
        },
        {
          label: "预计历程",
          value: "6810米",
        },
        {
          label: "照片数量",
          value: "19张",
        },
      ],
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
  }
};
</script>

<style lang="scss">
.task_info {
  width: 376px;
  position: relative;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  height: 100%;
  background: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 20px 10px;
  border-radius: 0px 12px 12px 0px;
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
    padding: 0px 20px;
    position: relative;
    border-radius: 12px;
    background-color: rgb(255, 255, 255);
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    .state {
      width: 74px;
      height: 28px;
      background: rgb(40, 145, 253);
      border-radius: 0px 12px;
      position: absolute;
      top: 0px;
      right: -1px;
      text-align: center;
      line-height: 28px;
      font-weight: 500;
      font-size: 14px;
      color: rgb(255, 255, 255);
    }
    .title_wrap {
      display: flex;
      margin-top: 46px;
      height: 24px;
      -webkit-box-pack: center;
      justify-content: center;
      .tag {
        width: 36px;
        height: 22px;
        background: rgba(2, 113, 227, 0.1);
        border-radius: 6px;
        font-weight: 400;
        font-size: 13px;
        color: rgb(2, 113, 227);
        text-align: center;
        line-height: 22px;
        margin-right: 4px;
      }
      .title {
        max-width: 296px;
        font-weight: 500;
        font-size: 16px;
        color: rgb(29, 29, 31);
        text-align: center;
        line-height: 24px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .nest {
      margin-top: 6px;
      height: 18px;
      font-weight: 400;
      font-size: 12px;
      color: rgb(110, 110, 115);
      text-align: center;
      line-height: 18px;
    }
    .item {
      height: 24px;
      font-weight: 500;
      font-size: 16px;
      color: rgb(29, 29, 31);
      line-height: 24px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      margin-top: 40px;
      i {
        font-size: 24px;
      }
      .msg {
        width: 125px;
        margin-left: 3px;
      }
    }
    .detail {
      display: flex;
      -webkit-box-pack: justify;
      justify-content: space-between;
      height: 60px;
      .item {
        width: 61px;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        -webkit-box-align: start;
        align-items: flex-start;
        margin-top: 0px;
        .top {
          font-weight: 400;
          font-size: 12px;
          color: rgb(134, 134, 140);
          line-height: 16px;
          margin-top: 16px;
        }
        .data {
          font-weight: 400;
          font-size: 14px;
          color: rgb(29, 29, 31);
          line-height: 20px;
          margin-top: 4px;
        }
      }
    }
    .single {
      .top {
        font-weight: 400;
        font-size: 12px;
        color: rgb(134, 134, 140);
        line-height: 16px;
        margin-top: 16px;
      }
      .data {
        font-weight: 400;
        font-size: 14px;
        color: rgb(29, 29, 31);
        line-height: 20px;
        margin-top: 4px;
      }
    }
    .plot {
      display: flex;
      height: 60px;
      .item {
        width: 60px;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        margin-right: 56px;
        margin-top: 0px;
        -webkit-box-align: start;
        align-items: flex-start;
        .top {
          font-weight: 400;
          font-size: 12px;
          color: rgb(134, 134, 140);
          line-height: 16px;
          margin-top: 16px;
        }
        .data {
          font-weight: 400;
          font-size: 14px;
          color: rgb(29, 29, 31);
          line-height: 20px;
          margin-top: 4px;
        }
      }
    }
    .create {
      display: flex;
      height: 60px;
      .item {
        display: flex;
        width: 40%;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        margin-top: 0px;
        -webkit-box-align: start;
        align-items: flex-start;
        margin-right: 35px;
        .top {
          font-weight: 400;
          font-size: 12px;
          color: rgb(134, 134, 140);
          line-height: 16px;
          margin-top: 16px;
        }
        .data {
          font-weight: 400;
          font-size: 14px;
          color: rgb(29, 29, 31);
          line-height: 20px;
          margin-top: 4px;
        }
      }
      .item_org {
        display: flex;
        width: calc(60% - 35px);
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        margin-top: 0px;
        -webkit-box-align: start;
        align-items: flex-start;
        .top {
          font-weight: 400;
          font-size: 12px;
          color: rgb(134, 134, 140);
          line-height: 16px;
          margin-top: 16px;
        }
        .data {
          font-weight: 400;
          font-size: 14px;
          color: rgb(29, 29, 31);
          line-height: 20px;
          margin-top: 4px;
        }
      }
    }
  }
}
</style>