<template>
  <div class="air-port" v-if="showMap">
    <map-container
      :longitude="longitude"
      :latitude="latitude"
      @toVideoMap="toVideoMap"
      :coordinates="coordinates"
    ></map-container>
  </div>
</template>

<script>
import { getPlotAPI } from "@/api/TaskManager.js";
import MapContainer from "../components/MapContainer.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "AirPort",
  data() {
    return {
      longitude: 0,
      latitude: 0,
      showMap: false,
      coordinates: null,
    };
  },
  components: {
    MapContainer,
  },
  computed: {
    ...mapState("droneStatus", ["airPostInfo"]),
  },
  methods: {
    ...mapActions("droneStatus", ["getDeviceSN", "fetchAirPostInfo"]),
    toVideoMap() {
      this.$router.push("/videoMap");
    },
    async getDeviceInfo() {
      this.showMap = false;
      if (!this.airPostInfo) {
        await this.fetchAirPostInfo();
      }
      this.getDeviceSN(this.airPostInfo.deviceId);
      let lonlatArr = this.airPostInfo.location.split(",");
      this.longitude = +lonlatArr[0];
      this.latitude = +lonlatArr[1];
      this.showMap = true;
      this.getPlotInfo();
      
    },
    getPlotInfo() {
      getPlotAPI().then((res) => {
        if (res.code === 200) {
          this.coordinates = JSON.parse(res.rows[0].coordinates);
        }
      });
    },
  },
  mounted() {
    this.getDeviceInfo();
  },
};
</script>

<style lang="scss">
.air-port {
  width: 100%;
  height: calc(100vh - 52px);
}
</style>