<template>
  <div class="air-log-dialog">
    <div class="outer">
      <div class="task-back" @click="closeAirDialog">
        <i class="el-icon-close"></i>
      </div>
      <div class="title">
        <span>{{ row.taskName }}</span>
      </div>
      <div class="nest">
        <span>执行机场：西安-周至</span>
        <span>起飞时间：{{ row.completeTime }}</span>
      </div>
      <el-divider></el-divider>
      <div class="main">
        <div class="img_list">
          <div class="header">
            <div class="number">
              拍摄照片 <span>({{ row.resultList.length }})</span>
            </div>
            <div class="filter">
              <el-checkbox>问题照片</el-checkbox>
              <div class="problem">
                <el-switch></el-switch>
              </div>
            </div>
          </div>
          <div class="container">
            <div
              class="img_item"
              v-for="(item, index) in imgOptions"
              :key="index"
              @click="previewBtn(item)"
            >
              <img :src="item.url" alt="" />
              <div class="download">
                <i class="el-icon-download"></i>
              </div>
              <div class="introduce">{{ item.createTime | formatTime }}</div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="record-detail-wrap">
            <div class="info">
              <div class="line" style="margin-bottom: 13px">
                <div>
                  <span> 21.0 <span class="unit">&nbsp;分钟</span></span>
                  <div>飞行时长</div>
                </div>
                <div>
                  <span>
                    9583.38
                    <span class="unit">&nbsp;米</span></span
                  >
                  <div>飞行距离</div>
                </div>
              </div>
              <div class="line">
                <div>
                  <span>
                    {{ row.resultList.length }}
                    <span class="unit">&nbsp;张</span></span
                  >
                  <div class="photo">
                    拍摄照片数
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="下载原图照片"
                      placement="top"
                    >
                      <em style="cursor: pointer; color: #4678ff">
                        <i class="el-icon-download"></i>
                        <em>下载</em>
                      </em>
                    </el-tooltip>
                  </div>
                </div>
                <div>
                  <span>
                    <span style="color: red">1</span>
                    <span class="unit">&nbsp;个</span>
                  </span>
                  <div>问题照片数</div>
                </div>
              </div>
            </div>
            <div class="btn">
              <div
                class="video"
                :class="{ actived: vedioVisible }"
                @click="showVideo"
              >
                视频回放
              </div>
              <div
                class="flyMap"
                :class="{ actived: !vedioVisible }"
                @click="showMap"
              >
                航迹轨迹
              </div>
            </div>
            <div class="record-vedio" v-if="vedioVisible">
              <div class="video-window">
                <video
                  id="videoElement"
                  controls
                  crossOrigin="anonymous"
                  autoplay
                  muted
                  style="
                    height: 100%;
                    width: 100%;
                    object-fit: fill;
                    border-radius: 10px;
                  "
                >
                  <p>你的浏览器不支持video标签.</p>
                </video>
              </div>
            </div>
            <div class="record-map" v-else>
              <MapContainer :airLineData="airLineData"></MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 照片预览组件 -->
    <div v-if="preview">
      <PhotoPreview
        @closePreview="closePreview"
        :currentUrl="currentUrl"
        :lon="lon"
        :lat="lat"
        :row="row"
      ></PhotoPreview>
    </div>
  </div>
</template>

<script>
import MapContainer from "../MapContainer.vue";
import PhotoPreview from "./PhotoPreview.vue";
import { airLineAPI } from "@/api/TaskManager.js";
import flvjs from "flv.js";
export default {
  name: "AirLogDialog",
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      imgOptions: [],
      vedioVisible: true,
      preview: false,
      currentUrl: "",
      airLineData: [],
      isPlay: false,
      player: null,
      timerId: null,
      lon: "",
      lat: ""
    };
  },
  filters: {
    formatTime(time) {
      const dateString = time;

      // 将字符串解析为 Date 对象
      const date = new Date(dateString);

      // 获取小时、分钟、秒
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");

      // 格式化输出
      return `${hours}:${minutes}:${seconds}`;
    },
  },
  components: {
    MapContainer,
    PhotoPreview,
  },
  mounted() {
    this.getImageUrl();
    this.getAirLine();
    this.$nextTick(() => {
      this.createVideo();
    });
  },
  beforeDestroy() {
    this.destoryVideo();
  },
  methods: {
    destoryVideo() {
      if (this.player) {
        this.player.pause(); // 暂停播放数据流
        this.player.unload(); // 取消数据流加载
        this.player.detachMediaElement(); // 将播放实例从节点中取出
        this.player.destroy(); // 销毁播放实例
        this.player = null;
      }
    },
    createVideo() {
      if(!this.row.recordVideo) return;
      if (flvjs.isSupported()) {
        var videoElement = document.getElementById("videoElement");
        this.player = flvjs.createPlayer(
          {
            type: "flv",
            isLive: true,
            hasAudio: false,
            url: 'https://wurenji02.oss-cn-beijing.aliyuncs.com/'+this.row.recordVideo, // 自己的flv视频流
            enableWorker: false, //启用 Web Worker 进程来加速视频的解码和处理过程
            stashInitialSize: 32 * 1024, // 初始缓存大小。单位：字节。建议针对直播：调整为1024kb
            stashInitialTime: 0.2, // 缓存初始时间。单位：秒。建议针对直播：调整为200毫秒
            seekType: "range", // 建议将其设置为“range”模式，以便更快地加载视频数据，提高视频的实时性。
            lazyLoad: false, //关闭懒加载模式，从而提高视频的实时性。建议针对直播：调整为false
            lazyLoadMaxDuration: 0.2, // 懒加载的最大时长。单位：秒。建议针对直播：调整为200毫秒
            deferLoadAfterSourceOpen: false,
          },
          {
            cors: true, // 是否跨域
            // enableWorker: true, // 是否多线程工作
            enableStashBuffer: false, // 是否启用缓存
            // stashInitialSize: 128, // 缓存大小(kb)  默认384kb
            autoCleanupSourceBuffer: true, // 是否自动清理缓存
          }
        );
        this.player.attachMediaElement(videoElement); //挂载元素
        this.player.load(); //加载流
        this.player.play(); //播放流
        // 追帧
        if (this.timerId !== null) {
          clearInterval(this.timerId);
        }
        this.timerId = setInterval(() => {
          if (videoElement.buffered.length > 0) {
            const end = videoElement.buffered.end(0); // 视频结尾时间
            const current = videoElement.currentTime; //  视频当前时间
            const diff = end - current; // 相差时间
            console.log(diff);
            const diffCritical = 4; // 这里设定了超过4秒以上就进行跳转
            const diffSpeedUp = 1; // 这里设置了超过1秒以上则进行视频加速播放
            const maxPlaybackRate = 4; // 自定义设置允许的最大播放速度
            let playbackRate = 1.0; // 播放速度
            if (diff > diffCritical) {
              console.log("相差超过4秒，进行跳转");
              videoElement.currentTime = end - 1.5;
              playbackRate = Math.max(1, Math.min(diffCritical, 16));
            } else if (diff > diffSpeedUp) {
              console.log("相差超过1秒，进行加速");
              playbackRate = Math.max(1, Math.min(diff, maxPlaybackRate, 16));
            }
            videoElement.playbackRate = playbackRate;
            // if (videoElement.paused) {
            //   this.videoForm.player.play();
            // }
          }
        }, 1000);
      }
      // 报错重连
      this.player.on(flvjs.Events.ERROR, (err, errdet) => {
        // 参数 err 是一级异常，errdet 是二级异常
        if (err == flvjs.ErrorTypes.MEDIA_ERROR) {
          console.log("媒体错误");
          if (errdet == flvjs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED) {
            console.log("媒体格式不支持");
          }
        }
        if (err == flvjs.ErrorTypes.NETWORK_ERROR) {
          console.log("网络错误");
          if (errdet == flvjs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
            console.log("http状态码异常");
          }
        }
        if (err == flvjs.ErrorTypes.OTHER_ERROR) {
          console.log("其他异常：", errdet);
        }
        if (this.player) {
          this.destoryVideo();
          this.createVideo();
        }
      });
    },

    timestamp(time) {
      // 定义日期时间字符串
      const dateStr = time;
      // 创建日期对象
      const date = new Date(dateStr);
      // 转换为时间戳（秒数）
      const timestamp = date.getTime();

      return timestamp;
    },
    getAirLine() {
      const params = {
        startTime: `${this.timestamp(this.row.executionTime)}`,
        endTime: `${this.timestamp(this.row.completeTime)}`,
        orgId: localStorage.getItem("org_id"),
      };

      airLineAPI(params).then((res) => {
        if (res.code == 200) {
          this.airLineData = res.data;
        }
      });
    },
    getImageUrl() {
      this.imgOptions = this.row.resultList.map((item) => {
        return {
          url:
            "https://wurenji02.oss-cn-beijing.aliyuncs.com/" + item.objectKey,
          createTime: item.createTime,
          lat: item.lat,
          lon: item.lon
        };
      });
    },
    showVideo() {
      this.vedioVisible = true;
    },
    showMap() {
      this.vedioVisible = false;
    },
    previewBtn(item) {      
      this.currentUrl = item.url;
      this.lon = item.lon;
      this.lat = item.lat;
      this.preview = true;
    },
    closePreview() {
      this.preview = false;
    },
    closeAirDialog() {
      this.$emit("closeAirDialog");
    },
  },
};
</script>

<style lang="scss">
.air-log-dialog {
  width: 100%;
  height: 100%;
  max-height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(29, 29, 31, 0.8);
  backdrop-filter: blur(5px);
  z-index: 9999;
  .outer {
    background-color: #fff;
    width: calc(100% - 160px);
    height: calc(100% - 180px);
    min-height: 720px;
    min-width: 960px;
    max-width: 1600px;
    border-radius: 12px;
    padding: 32px;
    position: relative;
    .task-back {
      overflow: hidden;
      width: 36px;
      height: 36px;
      background: hsla(0, 0%, 100%, 0.10196078431372549);
      border-radius: 18px;
      position: absolute;
      right: -50px;
      top: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      cursor: pointer;
      i {
        color: #fff;
      }
    }
    .title {
      color: #6e6e73;
      font-size: 16px;
      font-weight: 400;
      line-height: 28px;
      height: 40px;
      line-height: 40px;
      width: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      span {
        color: #1d1d1f;
        font-size: 18px;
        font-weight: 500;
        line-height: 28px;
        letter-spacing: 0;
      }
    }
    .main {
      display: flex;
      margin-top: 8px;
      height: calc(100% - 93px);
      .img_list {
        flex: 1;
        width: calc(100% - 400px);
        .header {
          display: flex;
          justify-content: space-between;
          font-weight: 500;
          font-size: 16px;
          color: #1d1d1f;
          line-height: 20px;
          .number {
            display: flex;
            justify-content: space-between;
            font-weight: 500;
            font-size: 16px;
            color: #1d1d1f;
            line-height: 20px;
          }
          .filter {
            display: flex;
            width: 176px;
            justify-content: space-between;
            .problem {
              font-size: 14px;
              color: #6e6e73;
            }
          }
        }
        .container {
          width: 100%;
          height: calc(100% - 51px);
          display: flex;
          flex-wrap: wrap;
          overflow: auto;
          margin-top: 24px;
          align-content: flex-start;
          .img_item {
            width: 128px;
            height: 128px;
            background: #e2e2e4;
            margin-top: 20px;
            margin-right: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            img {
              width: 100%;
              height: 100%;
              border-radius: 8px;
            }
            .download {
              display: none;
            }
            .introduce {
              display: flex;
              justify-content: space-between;
              width: 128px;
              height: 28px;
              opacity: 0.9;
              position: absolute;
              bottom: 0;
              padding: 0 7px;
              line-height: 28px;
              font-weight: 400;
              font-size: 12px;
              color: #fff;
            }
            &:hover {
              border-radius: 8px;
              border: 3px solid #0271e3;
              .download {
                width: 28px;
                height: 28px;
                font-size: 15px;
                background: #0271e3;
                border-radius: 0 0 0 8px;
                position: absolute;
                right: 0;
                top: 0;
                display: flex;
                color: #fff;
                justify-content: center;
                align-items: center;
                cursor: pointer;
              }
              .introduce {
                width: 128px;
                height: 28px;
                opacity: 0.9;
                background: #f5f5f6;
                position: absolute;
                bottom: 0;
                padding: 0 7px;
                line-height: 28px;
                font-weight: 500;
                font-size: 12px;
                color: #fff;
                background-color: #0271e3;
                border-radius: 6px;
              }
            }
          }
        }
      }
      .right {
        width: 400px;
        margin-left: 64px;
        overflow: hidden;
        height: 572px;
        .record-detail-wrap {
          width: 400px;
          height: 100%;
          caret-color: transparent;
          overflow-y: hidden;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          .info {
            height: 148px;
            margin-bottom: 85px;
            .line {
              height: 64px;
              display: flex;
              justify-content: space-between;
              div {
                width: 152px;
                height: 64px;
                span {
                  color: #1d1d1f;
                  font-size: 28px;
                  font-weight: 500;
                  line-height: 36px;
                  display: flex;
                }
                .unit {
                  font-size: 14px;
                  font-weight: 400;
                  margin-left: 5px;
                }
                div {
                  font-weight: 400;
                  font-size: 14px;
                  color: #6e6e73;
                  line-height: 16px;
                }
                .photo {
                  font-weight: 400;
                  font-size: 14px;
                  color: #6e6e73;
                  line-height: 16px;
                }
              }
            }
          }
          .btn {
            display: flex;
            font-size: 16px;
            height: 20px;
            font-weight: 400;
            color: #86868c;
            margin-bottom: 20px;
            .video {
              margin-right: 32px;
              cursor: pointer;
            }
            .flyMap {
              cursor: pointer;
            }
            .actived {
              font-weight: 500;
              color: #1d1d1f;
            }
          }
          .record-vedio {
            width: 100%;
            font-weight: 500;
            font-size: 16px;
            color: #1d1d1f;
            line-height: 20px;
          }
          .video-window {
            width: 100%;
            height: 300px;
            border-radius: 10px;
          }
          .record-map {
            width: 400px;
            height: 300px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            font-weight: 500;
            font-size: 16px;
            color: #1d1d1f;
            line-height: 20px;
            position: absolute;
            right: 32px;
            top: 402px;
            transition: all 0.5s ease;
            #container {
              border-radius: 10px;
            }
          }
        }
      }
    }
  }
}
</style>