<template>
  <div class="month-list">
    <table class="table-head">
      <thead>
        <th v-for="(item, index) in weekOptions" :key="index">{{ item }}</th>
      </thead>
    </table>
    <el-calendar v-model="value" :first-day-of-week="7">
      <template slot="dateCell" slot-scope="{ data }">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split("-").slice(1).join("-") }}
        </p>
        <div
          v-for="(item, index) in dayList"
          :key="index"
          v-show="data.day == item.date"
        >
          <div
            class="item-month-title"
            v-for="(it, idx) in item.airlines"
            :key="idx"
          >
            <div
              class="month-task-item"
              :style="{
                background: changeBg(it.taskType),
                color: changeColor(it.schedulingStatus, it.lineName),
              }"
            >
              <!-- <i class="el-icon-close"></i> -->
              <div class="task-name" :title="it.lineName" @click="showDetail(it)">
                {{ it.lineName }}
              </div>
              <div class="task-time">{{ it.scheduledTime.split(" ")[1] }}</div>
            </div>
          </div>

        </div>

      </template>
    </el-calendar>
    <div class="state-info">
      <div class="info-item" v-for="(item, index) in infoOptions" :key="index">
        <div
          class="state-circle"
          :style="{ background: item.color, 'box-shadow': item.shadow }"
        ></div>
        <div class="state-text">{{ item.label }}</div>
      </div>
    </div>
    <!--  详情弹窗 -->
    <div v-if="visible">
      <FlightDialog
        @closeDialog="closeDialog"
        :detailsShow="true"
        :taskDetails="true"
        :row="task"
      ></FlightDialog>
    </div>
  </div>

</template>

<script>
import FlightDialog from '@/components/Template/FlightDialog.vue'
import { taskInfoApI } from '@/api/TaskManager'

export default {
  name: "MonthList",
  components: { FlightDialog },
  props: {
    sortMonthList: {
      type: Array,
      default: () => [],
    },
    currentMonthDate: {
      type: String,
      default: ""
    }
  },
  watch: {
    currentMonthDate: {
      handler(val) {
        // this.value = val;
        this.formatData()
      }
    },
    value(val) {
      console.log(val,'aaasss');

      this.$emit('changeDate', val);

    }
  },
  data() {
    return {
      value: new Date(),
      weekOptions: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      infoOptions: [
        {
          label: "拍照",
          color: "rgb(61, 186, 222)",
          shadow: "rgba(61, 186, 222, 0.42) 0px 2px 6px 0px",
        },
        {
          label: "全景",
          color: "rgb(160, 98, 202)",
          shadow: "rgba(160, 98, 202, 0.35) 0px 2px 6px 0px",
        },
        {
          label: "正射",
          color: "rgb(234, 75, 131)",
          shadow: "rgba(234, 75, 131, 0.45) 0px 2px 6px 0px",
        },
        {
          label: "三维",
          color: "rgb(246, 169, 31)",
          shadow: "rgba(246, 169, 31, 0.6) 0px 2px 6px 0px",
        },
        {
          label: "直播",
          color: "rgb(52, 198, 66)",
          shadow: "rgba(52, 198, 66, 0.5) 0px 2px 6px 0px",
        },
      ],
      dayList: [],
      visible:false,
      task:null
    };
  },
  computed: {
    changeBg() {
      return function (taskType) {
        switch (taskType) {
          case 0:
            //拍照
            return "rgb(61, 186, 222)";
          case 1:
            //直播
            return "rgb(52, 198, 66)";
          case 2:
            //全景
            return "rgb(160, 98, 202)";
          case 3:
            //正射
            return "rgb(234, 75, 131)";
          case 4:
            //三维
            return "rgb(246, 169, 31)";

          default:
            break;
        }
      };
    },
    changeColor() {
      return function () {
        return "#fff";
      };
    },
  },
  methods: {
    formatData() {
      // 按日期分组
      this.dayList = []
      this.dayList = this.sortMonthList.reduce((acc, item) => {
        // 提取日期部分（只保留年-月-日）
        let date = item.scheduledTime.split(" ")[0];

        // 查找是否已存在该日期的分组
        let group = acc.find((group) => group.date === date);

        if (group) {
          // 如果已存在该日期分组，添加到 airlines 数组中
          group.airlines.push(item);
        } else {
          // 如果不存在该日期分组，创建一个新分组
          acc.push({
            airlines: [item],
            date: date,
          });
        }

        return acc;
      }, []);

    },
    showDetail(task){
      taskInfoApI(task.taskId).then((res)=>{
        if(res.code === 200){
          this.task = res.data
          this.visible = true
        }
      })
    },
    closeDialog() {
      this.visible = false;
    },
  },
  mounted() {
    this.formatData()
  },
};
</script>

<style lang="scss">
.month-list {
  margin-left: 7px;
  margin-right: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  .table-head {
    width: 100%;
    background: #fff;
    height: 4.4444444444vh;
    border-radius: 0.4166666667vw 0.4166666667vw 0 0;
    user-select: none;
    th {
      font-weight: 550;
      font-size: 1.4814814815vh;
      color: #1d1d1f;
      text-align: center;
      line-height: 2.2222222222vh;
    }
  }
  .el-calendar {
    flex: 1 1 0%;
    overflow: auto;
    background: none !important;
    .el-calendar-table .el-calendar-day:hover {
      background-color: transparent;
    }
    .el-calendar__header {
      display: none;
    }
    .el-calendar__body {
      padding: 0;
      thead {
        display: none;
      }
      .el-calendar-day {
        min-height: 13.8888888889vh;
        height: auto !important;
        .month-task-item {
          height: 26px;
          background: rgba(0, 0, 0, 0.0392156862745098);
          border-radius: 14px;
          font-weight: 400;
          font-size: 13px;
          color: #86868c;
          line-height: 26px;
          margin-top: 2px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding-left: 11px;
          padding-right: 8px;
          .task-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
            font-size: 13px;
            line-height: 13px;
            margin-left: 3px;
          }
        }
      }
    }
  }
  .state-info {
    height: 48px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding-right: 32px;
    background: #f5f5f6;
    .info-item {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .state-circle {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-left: 28px;
    }
    .state-text {
      font-weight: 400;
      font-size: 14px;
      color: #6e6e73;
      letter-spacing: 0;
      text-align: center;
      line-height: 14px;
      margin-left: 4px;
    }
  }
}
</style>
