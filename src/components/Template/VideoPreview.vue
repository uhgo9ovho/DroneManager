<template>
  <div class="video-preview">
    <div class="videoPrewBox">
      <video :src="videoUrl" autoplay controls></video>
      <div class="close" @click="closePreview">
        <i class="el-icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    videoUrl: {
      type: String,
      default: "",
    },
  },
  methods: {
    closePreview() {
      this.$emit("closeVideoPreview");
    },
  },
};
</script>

<style lang="scss">
.video-preview {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(29, 29, 31, 0.8);
  backdrop-filter: blur(5px);
  .videoPrewBox {
    width: 100vh;
    height: 75vh;
    max-width: 1200px;
    max-height: 900px;
    border-radius: 12px;
    position: relative;
    background-color: #fff;
    video {
      width: 100%;
      height: 100%;
      object-fit: fill;
      border-radius: 10px;
    }
    .close {
      width: 36px;
      height: 36px;
      background: hsla(0, 0%, 100%, 0.8509803921568627);
      border-radius: 18px;
      position: absolute;
      right: -40px;
      top: -40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 16px;
    }
  }
}
</style>