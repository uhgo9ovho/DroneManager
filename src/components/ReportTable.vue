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
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
table {
  border: 1px solid #dddddd;
  width: 100%;
  margin: 10px 0;
}
thead th {
  background-color: #efefef;
  font-weight: bold;
}
</style>