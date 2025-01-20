<template>
  <div class="device-list-dialog">
    <el-dialog
      :visible="deviceListVisible"
      @close="handleClose"
      title="设备列表"
      top="2vh !important"
    >
      <CommonTable
        :tableList="tableList"
        :columns="columns"
        :total="total"
        :pageNum="pageNum"
        :pageSize="pageSize"
        @pageChange="pageChange"
        @sizeChange="sizeChange"
        :height="height"
      >
        <template #deviceType="scope">
          <span>{{ scope.row.deviceType | filtersType }}</span>
        </template>
        <template #operate="scope">
          <div class="device-list-box">
            <el-button type="text" size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDelete(scope.row)"
            >
              <el-button
                style="margin-left: 10px; color: #ff4d4f"
                type="text"
                size="small"
                slot="reference"
                >删除</el-button
              >
            </el-popconfirm>
          </div>
        </template>
      </CommonTable>
    </el-dialog>
    <!-- 编辑设备弹窗 -->
    <div v-if="DeviceDialogVisible">
      <EditDeviceDialog
        :DeviceDialogVisible="DeviceDialogVisible"
        @updateDeviceDialogVisible="updateDeviceDialogVisible"
        :itemRow="itemRow"
        @updateDeviceList="updateDeviceList"
      ></EditDeviceDialog>
    </div>
  </div>
</template>

  <script>
import { getDeviceListAPI, deleteDeviceAPI } from "@/api/orgModel";
import CommonTable from "@/components/CommonTable.vue";
import EditDeviceDialog from "@/components/Template/AddAndEditDeviceDialog.vue";
export default {
  name: "AddDeviceDialog",
  props: {
    deviceListVisible: {
      type: Boolean,
      default: false,
    },
    itemOrgId: {
      type: Number,
      default: 0,
    },
  },
  components: {
    CommonTable,
    EditDeviceDialog,
  },
  data() {
    return {
      itemRow: null,
      DeviceDialogVisible: false,
      height: "484px",
      tableList: [],
      columns: [
        {
          prop: "deviceId",
          label: "设备id",
          showOverflowTooltip: true,
        },
        {
          prop: "deviceName",
          label: "设备名称",
          showOverflowTooltip: true,
        },
        {
          prop: "deviceDesc",
          label: "设备描述",
          showOverflowTooltip: true,
        },
        {
          prop: "deviceType",
          label: "设备类型",
          slot: true,
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
      total: 0,
      pageNum: 1,
      pageSize: 10,
    };
  },
  filters: {
    filtersType(val) {
      switch (val) {
        case 0:
          return "飞行器";
        case 1:
          return "机场";
        case 2:
          return "遥控器";
        case 3:
          return "算法盒子";
        case 4:
          return "摄像头";
        default:
          break;
      }
    },
  },
  mounted() {
    this.initTable();
  },
  methods: {
    initTable() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orgId: this.itemOrgId,
      };
      getDeviceListAPI(params).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
      });
    },
    updateDeviceList() {
      this.initTable();
    },
    handleClose() {
      this.$emit("updateDeviceListVisible", false);
    },
    pageChange(val) {
      this.pageNum = val.pageNum;
      this.initTable();
    },
    sizeChange(val) {
      this.pageSize = val.pageSize;
      this.initTable();
    },
    handleEdit(row) {
      this.DeviceDialogVisible = true;
      this.itemRow = row;
    },
    handleDelete(row) {
      deleteDeviceAPI(row.id)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.initTable();
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch((err) => {
          this.$message.error("删除失败");
        });
    },
    updateDeviceDialogVisible(val) {
      this.DeviceDialogVisible = val;
    },
  },
};
</script>

  <style lang="scss">
</style>
