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
