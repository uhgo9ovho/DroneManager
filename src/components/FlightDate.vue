<template>
  <div class="flight-date">
    <div style="height: 100%">
      <div class="task-sort-wrap">
        <div class="sort-menu">
          <div class="nest-info">
            <el-popover
              placement="bottom"
              trigger="click"
              width="480"
              popper-class="schedule-nest-popover"
            >
              <div class="nest-dialog">
                <div class="nest-area-wrap">
                  <div class="nest-item nest-item-selected">
                    全部机场({{ taskOptions.length }})
                  </div>
                </div>
                <div class="nest-list-wrap">
                  <div
                    class="nest-item nest-item-selected"
                    @click="checkedAirPost(item)"
                    v-for="(item, index) in taskOptions"
                    :key="index"
                  >
                    {{ item.label }}
                  </div>
                </div>
              </div>

              <div slot="reference">
                <span>{{ task }}</span>
                <i class="el-icon-arrow-down"></i>
              </div>
            </el-popover>
            <el-button type="text" @click="openAI">AI托管设置</el-button>
            <el-tooltip class="item" effect="dark" placement="bottom">
              <div slot="content" style="width: 400px">
                AI托管：<br />无人机按预设时间自动起飞，自主返回，失败续飞，高效执行任务。系统依托智能调度算法动态计算起飞时间。且在无人机起飞前会进行全面的安全校验，包括机体状态、气象条件、电量预测等多因素，确保每次飞行任务的安全可靠。在飞行过程中，系统时刻监测飞行状态，确保无人机在遇到恶劣天气、设备故障等情况下自动报警或返航，必要时触发机场停飞，降低炸机风险。
                然而，尽管AI托管赋予了飞行自动化，我们仍建议您保持警惕的关注，以防任何事故的发生。
              </div>
              <i class="el-icon-info"></i>
            </el-tooltip>
          </div>
          <div>
            <date-title
              ref="dateTitle"
              :isDay="isDay"
              :total="total"
              @formattedDate="formattedDate"
            ></date-title>
          </div>
          <div class="date-type-switch">
            <div class="type-switch">
              <div
                :class="[isDay ? 'date-select' : 'date-unselect']"
                @click="showDay"
              >
                日
              </div>
              <div
                :class="[!isDay ? 'date-select' : 'date-unselect']"
                @click="showMounth"
              >
                月
              </div>
            </div>
          </div>
        </div>
        <div class="sort-day" v-if="isDay">
          <sort-day-list
            @updateData="updateData"
            :currentDate="currentDate"
            :sortList="sortList"
          ></sort-day-list>
        </div>
        <div class="sort-month" v-else>
          <sort-month-list
            :sortMonthList="sortMonthList"
            :currentMonthDate="currentMonthDate"
            ref="MonthList"
            @changeDate="changeDate"
          ></sort-month-list>
        </div>
      </div>
    </div>
    <!-- AI托管弹窗 -->
    <div v-if="showAIDialog">
      <AIDialog
        :showAIDialog="showAIDialog"
        @handleClose="handleClose"
        :taskOptions="taskOptions"
      ></AIDialog>
    </div>
  </div>
</template>

<script>
import AIDialog from "./Template/AIDialog.vue";
import DateTitle from "./Template/DateTitle.vue";
import SortDayList from "./Template/SortDayList.vue";
import SortMonthList from "./Template/SortMonthList.vue";
import { heduledListAPI, heduledMonthListAPI } from "@/api/TaskManager.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "FlightDate",
  components: {
    DateTitle,
    SortDayList,
    AIDialog,
    SortMonthList,
  },
  data() {
    return {
      showAIDialog: false,
      isDay: true,
      pageNum: 1,
      pageSize: 10,
      sortList: [],
      currentDate: "",
      sortMonthList: [],
      total: 0,
      currentMonthDate: "",
      task: "",
      taskOptions: [],
    };
  },
  computed: {
    ...mapState("droneStatus", ["airPostInfo", "airOptions"]),
  },
  mounted() {
    this.getDeviceInfo();
  },
  methods: {
    ...mapActions("droneStatus", ["fetchAirPostInfo"]),
    async getDeviceInfo() {
      await this.fetchAirPostInfo();
      this.task = this.airPostInfo.address;
      this.taskOptions = this.airOptions;
    },
    checkedAirPost(item) {
      this.task = item.label;
    },
    changeDate(date) {
      const dateFormat = new Date(date);
      this.$refs.dateTitle.formatDate(dateFormat);
    },
    updateData(currentDate) {
      this.initDayList(currentDate);
    },
    initDayList(date) {
      heduledListAPI(date).then((res) => {
        if (res.code === 200) {
          this.sortList = res.rows;
          this.total = res.total;
        }
      });
    },
    initMonthList() {
      const params = {
        start: "2024-12-01",
        end: "2024-12-30",
      };
      heduledMonthListAPI(params).then((res) => {
        if (res.code === 200) {
          this.sortMonthList = res.rows;
          this.total = res.total;
        }
      });
    },
    convertDate(inputDate) {
      if (!inputDate.match(/^\d{4}\/\d{2}$/)) {
        alert("请输入正确格式，例如 2025/02");
        return;
      }

      const [year, month] = inputDate.split("/").map(Number);
      const date = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)); // 创建 UTC 日期
      const dateInCST = new Date(date.getTime() + 8 * 60 * 60 * 1000); // 转换为中国标准时间

      return dateInCST.toString(); // 格式化输出
    },
    formattedDate(date) {
      if (this.isDay) {
        this.currentDate = date;

        this.initDayList(date);
      } else {
        this.$refs.MonthList.value = this.convertDate(date);
        const params = {
          start: this.getMonthStartAndEnd(date).firstDay,
          end: this.getMonthStartAndEnd(date).lastDay,
        };
        heduledMonthListAPI(params).then((res) => {
          if (res.code === 200) {
            this.sortMonthList = res.rows;
            this.$refs.MonthList.formatData();
            this.total = res.total;
            this.currentMonthDate = date;
          }
        });
      }
    },
    getMonthStartAndEnd(dateString) {
      // 将传入的日期字符串转换为 Date 对象
      const date = new Date(dateString);

      // 获取该月的第一天
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

      // 获取该月的最后一天
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      // 格式化为 YYYY-MM-DD
      const formatDate = (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;

      return {
        firstDay: formatDate(firstDay),
        lastDay: formatDate(lastDay),
      };
    },
    handleClose() {
      this.showAIDialog = false;
    },
    openAI() {
      this.showAIDialog = true;
    },
    showDay() {
      this.isDay = true;
    },
    showMounth() {
      // this.initMonthList();
      this.isDay = false;
    },
  },
};
</script>

<style lang="scss">
.flight-date {
  width: 100%;
  flex: 1;
  overflow: hidden;
  .task-sort-wrap {
    caret-color: transparent;
    flex-direction: column;
    height: 100%;
    display: flex;
    .sort-menu {
      display: flex;
      justify-content: space-between;
      .nest-info {
        display: flex;
        align-items: center;
        .el-button {
          margin-left: 10px;
        }
        .el-popover__reference {
          display: flex;
          align-items: center;
          width: 268px;
          border: 1px solid #86868c;
          border-radius: 16px;
          font-weight: 500;
          font-size: 14px;
          color: #1d1d1f;
          line-height: 36px;
          padding: 0 10px;
          cursor: pointer;
          -ms-flex-direction: row;
          flex-direction: row;
          -ms-flex-align: center;
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          justify-content: space-between;
        }
      }
      .date-type-switch {
        .type-switch {
          display: flex;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
          flex-direction: row;
          background: #ebebec;
          padding: 0.2777777778vh;
          border-radius: 0.7407407407vh;
          cursor: pointer;
          .date-select {
            width: 92px;
            height: 32px;
            font-weight: 550;
            font-size: 14px;
            color: #1d1d1f;
            letter-spacing: 0;
            text-align: center;
            line-height: 32px;
            background: #fff;
            border-radius: 8px;
          }
          .date-unselect {
            width: 92px;
            height: 32px;
            font-weight: 400;
            font-size: 14px;
            color: #86868c;
            letter-spacing: 0;
            text-align: center;
            line-height: 32px;
            background: #ebebec;
            border-radius: 8px;
            user-select: none;
          }
        }
      }
    }
    .sort-day {
      overflow: scroll;
      position: relative;
      overflow-y: scroll;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: calc(100vh - 200px);
    }
    .sort-month {
      margin-left: 7px;
      margin-right: 8px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: calc(100vh - 200px);
    }
  }
}
.schedule-nest-popover {
  .nest-dialog {
    max-height: 350px;
    display: flex;
    flex-direction: row;
    padding: 8px;
    font-size: 14px;
    color: #1d1d1f;
    user-select: none;
    .nest-area-wrap {
      border-right: 1px solid #f5f5f5;
      padding-right: 8px;
      overflow-y: auto;
      .nest-item {
        cursor: pointer;
        border-radius: 6px;
        height: 36px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 7px 16px;
      }
      .nest-item-selected {
        background-color: #f5f5f5;
        font-weight: 700;
      }
    }
    .nest-list-wrap {
      overflow-y: auto;
      padding-left: 8px;
      padding-right: 8px;
      flex: 1;
      .nest-item {
        cursor: pointer;
        border-radius: 6px;
        height: 36px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 7px 16px;
      }
      .nest-item-selected {
        background-color: #f5f5f5;
        font-weight: 700;
      }
    }
  }
}
</style>
