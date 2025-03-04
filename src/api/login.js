import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/loginCnt/login',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/loginCnt/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户userId
export function getInfo(orgId, userId) {
  return request({
    url: `/system/user/${orgId}/${userId}`,
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

//获取二维码
export function getQRCodeAPI(params) {
  return request({
    url: `/loginCnt/getWxQrcode?scene=${params.scene}&is_hyaline=${params.is_hyline}&auto_color=${params.auto_color}&page=${params.page}`,
    method: "get"
  })
}


//获取二维码状态  device_id=scene
export function getQRCodeStatusAPI(device_id) {
  return request({
    url: `/loginCnt/checkQrcode?device_id=${device_id}`
  })
}