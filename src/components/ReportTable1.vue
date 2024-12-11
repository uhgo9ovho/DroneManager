<template>
  <table>
    <thead>
    <tr>
      <th rowspan="2">无人机场</th>
      <th colspan="5">飞行架次(次)</th>
      <!--      <th>合计</th>-->
      <!--      <th>飞行时长</th>-->
      <!--      <th>飞行里程</th>-->
      <!--      <th rowspan="2">合计</th> &lt;!&ndash; 合并两行 &ndash;&gt;-->
      <th rowspan="2">飞行时长(分钟)</th> <!-- 合并两行 -->
      <th rowspan="2">飞行里程(米)</th> <!-- 合并两行 -->
    </tr>
    <tr>
      <!--      <th></th>-->
      <th>拍照</th>
      <th>全景</th>
      <th>三维</th>
      <th>正射</th>
      <th>合计</th>
      <!--      <th></th>-->
      <!--      <th></th>-->
      <!--      <th></th>-->
    </tr>
    </thead>
    <tbody>
    <tr v-for="(task, index) in flyTasks" :key="index">
      <td>{{ task.flyLine }}</td>
      <td>{{ task.photoNum }}</td>
      <td>{{ task.panoramaNum }}</td>
      <td>{{ task.threeDNum }}</td>
      <td>{{ task.orthoNum }}</td>
      <td>{{ task.photoNum + task.panoramaNum + task.threeDNum + task.orthoNum }}</td>
      <td>{{ task.flyTime.toFixed(0) }}</td>
      <td>{{ task.flyMileage.toFixed(0) }}</td>
    </tr>
    <tr>
      <td>总计</td>
      <td>{{ totalPhotoNum }}</td>
      <td>{{ totalPanoramaNum }}</td>
      <td>{{ totalThreeDNum }}</td>
      <td>{{ totalOrthoNum }}</td>
      <td>{{ totalFlightCount }}</td>
      <td>{{ totalFlyTime.toFixed(0) }}</td>
      <td>{{ totalFlyMileage.toFixed(0) }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  computed: {
    flyTasks() {
      return this.report.flyTask
    },
    totalFlightCount() {
      return this.flyTasks.reduce((sum, task) => sum + (task.photoNum + task.panoramaNum + task.threeDNum + task.orthoNum), 0)
    },
    totalPhotoNum() {
      return this.flyTasks.reduce((sum, task) => sum + task.photoNum, 0)
    },
    totalPanoramaNum() {
      return this.flyTasks.reduce((sum, task) => sum + task.panoramaNum, 0)
    },
    totalThreeDNum() {
      return this.flyTasks.reduce((sum, task) => sum + task.threeDNum, 0)
    },
    totalOrthoNum() {
      return this.flyTasks.reduce((sum, task) => sum + task.orthoNum, 0)
    },

    totalFlyTime() {
      return this.flyTasks.reduce((sum, task) => sum + task.flyTime, 0)
    },
    totalFlyMileage() {
      return this.flyTasks.reduce((sum, task) => sum + task.flyMileage, 0)
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
