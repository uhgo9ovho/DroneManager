<template>
  <div class="flight-log">
    <common-table
      :tableList="logList"
      :columns="columns"
      :total="total"
      @sizeChange="sizeChange"
      @pageChange="pageChange"
      :pageSize="pageSize"
      :pageNum="pageNum"
    >
      <template #taskName="{ row }">
        <div class="airline">
          <div class="airimg">
            <img src="../assets/images/fly_img.3924673b.png" alt="" />
          </div>
          <div>{{ row.lineName }}</div>
        </div>
      </template>
      <template #createBy="{ row }">
        {{ row.createBy }}
      </template>
      <template #failMessage="{ row }">
        <el-tooltip
          effect="dark"
          :content="row.failMessage ? row.failMessage : '任务执行成功'"
          placement="top-start"
        >
          <el-tag :type="row.failMessage ? 'danger' : 'success'">{{
            row.failMessage ? "失败" : "成功"
          }}</el-tag>
        </el-tooltip>
      </template>
      <template #operate="{ row }">
        <el-button
          class="look-btn"
          @click="lookBtn(row)"
          v-permissions="'wurenji:record:query'"
          >查看</el-button
        >
      </template>
    </common-table>
    <!-- 查看弹窗 -->
    <div v-if="showDialog">
      <AirLogDialog
        @closeAirDialog="closeAirDialog"
        :row="row"
        @updatePhotos="updatePhotos"
        ref="AirLogDialog"
      ></AirLogDialog>
    </div>
  </div>
</template>

<script>
import CommonTable from "./CommonTable.vue";
import AirLogDialog from "./Template/AirLogDialog.vue";
import { recordListAPI, getLogPhotosAPI } from "@/api/TaskManager.js";
export default {
  name: "FLightLog",
  components: {
    CommonTable,
    AirLogDialog,
  },
  data() {
    return {
      logList: [],
      showDialog: false,
      total: 0,
      columns: [
        {
          prop: "taskName",
          label: "飞行记录名称",
          showOverflowTooltip: true,
          slot: true,
          minWidth: "250",
        },
        {
          prop: "airportName",
          label: "机场",
          showOverflowTooltip: true,
        },
        {
          prop: "executionTime",
          label: "执行时间",
          showOverflowTooltip: true,
        },
        {
          prop: "photoNum",
          label: "照片数",
          showOverflowTooltip: true,
        },
        // {
        //   prop: "remark",
        //   label: "标注照片数",
        //   showOverflowTooltip: true,
        // },
        {
          prop: "failMessage",
          label: "飞行状态",
          // showOverflowTooltip: true,
          slot: true,
        },
        {
          prop: "operate",
          label: "操作",
          showOverflowTooltip: false,
          slot: true,
        },
      ],
      pageNum: 1,
      pageSize: 10,
      row: {},
      taskName: "",
    };
  },
  methods: {
    updatePhotos(row) {
      getLogPhotosAPI(row.recordId).then((res) => {
        if (res.code === 200) {
          row.photoNum = res.rows.length;
          row.resultList = res.rows;
          this.showDialog = true;
          this.row = row;
          this.$refs.AirLogDialog.getImageUrl();
        }
      });
    },
    lookBtn(row) {
      getLogPhotosAPI(row.recordId).then((res) => {
        if (res.code === 200) {
          row.photoNum = res.rows.length;
          row.resultList = res.rows;
          this.showDialog = true;
          this.row = row;
        }
      });
    },
    closeAirDialog() {
      this.showDialog = false;
    },
    searchLogName(val) {
      this.taskName = val;
      this.pageNum = 1;
      const params = {
        pageNum: 1,
        pageSize: this.pageSize,
        orgId: localStorage.getItem("org_id"),
        taskName: val,
      };
      recordListAPI(params).then((res) => {
        if (res.code === 200) {
          this.logList = res.rows;
          this.total = res.total;
        }
      });
    },
    initList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orgId: localStorage.getItem("org_id"),
        taskName: this.taskName,
      };
      recordListAPI(params).then((res) => {
        if (res.code === 200) {
          this.logList = res.rows;
          this.total = res.total;
        }
      });
    },
    pageChange(val) {
      this.pageSize = val.pageSize;
      this.pageNum = val.pageNum;
      this.initList();
    },
    sizeChange(val) {
      this.pageNum = val.pageNum;
      this.pageSize = val.pageSize;
      this.initList();
    },
  },
  mounted() {
    this.initList();
  },
};
</script>

<style lang="scss">
.flight-log {
  .airline {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .airimg {
      width: 48px;
      height: 48px;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        border: 1px solid #ccc;
      }
    }
  }
  .look-btn {
    width: 84px;
    height: 32px;
    background: #0271e3;
    border-radius: 16px;
    font-weight: 500;
    font-size: 14px;
    color: #fff;
    text-align: center;
    padding: 0;
    border: 0;
  }
}
</style>
