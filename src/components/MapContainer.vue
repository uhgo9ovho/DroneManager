<template>
  <div id="container"></div>
</template>
  <script>
import AMapLoader from "@amap/amap-jsapi-loader";
let map;
export default {
  name: "map-view",
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
          const layer = new AMap.createDefaultLayer({
            zooms: [3, 20], //可见级别
            visible: true, //是否可见
            opacity: 1, //透明度
            zIndex: 0, //叠加层级
          });
          map = new AMap.Map("container", {
            // 设置地图容器id
            viewMode: "2D", // 是否为3D地图模式
            zoom: 11, // 初始化地图级别
            center: [121.7789, 31.3102], // 初始化地图中心点位置
            layers: [layer],
          });
          const traffic = new AMap.TileLayer.Traffic({
            autoRefresh: true, //是否自动刷新
            interval: 180, //刷新间隔时间 默认180s
          });
          map.add(traffic);
          // AMap.plugin(
          //   ["AMap.Scale", "AMap.Geolocation"],
          //   function () {
          //     let toolbar = new AMap.Scale();
          //     // let MapType = new AMap.MapType();
          //     let Geolocation = new AMap.Geolocation();
          //     map.addControl(toolbar);
          //     // map.addControl(MapType);
          //     map.addControl(Geolocation);
          //   }
          // );
          //自定义marker（标记点）
          const markerContent = `<div class="custom-content-marker">
<img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">
<div class="close-btn" onclick="clearMarker()">X</div>
</div>`;
          const position = new AMap.LngLat(116.397428, 39.90923); //经纬度
          const marker = new AMap.Marker({
            position: position,
            content: markerContent, //将 html 传给 content
            offset: new AMap.Pixel(-13, -30), //以 icon 的 [center bottom] 为原点
          });
          map.add(marker);
          function clearMarker() {
            map.remove(marker);
          }
          document.querySelector(".close-btn").onclick = clearMarker;
          //   polygon 面
          const pathArr = [
            [
              [
                [121.7789, 31.3102],
                [121.7279, 31.3548],
                [121.5723, 31.4361],
                [121.5093, 31.4898],
                [121.5624, 31.4864],
                [121.5856, 31.4547],
                [121.7694, 31.3907],
                [121.796, 31.3456],
                [121.7789, 31.3102],
              ],
            ],
          ];
          const polygon = new AMap.Polygon({
            path: pathArr, //多边形路径
            fillColor: "#ccebc5", //多边形填充颜色
            strokeOpacity: 1, //线条透明度
            fillOpacity: 0.5, //填充透明度
            strokeColor: "#2b8cbe", //线条颜色
            strokeWeight: 1, //线条宽度
            strokeStyle: "dashed", //线样式
            strokeDasharray: [5, 5], //轮廓的虚线和间隙的样式
          });
          //鼠标移入更改样式
          polygon.on("mouseover", () => {
            polygon.setOptions({
              fillOpacity: 0.7, //多边形填充透明度
              fillColor: "#7bccc4",
            });
          });
          //鼠标移出恢复样式
          polygon.on("mouseout", () => {
            polygon.setOptions({
              fillOpacity: 0.5,
              fillColor: "#ccebc5",
            });
          });
          map.add(polygon);
        })
        .catch((e) => {
          console.log(e);
        });
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
  