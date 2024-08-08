<template>
  <div class="common-table">
    <div class="table-box">
      <el-table :data="tableList" style="width: 100%" height="100%">
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :show-overflow-tooltip="item.showOverflowTooltip"
        >
          <template v-if="item.slot" v-slot:default="scope">
            <slot
              :name="item.prop"
              :row="scope.row"
              :index="scope.$index"
            ></slot>
          </template>
          <template v-else v-slot:default="scope">
            <div>
              {{ scope.row[item.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">分页</div>
  </div>
</template>

<script>
export default {
  name: "CommonTable",
  props: {
    tableList: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
<style lang="scss">
.common-table {
  .table-box {
    height: calc(100vh - 212px);
  }
  .pagination {
    width: 100%;
    height: 76px;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0 !important;
    text-align: center;
  }
}
</style>