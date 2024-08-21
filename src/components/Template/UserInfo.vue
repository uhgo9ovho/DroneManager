<template>
  <div class="details">
    <div class="photo-user">
      <div class="photo">
        <img src="../../assets/images/w700d1q75cms.jpg" alt="" />
      </div>
      <div class="user">
        <div class="username">刘飞雁</div>
        <div class="local">西安极限工业园区</div>
      </div>
    </div>
    <div class="certification">
      <div class="local">西安极限工业园区</div>
      <el-tag type="info">未认证</el-tag>
    </div>
    <el-divider></el-divider>
    <div class="invite-members" @click="openDialog">
      <div>邀请成员</div>
      <i class="el-icon-arrow-right"></i>
    </div>
    <el-divider></el-divider>
    <div class="loginout" @click="logout">退出登录</div>
    <div v-if="dialogVisible">
      <invite-dialog
        :dialogVisible="dialogVisible"
        @closeDialog="closeDialog"
      ></invite-dialog>
    </div>
  </div>
</template>

<script>
import InviteDialog from "@/components/InviteDialog.vue";
import { mapMutations } from "vuex";
import { logout } from "@/api/login.js";
import { removeToken } from '@/utils/auth.js'
export default {
  name: "Details",
  data() {
    return {
      dialogVisible: false,
    };
  },
  components: {
    InviteDialog,
  },
  methods: {
    ...mapMutations("app", ["SET_FILTER_BULR"]),
    openDialog() {
      this.dialogVisible = true;
      this.SET_FILTER_BULR(true);
    },
    closeDialog() {
      this.dialogVisible = false;
      this.SET_FILTER_BULR(false);
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
              removeToken('Admin-Token');
              this.$router.push('/login')
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
  height: 230px;
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