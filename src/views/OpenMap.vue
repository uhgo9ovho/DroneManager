<template>
  <div class="open-map">
    <!-- 地图组件 -->
    <div v-if="showMap" class="map-box">
      <map-container
        ref="AMAP"
        :latitude="latitude"
        :longitude="longitude"
        :coordinates="coordinates"
      ></map-container>
    </div>

    <!-- 编辑框 -->
    <create-task
      :starttime="starttime"
      :endtime="endtime"
      :frequencyValue="frequencyValue"
      :inspectionValue="inspectionValue"
      :settingInfo="settingInfo"
      :length="length"
      :valArr="valArr"
      @openSettingDate="openSettingDate"
      @changeDownContentShow="changeDownContentShow"
      @clearLine="clearLine"
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
import { mapState, mapMutations, mapActions } from "vuex";
import { wgs84ToGcj02 } from "@/utils/CoordinateTransformation.js";
import { getPlotAPI } from "@/api/TaskManager.js";
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
      endtime: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`,
      starttime: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`,
      valArr: [],
      inspectionValue: 0,
      isShow: false,
      showMap: false,
      longitude: 0,
      latitude: 0,
      coordinates: null,
      length: 0
    };
  },
  computed: {
    ...mapState("changeStatus", ["isDrawText"]),
    ...mapState("droneStatus", ["airPostInfo"]),
  },
  mounted() {
    this.getDeviceInfo();
  },
  watch: {
    isShow(val) {
      if (val) {
        //true是绘制航线
        this.$refs.createTask.clearFilesFn();
      } else {
        //false是上传航线
        this.$refs.AMAP.removePolyline();
      }
    },
  },
  methods: {
    ...mapMutations("changeStatus", ["CHANGE_DROC_STATUS", "CLEAR_POINTSLIST"]),
    ...mapActions("droneStatus", ["fetchAirPostInfo"]),
    changeDownContentShow(flag) {
      this.isShow = flag;
    },
    async getDeviceInfo() {
      this.showMap = false;

      if (!this.airPostInfo) {
        await this.fetchAirPostInfo();
      }
      let lonlatArr = this.airPostInfo.location.split(",");
      this.longitude = +lonlatArr[0];
      this.latitude = +lonlatArr[1];
      this.showMap = true;
      this.getPlotInfo();
    },
    getPlotInfo() {
      getPlotAPI().then((res) => {
        if (res.code === 200) {
          const arr = JSON.parse(res.rows[0].coordinates);
          this.coordinates = arr.map((it) =>
            wgs84ToGcj02(it.lon, it.lat)
          );
        }
      });
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
    updateFormatInfo(info, length) {
      this.settingInfo = info;
      
      this.length = length;
    },
    schedulingType(val) {
      this.inspectionValue = val;
    },
    clearLine(text) {
      this.startDown(text);
    },
    startDown(text) {
      if (text == "取消") {
        //取消绘制
        this.$refs.AMAP.removePolyline();
        this.CLEAR_POINTSLIST()
      } else if (text == "重绘") {
        //清除当前绘制重新画
        this.$refs.AMAP.resetPolyline();
        this.CLEAR_POINTSLIST()
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
  .map-box {
    width: 100%;
    height: 100%;
  }
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