<template>
  <div class="contacts-table">
    <common-table :columns="columns" :tableList="departmentList">
      <template #dept_name="{ row }">
        <div class="dept_name_box">
          <div class="dept_first_letter">{{ row.dept_name.slice(0, 2) }}</div>
          <div class="dept_full_name">
            {{ row.dept_name }}
            <span class="org_tips" v-if="row.dept_name == '西安集贤工业园区'"
              >组织</span
            >
          </div>
        </div>
      </template>
      <template #operate="{ row }">
        <div v-if="row.dept_name == '西安集贤工业园区'">
          <el-button type="text">个性化</el-button>
        </div>
        <div class="edit-btns" v-else>
          <el-button type="text" @click="openEditDialog">编辑</el-button>
          <el-button type="text" @click="openMigrateDialog">迁移</el-button>
          <el-button type="text">权限</el-button>
          <el-button type="text" style="color: red">删除</el-button>
        </div>
      </template>
    </common-table>
    <!-- 新建、编辑dialog框组件 -->
    <div v-if="drawer">
      <add-and-edit-department
        @handleClose="handleClose"
        :drawer="drawer"
        :title="title"
      ></add-and-edit-department>
    </div>
    <!-- 迁移成员dialog组件 -->
     <div v-if="mirgrateVisible">
      <MigrateDialog :mirgrateVisible="mirgrateVisible" @mirgrateHandle="mirgrateHandle"></MigrateDialog>
     </div>
  </div>
</template>

<script>
import { mockList2 } from "@/utils/mock.js";
import CommonTable from "./CommonTable.vue";
import AddAndEditDepartment from "./Template/AddAndEditDepartment.vue";
import MigrateDialog from './Template/MigrateDialog.vue';
export default {
  name: "ContactsTable",
  data() {
    return {
      drawer: false,
      mirgrateVisible: false,
      title: "123",
      columns: [
        {
          prop: "dept_name",
          label: "部门",
          showOverflowTooltip: true,
          slot: true,
          minWidth: "200",
        },
        {
          prop: "user_count",
          label: "成员数",
          showOverflowTooltip: true,
        },
        {
          prop: "create_by",
          label: "创建人",
          showOverflowTooltip: false,
        },
        {
          prop: "create_time",
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
    };
  },
  computed: {
    departmentList() {
      return mockList2;
    },
  },
  methods: {
    handleClose() {
      this.drawer = false;
    },
    openEditDialog() {
      this.drawer = true;
      this.title = "编辑部门";
    },
    openMigrateDialog() {
      this.mirgrateVisible = true;
    },
    mirgrateHandle() {
      this.mirgrateVisible = false;
    }
  },
  components: {
    CommonTable,
    AddAndEditDepartment,
    MigrateDialog,
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