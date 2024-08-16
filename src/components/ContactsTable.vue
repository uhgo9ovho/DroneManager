<template>
  <div class="contacts-table">
    <common-table :columns="columns" :tableList="list" :total="total" @pageChange="pageChange" @sizeChange="sizeChange" :pageSize="page.pageSize" :pageNum="page.pageNum">
      <template #taskName="{ row }">
        <div class="dept_name_box">
          <div class="dept_first_letter">{{ row.taskName.slice(0, 2) }}</div>
          <div class="dept_full_name">
            {{ row.taskName }}
            <span class="org_tips" v-if="row.isOrg"
              >组织</span
            >
          </div>
        </div>
      </template>
      <template #operate="{ row }">
        <div v-if="row.isOrg">
          <el-button type="text">个性化</el-button>
        </div>
        <div class="edit-btns" v-else>
          <el-button type="text" @click="openEditDialog(row)">编辑</el-button>
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
        :itemRow="itemRow"
        @updateList="updateList"
      ></add-and-edit-department>
    </div>
    <!-- 迁移成员dialog组件 -->
     <div v-if="mirgrateVisible">
      <MigrateDialog :mirgrateVisible="mirgrateVisible" @mirgrateHandle="mirgrateHandle" :data="departmentList"></MigrateDialog>
     </div>
  </div>
</template>

<script>
import { mockList2 } from "@/utils/mock.js";
import CommonTable from "./CommonTable.vue";
import AddAndEditDepartment from "./Template/AddAndEditDepartment.vue";
import MigrateDialog from './Template/MigrateDialog.vue';
import { getDepartmentList, getDeptList } from '@/api/user.js';
export default {
  name: "ContactsTable",
  data() {
    return {
      drawer: false,
      mirgrateVisible: false,
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
          prop: "createBy",
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
        pageSize: 1
      },
      list: [],
      itemRow: null,
      total: 0
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
    openEditDialog(row) {
      this.drawer = true;
      this.title = "编辑部门";
      console.log(row);
      this.itemRow = row;
      
    },
    openMigrateDialog() {
      this.mirgrateVisible = true;
    },
    mirgrateHandle() {
      this.mirgrateVisible = false;
    },
    getDepartment() {
      const deptList = getDeptList(this.page);
      const organizeList = getDepartmentList(this.page);
      Promise.all([deptList, organizeList]).then(values => {
        let list1 = values[0].rows;
        let list2 = values[1].rows;
        this.list = [...list1, ...list2]
        this.list.forEach(item => {
          item.taskName = item.orgDeptName || item.platformName;
        });
        this.total = values[0].total + values[1].total;
      })
    },
    updateList() {
      this.getDepartment()
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
  },
  mounted() {
    this.getDepartment()
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