import request from '@/utils/request'

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
export const addAndEditTask = (params) => {
  return request({
    url: '/wurenji/task/addTask',
    method: 'post',
    data: params
  })
}

/**
 * 任务列表
 * @returns
 */
export const taskListAPI = (params) => {
  return request({
    url: `/wurenji/task/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&orgId=${localStorage.getItem('org_id')}&taskName=${params.taskName ? params.taskName : ''}`,
    method: 'get'
  })
}

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
}

/**
 * 计划飞行列表(日)
 * @returns
 */
export const heduledListAPI = (date) => {
  return request({
    url: `/wurenji/scheduling/list?date=${date}&orgId=${localStorage.getItem('org_id')}`,
    method: 'get'
  })
}

/**
 * 计划飞行列表(月)
 * @returns
 */
export const heduledMonthListAPI = (params) => {
  return request({
    url: `/wurenji/scheduling/list?start=${params.start}&end=${params.end}&orgId=${localStorage.getItem('org_id')}`,
    method: 'get'
  })
}

/**
 * 查询航线
 */
export const searchLineAPI = (taskId) => {
  return request({
    url: `/wurenji/airline/list?taskId=${taskId}`
  })
}
/**
 * 飞行记录列表
 * @returns
 */
export const recordListAPI = (params) => {
  return request({
    url: `/wurenji/record/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&orgId=${params.orgId}&searchValue=${params.taskName ? params.taskName : ''}`,
    method: 'get'
  })
}

/**
 * 挂起任务
 */
export const upDataTaskStatusAPI = (taskId) => {
  return request({
    url: `/wurenji/task/upDataTaskStatus/${taskId}`,
    method: 'get'
  })
}

/**
 * 删除任务
 */
export const deleteTaskAPI = (taskIds) => {
  return request({
    url: `/wurenji/task/${taskIds}`,
    method: 'delete'
  })
}

/**
 * 预警列表
 */
export const warningListAPI = (params) => {
  return request({
    url: `/wurenji/warning/list`,
    method: 'get',
    params,
  })
}

/**
 * 预警事件状态变更记录
 */
export const statusChangeAPI = (id) => {
  return request({
    url: `/wurenji/warning/statusList/${id}`,
    method: 'get'
  })
}

/**
 * 预警详情
 */
export const warningDetailsAPI = (id) => {
  return request({
    url: `/wurenji/warning/${id}`,
    method: 'get'
  })
}

/**
 * ids eg: 1,2,3,4,...
 * 删除预警事件
 */
export const deleteWarningAPI = (ids) => {
  return request({
    url: `/wurenji/warning/delete/${ids}`,
    method: 'get'
  })
}

/**
 * @params :{
 "warnId": "18",
 "status": "1",
 "remark": "我想结案",
 "photo": "alsdjflkajdsfkljalsjfdladf"
 }
 * 修改预警事件状态
 */
export const updateStatusAPI = (params) => {
  return request({
    url: '/wurenji/warning/updateStatus',
    method: 'post',
    data: params
  })
}

/**
 * @params {
 "warnName": "何列报",
 "warnTypeId": 87,
 "warnTypeName": "南话节",
 "airLineId": 42,
 "airLineName": "中权专",
 "identifyAirPortId": 21,
 "identifyAirPortName": "厂时理",
 "identifyPhoto": "https://via.placeholder.com/400x400/2ace3d/bfff75.png",
 "address": "辽宁省长乡县阳城县",
 "latitude": -48.3033,
 "longitude": 144.0611,
 "status": "0",
 "description": "号是极极持太义目。压从方有山众五越道边。求北交他。放例方需入。"
 }
 * 新增预警事件
 */
export const addWarningAPI = (params) => {
  return request({
    url: '/wurenji/warning/add',
    method: 'post',
    data: params
  })
}

/**
 * @params {
 "id": 1,
 "warnName": "热系委",
 "warnTypeId": 27,
 "warnTypeName": "切下明",
 "airLineId": 31,
 "airLineName": "方速文",
 "identifyAirPortId": 8,
 "identifyAirPortName": "运阶研",
 "identifyPhoto": "https://via.placeholder.com/400x400/ff2281/55a3ef.png",
 "address": "内蒙古自治区济林市甘泉县",
 "latitude": -70.3366,
 "longitude": -15.8136,
 "description": "拉般到道。到构白百又。接论参。统值目。什斯参难力样变十。"
 }
 * 编辑预警事件
 */
export const editWarningAPI = (params) => {
  return request({
    url: '/wurenji/warning/edit',
    method: 'post',
    data: params
  })
}

/**
 * 任务列表的一键起飞
 */
export const takeoffAPI = (params) => {
  return request({
    url: `/wurenji/scheduling/testFly`,
    method: 'post',
    data: params
  })
}

/**
 * 获取航线轨迹
 */
export const airLineAPI = (params) => {
  return request({
    url: `/wurenji/record/getLine?orgId=${params.orgId}&startTime=${params.startTime}&endTime=${params.endTime}`,
    method: 'get'
  })
}

/**
 * 获取问题类型列表
 */
export const dictListAPI = (warn_type) => {
  return request({
    url: '/system/dict/data/list?dictType=' + warn_type + '&orgId=' + localStorage.getItem('org_id'),
    method: 'get'
  })
}

/**
 * 上传图片
 */
export const uploadAPI = (file) => {
  return request({
    url: '/common/upload',
    method: 'post',
    data: file,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 修改预警事件状态
 */
export const updateWarningStatusAPI = (params) => {
  return request({
    url: '/wurenji/warning/updateStatus',
    method: 'post',
    data: params
  })
}
const workspaceId = localStorage.getItem('workspaceId') || ''
/**
 * 获取设备信息列表
 */
export const deviceInfoAPI = (params) => {
  return request({
    url: `/system/hms/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}&messageZh=${params.messageZh}&workspaceId=${localStorage.getItem('workspaceId')}`,
    method: 'get'
  })
}

/**
 * 获取机场位置
 */
export const airPostAPI = (params) => {
  return request({
    url: `crm/device/list?orgId=${params.orgId}&deviceType=${params.deviceType}`,
    method: 'get'
  })
}

/**
 * 获取预警信息照片和时间
 */
export const getWarningPhotosAPI = (warnId) => {
  return request({
    url: `/wurenji/warning/picHis/list?warnId=${warnId}`,
    method: 'get'
  })
}

/**
 * 获取任务记录照片
 */
export const getLogPhotosAPI = (flightRecordId) => {
  return request({
    url: `/wurenji/result/list?flightRecordId=${flightRecordId}`,
    method: 'get'
  })
}
/**
 * 新增飞行排期
 */
export const addSchedulingAPI = (params) => {
  return request({
    url: '/wurenji/scheduling/addScheduling',
    method: 'post',
    data: params
  })
}

/**
 * 生成航线
 */
export const getAirLineAPI = (params) => {
  return request({
    url: '/wayline/drawLine',
    method: 'post',
    data: params
  })
}

/**
 * 删除排期接口
 */
export const delSortDataAPI = (params) => {
  return request({
    url: '/wurenji/scheduling/editOrDelete',
    method: 'post',
    data: params
  })
}

/**
 * 飞行排期的详情接口
 */
export const airLineInfoAPI = (airlineId) => {
  return request({
    url: `/wurenji/airline/${airlineId}`,
    method: 'get'
  })
}


/**
 * AI托管接口
 */
export const AIHostingAPI = (status) => {
    return request({
        url: `/aiAutomaticHostingController/findAutomaticHosting?org_id=${localStorage.getItem('org_id')}&status=${status}`,
        method: 'get'
    })
}

/**
 * 获取禁飞区接口
 */
export const getPlotAPI = () => {
  return request({
    url: `/crm/plot/getPlot?orgId=${localStorage.getItem('org_id')}`,
    method: 'get'
  })
}
