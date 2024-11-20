<template>
  <div class="table-name-info">
    <div class="info-left">
      <img src="../../assets/images/fly_img.3924673b.png" alt="" />
    </div>
    <div class="info-right">
      <div class="task-name">{{ row.warnName }}</div>
      <div class="right-bottom">
        <div class="air-line-popover">
          <el-popover placement="bottom" trigger="click">
            <div
              v-for="(item, index) in row.airLine"
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
                >{{ item.lineName }}</span
              >
              <el-tag size="mini" :type="statusType(item.lineStatus)">{{
                item.lineStatus
              }}</el-tag>
            </div>
            <span slot="reference" style="cursor: pointer"></span>
          </el-popover>
        </div>
        <div class="info-details">{{ row.cycle_detail }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableNameInfo",
  props: {
    row: {
      type: Object,
      default: () => {},
    },
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
      width: 100%;
      height: 100%;
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