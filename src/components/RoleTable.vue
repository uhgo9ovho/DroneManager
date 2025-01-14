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
        <el-button type="text" @click="handleEdit(row)" v-if="row.roleName !='超级管理员'" v-permissions="'wrj:role:edit'">编辑</el-button>
        <el-button type="text" @click="handleDelete(row)" style="color: red" v-if="row.roleName !='超级管理员'" v-permissions="'wrj:role:remove'">删除</el-button>
      </template>
    </common-table>
    <!-- 编辑弹窗 -->
    <div v-if="dialogVisible">
      <role-edit-dialog :row="row" :dialogVisible="dialogVisible" @updateDialogVisible="updateDialogVisible"></role-edit-dialog>
    </div>
  </div>
</template>

<script>
import RoleEditDialog from "./Template/RoleEditDialog.vue";
import CommonTable from "./CommonTable.vue";
import { getRoleListAPI } from "@/api/orgModel";
export default {
  components: {
    CommonTable,
    RoleEditDialog,
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
      },
    };
  },
  methods: {
    pageChange(pageNum) {
      this.params.pageNum = pageNum;
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize;
    },
    async getRoleList() {
      const res = await getRoleListAPI(this.params);
      if (res.code === 200) {
        this.tableList = res.rows;
        this.total = res.total;
      }
    },
    handleEdit(row) {
      this.dialogVisible = true;
      this.row = row
    },
    handleDelete(row) {
      console.log(row);
    },
    updateDialogVisible(visible) {
      this.dialogVisible = visible;
    },
  },
  mounted() {
    this.getRoleList();
  },
};
</script>

<style lang="scss" scoped>

</style>