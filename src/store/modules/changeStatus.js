
import { getAirLineAPI } from '@/api/TaskManager';
import { Message } from 'element-ui';
import { gcj02ToWgs84, wgs84ToGcj02 } from "@/utils/CoordinateTransformation.js";
const state = {
    downloadStatus: false,
    isDrawText: "",
    type: 3, //1 点  2 线  3 面
    taskType: 0,
    pointsList: [],
    airlineList: [],
    lineType: 0, //任务类型
}
const mutations = {
    CHANGE_DOWNLOAD_STATUS(state, flag) {
        state.downloadStatus = flag;
    },
    CHANGE_DROC_STATUS(state, flag) {
        state.isDrawText = flag;
    },
    CLEAR_POINTSLIST(state) {
        state.pointsList = [];
    },
    CHANGE_COORDINATESARR(state, arr) {
        const formatArr = arr.map(item => {
            return gcj02ToWgs84(item[0], item[1]);
        })
        console.log(arr,'高德地图的框选坐标（gcj02）');
        
        const result = formatArr.map(item => ({
            lon: item[0],
            lat: item[1]
        }));
        console.log(result, '传给后台的框选坐标（gcj02-》 wgs84）');
        
        const params = {
            type: state.type,
            taskType: state.taskType,
            pointsList: result,
            workspaceId: localStorage.getItem('workspaceId')
        }
        getAirLineAPI(params).then(res => {
            if (res.code == 200) {
                state.lineType = res.requestParam.taskType;
                state.airlineList = res.airlineList;
                res.airlineList.forEach(item => {
                    // const pointsArr = item.drawLineInfo.pointsList.map(it => {
                    //     return [it.lon, it.lat]
                    // })
                    const pointsArr = item.drawLineInfo.pointsList.map(it => wgs84ToGcj02(it.lon, it.lat))
                    // const pointsArr = item.drawLineInfo.pointsList.map(it => [it.lon, it.lat])

                    state.pointsList.push(...pointsArr)
                })
                console.log(res.airlineList[0].drawLineInfo.pointsList, '返回的航线坐标（wgs84）');
                
                console.log(state.pointsList, '返回的航线坐标（wgs84-》gcj02）');
                
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