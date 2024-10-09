<template>
  <div class="login">
    <div v-if="!showOrg" class="pass-user-box">
      <div v-if="!showQRCode">
        <div class="new-item-badge" @click="showQRCode = !showQRCode">
          <i class="iconfont el-icon-weixin1"></i>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
        >
          <h3 class="title">若依后台管理系统</h3>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              placeholder="账号"
            >
              <svg-icon
                slot="prefix"
                icon-class="user"
                class="el-input__icon input-icon"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon
                slot="prefix"
                icon-class="password"
                class="el-input__icon input-icon"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="code" v-if="captchaEnabled">
            <el-input
              v-model="loginForm.code"
              auto-complete="off"
              placeholder="验证码"
              style="width: 63%"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon
                slot="prefix"
                icon-class="validCode"
                class="el-input__icon input-icon"
              />
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" class="login-code-img" />
            </div>
          </el-form-item>
          <el-checkbox
            v-model="loginForm.rememberMe"
            style="margin: 0px 0px 25px 0px"
            >记住密码</el-checkbox
          >
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width: 100%"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
            <div style="float: right" v-if="register">
              <router-link class="link-type" :to="'/register'"
                >立即注册</router-link
              >
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div class="QRCode-box" v-else>
        <div class="new-item-badge" @click="showQRCode = !showQRCode">
          <i class="el-icon-user-solid"></i>
        </div>
        <div v-if="statusMessage === '二维码已扫描'" class="web_qrcode_wrp">
          <i class="el-icon-success"></i>
          <h1 class="web_qrcode_msg_title">扫描成功</h1>
        </div>
        <div class="web_qrcode_cancel" v-else-if="statusMessage == '取消登录'">
          <i class="el-icon-warning"></i>
          <h1 class="web_qrcode_msg_title">你已取消此次登录</h1>
          <el-button type="success">重试</el-button>
        </div>
        <el-image
          v-else
          :src="QRCodeUrl"
          alt=""
          @click="updateUrl"
          v-loading="loading"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-loading" style="font-size: 40px"></i>
          </div>
        </el-image>
      </div>
    </div>

    <div v-else class="org-box">
      <org-list></org-list>
    </div>
  </div>
</template>

<script>
import { getCodeImg, getQRCodeAPI, getQRCodeStatusAPI } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import SvgIcon from "@/components/SvgIcon/index.vue";
import OrgList from "../components/OrgList.vue";
import QRCode from "qrcodejs2";
export default {
  name: "Login",
  data() {
    return {
      showQRCode: false,
      statusMessage: "",
      timer: null, // 存储轮询定时器的 ID
      pollInterval: 5000, // 轮询时间间隔（毫秒）
      QRCodeUrl: "",
      codeUrl: "",
      showOrg: false,
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }],
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined,
    };
  },
  components: {
    SvgIcon,
    OrgList,
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
    showQRCode: {
      handler(val) {
        if (val) {
          this.getQRCode();
        } else {
          this.stopPolling()
        }
      },
    },
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.captchaEnabled =
          res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.showOrg = true;
            })
            .catch(() => {
              this.loading = false;
              if (this.captchaEnabled) {
                this.getCode();
              }
            });
        }
      });
    },
    getQRCode() {
      let time = new Date().getTime();
      const params = {
        scene: time,
        is_hyline: 1,
        auto_color: "red",
        page: "pages/index",
      };
      getQRCodeAPI(params).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.QRCodeUrl = "data:image/png;base64," + res.msg;
          // 启动轮询请求，检查二维码状态
          this.startPolling(time);
          // getQRCodeStatusAPI(time).then((re) => {
          //   console.log(re);
          // });
        }
      });
    },
    // 开始轮询检查二维码状态
    startPolling(qrCodeId) {
      // 清除上一个定时器（如果存在）
      if (this.timer) clearInterval(this.timer);

      // 设置新的轮询定时器
      this.timer = setInterval(async () => {
        try {
          const statusResponse = await getQRCodeStatusAPI(qrCodeId);
          if (statusResponse.code != 200) {
            //停止轮询
            this.stopPolling();
            return this.$message.error("二维码过期,请刷新");
          }
          const status = statusResponse.data.state;

          // 根据状态更新消息
          switch (status) {
            case "lock":
              this.statusMessage = "二维码已扫描";
              break;
            case "cancel":
              this.statusMessage = "取消登录";
              break;
            default:
              this.statusMessage = "等待扫描...";
          }
        } catch (error) {
          this.stopPolling();
          console.error("检查二维码状态失败:", error);
        }
      }, this.pollInterval);
    },
    // 停止轮询
    stopPolling() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    creatQrCode(url) {
      this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: url, // 需要转换为二维码的内容
        width: 240,
        height: 240,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
    updateUrl() {
      this.QRCodeUrl = "";
      this.getQRCode();
    },
  },
  mounted() {
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
  .pass-user-box {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    .new-item-badge {
      position: absolute;
      background: #02a7f0;
      z-index: 999;
      width: 70px;
      text-align: center;
      height: 40px;
      line-height: 50px;
      border-radius: 3px;
      color: #fff;
      font-size: 12px !important;
      padding: 2px 4px 0;
      top: -10px;
      left: -25px;
      -ms-transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      -webkit-transition: 0 0.1s ease-in;
      -moz-transition: 0 0.1s ease-in;
      -o-transition: 0 0.1s ease-in;
      transition: transform 0.1s ease-in;
      i {
        font-size: 20px;
      }
    }
  }
  .QRCode-box {
    width: 380px;
    border-radius: 12px;
    background-color: #fff;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    .new-item-badge {
      position: absolute;
      background: #02a7f0;
      z-index: 999;
      width: 70px;
      text-align: center;
      height: 40px;
      line-height: 50px;
      border-radius: 3px;
      color: #fff;
      font-size: 12px !important;
      padding: 2px 4px 0;
      top: -10px;
      left: -25px;
      transition: transform 0.1s ease-in;
      i {
        font-size: 20px;
      }
    }
    img {
      width: 240px;
      height: 240px;
    }
  }
  .web_qrcode_wrp {
    text-align: center;
    i {
      font-size: 96px;
      color: #58be6a;
    }
    h1 {
      font-size: 22px;
      font-weight: 500;
      margin-top: 24px;
      letter-spacing: 1px;
    }
    p {
      font-size: 16px;
      margin-top: 8px;
    }
  }
  .web_qrcode_cancel {
    text-align: center;
    i {
      color: red;
      font-size: 96px;
    }
    h1 {
      font-size: 22px;
      font-weight: 500;
      margin-top: 24px;
      letter-spacing: 1px;
    }
    .el-button {
      width: 184px;
      margin-top: 20px;
    }
  }
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: hsla(0, 0%, 100%, 0.7490196078431373);
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
