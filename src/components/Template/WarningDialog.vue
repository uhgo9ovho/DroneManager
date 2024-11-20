<template>
  <div class="issue-detail-wrap">
    <div class="issue-detail">
      <div class="task-back" @click="closeWarningDialog">
        <i class="el-icon-close"></i>
      </div>
      <div class="issue-photo-wrap">
        <div class="innerImgBox">
          <!-- <ImageZoom :src="row.identifyPhoto" :width="904" :height="720"></ImageZoom> -->
          <img :src="row.identifyPhoto" alt="">
        </div>
        <div class="download">
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
            <MapContainer :longitude="row.longitude" :latitude="row.latitude"></MapContainer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageZoom from "./ImageZoom.vue";
import MapContainer from "../MapContainer.vue";
export default {
  name: "WarningDialog",
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      src: "https://today-obs.line-scdn.net/0hfBxQo9YUOW1FKCot-XdGOn1-NRx2TiNkZxt1XDQrYVo7BH84fkdqDmZ6b0FgSn9vZU8kAzUhNAk9THZpfg/w644",
      timeOptions: [],
    };
  },
  components: {
    ImageZoom,
    MapContainer
  },
  methods: {
    closeWarningDialog() {
      this.$emit("closeWarningDialog");
    },
    getDatesInRange() {
      const currentDate = new Date();
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(currentDate.getDate() - 14);

      let datesArray = [];

      while (twoWeeksAgo <= currentDate) {
        let year = twoWeeksAgo.getFullYear();
        let month = (twoWeeksAgo.getMonth() + 1).toString().padStart(2, "0"); // 月份从0开始，所以要加1
        let day = twoWeeksAgo.getDate().toString().padStart(2, "0");

        let timeString = `${year}/${month}/${day}`;

        // 计算距离今天多少天前
        let daysAgo = Math.round(
          (currentDate - twoWeeksAgo) / (1000 * 60 * 60 * 24)
        );
        let text = daysAgo === 0 ? "今天" : `${daysAgo}天前`;

        // 构建对象并添加到数组
        datesArray.push({
          time: timeString,
          text: text,
          checked: text == "1天前" ? true : false,
        });

        // 日期加一天
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() + 1);
      }

      this.timeOptions = datesArray.reverse();
    },
    switchImage(item) {
      this.timeOptions.forEach((it) => {
        it.checked = false;
      });
      item.checked = true;
    },
  },
  mounted() {
    this.getDatesInRange();
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