<template>
  <div class="device-log">
    <div class="top">
      <div class="operate-box">
        <div class="time-picker-box">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDateRangeChange"

            value-format="yyyy-MM-dd HH:mm:ss"
          >
            <!--            format="yyyy-MM-dd HH:mm:ss"-->
          </el-date-picker>
        </div>
        <div
          class="serach-box"
          :class="{ 'lang-search-box': checked }"
        >
          <el-input
            prefix-icon="el-icon-search"
            placeholder="请输入报警信息搜索"
            @focus="focus"
            @blur="blur"
            v-model="searchText"
            clearable
            @input="handleSearch"
          ></el-input>
        </div>
        <div class="create-task-btn">
          <!--          icon="el-icon-plus"-->

          <el-button round @click="getDeviceList"
          >搜索
          </el-button
          >
        </div>

      </div>
    </div>

    <common-table
      :tableList="deviceList"
      :columns="columns"
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    >
      <template #level="{ row }">
        <el-tag :type="row.level | filterType">{{
            row.level | filterLevel
          }}
        </el-tag>
      </template>
      <template #module="{ row }">
        {{ row.module | filterModule }}
      </template>
    </common-table>
  </div>
</template>

<script>
import CommonTable from '../components/CommonTable.vue'
import { deviceInfoAPI } from '@/api/TaskManager.js'

export default {
  data() {
    return {
      checked: false,
      dateRange: [],
      searchText: '',
      startTime: '',
      endTime: '',

      deviceList: [],
      columns: [
        {
          prop: 'level',
          label: '日志类型',
          showOverflowTooltip: true,
          slot: true
        },
        {
          prop: 'module',
          label: '模块',
          showOverflowTooltip: true,
          slot: true
        },
        {
          prop: 'messageZh',
          label: '报警信息',
          minWidth: 200
        },
        {
          prop: 'createTime',
          label: '预警时间',
          showOverflowTooltip: false
        }
      ],
      total: 0,
      pageNum: 1,
      pageSize: 10
    }
  },
  filters: {
    filterLevel(level) {
      switch (level) {
        case 0:
          return '通知'
        case 1:
          return '轻微警告'
        case 2:
          return '严重警告'
        default:
          break
      }
    },
    filterType(level) {
      switch (level) {
        case 0:
          return ''
        case 1:
          return 'warning'
        case 2:
          return 'danger'
        default:
          break
      }
    },
    filterModule(module) {
      switch (module) {
        case 0:
          return '飞行任务'
        case 1:
          return '设备管理'
        case 2:
          return '媒体'
        case 3:
          return 'hms'
        default:
          break
      }
    }
  },
  components: {
    CommonTable
  },
  methods: {
    focus() {
      this.checked = true
    },
    blur() {
      this.checked = false
    },

    handleDateRangeChange(value) {
      if (value) {
        console.log(value);
        const val = value.map(item => {
          const itemMap = item.split(' ')[0]
          return itemMap
        })
        console.log(val);
        
        const [startTime, endTime] = val
        this.startTime = startTime
        this.endTime = endTime + ' 23:59:59'
        console.log(`开始时间: ${startTime}`)
        console.log(`结束时间: ${endTime}`)
      } else {
        console.log('时间范围已清除')
        this.startTime = ''
        this.endTime = ''
      }
      this.getDeviceList()
    },

    handleSearch(value) {
      this.searchText = value
      // console.log(`输入的消息: ${value}`)
    },

    async getDeviceList() {
      const params = {
        startTime: this.startTime,
        endTime: this.endTime,
        messageZh: this.searchText,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }

      try {
        const res = await deviceInfoAPI(params)
        if (res.code === 200) {
          this.deviceList = res.rows
          this.total = res.total
          // console.log(res)
        } else {
          console.error('获取设备日志失败', res)
        }
      } catch (error) {
        console.error('请求接口出错', error)
      }
    },

    pageChange(params) {
      this.pageNum = params.pageNum
      this.pageSize = params.pageSize
      this.getDeviceList()
    },
    sizeChange(params) {
      this.pageNum = params.pageNum
      this.pageSize = params.pageSize
      this.getDeviceList()
    }
  },
  mounted() {
    this.getDeviceList()
  }
}
</script>

<style lang="scss">
.device-log {
  width: 100%;
  margin-top: 20px;
  padding-right: 26px;
  padding-left: 32px;

  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .time-picker-box {
      width: 300px;
      flex: 1;

    }

    .operate-box {
      display: flex;
      flex: 1;

      .serach-box {
        margin-right: 20px;
        width: 100px;
        transition: width 0.5s;

        .el-input {
          border-radius: 20px;
          width: 100%;

          .el-input__inner {
            border-radius: 20px;
            width: 100%;
            border-color: #dcdfe6;
          }
        }
      }

      .lang-search-box {
        width: 360px;
      }

      .create-task-btn {
        .el-button {
          background-color: #000;
          color: #fff;
          border-color: #000;
        }
      }
    }
  }

}
</style>
