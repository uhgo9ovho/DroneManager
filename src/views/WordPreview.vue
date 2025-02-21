<template>
  <div
    class="word-preview-container"
    id="word-preview-container"
  >
    <div class="word-preview">
      <div id="content">
        <!-- 标题部分 -->
        <div class="title-section">
          <div class="title">{{ title }}</div>
          <div class="subtitle">{{ subtitle }}</div>
          <p v-if="tableType==1" class="date">日期：{{ formattedDate }}</p>
          <p v-if="tableType==2||tableType==3" class="date">日期：{{ formattedDate + '到' + getLastDate }}</p>
          <hr class="date-line"/>
          <hr class="date-line1"/>
        </div>

        <!-- 描述部分 -->
        <div class="description-section">
          <p class="text-indent-2em">{{ description }}</p>
        </div>

        <!-- 总体情况 -->
        <div class="section">
          <h2>一、总体情况</h2>
          <div v-for="(paragraph, index) in overall" :key="'overall-' + index" class="text-indent-2em">
            {{ paragraph }}
          </div>
        </div>

        <!-- 具体数据情况 -->
        <div class="section">
          <h2>二、具体数据情况</h2>
          <div class="sub-section">
            <h3>(一) 等效价值</h3>
            <ReportTable
              :columns="valueTable.columns"
              :rows="valueTable.rows"
            />
          </div>
          <div class="sub-section">
            <h3>(二) 飞行汇总</h3>

            <ReportTable1 :report="report"/>
          </div>
          <div class="sub-section" v-if="isShow && report.quest !== null">
            <h3>(三) 提交任务</h3>
            <div>
              <PieChart
                :questData="questData"
                @chart-exported="handleChartExported"
                v-if="isPieChartShow"
              />
              <img
                v-if="chartImage"
                :src="chartImage"
                id="img"
                alt="Chart Image"
                style="width: 100%; height: auto"
              />
            </div>
          </div>
          <div class="sub-section">
            <h3>(四) 问题汇总</h3>
            <ReportTable2
              :headers="['问题类型', '数量']"
              :data="problemData"
              :showTotal="true"
              :totalColumns="[1]"
            />
          </div>
          <div class="sub-section">
            <h3>(五) 成果汇总</h3>
            <ReportTable2
              :headers="[
                '成果机场 / 类型',
                '照片数量',
                '全景数量',
                '三维数量',
                '正射影像数量',
              ]"
              :data="productListData"
              :showTotal="true"
              :totalColumns="[1, 2, 3, 4]"
            />
          </div>
        </div>

        <!-- 附件部分 -->
        <div class="section" v-if="shouldShowDiv">
          <h2>附件部分</h2>
          <div class="attachment">
            <div class="problemList" v-if="report.problemList !== null">
              <h3 style="font-size: 30px; font-weight: 600">问题详情</h3>
              <h3>详情列表({{ problemListLength }})</h3>
              <div
                v-for="(item, index) in report.problemList"
                :key="item.foundTime"
                class="problem-container"
              >
                <div class="problem-title">
                  {{ index + 1 }}. {{ item.problemName }}
                </div>
                <table>
                  <tr>
                    <th>拍摄时间</th>
                    <td>{{ item.foundTime }}</td>
                  </tr>
                  <tr>
                    <th>拍摄位置</th>
                    <td>{{ item.foundLocation }}</td>
                  </tr>
                </table>
                <div class="image-container">
                  <img
                    :src="
                      'https://wurenji02.oss-cn-beijing.aliyuncs.com/' +
                      item.photoDetail
                    "
                    alt="Problem Photo"
                    class="problem-image"
                  />
                  <img
                    :src="buildTianDiTuImageUrl(item.latitude, item.longitude)"
                    alt="Problem Location Map"
                    class="problem-image"
                  />
                </div>
              </div>
            </div>
            <div class="modelDetails" v-if="report.modelList !== null">
              <h3 style="font-size: 30px; font-weight: 600">模型详情</h3>

              <h3>全景模型({{ modelListLength }}个)</h3>
              <div
                v-for="(item, index) in report.modelList"
                :key="item.foundTime"
                class="problem-container"
              >
                <div class="problem-title">
                  {{ index + 1 }}. {{ item.problemName }}
                </div>
                <table>
                  <tr>
                    <th>拍摄时间</th>
                    <td>{{ item.foundTime }}</td>
                  </tr>
                  <tr>
                    <th>拍摄位置</th>
                    <td>{{ item.foundLocation }}</td>
                  </tr>
                </table>
                <div class="image-container">
                  <img
                    :src="
                      'https://wurenji02.oss-cn-beijing.aliyuncs.com/' +
                      item.photoDetail
                    "
                    alt="Problem Photo"
                    class="problem-image"
                  />
                  <img
                    :src="buildTianDiTuImageUrl(item.latitude, item.longitude)"
                    alt="Problem Location Map"
                    class="problem-image"
                  />
                </div>
              </div>
              <h3>正射影像({{ orhtoListLength }})</h3>
              <div
                v-for="(item, index) in report.orthoList"
                :key="item.foundTime"
                class="problem-container"
              >
                <div class="problem-title">
                  {{ index + 1 }}. {{ item.problemName }}
                </div>
                <table>
                  <tr>
                    <th>拍摄时间</th>
                    <td>{{ item.foundTime }}</td>
                  </tr>
                  <tr>
                    <th>拍摄位置</th>
                    <td>{{ item.foundLocation }}</td>
                  </tr>
                </table>
                <div class="image-container">
                  <img
                    :src="
                      'https://wurenji02.oss-cn-beijing.aliyuncs.com/' +
                      item.photoDetail
                    "
                    alt="Problem Photo"
                    class="problem-image"
                  />
                  <img
                    :src="buildTianDiTuImageUrl(item.latitude, item.longitude)"
                    alt="Problem Location Map"
                    class="problem-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 下载按钮 -->
      <div class="btn">
        <el-button
          icon="el-icon-download"
          type="primary"
          round
          @click="ratingReport"
          v-if="showBtn"
        >下载
        </el-button>
        <el-button
          icon="el-icon-download"
          type="primary"
          round
          @click="shareReport"
          v-if="showBtn"
        >分享
        </el-button>
        <el-button
          type="primary"
          round
          @click="closeReport"
          v-if="showBtn"
          style="background-color: #000; color: #fff; border-color: #000"
        >关闭
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ReportTable from '@/components/ReportTable.vue'
import ReportTable1 from '@/components/ReportTable1.vue'
import ReportTable2 from '@/components/ReportTable2.vue'
import htmlDocx from 'html-docx-js/dist/html-docx'
import html2pdf from 'html2pdf.js'
import photo from '../assets/images/login-background0.jpg'
import { getDayReportAPI, getWeekReportAPI } from '@/api/index.js'
import PieChart from '@/components/PieChart.vue'
import axios from 'axios'
import { formatDate } from '@/utils'

export default {
  name: 'App',
  props: {
    itemRow: {
      type: Object,
      default: null
    }
  },
  components: { ReportTable, ReportTable1, ReportTable2, PieChart },
  data() {
    return {
      monthLastDate: '',
      showBtn: true,
      isPieChartShow: true,
      chartImage: null,
      loading: false,
      title: '城市空天智慧管理平台',
      description:
        '本报告根据日常无人机巡检工作包括使用人员提交任务、无人机执行任务、数据生产情况等进行统计汇总。',
      report: {
        date: '',
        reportTime: '',
        deviceNum: 0,
        sortieNum: 0,
        totalTime: 0,
        totalMileage: 0,
        questNum: 0,
        photoQuestNum: 0, //，照片任务数量为0。
        panoramaQuestNum: 0, //，全景任务数量为1。
        orthoQuestNum: 0, //，正射任务数量为1。
        threeDQuestNum: 0, //，三维任务数量为0。
        executeQuestNum: 0, //，执行的任务总数为15。
        executePhotoNum: 0, //，执行的照片任务数量为0。
        executePanoramaQuestNum: 0, //，执行的全景任务数量为9。
        executeOrthoQuestNum: 0, //，执行的正射任务数量为6。
        executeThreeDQuestNum: 0, //，执行的三维任务数量为0。
        executePanoramaPhotoNum: 0, //，执行的全景照片数量为1052张。
        findProblemNum: 0, //，发现的问题总数为1611个。
        replaceManualNum: 0, //，需要人工替换的数量为15。
        flightMileage: 0, //，飞行里程（另一种计算方式）为18.468104066766603公里。
        saveCost: 0, //，节省的成本为21179.738875374664元。
        reduceCarbon: 0, //，减少的碳排放量为4986.388098026983千克。
        // tasks: ['拍照：8'],
        flyTask: [
          {
            flyLine: '陕西-西安',
            photoNum: 0,
            panoramaNum: 0,
            orthoNum: 0,
            threeDNum: 0,
            totalNum: 0,
            flyTime: 0,
            flyMileage: 0
          }
        ],
        quest: {
          正射: 0,
          全景: 0
        },
        problem: [
          {
            flyName: '裸土未覆盖',
            flyTypeCount: 0
          }
        ],
        productList: [
          {
            productName: '陕西-西安',
            photoCount: 0,
            panoramaCount: 0,
            threeDCoun: 0,
            orthophotoCount: 0
          }
        ],
        problemList: null,
        modelList: [
          {
            problemName: '1206-0001-裸土未覆盖',
            foundTime: '2024-12-06 11:07:45',
            foundLocation: '陕西省西安市未央区谭家街道仁惠路',
            photoDetail: 'system/1733454465612.png',
            latitude: 34.34196411580419,
            longitude: 108.98489432310971
          },
          {
            problemName: '1206-0002-裸土未覆',
            foundTime: '2024-12-06 11:17:46',
            foundLocation: '陕西省西安市未央区谭家街道仁惠路',
            photoDetail: 'system/1733455066051.png',
            latitude: 34.34196411891683,
            longitude: 108.9848943227395
          },
          {
            problemName: '1206-0003-裸土未覆盖',
            foundTime: '2024-12-06 11:17:52',
            foundLocation: '陕西省西安市未央区谭家街道仁惠路',
            photoDetail: 'system/1733455072890.png',
            latitude: 34.34196412736992,
            longitude: 108.984894321762
          }
        ],
        orthoList: [
          {
            problemName: '1206-0057-裸土未覆盖',
            foundTime: '2024-12-06 14:13:30',
            foundLocation: '陕西省西安市未央区谭家街道仁惠路',
            photoDetail: 'system/1733465609778.png',
            latitude: 34.3419641598145,
            longitude: 108.9848943183875
          },
          {
            problemName: '1206-0058-裸土未覆盖',
            foundTime: '2024-12-06 15:22:50',
            foundLocation: '陕西省西安市未央区谭家街道仁惠路',
            photoDetail: 'system/1733469770178.png',
            latitude: 34.341964217754274,
            longitude: 108.98489431384512
          },
          {
            problemName: '1206-0059-裸土未覆盖',
            foundTime: '2024-12-06 15:22:55',
            foundLocation: '陕西省西安市未央区谭家街道仁惠路',
            photoDetail: 'system/1733469775604.png',
            latitude: 34.3419642186924,
            longitude: 108.98489431378718
          }
        ],
        attachments: [
          {
            title: '问题详情：积存建筑垃圾',
            table: {
              columns: ['属性', '值'],
              rows: [
                ['发现时间', '2024-09-06 13:04:16'],
                [
                  '发现位置',
                  '陕西省西安市周至县集贤镇南环路-水寨村东南约289米'
                ]
              ]
            },
            image: photo,
            imageMap:
              'http://api.tianditu.gov.cn/staticimage?center=116.40,39.93&width=500&height=500&zoom=12&layers=vec_c,cva_c%20&markers=116.34867,39.94593&tk=3b33593a6ce1ae84375ec06b89a8aace'
          },
          {
            title: '问题详情：疑似烟火',
            table: {
              columns: ['属性', '值'],
              rows: [
                ['发现时间', '2024-09-06 19:03:03'],
                ['发现位置', '陕西省西安市周至县九峰镇九峰派出所西南约243米']
              ]
            },
            image:
              'http://img.99wenzhangwang.com/d/file/202112/miymotiiz53.jpg',
            imageMap:
              'http://img.99wenzhangwang.com/d/file/202112/miymotiiz53.jpg'
          }
        ]
      },
      isShow: false,
      dateTime: null,
      tableType: null,
      dateScope: null
    }
  },
  methods: {
    handleChartExported(base64) {
      this.chartImage = base64
      this.isPieChartShow = false
    },
    closeReport() {
      this.$emit('closeLookUp')
    },
    buildTianDiTuImageUrl(latitude, longitude) {
      const baseUrl = 'http://api.tianditu.gov.cn/staticimage'
      const params = {
        center: `${longitude},${latitude}`,
        width: 1280,
        height: 1280,
        zoom: 12,
        layers: 'vec_c,cva_c%20',
        markers: `${longitude},${latitude}`,
        tk: '3b33593a6ce1ae84375ec06b89a8aace' // tk值
      }
      const queryString = Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join('&')
      return `${baseUrl}?${queryString}`
    },

    getDayReport() {
      const params = {
        orgId: localStorage.getItem('org_id'),
        begin_date: this.begin_date
      }
      this.loading = true
      getDayReportAPI(params)
        .then((res) => {
          if (res.code === 200) {
            this.report = res.data
            this.isShow = true
            this.loading = false
          } else if (res.code === 500) {
            // this.isShow = true
          }
        })
        .catch((err) => {
        })
    },

    getWeekReport() {
      const params = {
        orgId: localStorage.getItem('org_id'),
        begin_date: this.begin_date,
        end_date: this.end_date
      }
      getWeekReportAPI(params)
        .then((res) => {
          if (res.code === 200) {
            this.report = res.data
            this.isShow = true
          } else if (res.code === 500) {
            this.isShow = true
          }
        })
        .catch((err) => {
        })
    },
    getMonthReport() {
      const params = {
        orgId: localStorage.getItem('org_id'),
        begin_date: this.begin_date,
        end_date: this.end_date,
        tableType: this.tableType
      }
      getWeekReportAPI(params)
        .then((res) => {
          if (res.code === 200) {
            this.report = res.data
            this.isShow = true
          } else if (res.code === 500) {
            this.isShow = true
          }
        })
        .catch((err) => {
        })
    },

    downloadAsWord() {
      // 选择要导出的 HTML 部分
      const content = document.getElementById('content').innerHTML
      //内容样式
      const cssStyle = `<style>
                .title-section h1 {
                text-align: center;
                color: red;
                font-size: 32px;
                font-weight: bold;
                }
                .title-section h2 {
                text-align: center;
                color: red;
                font-size: 32px;
                font-weight: bold;
                }
                .date {
                text-align: center;
                color: #888888;
                font-size: 16px;
                }

                /* 附件部分样式 */
                .attachment {
                margin: 20px 0;
                border: 1px solid #dddddd;
                padding: 15px;
                border-radius: 8px;
                background-color: #f9f9f9;
                }
                .attachment h3 {
                color: #444444;
                font-size: 18px;
                }
                .image-section img {
                display: block;
                margin: 10px auto;
                border: 1px solid #ccc;
                width: 80%;
                max-width: 400px;
                height: auto;
                text-align: center;
                }`
      // 创建 Word 文件
      const blob = htmlDocx.asBlob(`
        <html>
          <head>
            <meta charset="UTF-8">
            <head>${cssStyle}</head>
          </head>

          <body>${content}</body>
        </html>
      `)

      // 创建文件下载链接
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = this.subtitle + '.docx'
      link.click()
      URL.revokeObjectURL(link.href)
    },

    ratingReport() {
      // const printHTML = document.querySelector("#content").innerHTML;
      // // 将打印的区域赋值，进行打印
      // window.document.body.innerHTML = printHTML;
      // window.print(); // 调用window打印方法
      // window.location.reload(); // 打印完成后重新加载页面

      // 获取你要转换为 PDF 的 HTML 元素
      const element = document.getElementById('content')
      // 自定义样式，改变PDF样式
      const opt = {
        margin: 20, // 页面边距
        filename: `${this.dateTime}${
          this.tableType == 1 ? '无人机巡检日报' : this.tableType == 2 ? '无人机巡检周报' : this.tableType == 3 ? '无人机巡检月报' :
            ''
        }.pdf`, // PDF 文件名
        image: { type: 'jpeg', quality: 0.98 }, // 图像格式
        pagebreak: {
          mode: ['css', 'legacy']
        },
        html2canvas: {
          scale: 4 // 图像的分辨率，可以提升质量
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } // PDF 页面尺寸和方向
      }
      console.log(opt)
      // 创建 PDF
      html2pdf().from(element).set(opt).save()
    },
    shareReport() {
      // 获取 localStorage 中的参数
      const localParam = localStorage.getItem('org_id')
      // 构造分享链接
      const currentUrl = this.getBaseUrl(window.location.href) + '/WordPreview'
      const shareUrl = `${currentUrl}?org_id=${encodeURIComponent(
        localParam
      )}&begin_date=${this.begin_date}&tableType=${this.tableType}&end_date=${
        this.end_date
      }` // 通过分享进入页面的链接
      // 使用 Clipboard API 复制到剪贴板
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          this.$message.success('URL 已成功复制到剪贴板！')
        })
        .catch((err) => {
          console.error('复制到剪贴板失败:', err)
          this.$message.error('复制失败，请手动复制。')
        })
      console.log('分享链接:', shareUrl)
    },
    getHrefInfo() {
      const urlParams = new URLSearchParams(window.location.search)
      console.log(urlParams)
      return {
        org_id: urlParams.get('org_id'),
        begin_date: urlParams.get('begin_date'),
        tableType: urlParams.get('tableType'),
        end_date: urlParams.get('end_date')
      }
    },
    getBaseUrl(url) {
      return url.match(/^(https?:\/\/[^\/]+)/)[0]
      // 或者使用 substring
      // return url.substring(0, url.indexOf('/', 8));
    }
  },
  computed: {
    formattedDate() {
      const date = new Date(this.report.reportTime)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份从0开始，需要加1
      const day = date.getDate().toString().padStart(2, '0') // 获取日期并补零
      return `${year}-${month}-${day}`
    },
    subtitle() {
      if (this.tableType == 1) {
        return '无人机巡检日报'
      } else if (this.tableType == 2) {
        return '无人机巡检周报'
      } else if (this.tableType == 3) {
        return '无人机巡检月报'
      }

    },
    getLastDate() {
      console.log(this.tableType, this.report.reportTime)
      let date
      if (this.getHrefInfo().tableType == 2 || this.getHrefInfo().tableType == 3) {
        date = new Date(this.report.reportTime)
      } else {
        date = new Date(this.itemRow.dateTime)
      }
      if (this.tableType == 2) {
        const now = date
        const monday = new Date(now)
        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6) // 周天是周一的基础上再加6天
        const res = sunday.toISOString().split('T')[0]
        return res
      } else if (this.tableType == 3) {
        const firstDayOfMonth = date
        console.log('didi1', firstDayOfMonth)
        // 获取下个月的第一天，然后减去1毫秒，得到本月的最后一天
        // 设置下个月的日期为1，然后减去1毫秒
        const nextMonth = firstDayOfMonth.getMonth() + 1
        const nextMonthFirstDay = new Date(firstDayOfMonth.getFullYear(), nextMonth, 1)
        const lastDayOfMonth = new Date(nextMonthFirstDay - 1)
        // 格式化日期为 YYYY-MM-DD 字符串（或其他你需要的格式）
        const year = lastDayOfMonth.getFullYear()
        const month = String(lastDayOfMonth.getMonth() + 1).padStart(2, '0')
        const day = String(lastDayOfMonth.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
    },
    shouldShowDiv() {
      // 判断tableType为2（周报）或3（月报），不显示附件
      if (this.tableType == 2 || this.tableType == 3) {
        return false
      }
      // 检查三个列表是否都为 null 或空数组
      if (
        (this.report.problemList == null || this.report.problemList.length === 0) &&
        (this.report.modelList == null || this.report.modelList.length === 0) &&
        (this.report.orthoList == null || this.report.orthoList.length === 0)
      ) {
        return false
      } else {
        return true
      }
    },
    problemListLength() {
      if (this.report.problemList) {
        return this.report.problemList.length
      }
    },

    modelListLength() {
      if (this.report.modelList) {
        return this.report.modelList.length
      }
    },

    orhtoListLength() {
      if (this.report.orthoList) {
        return this.report.orthoList.length
      }
    },

    begin_date() {
      const date = new Date(this.dateTime)
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', this.dateTime)
        return null
      }
      return date.getTime()
    },
    end_date() {
      if (this.tableType == 2 || this.tableType == 3) {
        let temp = this.getLastDate
        const date = new Date(temp)
        if (isNaN(date.getTime())) {
          console.error('Invalid date string:', date)
          return null
        }
        const endDate = new Date(date)
        return endDate.getTime()
      } else {
        return null
      }

    },

    questData() {
      return this.report.quest
    },

    problemData() {
      return this.report.problem.map((item) => [
        item.flyName,
        item.flyTypeCount
      ])
    },
    productListData() {
      return this.report.productList.map((item) => [
        item.productName,
        item.photoCount,
        item.panoramaCount,
        item.threeDCoun,
        item.orthophotoCount
      ])
    },

    overall() {
      const totalTime = this.report.totalTime || 0
      this.dateScope = this.formattedDate
      if (this.tableType == 2 || this.tableType == 3) {
        this.dateScope = this.formattedDate + '至' + this.getLastDate
      }
      return [
        this.dateScope +
        '，共有' +
        this.report.deviceNum +
        '台无人机正常工作，共计飞行架次' +
        this.report.sortieNum +
        '次' +
        '、飞行总时长' +
        totalTime +
        '分钟' +
        '、飞行里程' +
        this.report.totalMileage.toFixed(0) +
        '米。',
        '当日提交任务总数' +
        this.report.questNum +
        '个，分别为照片任务' +
        this.report.photoQuestNum +
        '个、全景任务' +
        this.report.panoramaQuestNum +
        '个、正射任务' +
        this.report.orthoQuestNum +
        '个、三维任务' +
        this.report.threeDQuestNum +
        '个；当日共执行任务' +
        this.report.executeQuestNum +
        '次，分别执行了照片任务' +
        this.report.executePhotoNum +
        '个、全景任务' +
        this.report.executePanoramaQuestNum +
        '个、正射任务' +
        this.report.executeOrthoQuestNum +
        '个、三维任务' +
        this.report.executeThreeDQuestNum +
        '个；共拍摄照片' +
        this.report.executePanoramaPhotoNum +
        '张，发现问题' +
        this.report.findProblemNum +
        '个。',
        '由此，等效价值共计减少人次' +
        this.report.replaceManualNum +
        '次' +
        '、' + '减少通行' +
        this.report.flightMileage.toFixed(3) +
        '公里' +
        '、节约成本' +
        this.report.saveCost.toFixed(2) +
        '元' +
        '、减少碳排' +
        this.report.reduceCarbon.toFixed(2) +
        '吨。'
      ]
    },

    valueTable() {
      return {
        columns: ['替代人工', '节约成本', '减少碳排'],
        rows: [
          [
            this.report.replaceManualNum +
            '人次/' +
            this.report.flightMileage.toFixed(3) +
            '公里',
            this.report.saveCost.toFixed(2) + '元',
            this.report.reduceCarbon.toFixed(2) + '吨'
          ]
        ]
      }
    }
  },

  mounted() {
    console.log(this.getHrefInfo(), 'this.getHrefInfo()')
    if (this.getHrefInfo().org_id) {
      let that = this
      that.showBtn = false
      this.tableType = this.getHrefInfo().tableType
      // 通过分享进入页面的逻辑
      if (this.getHrefInfo().tableType == 1) {
        axios({
          method: 'get',
          url: `${
            process.env.VUE_APP_BASE_API
          }/wurenji/report/getDayReport?orgId=${
            that.getHrefInfo().org_id
          }&begin_date=${that.getHrefInfo().begin_date}`,
          headers: {
            'Content-Type': 'application/json',
            tenant: 'test'
          }
        }).then(function(response) {
          let res = response.data
          that.report = res.data
          that.isShow = true
          that.loading = false
        })
      } else if (this.getHrefInfo().tableType == 2) {
        axios({
          method: 'get',
          url: `${
            process.env.VUE_APP_BASE_API
          }/wurenji/report/getWeekReport?orgId=${
            that.getHrefInfo().org_id
          }&begin_date=${that.getHrefInfo().begin_date}&end_date=${
            that.getHrefInfo().end_date
          }`,
          headers: {
            'Content-Type': 'application/json',
            tenant: 'test'
          }
        }).then(function(response) {
          console.log(response)
          let res = response.data
          that.report = res.data
          that.isShow = true
        })
      } else if (this.getHrefInfo().tableType == 3) {
        axios({
          method: 'get',
          url: `${
            process.env.VUE_APP_BASE_API
          }/wurenji/report/getWeekReport?orgId=${
            that.getHrefInfo().org_id
          }&begin_date=${that.getHrefInfo().begin_date}&end_date=${
            that.getHrefInfo().end_date
          }`,
          headers: {
            'Content-Type': 'application/json',
            tenant: 'test'
          }
        }).then(function(response) {
          let res = response.data
          that.report = res.data
          that.isShow = true
          this.monthLastDate = res.reportTime
        })
      }
    } else {
      // 正常进入页面的逻辑
      if (this.itemRow) {
        this.dateTime = this.itemRow.dateTime
        this.tableType = this.itemRow.tableType
        if (this.tableType == 1) {
          this.getDayReport()
        } else if (this.tableType == 2) {
          this.getWeekReport()
        } else if (this.tableType == 3) {
          this.getMonthReport()
        }
      }
    }
  },
  created() {
  }
}
</script>

<style scoped lang="scss">
@media print {
  /* 隐藏按钮 */
  .btn {
    display: none !important;
  }
  @page {
    /* 隐藏页眉和页脚 */
    @top-center {
      content: "";
    }
    @bottom-center {
      content: "";
    }
  }

  /* 如果有其他不需要打印的元素，可以在这里隐藏它们 */
  .no-print,
  .no-print * {
    display: none !important;
  }
}

/* 标题部分样式 */
.word-preview-container {
  ::-webkit-scrollbar {
    display: flex;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* 确保容器高度覆盖整个视口 */

  // background-color: #f2f2f2; /* 淡灰色背景 */
  //padding: 20px;
}

.word-preview {

  position: relative;
  height: 100vh;
  //height: auto;  /* 改为自动高度 */
  //min-height: 100vh; /* 保持最小高度 */
  //overflow: visible; /* 允许内容溢出 */
  //overflow: auto;
  width: 40%; /* 宽度占屏幕的40% */
  min-width: 760px; /* 最小宽度为760px */
  max-width: 1200px; /* 限制最大宽度，防止超大屏幕下内容过宽 */
  background-color: #fff;
  padding: 60px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  //border-radius: 8px;
  #content{
    margin-top: 1vw;
    //padding-right: 5vw;
    //padding-left: 5vw;
    height: 45vw;
    overflow-y: scroll;
  }
  .btn {
    position: absolute;
    //position: fixed; /* 固定位置 */
    //position: sticky;
    right: 40px; /* 距离右侧40px */
    //right: 32%; /* 距离右侧40px */

    top: 20px; /* 距离顶部20px */
    z-index: 999; /* 确保按钮在其他内容之上 */
  }
}

.title-section .title {
  text-align: center;
  color: red;
  font-size: 32px;
  font-weight: bold;
}

.title-section .subtitle {
  text-align: center;
  color: red;
  font-size: 32px;
  font-weight: bold;
}

.date {
  text-align: center;
  color: #888888;
  font-size: 16px;
}

.date-line {
  border: none;
  border-top: 4px solid red; /* 设置红色的横线 */
  width: 100%;
  margin-top: 10px;
  //margin-bottom: 2px;
}

.date-line1 {
  border: none;
  border-top: 2px solid red; /* 设置红色的横线 */
  width: 100%;
  margin-top: -5px;
  margin-bottom: 40px;
}

.text-indent-2em {
  text-indent: 2em; /* 使段落前有2个字的缩进 */
}

/* 附件部分样式 */

.attachment {
  margin: 20px 0;
  border: 1px solid #dddddd;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.attachment h3 {
  color: #444444;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-section img {
  margin: 10px;
  border: 1px solid #ccc;
  height: 300px;
}

table {
  border: 1px solid #dddddd;
  width: 100%;
  margin: 10px 0;
  border-collapse: collapse;
}

th {
  //background-color: #efefef;
  font-weight: bold;
  text-align: center; /* 文本居中 */
  border: 1px solid #dddddd;
}

tr td {
  text-align: center;
  border: 1px solid #dddddd;
}

.problem-container {
  margin-bottom: 20px;
}

.problem-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.image-container {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: center; /* 竖直居中 */
  justify-content: center;

  width: 100%;
  text-align: center;
}

.problem-image {
  width: 80%;
  max-width: 1280px; /* 可选：限制最大宽度 */
  margin: 10px 0; /* 可选：添加一些垂直间距 */
}

</style>
