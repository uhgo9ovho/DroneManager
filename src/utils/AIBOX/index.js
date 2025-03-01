import { connect } from 'mqtt/dist/mqtt.min';
import { stearmAPI } from '@/api/AIModel.js';
import { subscribeLiveAPI } from "@/api/AIModel.js"
let ZQL_videosInfos = {
    0:
    {
        "id": "46a1a5f5-9bda-471b-bd1f-0e5df7b91faf_11",
        "loading": true,
        "openWs": true,
        "alg": null,
        "algListShow": false,
        "subscribeTimeout": null,
        "refreshTimeInterval": null,
        "refreshTime": null,
        "replayTimer": null,
        "playerState": "pending",
        "detectInterval": null,
        "quanping": false,
        "srsrtc": {
            "options": {
                "video": {},
                "autoplay": true
            },
            "urlParams": {
                "url": "webrtc://8.136.97.59/live/46a1a5f5-9bda-471b-bd1f-0e5df7b91faf/11",
                "schema": "webrtc",
                "server": "8.136.97.59",
                "port": 11985,
                "vhost": "__defaultVhost__",
                "app": "live/46a1a5f5-9bda-471b-bd1f-0e5df7b91faf",
                "stream": "11",
                "user_query": {}
            },
            "pc": {},
            "autoplay": true,
            "paused": false,
            "animationId": 222
        },
        "stream": "webrtc://8.136.97.59/live/46a1a5f5-9bda-471b-bd1f-0e5df7b91faf/11",
        "status": "",
        "oriWidth": 1920,
        "oriHeight": 1080,
        "actualHeight": 249.75,
        "actualWidth": 444

    }
};
let ZQL_playingSource = {
    0: null,
    videoNum: 1,
    curposition: -1
}
function getCameraSize(id, index) {
    setOrisize(
        ZQL_sources[id].draw_size[0],
        ZQL_sources[id].draw_size[1],
        index, id
    );
}
function destoryVideoByIndex() {
    ZQL_multivideo.clearCanvas(0);
    if (ZQL_videosInfos[0]) {
        if (
            ZQL_videosInfos[0] &&
            ZQL_videosInfos[0].subscribeTimeout
        ) {
            clearTimeout(ZQL_videosInfos[0].subscribeTimeout);
            ZQL_videosInfos[0].subscribeTimeout = null;
        }
        if (ZQL_videosInfos[0] && ZQL_videosInfos[0].replayTimer) {
            clearTimeout(ZQL_videosInfos[0].replayTimer);
            ZQL_videosInfos[0].replayTimer = null;
        }
        if (ZQL_videosInfos[0].refreshTimeInterval) {
            clearInterval(ZQL_videosInfos[0].refreshTimeInterval);
            ZQL_videosInfos[0].refreshTimeInterval = null;
        }
        let video = document.getElementById("video" + 0);
        video && (video.srcObject = null);
        ZQL_videosInfos[0].srsrtc &&
            ZQL_videosInfos[0].srsrtc.destroy();
        ZQL_multivideo.clearCanvas(0);
        ZQL_videosInfos[0] = null;
    }
}
function replayflv(srsrtc, cameraId) {
    if (!ZQL_videosInfos[0]) {
        return;
    }
    if (ZQL_videosInfos[0].playerState == "success") {
        return;
    } else {
        srsrtc.unload();
        srsrtc.load();
        srsrtc
            .play()
            .then((res) => {
                ZQL_multivideo.liveStopLoading(0);
                ZQL_videosInfos[0].playerState = "success";
                ZQL_videosInfos[0].loading = false;
                if (ZQL_videosInfos[0].refreshTimeInterval) {
                    clearInterval(ZQL_videosInfos[0].refreshTimeInterval);
                }
                ZQL_videosInfos[0].refreshTime =
                    parseInt((Math.random() * 5 + 5) * 1000) * 60;
                ZQL_videosInfos[0].refreshTimeInterval = setInterval(() => {
                }, ZQL_videosInfos[0].refreshTime);
            })
            .catch((err) => {

            });
        if (ZQL_videosInfos[0].replayTimer) {
            clearTimeout(ZQL_videosInfos[0].replayTimer);
        }
        ZQL_videosInfos[0].replayTimer = setTimeout(() => {
            replayflv(srsrtc, cameraId, 0);
        }, 3000);
    }
}
function playVideo(cameraId) {
    if (ZQL_videosInfos[0].srsrtc) {
        return;
    }
    ZQL_videosInfos[0].loading = true;

    let video = document.getElementById("jswebrtc");
    let stream = ZQL_videosInfos[0].stream;
    var srsrtc;
    if (stream.indexOf("webrtc") >= 0) {
        let videosrc =
            "webrtc://" + ZQLGLOBAL.serverIp + "/live" + stream.split("/live")[1];
        srsrtc = new JSWebrtc.Player(videosrc, {
            video: video,
            autoplay: true,
            onPlay: (obj) => {
                ZQL_multivideo.liveStopLoading(0);
                ZQL_videosInfos[0].loading = false;
                ZQL_videosInfos[0].playerState = "success";

                if (ZQL_videosInfos[0].refreshTimeInterval) {
                    clearInterval(ZQL_videosInfos[0].refreshTimeInterval);
                }
                ZQL_videosInfos[0].refreshTime =
                    parseInt((Math.random() * 5 + 5) * 1000) * 60;
            },
        });
    } else if (stream.indexOf(".flv") >= 0) {
        let videosrc = `http://${ZQLGLOBAL.serverIp}:${ZQLGLOBAL.srs_http_server}/live${stream.split("/live")[1]
            }`;
        srsrtc = mpegts.createPlayer(
            {
                type: "flv",
                url: videosrc,
                isLive: true,
            },
            { enableWorker: true }
        );
        srsrtc.attachMediaElement(video);
        srsrtc.load();

        srsrtc
            .play()
            .then((res) => {
                ZQL_multivideo.liveStopLoading(0);
                ZQL_videosInfos[0].playerState = "success";
                ZQL_videosInfos[0].loading = false;
                if (ZQL_videosInfos[0].refreshTimeInterval) {
                    clearInterval(ZQL_videosInfos[0].refreshTimeInterval);
                }
            })
            .catch((err) => { });
        if (ZQL_videosInfos[0].replayTimer) {
            clearTimeout(ZQL_videosInfos[0].replayTimer);
        }
        ZQL_videosInfos[0].replayTimer = setTimeout(() => {
            replayflv(srsrtc, cameraId, 0);
        }, 3000);
    } else {
        video.src = "staticdata/" + stream.split("/home/linaro/ks/")[1];
    }

    ZQL_videosInfos[0].srsrtc = srsrtc;

}
function setOrisize(width, height, id) {
    let container = document.querySelector(".wrap_window");
    if (!container) {
        return;
    }
    if (!ZQL_videosInfos[0]) {
        let alg = null;
        if (sessionStorage.getItem("curalgs")) {
            let cameraId = ZQL_playingSource[0];
            let curalgs = JSON.parse(sessionStorage.getItem("curalgs"));
            alg = curalgs[cameraId]
                ? JSON.parse(JSON.stringify(curalgs[cameraId]))
                : null;
        }
        ZQL_videosInfos[0] = {
            id: id,
            loading: true,
            openWs: true,
            alg: alg,
            algListShow: false,
            subscribeTimeout: null,
            refreshTimeInterval: null, // 定时刷新定时器
            refreshTime: null, // 定时刷新时间
            replayTimer: null,
            playerState: "pending",
            detectInterval: null,
            quanping: false,
            srsrtc: null,
            stream: "",
            status: "",
        };
    }
    if (ZQL_videosInfos[0]) {
        let oriWidth = width;
        let oriHeight = height;
        ZQL_videosInfos[0].oriWidth = oriWidth;
        ZQL_videosInfos[0].oriHeight = oriHeight;

        if (
            oriWidth / container.offsetWidth >
            oriHeight / container.offsetHeight
        ) {
            ZQL_videosInfos[0].actualHeight = container.offsetWidth / (oriWidth / oriHeight)
            ZQL_videosInfos[0].actualWidth = container.offsetWidth;
        } else {
            ZQL_videosInfos[0].actualHeight = container.offsetHeight
            ZQL_videosInfos[0].actualWidth = container.offsetHeight * (oriWidth / oriHeight)
        }
        // videoWidth = ZQL_videosInfos[index].actualWidth;
        setPosition(0);
    }
}
function setPosition() {
    let container = document.querySelector(".wrap_window");
    let video = document.querySelector("#jswebrtc");
    let canvas = document.getElementById("canvas");
    let width = ZQL_videosInfos[0].actualWidth, height = ZQL_videosInfos[index].actualHeight;
    video.style.position = "absolute";
    video.style.width = width + "px";
    video.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;
    if (width / container.offsetWidth < height / container.offsetHeight) {
        let left = (container.offsetWidth - width) / 2;
        video.style.left = Math.floor(left) + "px";
        video.style.top = 0 + "px";
        canvas.style.left = Math.floor(left) + "px";
        canvas.style.top = "0px";
    } else {
        let top = (container.offsetHeight - height) / 2;
        video.style.top = Math.floor(top) + "px";
        video.style.left = 0 + "px";
        canvas.style.top = Math.floor(top) + "px";
        canvas.style.left = "0px";
    }
}
function connectMqtt() {
    let mqttclient = connect(`ws://${ZQLGLOBAL.serverIp}:${ZQLGLOBAL.websocket}/mqtt`);
    mqttclient.subscribe(
        ZQLGLOBAL.resultTopic,
        { qos: 0 },
        (error) => {
            if (error) {
                console.log("subscribe error:", error);
                return;
            }
        }
    );
    mqttclient.on("message", (topic, payload) => {
        let msg = JSON.parse(payload.toString());
        if (msg.msg_type == "result") {
            // console.log(msg, 'msg');
            setAlarms(msg.data.reserved_data)
        }


    });
};
function setAlarms(data) {
    clearCanvas();
    if (ZQL_videosInfos[0] && !ZQL_videosInfos[0].canvas) {
        ZQL_videosInfos[0].canvas = document.getElementById("canvas_aibox")
    }
    if (
        !ZQL_videosInfos[0] ||
        !ZQL_videosInfos[0].actualWidth ||
        !ZQL_videosInfos[0].actualHeight ||
        !ZQL_videosInfos[0].oriWidth ||
        !ZQL_videosInfos[0].oriHeight
    ) {
        return;
    }
    // let bbox = data.result.data.bbox;
    let bbox = data.bbox;
    if (Object.values(bbox.polygons).length > 0) {
        Object.values(bbox.polygons).forEach((item) => {
            let color = JSON.parse(JSON.stringify(item.color)).reverse();
            let points = item.polygon.map((point) => {
                return [
                    Math.round(
                        (point[0] * ZQL_videosInfos[0].actualWidth) /
                        ZQL_videosInfos[0].oriWidth
                    ),
                    Math.round(
                        (point[1] * ZQL_videosInfos[0].actualHeight) /
                        ZQL_videosInfos[0].oriHeight
                    ),
                ];
            });
            let context = ZQL_videosInfos[0].canvas.getContext("2d");
            context.font = "20px Arial bolder";
            context.fillStyle = "transparent";
            context.strokeStyle = "rgb(" + color.join(",") + ")";
            context.lineWidth = 2;
            drawPolygons(points, context);
            drawPolygonInfo(context, Object.values(bbox.polygons), 0);
        });
    }

    if (bbox.rectangles.length > 0) {
        debugger
        bbox.rectangles.forEach((item, i) => {
            let color = JSON.parse(JSON.stringify(item.color)).reverse();
            let coordinates = {
                x: Math.round(
                    (item.xyxy[0] * ZQL_videosInfos[0].actualWidth) /
                    ZQL_videosInfos[0].oriWidth
                ),
                y: Math.round(
                    (item.xyxy[1] * ZQL_videosInfos[0].actualHeight) /
                    ZQL_videosInfos[0].oriHeight
                ),
                x1: Math.round(
                    (item.xyxy[2] * ZQL_videosInfos[0].actualWidth) /
                    ZQL_videosInfos[0].oriWidth
                ),
                y1: Math.round(
                    (item.xyxy[3] * ZQL_videosInfos[0].actualHeight) /
                    ZQL_videosInfos[0].oriHeight
                ),
            };
            let context = ZQL_videosInfos[0].canvas.getContext("2d", { willReadFrequently: true });
            context.font = "20px Arial bolder";
            context.fillStyle = "rgb(" + color.join(",") + ")";
            context.fillText(item.label || "", coordinates.x, coordinates.y - 10);
            context.strokeStyle = "rgb(" + color.join(",") + ")";
            context.lineWidth = 2;
            // context.strokeRect(
            //   coordinates.x,
            //   coordinates.y,
            //   coordinates.x1 - coordinates.x,
            //   coordinates.y1 - coordinates.y
            // );
            let lines = [];
            let lineWidth = (coordinates.x1 - coordinates.x) / 4;
            let lineHeight = (coordinates.y1 - coordinates.y) / 4;
            lines[0] = {
                x: coordinates.x,
                y: coordinates.y,
                x1: coordinates.x + lineWidth,
                y1: coordinates.y,
            };
            lines[1] = {
                x: coordinates.x,
                y: coordinates.y,
                x1: coordinates.x,
                y1: coordinates.y + lineHeight,
            };
            lines[2] = {
                x: coordinates.x1,
                y: coordinates.y,
                x1: coordinates.x1 - lineWidth,
                y1: coordinates.y,
            };
            lines[3] = {
                x: coordinates.x1,
                y: coordinates.y,
                x1: coordinates.x1,
                y1: coordinates.y + lineHeight,
            };
            lines[4] = {
                x: coordinates.x,
                y: coordinates.y1,
                x1: coordinates.x + lineWidth,
                y1: coordinates.y1,
            };
            lines[5] = {
                x: coordinates.x,
                y: coordinates.y1,
                x1: coordinates.x,
                y1: coordinates.y1 - lineHeight,
            };
            lines[6] = {
                x: coordinates.x1,
                y: coordinates.y1,
                x1: coordinates.x1 - lineWidth,
                y1: coordinates.y1,
            };
            lines[7] = {
                x: coordinates.x1,
                y: coordinates.y1,
                x1: coordinates.x1,
                y1: coordinates.y1 - lineHeight,
            };
            lines.forEach((item) => {
                drawLine(context, item);
            });
        });
    }

    if (Object.values(bbox.lines).length > 0) {
        Object.values(bbox.lines).forEach((item, i) => {
            let color = JSON.parse(JSON.stringify(item.color)).reverse();
            let coordinates = {
                x: Math.round(
                    (item.line[0][0] * ZQL_videosInfos[0].actualWidth) /
                    ZQL_videosInfos[0].oriWidth
                ),
                y: Math.round(
                    (item.line[0][1] * ZQL_videosInfos[0].actualHeight) /
                    ZQL_videosInfos[0].oriHeight
                ),
                x1: Math.round(
                    (item.line[1][0] * ZQL_videosInfos[0].actualWidth) /
                    ZQL_videosInfos[0].oriWidth
                ),
                y1: Math.round(
                    (item.line[1][1] * ZQL_videosInfos[0].actualHeight) /
                    ZQL_videosInfos[0].oriHeight
                ),
            };
            let context = ZQL_videosInfos[0].canvas.getContext("2d", { willReadFrequently: true });
            context.font = "20px Arial bolder";
            context.fillStyle = "rgb(" + color.join(",") + ")";
            if (item.ext.direction) {
                context.fillText(item.name, (coordinates.x + coordinates.x1) / 2, (coordinates.y + coordinates.y1) / 2 + 20);
            }

            context.strokeStyle = "rgb(" + color.join(",") + ")";
            context.lineWidth = 2;
            drawLine(context, coordinates);
            drawCountingInfo(context, Object.values(bbox.lines));
        });
    }
}
function drawPolygons(points, context) {
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);

    for (var i = 1; i < points.length; i++) {
        context.lineTo(points[i][0], points[i][1]);
    }
    context.closePath();
    context.fill();
    context.stroke();
}
function drawLine(ctx, line) {
    ctx.beginPath();
    ctx.moveTo(line.x, line.y);
    ctx.lineTo(line.x1, line.y1);
    ctx.stroke();
}
function drawCountingInfo(context, lines) {
    lines.forEach((item, index) => {
        context.fillStyle = "rgb(255,0,0)";
        if (item.ext.direction.length == 2) {
            context.fillText(`[${item.name}] ${item.ext.action.count}: ${item.ext.result.count}`, 0, 20 * index + 20);
        } else {
            context.fillText(`[${item.name}] ${item.ext.action.increase}: ${item.ext.result.increase},${item.ext.action.decrease}: ${item.ext.result.decrease},${item.ext.action.delta}: ${item.ext.result.delta}`, 0, 20 * index + 20);
        }
    });
}
function drawPolygonInfo(context, polygons, videoindex) {
    polygons.forEach((item, index) => {
        context.fillStyle =
            "rgb(" +
            JSON.parse(JSON.stringify(item.color)).reverse().join(",") +
            ")";
        let leftPoint = item.polygon[0];
        for (let i = 1; i < item.polygon.length; i++) {
            if (item.polygon[i][0] < leftPoint[0]) {
                leftPoint = item.polygon[i];
            }
        }
        context.fillText(
            `${item.name}`,
            (leftPoint[0] * ZQL_videosInfos[videoindex].actualWidth) /
            ZQL_videosInfos[videoindex].oriWidth,
            (leftPoint[1] * ZQL_videosInfos[videoindex].actualHeight) /
            ZQL_videosInfos[videoindex].oriHeight + 20
        );
        if (item.ext.result) {
            context.fillStyle = "rgb(255,0,0)";
            context.fillText(`${item.name}: ${item.ext.result}`, 0, 20 * index + 20);
        }
    });
}
function clearCanvas() {
    let canvas = document.getElementById("canvas_aibox");
    if (canvas && canvas.getContext("2d")) {
        canvas
            .getContext("2d", { willReadFrequently: true })
            .clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    }
};
function detectSrs() {
    if (ZQLGLOBAL.detectSrsTimer) {
        clearInterval(ZQLGLOBAL.detectSrsTimer)
    }
    ZQLGLOBAL.detectSrsTimer = setInterval(() => {
        stearmAPI().then((res) => {
            if (document.visibilityState == "visible" && res.code == 200) {
                for (let i = 0; i < ZQL_playingSource.videoNum; i++) {
                    let deviceId_cameraId = ZQL_playingSource[i];
                    if (
                        deviceId_cameraId &&
                        ZQL_videosInfos &&
                        ZQL_videosInfos.status != "离线"
                    ) {
                        let deviceId = ZQL_sources[deviceId_cameraId].deviceId;
                        let cameraId = ZQL_sources[deviceId_cameraId].sourceId;
                        let streamInfo = res.streams.find(
                            (item) => item.url.indexOf(`${deviceId}/${cameraId}`) > 0
                        );
                        if (
                            !streamInfo ||
                            (streamInfo && streamInfo.publish.active == false)
                        ) {
                            destoryVideoByIndex(i);
                        }
                    }
                }
            }

        });
    }, 60000)

}

export default {
    connectMqtt,
    detectSrs,
    clearCanvas
};