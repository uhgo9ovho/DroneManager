const ZQL_multivideo = {
  setVideoEl: () => {
    let videoContainer = document.querySelector("#video-container");
    if (ZQL_playingSource.videoNum == 1) {
      videoContainer.className = "one-video";
      videoContainer.innerHTML = `
          <div class="video-box">
            <div class="tips" id="tip0">
              <div class="icon-dot"></div>
              <div class="deviceoffline">
                <i class="z-icon-jiankonglixian" style="font-size: 10rem"></i>
                <span>离线</span>
              </div>
            </div>
            <div class="title-container" id="video-title0"></div>
            <video ref="video" muted id="video0" class="video-js" autoplay="autoplay" preload="auto"></video>
            <canvas class="canvas-shuju" id="canvas0"></canvas>
          </div>
        `
    }
  },
  liveLoading: (index) => {
    let tipel = document.querySelector("#tip" + index);
    tipel.innerHTML = `<div class="icon-dot"></div>`
  },
  liveOffline: (index) => {
    let tipel = document.querySelector("#tip" + index);
    tipel.innerHTML = `
      <div class="deviceoffline">
        <i class="z-icon-jiankonglixian" style="font-size: 10rem"></i>
        <span>离线</span>
      </div>
    `
  },
  liveStopLoading: (index) => {
    let tipel = document.querySelector("#tip" + index);
    if (tipel) {
      tipel.innerHTML = ``
    }
  },
  setAlgList(index) {
    let el = document.querySelector(`#video-title${index}`);
    let algList = ZQL_sources[ZQL_playingSource[index]].alg;
    let algEl = '<ul>';
    for (let alg in algList) {
      let name = algList[alg].reserved_args.ch_name;
      algEl = algEl + `<li alg="${alg}" index="${index}">${name}</li>`
    }
    algEl = algEl + '</ul>'
    el.innerHTML = `
      <div class="camera">${ZQL_sources[ZQL_playingSource[index]].desc}</div>
      <div class="alg">      
        <div class="algname">算法: ${ZQL_playingSource[index].alg ? ZQL_sources[ZQL_playingSource[index]].alg[alg].reserved_args.ch_name : ''}</div>
        ${algEl}
      </div>
      <div id="close${index}">关闭</div>
    `;
    el.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', (e) => {
        let index = e.currentTarget.getAttribute("index");
        let alg = e.currentTarget.getAttribute("alg")
        ZQL_videosInfos[index].alg = alg;
        let videlel = document.querySelector(`#video-title${index}`);
        videlel.querySelector(".algname").innerHTML = '算法：' + ZQL_sources[ZQL_playingSource[index]].alg[alg].reserved_args.ch_name
      })
    })
    document.querySelector(`#close${index}`).addEventListener('click', () => {
      ZQL_multivideo.clearAlgList(index);
      ZQL_multivideo.liveStopLoading(index);
      ZQL_multivideo.destoryVideoByIndex(index);
      ZQL_playingSource[index] = null;
      ZQL_videosInfos[index] = null;
    })
  },
  clearAlgList(index) {
    let el = document.querySelector(`#video-title${index}`);
    if (el) {
      el.innerHTML = ""
    }

  },
  detectSrs() {
    if (ZQLGLOBAL.detectSrsTimer) {
      clearInterval(ZQLGLOBAL.detectSrsTimer)
    }
    ZQLGLOBAL.detectSrsTimer = setInterval(() => {
      ZQL_apis.detectStream().then((res) => {
        if (document.visibilityState == "visible" && res.code == 0) {
          for (let i = 0; i < ZQL_playingSource.videonum; i++) {
            let deviceId_cameraId = ZQL_playingSource[i];
            if (
              deviceId_cameraId &&
              ZQL_videosInfos[i] &&
              ZQL_videosInfos[i].status != "离线"
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
                ZQL_multivideo.destoryVideoByIndex(i);
                ZQL_multivideo.subscribeLive(deviceId_cameraId, i);
              }
            }
          }
        }

      });
    }, 60000)

  },
  handleRefresh(index) {
    if (!ZQL_videosInfos[index]) {
      return;
    }
    if (ZQL_videosInfos[index].status == "离线") {
      ZQL_multivideo.destoryVideoByIndex(index);
      ZQL_multivideo.subscribeLive(ZQL_playingSource[index], index);
    } else {
      if (!ZQL_videosInfos[index].stream) {
        return;
      }
      let video = document.getElementById("video" + index);
      video && (video.srcObject = null);
      if (ZQL_videosInfos[index] && ZQL_videosInfos[index].replayTimer) {
        clearTimeout(ZQL_videosInfos[index].replayTimer);
        ZQL_videosInfos[index].replayTimer = null;
      }
      ZQL_videosInfos[index] &&
        ZQL_videosInfos[index].srsrtc &&
        ZQL_videosInfos[index].srsrtc.destroy();
      ZQL_videosInfos[index].srsrtc = null;
      ZQL_videosInfos[index].status = "";
      ZQL_multivideo.playVideo(ZQL_playingSource[index], index);
    }
  },
  subscribeLive(cameraId, index) {
    ZQL_multivideo.getCameraSize(cameraId, index);
    ZQL_multivideo.liveLoading(index);
    ZQL_apis
      .subscribeLive(
        ZQL_sources[cameraId].deviceId,
        ZQL_sources[cameraId].sourceId
      )
      .then((data) => {
        let stream = data.data;
        if (data && stream) {
          ZQL_videosInfos[index].stream = stream;
          ZQL_multivideo.playVideo(cameraId, index);
        } else {
          if (ZQL_playingSource[index] == cameraId) {
            ZQL_multivideo.liveOffline(index);
            // ZQL_videosInfos[index].status = "离线";
            // ZQL_videosInfos[index].loading = false;
            // this.reSubcribe(cameraId, index);
          }
        }
      })
      .catch((err) => {
        if (
          ZQL_playingSource[index] == cameraId &&
          ZQL_videosInfos[index]
        ) {
          ZQL_multivideo.liveOffline(index);
          // ZQL_videosInfos[index].status = "离线";
          // ZQL_videosInfos[index].loading = false;
          // this.reSubcribe(cameraId, index);
        }
      });
  },
  playVideo(cameraId, index) {
    if (ZQL_videosInfos[index].srsrtc) {
      return;
    }
    ZQL_videosInfos[index].loading = true;

    let video = document.getElementById("video" + index);
    let stream = ZQL_videosInfos[index].stream;
    var srsrtc;
    if (stream.indexOf("webrtc") >= 0) {
      let videosrc =
        "webrtc://" + ZQLGLOBAL.serverIp + "/live" + stream.split("/live")[1];
      srsrtc = new JSWebrtc.Player(videosrc, {
        video: video,
        autoplay: true,
        onPlay: (obj) => {
          ZQL_multivideo.liveStopLoading(index);
          ZQL_videosInfos[index].loading = false;
          ZQL_videosInfos[index].playerState = "success";

          if (ZQL_videosInfos[index].refreshTimeInterval) {
            clearInterval(ZQL_videosInfos[index].refreshTimeInterval);
          }
          ZQL_videosInfos[index].refreshTime =
            parseInt((Math.random() * 5 + 5) * 1000) * 60;
          ZQL_videosInfos[index].refreshTimeInterval = setInterval(() => {
            ZQL_multivideo.handleRefresh(index);
          }, ZQL_videosInfos[index].refreshTime);
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
          ZQL_multivideo.liveStopLoading(index);
          ZQL_videosInfos[index].playerState = "success";
          ZQL_videosInfos[index].loading = false;
          if (ZQL_videosInfos[index].refreshTimeInterval) {
            clearInterval(ZQL_videosInfos[index].refreshTimeInterval);
          }
          ZQL_videosInfos[index].refreshTime =
            parseInt((Math.random() * 5 + 5) * 1000) * 60;
          ZQL_videosInfos[index].refreshTimeInterval = setInterval(() => {
            ZQL_multivideo.handleRefresh(index);
          }, ZQL_videosInfos[index].refreshTime);
        })
        .catch((err) => { });
      if (ZQL_videosInfos[index].replayTimer) {
        clearTimeout(ZQL_videosInfos[index].replayTimer);
      }
      ZQL_videosInfos[index].replayTimer = setTimeout(() => {
        ZQL_multivideo.replayflv(srsrtc, cameraId, index);
      }, 3000);
    } else {
      video.src = "staticdata/" + stream.split("/home/linaro/ks/")[1];
    }

    ZQL_videosInfos[index].srsrtc = srsrtc;

  },
  replayflv(srsrtc, cameraId, index) {
    if (!ZQL_videosInfos[index]) {
      return;
    }
    if (ZQL_videosInfos[index].playerState == "success") {
      return;
    } else {
      srsrtc.unload();
      srsrtc.load();
      srsrtc
        .play()
        .then((res) => {
          ZQL_multivideo.liveStopLoading(index);
          ZQL_videosInfos[index].playerState = "success";
          ZQL_videosInfos[index].loading = false;
          if (ZQL_videosInfos[index].refreshTimeInterval) {
            clearInterval(ZQL_videosInfos[index].refreshTimeInterval);
          }
          ZQL_videosInfos[index].refreshTime =
            parseInt((Math.random() * 5 + 5) * 1000) * 60;
          ZQL_videosInfos[index].refreshTimeInterval = setInterval(() => {
            ZQL_multivideo.handleRefresh(index);
          }, ZQL_videosInfos[index].refreshTime);
        })
        .catch((err) => {
          // this.destoryVideoByIndex(index);
          // this.subscribeLive(cameraId, index);
        });
      if (ZQL_videosInfos[index].replayTimer) {
        clearTimeout(ZQL_videosInfos[index].replayTimer);
      }
      ZQL_videosInfos[index].replayTimer = setTimeout(() => {
        ZQL_multivideo.replayflv(srsrtc, cameraId, index);
      }, 3000);
    }
  },
  reSubcribe(cameraId, index) {
    if (ZQL_videosInfos[index].subscribeTimeout) {
      clearTimeout(ZQL_videosInfos[index].subscribeTimeout);
      ZQL_videosInfos[index].subscribeTimeout = null;
    }
    ZQL_multivideo.videosInfos[index].subscribeTimeout = setTimeout(() => {
      ZQL_multivideo.subscribeLive(cameraId, index);
    }, 1000);
  },
  getCameraSize(id, index) {
    ZQL_multivideo.setOrisize(
      ZQL_sources[id].draw_size[0],
      ZQL_sources[id].draw_size[1],
      index, id
    );
    console.log(ZQL_sources[id,'ZQL_sources']);
    
  },
  setOrisize(width, height, index, id) {
    let container = document.querySelector(".video-box");
    if (!container) {
      return;
    }
    if (!ZQL_videosInfos[index]) {
      let alg = null;
      if (sessionStorage.getItem("curalgs")) {
        let cameraId = ZQL_playingSource[index];
        let curalgs = JSON.parse(sessionStorage.getItem("curalgs"));
        alg = curalgs[cameraId]
          ? JSON.parse(JSON.stringify(curalgs[cameraId]))
          : null;
      }
      ZQL_videosInfos[index] = {
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
    if (ZQL_videosInfos[index]) {
      let oriWidth = width;
      let oriHeight = height;
      ZQL_videosInfos[index].oriWidth = oriWidth;
      ZQL_videosInfos[index].oriHeight = oriHeight;

      if (
        oriWidth / container.offsetWidth >
        oriHeight / container.offsetHeight
      ) {
        ZQL_videosInfos[index].actualHeight = container.offsetWidth / (oriWidth / oriHeight)
        ZQL_videosInfos[index].actualWidth = container.offsetWidth;
      } else {
        ZQL_videosInfos[index].actualHeight = container.offsetHeight
        ZQL_videosInfos[index].actualWidth = container.offsetHeight * (oriWidth / oriHeight)
      }
      // videoWidth = ZQL_videosInfos[index].actualWidth;
      ZQL_multivideo.setPosition(index);
    }
  },
  setPosition(index) {
    let container = document.querySelector(".video-box");
    let video = document.querySelector("#video" + index);
    let canvas = document.getElementById("canvas" + index);
    let width = ZQL_videosInfos[index].actualWidth, height = ZQL_videosInfos[index].actualHeight;
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
  },
  setAlarms: (data, index) => {
    ZQL_multivideo.clearCanvas(index);
    if (ZQL_videosInfos[index] && !ZQL_videosInfos[index].canvas) {
      ZQL_videosInfos[index].canvas = document.getElementById("canvas" + index)
    }
    if (
      !ZQL_videosInfos[index] ||
      !ZQL_videosInfos[index].actualWidth ||
      !ZQL_videosInfos[index].actualHeight ||
      !ZQL_videosInfos[index].oriWidth ||
      !ZQL_videosInfos[index].oriHeight
    ) {
      return;
    }
    // let bbox = data.result.data.bbox;
    let bbox = data.bbox;
    if (Object.values(bbox.polygons).length > 0) {
      Object.values(bbox.polygons).forEach((item) => {
        let color = JSON.parse(JSON.stringify(item.color)).reverse();
        // let color = item.color;
        let points = item.polygon.map((point) => {
          return [
            Math.round(
              (point[0] * ZQL_videosInfos[index].actualWidth) /
              ZQL_videosInfos[index].oriWidth
            ),
            Math.round(
              (point[1] * ZQL_videosInfos[index].actualHeight) /
              ZQL_videosInfos[index].oriHeight
            ),
          ];
        });
        let context = ZQL_videosInfos[index].canvas.getContext("2d");
        context.font = "20px Arial bolder";
        context.fillStyle = "transparent";
        context.strokeStyle = "rgb(" + color.join(",") + ")";
        context.lineWidth = 2;
        ZQL_multivideo.drawPolygons(points, context);
        ZQL_multivideo.drawPolygonInfo(context, Object.values(bbox.polygons), index);
      });
    }

    if (bbox.rectangles.length > 0) {
      bbox.rectangles.forEach((item, i) => {
        let color = JSON.parse(JSON.stringify(item.color)).reverse();
        let coordinates = {
          x: Math.round(
            (item.xyxy[0] * ZQL_videosInfos[index].actualWidth) /
            ZQL_videosInfos[index].oriWidth
          ),
          y: Math.round(
            (item.xyxy[1] * ZQL_videosInfos[index].actualHeight) /
            ZQL_videosInfos[index].oriHeight
          ),
          x1: Math.round(
            (item.xyxy[2] * ZQL_videosInfos[index].actualWidth) /
            ZQL_videosInfos[index].oriWidth
          ),
          y1: Math.round(
            (item.xyxy[3] * ZQL_videosInfos[index].actualHeight) /
            ZQL_videosInfos[index].oriHeight
          ),
        };
        let context = ZQL_videosInfos[index].canvas.getContext("2d");
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
          ZQL_multivideo.drawLine(context, item);
        });
      });
    }

    if (Object.values(bbox.lines).length > 0) {
      Object.values(bbox.lines).forEach((item, i) => {
        let color = JSON.parse(JSON.stringify(item.color)).reverse();
        let coordinates = {
          x: Math.round(
            (item.line[0][0] * ZQL_videosInfos[index].actualWidth) /
            ZQL_videosInfos[index].oriWidth
          ),
          y: Math.round(
            (item.line[0][1] * ZQL_videosInfos[index].actualHeight) /
            ZQL_videosInfos[index].oriHeight
          ),
          x1: Math.round(
            (item.line[1][0] * ZQL_videosInfos[index].actualWidth) /
            ZQL_videosInfos[index].oriWidth
          ),
          y1: Math.round(
            (item.line[1][1] * ZQL_videosInfos[index].actualHeight) /
            ZQL_videosInfos[index].oriHeight
          ),
        };
        let context = ZQL_videosInfos[index].canvas.getContext("2d");
        context.font = "20px Arial bolder";
        context.fillStyle = "rgb(" + color.join(",") + ")";
        if (item.ext.direction) {
          context.fillText(item.name, (coordinates.x + coordinates.x1) / 2, (coordinates.y + coordinates.y1) / 2 + 20);
        }

        context.strokeStyle = "rgb(" + color.join(",") + ")";
        context.lineWidth = 2;
        ZQL_multivideo.drawLine(context, coordinates);
        ZQL_multivideo.drawCountingInfo(context, Object.values(bbox.lines));
      });
    }
  },
  drawPolygons(points, context) {
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);

    for (var i = 1; i < points.length; i++) {
      context.lineTo(points[i][0], points[i][1]);
    }
    context.closePath();
    context.fill();
    context.stroke();
  },
  drawLine(ctx, line) {
    ctx.beginPath();
    ctx.moveTo(line.x, line.y);
    ctx.lineTo(line.x1, line.y1);
    ctx.stroke();
  },
  drawCountingInfo(context, lines) {
    lines.forEach((item, index) => {
      context.fillStyle = "rgb(255,0,0)";
      if (item.ext.direction.length == 2) {
        context.fillText(`[${item.name}] ${item.ext.action.count}: ${item.ext.result.count}`, 0, 20 * index + 20);
      } else {
        context.fillText(`[${item.name}] ${item.ext.action.increase}: ${item.ext.result.increase},${item.ext.action.decrease}: ${item.ext.result.decrease},${item.ext.action.delta}: ${item.ext.result.delta}`, 0, 20 * index + 20);
      }
    });
  },
  drawPolygonInfo(context, polygons, videoindex) {
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
  },
  destroyVideo(videonum) {
    for (let i = 0; i < videonum; i++) {
      ZQL_multivideo.destoryVideoByIndex(i);
    }
  },
  destoryVideoByIndex(index) {
    ZQL_multivideo.clearCanvas(index);
    if (ZQL_videosInfos[index]) {
      if (
        ZQL_videosInfos[index] &&
        ZQL_videosInfos[index].subscribeTimeout
      ) {
        clearTimeout(ZQL_videosInfos[index].subscribeTimeout);
        ZQL_videosInfos[index].subscribeTimeout = null;
      }
      if (ZQL_videosInfos[index] && ZQL_videosInfos[index].replayTimer) {
        clearTimeout(ZQL_videosInfos[index].replayTimer);
        ZQL_videosInfos[index].replayTimer = null;
      }
      if (ZQL_videosInfos[index].refreshTimeInterval) {
        clearInterval(ZQL_videosInfos[index].refreshTimeInterval);
        ZQL_videosInfos[index].refreshTimeInterval = null;
      }
      let video = document.getElementById("video" + index);
      video && (video.srcObject = null);
      ZQL_videosInfos[index].srsrtc &&
        ZQL_videosInfos[index].srsrtc.destroy();
      ZQL_multivideo.clearCanvas(index);
      ZQL_videosInfos[index] = null;
    }
  },
  clearCanvas(index) {
    let canvas = document.getElementById("canvas" + index);
    if (canvas && canvas.getContext("2d")) {
      canvas
        .getContext("2d")
        .clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    }
  },
  connectMqtt() {
    let mqttclient = mqtt.connect(`ws://${ZQLGLOBAL.serverIp}:${ZQLGLOBAL.websocket}/mqtt`);
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
        let id = msg.data.device.id + "_" + msg.data.source.id;
        for (let i = 0; i < 4; i++) {
          if (ZQL_videosInfos[i]) {
            let alg =
              ZQL_videosInfos[i].alg && ZQL_videosInfos[i].alg.algname;

            if (
              id == ZQL_playingSource[i] &&
              msg.data.alg.name == ZQL_videosInfos[i].alg
            ) {
              ZQL_multivideo.setAlarms(msg.data.reserved_data, i);
              if (
                ZQL_videosInfos[i] &&
                ZQL_videosInfos[i].canvasTimeout
              ) {
                clearTimeout(ZQL_videosInfos[i].canvasTimeout);
              }
              ZQL_videosInfos[i].canvasTimeout = setTimeout(() => {
                ZQL_multivideo.clearCanvas(i);
              }, 1000);
              break;
            }
          }
        }
      }
    });
  }
}

const ZQL_apis = {
  getDevices: () => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.getDevices}`,
        // header: { Authorization: `Bearer ${ZQLGLOBAL.token}`},
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", `Bearer ${ZQLGLOBAL.token}`);
        },
        success: function (res) {
          resolve(res)
        },
        error: function (err) {
          reject(err)
        }
      });
    })
  },
  getSources: () => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.getSources}`,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", `Bearer ${ZQLGLOBAL.token}`);
        },
        success: function (res) {
          resolve(res)
        },
        error: function (err) {
          reject(err)
        }
      });
    })
  },
  subscribeLive: (device_id, source_id) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.subscribe}?device_id=${device_id}&source_id=${source_id}`,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", `Bearer ${ZQLGLOBAL.token}`);
        },
        success: function (res) {
          resolve(res)
        },
        error: function (err) {
          reject(err)
        }
      });
    })
  },
  sysArgs: () => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.sysArgs}`,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", `Bearer ${ZQLGLOBAL.token}`);
        },
        success: function (res) {
          resolve(res)
        },
        error: function (err) {
          reject(err)
        }
      });
    })
  },
  detectStream: () => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://${ZQLGLOBAL.serverIp}:${ZQLGLOBAL.srs_http_api}/api/v1/streams?start=0&count=10000`,
        success: function (res) {
          resolve(res)
        },
        error: function (err) {
          reject(err)
        }
      });
    })
  },
  detectVideo: (device_id, stream) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.detect}?device_id=${device_id}&stream=${stream}&draw_size=1280`,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", `Bearer ${ZQLGLOBAL.token}`);
        },
        success: function (res) {
          if (res.error == 0) {
            resolve({ status: 1 })
          } else {
            resolve({ status: 0 })
          }
        },
        error: function (err) {
          reject(err)
        }
      });
    })
  },
  gettoken: () => {
    var ak = ZQLGLOBAL.accessKey;
    var sk = ZQLGLOBAL.accessSecret;
    var timestamp = parseInt(new Date().getTime() / 1000);
    var nonce = ZQL_apis.generateRandomString(10);
    let signature = ZQL_apis.generateSignature(ak, sk, timestamp, nonce)
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.getToken}?signature=${signature}&ak=${ak}&timestamp=${timestamp}&nonce=${nonce}`,
        success: function (res) {
          resolve(res)
        },
        error: function (err) {
          reject(err)
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", `Bearer eyJhbGciOiJIUzUxMiJ9.eyJ0ZW5hbnQiOiJ0ZXN0IiwibG9naW5fdXNlcl9rZXkiOiJjZjkxZWUzNi1hZWUyLTQ0ZmYtOGZkZC0yMzFhZWFmZTBjNmUifQ.PutkYfZJbyRyy-T4Plc1BONZT0R4JMeBrkBQ8123e3FetX_qE9SODjUGJeErE9GU_LecClmLfy6DklYeGEiZ8w`);
        }
      });
    })
  },
  generateSignature: (ak, sk, timestamp, nonce) => {
    var message = `${ak}:${timestamp}:${nonce}`;
    var hash = CryptoJS.HmacSHA256(message, sk);
    var signature = CryptoJS.enc.Hex.stringify(hash);
    return signature
  },
  generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }
}
