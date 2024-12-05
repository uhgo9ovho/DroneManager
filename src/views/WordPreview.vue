<template>
  <div class="word-preview">
    <div id="content">
      <!-- 标题部分 -->
      <div class="title-section">
        <h1>{{ report.title }}</h1>
        <h2>{{ report.subtitle }}</h2>
        <p class="date">日期：{{ report.date }}</p>
      </div>

      <!-- 描述部分 -->
      <div class="description-section">
        <p>{{ report.description }}</p>
      </div>

      <!-- 总体情况 -->
      <div class="section">
        <h2>一、总体情况</h2>
        <p
          v-for="(paragraph, index) in report.overall"
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
          <ReportTable :columns="valueTable.columns" :rows="valueTable.rows" />
        </div>
        <div class="sub-section">
          <h3>(二) 飞行汇总</h3>
          <ReportTable
            :columns="flightTable.columns"
            :rows="flightTable.rows"
          />
        </div>
        <div class="sub-section">
          <h3>(三) 提交任务</h3>
          <ul>
            <li v-for="(task, index) in report.tasks" :key="'task-' + index">
              {{ task }}
            </li>
          </ul>
        </div>
        <div class="sub-section">
          <h3>(四) 问题汇总</h3>
          <ReportTable
            :columns="problemTable.columns"
            :rows="problemTable.rows"
          />
        </div>
        <div class="sub-section">
          <h3>(五) 成果汇总</h3>
          <ReportTable
            :columns="resultTable.columns"
            :rows="resultTable.rows"
          />
        </div>
      </div>

      <!-- 附件部分 -->
      <div class="section">
        <h2>附件部分</h2>
        <div
          class="attachment"
          v-for="(attachment, index) in report.attachments"
          :key="'attachment-' + index"
        >
          <h3>{{ attachment.title }}</h3>
          <ReportTable
            :columns="attachment.table.columns"
            :rows="attachment.table.rows"
          />
          <div class="image-section">
            <img
              :src="attachment.image"
              width="400"
            />
            <img
              :src="attachment.imageMap"
              width="400"
            />
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
        >下载</el-button
      >
    </div>
  </div>
</template>

<script>
import ReportTable from "@/components/ReportTable.vue";
import htmlDocx from "html-docx-js/dist/html-docx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import photo from "../assets/images/login-background0.jpg";
export default {
  name: "App",
  components: { ReportTable },
  data() {
    return {
      report: {
        title: "城市空天智慧管理平台",
        subtitle: "无人机巡检日报",
        date: "2024.09.06",
        description:
          "本报告根据日常无人机巡检工作包括使用人员提交任务、无人机执行任务、数据生产情况等进行统计汇总。",
        overall: [
          "2024年9月6日，共有1台无人机正常工作，共计飞行架次16次、飞行总时长203分钟、飞行里程102891米。",
          "当日提交任务总数8个，分别为拍照巡检任务8个；当日共执行任务16次，分别执行了拍照巡检任务5个、全景巡检任务11个；共拍摄照片292张，发现问题2个。",
          "由此，等效价值共计替代人工16次，102.891公里，节约成本2.68万元，减少碳排0.03吨。",
        ],
        tasks: ["拍照：8"],
        attachments: [
          {
            title: "问题详情：积存建筑垃圾",
            table: {
              columns: ["属性", "值"],
              rows: [
                ["发现时间", "2024-09-06 13:04:16"],
                [
                  "发现位置",
                  "陕西省西安市周至县集贤镇南环路-水寨村东南约289米",
                ],
              ],
            },
            image: photo,
            imageMap:
              "http://api.tianditu.gov.cn/staticimage?center=116.40,39.93&width=500&height=500&zoom=12&layers=vec_c,cva_c%20&markers=116.34867,39.94593&tk=3b33593a6ce1ae84375ec06b89a8aace",
          },
          {
            title: "问题详情：疑似烟火",
            table: {
              columns: ["属性", "值"],
              rows: [
                ["发现时间", "2024-09-06 19:03:03"],
                ["发现位置", "陕西省西安市周至县九峰镇九峰派出所西南约243米"],
              ],
            },
            image:
              "http://img.99wenzhangwang.com/d/file/202112/miymotiiz53.jpg",
            imageMap:
              "http://img.99wenzhangwang.com/d/file/202112/miymotiiz53.jpg",
          },
        ],
      },
      valueTable: {
        columns: ["替代人工", "节约成本", "减少碳排"],
        rows: [["16人次/102.891公里", "2.68万元", "0.03吨"]],
      },
      flightTable: {
        columns: ["无人机场", "飞行架次(次)", "飞行时长(分钟)", "飞行里程(米)"],
        rows: [
          ["西安-周至", 16, 203, 102891],
          ["总计", 16, 203, 102891],
        ],
      },
      problemTable: {
        columns: ["问题类型", "数量"],
        rows: [
          ["积存建筑垃圾", 1],
          ["疑似烟火", 1],
        ],
      },
      resultTable: {
        columns: ["成果机场/类型", "照片", "全景", "三维", "正射"],
        rows: [
          ["西安-周至", 292, 7, 0, 0],
          ["总计", 292, 7, 0, 0],
        ],
      },
    };
  },
  methods: {
    async exportFullScreenPdf() {
      try {
        // 目标 HTML 元素
        const element = document.getElementById("content");
        if (!element) {
          console.error("未找到目标 HTML 元素！");
          return;
        }

        // 使用 html2canvas 截图整个元素
        const canvas = await html2canvas(element, {
          scale: 3, // 提高分辨率
          useCORS: true, // 支持跨域图片
          imageTimeout: 5000, // 延长图片加载超时时间
        });

        // 获取图片数据
        const imgData = canvas.toDataURL("image/png");

        // 创建 PDF
        const pdf = new jsPDF("p", "mm", "a4");

        // 计算 PDF 尺寸
        const pdfWidth = pdf.internal.pageSize.getWidth(); // A4宽度
        const pdfHeight = pdf.internal.pageSize.getHeight(); // A4高度

        // 图片实际显示高度
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // 分页渲染
        let position = 0;
        let heightLeft = imgHeight;

        while (heightLeft > 0) {
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
          if (heightLeft > 0) {
            pdf.addPage();
            position = -heightLeft; // 移动到下一页顶部
          }
        }

        // 下载 PDF
        pdf.save("无人机巡检日报.pdf");
      } catch (error) {
        console.error("导出 PDF 出错：", error);
      }
    },
    downloadAsWord() {
      // 选择要导出的 HTML 部分
      const content = document.getElementById("content").innerHTML;
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
                }`;
      // 创建 Word 文件
      const blob = htmlDocx.asBlob(`
        <html>
          <head>
            <meta charset="UTF-8">
            <head>${cssStyle}</head>
          </head>

          <body>${content}</body>
        </html>
      `);

      // 创建文件下载链接
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = this.report.subtitle + "无人机巡检日报.docx";
      link.click();
      URL.revokeObjectURL(link.href);
    },
    ratingReport() {
      const printHTML = document.querySelector("#content").innerHTML;
      // 将打印的区域赋值，进行打印
      window.document.body.innerHTML = printHTML;
      window.print(); // 调用window打印方法
      window.location.reload(); // 打印完成后重新加载页面
    },
  },
  mounted() {
    const url = 'http://api.tianditu.gov.cn/staticimage?center=116.40,39.93&width=500&height=500&zoom=12&layers=vec_c,cva_c%20&markers=116.34867,39.94593&tk=3b33593a6ce1ae84375ec06b89a8aace'
    fetch(url).then(res => {

    })
  }
};
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
</style>