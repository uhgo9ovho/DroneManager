<template>
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
                  v-show="item.airline_name"
                >
                  <div
                    class="task-past-card"
                    v-if="formatTime(item2.plan_window[0]) === item.time"
                  >
                  <AirItemInfo :info="item2"></AirItemInfo>
                  </div>
                </div>
                <div v-if="!item.airline_name">
                  <div class="task-card3">
                    <div class="icon-add">+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mockList4 } from "@/utils/mock.js";
import AirItemInfo from './AirItemInfo.vue';
export default {
  name: "DayList",
  components: {
    AirItemInfo
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
        {
          time: "22:00",
        },
        {
          time: "23:00",
        },
      ],
      airInfos: [],
    };
  },
  methods: {
    formatTime(timeStr) {
      return timeStr.replace(/^0/, "").replace(/:00$/, "");
    },
    getAirLines() {
      this.airLines.forEach((item1) => {
        const match = mockList4.find(
          (item2) => this.formatTime(item2.plan_window[0]) === item1.time
        );
        console.log(match);

        if (match) {
          // 将 match 对象中的属性复制到 item1 中
          Object.keys(match).forEach((key) => {
            item1[key] = match[key];
          });
        }
      });
      console.log(this.airLines);
    },
  },
  mounted() {
    this.getAirLines();
    this.airInfos = mockList4;
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
      align-items: start;
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
}
</style>