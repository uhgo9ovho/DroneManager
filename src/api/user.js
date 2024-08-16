import request from '@/utils/request'

// 获取列表组织
export const getDepartmentList = (params) => {
    return request({
        url: `/wrj/org/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}`,
        method: 'get'
    })
};

//获取组织详情
export const getDepartmentDetails = (id) => {
    return request({
        url: `/wrj/dept/getWrjDeptInfo/${id}`,
        method: "get"
    })
};

/**
 * 新增组织
 * @param { ad: "地址", head: "负责人姓名", headPhone: "负责人电话", orgName: "组织名称", platformLogo: "平台logo", platformName: "平台名称", webLogo: "网页链接logo" } params 
 * @returns 
 */
export const addDepartment = (params) => {
    return request({
        url: `wrj/org`,
        method: "post",
        data: params
    })
};

/**
 * 修改信息组织
 * @param { orgId: "组织id", orgName: "组织名称", ad: "地址", head: "负责人姓名", headPhone: "负责人电话",  platformLogo: "平台logo", platformName: "平台名称", webLogo: "网页链接logo" } params
 * @returns
 */
export const editOrgInfo = (params) => {
    return request({
        url: "/wrj/org/editWrjOrgInfo",
        method: "put",
        data: params
    })
};

/**
 * 新建部门
 * @param { orgDeptName: "部门名称", isOrg: "是否为组织 是为1 0为否", orgId: "组织id", member: 0 } params 
 * @returns 
 */
export const addDept = (params) => {
    return request({
        url: "/wrj/dept/addWrjDept",
        method: "post",
        data: params
    })
};

/**
 * 修改部门信息
 * @param { id: 10, orgDeptName: "质量管理部门", createId: 1, marker: null } params 
 * @returns 
 */
export const editDeptInfo = (params) => {
    return request({
        url: "/wrj/dept/editWrjDeptInfo",
        method: "put",
        data: params
    })
};

//获取部门详情
export const getDeptInfo = (id) => {
    return request({
        url: `/wrj/dept/getWrjDeptInfo/${id}`,
        method: "get",
    })
};

//删除部门
export const delDept = (id) => {
    return request({
        url: `/wrj/dept/deleteWrjOrgDept/${id}`,
        method: 'delete'
    })
};

//获取部门列表
export const getDeptList = (params) => {
    return request({
        url: `/wrj/dept/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}`,
        method: "get"
    })
};

/**
 * 新增成员接口
 * @param {"userName":"张巧莲", // 用户名 "nickName":"张巧莲", // 昵称 "phonenumber":"13256653223",// 手机号码 "password":"jky123", // 密码 "orgId":1, // 组织id "roleIds":[2] //默认角色id为2 } params 
 * @returns 
 */
export const addUser = (params) => {
    return request({
        url: "/wrj/user/addOrgUSer",
        method: "post",
        data: params
    })
};

//获取成员详情
export const getUserInfo = (id) => {
    return request({
        url: `/wrj/user/getWrjUserInfo/${id}`,
        method: "get"
    })
};

/**
 * 修改成员
 * @param { "id": 5, "phonenumber": "13256653223" } params 
 * @returns 
 */
export const editUserInfo = (params) => {
    return request({
        url: "/wrj/user/editOrgUser",
        method: "put",
        data: params
    })
};

//获取组织成员列表
export const getUserList = (orgId) => {
    return request({
        url: `/wrj/user/list?orgId=${orgId}`,
        method: "get"
    })
};