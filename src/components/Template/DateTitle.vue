<template>
  <div class="date-wrap">
    <div class="date-info">
      <i class="el-icon-arrow-left"></i>
      <label for="datePicker"
        ><div style="cursor: pointer">
          {{ date }} {{ dayOfWeekName }}
        </div></label
      >
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        name="datePicker"
        id="datePicker"
        @change="dateChange"
      >
      </el-date-picker>
      <i class="el-icon-arrow-right"></i>
    </div>
    <div class="task-count">共 10 架次</div>
  </div>
</template>

<script>
export default {
  name: "DateWrap",
  data() {
    return {
      date: "",
      dayOfWeekName: "",
    };
  },
  methods: {
    formatDate(DateObj) {
      // 提取年份、月份和日期
      const year = DateObj.getFullYear();
      const month = (DateObj.getMonth() + 1).toString().padStart(2, "0");
      const day = DateObj.getDate().toString().padStart(2, "0");

      // 格式化为 YYYY/MM/DD 格式
      const formattedDate = `${year}/${month}/${day}`;
      this.date = formattedDate;
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
      this.date = formattedDate;
    },
    dateChange(val) {
      const date = new Date(val);
      this.formatDate(date)
    },
    getCurrentDate() {
      const date = new Date();
      this.formatDate(date)
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