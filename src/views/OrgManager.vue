<template>
  <div class="org-manager">
    <div class="top">
      <div class="left">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="组织" name="org"></el-tab-pane>
          <el-tab-pane label="角色" name="role"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="right" v-if="activeName == 'org'">
        <div class="search-list-box">
          <el-select
            v-model="searchName"
            placeholder="请选择"
            @change="handleSearchNameChange"
          >
            <el-option
              v-for="item in searchListName"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="input-box" :class="{ 'lang-search-box': checked }">
          <el-input
            clearable
            prefix-icon="el-icon-search"
            :placeholder="`${checkedTip}`"
            v-model="searchValue"
            @focus="focus"
            @blur="blur"
            @input="handleInput"
          ></el-input>
        </div>
        <div class="add-btn">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
            >新增</el-button
          >
        </div>
      </div>
      <div class="right" v-else>
        <div class="create-task-btn">
          <el-button round icon="el-icon-plus" @click="addOrgRole"
            >添加角色</el-button
          >
        </div>
      </div>
    </div>
    <div class="list-box">
      <org-table
        ref="orgTable"
        v-if="activeName == 'org'"
        :dialogVisible="dialogVisible"
        @updateDialogVisible="updateDialogVisible"
        v-permissions="'mngSide:org'"
      ></org-table>
      <role-table v-if="activeName == 'role'" ref="role" v-permissions="'wrj:role:list'" model="orgRole"></role-table>
    </div>
  </div>
</template>

<script>
import OrgTable from "@/components/OrgTable.vue";
import RoleTable from '@/components/RoleTable.vue'
export default {
  name: "OrgManager",
  components: {
    OrgTable,
    RoleTable
  },
  data() {
    return {
      permissions: JSON.parse(localStorage.getItem("userPermission")),
      activeName: "org",
      dialogVisible: false,
      title: "新增组织",
      checked: false,
      searchName: 1,
      searchValue: "",
      searchListName: [
        {
          id: 1,
          name: "组织或项目名称",
        },
        {
          id: 2,
          name: "负责人",
        },
      ],
    };
  },
  computed: {
    placeholderTitle() {
      switch (this.searchName) {
        case 1:
          return "请输入组织或项目名称";
        case 2:
          return "请输入负责人";
        case 3:
          return "请输入绑定码";
      }
    },
    checkedTip() {
      if (this.checked) {
        return this.placeholderTitle;
      }
      return "搜索";
    },
  },
  methods: {
    addOrgRole() {
      this.$refs.role.title = '添加角色';
      this.$refs.role.dialogVisible = true;
    },
    handleClick() {
      this.searchName = "";
    },
    focus() {
      this.checked = true;
    },
    blur() {
      this.checked = false;
    },
    handleAdd() {
      this.$refs.orgTable.title = "新增组织";
      this.dialogVisible = true;
    },
    updateDialogVisible(dialogVisible) {
      this.dialogVisible = dialogVisible;
    },
    handleInput(val) {
      this.$refs.orgTable.searchValue = val;
    },
    handleSearchNameChange(val) {
      this.$refs.orgTable.searchValue = "";
      this.searchValue = "";
      this.$refs.orgTable.searchType = val;
    },
  },
};
</script>

<style lang="scss">
.org-manager {
  height: calc(100vh - 72px);
  margin-top: 20px;
  padding-right: 26px;
  padding-left: 32px;
  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .left {
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
    }
    .right {
      .create-task-btn {
        .el-button {
          background-color: #000;
          color: #fff;
          border-color: #000;
        }
      }
      display: flex;
      .search-list-box {
        margin-right: 20px;
      }
      .input-box {
        width: 100px;
        transition: width 0.5s;
      }
      .lang-search-box {
        width: 360px;
      }
      .add-btn {
        margin-left: 20px;
      }
      .add-btn,
      .export-btn {
        width: 100px;
        height: 40px;
        color: rgb(255, 255, 255);
        font-weight: 500;
        border-radius: 50px;
        border: none;
        font-size: 14px;
        text-align: center;
        line-height: 40px;
      }
    }
  }
  .list-box {
    flex: 1;
  }
}
</style>
<style lang="scss">
.org-manager {
  .top {
    .el-select {
      width: 120px;
    }
    .el-input {
      border-radius: 20px;
      width: 100%;
      .el-input__inner {
        border-radius: 20px;
        width: 100%;
        border-color: #dcdfe6;
      }
    }
    .right {
      .el-button {
        width: 100%;
        height: 100%;
        border-radius: 50px;
        background-color: #000;
        border-color: #000;
      }
    }
  }
}
</style>
