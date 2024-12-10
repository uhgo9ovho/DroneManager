<template>
  <table>
    <thead>
    <tr>
      <th v-for="(column, index) in columns" :key="'column-' + index">{{ column }}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(row, rowIndex) in rows" :key="'row-' + rowIndex">
      <td v-for="(cell, cellIndex) in row" :key="'cell-' + rowIndex + '-' + cellIndex">
        {{ cell }}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    rows: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
table {
  border: 1px solid #dddddd;
  width: 100%;
  margin: 10px 0;
  border-collapse: collapse; /* 使边框更美观 */
  width: 100%; /* 或者指定一个具体的宽度 */
  table-layout: fixed; /* 这将确保列宽是固定的 */
}

th, td {
  width: 33.33%; /* 如果三列，则每列占 1/3 的宽度 */
  word-wrap: break-word; /* 如果内容太长，允许换行 */
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
