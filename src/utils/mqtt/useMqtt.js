import store from '@/store';
import { DRC_METHOD } from './use-manual-control';
import Vue from 'vue';
const vm = new Vue()
// 心跳
let heartBeatSeq = 0
const state = {
    heartState: new Map()
};
export const userMqtt = (deviceTopicInfo) => {
    let cacheSubscribeArr = [];
    const mqttState = store.state.droneStatus.mqttState;
    function subscribeMqtt(topic, handleMessageMqtt) {
        //订阅

        mqttState?.subscribeMqtt(topic)
        const handler = handleMessageMqtt || onMessageMqtt
        mqttState?.on('onMessageMqtt', handler)
        cacheSubscribeArr.push({
            topic,
            callback: handler,
        })

    };
    function publishMqtt(topic, body, ots) {
        mqttState?.publishMqtt(topic, JSON.stringify(body), ots);
    }
    function onMessageMqtt(message) {
        if (cacheSubscribeArr.findIndex(item => item.topic === message?.topic) !== -1) {
            const payloadStr = new TextDecoder('utf-8').decode(message?.payload)
            const payloadObj = JSON.parse(payloadStr)
            switch (payloadObj?.method) {
                case DRC_METHOD.HEART_BEAT:
                    break
                case DRC_METHOD.DELAY_TIME_INFO_PUSH:
                case DRC_METHOD.HSI_INFO_PUSH:
                case DRC_METHOD.OSD_INFO_PUSH:
                case DRC_METHOD.DRONE_CONTROL:
                case DRC_METHOD.DRONE_EMERGENCY_STOP:
                    //   EventBus.emit('droneControlMqttInfo', payloadObj)

                    break
                default:
                    break
            }
        }
    }
    function unsubscribeDrc() {
        // 销毁已订阅事件
        cacheSubscribeArr.forEach(item => {
            mqttState?.off('onMessageMqtt', item.callback)
            mqttState?.unsubscribeMqtt(item.topic)
        })
        cacheSubscribeArr = []
        heartBeatSeq = 0
    }


    // 监听云控控制权
    vm.$watch(() => deviceTopicInfo, (val, oldVal) => {
        if (val.subTopic !== '') {
            // 1.订阅topic
            subscribeMqtt(deviceTopicInfo.subTopic)
            // 2.发心跳
            publishDrcPing(deviceTopicInfo.sn)
        } else {
            clearInterval(state.heartState.get(deviceTopicInfo.sn)?.pingInterval)
            state.heartState.delete(deviceTopicInfo.sn)
            heartBeatSeq = 0
        }
    }, { immediate: true, deep: true })

    function publishDrcPing(sn) {
        const body = {
            method: DRC_METHOD.HEART_BEAT,
            data: {
                ts: new Date().getTime(),
                seq: heartBeatSeq,
            },
        }
        console.log(sn,'sn');
        
        const pingInterval = setInterval(() => {
            if (!mqttState) return
            heartBeatSeq += 1
            body.data.ts = new Date().getTime()
            body.data.seq = heartBeatSeq
            body.data.timestamp = new Date().getTime();
            console.log(body);
            
            publishMqtt(deviceTopicInfo.pubTopic, body, { qos: 0 })
        }, 1000)
        state.heartState.set(sn, {
            pingInterval,
        })
        console.log(state,'state');
        
    }
    return {
        mqttState,
        publishMqtt,
        subscribeMqtt,
        unsubscribeDrc
    }
};
