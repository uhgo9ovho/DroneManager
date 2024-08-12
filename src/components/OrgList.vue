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
        <div class="org-list" v-for="(item,index) in orgList" :key="index">
      <div class="tx">西</div>
      <div class="title-tip">
        <div class="title-item">西安集贤工业园区</div>
        <div class="tip">陕西省/西安市/周至县</div>
      </div>
      <div class="icon el-icon-arrow-right"></div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrgList",
  data() {
    return {
      hasOrg: true,
      orgList: [1,2,3]
    };
  },
  computed: {
    title() {
      if (this.hasOrg) return "你可以进入以下组织";
      return "你暂无可进入的组织";
    },
    tip() {
      if (this.hasOrg) return "**** 已在以下企业或组织绑定了账号";
      return "**** 暂未绑定任何企业或组织，你可以申请加入企业或组织";
    },
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
  .un-org,.org-list {
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