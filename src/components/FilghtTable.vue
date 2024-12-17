<template>
  <div class="flight-table">
    <common-table
      :tableList="filghtList"
      :columns="columns"
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    >
      <!-- 自定义表头 -->
      <template #taskName-header>
        <span>任务名称/类型</span>
        <el-dropdown @command="nameCommand">
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in nameOptions"
              :key="index"
              :command="item"
            >{{ item }}
            </el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template #status-header="{ row }">
        <span>本轮状态</span>
        <el-dropdown @command="statusCommand">
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in statusOptions"
              :key="index"
              :command="beforeHandleCommand(row)"
            >{{ item }}
            </el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <!-- 内容插槽 -->
      <template #taskName="{ row }">
        <table-name-info :row="row"></table-name-info>
      </template>
      <template #creater="{ row }">
        <div>{{ row.taskCreateTime }}</div>
        <div>{{ row.nickName }}</div>
      </template>
      <template #status="{ row }">
        <el-tag :type="statusType(row.taskStatus)">{{
            row.taskStatus | filterStatus
          }}
        </el-tag>
        <span style="margin-left: 10px"
        >当前轮次/总轮次({{ row.currentRound ? row.currentRound : 0 }}/{{ row.totalRound ? row.totalRound : 0 }})</span
        >
      </template>
      <template #operate="{ row }">
        <div class="operate-box">
          <el-button type="text" @click="detailsBtn(row)"
          >详情
          </el-button
          >
          <el-dropdown @command="operateCommand">
            <span class="el-dropdown-link el-icon-more"></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in operateOptions"
                :key="index"
                :command="beforeHandleCommand(row, item.label)"
                :style="{ color: item.color }"
                v-show="!(item.label == '成果' && row.taskType !== 2)"
              ><i class="iconfont" :class="item.icon"></i>
                {{ item.label }}
              </el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            type="primary"
            round
            size="mini"
            class="iconfont el-icon-guijifeihang"
            style="
              width: 84px;
              height: 32px;
              padding: 0;
              line-height: 32px;
              font-size: 14px;
            "
            @click="flightBtn(row)"
          >飞行
          </el-button
          >
        </div>
      </template>
    </common-table>
    <!-- 详情弹窗、飞行弹窗 -->
    <div v-if="flightVisible">
      <flight-dialog
        @closeDialog="closeDialog"
        :detailsShow="detailsShow"
        :filghtShow="filghtShow"
        :row="row"
      ></flight-dialog>
    </div>
    <!-- 全景预览弹窗 -->
    <div v-if="panoramicVisible">
      <PanoramicDialog @closeQJDialog="closeQJDialog" :flightDataInfo="flightDataInfo"></PanoramicDialog>
    </div>
    <!-- 飞行排期弹窗 -->
    <div v-if="flyDateVisible">
      <FlightDataDialog
        :flyDateVisible="flyDateVisible"
        :flightDataInfo="flightDataInfo"
        @closeFlightDateDialog="closeFlightDateDialog"
        @changeVisible="changeVisible"
      ></FlightDataDialog>
    </div>

    <!-- 挂起弹窗 -->
    <!--    <div v-if="hangupVisible">-->
    <el-dialog
      title="确定要挂起该任务？"
      :visible.sync="hangupVisible"
      center
      top="60vh"
    >
<!--      width="50%"-->

      <!--      :before-close="handleClose"-->

      <span>挂起任务后该任务下所有航线将取消排期，不会被执行。恢复任务后，可能需要重新设置排期！</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="hangupVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleSuspend">确 定</el-button>
  </span>
    </el-dialog>
    <!--    </div>-->
  </div>
</template>

<script>
import CommonTable from './CommonTable.vue'
import TableNameInfo from './Template/TableNameInfo.vue'
import FlightDialog from './Template/FlightDialog.vue'
import PanoramicDialog from './Template/PanoramicDialog.vue'
import FlightDataDialog from './Template/FlightDataDialog.vue'
import { taskListAPI, deleteTaskAPI, upDataTaskStatusAPI } from '@/api/TaskManager.js'

export default {
  name: 'FlightTable',
  props: {},
  data() {
    return {
      taskId: '',
      wrjFullview: null,
      flightDataInfo: {},
      total: 0,
      detailsShow: false,
      flightVisible: false,
      filghtShow: false,
      panoramicVisible: false,
      flyDateVisible: false,
      hangupVisible: false,
      filghtList: [],
      columns: [
        {
          prop: 'taskName',
          label: '任务名称/类型',
          showOverflowTooltip: true,
          slot: true,
          minWidth: '220'
        },
        {
          prop: 'airportName',
          label: '机场',
          showOverflowTooltip: true
        },
        {
          prop: 'creater',
          label: '创建人/时间',
          showOverflowTooltip: false,
          slot: true
        },
        {
          prop: 'status',
          label: '本轮状态',
          showOverflowTooltip: false,
          slot: true
        },
        {
          prop: 'operate',
          label: '操作',
          showOverflowTooltip: false,
          width: '200px',
          slot: true
        }
      ],
      nameOptions: [
        '全部类型',
        '拍照',
        '直播',
        '全景',
        '三维',
        '正射',
        '全覆盖'
      ],
      statusOptions: [
        '全部状态',
        '已挂起',
        '执行终止',
        '待审核',
        '审核中',
        '待执行',
        '执行中',
        '制作中',
        '制作失败',
        '已完成',
        '已过期',
        '执行失败'
      ],
      operateOptions: [
        {
          label: '成果',
          icon: 'el-icon-zhaochengguo'
        },
        {
          label: '排期',
          icon: 'el-icon-paiqi'
        },
        {
          label: '挂起',
          icon: 'el-icon-3duihuacopy'
        },
        {
          label: '删除',
          icon: 'el-icon-shanchu',
          color: 'red'
        }
      ],
      pageNum: 1,
      pageSize: 10,
      row: {}
    }
  },
  mounted() {
    this.initList()
  },
  filters: {
    filterStatus(val) {
      let value = ''
      switch (val) {
        case 0:
          value = '待审核'
          break
        case 1:
          value = '待执行'
          break
        case 2:
          value = '执行中'
          break
        case 3:
          value = '已完成'
          break
        case 4:
          value = '已挂起'
          break
        default:
          break
      }
      return value
    }
  },
  computed: {
    statusType(status) {
      return function(status) {
        switch (status) {
          case 2:
            return ''
          case 3:
            return 'success'
          case 1:
            return 'primary'
          case 0:
            return 'info'
          default:
            return ''
        }
      }
    }
  },
  methods: {
    upDataTaskStatus() {
      upDataTaskStatusAPI(this.taskId).then((res) => {
        if (res.code === 200) {
          this.taskId = ''
          this.initList()
          this.$message({
            type: 'success',
            message: '挂起成功!'
          })
        } else {
          this.$message.error('挂起失败')
        }
      })
    },

    // handleClose(done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done()
    //     })
    //     .catch(_ => {
    //     })
    // },

    handleSuspend() {
      this.hangupVisible = false
      this.upDataTaskStatus()
    },

    searchTableName(val) {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        taskName: val
      }
      taskListAPI(params).then((res) => {
        if (res.code === 200) {
          this.filghtList = res.rows
          this.total = res.total
        }
      })
    },

    changeVisible() {
      this.flyDateVisible = false
      this.initList()
    },
    initList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      taskListAPI(params).then((res) => {
        if (res.code === 200) {
          this.filghtList = res.rows
          this.total = res.total
        }
      })
    },
    sizeChange(params) {
      taskListAPI(params).then((res) => {
        if (res.code === 200) {
          this.filghtList = res.rows
          this.total = res.total
        }
      })
    },
    pageChange(params) {
      taskListAPI(params).then((res) => {
        if (res.code === 200) {
          this.filghtList = res.rows
          this.total = res.total
        }
      })
    },
    nameCommand(itemCommand) {
      console.log(itemCommand)
    },
    beforeHandleCommand(row) {
      return row
    },
    statusCommand(itemCommand) {
    },
    beforeHandleCommand(row, label) {
      return {
        row,
        label
      }
    },
    operateCommand(itemCommand) {
      console.log(itemCommand)
      switch (itemCommand.label) {
        case '成果':
          this.panoramicVisible = true
          this.flightDataInfo = itemCommand.row
          break
        case '排期':
          this.flightDataInfo = itemCommand.row
          this.flyDateVisible = true
          break
        case '挂起':
          this.hangupVisible = true
          this.taskId = itemCommand.row.taskId
          console.log('taskId:', this.taskId)
          console.log('挂起被点击')
          break
        case '删除':
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteTaskAPI(itemCommand.row.taskId).then((res) => {
              if (res.code === 200) {
                this.initList()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              } else {
                this.$message.error('删除失败')
              }
            })
          })
          break
        default:
          break
      }
    },
    detailsBtn(row) {
      this.row = row
      this.flightVisible = true
      this.filghtShow = false
      this.detailsShow = true
    },
    flightBtn(row) {
      this.row = row
      this.flightVisible = true
      this.detailsShow = false
      this.filghtShow = true
    },
    closeDialog() {
      this.flightVisible = false
    },
    closeQJDialog() {
      this.panoramicVisible = false
    },
    closeFlightDateDialog() {
      this.flyDateVisible = false
    }
  },
  components: {
    CommonTable,
    TableNameInfo,
    FlightDialog,
    PanoramicDialog,
    FlightDataDialog
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

.el-dialog {
  background: #fff;
  border-radius: 12px;
  padding: 24px 24px 16px 32px;
  overflow: hidden; /* 防止内容溢出 */
  top: 40% !important;
  transform: translateY(-50%) !important;
  width: 470px;
  //height: 230px;
}
</style>
