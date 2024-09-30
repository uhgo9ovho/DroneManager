<template>
  <div
    class="flyVideoBox right-window-position"
    @click="changeVideo"
    :style="{ width: videoWidth, height: videoHeight }"
  >
    <div class="wrap wrap_window">
      <video
        id="myVideo"
        autoplay
        src="../../assets/a.mp4"
        width="100%"
        height="100%"
        v-if="showVideo"
      ></video>
      <div v-else :style="{ width: mapWidth, height: mapHeight }">
        <map-container></map-container>
      </div>
    </div>
  </div>
</template>

<script>
import MapContainer from "../MapContainer.vue";
export default {
  data() {
    return {
      showVideo: true,
      mapWidth: "130px",
      mapHeight: "80px",
      videoWidth: "130px",
      videoHeight: "80px",
    };
  },
  methods: {
    changeVideo() {
      this.$emit("changeVideo");
      this.showVideo = !this.showVideo;
    },
  },
  components: {
    MapContainer,
  },
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