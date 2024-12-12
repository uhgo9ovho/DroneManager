<template>
  <div class="index-page">
    <div class="title-box">
      <div class="title-left">
        <div class="index-title">飞行态势总览</div>
        <div class="date">( {{ currentDate }} )</div>
      </div>
      <div class="title-right">
        <el-tabs @tab-click="handleClick" v-model="activeName">
          <el-tab-pane
            v-for="(item, index) in tabOptions"
            :key="index"
            :label="item.label"
            :name="item.value"
          ></el-tab-pane>
        </el-tabs>
        <div class="dateValueDay" v-show="isShow">
          <el-date-picker
            @change="changeDate"
            ref="datepicke"
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :unlink-panels="true"
          >
            <!-- :picker-options="pickerOptions" -->
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="content-box">
      <div class="overview">
        <div
          class="overview-item"
          v-for="(item, index) in overOptions"
          :key="index"
        >
          <el-image
            style="width: 120px; height: 120px"
            :src="item.icon"
            fit="fill"
          ></el-image>
          <div class="item-tips">
            {{ item.tips }}
          </div>
          <div class="item-nums">
            {{ item.total }} <span>{{ item.totalUnit }}</span> /{{
              item.dailyAverage
            }}
            <span>{{ item.dayUnit }}</span>
          </div>
        </div>
      </div>
      <div class="events-box">
        <div
          class="event-item"
          v-for="(item, index) in eventOptions"
          :key="index"
        >
          <div class="item-imgBox">
            <el-image
              style="width: 36px; height: 36px"
              :src="item.icon"
              fit="fill"
            ></el-image>
          </div>
          <div class="item-info">
            <div class="number">
              {{ item.number }}<span>{{ item.unit }}</span>
            </div>
            <div class="tips">{{ item.tips }}</div>
          </div>
        </div>
      </div>
      <div class="footer-box">
        <div
          class="footer-item"
          v-for="(item, index) in footerOptions"
          :key="index"
        >
          <div class="item-imgBox">
            <el-image
              style="width: 72px; height: 72px"
              :src="item.icon"
              fit="fill"
            ></el-image>
          </div>
          <div class="item-info">
            <div class="tips">{{ item.tips }}</div>
            <div class="number">
              {{ item.number }}<span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jiaci from "@/assets/icons/jiaci.png";
import jiaci1 from "@/assets/icons/jiaci1.png";
import tpsp from "@/assets/icons/tpsp.png";
import qj from "@/assets/icons/qj.png";
import yjsj from "@/assets/icons/预警事件.png";
import jbsj from "@/assets/icons/交办事件.png";
import tjrws from "@/assets/icons/提交任务数.png";
import rwjc from "@/assets/icons/任务架次.png";
import jstx from "@/assets/icons/减少通行.png";
import jsrc from "@/assets/icons/减少人次.png";
import jycb from "@/assets/icons/节约成本.png";
import jspt from "@/assets/icons/减少碳排.png";

import { getstatisticsDataAPI } from "@/api/index.js";

export default {
  data() {
    return {

      activeName: "week",
      tabOptions: [
        {
          value: "week",
          label: "一周",
        },
        {
          value: "month",
          label: "一月",
        },
        {
          value: "threeMonths",
          label: "三月",
        },
        {
          value: "year",
          label: "一年",
        },
        {
          value: "other",
          label: "其他",
        },
      ],
      date: "",
      timeRange: {
        startTime: 0,
        endTime: 0,
      },
      isShow: false,
      currentDate: "",
      overOptions: [
        {
          icon: jiaci,
          tips: "总架次 / 日均架次",
          total: "",
          dailyAverage: "",
          totalUnit: "次",
          dayUnit: "次",
        },
        {
          icon: jiaci1,
          tips: "飞行里程 / 日均时常",
          total: "",
          dailyAverage: "",
          totalUnit: "公里",
          dayUnit: "小时",
        },
        {
          icon: tpsp,
          tips: "图片 / 视频",
          total: "",
          dailyAverage: "",
          totalUnit: "张",
          dayUnit: "个",
        },
        {
          icon: qj,
          tips: "全景 / 三维",
          total: "",
          dailyAverage: "",
          totalUnit: "张",
          dayUnit: "个",
        },
      ],
      eventOptions: [
        {
          icon: yjsj,
          number: '',
          unit: "件",
          tips: "预警事件",
        },
        {
          icon: jbsj,
          number: '',
          unit: "件",
          tips: "交办事件",
        },
        {
          icon: tjrws,
          number: '',
          unit: "件",
          tips: "提交任务数",
        },
        {
          icon: rwjc,
          number: '',
          unit: "次",
          tips: "任务架次",
        },
      ],
      footerOptions: [
        {
          icon: jstx,
          number: '',
          unit: "公里",
          tips: "减少通行",
        },
        {
          icon: jsrc,
          number: '',
          unit: "人次",
          tips: "减少人次",
        },
        {
          icon: jycb,
          number: '',
          unit: "万元",
          tips: "节约成本",
        },
        {
          icon: jspt,
          number: " ",
          unit: "吨",
          tips: "减少碳排",
        },
      ],
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() > Date.now();
      //   },
      // },
    };
  },
  computed: {},
  mounted() {
    this.getDateRange("week");
    this.timeRange = this.getTimeRangeTimestamps("week");
    console.log(this.timeRange);
    this.getstatisticsData();
  },
  methods: {
    convertToTimestamp(dateString) {
      // 创建日期对象
      const date = new Date(dateString);

      // 检查日期对象是否有效
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
      }

      // 转换为时间戳（毫秒数）
      const timestamp = date.getTime();

      // 返回时间戳
      return timestamp;
    },
    updateOverOptionsInPlace(options, data) {
      options.forEach((option) => {
        switch (option.tips) {
          case "总架次 / 日均架次":
            option.total = data.total;
            option.dailyAverage = data.dailyAverage;
            break;
          case "飞行里程 / 日均时常":
            option.total = data.flyDistance;
            option.dailyAverage = data.avgFlyTime;
            break;
          case "图片 / 视频":
            option.total = data.totalPhotoNum;
            option.dailyAverage = data.totalVideoNum;
            break;
          case "全景 / 三维":
            option.total = data.totalPanoramaNum;
            option.dailyAverage = data.total3dNum;
            break;
          default:
            break;
        }
      });
    },

    updateEventOptions(options, data) {
      options.forEach((option) => {
        switch (option.tips) {
          case "预警事件":
            option.number = data.totalWarningNum;
            break;
          case "交办事件":
            option.number = data.totalAssignNum;
            break;
          case "提交任务数":
            option.number = data.totalSubmitNum;
            break;
          case "任务架次":
            option.number = data.totalTaskNum;
            break;
          default:
            break;
        }
      });
    },

    updateFooterOptions(options, data) {
      options.forEach((option) => {
        switch (option.tips) {
          case "减少通行":
            option.number = data.reducePass;
            break;
          case "减少人次":
            option.number = data.reduceManual;
            break;
          case "节约成本":
            option.number = data.saveCost;
            break;
          case "减少碳排":
            option.number = data.reduceCarbon;
            break;
          default:
            break;
        }
      });
    },
    getTimeRangeTimestamps(period) {
      const nowMillis = Date.now(); // 当前时间的毫秒级时间戳
      let startDateMillis = nowMillis; // 初始化为当前时间的毫秒级时间戳

      // 根据 period 设置起始日期
      const validPeriods = ["week", "month", "threeMonths", "year"];
      if (!validPeriods.includes(period)) {
        throw new Error(`Invalid period. Use "${validPeriods.join('", "')}".`);
      }

      const tempDate = new Date(nowMillis); // 创建一个基于当前毫秒级时间戳的Date对象
      switch (period) {
        case "week":
          tempDate.setDate(tempDate.getDate() - 7);
          break;
        case "month":
          tempDate.setMonth(tempDate.getMonth() - 1);
          break;
        case "threeMonths":
          tempDate.setMonth(tempDate.getMonth() - 3);
          break;
        case "year":
          tempDate.setFullYear(tempDate.getFullYear() - 1);
          break;
      }

      startDateMillis = tempDate.getTime(); // 获取修改后的起始日期的毫秒级时间戳

      // 返回包含起始和结束时间戳（毫秒级）的对象
      return {
        startTime: startDateMillis,
        endTime: nowMillis,
      };
    },

    getstatisticsData() {
      const params = {
        startTime: `${this.timeRange.startTime}`,
        endTime: `${this.timeRange.endTime}`,
        orgId: localStorage.getItem("org_id"),
      };

      getstatisticsDataAPI(params).then((res) => {
        if (res.code == 200) {
          this.updateOverOptionsInPlace(this.overOptions, res.data);
          this.updateEventOptions(this.eventOptions, res.data);
          this.updateFooterOptions(this.footerOptions, res.data);
        }
      });
    },

    handleClick(tab, e) {
      const period = tab.name;
      if (period == "other") {
        this.isShow = true;
        this.$refs.datepicke.focus();
      } else {
        this.getDateRange(period);
        this.timeRange = this.getTimeRangeTimestamps(period);
        this.getstatisticsData();
        this.isShow = false;
      }
    },
    changeDate(e) {
      console.log(e[0]);
      const formatDateArr = e.map((item) => this.formatDateToYMD(item));
      // console.log('e',e);
      this.timeRange.startTime = this.convertToTimestamp(e[0]);
      this.timeRange.endTime = this.convertToTimestamp(e[1]);
      this.getstatisticsData();
      console.log(formatDateArr);
      this.currentDate = formatDateArr.join("-");
    },
    formatDateToYMD(dateString) {
      const date = new Date(dateString); // 将日期字符串解析为 Date 对象
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，需要加 1
      const day = String(date.getDate()).padStart(2, "0"); // 日期，确保是两位数

      return `${year}.${month}.${day}`; // 拼接成 yyyy.mm.dd 格式
    },

    // 示例调用
    getDateRange(period) {
      const today = new Date(); // 当前日期
      const startDate = new Date(); // 起始日期

      // 根据 period 设置起始日期
      switch (period) {
        case "week": // 一周
          startDate.setDate(today.getDate() - 7);
          break;
        case "month": // 一个月
          startDate.setMonth(today.getMonth() - 1);
          break;
        case "threeMonths": // 三个月
          startDate.setMonth(today.getMonth() - 3);
          break;
        case "year": // 一年
          startDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          throw new Error(
            'Invalid period. Use "week", "month", "threeMonths", or "year".'
          );
      }

      // 格式化日期为 "YYYY.MM.DD"
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
      };

      // 返回时间范围
      this.currentDate = `${formatDate(startDate)}-${formatDate(today)}`;
    },
  },
};
</script>

<style lang="scss">
.index-page {
  width: 100%;
  height: calc(100vh - 52px);
  padding: 0px 55px 0px 38px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0 10px 0;

    .title-left {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .index-title {
        height: 50px;
        font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 30;
        font-weight: 700;
        font-size: 36px;
        color: #1d1d1f;
        line-height: 50px;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }

      .date {
        height: 22px;
        font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 30;
        font-weight: 400;
        font-size: 16px;
        color: #9e9e9e;
        line-height: 22px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin-left: 20px;
        margin-bottom: 5px;
      }
    }

    .title-right {
      position: relative;

      .is-top {
        .el-tabs__nav-wrap::after {
          height: 0;
        }
      }

      .el-tabs__nav-wrap
        .el-tabs__nav-scroll
        .el-tabs__nav
        .el-tabs__active-bar {
        height: 32px;
        width: 72px;
        transform: translateX(72px);
        background: #0271e3;
        border-radius: 16px;
        z-index: 0;
      }

      .is-active {
        color: #fff !important;
      }

      .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item {
        width: 72px;
        line-height: 32px;
        height: 32px;
        font-weight: 600;
        font-size: 14px;
        color: #6e6e73;
        -webkit-transition: color 0.5s;
        transition: color 0.5s;
        letter-spacing: 0;
        text-align: center;
        padding: 0;
      }

      .dateValueDay {
        position: absolute;
        top: 0;
        right: 0;
        width: 72px;
        opacity: 0;
        overflow: hidden;
        z-index: 100;
      }
    }
  }

  .content-box {
    overflow: auto;
  }

  .overview {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    flex-wrap: wrap;

    .overview-item {
      width: 402px;
      height: 266px;
      background-color: #fff;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      flex-flow: column;
      margin-top: 10px;
      border-radius: 12px;

      .el-image {
        margin-bottom: 27px;
      }

      .item-tips {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: #797979;
        line-height: 17px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin-bottom: 10px;
      }

      .item-nums {
        font-family: Alibaba PuHuiTi 3-105 Heavy;
        font-weight: 900;
        font-size: 27px;
        color: #1a1a1a;
        line-height: 17px;
        text-align: left;
        font-style: normal;
        text-transform: none;

        span {
          font-family: Alibaba PuHuiTi 3-55 Regular;
          font-weight: 400;
          font-size: 14px;
          color: #1a1a1a;
          line-height: 17px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }
    }
  }

  .events-box {
    background-color: #fff;
    width: 100%;
    height: 222px;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-top: 24px;

    .event-item {
      width: 377px;
      height: 165px;
      border-radius: 11px 11px 11px 11px;
      border: 1px solid #d8defd;
      display: flex;
      justify-content: center;
      align-items: center;

      .item-imgBox {
        width: 114px;
        height: 93px;
        background: #eff3fa;
        border-radius: 9px 9px 9px 9px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 35px;
      }

      .item-info {
        .number {
          font-family: Alibaba PuHuiTi 3-105 Heavy;
          font-weight: 700;
          font-size: 27px;
          color: #1a1a1a;
          line-height: 17px;
          text-align: left;
          font-style: normal;
          text-transform: none;
          margin-bottom: 10px;

          span {
            font-family: Alibaba PuHuiTi 3-55 Regular;
            font-weight: 400;
            font-size: 14px;
            color: #1a1a1a;
            line-height: 17px;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }
        }

        .tips {
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 12px;
          color: #797979;
          line-height: 17px;
          text-align: left;
          font-style: normal;
          text-transform: none;
          margin-bottom: 10px;
        }
      }
    }
  }

  .footer-box {
    width: 100%;
    height: 222px;
    background-color: #fff;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    padding: 0 20px;

    .footer-item {
      width: 377px;
      height: 134px;
      background: #fdfdfd;
      border-radius: 11px 11px 11px 11px;
      border: 1px solid #eff3fa;
      display: flex;
      justify-content: center;
      align-items: center;

      .item-imgBox {
        width: 72px;
        height: 72px;
        background: #eff3fa;
        border-radius: 9px 9px 9px 9px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 35px;
      }

      .item-info {
        .number {
          font-family: Alibaba PuHuiTi 3-105 Heavy;
          font-weight: 700;
          font-size: 27px;
          color: #1a1a1a;
          line-height: 17px;
          text-align: left;
          font-style: normal;
          text-transform: none;

          span {
            font-family: Alibaba PuHuiTi 3-55 Regular;
            font-weight: 400;
            font-size: 14px;
            color: #1a1a1a;
            line-height: 17px;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }
        }

        .tips {
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 12px;
          color: #797979;
          line-height: 17px;
          text-align: left;
          font-style: normal;
          text-transform: none;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
