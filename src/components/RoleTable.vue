<template>
  <div class="role-table">
    <common-table
      :tableList="tableList"
      :columns="columns"
      :total="total"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
      :pageSize="params.pageSize"
      :pageNum="params.pageNum"
    >
      <template #status="{ row }">
        <el-tag :type="row.status === '0' ? 'success' : 'danger'">{{
          row.status === "0" ? "启用" : "禁用"
        }}</el-tag>
      </template>
      <template #operate="{ row }">
        <el-button
          type="text"
          @click="handleEdit(row)"
          v-if="
            row.roleName != '超级管理员' ||
            row.roleKey === `org_admin_${params.orgId}`
          "
          v-permissions="'wrj:role:edit'"
          >编辑</el-button
        >
        <el-button
          type="text"
          @click="handleDelete(row)"
          style="color: red"
          v-if="
            (row.roleName != '超级管理员' ||
            row.roleKey === `org_admin_${params.orgId}`) && model == 'role'
          "
          v-permissions="'wrj:role:remove'"
          >删除</el-button
        >
      </template>
    </common-table>
    <!-- 编辑新增弹窗 -->
    <div v-if="dialogVisible">
      <role-dialog
        :title="title"
        @updateList="updateList"
        :row="row"
        :dialogVisible="dialogVisible"
        @updateDialogVisible="updateDialogVisible"
      ></role-dialog>
    </div>
  </div>
</template>

<script>
import RoleDialog from "./Template/RoleDialog.vue";
import CommonTable from "./CommonTable.vue";
import { getRoleListAPI, getOrgRoleListAPI } from "@/api/orgModel";
export default {
  props: {
    model: {
      type: String,
      default: "role",
    },
  },
  components: {
    CommonTable,
    RoleDialog,
  },
  data() {
    return {
      dialogVisible: false,
      row: null,
      columns: [
        {
          prop: "roleName",
          label: "角色名称",
          showOverflowTooltip: true,
          minWidth: "200",
        },
        {
          prop: "createTime",
          label: "创建时间",
          showOverflowTooltip: true,
        },
        {
          prop: "remark",
          label: "描述",
          showOverflowTooltip: true,
        },
        {
          prop: "status",
          label: "状态",
          slot: true,
          showOverflowTooltip: true,
        },
        {
          prop: "operate",
          label: "操作",
          showOverflowTooltip: false,
          width: "200px",
          slot: true,
        },
      ],
      tableList: [],
      total: 0,
      params: {
        pageSize: 10,
        pageNum: 1,
        orgId: localStorage.getItem("org_id"),
      },
      orgParams: {
        pageSize: 10,
        pageNum: 1,
      },
      title: "",
    };
  },
  methods: {
    pageChange(pageNum) {
      console.log(pageNum);
      
      this.params.pageNum = pageNum.pageNum;
      this.getRoleList()
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize.pageSize;
      this.getRoleList()
    },
    async getRoleList() {
      if (this.model == "role") {
        const res = await getRoleListAPI(this.params);
        if (res.code === 200) {
          this.tableList = res.rows;
          this.total = res.total;
        }
      } else {
        const res = await getOrgRoleListAPI(this.orgParams);
        if (res.code === 200) {
          this.tableList = res.rows;
          this.total = res.total;
        }
      }
    },
    handleEdit(row) {
      this.dialogVisible = true;
      this.title = "编辑角色";
      this.row = row;
    },
    handleDelete(row) {
      console.log(row);
    },
    updateDialogVisible(visible) {
      this.dialogVisible = visible;
    },
    updateList() {
      this.getRoleList();
    },
  },
  mounted() {
    this.getRoleList();
  },
};
</script>

<style lang="scss" scoped>
</style>