import { connect } from 'mqtt/dist/mqtt.min';

const ZQL_multivideo = {
    
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


export default AIBoxMqtt;