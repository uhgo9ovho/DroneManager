<template>
  <div class="flight-log">
    <common-table :tableList="logList" :columns="columns" :total="total">
      <template #airline_name="{ row }">
        <div class="airline">
          <div class="airimg">
            <img src="../assets/images/fly_img.3924673b.png" alt="" />
          </div>
          <div>{{ row.airline_name }}</div>
        </div>
      </template>
      <template #record_create_by="{ row }">
        {{ row.create_by }}/{{ row.operator }}
      </template>
      <template #record_status="{ row }">
        <el-tag type="success">{{ row.record_status }}</el-tag>
      </template>
      <template #operate>
        <el-button class="look-btn" @click="lookBtn">查看</el-button>
      </template>
    </common-table>
    <!-- 查看弹窗 -->
     <div v-if="showDialog">
      <AirLogDialog @closeAirDialog="closeAirDialog"></AirLogDialog>
     </div>
  </div>
</template>

<script>
import CommonTable from "./CommonTable.vue";
import { mockList7 } from "@/utils/mock.js";
import AirLogDialog from './Template/AirLogDialog.vue';
export default {
  name: "FLightLog",
  components: {
    CommonTable,
    AirLogDialog
  },
  data() {
    return {
      logList: [],
      showDialog: false,
      total: 0,
      columns: [
        {
          prop: "airline_name",
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
          prop: "record_create_by",
          label: "创建人/操作人",
          slot: true,
          showOverflowTooltip: true,
        },
        {
          prop: "flight_start_time",
          label: "起降时间",
          showOverflowTooltip: true,
        },
        {
          prop: "photo_count",
          label: "照片数",
          showOverflowTooltip: true,
        },
        {
          prop: "problem_count",
          label: "标注照片数",
          showOverflowTooltip: true,
        },
        {
          prop: "record_status",
          label: "照片状态",
          showOverflowTooltip: true,
          slot: true,
        },
        {
          prop: "operate",
          label: "操作",
          showOverflowTooltip: false,
          slot: true,
        },
      ],
    };
  },
  methods: {
    getLogList() {
      this.logList = mockList7.items;
      this.total = mockList7.total;
    },
    lookBtn() {
      this.showDialog = true;
    },
    closeAirDialog() {
      this.showDialog = false;
    }
  },
  mounted() {
    console.log(mockList7);
    this.getLogList();
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