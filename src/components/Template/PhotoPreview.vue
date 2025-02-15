<template>
  <div class="photo-preview">
    <div class="imgPrewBox">
      <div style="position: relative">
        <div class="innerImgBox">
          <ImageZoom
            :src="currentUrl"
            :warnPhoto="warnPhoto"
            :isEdit="isEdit"
            @handleMouseUp="handleMouseUp"
            @startLister="startLister"
            @location="location"
            ref="imageZoom"
          />
        </div>
        <div class="operateBox" v-if="isChecked">
          <div class="markType" :class="{ actived: isEdit }" @click="editBtn">
            <i class="el-icon-edit"></i>
          </div>
          <div class="operateBtns">
            <div class="feixiangbet disabled">
              <i class="el-icon-share"></i>
            </div>
            <div class="xiazaibtn" @click="downloadBZImage">
              <i class="el-icon-download"></i>
            </div>
          </div>
        </div>
        <div class="download" v-else @click="downloadImage">
          <i class="el-icon-download"></i>
        </div>
        <div class="mark">
          问题标注
          <el-switch v-model="isChecked"></el-switch>
        </div>
        <div class="close" @click="closePreview">
          <i class="el-icon-close"></i>
        </div>
        <div class="last" @click="prevImage">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="next" @click="nextImage">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="page">
          <div class="currentPage">{{ currentIndex }}</div>
          <i>/</i>
          <div class="totalPage">{{ row.photoNum }}</div>
        </div>
        <div
          class="deleteBtn"
          @click.stop="clearDrawBtn"
          :style="getPosition"
          v-show="isShow"
        >
          <i class="el-icon-close"></i>
        </div>
        <div
          class="sureBtn"
          @click.stop="sureDrawBtn"
          :style="getPosition2"
          v-show="showSure"
        >
          <i class="el-icon-check"></i>
        </div>
        <div class="typeList" :style="getListPosition" v-if="isShowSelect">
          <div class="top">
            <div class="title">选择问题</div>
            <!-- <div class="search">
              <i class="el-icon-search"></i>
            </div> -->
          </div>
          <!-- <div class="inputBox">
            <el-input
              v-model="searchText"
              id="typeInput"
              type="text"
              placeholder="搜索"
              @input="searchQuestion"
            />
          </div> -->
          <!-- <div class="tipstitle">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="常用" name="common"></el-tab-pane>
              <el-tab-pane label="全部" name="all"></el-tab-pane>
            </el-tabs>

              

          </div> -->
          <div class="typeList_ul">
            <div
              class="typeList_li"
              v-for="(item, index) in remarkList"
              :key="index"
              @click="changeRemark(item)"
              :class="{ checked: item.checked }"
            >
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                {{ item.remark }}
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
          <div class="remark_list_ul" v-if="showRemark">
            <div
              class="remark_list_li"
              v-for="(item, index) in typeList"
              :key="index"
              @click="selectItem(item)"
            >
              {{ item.dictLabel }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
import ImageZoom from "./ImageZoom.vue";
import { addWarningAPI, uploadAPI, dictListAPI } from "@/api/TaskManager.js";
import AMapLoader from "@amap/amap-jsapi-loader";
import Cookies from "js-cookie";
import { downloadPhoto } from "@/utils/ruoyi";
export default {
  name: "PhotoPreview",
  props: {
    currentUrl: {
      type: String,
      default: "",
    },
    warnPhoto: {
      type: String,
      default: "",
    },
    row: {
      type: Object,
      default: () => {},
    },
    lon: {
      type: Number,
      default: "",
    },
    lat: {
      type: Number,
      default: "",
    },
    resultId: {
      type: Number,
      default: 0,
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showRemark: false,
      isEdit: false,
      isChecked: false,
      top: 0,
      left: 0,
      areaWidth: 0,
      areaHeight: 0,
      activeName: "all",
      windowW: document.documentElement.clientWidth,
      windowH: document.documentElement.clientHeight,
      clientX: 0,
      clientY: 0,
      typeList: [],
      isShow: false,
      showSure: false,
      isShowSelect: false,
      currentName: "",
      currentTypeName: "",
      currentId: "",
      address: "",
      locationArr: [],
      searchText: "",
      allTypeList: [],
      remarkList: [],
    };
  },
  computed: {
    getPosition() {
      return {
        top: `${this.top + 6}px`,
        left: `${this.left - 25}px`,
      };
    },
    getPosition2() {
      return {
        top: `${this.top + 6}px`,
        left: `${this.left - 55}px`,
      };
    },
    getListPosition() {
      if (this.clientY > this.windowH - 312) {
        const posY = this.windowH - this.clientY;
        console.log(posY);
        return {
          top: `${posY}px`,
          left: `${this.left + 6}px`,
        };
      }
      return {
        top: `${this.top - 126}px`,
        left: `${this.left + 6}px`,
      };
    },
  },
  components: {
    ImageZoom,
  },
  methods: {
    prevImage() {
      if (this.currentIndex > 0) {
        this.$emit("prevImage");
      }
    },
    nextImage() {
      if (this.currentIndex < this.row.photoNum) {
        this.$emit("nextImage");
      }
    },
    changeRemark(obj) {
      this.showRemark = true;
      this.remarkList.forEach((it) => (it.checked = false));
      obj.checked = true;
      this.typeList = this.allTypeList.filter(
        (item) => item.remark == obj.remark
      );
    },
    // searchQuestion(query) {
    //   const keyword = query.trim().toLowerCase();

    //   this.typeList = this.allTypeList.filter((item) =>
    //     item.dictLabel.toLowerCase().includes(keyword)
    //   );
    // },
    downloadImage() {
      downloadPhoto(this.currentUrl, this.row.fileName);
    },
    downloadBZImage() {
      const url = this.$refs.imageZoom.$refs.canvas.toDataURL("image/png");

      downloadPhoto(url, this.row.fileName);
    },
    loadPanorama() {
      pannellum.viewer(this.$refs.panorama, {
        type: "equirectangular",
        panorama: this.currentUrl,
        autoLoad: true,
        autoRotate: -2,
      });
    },
    handleClick() {},
    closePreview() {
      this.$emit("closePreview", this.row);
    },
    editBtn() {
      this.isEdit = !this.isEdit;
    },
    location(arr) {
      this.locationArr = arr;
    },
    handleMouseUp(selectedArea) {
      if (!selectedArea.width || !selectedArea.height) {
        this.isShow = false;
        this.isShowSelect = false;
      } else {
        this.isShow = true;
        this.isShowSelect = true;
      }
      if (selectedArea.size) {
        this.showSure = true;
      } else {
        this.showSure = false;
      }
      console.log(selectedArea, "asdasd");
      this.top = selectedArea.y2;
      this.left = selectedArea.x2;
      this.startX = selectedArea.x1;
      this.startY = selectedArea.y1;
      this.areaWidth = selectedArea.width;
      this.areaHeight = selectedArea.height;
      document.removeEventListener("mousemove", this.getPos);
    },
    startLister() {
      this.isShow = false;
      this.showSure = false;
      document.addEventListener("mousemove", this.getPos);
    },
    getPos(event) {
      this.clientX = event.clientX; // 鼠标相对于窗口的X坐标
      this.clientY = event.clientY; // 鼠标相对于窗口的Y坐标
    },
    clearDrawBtn() {
      this.$refs.imageZoom.removeSelectedBoxAndText();
      this.isShow = false;
      this.isShowSelect = false;
      this.showSure = false;
      this.showRemark = false;
      this.remarkList.forEach((it) => (it.checked = false));
    },
    sureDrawBtn() {
      this.isShow = false;
      this.showSure = false;
      this.generateImageURL();
      this.showRemark = false;
      this.remarkList.forEach((it) => (it.checked = false));
    },
    selectItem(item) {
      this.$refs.imageZoom.addTextToSelectedBox(item.dictLabel);
      this.currentName = item.dictLabel;
      this.currentTypeName = item.remark;
      this.currentId = item.dictValue;
      this.isShow = true;
      this.showSure = true;
      this.isShowSelect = false;
    },
    generateImageURL() {
      // 将整个 canvas 内容转换为 Data URL
      const canvasDOM = this.$refs.imageZoom.$refs.canvas;
      if (canvasDOM) {
        canvasDOM.toBlob((blob) => {
          if (blob) {
            // 2. 使用 FormData 包装 Blob
            console.log(blob);

            const formData = new FormData();
            formData.append("file", blob, new Date().getTime()); // 'file' 是后端接收的字段名
            uploadAPI(formData).then((res) => {
              console.log(res);
              const resUrl = res.url;
              if (res.code == 200) {
                this.$message.success("上传成功,请稍后");
                //上传成功
                const params = {
                  warnName: this.currentName,
                  warnTypeId: this.currentId,
                  warnTypeName: this.currentTypeName,
                  airLineId: this.row.airlineId,
                  airLineName: this.row.lineName,
                  identifyAirPortId: this.row.airportId,
                  identifyAirPortName: this.row.airportName,
                  identifyPhoto: resUrl,
                  address: this.address,
                  latitude: this.lat,
                  longitude: this.lon,
                  status: "0",
                  description: "",
                  rectangles: `${this.locationArr}`,
                  orgId: localStorage.getItem("org_id"),
                  orgName: Cookies.get("orgName"),
                  recordId: this.row.recordId,
                  resultId: this.resultId,
                };
                addWarningAPI(params).then((res) => {
                  if (res.code === 200) {
                    this.$message.success("问题上报成功");
                  } else {
                    this.$message.error(res.msg);
                  }
                });
              }
            });
          }
        });
      }
    },
    getDictList() {
      dictListAPI("warn_type").then((res) => {
        if (res.code === 200) {
          this.allTypeList = res.rows;
          let remarkArr = res.rows.map((item) => {
            return {
              remark: item.remark,
              checked: false,
            };
          });
          this.remarkList = remarkArr.filter(
            (item, index, self) =>
              index === self.findIndex((obj) => obj.remark === item.remark)
          );
          console.log(this.remarkList, "remarkList");
        }
      });
    },
    initMap() {
      let that = this;
      window._AMapSecurityConfig = {
        securityJsCode: "a849215e9c2d7b24f79e9f0032b1726d",
      };
      AMapLoader.load({
        // 高德开发者密钥 ：平台申请
        key: "60a7b380499a4ebc6f8c004ec6f303e1",
        // 高德API版本: 2.0
        version: "2.0",
        // 加载高德内置插件
        plugins: ["AMap.Geocoder", "AMap.Geolocation"],
        willReadFrequently: true,
      })
        .then((AMap) => {
          // 绘制地图
          const AMAP = new AMap.Map("map", {
            resizeEnable: true,
          });
          console.log(AMAP);

          const Geocoder = new AMap.Geocoder();

          // 根据获取到的经纬度进行逆地理编码

          // Geocoder.getAddress([116.310003, 39.991957], (status, { regeocode }) => {
          Geocoder.getAddress([that.lon, that.lat], (status, { regeocode }) => {
            if (status === "complete" && regeocode) {
              // address即经纬度转换后的地点名称
              that.address = regeocode?.formattedAddress;
              console.log(that.address);
            }
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  mounted() {
    this.getDictList();
    this.initMap();
    window.addEventListener("resize", () => {
      this.windowW = document.documentElement.clientWidth;
      this.windowH = document.documentElement.clientHeight;
    });
    this.$nextTick(() => {
      // this.loadPanorama();
    });
  },
};
</script>

<style lang="scss">
.photo-preview {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(29, 29, 31, 0.8);
  backdrop-filter: blur(5px);
  #id {
    width: 100px;
    height: 100px;
    z-index: 10001;
  }
  .imgPrewBox {
    width: 100vh;
    height: 75vh;
    max-width: 1200px;
    max-height: 900px;
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    //background-color: rgba(255, 255, 255, 1);
    position: relative;
    .quanjing {
      .img_box {
        border-radius: 8px;
        position: relative;
        width: 754px;
        height: 566px;
        background-color: #fff;
        user-select: none;
        img {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }
      }
    }
    .innerImgBox {
      border-radius: 8px;
      position: relative;
      width: 754px;
      height: 566px;
      background-color: #fff;
      user-select: none;
    }
    .operateBox {
      position: absolute;
      top: 218px;
      right: 20px;
      z-index: 100;
      color: #fff;
      font-size: 14px;
      .markType {
        width: 36px;
        height: 36px;
        background: #fff;
        border-radius: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          font-size: 20px;
          color: #1d1d1f;
        }
      }
      .actived {
        background: #0271e3;
        i {
          color: #fff;
        }
      }
      .operateBtns {
        margin-top: 12px;
        padding: 4px 2px;
        width: 36px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 18px;
        div {
          height: 36px;
          line-height: 36px;
          text-align: center;
          text-indent: 3px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          color: #1d1d1f;
          align-items: center;
          i {
            font-size: 20px;
          }
        }
        .disabled {
          color: #9f9fa0 !important;
          pointer-events: none;
        }
      }
    }
    .download {
      width: 40px;
      height: 40px;
      background: #fff;
      border-radius: 20px;
      position: absolute;
      bottom: 46px;
      right: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      i {
        font-size: 20px;
      }
    }
    .mark {
      position: absolute;
      bottom: -36px;
      color: #fff;
      right: 0;
      font-weight: 400;
      z-index: 1;
      font-size: 14px;
    }
    .close {
      width: 36px;
      height: 36px;
      background: hsla(0, 0%, 100%, 0.8509803921568627);
      border-radius: 18px;
      position: absolute;
      right: -40px;
      top: -40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 16px;
    }
    .last {
      color: #fff;
      width: 40px;
      height: 40px;
      background: rgba(134, 134, 140, 0.7019607843137254);
      border-radius: 20px;
      position: absolute;
      left: -48px;
      top: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .next {
      width: 40px;
      height: 40px;
      background: rgba(134, 134, 140, 0.7019607843137254);
      border-radius: 20px;
      position: absolute;
      right: -48px;
      top: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
    }
    .page {
      display: flex;
      color: #fff;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      margin-top: 16px;
      position: relative;
      z-index: 0;
      margin-left: calc(50% - 20px);
      .totalPage {
        color: #ababab;
      }
    }
    .deleteBtn {
      position: absolute;
      cursor: pointer;
      width: 25px;
      height: 25px;
      background-color: #fff;
      border-radius: 15px;
      color: brown;
      text-align: center;
      line-height: 25px;
    }
    .sureBtn {
      position: absolute;
      cursor: pointer;
      width: 25px;
      height: 25px;
      background-color: #fff;
      border-radius: 15px;
      color: green;
      text-align: center;
      line-height: 25px;
    }
    .typeList {
      width: 145px;
      height: auto;
      color: #d3d3d3;
      position: absolute;
      background: rgba(29, 29, 31, 0.7490196078431373);
      border-radius: 12px;
      -webkit-backdrop-filter: blur(5px);
      backdrop-filter: blur(5px);
      padding: 12px 8px 8px 8px;
      z-index: 1000;
      .remark_list_ul {
        position: absolute;
        width: 100%;
        background: rgba(29, 29, 31, 0.7490196078431373);
        border-radius: 12px;
        backdrop-filter: blur(5px);
        padding: 12px 8px 8px 8px;
        z-index: 1000;
        top: 0px;
        right: -150px;
        margin-top: 4px;
        max-height: 200px;
        overflow: auto;
        .remark_list_li {
          font-size: 12px;
          line-height: 28px;
          height: 28px;
          cursor: pointer;
          text-indent: 5px;
          padding-left: 12px;
          padding-right: 8px;
          margin-bottom: 2px;
          white-space: pre;
          color: hsla(0, 0%, 100%, 0.8509803921568627);
          &:hover {
            background: #0271e3;
            border-radius: 6px;
            color: #fff;
          }
        }
      }
      .top {
        padding-left: 12px;
        padding-right: 4px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        .title {
          font-weight: 500;
          font-size: 13px;
          color: #fff;
          line-height: 20px;
        }
        .search {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          text-align: center;
          line-height: 20px;
        }
      }
      .inputBox {
        position: relative;
        margin-bottom: 9px;
        .el-input {
          .el-input__inner {
            font-size: 15px;
            outline: 0;
            appearance: none;
            padding: 2px;
            color: silver;
            line-height: 30px;
            width: 124px;
            height: 28px;
            background: rgba(29, 29, 31, 0.7490196078431373);
            opacity: 0.75;
            border: 1px solid #474747;
            border-radius: 6px;
            padding-left: 12px;
            font-size: 12px;
          }
        }
      }
      .tipstitle {
        display: flex;
        justify-content: space-around;
        line-height: 25px;
        font-size: 14px;
        .el-tabs {
          .el-tabs__active-bar {
            font-weight: 500;
            font-size: 13px;
            color: #fff;
            line-height: 20px;
            z-index: 0;
            background-color: #fff;
          }
          .el-tabs__item {
            color: hsla(0, 0%, 100%, 0.6509803921568628);
            font-size: 12px;
          }
          .is-active {
            font-family: PingFangSC-Medium;
            font-weight: 500;
            font-size: 14px;
            color: #fff;
            letter-spacing: 0;
            text-align: center;
          }
        }
      }
      .typeList_ul {
        margin-top: 4px;
        max-height: 200px;
        overflow: auto;
        .typeList_li {
          font-size: 12px;
          line-height: 28px;
          height: 28px;
          cursor: pointer;
          text-indent: 5px;
          padding-left: 12px;
          padding-right: 8px;
          margin-bottom: 2px;
          white-space: pre;
          color: hsla(0, 0%, 100%, 0.8509803921568627);
          &:hover {
            background: #0271e3;
            border-radius: 6px;
            color: #fff;
          }
        }
        .checked {
          background: #0271e3;
          border-radius: 6px;
          color: #fff;
        }
      }
    }
  }
}
</style>
