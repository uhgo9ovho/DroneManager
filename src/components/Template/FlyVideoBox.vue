<template>
  <div
    class="flyVideoBox right-window-position"
    @click="changeVideo"
    :style="{
      width: videoWidth,
      height: videoHeight,
      bottom: bottom,
      left: left,
    }"
  >
    <div class="wrap wrap_window">
      <div
        v-if="mainView === 'map' || mainView === 'video1'"
        :style="{ width: videoWidth, height: videoHeight }"
      >
        <div id="J_prismPlayer2"></div>
      </div>
      <div v-else :style="{ width: mapWidth, height: mapHeight }">
        <map-container></map-container>
      </div>
    </div>
  </div>
</template>

<script>
import MapContainer from "../MapContainer.vue";
import Aliplayer from "aliyun-aliplayer";
import "aliyun-aliplayer/build/skins/default/aliplayer-min.css";
let player = null;
export default {
  props: {
    mainView: {
      type: String,
      default: "map",
    },
    mapWidth: {
      type: String,
      default: "130px",
    },
    mapHeight: {
      type: String,
      default: "80px",
    },
    videoWidth: {
      type: String,
      default: "130px",
    },
    videoHeight: {
      type: String,
      default: "80px",
    },
    bottom: {
      type: String,
      default: "calc(32px + 28px)",
    },
    left: {
      type: String,
      default: "10px",
    },
  },
  data() {
    return {
      showVideo: true,
    };
  },
  watch: {
    mainView: {
      handler(val) {
        if (val === "map" || val === "video1") {
          this.$nextTick(() => {
            this.initPlayer();
            player.on("rtsFallback", function (event) {
              console.log(event, "降级");
            });
            player.on("rtsTraceId", function (event) {
              console.log("EVENT rtsTraceId", event.paramData);
            });
          });
        } else {
          player.dispose();
        }
      },
      immediate: true,
    },
  },
  methods: {
    changeVideo() {
      this.$emit("changeVideo", "video2");
    },
    initPlayer() {
      let _this = this;
      player = new Aliplayer(
        {
          id: "J_prismPlayer2",
          width: "100%",
          height: "100%",
          source: "artc://drone.szyfu.com/wrjFlyDrone/7CTDLCE00A6Y68",
          // rtsFallbackSource: "https://drone.szyfu.com/wrjFly/7CTDLCE00A6Y68.flv",
          autoplay: true,
          mute: true,
          isLive: true,
          playsinline: true,
          preload: true,
        },
        function (player) {
          console.log("success");
          player.play();
        }
      );
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
  // bottom: calc(32px + 28px);
  // left: 10px;
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