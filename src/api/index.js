import request from '@/utils/request'

// 获取验证码
export function getCodeImg(query) {
  return request({
    url: '/captcha/captcha.png',
    method: 'get',
    params: query
  })
}

// 登录方法
export function login(username, password, code = '') {
  const data = {
    username,
    password,
    code
  }
  return request({
    url: '/login/password',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/login/getMyInfo',
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
