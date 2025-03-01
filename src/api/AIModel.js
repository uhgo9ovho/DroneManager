import request from '@/utils/request';

/**
 * 获取ai盒子的token
 */
export const getAITokenAPI = () => {
    return request({
        url: '/aiBox/getAiBoxToken',
        method: 'get',
    })
}
/**
 * 获取设备列表
 */
export const getDeviceListAPI = (params) => {
    return request({
        url: '/crm/device/getDeviceByOrgIdAndType',
        method: 'get',
        params
    })
}

/**
 * 获取数据源
 */
export const getSourceAPI = (params) => {
    return request({
        url: '/aiBox/getSourceAddress',
        method: 'get',
        params,
    })
}
/**
 * 订阅实时视频流
 */
export const subscribeLiveAPI = (params) => {
    return request({
        url: '/aiBox/getWebRtcList',
        method: 'get',
        params
    })
}
/**
 * 获取系统参数
 */
export const sysArgsAPI = (params) => {
    return request({
        url: '/aiBox/getDeviceInfo',
        method: 'get',
        params
    })
} 

/**
 * 获取状态
 */
export const stearmAPI = () => {
    return request({
        url: '/aiBox/getStreams',
        method: 'get'
    })
}