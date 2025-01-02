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
      </CommonTable>
    </el-dialog>
  </div>
</template>
  
  <script>
import { getDeviceListAPI } from "@/api/orgModel";
import CommonTable from "@/components/CommonTable.vue";
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
  },
  data() {
    return {
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
          prop: "headPhone",
          label: "联系电话",
          showOverflowTooltip: true,
        },
        {
          prop: "orgName",
          label: "平台名称",
          showOverflowTooltip: true,
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
  },
};
</script>
  
  <style lang="scss">
.device-list-box {
    
}
</style>