<template>
  <div class="task-grid">
    <div class="task-container">
      <div class="task_map">
        <MapContainer></MapContainer>
        <div v-if="detailsShow">
          <div class="task_name">{{ taskName }}</div>
          <div class="task_airline-list">
            <div class="airline-list-warp">
              <el-switch v-model="value"></el-switch>
              <div class="count">共 1 条航线</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 飞行任务info -->
      <div v-if="detailsShow">
        <FilghtTaskInfo
          @closeDialog="closeDialog"
          :taskDetails="taskDetails"
          :taskName="taskName"
          :totalLine="totalLine"
          :note="note"
        ></FilghtTaskInfo>
      </div>
      <!-- 飞行info -->
      <div v-if="filghtShow">
        <FilghtInfo @closeDialog="closeDialog"></FilghtInfo>
      </div>
    </div>
  </div>
</template>

<script>
import MapContainer from "../MapContainer.vue";
import FilghtTaskInfo from "./FilghtTaskInfo.vue";
import FilghtInfo from "./FilgtInfo.vue";
import { taskInfoApI } from "@/api/TaskManager.js";
export default {
  name: "TaskGrid",
  props: {
    taskId: {
      type: Number,
      default: 0,
    },
    detailsShow: {
      type: Boolean,
      default: false,
    },
    filghtShow: {
      type: Boolean,
      default: false,
    },
    taskDetails: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    MapContainer,
    FilghtTaskInfo,
    FilghtInfo,
  },
  data() {
    return {
      value: false,
      totalLine: 0,
      taskName: "",
      note: "",
    };
  },
  created() {
    if (this.detailsShow) {
      taskInfoApI(this.taskId).then((res) => {
        if (res.code === 200) {
          this.totalLine = res.data.airlineNumber;
          this.note = res.data.note;
          this.taskName = res.data.taskName;
        }
      });
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>

<style lang="scss">
.task-grid {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgba(29, 29, 31, 0.8);
  backdrop-filter: blur(5px);
  z-index: 1001;
  .task-container {
    width: 1280px;
    height: 720px;
    border-radius: 12px;
    display: flex;
    .task_map {
      width: 920px;
      height: 100%;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 24px 0px;
      border-radius: 12px 0 0 12px;
      position: relative;
      .task_name {
        height: 28px;
        background: rgba(255, 255, 255, 0.85);
        box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 6px 0px;
        border-radius: 8px;
        filter: blur(0px);
        position: absolute;
        left: 24px;
        bottom: 60px;
        font-weight: 400;
        font-size: 13px;
        line-height: 28px;
        padding: 0px 12px;
      }
      .task_airline-list {
        position: absolute;
        bottom: 0px;
        width: 920px;
        height: 48px;
        background: rgba(255, 255, 255, 0.65);
        border-radius: 0px 0px 0px 12px;
        padding: 0px 24px;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        .airline-list-warp {
          width: 100%;
          display: flex;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
          flex-direction: row;
          -webkit-box-align: center;
          align-items: center;
          caret-color: transparent;
          white-space: nowrap;
          overflow: hidden;
          .count {
            font-weight: 400;
            font-size: 12px;
            color: rgb(110, 110, 115);
            width: 110px;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>