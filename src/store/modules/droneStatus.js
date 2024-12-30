import { airPostAPI } from "@/api/TaskManager.js";

const state = {
    statusInfo: {},
    deviceSN: localStorage.getItem('devicesSN') ? localStorage.getItem('devicesSN') : "",
    topic: {},
    mqttState: null,
    outsideStreamUrl: "",
    airPostInfo: null
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
    },
    SET_AIR_POST_INFO(state, info) {
        console.log(info, "info");
        
        state.airPostInfo = info;
    },
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
        commit('GET_OUTSIDE_STREAM_URL', obj);
    },
    async fetchAirPostInfo({ commit }) {
        // 添加参数校验
        const orgId = localStorage.getItem("org_id");
        if (!orgId) {
            console.warn('未获取到 orgId，请先登录');
            return;
        }

        try {
            const params = {
                orgId,
                deviceType: 1,
            };
            const res = await airPostAPI(params);
            if (res.code === 200) {
                commit('SET_AIR_POST_INFO', res.rows[0]);
                console.log(res.rows[0], "res.rows[0]");
            }
        } catch (error) {
            console.error('获取机场信息失败:', error);
        } finally {

        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

