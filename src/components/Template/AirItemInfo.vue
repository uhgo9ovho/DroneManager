<template>
  <div class="task-wait-card" :class="{ shikuang: info.schedulingStatus == 1 }">
    <div class="ai-box" v-if="info.aiHosting == 1">
      <img :src="AIImage" alt=""/>
    </div>
    <div style="flex: 1.7 1 0%">
      <div class="task-time">{{ info.formatTime }} 计划起飞</div>
      <div class="task-name2">{{ info.lineName }}</div>
    </div>
    <i class="el-icon-info" v-if="info.scheduledType === 1"></i>
    <div class="task-num">
      {{ info.schedule_text }}
      <span class="task-num-error">{{
          info.scheduledType | filterSchedulingType
        }}</span>
    </div>
    <!-- 添加排期状态显示 -->
    <div class="scheduling-status">
      {{ getSchedulingStatus(info.schedulingStatus) }}
    </div>
    <div class="task-change" :class="[info.operator ? '' : 'hidden']">
      排期调整({{ info.createBy }})
    </div>
    <div
      class="task-btn"
      @click="takeOffBtn"
      v-if="isFutureOrToday"

      v-permissions="'wurenji:scheduling:fly'"
    >
      <!-- 待执行和已执行 -->
      <div>起飞</div>
      <div
        class="iconfont el-icon-guijifeihang"
        style="font-size: 12px; margin-left: 5px"
      ></div>
    </div>
    <div
      class="task-btn2"
      v-if="info.schedulingStatus === 1"
      @click="toVideoMap"
      v-permissions="'wurenji:scheduling:fly'"
    >
      <!-- 正在飞行 -->
      <div>实况</div>
      <div
        class="iconfont el-icon-jiankong"
        style="font-size: 16px; margin-left: 5px"
      ></div>
    </div>
    <div class="task-menu">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <i class="el-icon-more"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command="details"
            v-permissions="'wurenji:scheduling:query'"
          >查看详情
          </el-dropdown-item
          >
          <el-dropdown-item
            command="delete"
            v-if="isShowAddBtn || isToday"
            v-permissions="'wurenji:scheduling:remove'"
          >删除
          </el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 起飞和删除弹窗 -->
    <div v-if="dialogVisible">
      <TakeOffDialog
        @handleClose="handleClose"
        :dialogVisible="dialogVisible"
        :isDel="isDel"
        :info="info"
        @updateData="updateData"
      ></TakeOffDialog>
    </div>
  </div>
</template>

<script>
import AIImage from '@/assets/images/AI.png'
import TakeOffDialog from './TakeOffDialog.vue'
import { airLineInfoAPI, taskInfoApI } from '@/api/TaskManager'

export default {
  name: 'AirItemInfo',
  components: {
    TakeOffDialog
  },
  props: {
    info: {
      type: Object,
      default: () => {
      }
    },
    dateSHowBtn: {
      type: Boolean,
      default: false
    },
    isShowAddBtn: {
      type: Boolean,
      default: false
    },
    isToday: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      isDel: false,
      AIImage: AIImage
    }
  },
  filters: {
    filterSchedulingType(val) {
      switch (val) {
        case 0:
          return ''
        case 1:
          return '手动新增'
        case 3:
          return ''
        default:
          break
      }
    }
  },
  methods: {
    // 将排期状态转换为对应文本
    getSchedulingStatus(status) {
      switch (status) {
        case 0:
          return '待执行'
        case 1:
          return '已执行'
        case 2:
          return '起飞失败'
        case 3:
          return '飞行完成'
        case 4:
          return '飞行任务失败'
        case 5:
          return '未飞行'
        default:
          return '未知状态'
      }
    },
    toVideoMap() {
      this.$router.push('/videoMap')
    },
    updateData() {
      this.$emit('updateData')
    },
    handleCommand(command) {
      if (command == 'details') {
        taskInfoApI(this.info.taskId).then((res) => {
          if (res.code === 200) {
            this.$emit('openDialog', res.data)
          }
        })
      } else {
        //删除
        this.dialogVisible = true
        this.isDel = true
      }
    },
    takeOffBtn() {
      this.dialogVisible = true
      this.isDel = false
      console.log(this.info)
    },
    handleClose() {
      this.dialogVisible = false
    }
  },
  computed: {
    isFutureOrToday() {
      if (!this.info.scheduledTime) return false

      const scheduledTime = new Date(this.info.scheduledTime).getTime()
      const scheduledEndTime = scheduledTime + 60 * 60 * 1000 // 任务时间 + 1 小时
      const now = new Date().getTime()

      // 获取当天 00:00:00 的时间戳
      const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
      const todayEnd = todayStart + 24 * 60 * 60 * 1000 - 1

      return (scheduledTime >= now && scheduledTime >= todayStart && scheduledTime <= todayEnd) || (scheduledEndTime >= now && scheduledTime <= now)
    }
  }
}
</script>

<style lang="scss">
.shikuang {
  background: #000 !important;
  color: #fff !important;
}

.task-wait-card {
  flex: 1;
  height: 60px;
  margin: 2px 0;
  border-radius: 36px;
  background: rgba(226, 226, 228, 0.7);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 48px;
  color: #6e6e73;

  .ai-box {
    width: 30px;
    height: 30px;
    margin-right: 30px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .task-time {
    font-size: 12px;
    font-weight: 500;
  }

  .task-name2 {
    font-weight: 500;
    font-size: 14px;
    margin-top: 4px;
  }

  .task-num {
    font-weight: 400;
    font-size: 13px;
    line-height: 13px;
    margin-left: 6px;
    flex: 1.4;

    .task-num-error {
      font-weight: 400;
      font-size: 13px;
      line-height: 13px;
      margin-left: 6px;
      color: #e30000;
    }
  }

  .task-btn {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-right: 30px;
    width: 84px;
    height: 32px;
    border-radius: 16px;
    background-color: #fff;
    color: #0271e3;
  }

  .task-btn2 {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-right: 30px;
    width: 84px;
    height: 32px;
    border-radius: 16px;
    background-color: #000;
    color: #fff;
  }

  .task-change {
    font-weight: 400;
    font-size: 13px;
    line-height: 13px;
    flex: 0.8;
  }

  .hidden {
    visibility: hidden;
  }

  .task-menu {
    color: #0271e3;
    font-size: 22px;
    padding: 20px;
    cursor: pointer;

    .el-dropdown-link {
      width: 24px;
      height: 24px;
      color: #0271e3;
      border-radius: 4px;
      font-size: 16px;
      padding: 4px;
      background: transparent;
    }
  }
}
</style>
