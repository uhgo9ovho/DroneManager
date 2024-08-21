<template>
  <div class="contacts-table">
    <common-table
      :columns="columns"
      :tableList="list"
      :total="total"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
      :pageSize="page.pageSize"
      :pageNum="page.pageNum"
    >
      <template #taskName="{ row }">
        <div class="dept_name_box">
          <div class="dept_first_letter">{{ row.orgDeptName.slice(0, 2) }}</div>
          <div class="dept_full_name">
            {{ row.orgDeptName }}
            <span class="org_tips" v-if="row.isOrg">组织</span>
          </div>
        </div>
      </template>
      <template #operate="{ row }">
        <div v-if="row.isOrg">
          <el-button type="text" @click="openPersonalization(row)"
            >个性化</el-button
          >
        </div>
        <div class="edit-btns" v-else>
          <el-button type="text" @click="openEditDialog(row)">编辑</el-button>
          <el-button type="text" @click="openMigrateDialog">迁移</el-button>
          <el-button type="text">权限</el-button>
          <el-button type="text" style="color: red" @click="delBtn(row.id)"
            >删除</el-button
          >
        </div>
      </template>
    </common-table>
    <!-- 新建、编辑dialog框组件 -->
    <div v-if="drawer">
      <add-and-edit-department
        @handleClose="handleClose"
        :drawer="drawer"
        :title="title"
        :itemRow="itemRow"
        @updateList="updateList"
      ></add-and-edit-department>
    </div>
    <!-- 迁移成员dialog组件 -->
    <div v-if="mirgrateVisible">
      <MigrateDialog
        :mirgrateVisible="mirgrateVisible"
        @mirgrateHandle="mirgrateHandle"
        :data="departmentList"
      ></MigrateDialog>
    </div>
    <!-- 个性化dialog组件 -->
    <div v-if="personalizationShow">
      <personalization-dialog
        :itemRow="itemRow"
        :personalizationShow="personalizationShow"
        @personalizationHandle="personalizationHandle"
        @editGXH="editGXH"
      ></personalization-dialog>
    </div>
  </div>
</template>

<script>
import { mockList2 } from "@/utils/mock.js";
import CommonTable from "./CommonTable.vue";
import AddAndEditDepartment from "./Template/AddAndEditDepartment.vue";
import MigrateDialog from "./Template/MigrateDialog.vue";
import { getDeptList, delDept } from "@/api/user.js";
import PersonalizationDialog from "./Template/PersonalizationDialog.vue";
export default {
  name: "ContactsTable",
  data() {
    return {
      drawer: false,
      mirgrateVisible: false,
      personalizationShow: false,
      title: "123",
      columns: [
        {
          prop: "taskName",
          label: "部门",
          showOverflowTooltip: true,
          slot: true,
          minWidth: "200",
        },
        {
          prop: "member",
          label: "成员数",
          showOverflowTooltip: true,
        },
        {
          prop: "nickName",
          label: "创建人",
          showOverflowTooltip: false,
        },
        {
          prop: "createTime",
          label: "创建日期",
          showOverflowTooltip: false,
        },
        {
          prop: "operate",
          label: "操作",
          showOverflowTooltip: false,
          width: "200px",
          slot: true,
        },
      ],
      page: {
        pageNum: 1,
        pageSize: 10,
        orgId: this.$store.getters.orgId,
        orgDeptName: "",
      },
      list: [],
      itemRow: null,
      total: 0,
    };
  },
  computed: {
    departmentList() {
      return mockList2;
    },
  },
  methods: {
    editGXH() {
      this.personalizationShow = false;
      this.getDepartment();
    },
    personalizationHandle() {
      this.personalizationShow = false;
    },
    handleClose() {
      this.drawer = false;
    },
    openEditDialog(row) {
      this.drawer = true;
      this.title = "编辑部门";
      this.itemRow = row;
    },
    openMigrateDialog() {
      this.mirgrateVisible = true;
    },
    mirgrateHandle() {
      this.mirgrateVisible = false;
    },
    getDepartment() {
      getDeptList(this.page).then((res) => {
        this.list = res.rows;
        this.total = res.total;
      });
    },
    updateList() {
      this.getDepartment();
    },
    sizeChange({ pageNum, pageSize }) {
      this.page.pageSize = pageSize;
      this.page.pageNum = pageNum;
      this.getDepartment();
    },
    pageChange({ pageNum, pageSize }) {
      this.page.pageSize = pageSize;
      this.page.pageNum = pageNum;
      this.getDepartment();
    },
    editSuccess() {
      this.drawer = false;
      this.getDepartment();
    },
    delBtn(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delDept(id).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getDepartment();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    openPersonalization(row) {
      this.personalizationShow = true;
      this.itemRow = row;
    },
  },
  mounted() {
    this.getDepartment();
  },
  components: {
    CommonTable,
    AddAndEditDepartment,
    MigrateDialog,
    PersonalizationDialog,
  },
};
</script>

<style lang="scss">
.contacts-table {
  .dept_name_box {
    display: flex;
    .dept_first_letter {
      width: 48px;
      height: 48px;
      line-height: 48px;
      border-radius: 50%;
      opacity: 0.8;
      background: #0271e3;
      font-weight: 500;
      font-size: 14px;
      color: #fff;
      text-align: center;
      margin-right: 16px;
    }
    .dept_full_name {
      font-weight: 550;
      font-size: 14px;
      color: #1d1d1f;
      display: flex;
      align-items: center;
      .org_tips {
        display: inline-block;
        width: 36px;
        height: 18px;
        border: 1px solid #6e6e73;
        border-radius: 4px;
        font-weight: 400;
        font-size: 12px;
        color: #1d1d1f;
        text-align: center;
        line-height: 16px;
        margin-left: 4px;
      }
    }
  }
}
</style>