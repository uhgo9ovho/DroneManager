import request from '@/utils/request';

/**
 * 新建任务
 * @param 
 * {
    "taskName":"ceshi03",//任务名称
    "taskType":0,// 任务类型：任务类型：0：表示拍照；1：表示直播；2：表示全景；3：表示正射；4：表示三维
    "taskAddress":"陕西省咸阳市",//任务位置
    "schedulingType":0, // 排期时间类型：排期类型：0：表示9:00-12:00；1：表示12.00-17:00；2：表示17:00-21:00；3：表示全天
    "timesType":2,//循环周期类型：0：表示天；1：表示周；2：表示月
    "airlineNumber":2, // 航线数量
    "startTime":"2024-08-10", //开始日期
    "endTime":"2024-08-15", //结束日期
    "dateArrays":[10,11], // 在循环周期为周或者月时需要传：为周时1-7表示星期一到星期日；为月时传1-31号
   "linesFile":['/profile/upload/2024/08/09/f27fccf7-3c8f-4abe-aa8e-62ef8e90a4c1.kmz','/profile/upload/2024/08/09/f27fccf7-3c8f-4abe-aa8e-62ef8e90a4c1.kmz'] //航线文件列表
    } 
 * @returns 
 */
export const addTask = (params) => {
    return request({
        url: '/wurenji/task/addTask',
        method: 'post',
        data: params
    })
};

/**
 * 任务列表
 * @returns 
 */
export const taskListAPI = () => {
    return request({
        url: '/wurenji/task/list',
        method: 'get'
    })
};

/**
 * 任务详情
 * @param {taskId} id 
 * @returns 
 */
export const taskInfoApI = (id) => {
    return request({
        url: `/wurenji/task/getTaskInfo/${id}`,
        method: 'get'
    })
};

/**
 * 计划飞行列表
 * @returns 
 */
export const heduledListAPI = () => {
    return request({
        url: '/wurenji/scheduling/scheduledList',
        method: 'get'
    })
};

/**
 * 飞行记录列表
 * @returns 
 */
export const recordListAPI = () => {
    return request({
        url: '/wurenji/record/list',
        method: 'get'
    })
};