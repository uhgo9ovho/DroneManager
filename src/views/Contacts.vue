<template>
  <div class="contacts">
    <div class="top">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="部门" name="department" v-if="permissions.includes('mngSide:contacts:dept') || permissions[0] === '*:*:*'"></el-tab-pane>
        <el-tab-pane label="成员" name="member" v-if="permissions.includes('mngSide:contacts:member') || permissions[0] === '*:*:*'"></el-tab-pane>
        <el-tab-pane label="角色" name="role" v-if="permissions.includes('mngSide:contacts:role') || permissions[0] === '*:*:*'"></el-tab-pane>
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
            @input="handleSearch"
          ></el-input>
        </div>
        <div class="create-task-btn" v-if="currentTab == 'department'" v-permissions="'wrj:dept:add'">
          <el-button round icon="el-icon-plus" @click="addDepartment"
            >添加部门</el-button
          >
        </div>
        <div class="create-task-btn" v-if="currentTab == 'role'" v-permissions="'wrj:role:add'">
          <el-button round icon="el-icon-plus" @click="addRole"
            >添加角色</el-button
          >
        </div>
        <div class="btn-group" v-if="currentTab == 'member'">
          <el-dropdown style="margin-right: 15px" @command="deleteAll" v-permissions="'wrj:dept:remove'">
            <el-button round
              >批量操作<i class="el-icon-caret-bottom el-icon--right"></i
            ></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="!idStr" command="deleteAll"
                >批量删除</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="handleCommand" v-permissions="'wrj:user:add'">
            <el-button
              round
              icon="el-icon-plus"
              style="background-color: #000; color: #fff"
              >添加成员<i class="el-icon-caret-bottom el-icon--right"></i
            ></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="manually">手动添加</el-dropdown-item>
              <el-dropdown-item command="invitePerson" >邀请添加</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="task-list-grid" v-if="currentTab == 'department'">
      <contacts-table ref="contactsRef" v-permissions="'wrj:dept:list'"></contacts-table>
    </div>
    <div class="flight-log" v-if="currentTab == 'member'">
      <member-table
        @editMember="editMember"
        ref="member"
        @deleteIds="deleteIds"
        v-permissions="'wrj:user:list'"
      ></member-table>
    </div>
    <div class="role-list" v-if="currentTab == 'role'">
      <!-- 角色列表 -->
      <role-table ref="role" v-permissions="'wrj:role:list'"></role-table>
    </div>
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
    <div v-if="dialogVisible">
      <invite-dialog
        :dialogVisible="dialogVisible"
        @closeDialog="closeDialog"
      ></invite-dialog>
    </div>
  </div>
</template>

<script>
import ContactsTable from "../components/ContactsTable.vue";
import MemberTable from "../components/MemberTable.vue";
import { deleteAllUser } from "@/api/user.js";
import ManuallyAddEditDialog from "../components/Template/ManuallyAddEditDialog.vue";
import InviteDialog from '@/components/InviteDialog.vue'
import RoleTable from '@/components/RoleTable.vue'
export default {
  name: "Contacts",
  data() {
    return {
      permissions: JSON.parse(localStorage.getItem('userPermission')),
      dialogVisible: false,
      activeName: "department",
      checked: false,
      searchText: "",
      manuallyVisible: false,
      currentTab: "department",
      title: "",
      itemRow: null,
      timer: null,
      idStr: "",
    };
  },
  components: {
    InviteDialog,
    ContactsTable,
    MemberTable,
    ManuallyAddEditDialog,
    RoleTable
  },
  computed: {
    checkedTip() {
      if (this.checked) {
        if (this.currentTab == "department") return "搜索部门名称";
        return "搜索成员姓名";
      }
      return "搜索";
    },
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
    },
    handleSearch(e) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        if (this.currentTab == "department") {
          //部门搜索
          this.$refs.contactsRef.page.orgDeptName = e;
          this.$refs.contactsRef.getDepartment();
        } else {
          //成员搜索
          if (e) {
            this.$refs.member.params.nickName = e;
            this.$refs.member.searchList();
          } else {
            this.$refs.member.getList();
          }
        }
      }, 500);
    },
    focus() {
      this.checked = true;
    },
    blur() {
      this.checked = false;
    },
    handleClick(tab) {
      this.searchText = '';
      this.currentTab = tab.name;
    },
    addDepartment() {
      this.$refs.contactsRef.title = "新建部门";
      this.$refs.contactsRef.drawer = true;
    },
    addRole() {
      this.$refs.role.title = '添加角色';
      this.$refs.role.dialogVisible = true;
    },
    BatchImport() {
      //批量导入
    },
    deleteAll(e) {
      if (e == "deleteAll") {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            //批量删除
            deleteAllUser(this.idStr).then((res) => {
              if (res.code == 200) {
                //删除成功
                this.$message.success(res.msg);
                this.$refs.member.getList();
              } else {
                this.$message.error("删除失败");
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    deleteIds(idStr) {
      this.idStr = idStr;
    },
    handleCommand(commond) {
      //手动添加
      if (commond == "manually") {
        this.manuallyVisible = true;
        this.title = "添加成员";
      }
      if (commond == "invitePerson") {
        this.dialogVisible = true;

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
    },
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
