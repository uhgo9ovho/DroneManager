const state = {
    statusInfo: {},
    deviceSN: localStorage.getItem('devicesSN') ? localStorage.getItem('devicesSN') : "",
    topic: {},
    mqttState: null,
    outsideStreamUrl: ""
}
const mutations = {
    GET_DRONE_INFO(state, info) {
        if (info.data) {
            state.statusInfo = info;
        }
    },
    GET_DEVICE_SN(state, info) {
        if (localStorage.getItem('devicesSN')) {
            state.deviceSN = localStorage.getItem('devicesSN');
        } else {
            state.deviceSN = info;
        }
    },
    GET_SUB_PUB(state, data) {
        state.topic = data;
    },
    GET_MQTT_STATE(state, obj) {
        state.mqttState = obj;
    },
    GET_OUTSIDE_STREAM_URL(state, obj) {
        state.outsideStreamUrl = obj;
    }
}

const actions = {
    getDroneInfo({ commit }, info) {
        commit('GET_DRONE_INFO', info);
    },
    getDeviceSN({ commit }, data) {
        localStorage.setItem('devicesSN', data);
        commit('GET_DEVICE_SN', data)
    },
    getToicpSubPub({ commit }, data) {
        commit('GET_SUB_PUB', data);
    },
    getMqttState({ commit }, obj) {
        commit('GET_MQTT_STATE', obj);
    },
    getOutsideStreamUrl({ commit }, obj) {
        console.log(obj, "obj");
        commit('GET_OUTSIDE_STREAM_URL', obj);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

