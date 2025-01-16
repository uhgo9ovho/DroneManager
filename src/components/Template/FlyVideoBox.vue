<template>
  <div
    class="flyVideoBox right-window-position"
    @click="changeVideo"
    :style="{ width: '100%', height: '100%', background: '#000' }"
  >
    <div class="wrap wrap_window" v-if="showVideo">
      <div :style="{ width: '100%', height: '100%' }">
        <div id="J_prismPlayer2"></div>
      </div>
    </div>
    <div
      v-else
      style="
        width: 100%;
        height: 100%;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      暂无视频流
    </div>
  </div>
</template>

<script>
import MapContainer from "../MapContainer.vue";
import Aliplayer from "aliyun-aliplayer";
import "aliyun-aliplayer/build/skins/default/aliplayer-min.css";
import { mapState } from "vuex";
import { getStreamAPI } from "@/api/droneControl.js";
let player = null;
export default {
  props: {
    droneStreamUrl: {
      type: String,
      default: "",
    },
    mode_code: {
      type: Number,
      default: 0,
    },
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
      showVideo: false,
    };
  },
  watch: {
    mode_code: {
      handler(val) {
        if (val === 0) {
          this.showVideo = false;
          if (player) {
            player.dispose();
          }
        } else {
          this.showVideo = true;
          this.$nextTick(() => {
            this.initPlayer();
          });
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState("droneStatus", ["airPostInfo"]),
  },
  mounted() {
    // this.initPlayer();
  },
  methods: {
    changeVideo() {
      this.$emit("changeVideo", "video2");
    },
    initPlayer() {
      let _this = this;
      getStreamAPI(this.airPostInfo.id).then((result) => {
        if (result.code === 200) {
          player = new Aliplayer(
            {
              id: "J_prismPlayer2",
              width: "100%",
              height: "100%",
              source: result.data.dockStream.droneStream.flv,
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
        }
      });
    },
  },
  components: {
    MapContainer,
  },
};
</script>

<style lang="scss">
.right-window-position {
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
    background-color: #000;
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
