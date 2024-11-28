<template>
  <div class="flight-table">
    <common-table :tableList="mockTableList" :columns="columns">
      <!-- 内容插槽 -->
      <template #data_time="{ row }">
        <data-time :row="row"></data-time>
      </template>
      <template #operate>
        <div class="operate-box">
          <el-button type="text" @click="detailsBtn">查看</el-button>
        </div>
      </template>
    </common-table>
  </div>
</template>
  
  <script>
import CommonTable from "./CommonTable.vue";
import { mockList8 } from "@/utils/mock.js";
import { warningListAPI } from "@/api/TaskManager.js";
import DataTime from "./Template/DataTime.vue";
export default {
  name: "FlightTable",
  props: {},
  data() {
    return {
      columns: [
        {
          prop: "data_time",
          label: "报告时间",
          showOverflowTooltip: true,
          slot: true,
          minWidth: "200",
        },
        {
          prop: "fxjc",
          label: "飞机架次",
          showOverflowTooltip: true,
        },
        {
          prop: "tjrw",
          label: "提交/执行任务数",
          showOverflowTooltip: false,
        },
        {
          prop: "fxwt",
          label: "发现问题数",
          showOverflowTooltip: false,
        },
        {
          prop: "qjmx",
          label: "全景",
          showOverflowTooltip: false,
        },
        {
          prop: "swmx",
          label: "三维",
          showOverflowTooltip: false,
        },
        {
          prop: "zsmx",
          label: "正射",
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
    mockTableList() {
      return mockList8.items;
    },
  },
  mounted() {
    // warningListAPI();
  },
  methods: {
    detailsBtn() {

    },
  },
  components: {
    CommonTable,
    DataTime
  },
};
</script>
  
  <style lang="scss">
.flight-table {
  .filter-icon {
    margin-left: 5px;
    vertical-align: text-top;
    &:hover {
      cursor: pointer;
      transform: scale(1.3);
    }
  }
}
</style>