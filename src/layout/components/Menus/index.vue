<template>
  <div class="menus">
    <div
      class="menus-items"
      :class="{ active: item.active }"
      v-for="(item, index) in routeList"
      :key="index"
      @click="toPath(item)"
    >
      <i :class="item.meta.icon" class="iconfont"></i>
      <div class="item-title">{{ item.meta.title }}</div>
    </div>
  </div>
</template>

<script>
import { constantRoutes } from "@/router";
export default {
  name: "Menus",
  data() {
    return {
      routeList: [],
    };
  },
  computed: {

  },
  methods: {
    toPath(item) {
      this.$router.push(item.path);
    },
  },
  mounted() {
    this.routeList = constantRoutes.filter((item, index) => {
      return !item.hidden;
    })[0].children;
  },
};
</script>

<style lang="scss">
.menus {
  transition: width 0.28s;
  width: 128px !important;
  height: calc(100% - 52px);
  position: fixed;
  top: 52px;
  padding-top: 28px;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: auto;
  background-color: #fff;
  box-shadow: 10px 0 5px -2px rgba(0, 0, 0, 0.5);
  .menus-items {
    text-align: center;
    font-size: 14px;
    margin: 0 auto;
    width: 108px;
    height: 72px;
    margin-bottom: 8px;
    cursor: pointer;
    padding-top: 12px;
    .item-title {
      margin-top: 4px;
    }
  }
  .active {
    background-color: #f5f5f6;
    border-radius: 12px;
    .item-title {
      color: #0271e3;
    }
    i {
      color: #0271e3;
    }
  }
}
</style>