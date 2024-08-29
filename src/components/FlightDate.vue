<template>
  <div class="flight-date">
    <div style="height: 100%">
      <div class="task-sort-wrap">
        <div class="sort-menu">
          <div class="nest-info">
            <el-popover
              placement="bottom"
              title="标题"
              width="200"
              trigger="click"
              content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
            >
              <div slot="reference">
                <span>西安-周至</span>
                <i class="el-icon-arrow-down"></i>
              </div>
            </el-popover>
            <el-button type="text" @click="openAI">AI托管设置</el-button>
            <el-tooltip class="item" effect="dark" placement="bottom">
              <div slot="content">
                AI托管：<br />无人机按预设时间自动起飞，自主返回，失败续飞，高效执行任务。系统依托智能调度算法动态计算起飞时间。且在无人机起飞前会进行全面的安全校验，包括机体状态、气象条件、电量预测等多因素，确保每次飞行任务的安全可靠。在飞行过程中，系统时刻监测飞行状态，确保无人机在遇到恶劣天气、设备故障等情况下自动报警或返航，必要时触发机场停飞，降低炸机风险。
                然而，尽管AI托管赋予了飞行自动化，我们仍建议您保持警惕的关注，以防任何事故的发生。
              </div>
              <i class="el-icon-info"></i>
            </el-tooltip>
          </div>
          <div>
            <date-title></date-title>
          </div>
          <div class="date-type-switch">
            <div class="type-switch">
              <div class="date-select">日</div>
              <div class="date-unselect">月</div>
            </div>
          </div>
        </div>
        <div class="sort-day" v-if="true">
          <sort-day-list></sort-day-list>
        </div>
        <div class="sort-month" v-else></div>
      </div>
    </div>
    <!-- AI托管弹窗 -->
    <div v-if="showAIDialog">
      <AIDialog :showAIDialog="showAIDialog" @handleClose="handleClose"></AIDialog>
    </div>
  </div>
</template>

<script>
import AIDialog from "./Template/AIDialog.vue";
import DateTitle from "./Template/DateTitle.vue";
import SortDayList from "./Template/SortDayList.vue";
export default {
  name: "FlightDate",
  components: {
    DateTitle,
    SortDayList,
    AIDialog,
  },
  data() {
    return {
      showAIDialog: false,
    };
  },
  methods: {
    handleClose() {
      this.showAIDialog = false;
    },
    openAI() {
      this.showAIDialog = true;
    }
  }
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
  }
}
</style>