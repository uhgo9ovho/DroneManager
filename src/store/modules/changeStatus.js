const state = {
    downloadStatus: false,
}
const mutations = {
    CHANGE_DOWNLOAD_STATUS(state, flag) {
        state.downloadStatus = flag;
    }
}
const actions = {}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}