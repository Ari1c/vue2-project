import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}
// /login/getMyMenus
// 获取路由
export const menus = () => {
  return request({
    url: '/login/getMyMenus',
    method: 'get'
  })
}