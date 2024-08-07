<template>
  <div class="common-table">
    <!-- 公共列表组件 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.wdith : ''"
        :min-width="item.minWidth ? item.minWidth : ''"
        :show-overflow-tooltip="item.hidden"
      >
        
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "CommonTable",
  props: {
    tableData: {
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

<style>
</style>