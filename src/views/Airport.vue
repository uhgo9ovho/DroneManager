<template>
  <div class="air-port" v-if="showMap">
    <map-container
      :longitude="longitude"
      :latitude="latitude"
      @toVideoMap="toVideoMap"
    ></map-container>
  </div>
</template>

<script>
import { deviceInfoAPI } from "@/api/TaskManager.js";
import MapContainer from "../components/MapContainer.vue";
import { mapActions } from 'vuex'
export default {
  name: "AirPort",
  data() {
    return {
      longitude: 0,
      latitude: 0,
      showMap: false,
    };
  },
  components: {
    MapContainer,
  },
  methods: {
    ...mapActions('droneStatus', ['getDeviceSN']),
    toVideoMap() {
      this.$router.push("/videoMap");
    },
    getDeviceInfo() {
      const params = {
        orgId: localStorage.getItem("org_id"),
        deviceType: 1,
      };
      deviceInfoAPI(params)
        .then((res) => {
          this.showMap = false;
          if (res.code === 200) {
            this.getDeviceSN(res.rows[0].deviceId)
            let lonlatArr = res.rows[0].location.split(",");
            this.longitude = +lonlatArr[0];
            this.latitude = +lonlatArr[1];
            this.showMap = true;
          }
        })
        .catch((err) => {
          this.showMap = false;
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