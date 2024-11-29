const state = {
    statusInfo: {},
    deviceSN: "",
    topic: {},
    mqttState: null
}
const mutations = {
    GET_DRONE_INFO(state, info) {
        if (info.data) {
            state.statusInfo = info;
        }
    },
    GET_DEVICE_SN(state, info) {
        state.deviceSN = info;
    },
    GET_SUB_PUB(state, data) {
        state.topic = data;
    },
    GET_MQTT_STATE(state, obj) {
        state.mqttState = obj;
    }
}

const actions = {
    getDroneInfo({ commit }, info) {
        commit('GET_DRONE_INFO', info);
    },
    getDeviceSN({ commit }, data) {
        
        commit('GET_DEVICE_SN', data)
    },
    getToicpSubPub({commit}, data) {
        commit('GET_SUB_PUB', data);
    },
    getMqttState({commit}, obj) {
        commit('GET_MQTT_STATE', obj);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

