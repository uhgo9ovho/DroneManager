<template>
  <div class="flight">
    <div class="top">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="飞行任务" name="first"> </el-tab-pane>
        <el-tab-pane label="飞行排期" name="second"></el-tab-pane>
        <el-tab-pane label="飞行记录" name="third"></el-tab-pane>
      </el-tabs>
      <div class="operate-box">
        <div class="serach-box" :class="{ 'lang-search-box': checked }">
          <el-input
            prefix-icon="el-icon-search"
            :placeholder="checkedTip"
            @focus="focus"
            @blur="blur"
            v-model="searchText"
            clearable
          ></el-input>
        </div>
        <div class="create-task-btn">
          <el-button round icon="el-icon-plus">新建任务</el-button>
        </div>
      </div>
    </div>
    <div class="task-list-grid">
      <common-table></common-table>
    </div>
  </div>
</template>

<script>
import CommonTable from '../components/CommonTable.vue';
export default {
  name: "Flight",
  data() {
    return {
      activeName: "first",
      checked: false,
      searchText: ""
    };
  },
  components: {
    CommonTable
  },
  computed: {
    checkedTip() {
      if (this.checked) {
        return "搜索任务名称、机场、创建人";
      }
      return "搜索";
    },
  },
  methods: {
    focus() {
      this.checked = true;
    },
    blur() {
      this.checked = false;
    },
    handleClick() {},
  },
};
</script>

<style lang="scss">
.flight {
  margin-top: 20px;
  padding-right: 20px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-tabs {
    .el-tabs__item {
      font-size: 16px;
      &:hover {
        color: #000;
      }
    }
    .el-tabs__nav-wrap::after {
      display: none;
    }
    .el-tabs__active-bar {
      background-color: #000;
    }
    .is-active {
      color: #000;
    }
  }
  .operate-box {
    display: flex;
    .serach-box {
      margin-right: 20px;
      width: 100px;
      transition: width 0.5s;
      .el-input {
        border-radius: 20px;
        width: 100%;
        .el-input__inner {
          border-radius: 20px;
          width: 100%;
          border-color: #dcdfe6;
        }
      }
    }
    .lang-search-box {
      width: 360px;
    }
    .create-task-btn {
      .el-button {
        background-color: #000;
        color: #fff;
        border-color: #000;
      }
    }
  }
}
</style>