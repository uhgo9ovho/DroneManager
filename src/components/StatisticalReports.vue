<template>
  <div class="flight-table">
    <common-table
      :tableList="flyRecordTable"
      :columns="columns"
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    >
      <!-- 内容插槽 -->
      <template #dateTime="{ row }">
        <data-time :row="row" :taskType="taskType"></data-time>
      </template>
      <template #operate="{row}">
        <div class="operate-box">
          <el-button type="text" @click="detailsBtn(row)" v-permissions="'wurenji:report:view'">查看</el-button>
        </div>
      </template>
    </common-table>
  </div>
</template>

<script>
import CommonTable from './CommonTable.vue'
import { mockList8 } from '@/utils/mock.js'
import DataTime from './Template/DataTime.vue'
import { getFlyRecordTableAPI } from '@/api'

export default {
  name: 'FlightTable',
  props: {
    reportParams: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      columns: [
        {
          prop: 'dateTime',
          label: '报告时间',
          showOverflowTooltip: true,
          slot: true,
          minWidth: '200'
        },
        {
          prop: 'flightNum',
          label: '飞机架次',
          showOverflowTooltip: true
        },
        {
          prop: 'questNum',
          label: '任务数',
          showOverflowTooltip: false
        },
        {
          prop: 'problemNum',
          label: '发现问题数',
          showOverflowTooltip: false
        },
        {
          prop: 'panoramicNum',
          label: '全景',
          showOverflowTooltip: false
        },
        {
          prop: 'threeDimensionalNum',
          label: '三维',
          showOverflowTooltip: false
        },
        {
          prop: 'orthographicNum',
          label: '正射',
          showOverflowTooltip: false
        },
        {
          prop: 'operate',
          label: '操作',
          showOverflowTooltip: false,
          width: '200px',
          slot: true
        }
      ],
      flyRecordTable: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      taskType:0
    }
  },
  computed: {
    mockTableList() {
      return mockList8.items
    }
  },
  mounted() {
    console.log('para', this.reportParams)
    this.getFlyRecordTable()

  },
  methods: {
    detailsBtn(row) {
      // this.$router.push({
      //   path: '/WordPreview',
      //   query: {
      //     dateTime: row.dateTime,
      //     tableType: this.reportParams.tableType
      //   }
      // })
      this.$emit('changeLookUp',row.dateTime,row.date, this.reportParams.tableType)

    },

    //获取报告列表
    getFlyRecordTable() {
      const params = {
        beginTime: this.reportParams.beginTime,
        endTime: this.reportParams.endTime,
        orgId: localStorage.getItem('org_id') || 0,
        tableType: this.reportParams.tableType,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.taskType = this.reportParams.tableType;
      getFlyRecordTableAPI(params)
        .then((res) => {
          if (res.code === 0) {
            this.flyRecordTable = res.rows
            // console.log('this.flyRecordTable', this.flyRecordTable)
            this.total = res.total
          } else {
          }
        })
        .catch(() => {
        })
    },
    pageChange(params) {
      this.pageNum = params.pageNum
      this.pageSize = params.pageSize
      this.getFlyRecordTable()
    },
    sizeChange(params) {
      this.pageNum = params.pageNum
      this.pageSize = params.pageSize
      this.getFlyRecordTable()
    }
  },
  components: {
    CommonTable,
    DataTime
  }
}
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
