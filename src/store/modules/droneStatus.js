const state = {
    statusInfo: {},
}
const mutations = {
    GET_DRONE_INFO(state, info) {
        if (info.data) {
            state.statusInfo = info.data;

        }
    }
}

const actions = {
    getDroneInfo({ commit }, info) {
        commit('GET_DRONE_INFO', info);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

