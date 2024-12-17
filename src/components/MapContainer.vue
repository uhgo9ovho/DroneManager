<template>
  <div id="container"></div>
</template>
  <script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { wgs84ToGcj02 } from "@/utils/CoordinateTransformation.js";
import { DronePlottingRoute } from "@/utils/PlottingRoute.js";
import { mapMutations, mapState } from "vuex";
let map = null;
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
      default: () => null
    }
  },
  data() {
    return {
      lonlatArr: [],
      mouseTool: null,
      AMap: null,
    };
  },
  mounted() {
    this.initAMap();
  },
  computed: {
    ...mapState("changeStatus", ["pointsList"]),
  },
  watch: {
    pointsList: {
      handler(val) {
        if (val.length) {
          console.log(val,'val1111');
          
          const { drawPolyline } = DronePlottingRoute(
            map,
            this.mouseTool,
            this.AMap
          );
          drawPolyline(val)
        }
      },
    },
  },
  unmounted() {
    map?.destroy();
  },
  methods: {
    ...mapMutations("changeStatus", ["CHANGE_DROC_STATUS"]),
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
          if(this.lineInfoObj) {
            //详情中的航线信息
            console.log(this.lineInfoObj,'asdasdasdsa');
            center = wgs84ToGcj02(this.lineInfoObj.centerInfo.lon, this.lineInfoObj.centerInfo.lat);
            this.lonlatArr = this.lineInfoObj.pointsList.map(item => {
              return [item.lon, item.lat]
            })
          }
          if (this.airLineData.length) {
            //任务记录中的航线信息
            this.lonlatArr = this.airLineData.map((item) => {
              let originArr = [item.longitude, item.latitude];
              return wgs84ToGcj02(originArr[0], originArr[1]);
            });
            console.log(this.lonlatArr);

            center = [this.lonlatArr[0][0], this.lonlatArr[0][1]];
          }
          if (this.latitude && this.longitude) {
          center = wgs84ToGcj02(this.longitude, this.latitude)
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
            zoom: 18, // 初始化地图级别
            center: center.length ? center : [108.984924, 34.34199], // 初始化地图中心点位置
            layers: [layer],
            resizeEnable: true,
            mapStyle: "amap://styles/light",
          });

          const traffic = new AMap.TileLayer.Traffic({
            autoRefresh: true, //是否自动刷新
            interval: 180, //刷新间隔时间 默认180s
          });
          map.add(traffic);
          AMap.plugin(
            ["AMap.Scale", "AMap.Geolocation", "AMap.MouseTool"],
            function () {
              // let toolbar = new AMap.Scale();
              // let Geolocation = new AMap.Geolocation();
              that.mouseTool = new AMap.MouseTool(map); //创建鼠标工具对像
              console.log(that.mouseTool, "asdasdasd");

              // map.addControl(toolbar);
              // map.addControl(Geolocation);
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
            var markerContent =
              "" +
              '<div class="custom-content-marker">' +
              '   <img src="/airIcon.png">' +
              "</div>";
            const marker = new AMap.Marker({
              position: position,
              content: markerContent,
              offset: new AMap.Pixel(-10, -34)

            });
            marker.on("click", this.markerClick);
            map.add(marker);
          }

          if (this.lonlatArr.length) {
            var polyline = new AMap.Polyline({
              path: this.formatAirLine(AMap),
              strokeWeight: 2, //线条宽度
              strokeColor: "red", //线条颜色
              lineJoin: "round", //折线拐点连接处样式
            });
            map.add(polyline);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    formatAirLine(AMap) {
      let path = this.lonlatArr.map(
        (item) => new AMap.LngLat(item[0], item[1])
      );
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
      const { removeThis } = DronePlottingRoute(map, this.mouseTool, this.AMap);
      removeThis();
      this.CHANGE_DROC_STATUS("取消");
    },
    removePolyline() {
      const { removeAll } = DronePlottingRoute(map, this.mouseTool, this.AMap);
      removeAll();
      this.CHANGE_DROC_STATUS("");
    },
  },
};
</script>
  <style lang="scss">
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
}
</style>
  