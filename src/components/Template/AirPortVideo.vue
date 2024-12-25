<template>
  <div
    class="flyVideoBox left-window-position"
    @click="changeVideo"
    :style="{ width: '100%', height: '100%' }"
  >
    <div class="wrap wrap_window">
      <div :style="{ width: '100%', height: '100%' }">
        <!-- <video id="flv-player" controls autoplay style="width: 100%; height: 100%;"></video> -->
        <div id="J_prismPlayer3"></div>
      </div>
    </div>
  </div>
</template>

<script>
import MapContainer from "../MapContainer.vue";
import Aliplayer from "aliyun-aliplayer";
import FlvJs from "flv.js";
import "aliyun-aliplayer/build/skins/default/aliplayer-min.css";
let player = null;
let flvPlayer = null;
export default {
  props: {
    mainView: {
      type: String,
      default: "map",
    },
  },
  data() {
    return {
      showAirPort: true,
      mapWidth: "130px",
      mapHeight: "80px",
      videoWidth: "130px",
      videoHeight: "80px",
    };
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.initPlayer();
      // this.flvPlayerFn()
    });
  },
  destroyed() {
    player.dispose();
    // if (flvPlayer) {
    //   flvPlayer.destroy();
    // }
  },
  methods: {
    changeVideo() {
      this.$emit("changeVideo", "video1");
      this.showAirPort = !this.showAirPort;
    },
    initPlayer() {
      let _this = this;
      player = new Aliplayer(
        {
          id: "J_prismPlayer3",
          width: "100%",
          height: "100%",
          source:
            "artc://drone.szyfu.com/wrjFlyDock/7CTDL9K00A0153",
          // rtsFallbackSource: "https://drone.szyfu.com/wrjFly/7CTDLCE00A6Y68.flv",
          autoplay: true,
          mute: true,
          isLive: true,
          playsinline: true,
          preload: true,
          license: {
            domain: "jky.szyfu.com", // 申请 License 时填写的域名
            key: "dPzLKTbJSeu1aRyexef24a6e5308f43fc9d495acef1a08f0f", // 申请成功后，在控制台可以看到 License Key
          },
        },
        function (player) {
          console.log("success");
          player.play();
        }
      );
    },
    flvPlayerFn() {
      if (FlvJs.isSupported()) {
        const videoElement = document.getElementById("flv-player");
        flvPlayer = FlvJs.createPlayer({
          type: "flv",
          isLive: true,
          cors: true,
          enableWorker: true,
          lazyLoad: true,
          url: "http://8.136.97.59:8080/wrjFlyDock/7CTDL9K00A0153&videoId=7CTDL9K00A0153-165-0-7.flv", // 替换为你的 FLV 流地址
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
      } else {
        console.error("FLV format is not supported in this browser.");
      }
    },
  },
  components: {
    MapContainer,
  },
};
</script>

<style lang="scss">
.left-window-position {
  // height: 80px;
  // width: 130px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  // position: absolute;
  // bottom: calc(32px + 120px);
  // left: 10px;
  z-index: 99;

  .wrap {
    width: 100%;
    height: 100%;
    pointer-events: all;
    position: absolute;
    display: flex;
    flex-direction: column;
  }
  .wrap_window {
    bottom: 0;
    right: 0;
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
