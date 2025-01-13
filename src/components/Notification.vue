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
          <el-tag :type="type(item.status)">{{
            item.status | filterStatus
          }}</el-tag>
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
import { mapActions } from "vuex";
import { getMessageListAPI } from "@/api/user.js";
import { getPermissionListAPI } from '@/api/user';
export default {
  name: "Notification",
  data() {
    return {
      infoList: [],
      timer: null, // 添加timer变量
    };
  },
  computed: {
    type() {
      return function (status) {
        switch (status) {
          case "info":
            return "";
          default:
            return "danger";
        }
      };
    },
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case "info":
          return "信息";
        default:
          return "警告";
      }
    },
  },
  methods: {
    ...mapActions("app", ["GetPermissionsList"]),
    getMessageList() {
      const orgId = localStorage.getItem("org_id");
      getMessageListAPI(orgId).then((res) => {
        if (res.code == 200) {
          this.infoList = res.rows.map((item) => {
            return {
              status: item.level,
              taskName: item.messageType,
              warnSource: item.messageText,
              time: item.logTime,
              id: item.id,
            };
          });
          const ids = this.infoList.map((item) => item.id).join(",");
          this.$emit("updateCount", this.infoList.length, ids);
        }
      });
    },
    getPermissionList() {
      const managerPermission = getPermissionListAPI(3); //管理
      const screenPermission = getPermissionListAPI(2); //大屏
      const programsPermission = getPermissionListAPI(4); //小程序
      Promise.all([
        managerPermission,
        screenPermission,
        programsPermission,
      ]).then((values) => {
        this.GetPermissionsList(values);
      });
    },
  },
  created() {
    this.getMessageList();
    this.getPermissionList()
    this.timer = setInterval(() => {
      this.getMessageList();
    }, 30000); // 每30秒轮询一次
  },
  beforeDestroy() {
    clearInterval(this.timer);
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