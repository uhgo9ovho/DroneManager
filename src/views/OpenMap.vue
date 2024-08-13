<template>
  <div class="open-map">
    <!-- 地图组件 -->
    <map-container></map-container>
    <!-- 编辑框 -->
    <create-task></create-task>
    <!-- 排期设置 -->
    <setting-date></setting-date>
  </div>
</template>

<script>
import CreateTask from "../components/CreateTask.vue";
import MapContainer from "../components/MapContainer.vue";
import SettingDate from '../components/SettingDate.vue';
export default {
  name: "OpenMap",
  components: {
    MapContainer,
    CreateTask,
    SettingDate
  },
};
</script>

<style lang="scss">
.open-map {
  position: relative;
}
</style>