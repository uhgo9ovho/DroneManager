<template>
  <div class="navbar">
    <div class="logoTitle" @click="toHome">
      <div class="logo" @click="toHome">
        <img :src="logoUrl" alt="" style="width: 32px; height: 32px"/>
      </div>
      <div class="title">城市空天智慧管理平台</div>
    </div>
    <div class="user-info">
      <el-popover placement="top-start" width="370" trigger="click" popper-class="popper-notification">
        <notification></notification>
        <el-badge is-dot class="item" slot="reference">
          <div class="notification iconfont el-icon-icon"></div>
        </el-badge>
      </el-popover>
      <div class="user">
        <el-popover placement="top-start" width="320" trigger="click" popper-class="user-popover">
          <user-info></user-info>
          <div class="avatar" slot="reference">
            <img
              src="../../assets/images/w700d1q75cms.jpg"
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
import logoImg from '@/assets/logo/logo.png'
import UserInfo from '@/components/Template/UserInfo.vue'
import Notification from '@/components/Notification.vue'

export default {
  name: 'NavBar',
  data() {
    return {
      logoUrl: '/icon.ico'
    }
  },
  components: { UserInfo, Notification },
  computed: {},
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = '/index'
          })
        })
        .catch(() => {
        })
    },
    toHome() {
      this.$router.push('/index')
    }
  }
}
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

  .logoTitle {
    display: flex;
    justify-content: center;
    //justify-content: space-between;

    //align-items: center;
    cursor: pointer;
    //height: 52px;

    .logo {
      //width: 128px;
      //width: auto;
      //height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 50px;

    }

    .title {
      //height: 32px;
      //width: auto;
      margin-left: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: #fff;
      font-weight: 500;
    }
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
