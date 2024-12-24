import request from '@/utils/request';

/**
 * 一键返航和取消返航
 * 一键返航：sn：dockSN,service_identifier传"return_home"
 * 取消返航：sn:dockSN,service_identifier传"return_home_cancel"
 */
export const returnHomeAPI = (params) => {
    return request({
        url: `/drc/${params.sn}/jobs/${params.service_identifier}`,
        method: 'post',
    })
}

/**
 * 获取负载控制权
 * 传入参数：
   {"payloadIndex:"81-0-0"}  // 从webSocket获取
   sn为机场sn码
 */
export const getAuthorityAPI = (params, sn) => {
    return request({
        url: `/drc/${sn}/authority/payload`,
        method: 'post',
        data: params,
    })
}

/**
 * 切换相机模式
 * sn为机场sn码
 * 传入参数：
    {
        "cmd":"camera_mode_switch",
        "data":{
                "cameraMode":3,//"0":"拍照","1":"录像","2":"智能低光","3":"全景拍照"
                "payloadIndex":"81-0-0"
        }
    } 
 */
export const cameraModeSwitchAPI = (params, sn) => {
    return request({
        url: `/drc/${sn}/authority/payload/commands`,
        method: 'post',
        data: params,
    })
}

/**
 * 开始录像
 * sn为机场sn码
 * 传入参数：
    {
        "cmd":"camera_mode_switch",
        "data":{
                "cameraMode":3,//"0":"拍照","1":"录像","2":"智能低光","3":"全景拍照"
                "payloadIndex":"81-0-0"
        }
    }
 */
export const startRecordAPI = (params, sn) => {
    return request({
        url: `/drc/${sn}/authority/payload/commands`,
        method: 'post',
        data: params,
    })
}

/**
 * 停止录像
 * sn为机场sn码
 * 传入参数：
    {
        "cmd":"camera_recordinds_stop",   
        "data":{
                "payloadIndex":"81-0-0"
        }
    } 
 */
export const stopRecordAPI = (params, sn) => {
    return request({
        url: `/drc/${sn}/authority/payload/commands`,
        method: 'post',
        data: params,
    })
}

/**
 * 拍照
 * sn为机场sn码
 * 传入参数：
    {
        "cmd":"camera_photo_take",   
        "data":{
                "payloadIndex":"81-0-0"
        }
    }
 */
export const startTakePhotoAPI = (params, sn) => {
    return request({
        url: `/drc/${sn}/authority/payload/commands`,
        method: 'post',
        data: params,
    })
}

/**
 * 变焦 （必须先切流再变焦   流为zoom和ir时支持变焦，相关参数：zoom（2-200） ir(2-20)）
 * sn为机场sn码
 * 传入参数：
    {
        "cmd":"camera_focal_length_set"",   
        "data":{
                "cameraType":"zoom",// zoom,wide,ir
                "payloadIndex":"81-0-0",
                "zoomFactor":20
        }
    }
 */
export const setFocalLengthAPI = (params, sn) => {
    return request({
        url: `/drc/${sn}/authority/payload/commands`,
        method: 'post',
        data: params,
    })
}

/**
 * 切流
 * 传入参数：
    {
        "url_type":1, // 固定为1
        "video_id":"1581F6Q8D23CT00A4491/39-0-7/zoom-0",  // 1581F6Q8D23CT00A4491 为飞行器sn码，39-0-7为负载编号(和payloadIndex 值一致)
        "video_quality":0,
        "videoType":"zoom" //  值可为zoom、ir、wide      上面video_id 中拼接的需要和这个值一样
    } 
 */
export const switchStreamAPI = (params) => {
    return request({
        url: `/drc/streams/switch/byServer`,
        method: 'post',
        data: params,
    })
}