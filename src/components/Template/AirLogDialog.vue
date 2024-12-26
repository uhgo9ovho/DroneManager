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
        <span>执行机场：{{ row.airportName }}</span>
        <span>起飞时间：{{ row.executionTime }}</span>
      </div>
      <el-divider></el-divider>
      <div class="main">
        <div class="img_list">
          <div class="header">
            <div
              class="number"
              :class="{ isActive: item.checked }"
              v-for="(item, index) in typeOptions"
              :key="index"
              @click="changeType(item)"
            >
              {{ item.name }} <span>({{ item.num }})</span>
            </div>

            <div class="filter">
              <el-checkbox @change="filterProblemPhoto">问题照片</el-checkbox>
            </div>
          </div>
          <div class="container">
            <div v-show="isShowVideo">
              <!-- 视频列表 -->
              <div
                class="img_item"
                v-for="(item, index) in videoOptions"
                :key="index"
                @click.stop="previewVideoBtn(item)"
              >
                <img :src="VideoPage" alt="" />
                <div class="introduce">{{ item.createTime | formatTime }}</div>
              </div>
            </div>
            <div
              class="img_item"
              v-for="(item, index) in imgOptions"
              :key="index"
              @click="previewBtn(item)"
              v-show="!isShowVideo"
            >
              <img :src="item.url" alt="" />
              <div class="download" @click.stop="downloadImage(item)">
                <i class="el-icon-download"></i>
              </div>
              <div class="introduce">{{ item.createTime | formatTime }}</div>
              <div class="alarm" v-if="item.warnId != null">
                <img :src="alarm" alt="" class="alarm-img" />1
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="record-detail-wrap">
            <div class="info">
              <div class="line" style="margin-bottom: 13px">
                <div>
                  <span>
                    {{ getMinutesDifference() }}
                    <span class="unit">&nbsp;分钟</span></span
                  >
                  <div>飞行时长</div>
                </div>
                <div>
                  <span>
                    {{ row.totalMileage && row.totalMileage.toFixed(1) }}
                    <span class="unit">&nbsp;米</span></span
                  >
                  <div>飞行距离</div>
                </div>
              </div>
              <div class="line">
                <div>
                  <span>
                    {{ typeOptions[0].num }}
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
                      <em
                        style="cursor: pointer; color: #4678ff"
                        @click="downloadBtn"
                      >
                        <i :class="downloadICON"></i>
                        <em>下载</em>
                      </em>
                    </el-tooltip>
                  </div>
                </div>
                <div>
                  <span>
                    <span style="color: red">{{ warnNumber }}</span>
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
                  :src="
                    'https://wurenji02.oss-cn-beijing.aliyuncs.com/' +
                    row.recordVideo
                  "
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
        :resultId="resultId"
      ></PhotoPreview>
    </div>
    <!-- 视频预览组件 -->
    <div v-if="videoPreview">
      <VideoPreview :videoUrl="videoUrl" @closeVideoPreview="closeVideoPreview"></VideoPreview>
    </div>
  </div>
</template>

<script>
import alarm from "@/assets/images/alarm.png";
import VideoPage from "@/assets/images/videoPage.jpg";
import MapContainer from "../MapContainer.vue";
import PhotoPreview from "./PhotoPreview.vue";
import VideoPreview from "./VideoPreview.vue";
import { airLineAPI } from "@/api/TaskManager.js";
import { downloadImagesAsZip } from "@/utils/ruoyi";
import { mapState, mapMutations } from "vuex";
import flvjs from "flv.js";
import { downloadPhoto, downVideo } from "@/utils/ruoyi";
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
      videoPreview: false,
      VideoPage: VideoPage,
      resultId: 0,
      imgOptions: [],
      vedioVisible: true,
      preview: false,
      currentUrl: "",
      airLineData: [],
      isPlay: false,
      player: null,
      timerId: null,
      lon: "",
      lat: "",
      alarm: alarm,
      typeOptions: [
        {
          name: "照片",
          num: 0,
          checked: true,
        },
        {
          name: "视频",
          num: 0,
          checked: false,
        },
      ],
      videoOptions: [],
      isShowVideo: false,
      videoUrl: "",
      warnNumber: 0
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
    VideoPreview,
  },
  computed: {
    ...mapState("changeStatus", ["downloadStatus"]),
    downloadICON() {
      if (this.downloadStatus) {
        //开始下载
        return "el-icon-loading";
      }
      return "el-icon-download";
    },
  },
  mounted() {
    this.getImageUrl();
    this.getAirLine();
    this.$nextTick(() => {
      // this.createVideo();
    });
  },
  beforeDestroy() {
    this.destoryVideo();
  },
  methods: {
    ...mapMutations("changeStatus", ["CHANGE_DOWNLOAD_STATUS"]),
    destoryVideo() {
      if (this.player) {
        this.player.pause(); // 暂停播放数据流
        this.player.unload(); // 取消数据流加载
        this.player.detachMediaElement(); // 将播放实例从节点中取出
        this.player.destroy(); // 销毁播放实例
        this.player = null;
      }
    },
    changeType(item) {
      this.typeOptions.forEach((item) => (item.checked = false));
      item.checked = true;
      if (item.name == "视频") {
        this.isShowVideo = true;
      } else {
        this.isShowVideo = false;
      }
    },
    getMinutesDifference() {
      let that = this;
      // 将时间字符串转换为 Date 对象
      if (!that.row.completeTime) return 0;
      const date1 = new Date(that.row.completeTime);
      const date2 = new Date(that.row.executionTime);

      // 计算时间差（以毫秒为单位）
      const differenceInMilliseconds = date1 - date2;

      // 将毫秒转换为分钟
      const differenceInMinutes =
        Math.abs(differenceInMilliseconds) / (1000 * 60);

      return differenceInMinutes.toFixed(1);
    },
    downloadBtn() {
      if (this.downloadStatus)
        return this.$message.warning("正在下载，请勿重复点击");
      this.$message.success("开始打包下载，请稍等片刻");
      this.CHANGE_DOWNLOAD_STATUS(true);
      const imgUrlArr = this.imgOptions.map((item) => item.url);
      downloadImagesAsZip(imgUrlArr);
    },
    createVideo() {
      if (!this.row.recordVideo) return;
      if (flvjs.isSupported()) {
        var videoElement = document.getElementById("videoElement");
        this.player = flvjs.createPlayer(
          {
            type: "flv",
            isLive: true,
            hasAudio: false,
            url:
              "https://wurenji02.oss-cn-beijing.aliyuncs.com/" +
              this.row.recordVideo, // 自己的flv视频流
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
    filterProblemPhoto(val) {
      if (val) {
        //过滤照片
        const filterArr = this.imgOptions.filter((item) => item.warnId);
        this.imgOptions = filterArr;
      } else {
        this.getImageUrl();
      }
    },
    getImageUrl() {
      const filterImgArr = this.row.resultList.filter(
        (item) => item.subFileType != 2
      );
      const videoFilterArr = this.row.resultList.filter(
        (item) => item.subFileType == 2
      );
      this.typeOptions[0].num = filterImgArr.length;
      this.typeOptions[1].num = videoFilterArr.length;
      this.imgOptions = filterImgArr.map((item) => {
        return {
          url:
            "https://wurenji02.oss-cn-beijing.aliyuncs.com/" + item.objectKey + '?x-oss-process=style/200w',
          originUrl:
            "https://wurenji02.oss-cn-beijing.aliyuncs.com/" + item.objectKey,
          createTime: item.createTime,
          lat: item.lat,
          lon: item.lon,
          resultId: item.resultId,
          warnId: item.warnId,
          name: item.fileName,
        };
      });
      this.warnNumber = this.imgOptions.filter((item) => item.warnId).length;
      this.videoOptions = videoFilterArr.map((item) => {
        return {
          url:
            "https://wurenji02.oss-cn-beijing.aliyuncs.com/" + item.objectKey,
          createTime: item.createTime,
          name: item.fileName,
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
      this.resultId = item.resultId;
      this.currentUrl = item.originUrl;
      this.lon = item.lon;
      this.lat = item.lat;
      this.preview = true;
    },
    previewVideoBtn(item) {
      this.videoPreview = true;
      this.videoUrl = item.url;
    },
    closePreview(row) {
      this.preview = false;
      this.$emit("updatePhotos", row);
    },
    closeAirDialog() {
      this.$emit("closeAirDialog");
    },
    downloadImage(item) {
      downloadPhoto(item.url, item.name);
    },
    closeVideoPreview() {
      this.videoPreview = false;
    }
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
  z-index: 1010;

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
    .nest {
      span {
        margin-right: 20px;
      }
    }
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
      flex: 1;
      overflow: auto;

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
            cursor: pointer;
          }
          .isActive {
            color: #46a6ff;
          }

          .filter {
            display: flex;
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
          margin-top: 12px;
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

            .alarm {
              width: 32px;
              height: 18px;
              background: #fff;
              border-radius: 6px;
              color: red;
              margin-top: 5px;
              padding-top: 2px;
              text-align: center;
              line-height: 15px;
              position: absolute;
              right: 6px;
              bottom: 6px;
              display: flex;
              justify-content: center;
              align-items: center;

              .alarm-img {
                width: 12px;
                height: 12px;
                border-radius: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 2px;
              }
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
        height: 562px;

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
            margin-bottom: 60px;

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
