<template>
  <div class="invite-dialog-box">
    <el-dialog
      :visible.sync="dialogVisible"
      width="380px"
      :before-close="handleClose"
      append-to-body
      custom-class="invite-dialog"
      center
    >
      <div class="title">扫二维码即可加入你的组织</div>
      <!-- <div class="box-code" ref="qrCodeUrl"></div> -->
      <el-image
        :src="url"
        class="box-code"
        v-loading="loading"
      >
      </el-image>
      <div class="refresh" @click="refresh">刷新二维码</div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { InvitationCodeAPI } from "@/api/user.js";
export default {
  name: "InviteDialog",
  data() {
    return {
      qrcode: null,
      qrcodeStatus: true,
      url: "",
      loading: false,
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog");
    },
    creatQrCode() {
      this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: "https://www.baidu.com/", // 需要转换为二维码的内容
        width: 240,
        height: 240,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
    refresh() {
      this.getCode()
    },
    getCode() {
      this.loading = true;
      const orgid = localStorage.getItem("org_id");
      const page = "pages/scanLogin/scanLogin";
      InvitationCodeAPI(orgid, page)
        .then((res) => {
          if (res.code == 200) {
            this.loading = false;
            this.url = "data:image/png;base64," + res.msg;
            console.log(this.url);
          } else {
            this.loading = false;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getCode();
    });
  },
};
</script>

<style lang="scss">
.el-image {
  width: 100px;
  height: 100px;
}
</style>