<template>
  <div class="open-map">
    <!-- 地图组件 -->
    <map-container></map-container>
    <!-- 编辑框 -->
    <create-task :settingInfo="settingInfo" @openSettingDate="openSettingDate"></create-task>
    <!-- 排期设置 -->
    <div v-if="showSetting">
      <setting-date @closeSettingDate="closeSettingDate" @updateFormatInfo="updateFormatInfo"></setting-date>
    </div>
  </div>
</template>

<script>
import CreateTask from "../components/CreateTask.vue";
import MapContainer from "../components/MapContainer.vue";
import SettingDate from "../components/SettingDate.vue";
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
      settingInfo: ""
    };
  },
  methods: {
    openSettingDate() {
      this.showSetting = true;
    },
    closeSettingDate() {
      this.showSetting = false;
    },
    updateFormatInfo(info) {
      this.settingInfo = info;
    }
  },
};
</script>

<style lang="scss">
.open-map {
  position: relative;
  height: calc(100vh - 52px);
}
</style>