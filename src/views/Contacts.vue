<template>
  <div class="contacts">
    <div class="top">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="部门" name="department"> </el-tab-pane>
        <el-tab-pane label="成员" name="member"></el-tab-pane>
      </el-tabs>
      <div class="operate-box">
        <div
          class="serach-box"
          :class="{ 'lang-search-box': checked }"
          v-if="currentTab == 'department' || currentTab == 'member'"
        >
          <el-input
            prefix-icon="el-icon-search"
            :placeholder="checkedTip"
            @focus="focus"
            @blur="blur"
            v-model="searchText"
            clearable
          ></el-input>
        </div>
        <div class="create-task-btn" v-if="currentTab == 'department'">
          <el-button round icon="el-icon-plus" @click="addDepartment"
            >添加部门</el-button
          >
        </div>
        <div class="btn-group" v-if="currentTab == 'member'">
          <el-dropdown style="margin-right: 15px">
            <el-button round
              >批量操作<i class="el-icon-caret-bottom el-icon--right"></i
            ></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click="BatchImport">批量导入</el-dropdown-item>
              <el-dropdown-item>调整部门</el-dropdown-item>
              <el-dropdown-item>批量删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="handleCommand">
            <el-button
              round
              icon="el-icon-plus"
              style="background-color: #000; color: #fff"
              >添加成员<i class="el-icon-caret-bottom el-icon--right"></i
            ></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="manually">手动添加</el-dropdown-item>
              <el-dropdown-item command="invite">邀请添加</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="task-list-grid" v-if="currentTab == 'department'">
      <!-- <filght-table></filght-table> -->
      <contacts-table ref="contactsRef"></contacts-table>
    </div>
    <div class="flight-log" v-if="currentTab == 'member'">
      <member-table @editMember="editMember" ref="member"></member-table>
    </div>
    <div class="flight-date" v-if="currentTab == 'role'">飞行排期</div>
    <!-- 手动添加dialog组件 -->
    <div v-if="manuallyVisible">
      <ManuallyAddEditDialog
        :manuallyVisible="manuallyVisible"
        @menuallyClose="menuallyClose"
        :title="title"
        :itemRow="itemRow"
        @updateList="updateList"
      ></ManuallyAddEditDialog>
    </div>
  </div>
</template>

<script>
import ContactsTable from "../components/ContactsTable.vue";
import MemberTable from "../components/MemberTable.vue";
import ManuallyAddEditDialog from "../components/Template/ManuallyAddEditDialog.vue";
export default {
  name: "Contacts",
  data() {
    return {
      activeName: "department",
      checked: false,
      searchText: "",
      manuallyVisible: false,
      currentTab: "department",
      title: "",
      itemRow: null,
    };
  },
  components: {
    ContactsTable,
    MemberTable,
    ManuallyAddEditDialog,
  },
  computed: {
    checkedTip() {
      if (this.checked) {
        if (this.currentTab == "department") return "搜索部门名称";
        return "搜索成员名称";
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
    handleClick(tab) {
      this.currentTab = tab.name;
    },
    addDepartment() {
      this.$refs.contactsRef.title = "新建部门";
      this.$refs.contactsRef.drawer = true;
    },
    BatchImport() {
      //批量导入
    },
    handleCommand(commond) {
      //手动添加
      if (commond == "manually") {
        this.manuallyVisible = true;
        this.title = "添加成员";
      }
    },
    editMember(row) {      
      this.manuallyVisible = true;
      this.title = "编辑成员";
      this.itemRow = row;
    },
    menuallyClose() {
      this.manuallyVisible = false;
    },
    updateList() {
      this.menuallyClose();
      this.$refs.member.getList();
    }
  },
};
</script>

<style lang="scss">
.contacts {
  margin-top: 20px;
  padding-right: 26px;
  padding-left: 32px;
  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .task-list-grid {
    flex: 1;
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
  .operate-box {
    display: flex;
    margin-right: 20px;
    align-items: center;
    justify-content: space-between;
    .el-dropdown-link {
      color: #448ef7;
      font-size: 14px;
    }
    .el-icon-guijifeihang:before {
      margin-right: 5px;
    }
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
}
</style>