<template>
  <div class="org">
    <div class="back-icon el-icon-back"></div>
    <div class="title">{{ title }}</div>
    <div class="tip">{{ tip }}</div>
    <div class="un-org" v-if="!hasOrg">
      <div class="el-icon-s-custom tx"></div>
      <div class="title-tip">
        <div class="title-item">加入企业或组织</div>
        <div class="tip">
          通过企业二维码、企业邀请码等方式 加入企业或组织，与同事协同工作
        </div>
      </div>
      <div class="icon el-icon-arrow-right"></div>
    </div>
    <div v-else class="list-box">
      <div
        class="org-list"
        v-for="(item, index) in orgList"
        :key="index"
        @click="selectOrg(item)"
      >
        <div class="tx">{{ item.orgName.slice(0, 2) }}</div>
        <div class="title-tip">
          <div class="title-item">{{ item.orgName }}</div>
          <div class="tip">{{ item.ad }}</div>
        </div>
        <div class="icon el-icon-arrow-right"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDepartmentList } from "@/api/user.js";
import { getInfo } from "@/api/login.js";
import Cookies from "js-cookie";
export default {
  name: "OrgList",
  data() {
    return {
      hasOrg: true,
      orgList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  computed: {
    title() {
      if (this.hasOrg) return "你可以进入以下组织";
      return "你暂无可进入的组织";
    },
    tip() {
      if (this.hasOrg) return "";
      return "**** 暂未绑定任何企业或组织，你可以申请加入企业或组织";
    },
  },
  methods: {
    getOrgList() {
      //获取组织列表
      getDepartmentList(this.page).then((res) => {
        if (res.code === 200) {
          this.orgList = res.rows;
        }
      });
    },
    selectOrg(row) {
      console.log(row);
      
      getInfo().then((res) => {
        if (res.code === 200) {
          this.$store.commit("SET_ORG_ID", row.orgId);
          this.$store.commit("SET_ORG_WORKSPACEID", row.workspaceId);
          this.$router.push({ path: this.redirect || "/" }).catch(() => {});
          let userInfo = res.user;
          Cookies.set('user', JSON.stringify(userInfo), { expires: 30 });
          Cookies.set('orgName', row.orgName);
        }
      });
    },
  },
  mounted() {
    this.getOrgList();
  },
};
</script>

<style lang="scss">
.org {
  border-radius: 6px;
  background: hsla(0, 0%, 100%, 0.7490196078431373);
  width: 400px;
  height: 360px;
  padding: 25px 25px 5px 25px;
  .back-icon {
    width: 40px;
    height: 40px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    cursor: pointer;
  }
  .title {
    font-weight: bold;
    font-size: 22px;
    color: #000;
  }
  .tip {
    text-align: center;
    color: #747377;
  }
  .un-org,
  .org-list {
    width: 350px;
    height: 100px;
    background-color: #ecdfec;
    border-radius: 20px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    cursor: pointer;
    .tx {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #306fdb;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
    .title-tip {
      width: 200px;
      text-align: left;
      .title-item {
        color: #000;
      }
      .tip {
        font-size: 12px;
        text-align: left;
      }
    }
  }
  .list-box {
    max-height: 200px;
    width: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>