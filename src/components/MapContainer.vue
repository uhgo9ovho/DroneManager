<template>
  <div class="map-box">
    <div id="container"></div>
    <div class="action-warp" v-if="coordinates && coordinates.length">
      <el-switch v-model="value" active-text="禁飞区" @change="changeArea">
      </el-switch>
    </div>
  </div>
</template>
  <script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { wgs84ToGcj02 } from "@/utils/CoordinateTransformation.js";
import { DronePlottingRoute } from "@/utils/PlottingRoute.js";
import { mapMutations, mapState } from "vuex";
import planeMarkerIcon from "@/assets/images/WechatIMG76.jpg";
let map = null;
let planeMarker = null;
let lastPosition = null;
let polyline = null;
let marker = null;
let polylineStart = null;
let polylineEnd = null;
let startLine = [];
let endLine = [];
export default {
  name: "map-view",
  props: {
    airLineData: {
      type: Array,
      default: () => [],
    },
    longitude: {
      type: Number,
      default: 0,
    },
    latitude: {
      type: Number,
      default: 0,
    },
    lineInfoObj: {
      type: Object,
      default: () => null,
    },
    coordinates: {
      type: Array,
      default: () => [],
    },
    mode_code: {
      type: Number,
      default: 0,
    },
    latitudeLine: {
      type: Number,
      default: 0,
    },
    longitudeLine: {
      type: Number,
      default: 0,
    },
    warningShow: {
      type: Boolean,
      default: false,
    },
    taskType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      lonlatArr: [],
      mouseTool: null,
      AMap: null,
      value: false,
    };
  },
  mounted() {
    this.initAMap();
  },
  computed: {
    ...mapState("changeStatus", ["pointsList", "lineType"]),
  },
  watch: {
    pointsList: {
      handler(val) {
        if (val.length) {
          if (this.lineType != 2) {
            const { drawPolyline } = DronePlottingRoute(
              map,
              this.mouseTool,
              this.AMap
            );
            drawPolyline(val);
          } else {
            //全景
            console.log(val[0][0], val[0][1]);

            const position = new this.AMap.LngLat(val[0][0], val[0][1]);
            let markerContent =
              "" +
              '<div class="custom-content-warning">' +
              '   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png">' +
              "</div>";
            marker = new this.AMap.Marker({
              position: position,
              content: markerContent,
              offset: new this.AMap.Pixel(-10, -34),
            });
            map.add(marker);
          }
        }
      },
    },
    latitude: {
      handler(val) {
        if (val) {
          this.initAMap();
        }
      },
    },
    latitudeLine: {
      handler(val) {
        if (val && this.longitudeLine) {
          this.updatePlaneMarker();
        }
      },
    },
    longitudeLine: {
      handler(val) {
        if (val && this.latitudeLine) {
          this.updatePlaneMarker();
        }
      },
    },
  },
  destroyed() {
    this.destroyMap();
  },
  methods: {
    ...mapMutations("changeStatus", ["CHANGE_DROC_STATUS"]),
    destroyMap() {
       if(polyline || polylineStart || polylineEnd) {
        this.polylineVisible()
        startLine = null
        endLine = null
       }
      map?.destroy();
    },
    initAMap() {
      let that = this;
      window._AMapSecurityConfig = {
        securityJsCode: "a849215e9c2d7b24f79e9f0032b1726d",
      };
      AMapLoader.load({
        key: "60a7b380499a4ebc6f8c004ec6f303e1", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        // plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      })
        .then((AMap) => {
          this.AMap = AMap;
          let center = [];
          let qjMarker = null;
          let val = [];
          if (this.lineInfoObj) {
            //详情中的航线信息
            center = wgs84ToGcj02(
              this.lineInfoObj.centerInfo.lon,
              this.lineInfoObj.centerInfo.lat
            );

            this.lineInfoObj.pointsList.forEach((item) => {
              const formattedArr = [...item];
              // const formarItemArr = formattedArr.map((it) => [it.lon, it.lat]);
              const formarItemArr = formattedArr.map((it) =>
                wgs84ToGcj02(it.lon, it.lat)
              );
              this.lonlatArr.push(...formarItemArr);
              console.log(this.lonlatArr, "arr");
            });
            if (this.taskType === 2) {
              //全景

              val = [this.lonlatArr[0][0], this.lonlatArr[0][1]];
            } else {
              startLine = [center, this.lonlatArr[0]];
              endLine = [center, this.lonlatArr[this.lonlatArr.length - 1]];
            }
          }
          if (this.airLineData.length) {
            //任务记录中的航线信息
            this.lonlatArr = this.airLineData.map((item) => {
              let originArr = [item.longitude, item.latitude];
              return wgs84ToGcj02(originArr[0], originArr[1]);
            });

            center = [this.lonlatArr[0][0], this.lonlatArr[0][1]];
          }
          if (this.latitude && this.longitude) {
            center = wgs84ToGcj02(this.longitude, this.latitude);
          }
          const layer = new AMap.createDefaultLayer({
            zooms: [3, 20], //可见级别
            visible: true, //是否可见
            opacity: 1, //透明度
            zIndex: 0, //叠加层级
          });
          map = new AMap.Map("container", {
            // 设置地图容器id
            viewMode: "2D", // 是否为3D地图模式
            zoom: 13, // 初始化地图级别
            center: center.length ? center : [108.984924, 34.34199], // 初始化地图中心点位置
            layers: [layer],
            resizeEnable: true,
            mapStyle: "amap://styles/light",
          });
          if (center.length) {
            //绘制飞行区圆圈
            const circle = new AMap.Circle({
              center,
              radius: 5000, //半径
              borderWeight: 3,
              strokeOpacity: 1,
              strokeWeight: 6,
              strokeOpacity: 0.2,
              fillOpacity: 0.4,
              strokeDasharray: [10, 10],
              // 线样式还支持 'dashed'
              fillColor: "yellow",
              zIndex: 50,
            });
            map.add(circle);
          }
          AMap.plugin(
            ["AMap.Scale", "AMap.Geolocation", "AMap.MouseTool"],
            function () {
              that.mouseTool = new AMap.MouseTool(map); //创建鼠标工具对像
            }
          );

          let position = null;
          if (this.airLineData.length) {
            position = new AMap.LngLat(
              this.lonlatArr[0][0],
              this.lonlatArr[0][1]
            ); //经纬度
          } else if ((this.latitude && this.longitude) || this.lineInfoObj) {
            position = new AMap.LngLat(center[0], center[1]); //经纬度
          }
          if (position) {
            var markerContent;
            if (this.warningShow) {
              //预警详情坐标icon
              markerContent =
                "" +
                '<div class="custom-content-warning">' +
                '   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png">' +
                "</div>";
            } else {
              markerContent =
                "" +
                '<div class="custom-content-marker">' +
                '   <img src="/airIcon.png">' +
                "</div>";
            }

            const marker = new AMap.Marker({
              position: position,
              content: markerContent,
              offset: new AMap.Pixel(-10, -34),
            });
            marker.on("click", this.markerClick);
            map.add(marker);
          }
          if (val.length) {
            const position = new AMap.LngLat(val[0], val[1]);
            let markerContent =
              "" +
              '<div class="custom-content-warning">' +
              '   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png">' +
              "</div>";
            qjMarker = new AMap.Marker({
              position: position,
              content: markerContent,
              offset: new AMap.Pixel(-10, -34),
            });
            map.add(qjMarker);
          }
          if (this.lonlatArr.length) {
            polyline = new AMap.Polyline({
              path: this.formatAirLine(AMap, this.lonlatArr),
              strokeWeight: 2, //线条宽度
              strokeColor: "red", //线条颜色
              lineJoin: "round", //折线拐点连接处样式
            });
            map.add(polyline);
          }
          if (startLine.length && endLine.length) {
            polylineStart = new AMap.Polyline({
              path: this.formatAirLine(AMap, startLine),
              strokeWeight: 2, //线条宽度
              strokeColor: "blue", //线条颜色
              lineJoin: "round", //折线拐点连接处样式
            });
            polylineEnd = new AMap.Polyline({
              path: this.formatAirLine(AMap, endLine),
              strokeWeight: 2, //线条宽度
              strokeColor: "blue", //线条颜色
              lineJoin: "round", //折线拐点连接处样式
            });
            map.add([polylineStart, polylineEnd]);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    polylineShow() {
      polyline = new this.AMap.Polyline({
        path: this.lonlatArr,
        strokeWeight: 2, //线条宽度
        strokeColor: "red", //线条颜色
        lineJoin: "round", //折线拐点连接处样式
      });
      polylineStart = new AMap.Polyline({
        path: this.formatAirLine(AMap, startLine),
        strokeWeight: 2, //线条宽度
        strokeColor: "blue", //线条颜色
        lineJoin: "round", //折线拐点连接处样式
      });
      polylineEnd = new AMap.Polyline({
        path: this.formatAirLine(AMap, endLine),
        strokeWeight: 2, //线条宽度
        strokeColor: "blue", //线条颜色
        lineJoin: "round", //折线拐点连接处样式
      });
      map.add([polylineStart, polylineEnd, polyline]);
    },
    polylineVisible() {
      polyline.setMap(null);
      polylineStart.setMap(null);
      polylineEnd.setMap(null);
    },
    checkedPolylineColor(formarItemArr) {
      const conArr = formarItemArr.map((item) => {
        return wgs84ToGcj02(item[0], item[1]);
      });
      this.polylineVisible();
      polyline = new this.AMap.Polyline({
        path: conArr,
        strokeWeight: 2, //线条宽度
        strokeColor: "blue", //线条颜色
        lineJoin: "round", //折线拐点连接处样式
      });
      map.add(polyline);
    },
    changeArea(val) {
      const { addPolygon, removePolygon } = DronePlottingRoute(
        map,
        this.mouseTool,
        this.AMap
      );
      if (val) {
        //显示禁飞区
        if (this.coordinates.length) {
          const polygonArr = this.coordinates.map((item) => [item[0], item[1]]);
          addPolygon(polygonArr);
        }
      } else {
        //隐藏禁飞区
        removePolygon();
      }
    },
    formatAirLine(AMap, arr) {
      let path = arr.map((item) => new AMap.LngLat(item[0], item[1]));
      return path;
    },
    markerClick() {
      this.$emit("toVideoMap");
    },
    renderPolyline() {
      if (map) {
        const { drawPolygon } = DronePlottingRoute(
          map,
          this.mouseTool,
          this.AMap
        );
        drawPolygon();
      }
    },
    resetPolyline() {
      const { removeThis } = DronePlottingRoute(
        map,
        this.mouseTool,
        this.AMap,
        marker
      );
      removeThis();
      this.CHANGE_DROC_STATUS("取消");
    },
    removePolyline() {
      const { removeAll } = DronePlottingRoute(map, this.mouseTool, this.AMap);
      removeAll();
      this.CHANGE_DROC_STATUS("");
    },
    updatePlaneMarker() {
      const [lng, lat] = wgs84ToGcj02(this.longitudeLine, this.latitudeLine);
      const position = new this.AMap.LngLat(lng, lat);
      if (!planeMarker) {
        planeMarker = new this.AMap.Marker({
          position,
          content: `<div class="custom-content-marker"><img class="planeImg" src=${planeMarkerIcon} style="transform: rotate(0deg);"></div>`,
          offset: new this.AMap.Pixel(-20, -20),
        });
        map.add(planeMarker);
      } else {
        planeMarker.setPosition(position);
        if (lastPosition) {
          const angle = this.calculateAngle(lastPosition, position);
          const img = document.querySelector(".planeImg");
          if (img) {
            img.style.transform = `rotate(${angle}deg)`;
          }
        }
      }
      lastPosition = position;
      map.setZoomAndCenter(17, position); // 设置地图缩放级别和中心点
    },
    calculateAngle(start, end) {
      const dx = end.lng - start.lng;
      const dy = end.lat - start.lat;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // 调整角度
      return angle;
    },
  },
};
</script>
  <style lang="scss">
.map-box {
  width: 100%;
  height: 100%;
  position: relative;

  .action-warp {
    position: absolute;
    top: 32px;
    left: 24px;
    z-index: 99;
    caret-color: transparent;
    border-radius: 10px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 3px 10px -2px rgba(0, 0, 0, 0.2);
    padding: 10px;
  }
  #container {
    width: 100%;
    height: 100%;
    .amap-logo,
    .amap-copyright {
      display: none !important;
    }
    .custom-content-marker {
      position: relative;
      width: 40px;
      height: 49px;
    }

    .custom-content-marker img {
      width: 100%;
      height: 100%;
    }

    .custom-content-marker .close-btn {
      position: absolute;
      top: -6px;
      right: -8px;
      width: 15px;
      height: 15px;
      font-size: 12px;
      background: #ccc;
      border-radius: 50%;
      color: #fff;
      text-align: center;
      line-height: 15px;
      box-shadow: -1px 1px 1px rgba(10, 10, 10, 0.2);
    }

    .custom-content-marker .close-btn:hover {
      background: #666;
    }

    .custom-content-warning {
      position: relative;
      width: 25px;
      height: 34px;
    }

    .custom-content-warning img {
      width: 100%;
      height: 100%;
    }

    .custom-content-warning .close-btn {
      position: absolute;
      top: -6px;
      right: -8px;
      width: 15px;
      height: 15px;
      font-size: 12px;
      background: #ccc;
      border-radius: 50%;
      color: #fff;
      text-align: center;
      line-height: 15px;
      box-shadow: -1px 1px 1px rgba(10, 10, 10, 0.2);
    }

    .custom-content-warning .close-btn:hover {
      background: #666;
    }
  }
}
</style>
