<template>
  <div class="date-wrap">
    <div class="date-info">
      <i class="el-icon-arrow-left" @click="lastTime"></i>
      <label for="datePicker"
        ><div style="cursor: pointer">
          {{ date }} {{ isDay ? dayOfWeekName : "" }}
        </div></label
      >
      <el-date-picker
        v-model="date"
        :type="DateType"
        placeholder="选择日期"
        name="datePicker"
        id="datePicker"
        @change="dateChange"
      >
      </el-date-picker>
      <i class="el-icon-arrow-right" @click="nextTime"></i>
    </div>
    <div class="task-count">共 10 架次</div>
  </div>
</template>

<script>
export default {
  name: "DateWrap",
  props: {
    isDay: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      date: "",
      dayOfWeekName: "",
    };
  },
  computed: {
    DateType() {
      if (this.isDay) return "date";
      return "month";
    },
  },
  watch: {
    isDay() {
      this.formatDate(new Date(this.date));
    },
  },
  methods: {
    formatDate(DateObj) {
      // 提取年份、月份和日期
      const year = DateObj.getFullYear();
      const month = (DateObj.getMonth() + 1).toString().padStart(2, "0");
      const day = DateObj.getDate().toString().padStart(2, "0");

      // 格式化为 YYYY/MM/DD 格式
      const formattedDate = `${year}/${month}/${day}`;
      const formattedMonth = `${year}/${month}`;
      // 获取星期几的数字表示
      const dayOfWeekNumber = DateObj.getDay();
      const daysOfWeek = [
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六",
      ];
      // 获取对应的星期几名称
      this.dayOfWeekName = daysOfWeek[dayOfWeekNumber];
      this.date = this.isDay ? formattedDate : formattedMonth;
    },
    dateChange(val) {
      const date = new Date(val);
      this.formatDate(date);
    },
    getCurrentDate() {
      const date = new Date();
      this.formatDate(date);
    },
    //时间戳转换成日期格式
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以需要加1
      const day = String(date.getDate()).padStart(2, "0");
      this.date = this.isDay ? `${year}/${month}/${day}` : `${year}/${month}`;
    },
    lastTime() {
      if (this.isDay) {
        let lastDay = new Date(this.date).getTime() - 3600 * 1000 * 24;
        this.formatTime(lastDay);
        this.formatDate(new Date(lastDay));
      } else {
        let currentDate = new Date(this.date); // 获取当前日期
        let currentMonth = currentDate.getMonth(); // 获取当前月份
        let lastMonthDate = new Date(currentDate.setMonth(currentMonth - 1)); // 设置为下一个月份

        // 如果当前日期是月末（比如31号），而下一个月份没有对应的日期，Date对象会自动调整到下一个月的首日。
        this.formatTime(lastMonthDate);
        this.formatDate(new Date(lastMonthDate));
      }
    },
    nextTime() {
      if (this.isDay) {
        let nextDay = new Date(this.date).getTime() + 3600 * 1000 * 24;
        this.formatTime(nextDay);
        this.formatDate(new Date(nextDay));
      } else {
        let currentDate = new Date(this.date); // 获取当前日期
        let currentMonth = currentDate.getMonth(); // 获取当前月份
        let nextMonthDate = new Date(currentDate.setMonth(currentMonth + 1)); // 设置为下一个月份

        // 如果当前日期是月末（比如31号），而下一个月份没有对应的日期，Date对象会自动调整到下一个月的首日。

        this.formatTime(nextMonthDate);
        this.formatDate(new Date(nextMonthDate));
      }
    },
  },
  mounted() {
    this.getCurrentDate();
  },
};
</script>

<style lang="scss">
.date-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 305px;
  .date-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    width: 100%;
    position: relative;
    .date-picker {
      position: absolute;
      left: 0;
    }
    .el-date-editor {
      position: absolute;
      width: 0 !important;
      .el-input__inner {
        padding: 0 !important;
        height: 0 !important;
        border: 0;
      }
      .el-input__prefix,
      .el-input__suffix {
        visibility: hidden;
        position: absolute !important;
        top: 0;
        // display: none;
      }
    }
    i {
      height: 36px;
      width: 36px;
      font-weight: 600;
      text-align: center;
      padding: 10px;
      color: #000;
      cursor: pointer;
      &:hover {
        background-color: #c7c7cb;
        border-radius: 50%;
      }
    }
  }
}
</style>