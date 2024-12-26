
import { getAirLineAPI } from '@/api/TaskManager';
import { Message } from 'element-ui';
const state = {
    downloadStatus: false,
    isDrawText: "",
    type: 3, //1 点  2 线  3 面
    taskType: 0,
    pointsList: [],
    airlineList: []
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
            pointsList: result,
            workspaceId: localStorage.getItem('workspaceId')
        }
        getAirLineAPI(params).then(res=> {
            if(res.code == 200) {
                state.airlineList = res.airlineList;
                res.airlineList.forEach(item => {
                    const pointsArr = item.drawLineInfo.pointsList.map(it => [it.lon, it.lat])
                    state.pointsList.push(pointsArr)
                })
            } else {
                Message.error(res.msg);
                state.isDrawText = "取消";
            }
        })

    },
    CHANGE_TASKTYPE_STATUS(state, type) {
        state.taskType = type;
    },
    CLEAR_POINTSLIST(state) {
        state.pointsList = [];
    }
}
const actions = {}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}