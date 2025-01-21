<template>
  <div>
    <div class="day-list">
      <div style="margin: auto; position: relative; width: 1248px">
        <div class="task-table">
          <div></div>
          <div id="id_taskList1">
            <div
              class="task-item-day"
              v-for="(item, index) in airLines"
              :key="index"
            >
              <div class="time-flag">
                <div class="time-text">{{ item.time }}</div>
              </div>
              <div class="item-container" style="flex: 1 1 0%">
                <div class="task-item">
                  <div
                    v-for="(item2, index) in airInfos"
                    :key="index"
                    v-show="item.taskName"
                  >
                    <div
                      class="task-past-card"
                      v-if="
                        formatTime(item2.formatTime) === item.time ||
                        airTime(item2.formatTime) === item.time
                      "
                    >
                      <AirItemInfo
                        :info="item2"
                        @openDialog="openDialog"
                        @updateData="updateDataDel"
                        :isShowAddBtn="isShowAddBtn(item.time)"
                        :dateSHowBtn="dateSHowBtn"
                      ></AirItemInfo>
                    </div>
                  </div>
                  <div v-if="!item.taskName">
                    <div
                      class="task-card3"
                      @click="addAirBtn(item)"
                      v-if="dateSHowBtn && isShowAddBtn(item.time)"
                    >
                      <div class="icon-add">+</div>
                    </div>
                    <div class="task-card3" v-else></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="time-line-wrap" :style="topPX" v-if="isToday(currentDate)">
          <div class="time-text">{{ currentTime }}</div>
          <div class="time-line"></div>
        </div>
      </div>
    </div>
    <!--  详情弹窗 -->
    <div v-if="visible">
      <FlightDialog
        @closeDialog="closeDialog"
        :detailsShow="true"
        :taskDetails="true"
        :row="row"
      ></FlightDialog>
    </div>
    <!-- 添加航线弹窗 -->
    <div v-if="addAirShow">
      <AddAirLineDialog
        @updateData="updateData"
        :currentDate="currentDate"
        :startTime="startTime"
        :addAirShow="addAirShow"
        @closeLineDialog="closeLineDialog"
      ></AddAirLineDialog>
    </div>
  </div>
</template>

<script>
import AirItemInfo from "./AirItemInfo.vue";
import FlightDialog from "./FlightDialog.vue";
import AddAirLineDialog from "./AddAirLineDialog.vue";
export default {
  name: "DayList",
  props: {
    sortList: {
      type: Array,
      default: () => [],
    },
    currentDate: {
      type: String,
      default: "",
    },
  },
  components: {
    AirItemInfo,
    FlightDialog,
    AddAirLineDialog,
  },
  data() {
    return {
      airLines: [
        {
          time: "9:00",
        },
        {
          time: "10:00",
        },
        {
          time: "11:00",
        },
        {
          time: "12:00",
        },
        {
          time: "13:00",
        },
        {
          time: "14:00",
        },
        {
          time: "15:00",
        },
        {
          time: "16:00",
        },
        {
          time: "17:00",
        },
        {
          time: "18:00",
        },
        {
          time: "19:00",
        },
        {
          time: "20:00",
        },
        {
          time: "21:00",
        },
      ],
      airInfos: [],
      currentTime: "",
      timer: null,
      top: 0,
      shouldMove: false, //是否开始移动
      visible: false,
      addAirShow: false,
      startTime: "",
      row: null,
    };
  },
  computed: {
    isToday() {
      return function (dateString) {
        // 将传入的字符串转换为日期对象
        const inputDate = new Date(dateString);
        const today = new Date();

        // 获取当天的年份、月份和日期
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth(); // 月份是从0开始的
        const currentDate = today.getDate();

        // 获取输入日期的年份、月份和日期
        const inputYear = inputDate.getFullYear();
        const inputMonth = inputDate.getMonth();
        const inputDateOnly = inputDate.getDate();

        // 比较日期是否一致
        return (
          inputYear === currentYear &&
          inputMonth === currentMonth &&
          inputDateOnly === currentDate
        );
      };
    },
    topPX() {
      return {
        top: `${this.top}px`,
      };
    },
    isShowAddBtn() {
      let that = this;
      return function (time) {
        if (that.currentTime) {
          return that.compareTime(time, that.currentTime);
        }
      };
    },
    dateSHowBtn() {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 设置时间为当天的0点
      const currentDateObj = new Date(this.currentDate.replace(/\//g, "-")); // 将 YYYY/MM/DD 转换为日期对象
      return currentDateObj >= today; // 比较日期对象
    },
  },
  watch: {
    sortList(arr) {
      if (arr) {
        this.airInfos = arr;
        this.getAirLines();
      }
    },
  },
  methods: {
    updateDataDel() {
      this.$emit("updateData", this.currentDate);
    },
    compareTime(time1, time2) {
      const [hour1, minute1] = time1.split(":").map(Number);
      const [hour2, minute2] = time2.split(":").map(Number);

      if (hour1 > hour2 || (hour1 === hour2 && minute1 > minute2)) {
        return true; // time1 大于 time2
      } else if (hour1 === hour2 && minute1 === minute2) {
        return true; // 两个时间相等
      } else {
        return false; // time1 小于 time2
      }
    },
    updateData(currentDate) {
      this.$emit("updateData", currentDate);
    },
    addAirBtn(item) {
      console.log(item);
      this.startTime = item.time;
      this.addAirShow = true;
    },
    closeLineDialog() {
      this.addAirShow = false;
    },
    openDialog(row) {
      this.row = row;
      this.visible = true;
    },
    closeDialog() {
      this.visible = false;
    },
    checkTimeAndStart() {
      const now = new Date();
      const nineAM = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        9,
        0,
        0
      );

      if (now >= nineAM) {
        this.shouldMove = true;
        // 计算已经过去的分钟数
        const minutesPastNine = Math.floor((now - nineAM) / 60000) * 1.16;

        this.top = minutesPastNine; // 根据过去的分钟数设置初始 top 值
        this.startMoving();
      } else {
        const timeUntilNineAM = nineAM - now;
        setTimeout(() => {
          this.shouldMove = true;
          this.top = 0; // 9点的时候从top: 0px开始
          this.startMoving();
        }, timeUntilNineAM);
      }
    },
    startMoving() {
      this.shouldMove = true;

      setInterval(() => {
        this.top += 1.16;
      }, 60000); // 每60,000毫秒(1分钟) 增加1px
    },

    updateTime() {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();

      // 格式化时间，确保分钟和秒钟总是两位数
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      // 显示当前时间
      this.currentTime = hours + ":" + minutes;
    },
    formatTime(timeStr) {
      return timeStr.replace(/^0/, "").replace(/:00$/, "");
    },
    airTime(time) {
      switch (time) {
        case "10:30:00":
          return "10:00";
        case "14:30:00":
          return "14:00";
        default:
          break;
      }
    },
    getAirLines() {
      this.airLines.forEach((item1) => {
        const match = this.sortList.find((item2) => {
          item2.formatTime = item2.scheduledTime.split(" ")[1];
          return (
            this.formatTime(item2.formatTime) === item1.time ||
            this.airTime(item2.formatTime) === item1.time
          );
        });

        if (match) {
          // 将 match 对象中的属性复制到 item1 中
          Object.keys(match).forEach((key) => {
            item1[key] = match[key];
          });
        }
      });
    },
  },
  mounted() {
    this.updateTime();

    this.timer = setInterval(this.updateTime, 1000);
    this.checkTimeAndStart();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss">
.day-list {
  overflow: auto;
  display: flex;
  .task-table {
    flex: 1 1 0%;
    height: 100%;
    padding-top: 15px;
    padding-right: 30px;
    .task-item-day {
      border-top: 1px solid rgba(226, 226, 228, 0.7);
      padding: 2px 0;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      width: 100%;
      position: relative;
      .time-flag {
        background: #ff0;
        position: relative;
        width: 74px;
        border-right: 1px solid rgba(226, 226, 228, 0.7);
        height: 100%;
        .time-text {
          position: absolute;
          top: -9px;
          left: 20px;
          font-weight: 500;
          font-size: 14px;
          color: #6e6e73;
          text-align: center;
          line-height: 14px;
        }
      }
      .task-item {
        flex: 1;
        border-left: 1px solid rgba(226, 226, 228, 0.7);
        padding-left: 17px;
        .shikuang {
          background: #000 !important;
        }
        .task-past-card {
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
          height: 60px;
          margin: 2px 0;
          border-radius: 36px;
          background: rgb(234, 234, 235);
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
          -ms-flex-direction: row;
          flex-direction: row;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          justify-content: space-between;
          // padding-left: 30px;
          // padding-right: 48px;
          color: rgb(134, 134, 140);
        }
        .task-card3 {
          cursor: pointer;
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
          height: 60px;
          margin: 2px 0;
          border-radius: 36px;
          background: #f5f5f6;
          border: 1px dashed grey;
          flex-direction: row;
          display: flex;
          justify-content: center;
          align-items: center;
          .icon-add {
            cursor: pointer !important;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: #e2e2e4;
            font-size: 20px;
            color: #000;
            flex-direction: row;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
  .time-line-wrap {
    position: absolute;
    left: 0;
    top: 100px;
    pointer-events: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-right: 20px;
    padding-left: 0;
    .time-text {
      width: 75px;
      height: 24px;
      background: #1d1d1f;
      border-radius: 12px;
      color: #fff;
      text-align: center;
      line-height: 24px;
    }
    .time-line {
      flex: 1;
      height: 1px;
      background: rgba(0, 0, 0, 0.5);
      box-shadow: 0 0 5px 1px #fff;
    }
  }
}
</style>