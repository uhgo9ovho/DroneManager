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
          <div>{{ row.taskName }}</div>
        </div>
      </template>
      <template #createBy="{ row }">
        {{ row.createBy }}
      </template>
      <template #record_status="{ row }">
        <el-tag type="success">{{ row.record_status }}</el-tag>
      </template>
      <template #operate="{ row }">
        <el-button class="look-btn" @click="lookBtn(row)">查看</el-button>
      </template>
    </common-table>
    <!-- 查看弹窗 -->
    <div v-if="showDialog">
      <AirLogDialog @closeAirDialog="closeAirDialog" :row="row"></AirLogDialog>
    </div>
  </div>
</template>

<script>
import CommonTable from "./CommonTable.vue";
import { mockList7 } from "@/utils/mock.js";
import AirLogDialog from "./Template/AirLogDialog.vue";
import { recordListAPI } from "@/api/TaskManager.js";
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
          prop: "nest_name",
          label: "机场",
          showOverflowTooltip: true,
        },
        {
          prop: "createBy",
          label: "创建人/操作人",
          slot: true,
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
        {
          prop: "remark",
          label: "标注照片数",
          showOverflowTooltip: true,
        },
        // {
        //   prop: "record_status",
        //   label: "照片状态",
        //   showOverflowTooltip: true,
        //   slot: true,
        // },
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
    };
  },
  methods: {
    lookBtn(row) {
      this.row = row;
      this.showDialog = true;
    },
    closeAirDialog() {
      this.showDialog = false;
    },
    initList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orgId: localStorage.getItem('org_id')
      };
      recordListAPI(params).then((res) => {
        if (res.code === 200) {
          res.rows.forEach((item) => {
            item.photoNum = item.resultList.length;
          });
          this.logList = res.rows;
          this.total = res.total;
        }
      });
    },
    pageChange(val) {      
      this.pageSize = val.pageSize;
      this.pageNum = val.pageNum;
      this.initList()
    },
    sizeChange(val) {
      this.pageNum = val.pageNum;
      this.pageSize = val.pageSize;
      this.initList()
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