<template>
  <div class="navbar">
    <div class="logo">
      <!--        @click="toHome"-->
      <img
        :src="logoImg"
        alt=""
        style="width: 80px; height: 32px; margin-right: 50px"
      />
      {{ platformName }}
    </div>
    <div class="user-info">
      <el-popover
        placement="top-start"
        width="370"
        trigger="click"
        popper-class="popper-notification"
        @after-leave="updateInfoStatus"
      >
        <notification
          ref="notification"
          @updateCount="updateCount"
        ></notification>
        <el-badge
          is-dot
          class="item"
          slot="reference"
          :hidden="count ? false : true"
        >
          <div class="notification iconfont el-icon-icon"></div>
        </el-badge>
      </el-popover>
      <div class="user">
        <el-popover
          placement="top-start"
          width="320"
          trigger="click"
          popper-class="user-popover"
        >
          <user-info></user-info>
          <div class="avatar" slot="reference">
            <img
              src="../../assets/images/avatar.png"
              alt=""
              style="width: 32px; height: 32px; border-radius: 32px"
            />
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import logoImg from "@/assets/images/jky.png";
import UserInfo from "@/components/Template/UserInfo.vue";
import Notification from "@/components/Notification.vue";
import { updateMessageStatusAPI } from "@/api/user";
import { mapActions } from 'vuex'
import Cookies from 'js-cookie'
import WebSocketClient from '@/utils/websocket'
export default {
  name: "NavBar",
  data() {
    return {
      logoUrl: "/icon.ico",
      count: 0,
      ids: "",
      logoImg: localStorage.getItem("platformLogo"),
    };
  },
  components: { UserInfo, Notification },
  computed: {
    platformName() {
      return localStorage.getItem("platformName");
    },
  },
  mounted() {
    this.getWebLogo();
    this.connectWS();
  },
  methods: {
    ...mapActions("droneStatus", ["getAirPostInfo"]),
    connectWS() {
      if (Cookies.get('userId')) {
        let userId = Cookies.get("userId");
        let tenant = 'test';
        new WebSocketClient(
          `wss://jky.szyfu.com:6799/websocket/${localStorage.getItem(
            "workspaceId"
          )}/${userId}/${tenant}?tenant=${tenant}`
        );
      }
    },
    getWebLogo() {
      const webLogo = localStorage.getItem("webLogo");
      const favicon = document.getElementById("favicon");
      console.log(favicon);

      if (favicon) {
        favicon.href = webLogo;
      } else {
        const link = document.createElement("link");
        link.id = "favicon";
        link.rel = "icon";
        link.href = webLogo;
        document.head.appendChild(link);
      }
    },
    updateInfoStatus() {
      updateMessageStatusAPI(this.ids).then((res) => {
        this.$refs.notification.getMessageList();
      });
    },
    updateCount(count, ids) {
      this.count = count;
      this.ids = ids;
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            location.href = "/index";
          });
        })
        .catch(() => {});
    },
    toHome() {
      this.$router.push("/index");
    },
  },
};
</script>

<style lang="scss">
.navbar {
  height: 52px;
  overflow: hidden;
  position: relative;
  background: #1d1d1f;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 50px;

    font-size: 18px;
    color: #fff;
    font-weight: 500;
  }

  .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 15px;

    .el-badge {
      margin-right: 43px;

      .el-icon-icon {
        color: #fff;
        font-size: 24px;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.5);
        }

        cursor: pointer;
      }
    }

    .user {
      cursor: pointer;
    }
  }
}
</style>
