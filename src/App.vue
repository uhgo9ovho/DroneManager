<template>
  <div id="app" :class="{ bulr: addFilter }">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getToken } from "@/utils/auth";
import WebSocketClient from "@/utils/websocket.js";
import Cookies from "js-cookie";
export default {
  name: "App",
  computed: {
    ...mapState("app", ["addFilter"]),
  },
  mounted() {
    document.title = localStorage.getItem("platformName")
      ? localStorage.getItem("platformName")
      : "城市空天智慧管理平台";
  },
  methods: {

  },
  metaInfo() {
    return {
      title:
        this.$store.state.settings.dynamicTitle &&
        this.$store.state.settings.title,
      titleTemplate: (title) => {
        return title
          ? `${title} - ${process.env.VUE_APP_TITLE}`
          : process.env.VUE_APP_TITLE;
      },
    };
  },
};
</script>
<style scoped>
#app .theme-picker {
  display: none;
}
</style>
