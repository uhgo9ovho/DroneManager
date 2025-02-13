<template>
  <div class="org-table">
    <CommonTable
      :tableList="tableList"
      :columns="columns"
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    >
      <template #operate="scope">
        <el-button type="text" @click="handleAddDevice(scope.row)" v-permissions="'wrj:device:add'"
          >新增设备</el-button
        >
        <el-button type="text" @click="handleDeviceList(scope.row)" v-permissions="'wrj:device:list'"
          >设备列表</el-button
        >
        <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button
          type="text"
          style="color: #f56c6c"
          @click="handleDelete(scope.row)"
          v-permissions="'wrj:org:remove'"
          >删除</el-button
        >
      </template>
    </CommonTable>
    <!-- 新增和编辑弹窗 -->
    <div class="dialog-box" v-if="dialogVisible">
      <OrgAddAndEditDialog
        :title="title"
        :editRow="editRow"
        @updateList="updateList"
        :dialogVisible="dialogVisible"
        @updateDialogVisible="updateDialogVisible"
      />
    </div>
    <!-- 新增设备弹窗 -->
    <div class="add-device-box" v-if="DeviceDialogVisible">
      <AddDeviceDialog
        :itemOrgId="itemOrgId"
        :DeviceDialogVisible="DeviceDialogVisible"
        @updateDeviceDialogVisible="updateDeviceDialogVisible"
      ></AddDeviceDialog>
    </div>
    <!-- 设备列表弹窗 -->
    <div class="device-list-box" v-if="deviceListVisible">
      <DeviceListDialog
        :itemOrgId="itemOrgId"
        :deviceListVisible="deviceListVisible"
        @updateDeviceListVisible="updateDeviceListVisible"
      ></DeviceListDialog>
    </div>
  </div>
</template>

<script>
import CommonTable from "./CommonTable.vue";
import AddDeviceDialog from "./Template/AddAndEditDeviceDialog.vue";
import { getOrgListAPI, deleteOrgAPI } from "@/api/orgModel";
import OrgAddAndEditDialog from "./Template/OrgAddAndEditDialog.vue";
import DeviceListDialog from "./Template/DeviceListDialog.vue";
export default {
  name: "OrgTable",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CommonTable,
    OrgAddAndEditDialog,
    AddDeviceDialog,
    DeviceListDialog,
  },
  data() {
    return {
      searchValue: "",
      searchType: 1,
      columns: [
        // {
        //   prop: "orgId",
        //   label: "组织id",
        //   showOverflowTooltip: true,
        // },
        {
          prop: "orgName",
          label: "组织名称",
          showOverflowTooltip: true,
        },
        {
          prop: "ad",
          label: "省市区县",
          showOverflowTooltip: true,
        },
        {
          prop: "head",
          label: "负责人",
          showOverflowTooltip: true,
        },
        {
          prop: "headPhone",
          label: "联系电话",
          showOverflowTooltip: true,
        },
        {
          prop: "orgName",
          label: "平台名称",
          showOverflowTooltip: true,
        },
        {
          prop: "operate",
          label: "操作",
          showOverflowTooltip: false,
          width: "300px",
          slot: true,
        },
      ],
      tableList: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      editRow: null,
      title: "新增组织",
      DeviceDialogVisible: false,
      deviceListVisible: false,
      itemOrgId: 0,
    };
  },
  watch: {
    async searchValue(val) {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      if(this.searchType === 1) {
        params.orgName = val;
      } else if(this.searchType === 2) {
        params.head = val;
      }
      const res = await getOrgListAPI(params);
      if (res.code === 200) {
        this.tableList = res.rows;
        this.total = res.total.total;
      }
    },
  },
  mounted() {
    this.getOrgList();
  },
  methods: {
    updateList() {
      this.getOrgList();
    },
    pageChange(pageNum) {      
      this.pageNum = pageNum.pageNum;
      this.getOrgList();
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize.pageSize;
      this.getOrgList();
    },
    async getOrgList() {
      const res = await getOrgListAPI({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
      if (res.code === 200) {
        this.tableList = res.rows;
        this.total = res.total;
      }
    },
    handleAddDevice(row) {
      this.DeviceDialogVisible = true;
      this.itemOrgId = row.orgId;
    },
    updateDeviceDialogVisible(val) {
      this.DeviceDialogVisible = val;
    },
    handleDeviceList(row) {
      this.deviceListVisible = true;
      this.itemOrgId = row.orgId;
    },
    updateDeviceListVisible(val) {
      this.deviceListVisible = val;
    },
    handleEdit(row) {
      this.editRow = row;
      this.title = "编辑组织";
      this.updateDialogVisible(true);
    },
    handleDelete(row) {
      deleteOrgAPI(row.orgId)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getOrgList();
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch((err) => {
          this.$message.error("删除失败");
        });
    },
    updateDialogVisible(dialogVisible) {
      this.$emit("updateDialogVisible", dialogVisible);
    },
  },
};
</script>

<style lang="scss" scoped>
.org-table {
  flex: 1;
  margin-top: 20px;
}
</style>
