<template>
  <div class="flyVideoBox right-window-position" @click="changeVideo">
    <div class="wrap wrap_window">
      <video
        id="myVideo"
        autoplay
        src="../../assets/a.mp4"
        width="100%"
        height="100%"
      ></video>
    </div>
  </div>
</template>

<script>
export default {
    methods: {
        changeVideo() {
            this.$emit('changeVideo')
        }
    }
};
</script>

<style lang="scss">
.right-window-position {
  height: 80px;
  width: 130px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  position: absolute;
  bottom: calc(32px + 28px);
  left: 10px;
  z-index: 99;
  .wrap {
    pointer-events: all;
    position: absolute;
    display: flex;
    flex-direction: column;
  }
  .wrap_window {
    bottom: 0;
    right: 0;
    z-index: 999;
    border-radius: 6px;
    overflow: hidden;
    video {
      width: 100%;
      height: 100%;
    }
    #myVideo::-webkit-media-controls {
      display: none !important;
    }
  }
}
</style>