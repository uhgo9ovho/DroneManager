const state = {
    statusInfo: {},
    deviceSN: ""
}
const mutations = {
    GET_DRONE_INFO(state, info) {
        if (info.data) {
            state.statusInfo = info;
        }
    },
    GET_DEVICE_SN(state, info) {
        state.deviceSN = info;
    }
}

const actions = {
    getDroneInfo({ commit }, info) {
        commit('GET_DRONE_INFO', info);
    },
    getDeviceSN({ commit }, data) {
        
        commit('GET_DEVICE_SN', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

