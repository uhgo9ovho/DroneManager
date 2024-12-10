
import { getAirLineAPI } from '@/api/TaskManager';
const state = {
    downloadStatus: false,
    isDrawText: "",
    type: 3, //1 点  2 线  3 面
    taskType: 0,
    pointsList: []
}
const mutations = {
    CHANGE_DOWNLOAD_STATUS(state, flag) {
        state.downloadStatus = flag;
    },
    CHANGE_DROC_STATUS(state, flag) {
        state.isDrawText = flag;
    },
    CHANGE_COORDINATESARR(state, arr) {
        const result = arr.map(item => ({
            lon: item[0],
            lat: item[1]
        }));
        const params = {
            type: state.type,
            taskType: state.taskType,
            pointsList: result
        }
        getAirLineAPI(params).then(res=> {
            if(res.code == 200) {
                state.pointsList = res.lineList[0].pointsList.map(item => [item.lon, item.lat]);
                console.log(state.pointsList);
            }
        })
        console.log(arr, 'changeARR');

    },
    CHANGE_TASKTYPE_STATUS(state, type) {
        state.taskType = type;
    }
}
const actions = {}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}