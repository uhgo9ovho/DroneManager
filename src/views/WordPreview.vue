<template>
  <div class="word-preview">
    <div id="content">
      <!-- 标题部分 -->
      <div class="title-section">
        <h1>{{ title }}</h1>
        <h2>{{ subtitle }}</h2>
        <p class="date">日期：{{ report.reportTime }}</p>
      </div>

      <!-- 描述部分 -->
      <div class="description-section">
        <p>{{ description }}</p>
      </div>

      <!-- 总体情况 -->
      <div class="section">
        <h2>一、总体情况</h2>
        <p
          v-for="(paragraph, index) in overall"
          :key="'overall-' + index"
        >
          {{ paragraph }}
        </p>
      </div>

      <!-- 具体数据情况 -->
      <div class="section">
        <h2>二、具体数据情况</h2>
        <div class="sub-section">
          <h3>(一) 等效价值</h3>
          <ReportTable :columns="valueTable.columns" :rows="valueTable.rows"/>
        </div>
        <div class="sub-section">
          <h3>(二) 飞行汇总</h3>
          <!--          <ReportTable-->
          <!--            :columns="flightTable.columns"-->
          <!--            :rows="flightTable.rows"-->
          <!--          />-->
          <ReportTable1 :report="report"/>
        </div>
        <div class="sub-section">
          <h3>(三) 提交任务</h3>

          <div id="app" v-if="isShow">
            <PieChart :questData="questData"/>
          </div>
        </div>
        <div class="sub-section">
          <h3>(四) 问题汇总</h3>
          <!--          <ReportTable-->
          <!--            :columns="problemTable.columns"-->
          <!--            :rows="problemTable.rows"-->
          <!--          />-->
          <!--          <ReportTable2 :quest="report.quest"/>-->
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
            :headers="['成果机场 / 类型', '照片数量', '全景数量', '三维数量', '正射影像数量']"
            :data="productListData"
            :showTotal="true"
            :totalColumns="[1, 2, 3, 4]"
          />
        </div>
      </div>

      <!-- 附件部分 -->
      <div class="section">
        <h2>附件部分</h2>
        <div class="attachment">
          <div class="problemList" v-if="report.problemList !== null">
            <h3>问题详情</h3>
            <h3>详情列表({{ report.problemList.length }})</h3>
            <div v-for="(item, index) in report.problemList" :key="index" class="problem-container">
              <div class="problem-title">{{ index + 1 }}. {{ item.problemName }}</div>
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
                <img :src="'https://wurenji02.oss-cn-beijing.aliyuncs.com/' + item.photoDetail" alt="Problem Photo"
                     class="problem-image"
                >
                <img
                  :src="buildTianDiTuImageUrl(item.latitude, item.longitude)"
                  alt="Problem Location Map"
                  class="problem-image"
                >
              </div>

            </div>
          </div>
          <div class="modelDetails">
            <h3>模型详情</h3>
            <h3>全景模型({{ modelListLength }})</h3>
            <div v-for="(item, index) in report.modelList" :key="index" class="problem-container">
              <div class="problem-title">{{ index + 1 }}. {{ item.problemName }}</div>
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
                <img :src="'https://wurenji02.oss-cn-beijing.aliyuncs.com/' + item.photoDetail" alt="Problem Photo"
                     class="problem-image"
                >
                <img
                  :src="buildTianDiTuImageUrl(item.latitude, item.longitude)"
                  alt="Problem Location Map"
                  class="problem-image"
                >
              </div>

            </div>
            <h3>正射影像({{ report.orthoList.length }})</h3>
            <div v-for="(item, index) in report.orthoList" :key="index" class="problem-container">
              <div class="problem-title">{{ index + 1 }}. {{ item.problemName }}</div>
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
                <img :src="'https://wurenji02.oss-cn-beijing.aliyuncs.com/' + item.photoDetail" alt="Problem Photo"
                     class="problem-image"
                >
                <img
                  :src="buildTianDiTuImageUrl(item.latitude, item.longitude)"
                  alt="Problem Location Map"
                  class="problem-image"
                >
              </div>

            </div>

          </div>
          <!--          <div class="orthoList">-->
          <!--            <h3>模型详情</h3>-->
          <!--          </div>-->
        </div>
        <!--        <div-->
        <!--          class="attachment"-->
        <!--          v-for="(attachment, index) in report.attachments"-->
        <!--          :key="'attachment-' + index"-->
        <!--        >-->
        <!--          <h3>{{ attachment.title }}</h3>-->
        <!--          <ReportTable-->
        <!--            :columns="attachment.table.columns"-->
        <!--            :rows="attachment.table.rows"-->
        <!--          />-->
        <!--          <div class="image-section">-->
        <!--            <img-->
        <!--              :src="attachment.image"-->
        <!--              width="400"-->
        <!--            />-->
        <!--            <img-->
        <!--              :src="attachment.imageMap"-->
        <!--              width="400"-->
        <!--            />-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>

    <!-- 下载按钮 -->
    <div class="btn">
      <el-button
        icon="el-icon-download"
        type="primary"
        round
        @click="ratingReport"
      >下载
      </el-button
      >
    </div>
  </div>
</template>

<script>
import ReportTable from '@/components/ReportTable.vue'
import ReportTable1 from '@/components/ReportTable1.vue'
import ReportTable2 from '@/components/ReportTable2.vue'
import htmlDocx from 'html-docx-js/dist/html-docx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import photo from '../assets/images/login-background0.jpg'
import { getDayReportAPI } from '@/api/index.js'
import PieChart from '@/components/PieChart.vue'

export default {
  name: 'App',
  components: { ReportTable, ReportTable1, ReportTable2, PieChart },
  data() {
    return {
      title: '城市空天智慧管理平台',
      subtitle: '无人机巡检日报',
      description:
        '本报告根据日常无人机巡检工作包括使用人员提交任务、无人机执行任务、数据生产情况等进行统计汇总。',
      report: {
        reportTime: '2024.09.06',

        deviceNum: 1,
        sortieNum: 16,
        totalTime: 203,
        totalMileage: 102891,
        questNum: 2,
        photoQuestNum: 0,//，照片任务数量为0。
        panoramaQuestNum: 1,//，全景任务数量为1。
        orthoQuestNum: 1,//，正射任务数量为1。
        threeDQuestNum: 0,//，三维任务数量为0。
        executeQuestNum: 15,//，执行的任务总数为15。
        executePhotoNum: 0,//，执行的照片任务数量为0。
        executePanoramaQuestNum: 9,//，执行的全景任务数量为9。
        executeOrthoQuestNum: 6,//，执行的正射任务数量为6。
        executeThreeDQuestNum: 0,//，执行的三维任务数量为0。
        executePanoramaPhotoNum: 1052,//，执行的全景照片数量为1052张。
        findProblemNum: 1611,   //，发现的问题总数为1611个。
        replaceManualNum: 15,      //，需要人工替换的数量为15。
        flightMileage: 18.468104066766603,   //，飞行里程（另一种计算方式）为18.468104066766603公里。
        saveCost: 21179.738875374664,//，节省的成本为21179.738875374664元。
        reduceCarbon: 4986.388098026983,       //，减少的碳排放量为4986.388098026983千克。
        // tasks: ['拍照：8'],
        flyTask: [
          {
            'flyLine': '陕西-西安',
            'photoNum': 0,
            'panoramaNum': 9,
            'orthoNum': 6,
            'threeDNum': 0,
            'totalNum': 1052,
            'flyTime': 111.55,
            'flyMileage': 18468.104066766602
          }
        ],
        quest: {
          '正射': 5,
          '全景': 6
        },
        problem: [
          {
            'flyName': '裸土未覆盖',
            'flyTypeCount': 182
          }
        ],
        productList: [
          {
            'productName': '陕西-西安',
            'photoCount': 0,
            'panoramaCount': 9,
            'threeDCoun': 0,
            'orthophotoCount': 6
          }
        ],
        problemList: null,
        modelList: [
          {
            'problemName': '1206-0001-裸土未覆盖',
            'foundTime': '2024-12-06 11:07:45',
            'foundLocation': '陕西省西安市未央区谭家街道仁惠路',
            'photoDetail': 'system/1733454465612.png',
            'latitude': 34.34196411580419,
            'longitude': 108.98489432310971
          },
          {
            'problemName': '1206-0002-裸土未覆盖',
            'foundTime': '2024-12-06 11:17:46',
            'foundLocation': '陕西省西安市未央区谭家街道仁惠路',
            'photoDetail': 'system/1733455066051.png',
            'latitude': 34.34196411891683,
            'longitude': 108.9848943227395
          },
          {
            'problemName': '1206-0003-裸土未覆盖',
            'foundTime': '2024-12-06 11:17:52',
            'foundLocation': '陕西省西安市未央区谭家街道仁惠路',
            'photoDetail': 'system/1733455072890.png',
            'latitude': 34.34196412736992,
            'longitude': 108.984894321762
          }

        ],
        orthoList: [
          {
            'problemName': '1206-0057-裸土未覆盖',
            'foundTime': '2024-12-06 14:13:30',
            'foundLocation': '陕西省西安市未央区谭家街道仁惠路',
            'photoDetail': 'system/1733465609778.png',
            'latitude': 34.3419641598145,
            'longitude': 108.9848943183875
          },
          {
            'problemName': '1206-0058-裸土未覆盖',
            'foundTime': '2024-12-06 15:22:50',
            'foundLocation': '陕西省西安市未央区谭家街道仁惠路',
            'photoDetail': 'system/1733469770178.png',
            'latitude': 34.341964217754274,
            'longitude': 108.98489431384512
          },
          {
            'problemName': '1206-0059-裸土未覆盖',
            'foundTime': '2024-12-06 15:22:55',
            'foundLocation': '陕西省西安市未央区谭家街道仁惠路',
            'photoDetail': 'system/1733469775604.png',
            'latitude': 34.3419642186924,
            'longitude': 108.98489431378718
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
      isShow: false
      // questData: {
      //   '正射': null,
      //   '全景': null,
      // },
      // valueTable: {
      //   columns: ['替代人工', '节约成本', '减少碳排'],
      //   rows: [['16人次/102.891公里', '2.68万元', '0.03吨']]
      // },

      // flightTable: {
      //   columns: ['无人机场', '飞行架次(次)', '飞行时长(分钟)', '飞行里程(米)'],
      //   rows: [
      //     ['西安-周至', 16, 203, 102891],
      //     ['总计', 16, 203, 102891]
      //   ]
      // },
      // problemTable: {
      //   columns: ['问题类型', '数量'],
      //   rows: [
      //     ['积存建筑垃圾', 1],
      //     ['疑似烟火', 6]
      //   ]
      // },
      // resultTable: {
      //   columns: ['成果机场/类型', '照片', '全景', '三维', '正射'],
      //   rows: [
      //     ['西安-周至', 292, 7, 0, 0],
      //     ['总计', 292, 7, 0, 0]
      //   ]
      // }
    }
    // overall: [
    //   '2024年9月6日，共有1台无人机正常工作，共计飞行架次16次、飞行总时长203分钟、飞行里程102891米。',
    //   '当日提交任务总数8个，分别为拍照巡检任务8个；当日共执行任务16次，分别执行了拍照巡检任务5个、全景巡检任务11个；共拍摄照片292张，发现问题2个。',
    //   '由此，等效价值共计替代人工16次，102.891公里，节约成本2.68万元，减少碳排0.03吨。'
    // ],
  },
  methods: {
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
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&')
      return `${baseUrl}?${queryString}`
    },

    getDayReport() {
      const params = {
        orgId: localStorage.getItem('org_id'),
        begin_date: 1733626557000
      }
      getDayReportAPI(params)
        .then((res) => {
          if (res.code === 200) {
            this.report = res.data
            this.isShow = true
          }
        })
        .catch((err) => {
          // this.showMap = false;
        })
    },
    async exportFullScreenPdf() {
      try {
        // 目标 HTML 元素
        const element = document.getElementById('content')
        if (!element) {
          console.error('未找到目标 HTML 元素！')
          return
        }

        // 使用 html2canvas 截图整个元素
        const canvas = await html2canvas(element, {
          scale: 3, // 提高分辨率
          useCORS: true, // 支持跨域图片
          imageTimeout: 5000 // 延长图片加载超时时间
        })

        // 获取图片数据
        const imgData = canvas.toDataURL('image/png')

        // 创建 PDF
        const pdf = new jsPDF('p', 'mm', 'a4')

        // 计算 PDF 尺寸
        const pdfWidth = pdf.internal.pageSize.getWidth() // A4宽度
        const pdfHeight = pdf.internal.pageSize.getHeight() // A4高度

        // 图片实际显示高度
        const imgWidth = pdfWidth
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // 分页渲染
        let position = 0
        let heightLeft = imgHeight

        while (heightLeft > 0) {
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pdfHeight
          if (heightLeft > 0) {
            pdf.addPage()
            position = -heightLeft // 移动到下一页顶部
          }
        }

        // 下载 PDF
        pdf.save('无人机巡检日报.pdf')
      } catch (error) {
        console.error('导出 PDF 出错：', error)
      }
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
      link.download = this.report.subtitle + '无人机巡检日报.docx'
      link.click()
      URL.revokeObjectURL(link.href)
    },
    ratingReport() {
      const printHTML = document.querySelector('#content').innerHTML
      // 将打印的区域赋值，进行打印
      window.document.body.innerHTML = printHTML
      window.print() // 调用window打印方法
      window.location.reload() // 打印完成后重新加载页面
    }
  }
  ,
  computed: {
    questData() {
      return this.report.quest
    },
    modelListLength() {
      return this.report.modelList.length
    }
    ,
    problemData() {
      return this.report.problem.map(item => [item.flyName, item.flyTypeCount])
    }
    ,
    productListData() {
      return this.report.productList.map(item => [
        item.productName,
        item.photoCount,
        item.panoramaCount,
        item.threeDCoun,
        item.orthophotoCount
      ])
    }
    ,
    overall() {
      return [
        this.report.reportTime + '，共有' + this.report.deviceNum + '台无人机正常工作，共计飞行架次'
        + this.report.sortieNum + '次' + '、飞行总时长' + this.report.totalTime + '分钟' + '、飞行里程' + this.report.totalMileage.toFixed(0) + '米。',
        '当日提交任务总数' + this.report.questNum + '个，分别为照片任务' + this.report.photoQuestNum + '个、全景任务' + this.report.panoramaQuestNum +
        '个、正射任务' + this.report.orthoQuestNum + '个、三维任务' + this.report.threeDQuestNum + '个；当日共执行任务' + this.report.executeQuestNum +
        '次，分别执行了照片任务' + this.report.executePhotoNum + '个、全景任务' + this.report.executePanoramaQuestNum + '个、正射任务' + this.report.executeOrthoQuestNum +
        '个、三维任务' + this.report.executeThreeDQuestNum + '个；共拍摄照片' + this.report.executePanoramaPhotoNum + '张，发现问题' + this.report.findProblemNum + '个。',
        '由此，等效价值共计替代人工' + this.report.replaceManualNum + '次' + '、' + this.report.flightMileage.toFixed(3) + '公里' + '、节约成本' + this.report.saveCost.toFixed(2) + '万元' + '、减少碳排'
        + this.report.reduceCarbon.toFixed(2) + '吨。'
      ]
    }
    ,
    valueTable() {
      return {
        columns: ['替代人工', '节约成本', '减少碳排'],
        rows: [
          [
            this.report.replaceManualNum + '人次/' + this.report.flightMileage.toFixed(3) + '公里',
            this.report.saveCost.toFixed(2) + '万元',
            this.report.reduceCarbon.toFixed(2) + '吨'
          ]
        ]
      }
    }
    // flightTable(){
    //   return {
    //     columns: ['无人机场', '飞行架次(次)', '飞行时长(分钟)', '飞行里程(米)'],
    //     rows: [
    //       [
    //         this.report.replaceManualNum + '人次/' + this.report.flightMileage + '公里',
    //         this.report.saveCost + '万元',
    //         this.report.reduceCarbon + '吨'
    //       ]
    //       rows: [
    //         ['西安-周至', 16, 203, 102891],
    //         ['总计', 16, 203, 102891]
    //       ]
    //     ]
    //   };
    // }

  }
  ,
  mounted() {
    this.getDayReport()
    // const url = 'http://api.tianditu.gov.cn/staticimage?center=116.40,39.93&width=500&height=500&zoom=12&layers=vec_c,cva_c%20&markers=116.34867,39.94593&tk=3b33593a6ce1ae84375ec06b89a8aace'
    // fetch(url).then(res => {
    //
    // })
  }
}
</script>

<style scoped lang="scss">
/* 标题部分样式 */
.word-preview {
  position: relative;

  .btn {
    position: absolute;
    right: 20px;
    top: 0px;
  }
}

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
  border-collapse: collapse; /* 使边框更美观 */
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
  /* 水平居中
   height: 100vh; /* 或者你想要的任何高度 */
  width: 100%; /* 或者你想要的任何宽度 */
  text-align: center; /* 确保图片在水平方向上也居中（尽管flex已经处理了） */
}

.problem-image {
  width: 80%; /* 或者你想要的任何宽度，确保两个图片宽度相同 */
  max-width: 1280px; /* 可选：限制最大宽度 */
  margin: 10px 0; /* 可选：添加一些垂直间距 */
}
</style>
