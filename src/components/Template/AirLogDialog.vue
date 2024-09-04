<template>
  <div class="air-log-dialog">
    <div class="outer">
      <div class="task-back">
        <i class="el-icon-close"></i>
      </div>
      <div class="title">
        <span>【拍照】西安航投以东污水巡查01</span>
      </div>
      <div class="nest">
        <span>执行机场：西安-周至</span>
        <span>起飞时间：2024-09-03 10:25:35</span>
      </div>
      <el-divider></el-divider>
      <div class="main">
        <div class="img_list">
          <div class="header">
            <div class="number">拍摄照片 <span>(21)</span></div>
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
              @click="previewBtn"
            >
              <img
                src="http://fsimage.guihuao.com/images/38615a57-7181-4962-bdb1-b640614d6947/4928517202866343937.jpeg?imageMogr2/thumbnail/400x"
                alt=""
              />
              <div class="download">
                <i class="el-icon-download"></i>
              </div>
              <div class="introduce">12:54:40</div>
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
                    21
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
            <div class="record-vedio" v-show="vedioVisible">
              <div class="video-window">
                <video
                  muted="muted"
                  id="recordVideoA"
                  src="https://flysee-business.oss-cn-hangzhou.aliyuncs.com/agora/d50f5faad4422da9f9e1038b1ccf05c6_1581F6Q8D241H00CRJLB_0.mp4"
                  type="video/mp4"
                  controls="controls"
                  controlslist=""
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
            <div class="record-map" v-show="!vedioVisible">
              <MapContainer></MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 照片预览组件 -->
    <div v-if="preview">
      <PhotoPreview @closePreview="closePreview"></PhotoPreview>
    </div>
  </div>
</template>

<script>
import MapContainer from "../MapContainer.vue";
import PhotoPreview from "./PhotoPreview.vue";
export default {
  name: "AirLogDialog",
  data() {
    return {
      imgOptions: [
        1, 3, 4, 5, 6, 7, 8, 9, 0, 2, 11, 21, 22, 23, 24, 25, 256, 2626, 263,
        234, 324, 234, 2344, 2343, 2342, 2341,
      ],
      vedioVisible: true,
      preview: false,
    };
  },
  components: {
    MapContainer,
    PhotoPreview,
  },
  methods: {
    showVideo() {
      this.vedioVisible = true;
    },
    showMap() {
      this.vedioVisible = false;
    },
    previewBtn() {
      this.preview = true;
    },
    closePreview() {
      this.preview = false;
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