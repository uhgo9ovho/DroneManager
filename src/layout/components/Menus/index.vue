<template>
  <div class="menus">
    <div
      class="menus-items"
      :class="{ active: item.active }"
      v-for="(item, index) in routeList"
      :key="index"
      @click="toPath(item)"
      v-show="!item.hidden && permission(item.permissions) || item.permissions[0] == '*:*:*'"
    >
      <i :class="item.meta.icon" class="iconfont"></i>
      <div class="item-title">{{ item.meta.title }}</div>
    </div>
  </div>
</template>

<script>
import { constantRoutes } from "@/router";
import { mapState } from "vuex";
export default {
  name: "Menus",
  data() {
    return {
      routeList: [],
    };
  },
  computed: {
    ...mapState("app", ["managerPermissions"]),
    permission() {
      return function (item) {
        if (this.managerPermissions.length) {
          // const allMenuPermissions = this.managerPermissions.map(it => it.perms);
          const userPermissions = JSON.parse(
            localStorage.getItem("userPermission")
          );
          if (userPermissions[0] == "*:*:*") return true;
          if (userPermissions.includes(item[0])) {
            return true;
          } else {
            return false;
          }
        } else {
          return false
        }
      };
    },
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
    i {
      font-size: 18px;
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