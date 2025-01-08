import request from '@/utils/request'

// 获取列表组织
export const getDepartmentList = (params) => {
    return request({
        url: `/wrj/org/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&userId=${params.userId}`,
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
 * @param { id: 10, orgDeptName: "质量管理部门", createId: 1, marker: "备注" } params 
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
        url: `/wrj/dept/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&orgId=${params.orgId}&orgDeptName=${params.orgDeptName}`,
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
export const getUserList = (params) => {
    return request({
        url: `/wrj/user/list?orgId=${params.orgId}&pageNum=${params.pageNum}&pageSize=${params.pageSize}`,
        method: "get"
    })
};

//成员搜索接口（只要是给后端传了nickName为空的时候返回的不是所有而是空）
export const searchUser = (params) => {
    return request({
        url: `/wrj/user/list?orgId=${params.orgId}&pageNum=${params.pageNum}&pageSize=${params.pageSize}&nickName=${params.nickName}`,
        method: "get"
    })
};

//删除成员
export const deleteUser = (id) => {
    return request({
        url: `/wrj/user/${id}`,
        method: 'delete'
    })
}

//批量删除成员
export const deleteAllUser = (ids) => {
    return request({
        url: `/wrj/user/removeByIds/${ids}`,
        method: "delete"
    })
}

//静态资源携带token

export const imgUrl = (url) => {
    return request({
        url: url,
        method: "GET",
        responseType: "blob",
    })
}

//获取设备服务器token

export const getquipmentToken = (params) => {
    return request({
        url: "/wrj/org/getTokenForwebUserUrl",
        method: 'post',
        data: params
    })
}
// DRC 链路
const DRC_API_PREFIX = '/control/jky/api/v1'
const workspaceId = localStorage.getItem("workspaceId") || ''
// 获取 mqtt 连接认证
// export const postDrc = (body) => {
//     return request({
//         url: `${DRC_API_PREFIX}/workspaces/${workspaceId}/drc/connect`,
//         method: 'post',
//         data: body
//     })
// }

//邀请成员二维码
export const InvitationCodeAPI = (orgId, page) => {
    return request({
        url: `/loginCnt/getInvitationCode?organizationId=${orgId}&page=${page}`,
        method: 'get'
    })
}

//获取 mqtt 连接认证
export const connectDRCAPI = (params) => {
    return request({
        url: `/drc/workspaces/${workspaceId}/drc/connect`,
        method: 'post',
        data: params
    })
};

//获取无人机控制权检验
export const enterDRCAPI = (params) => {
    return request({
        url: `/drc/workspaces/${workspaceId}/drc/enter`,
        method: 'post',
        data: params
    })
};

//退出无人机控制
export const exitDRCAPI = (params) => {
    return request({
        url: `/drc/workspaces/${workspaceId}/drc/exit`,
        method: 'post',
        data: params
    })
};

//抢夺控制权
export const authorityAPI = (params,sn) => {
    return request({
        url: `/drc/${sn}/authority/flight`,
        method: 'post',
        data: params
    })
}

/**
 * 获取消息通知列表
 */
export const getMessageListAPI = (params) => {
    return request({
        url: `/wrj/message/unreadList`,
        method: 'get',
        data: params
    })
}

// 更新消息状态
export const updateMessageStatusAPI = (ids) => {
    return request({
        url: `/wrj/message/read/${ids}`,
        method: 'get',
    })
}

/**
 * 获取权限列表
 * parentId=2大屏端   3 大屏端   4小程序端
 */
export const getPermissionListAPI = (parentId) => {
    return request({
        url: `/system/menu/list?parentId=${parentId}`,
        method: 'get',
    })
}