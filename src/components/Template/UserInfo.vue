<template>
  <div class="details">
    <div class="photo-user">
      <div class="photo">
        <img src="../../assets/images/avatar.png" alt="" />
      </div>
      <div class="user">
        <div class="username">{{ userInfo.userName }}</div>
        <div class="local">{{ orgName }}</div>
      </div>
    </div>
    <div class="certification">
      <div class="local">{{ orgName }}</div>
    </div>
    <el-divider></el-divider>
    <div class="invite-members" @click="openDialog">
      <div>邀请成员</div>
      <i class="el-icon-arrow-right"></i>
    </div>
    <el-divider></el-divider>
    <div class="loginout" @click="resetDialog">重置密码</div>
    <el-divider></el-divider>
    <div class="loginout" @click="logout">退出登录</div>
    <div v-if="dialogVisible">
      <invite-dialog
        :dialogVisible="dialogVisible"
        @closeDialog="closeDialog"
      ></invite-dialog>
    </div>
    <div v-if="resetVisible">
      <ResetPassDialog
        :resetVisible="resetVisible"
        @outLogin="outLogin"
        @closeResetDialog="closeResetDialog"
      ></ResetPassDialog>
    </div>
  </div>
</template>

<script>
import InviteDialog from "@/components/InviteDialog.vue";
import ResetPassDialog from "./ResetPassDialog.vue";
import { mapMutations } from "vuex";
import { logout } from "@/api/login.js";
import { removeToken } from "@/utils/auth.js";
import Cookies from "js-cookie";
export default {
  name: "Details",
  data() {
    return {
      dialogVisible: false,
      resetVisible: false,
      userInfo: {},
      orgName: "",
    };
  },
  components: {
    InviteDialog,
    ResetPassDialog,
  },
  mounted() {
    this.userInfo = JSON.parse(Cookies.get("user"));
    this.orgName = Cookies.get("orgName");
  },
  methods: {
    ...mapMutations("app", ["SET_FILTER_BULR"]),
    closeResetDialog() {
      this.resetVisible = false;
    },
    resetDialog() {
      this.resetVisible = true;
    },
    openDialog() {
      this.dialogVisible = true;
      this.SET_FILTER_BULR(true);
    },
    closeDialog() {
      this.dialogVisible = false;
      this.SET_FILTER_BULR(false);
    },
    outLogin() {
      logout().then((res) => {
        if (res.code === 200) {
          removeToken("Admin-Token");
          localStorage.removeItem("org_id");
          localStorage.removeItem("workspaceId");
          localStorage.removeItem("vuex");
          localStorage.removeItem("platformName");
          localStorage.removeItem("devicesSN");
          sessionStorage.removeItem("password");
          Cookies.remove("user");
          Cookies.remove("orgName");
          Cookies.remove("orgList");
          this.$router.push("/login");
          this.$message({
            type: "success",
            message: "退出成功!",
          });
        }
      });
    },
    logout() {
      this.SET_FILTER_BULR(true);
      this.$confirm("确认退出当前账号吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          logout().then((res) => {
            if (res.code === 200) {
              removeToken("Admin-Token");
              localStorage.removeItem("org_id");
              localStorage.removeItem("workspaceId");
              localStorage.removeItem("vuex");
              localStorage.removeItem("platformName");
              localStorage.removeItem("devicesSN");
              sessionStorage.removeItem("password");
              Cookies.remove("user");
              Cookies.remove("orgName");
              Cookies.remove("orgList");
              this.$router.push("/login");
              this.$message({
                type: "success",
                message: "退出成功!",
              });
            }
          });

          this.SET_FILTER_BULR(false);
        })
        .catch(() => {
          this.SET_FILTER_BULR(false);
        });
    },
  },
};
</script>

<style lang="scss">
.details {
  width: 100%;
  height: 260px;
  border-radius: 5px;
  .photo-user {
    display: flex;
    justify-content: left;
    align-items: center;
    .photo {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 12px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      i {
        font-size: 60px;
        color: blue;
      }
    }
    .user {
      .username {
        font-size: 16px;
        color: #000;
        font-weight: bold;
      }
      .local {
        font-weight: 400;
        font-size: 13px;
        color: #6e6e73;
      }
    }
  }
  .el-divider {
    margin: 16px 0;
  }
  .certification {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    .local {
      font-weight: 400;
      font-size: 13px;
      color: #6e6e73;
    }
  }
  .invite-members {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #000;
    cursor: pointer;
  }
  .loginout {
    color: #000;
    cursor: pointer;
  }
}
</style>
