import request from "@/utils/request";

export const getOrgListAPI = (params) => {
  return request({
    url: "/wrj/org/list",
    method: "get",
    params,
  });
};

export const addOrgAPI = (data) => {
  return request({
    url: "/wrj/org",
    method: "post",
    data,
  });
};

export const editOrgAPI = (data) => {
  return request({
    url: "/wrj/org/editWrjOrgInfo",
    method: "put",
    data,
  });
};

export const addDeviceAPI = (params) => {
    return request({
        url: '/crm/device',
        method: 'post',
        data: params
    })
}

/**
 * 获取设备列表
 * @param {pageNum} params 
 * @param {pageSize} params 
 * @param {orgId} params 
 * @returns 
 */
export const getDeviceListAPI = (params) => {
    return request({
        url: `/crm/device/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&orgId=${params.orgId}`,
        method: 'get',
    })
}