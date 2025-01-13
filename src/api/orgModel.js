import request from "@/utils/request";

export const getOrgListAPI = (params) => {
  return request({
    url: "/wrj/org/list2",
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

/**
 * 删除组织
 * @param {orgId} params 
 * @returns 
 */
export const deleteOrgAPI = (orgId) => {
    return request({
        url: `/wrj/org/delete/${orgId}`,
        method: 'delete',
    })
}

/**
 * 删除设备
 * @param {deviceId} params 
 * @returns 
 */
export const deleteDeviceAPI = (deviceId) => {
    return request({
        url: `/crm/device/${deviceId}`,
        method: 'delete',
    })
}

/**
 * 编辑设备
 * @param {params} params 
 * @returns 
 */
export const editDeviceAPI = (params) => {
    return request({
        url: `/crm/device`,
        method: 'put',
        data: params
    })
}

/**
 * 获取角色列表
 * @param {params} params 
 * @returns 
 */
export const getRoleListAPI = (params) => {
    return request({
        url: `/system/role/list?`,
        method: 'get',
        params
    })
}

/**
 * 角色编辑回显
 */
export const roleMenuTreeselectAPI = (roleId) => {
  return request({
    url: `/system/menu/roleMenuTreeselect/${roleId}`,
    method: 'get'
  })
}

/**
 * 角色编辑
 */
export const editRoleAPI = (params) => {
  return request({
    url: '/system/role',
    method: 'put',
    data: params
  })
}

/**
 * 获取角色下拉框数据
 */
export const roleOptionsAPI = () => {
  return request({
    url: '/system/user/',
    method: 'get'
  })
}

/**
 * 成员编辑回显接口
 */
export const EditEchoAPI = (id) => {
  return request({
    url: `/system/user/${id}`,
    method: 'get'
  })
}