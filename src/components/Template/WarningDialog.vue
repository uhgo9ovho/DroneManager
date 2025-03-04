<template>
  <div class="issue-detail-wrap">
    <div class="issue-detail">
      <div class="task-back" @click="closeWarningDialog">
        <i class="el-icon-close"></i>
      </div>
      <div class="issue-photo-wrap">
        <div class="innerImgBox">
          <img :src="url" alt="" @wheel.prevent="handleWheel" :style="imageStyle"/>
        </div>
        <div class="download" @click="downloadBtn">
          <i class="el-icon-download"></i>
        </div>
        <div class="time-line-wrap">
          <div
            class="time-item"
            v-for="(item, index) in timeOptions"
            :key="index"
            @click="switchImage(item)"
          >
            <div style="width: 14px; height: 100%">
              <div
                class="time-item-circle"
                :class="{ 'time-item-circle-selected': item.checked }"
              ></div>
              <div class="time-item-line"></div>
            </div>
            <div
              style="margin-left: 15px; margin-top: -4px; margin-bottom: 24px"
            >
              <div class="time-item-txt">{{ item.text }}</div>
              <div class="time-item-date">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="issue-info-wrap">
        <div class="issue-content-wrap">
          <div class="issue-name">{{ row.warnName }}</div>
          <div class="issue-date">{{ row.identifyTime }}</div>
          <el-divider></el-divider>
          <div class="issue-attr-wrap">
            <i class="iconfont el-icon-jiankong"></i>
            <div class="issue-attr">位置</div>
          </div>
          <div class="issue-value">
            {{ row.address }}
          </div>
          <div class="issue-attr-wrap">
            <i class="iconfont el-icon-ico"></i>
            <div class="issue-attr">拍摄机场</div>
          </div>
          <div class="issue-value">{{ row.identifyAirPortName }}</div>
          <div class="issue-attr-wrap">
            <i class="iconfont el-icon-feiji"></i>
            <div class="issue-attr">拍摄航线</div>
          </div>
          <div class="issue-value">
            {{ row.airLineName }}
          </div>
        </div>
        <div class="issue-map-wrap">
          <MapContainer
            :longitude="row.longitude"
            :latitude="row.latitude"
            :warningShow="true"
          ></MapContainer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageZoom from "./ImageZoom.vue";
import MapContainer from "../MapContainer.vue";
import { getWarningPhotosAPI } from "@/api/TaskManager.js";
import { downloadPhoto } from "@/utils/ruoyi";
export default {
  name: "WarningDialog",
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      sortPhotoList:[],
      timeOptions: [],
      url: "",
      scale: 1, // 初始缩放比例
    };
  },
  components: {
    ImageZoom,
    MapContainer,
  },
  computed: {
    imageStyle() {
      return {
        transform: `scale(${this.scale})`,
        transition: 'transform 0.2s',
        cursor: this.scale > 1 ? 'zoom-out' : 'zoom-in',
      }
    }
  },
  methods: {
    handleWheel(event) {
      const zoomIntensity = 0.1;
      const delta = event.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;

      // 缩放范围限制：最小1（初始大小），最大3倍
      this.scale = Math.min(Math.max(this.scale * delta, 1), 3);
    },
    downloadBtn() {
      downloadPhoto(this.url, this.url+'.png')
    },
    closeWarningDialog() {
      this.$emit("closeWarningDialog");
    },
    switchImage(item) {
      this.url = item.url;
      this.timeOptions.forEach((it) => {
        it.checked = false;
      });
      item.checked = true;
    },

    formattedDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    getPhotoList() {
      getWarningPhotosAPI(this.row.id).then((res) => {
        if (res.code === 200) {
          const responseData = res.rows;
          this.sortPhotoList = responseData.slice().sort((a, b) => {
            const dateA = new Date(a.photodate);
            const dateB = new Date(b.photodate);
            return dateB - dateA; // 从近到远排序
          });
          // 获取当前日期
          const currentDate = new Date();
          this.timeOptions = this.sortPhotoList.map((item, index) => {
            if (index === 0) {
              this.url =
                "https://htwurenji.oss-cn-beijing.aliyuncs.com/" + item.pic;
            }
            const photoDate = new Date(item.photodate);

            // 计算时间差（以天为单位）
            const timeDiffInMs = currentDate - photoDate;
            const timeDiffInDays = Math.floor(
              timeDiffInMs / (1000 * 60 * 60 * 24)
            );

            //获取具体的时间
            let phototime =this.formattedDate(photoDate);
            // 根据时间差生成描述文本
            let text;
            if (timeDiffInDays < 7) {
              text = `${timeDiffInDays}天前`;
            } else if (timeDiffInDays < 14) {
              text = "一周前";
            } else if (timeDiffInDays < 21) {
              text = "两周前";
            } else if (timeDiffInDays < 30) {
              text = "三周前";
            } else if (timeDiffInDays < 60) {
              text = "一个月前";
            } else if (timeDiffInDays < 365) {
              const months = Math.floor(timeDiffInDays / 30);
              text = `${months}个月前`;
            } else {
              const years = Math.floor(timeDiffInDays / 365);
              text = `${years}年前`;
            }

            return {
              time: phototime,
              url: "https://htwurenji.oss-cn-beijing.aliyuncs.com/" + item.pic,
              text: text,
              // phototime:phototime,
              checked: index === 0, // 第一个对象的checked为true
            };
          });
        }
      });
    },
  },
  mounted() {
    this.getPhotoList();
  },
};
</script>

<style lang="scss">
.issue-detail-wrap {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(29, 29, 31, 0.8);
  backdrop-filter: blur(5px);
  z-index: 2000;
  .issue-detail {
    width: 1280px;
    height: 720px;
    border-radius: 12px;
    display: flex;
    background-color: #fff;
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
    .issue-photo-wrap {
      overflow: hidden;
      width: 904px;
      height: 100%;
      position: relative;
      border-radius: 12px 0 0 12px;
      background-color: #1d1d1f;
      .innerImgBox {
        border-radius: 8px;
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #fff;
        user-select: none;
        img {
          width: 904px;
          height: 720px;
        }
      }
      .download {
        width: 40px;
        height: 40px;
        background: #fff;
        border-radius: 20px;
        position: absolute;
        bottom: 16px;
        right: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        i {
          font-size: 20px;
        }
      }
      .time-line-wrap {
        caret-color: transparent;
        position: absolute;
        left: 0;
        top: 0;
        width: 156px;
        height: 100%;
        padding-top: 32px;
        display: flex;
        flex-direction: column;
        overflow: auto;

        .time-item {
          padding-left: 21px;
          height: 64px;
          display: flex;
          cursor: pointer;
          .time-item-circle {
            cursor: pointer;
            width: 12px;
            height: 12px;
            background: #fff;
            border: 3px solid #fff;
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.34901960784313724);
            border-radius: 50%;
            margin-left: 1px;
          }
          .time-item-line {
            height: 100%;
            width: 1px;
            border-left: 1px dashed #fff;
            margin-left: 6.8px;
          }
          .time-item-txt {
            font-weight: 500;
            font-size: 14px;
            color: #fff;
            line-height: 20px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5019607843137255);
          }
          .time-item-date {
            font-weight: 500;
            font-size: 14px;
            color: #fff;
            line-height: 20px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5019607843137255);
          }
          .time-item-circle-selected {
            width: 14px;
            height: 14px;
            background: #e30000;
            border: 2px solid #fff;
            -webkit-box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.34901960784313724);
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.34901960784313724);
            border-radius: 50%;
            margin-left: 0;
          }
        }
        .time-item:nth-last-child(1) {
          .time-item-line {
            height: 0;
          }
        }
      }
    }
    .issue-info-wrap {
      border-radius: 0 12px 12px 0;
      overflow: hidden;
      width: 376px;
      position: relative;
      display: flex;
      flex-direction: column;
      caret-color: transparent !important;
      .issue-content-wrap {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px;
        .issue-name {
          height: 24px;
          font-weight: 500;
          font-size: 16px;
          color: #1d1d1f;
          text-align: center;
          line-height: 24px;
          margin-top: 32px;
        }
        .issue-date {
          height: 20px;
          font-weight: 400;
          font-size: 14px;
          color: #6e6e73;
          text-align: center;
          line-height: 20px;
          margin-top: 8px;
        }
        .issue-attr-wrap {
          display: flex;
          flex-direction: row;
          align-self: flex-start;
          margin-top: 24px;
          .issue-attr {
            height: 16px;
            font-weight: 500;
            font-size: 14px;
            color: #1d1d1f;
            line-height: 16px;
            align-self: flex-start;
            margin-bottom: 8px;
            margin-left: 8px;
          }
        }
        .issue-value {
          font-weight: 400;
          font-size: 14px;
          color: #6e6e73;
          line-height: 20px;
          align-self: flex-start;
        }
      }
      .issue-map-wrap {
        height: 270px;
        width: 100%;
      }
    }
  }
}
</style>
