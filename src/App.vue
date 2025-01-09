<template>
  <div id="app" :class="{'bulr': addFilter}">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { getPermissionListAPI } from '@/api/user';
export default {
  name: "App",
  computed: {
    ...mapState('app', ['addFilter'])
  },
  mounted() {
    this.getPermissionList()
    document.title = localStorage.getItem("platformName") ? localStorage.getItem("platformName") : "城市空天智慧管理平台";
  },
  methods: {
    ...mapActions("droneStatus", ["getAirPostInfo"]),
    ...mapActions('app', ['GetPermissionsList']),
    getPermissionList() {
      const managerPermission = getPermissionListAPI(3);  //管理
      const screenPermission = getPermissionListAPI(2); //大屏
      const programsPermission = getPermissionListAPI(4); //小程序
      Promise.all([managerPermission, screenPermission, programsPermission]).then(values => {
        this.GetPermissionsList(values);
      })
    }
  },
  metaInfo() {
    return {
      title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
      titleTemplate: title => {
        return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
      }
    }
  }
};
</script>
<style scoped>
#app .theme-picker {
  display: none;
}
</style>
