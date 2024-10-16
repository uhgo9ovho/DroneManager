<template>
  <div class="flight-table">
    <common-table :tableList="mockTableList" :columns="columns">
      <!-- 自定义表头 -->
      <template #taskName-header>
        <span>事件</span>
        <el-dropdown @command="nameCommand">
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in nameOptions"
              :key="index"
              :command="item"
              >{{ item }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template #airPort-header>
        <span>发现机场</span>
        <el-dropdown>
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template #status-header>
        <span>事件状态</span>
        <el-dropdown @command="statusCommand">
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in statusOptions"
              :key="index"
              :command="item"
              >{{ item }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <!-- 内容插槽 -->
      <template #taskName="{ row }">
        <event-info :row="row"></event-info>
      </template>
      <template #creater="{ row }">
        <div>{{ row.ticket_create_time }}</div>
      </template>
      <template #status="{ row }">
        <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
      </template>
      <template #operate>
        <div class="operate-box">
          <el-button type="text" @click="detailsBtn">详情</el-button>
          <el-dropdown @command="operateCommand">
            <span class="el-dropdown-link el-icon-more"></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in operateOptions"
                :key="index"
                :command="item.label"
                :style="{ color: item.color }"
                ><i class="iconfont" :class="item.icon"></i>
                {{ item.label }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            type="primary"
            round
            size="mini"
            style="
              width: 84px;
              height: 32px;
              padding: 0;
              line-height: 32px;
              font-size: 14px;
            "
            @click="flightBtn"
            >处理</el-button
          >
        </div>
      </template>
    </common-table>
    <!-- 预警详情弹窗 -->
    <div v-if="warningVisible">
      <warning-dialog @closeWarningDialog="closeWarningDialog"></warning-dialog>
    </div>
    <!-- 忽略弹窗 -->
    <div v-if="neglectVisible">
      <NeglectDialog
        :neglectVisible="neglectVisible"
        @closeNeglectDialog="closeNeglectDialog"
      ></NeglectDialog>
    </div>
    <!-- 处理弹窗 -->
    <div v-if="handleVisible">
      <HandleDialog
        :handleVisible="handleVisible"
        @closeHandleDialog="closeHandleDialog"
      ></HandleDialog>
    </div>
  </div>
</template>

<script>
import CommonTable from "./CommonTable.vue";
import { mockList } from "@/utils/mock.js";
import WarningDialog from "./Template/WarningDialog.vue";
import EventInfo from "./Template/EventInfo.vue";
import NeglectDialog from "./Template/NeglectDialog.vue";
import HandleDialog from "./Template/HandleDialog.vue";
import { warningListAPI } from '@/api/TaskManager.js';
export default {
  name: "FlightTable",
  props: {},
  data() {
    return {
      warningVisible: false,
      neglectVisible: false,
      handleVisible: false,
      columns: [
        {
          prop: "taskName",
          label: "任务名称/类型",
          showOverflowTooltip: true,
          slot: true,
          minWidth: "200",
        },
        {
          prop: "airPort",
          label: "机场",
          showOverflowTooltip: true,
        },
        {
          prop: "creater",
          label: "发现时间",
          showOverflowTooltip: false,
          slot: true,
        },
        {
          prop: "status",
          label: "本轮状态",
          showOverflowTooltip: false,
          slot: true,
        },
        {
          prop: "operate",
          label: "操作",
          showOverflowTooltip: false,
          width: "200px",
          slot: true,
        },
      ],
      nameOptions: [
        "全部类型",
        "拍照",
        "直播",
        "全景",
        "三维",
        "正射",
        "全覆盖",
      ],
      statusOptions: [
        "全部状态",
        "已挂起",
        "执行终止",
        "待审核",
        "审核中",
        "待执行",
        "执行中",
        "制作中",
        "制作失败",
        "已完成",
        "已过期",
        "执行失败",
      ],
      operateOptions: [
        {
          label: "忽略",
          icon: "el-icon-hulve",
        },
        {
          label: "设为典型",
          icon: "el-icon-xingxing",
        },
      ],
    };
  },
  computed: {
    mockTableList() {
      return mockList;
    },
    statusType(status) {
      return function (status) {
        switch (status) {
          case "制作中":
            return "";
          case "已完成":
            return "success";
          case "制作失败":
            return "danger";
          case "待执行":
            return "warning";
          case "已过期":
            return "info";
          default:
            return "";
        }
      };
    },
  },
  mounted() {
    warningListAPI()
  },
  methods: {
    closeNeglectDialog() {
      this.neglectVisible = false;
    },
    closeWarningDialog() {
      this.warningVisible = false;
    },
    nameCommand(itemCommand) {
      console.log(itemCommand);
    },
    statusCommand(itemCommand) {},
    operateCommand(itemCommand) {
      console.log(itemCommand);
      if (itemCommand === "忽略") {
        this.neglectVisible = true;
      }
    },
    detailsBtn() {
      this.warningVisible = true;
    },
    flightBtn() {
      this.handleVisible = true;
    },
    closeHandleDialog() {
      this.handleVisible = false;
    },
  },
  components: {
    CommonTable,
    WarningDialog,
    EventInfo,
    NeglectDialog,
    HandleDialog,
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