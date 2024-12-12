import store from '@/store';
let polygon = null
let polyline = null;
let editor = []
let isDraw = false
export function DronePlottingRoute(map, mouseTool, AMap) {
    console.log(store, 'store');
    console.log(AMap, 'amap');
    AMap.Event.addListener(mouseTool, 'draw', function (e) {
        isDraw = false
        mouseTool.close()
        polygon = e.obj
        map.plugin(["AMap.PolyEditor"], function () {
            // 实例化多边形编辑器，传入地图实例和要进行编辑的多边形实例
        });
        polygon.on('click', e => {
            // 绘制新图形时关闭编辑
            if (isDraw) return
            mouseTool.close()
            closeEdit()
            // 获取坐标
            getPoints(e)
            // 点击开启编辑
            polygon = e.target
            enablePolyEdit(e)
            console.log(e, '兼听则明');
        });
    });
    function drawPolygon() {
        isDraw = true
        closeEdit()
        mouseTool.polygon({
            strokeColor: "#FF33FF",
            strokeOpacity: 1,
            strokeWeight: 6,
            strokeOpacity: 0.2,
            fillColor: '#1791fc',
            fillOpacity: 0.4,
            // 线样式还支持 'dashed'
            strokeStyle: "solid",
            // strokeStyle是dashed时有效
            // strokeDasharray: [30,10],
        })
        store.commit('changeStatus/CHANGE_DROC_STATUS', "取消");
    };
    function getPoints(e) {
        let points = e.target.getPath()
        let arr = []
        points.map(v => {
            arr.push(JSON.stringify([v.lng, v.lat]))
        })
        arr.push(arr[0])
        const resultArr = arr.map(item => JSON.parse(item));
        store.commit('changeStatus/CHANGE_COORDINATESARR', resultArr);
    }

    function clearPoints() {

    }
    function closeEdit() {
        editor && editor.CLASS_NAME === "AMap.PolyEditor" && editor.close();
        clearPoints()
    }

    function removeThis() {
        closeEdit()
        map.remove(polygon)
        map.remove(polyline)
        drawPolygon()
    }
    function removeAll() {
        closeEdit()
        mouseTool.close(true)
        // map.remove(polygon)
        // map.remove(polyline)
    }
    function enablePolyEdit(e) {
        setTimeout(() => {
            editor = new AMap.PolyEditor(map, polygon);
            editor.open();
            isDraw = false

            editor.on('addnode', function (event) {
                getPoints(e)
            })

            editor.on('adjust', function (event) {
                getPoints(e)
            })

            editor.on('removenode', function (event) {
                getPoints(e)
            })
        }, 100)
    };

    //生成折线
    function drawPolyline(pointsArr) {
        polyline = new AMap.Polyline({
            path: pointsArr,
            isOutline: true,
            outlineColor: '#ffeeff',
            borderWeight: 3,
            strokeColor: "#3366FF",
            strokeOpacity: 1,
            strokeWeight: 6,
            // 折线样式还支持 'dashed'
            strokeStyle: "solid",
            // strokeStyle是dashed时有效
            strokeDasharray: [10, 5],
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 50,
        })
        map.add(polyline);
        map.setFitView();
    }

    mouseTool.on('draw', function (e) {
        // event.obj 为绘制出来的覆盖物对象
        var polygon = e.obj;

        // 获取多边形的路径坐标
        var path = polygon.getPath();

        // 如果需要以数组形式展示
        var coordinates = path.map(function (point) {
            return [point.lng, point.lat];
        });
        store.commit('changeStatus/CHANGE_COORDINATESARR', coordinates);

        store.commit('changeStatus/CHANGE_DROC_STATUS', "重绘");
    })
    return {
        drawPolygon,
        removeAll,
        removeThis,
        drawPolyline
    }
}