<template>
  <div class="task-info">
    <div class="taskImage">
      <!-- <p class="calendar">
        {{ row.dateTime.split('-')[2] }} <em>{{ dayOfWeek }}</em>
      </p> -->
    </div>
    <div class="task_image">
      <img :src="iconImage" alt="" />
      <div class="dayOfYear" v-if="taskType === 1">{{ dayOfYear }}</div>
      <div class="year_day" v-if="taskType === 1">{{ yearDay }}</div>
      <div class="weekOfYear" v-if="taskType === 2">{{ weekOfYear }}</div>
      <div class="year_week" v-if="taskType === 2">{{ yearDay }}</div>
      <div class="monthOfYear" v-if="taskType === 3">{{ monthOfYear }}</div>
      <div class="year_month" v-if="taskType === 3">{{ yearDay }}</div>
    </div>
    <div v-if="taskType == 1" class="task-title">{{ row.dateTime }}</div>
    <div v-if="taskType == 2" class="task-title">
      {{ row.dateTime + "-" + this.getLastDate(row, taskType) }}
    </div>
    <div v-if="taskType == 3" class="task-title">
      {{ row.date + "-" + this.getLastDate(row, taskType) }}
    </div>
  </div>
</template>

<script>
import dayImage from "@/assets/images/daily.png";
import MonthlyReport from "@/assets/images/MonthlyReport.png";
import weekly from "@/assets/images/weekly.png";
export default {
  name: "DataTime",
  props: {
    row: {
      type: Object,
      default: () => {},
    },
    taskType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dayImage: dayImage,
      MonthlyReport: MonthlyReport,
      weekly: weekly,
    };
  },
  created() {
    console.log("zheshi shi", this.row, this.taskType);
  },
  computed: {
    dayOfWeek() {
      const today = new Date(this.row.dateTime);
      // 获取星期几 (0 表示星期日，1 表示星期一，以此类推)
      const dayOfWeek = today.getDay();
      // 获取星期几
      const days = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      return days[dayOfWeek];
    },
    iconImage() {
      if (this.taskType == 1) {
        return this.dayImage;
      } else if (this.taskType == 2) {
        return this.weekly;
      } else {
        return this.MonthlyReport;
      }
    },
    yearDay() {
      return this.row.dateTime.split("-")[0];
    },
    // 当前日期是该年份的第几天
    dayOfYear() {
      const date = new Date(this.row.dateTime);
      const startOfYear = new Date(this.row.dateTime.split("-")[0], 0, 1); // 该年份的第一天
      return Math.ceil((date - startOfYear + 1) / (1000 * 60 * 60 * 24));
    },
    // 当前日期是该年份的第几周
    weekOfYear() {
      const date = new Date(this.row.dateTime);
      const firstDayOfYear = new Date(this.row.dateTime.split("-")[0], 0, 1);
      const dayOfWeek = date.getDay() || 7; // 周日为7
      const diff =
        (date - firstDayOfYear + (firstDayOfYear.getDay() - dayOfWeek)) /
        (1000 * 60 * 60 * 24);
      return Math.ceil((diff + 1) / 7);
    },
    // 当前日期是该年份的第几月
    monthOfYear() {
      const date = new Date(this.row.dateTime);
      return date.getMonth() + 1; // 月份从0开始，+1表示实际月份
    },
    // 获取年份
    year() {
      return (
        this.row.dateTime.split("-")[0] ||
        new Date(this.row.dateTime).getFullYear()
      );
    },
  },
  methods: {
    getLastDate(row, taskType) {
      if (taskType === 2) {
        const now = row.dateTime;
        const monday = new Date(now);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6); // 周天是周一的基础上再加6天
        const res = sunday.toISOString().split("T")[0];
        return res;
      } else if (taskType === 3) {
        //row.date 是本月第一天，需要return本月的最后一天日期，如row.date=2024-12-01，则返回2024-12-31
        const firstDayOfMonth = new Date(row.date);

        // 获取下个月的第一天，然后减去1毫秒，得到本月的最后一天
        // 设置下个月的日期为1，然后减去1毫秒
        const nextMonth = firstDayOfMonth.getMonth() + 1;
        const nextMonthFirstDay = new Date(
          firstDayOfMonth.getFullYear(),
          nextMonth,
          1
        );
        const lastDayOfMonth = new Date(nextMonthFirstDay - 1);

        // 格式化日期为 YYYY-MM-DD 字符串（或其他你需要的格式）
        const year = lastDayOfMonth.getFullYear();
        const month = String(lastDayOfMonth.getMonth() + 1).padStart(2, "0");
        const day = String(lastDayOfMonth.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    },
  },
};
</script>

<style lang="scss">
.task-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  .task_image {
    position: relative;
    img {
      width: 90px;
      height: 90px;
    }
    .dayOfYear {
      position: absolute;
      top: 60%;
      left: 50%;
      transform: translate(
        -50%,
        -50%
      ); /* 向上和向左移动元素的自身高度和宽度的一半 */
      width: 200px;
      height: 100px;
      text-align: center;
      line-height: 100px; /* 使文字垂直居中 */
      font-size: 32px;
      font-weight: bold;
    }
    .year_day {
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translate(
        -50%,
        -50%
      ); /* 向上和向左移动元素的自身高度和宽度的一半 */
      width: 200px;
      height: 100px;
      text-align: center;
      line-height: 100px; /* 使文字垂直居中 */
      font-size: 16px;
      font-weight: bold;
      color: #fff;
    }
    .weekOfYear,.monthOfYear  {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(
        -50%,
        -50%
      ); /* 向上和向左移动元素的自身高度和宽度的一半 */
      width: 200px;
      height: 100px;
      text-align: center;
      line-height: 100px; /* 使文字垂直居中 */
      font-size: 32px;
      font-weight: bold;
    }
    .year_week,.year_month {
      position: absolute;
      top: 80%;
      left: 50%;
      transform: translate(
        -50%,
        -50%
      ); /* 向上和向左移动元素的自身高度和宽度的一半 */
      width: 200px;
      height: 100px;
      text-align: center;
      line-height: 100px; /* 使文字垂直居中 */
      font-size: 16px;
      font-weight: bold;
      color: #fff;
    }
  }
  .taskImage {
    margin-right: 4px;
    position: relative;

    .calendar {
      margin: 0.25em 10px 10px 0;
      padding-top: 5px;
      float: left;
      width: 80px;
      background: #ededef;
      background: -webkit-gradient(
        linear,
        left top,
        left bottom,
        from(#ededef),
        to(#ccc)
      );
      background: -moz-linear-gradient(top, #ededef, #ccc);
      font: bold 30px/60px Arial Black, Arial, Helvetica, sans-serif;
      text-align: center;
      color: #000;
      text-shadow: #fff 0 1px 0;
      -moz-border-radius: 3px;
      -webkit-border-radius: 3px;
      border-radius: 3px;
      position: relative;
      -moz-box-shadow: 0 2px 2px #888;
      -webkit-box-shadow: 0 2px 2px #888;
      box-shadow: 0 2px 2px #888;
      &::before,
      &::after {
        content: "";
        float: left;
        position: absolute;
        top: 5px;
        width: 8px;
        height: 8px;
        background: #111;
        z-index: 1;
        -moz-border-radius: 10px;
        -webkit-border-radius: 10px;
        border-radius: 10px;
        -moz-box-shadow: 0 1px 1px #fff;
        -webkit-box-shadow: 0 1px 1px #fff;
        box-shadow: 0 1px 1px #fff;
      }
      &::before {
        left: 11px;
      }
      &::after {
        right: 11px;
      }
      em {
        display: block;
        font: normal bold 11px/30px Arial, Helvetica, sans-serif;
        color: #fff;
        text-shadow: #00365a 0 -1px 0;
        background: #04599a;
        background: -webkit-gradient(
          linear,
          left top,
          left bottom,
          from(#04599a),
          to(#00365a)
        );
        background: -moz-linear-gradient(top, #04599a, #00365a);
        -moz-border-radius-bottomright: 3px;
        -webkit-border-bottom-right-radius: 3px;
        border-bottom-right-radius: 3px;
        -moz-border-radius-bottomleft: 3px;
        -webkit-border-bottom-left-radius: 3px;
        border-bottom-left-radius: 3px;
        border-top: 1px solid #00365a;
        &::before,
        &::after {
          content: "";
          float: left;
          position: absolute;
          top: -5px;
          width: 4px;
          height: 14px;
          background: #dadada;
          background: -webkit-gradient(
            linear,
            left top,
            left bottom,
            from(#f1f1f1),
            to(#aaa)
          );
          background: -moz-linear-gradient(top, #f1f1f1, #aaa);
          z-index: 2;
          -moz-border-radius: 2px;
          -webkit-border-radius: 2px;
          border-radius: 2px;
        }
        &::before {
          left: 13px;
        }
        &::after {
          right: 13px;
        }
      }
    }
  }
  .task-title {
    font-weight: 600;
    font-size: 14px;
    color: #1d1d1f;
    line-height: 22px;
    margin-left: 10px;
  }
}
</style>
