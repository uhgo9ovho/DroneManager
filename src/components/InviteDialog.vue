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
      <div class="tip">邀请有效期至2024-08-06 11:51</div>
      <div class="box-code" ref="qrCodeUrl"></div>
      <div class="refresh" @click="refresh">刷新二维码</div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  name: "InviteDialog",
  data() {
    return {
      qrcode: null,
      qrcodeStatus: true,
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
        this.qrcode.makeCode('https://www.google.com/')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.creatQrCode();
    });
  },
};
</script>

<style lang="scss">
</style>