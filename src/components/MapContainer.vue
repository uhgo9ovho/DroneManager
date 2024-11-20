<template>
  <div id="container"></div>
</template>
  <script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { wgs84ToGcj02 } from "@/utils/CoordinateTransformation.js";
let map;
export default {
  name: "map-view",
  props: {
    airLineData: {
      type: Array,
      default: () => [],
    },
    longitude: {
      type: Number,
      default: 0
    },
    latitude: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      lonlatArr: []
    }
  },
  mounted() {
    this.initAMap();
  },
  unmounted() {
    map?.destroy();
  },
  methods: {
    initAMap() {
      window._AMapSecurityConfig = {
        securityJsCode: "a849215e9c2d7b24f79e9f0032b1726d",
      };
      AMapLoader.load({
        key: "60a7b380499a4ebc6f8c004ec6f303e1", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        // plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      })
        .then((AMap) => {
          let center = [];
          if (this.airLineData.length) {
            this.lonlatArr = this.airLineData.map((item) => {
              let originArr = [item.longitude, item.latitude];
              return wgs84ToGcj02(originArr[0], originArr[1])
            });
            console.log(this.lonlatArr);

            center = [this.lonlatArr[0][0], this.lonlatArr[0][1]];
          }
          if(this.latitude && this.longitude) {
            center = [this.longitude, this.latitude]
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
            zoom: 15, // 初始化地图级别
            center: center.length ? center : [108.984924, 34.34199], // 初始化地图中心点位置
            layers: [layer],
            resizeEnable: true,
          });
          const traffic = new AMap.TileLayer.Traffic({
            autoRefresh: true, //是否自动刷新
            interval: 180, //刷新间隔时间 默认180s
          });
          map.add(traffic);
          AMap.plugin(["AMap.Scale", "AMap.Geolocation"], function () {
            let toolbar = new AMap.Scale();
            let Geolocation = new AMap.Geolocation();
            map.addControl(toolbar);
            map.addControl(Geolocation);
          });
          const position = new AMap.LngLat(this.lonlatArr[0][0], this.lonlatArr[0][1]); //经纬度
          const marker = new AMap.Marker({
            position: position,
          });
          map.add(marker);
          var polyline = new AMap.Polyline({
            path: this.formatAirLine(AMap),
            strokeWeight: 2, //线条宽度
            strokeColor: "red", //线条颜色
            lineJoin: "round", //折线拐点连接处样式
          });
          map.add(polyline);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    formatAirLine(AMap) {
      let path = this.lonlatArr.map((item) => new AMap.LngLat(item[0], item[1]));
      return path;
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
    width: 25px;
    height: 34px;
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
  