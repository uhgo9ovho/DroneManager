<template>
  <table>
    <thead>
    <tr>
      <th v-for="(header, index) in headers" :key="'header-' + index">{{ header }}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item, rowIndex) in data" :key="'row-' + rowIndex">
      <td v-for="(cell, cellIndex) in item" :key="'cell-' + rowIndex + '-' + cellIndex">
        {{ cell }}
      </td>
    </tr>
    <tr v-if="showTotal">
      <td>总计</td>
      <td v-for="(total, totalIndex) in totals" :key="'total-' + totalIndex">
        {{ total }}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    showTotal: {
      type: Boolean,
      default: false,
    },
    totalColumns: {
      type: Array,
      default: () => [], // 默认没有需要计算合计的列
    },
  },
  computed: {
    totals() {
      if (!this.showTotal || this.totalColumns.length === 0) {
        return [];
      }
      const totals = [];
      this.totalColumns.forEach(colIndex => {
        let sum = 0;
        this.data.forEach(row => {
          sum += Number(row[colIndex]); // 累加数值列的数字
        });
        totals.push(sum);
      });
      return totals;
    },
  },
};
</script>

<style scoped>
table {
  border: 1px solid #dddddd;
  width: 100%;
  margin: 10px 0;
  border-collapse: collapse; /* 使边框更美观 */
}

thead th {
  background-color: #efefef;
  font-weight: bold;
  text-align: center; /* 文本居中 */
  border: 1px solid #dddddd;
}

tbody tr td {
  text-align: center;
  border: 1px solid #dddddd;
}
</style>
