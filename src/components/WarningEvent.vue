<template>
  <div class="flight-table">
    <common-table
      :tableList="warningList"
      :columns="columns"
      :total="total"
      @sizeChange="sizeChange"
      @pageChange="pageChange"
      :pageSize="pageSize"
      :pageNum="pageNum"
    >
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
      <!-- <template #airPort-header>
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
      </template> -->
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
      <template #warnName="{ row }">
        <event-info :row="row"></event-info>
      </template>
      <template #status="{ row }">
        <el-tag :type="statusType(row.status)">{{
          statusTitle(row.status)
        }}</el-tag>
      </template>
      <template #operate="{ row }">
        <div class="operate-box">
          <el-button type="text" @click="detailsBtn(row)">详情</el-button>
          <el-dropdown @command="operateCommand(row)">
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
            @click="flightBtn(row)"
            >处理</el-button
          >
        </div>
      </template>
    </common-table>
    <!-- 预警详情弹窗 -->
    <div v-if="warningVisible">
      <warning-dialog
        @closeWarningDialog="closeWarningDialog"
        :row="itemRow"
      ></warning-dialog>
    </div>
    <!-- 忽略弹窗 -->
    <div v-if="neglectVisible">
      <NeglectDialog
        :neglectVisible="neglectVisible"
        @closeNeglectDialog="closeNeglectDialog"
        :itemRow="itemRow"
        @updateList="updateList"
      ></NeglectDialog>
    </div>
    <!-- 处理弹窗 -->
    <div v-if="handleVisible">
      <HandleDialog
        :handleVisible="handleVisible"
        @updateList="updateList"
        :itemRow="itemRow"
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
import { warningListAPI } from "@/api/TaskManager.js";
export default {
  name: "FlightTable",
  props: {},
  data() {
    return {
      warningVisible: false,
      neglectVisible: false,
      handleVisible: false,
      total: 0,
      columns: [
        {
          prop: "warnName",
          label: "任务名称/类型",
          showOverflowTooltip: true,
          slot: true,
          minWidth: "200",
        },
        {
          prop: "identifyAirPortName",
          label: "机场",
          showOverflowTooltip: true,
        },
        {
          prop: "identifyTime",
          label: "发现时间",
          showOverflowTooltip: false,
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
        // {
        //   label: "设为典型",
        //   icon: "el-icon-xingxing",
        // },
      ],
      pageNum: 1,
      pageSize: 10,
      warningList: [],
      itemRow: {},
    };
  },
  computed: {
    statusType() {
      return function (status) {
        switch (status) {
          case "0":
            return "warning";
          case "5":
            return 'info'
          default:
            break;
        }
      };
    },
    statusTitle(status) {
      return function (status) {
        switch (status) {
          case "0":
            return "新发现";
          case "1":
            return "已上报";
          case "2":
            return "已受理";
          case "3":
            return "已办结";
          case "4":
            return "已超期";
          case "5":
            return "已忽略";
          case "6":
            return "典型";
          case "7":
            return "取消典型";
          case "8":
            return "审核";
          default:
            return "";
        }
      };
    },
  },
  mounted() {
    this.getWarningList();
  },
  methods: {
    searchWarningName(val) {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orgId: localStorage.getItem('org_id'),
        warnName: val
      };
      warningListAPI(params).then((res) => {
        if (res.code === 200) {
          this.warningList = res.rows;
          this.total = res.total;
        }
      });
    },
    updateList() {
      this.getWarningList();
    },
    pageChange(val) {
      this.pageSize = val.pageSize;
      this.pageNum = val.pageNum;
      this.getWarningList();
    },
    sizeChange(val) {
      this.pageNum = val.pageNum;
      this.pageSize = val.pageSize;
      this.getWarningList();
    },
    getWarningList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orgId: localStorage.getItem('org_id')
      };
      warningListAPI(params).then((res) => {
        if (res.code === 200) {
          this.warningList = res.rows;
          this.total = res.total;
        }
      });
    },
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
      this.neglectVisible = true;
      this.itemRow = itemCommand;
    },
    detailsBtn(row) {
      this.itemRow = row;
      this.warningVisible = true;
    },
    flightBtn(row) {
      this.itemRow = row;
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