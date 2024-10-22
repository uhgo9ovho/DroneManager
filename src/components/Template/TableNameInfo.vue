<template>
  <div class="table-name-info">
    <div class="info-left">
      <img src="../../assets/images/fly_img.3924673b.png" alt="" />
    </div>
    <div class="info-right">
      <div class="task-name">{{ row.taskName }}</div>
      <div class="right-bottom">
        <div class="air-line-popover">
          <el-popover placement="bottom" trigger="click" popper-class="airLine" @show="showPopover">
            <div
              v-for="(item, index) in airLineList"
              :key="index"
              style="margin: 8px 0"
            >
              <span
                style="
                  text-overflow: ellipsis;
                  word-break: break-word;
                  white-space: nowrap;
                  overflow: hidden;
                  font-family: PingFangSC-Medium;
                  font-weight: 500;
                  font-size: 14px;
                  color: #1d1d1f;
                  line-height: 22px;
                  margin-bottom: 4px;
                  margin-right: 10px;
                "
                >{{ item }}</span
              >
              <el-tag size="mini" :type="statusType(item.lineStatus)">{{
                '待执行'
              }}</el-tag>
            </div>
            <span slot="reference" style="cursor: pointer"
              >{{ row.airlineNumber }}条航线<i class="el-icon-arrow-down"
                >，</i
              ></span
            >
          </el-popover>
        </div>
        <div class="info-details">{{ row.note }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { searchLineAPI } from '@/api/TaskManager.js';
export default {
  name: "TableNameInfo",
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      airLineList: []
    }
  },
  computed: {
    statusType(status) {
      return function (status) {
        switch (status) {
          case "待执行":
            return "";
          case "执行失败":
            return "danger";
          case "已执行":
            return "success";
          default:
            return "";
        }
      };
    },
  },
  methods: {
    showPopover() {
      searchLineAPI(this.row.taskId).then(res => {
        console.log(res);
        if(res.code === 200) {
          let rows = res.rows;
          this.airLineList = rows.map(item => item.lineName);
        }
      })
      
      
    }
  }
};
</script>

<style lang="scss">
.table-name-info {
  display: flex;
  justify-content: left;
  align-items: center;
  .info-left {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    margin-right: 18px;
    img {
      width: 48px;
      height: 48px;
      border-radius: 8px;
    }
  }
  .info-right {
    .task-name {
      text-overflow: ellipsis;
      word-break: break-word;
      white-space: nowrap;
      overflow: hidden;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      font-size: 14px;
      color: #1d1d1f;
      line-height: 22px;
      margin-bottom: 4px;
    }
    .right-bottom {
      font-size: 13px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
}
</style>