<template>
  <div
    class="flyVideoBox right-window-position"
    @click="changeVideo"
    :style="{ width: '100%', height: '100%', background: '#000' }"
  >
    <div class="wrap wrap_window" v-if="showVideo">
      <div class="wrap wrap_window">
        <!-- <div :style="{ width: '100%', height: '100%' }"> -->
        <!-- <div id="J_prismPlayer2"></div> -->
        <video
          id="jswebrtc"
          ref="jswebrtc"
          controls
          style="width: 100%; height: 100%; object-fit: fill"
        ></video>
      </div>
      <canvas class="canvas-shuju" id="canvas_aibox"></canvas>
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
import {
  getAITokenAPI,
  getDeviceListAPI,
  getSourceAPI,
  subscribeLiveAPI,
  sysArgsAPI,
} from "@/api/AIModel.js";
import AIBoxMqtt from "@/utils/AIBOX/index.js";
let player = null;
let srsrtc = null;
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
      AIToken: "",
      
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
            // this.initPlayer();
            this.initWebRtcPlayer();
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
    // this.initWebRtcPlayer();
  },
  methods: {
    clearcanvas() {
      AIBoxMqtt.clearCanvas();
    },
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
    async initWebRtcPlayer() {
      if (srsrtc) {
        srsrtc.destroy();
      }
      try {
        const resToken = await getAITokenAPI();

        if (resToken.code === 200) {
          this.AIToken = resToken.data.data;
          const sysArgs = await sysArgsAPI({ token: this.AIToken });
          if (sysArgs.data.error_code == 0) {
            let map = sysArgs.data.data.map;
            ZQLGLOBAL = Object.assign(ZQLGLOBAL, map);
          }
          const deviceParams = {
            type: 3,
            orgId: localStorage.getItem("org_id"),
          };

          const deviceRes = await getDeviceListAPI(deviceParams);
          if (deviceRes.code === 200) {
            const deviceId = deviceRes.data.deviceId;
            const sourceParams = {
              token: this.AIToken,
              deviceId,
            };

            const result = await getSourceAPI(sourceParams);
            if (result.code === 500) return this.$message.warning(result.msg);
            const res = result.data;
            ZQLGLOBAL.serverIp = res.url;

            if (res.error_code != 0) return this.$message.error("设备离线");
            for (const deviceId in res.data) {
              for (const sourceId in res.data[deviceId]) {
                res.data[deviceId][sourceId].sourceId = sourceId;
                res.data[deviceId][sourceId].deviceId = deviceId;
              }
            }
            const orgDeviceId = localStorage.getItem("devicesSN");
            const currentObj = res.data[deviceId][orgDeviceId];

            const subParams = {
              deviceId: currentObj.deviceId,
              streamId: currentObj.sourceId,
              // streamId: 11,
              token: this.AIToken,
            };
            this.sub(subParams);
          }
        }
      } catch (error) {
        console.error("Error initializing WebRTC player:", error);
      }
    },
    async sub(subParams) {
      const subRes = await subscribeLiveAPI(subParams);
      const subResData = subRes.data;
      if (subResData.error_code != 0) {
        // this.sub(subParams); // Retry logic
        this.$message.error(subResData.message.zh);
        return;
      }

      if (subResData.data) {
        this.webRtc = subResData.data;

        let videoDom = document.getElementById("jswebrtc");
        AIBoxMqtt.detectSrs();
        AIBoxMqtt.connectMqtt();
        srsrtc = new JSWebrtc.Player(this.webRtc, {
          video: videoDom,
          autoplay: true,
          onPlay: (obj) => {
            videoDom.addEventListener("canplay", function () {
              videoDom.play().catch((err) => {
                console.error("Error playing video: ", err);
              });
            });
          },
          onPause: (obj) => {},
        });
      }
    },
    // initWebRtcPlayer() {
    //   getAITokenAPI().then((res) => {
    //     if (res.code === 200) {
    //       this.AIToken = res.data.data;
    //       console.log(this.AIToken, "token");

    //       const deveiceParams = {
    //         type: 3,
    //         orgId: localStorage.getItem("org_id"),
    //       };

    //       getDeviceListAPI(deveiceParams).then((deviceRes) => {
    //         if (deviceRes.code === 200) {
    //           const deviceId = deviceRes.data.deviceId;
    //           const sourceParams = {
    //             token: this.AIToken,
    //             deviceId,
    //           };
    //           getSourceAPI(sourceParams).then((result) => {
    //             if (result.code == 500)
    //               return this.$message.warning(result.msg);
    //             const res = result.data;
    //             if (res.error_code != 0) return this.$message.error("设备离线");
    //             const serverIp = res.url;
    //             for (const deviceId in res.data) {
    //               for (const sourceId in res.data[deviceId]) {
    //                 res.data[deviceId][sourceId].sourceId = sourceId;
    //                 res.data[deviceId][sourceId].deviceId = deviceId;
    //               }
    //             }
    //             const currentObj = res.data[deviceId][this.orgDeviceId];
    //             console.log(currentObj, "currentObj");
    //             const subParams = {
    //               deviceId: currentObj.deviceId,
    //               streamId: currentObj.sourceId,
    //               token: this.AIToken,
    //             };
    //             subscribeLiveAPI(subParams).then((res) => {
    //               console.log(res);
    //               const subRes = res.data;
    //               if (subRes.error_code != 0) {
    //                 this.initWebRtcPlayer();
    //                 this.$message.error(subRes.message.zh);
    //               }

    //               if (subRes.data) {
    //                 this.webRtc = subRes.data;
    //                 console.log(this.webRtc, "webrtc");
    //                 let videoDom = document.getElementById("jswebrtc");
    //                 this.srsrtc = new JSWebrtc.Player(this.webRtc, {
    //                   video: videoDom,
    //                   // autoplay: true,
    //                   onPlay: (obj) => {
    //                     videoDom.addEventListener("canplay", function (e) {
    //                       videoDom.play();
    //                     });
    //                   },
    //                   onPause: (obj) => {},
    //                 });
    //               }
    //             });
    //           });
    //         }
    //       });
    //     }
    //   });
    // },
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
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
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
