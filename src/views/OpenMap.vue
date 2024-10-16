<template>
  <div class="open-map">
    <!-- 地图组件 -->
    <map-container></map-container>
    <!-- 编辑框 -->
    <create-task
      :starttime="starttime"
      :endtime="endtime"
      :frequencyValue="frequencyValue"
      :inspectionValue="inspectionValue"
      :settingInfo="settingInfo"
      :valArr="valArr"
      @openSettingDate="openSettingDate"
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
  </div>
</template>

<script>
import CreateTask from "../components/CreateTask.vue";
import MapContainer from "../components/MapContainer.vue";
import SettingDate from "../components/SettingDate.vue";
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
      inspectionValue: 0
    };
  },
  methods: {
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
  },
};
</script>

<style lang="scss">
.open-map {
  position: relative;
  height: calc(100vh - 52px);
}
</style>