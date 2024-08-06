<template>
  <div class="notification">
    <!-- info-title -->
    <div class="info-title">消息通知({{ infoList.length }})</div>
    <!-- 有消息 -->
    <div class="info" v-if="infoList.length">
      <div
        class="info-list-item"
        v-for="(item, index) in infoList"
        :key="index"
      >
        <div class="info-top">
          <el-tag :type="type(item.status)">{{ item.status }}</el-tag>
          <span class="task-name">{{ item.taskName }}</span>
        </div>
        <div class="info-middle">{{ item.warnSource }}</div>
        <div class="info-bottom">{{ item.time }}</div>
        <el-divider></el-divider>
      </div>
      <div class="footer-tip">没有更多了</div>
    </div>
    <!-- 无消息 -->
    <div class="no-info" v-else>
      <el-empty description="暂无消息"></el-empty>
    </div>
  </div>
</template>

<script>
export default {
  name: "Notification",
  data() {
    return {
      infoList: [
        {
          status: "在线",
          taskName: "西安-周至(大疆二代)",
          warnSource: "电池温度过高(>44℃)无法开始充电",
          time: "2024-08-06 14:47:45",
        },
        {
          status: "离线",
          taskName: "西安-周至(大疆二代)",
          warnSource: "无法起飞:指南针受到干扰，请远离干扰或校准指南针",
          time: "2024-08-06 14:47:46",
        },
        {
          status: "离线",
          taskName: "西安-周至(大疆二代)",
          warnSource: "无法起飞:指南针受到干扰，请远离干扰或校准指南针",
          time: "2024-08-06 14:47:46",
        },
        {
          status: "离线",
          taskName: "西安-周至(大疆二代)",
          warnSource: "无法起飞:指南针受到干扰，请远离干扰或校准指南针",
          time: "2024-08-06 14:47:46",
        },
        {
          status: "离线",
          taskName: "西安-周至(大疆二代)",
          warnSource: "无法起飞:指南针受到干扰，请远离干扰或校准指南针",
          time: "2024-08-06 14:47:46",
        },
      ],
    };
  },
  computed: {
    type() {
      return function (status) {
        switch (status) {
          case "在线":
            return "";
          default:
            return "danger";
        }
      };
    },
  },
};
</script>

<style lang="scss">
.notification {
  .info-title {
    font-weight: 500;
    font-size: 16px;
    color: #1d1d1f;
    line-height: 24px;
    margin-bottom: 12px;
  }
  .info {
    max-height: 400px;
    overflow: auto;
    .info-top {
      .el-tag {
        margin-right: 10px;
      }
      .task-name {
        font-size: 14px;
        color: #000;
      }
    }
    .info-middle {
      color: red;
      margin: 10px 0;
    }
    .footer-tip {
        text-align: center;
        color: #ababab;
    }
  }
}
</style>