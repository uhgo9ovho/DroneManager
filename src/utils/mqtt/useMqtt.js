import store from '@/store';
export const userMqtt = (deviceTopicInfo) => {
    let cacheSubscribeArr = [];
    const mqttState = store.state.droneStatus.mqttState;
    function subscribeMqtt(topic, handleMessageMqtt) {
        //订阅
    };
    function publishMqtt(topic, body, ots) {
        mqttState?.publishMqtt(topic, JSON.stringify(body), ots);
    }
    return {
        publishMqtt
    }
};
