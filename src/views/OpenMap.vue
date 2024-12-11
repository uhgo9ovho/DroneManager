<template>
  <div class="open-map">
    <!-- 地图组件 -->
    <map-container ref="AMAP"></map-container>
    <!-- 编辑框 -->
    <create-task
      :starttime="starttime"
      :endtime="endtime"
      :frequencyValue="frequencyValue"
      :inspectionValue="inspectionValue"
      :settingInfo="settingInfo"
      :valArr="valArr"
      @openSettingDate="openSettingDate"
      @changeDownContentShow="changeDownContentShow"
      ref="createTask"
    ></create-task>
    <!-- 排期设置 -->
    <div v-if="showSetting">
      <setting-date
        @startTime="startTime"
        @endTime="endTime"
        @frequencyChange="frequencyChange"
        @schedulingType="schedulingType"
        @closeSettingDate="closeSettingDate"
        @updateFormatInfo="updateFormatInfo"
        @dateArrays="dateArrays"
      ></setting-date>
    </div>
    <!-- 绘制航线按钮 -->
    <div class="downContent" @click="startDown(isDrawText)" v-if="isShow">
      <i class="el-icon-edit"></i>
      <span v-if="isDrawText">{{ isDrawText }}</span>
    </div>
  </div>
</template>

<script>
import CreateTask from "../components/CreateTask.vue";
import MapContainer from "../components/MapContainer.vue";
import SettingDate from "../components/SettingDate.vue";
import { mapState, mapMutations } from "vuex";
const now = new Date();
export default {
  name: "OpenMap",
  components: {
    MapContainer,
    CreateTask,
    SettingDate,
  },
  data() {
    return {
      showSetting: false,
      settingInfo: "",
      frequencyValue: 0,
      endtime: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      starttime: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      valArr: [],
      inspectionValue: 0,
      isShow: false
    };
  },
  computed: {
    ...mapState("changeStatus", ["isDrawText"]),
  },
  methods: {
    ...mapMutations( 'changeStatus',['CHANGE_DROC_STATUS']),
    changeDownContentShow(flag) {
      this.isShow = flag;
    },
    dateArrays(valArr) {
      this.valArr = valArr;
    },
    endTime(val) {
      this.endtime = val;
    },
    startTime(val) {
      this.starttime = val;
    },
    frequencyChange(val) {
      this.frequencyValue = val;
    },
    openSettingDate() {
      this.showSetting = true;
    },
    closeSettingDate() {
      this.showSetting = false;
    },
    updateFormatInfo(info) {
      this.settingInfo = info;
    },
    schedulingType(val) {
      this.inspectionValue = val;
    },
    startDown(text) {
      if (text == "取消") {
        //取消绘制
        this.$refs.AMAP.removePolyline();
      } else if (text == "重绘") {
        //清除当前绘制重新画
        this.$refs.AMAP.resetPolyline();
      } else {
        this.$refs.AMAP.renderPolyline();
      }
    },
  },
};
</script>

<style lang="scss">
.open-map {
  position: relative;
  height: calc(100vh - 52px);
  .downContent {
    position: absolute;
    left: calc(50% - 65px);
    bottom: 40px;
    align-items: center;
    transform: translateX(-50%);
    background-color: #0271e3;
    width: 148px;
    height: 44px;
    border-radius: 24px;
    box-shadow: 0 10px 16px -6px rgba(0, 0, 0, 0.25098039215686274);
    border: 2px solid #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    cursor: pointer;
    i {
      font-size: 24px;
      color: #fff;
    }
    span {
      font-family: PingFangSC-Medium;
      font-weight: 500;
      font-size: 14px;
      color: #fff;
      letter-spacing: 0;
      text-align: center;
      margin-left: 8px;
    }
  }
}
</style>