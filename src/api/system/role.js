import request from '@/utils/request'

//角色查询 /sysRole/select
export function selectPage(data) {
  return request({
    url: '/sysRole/select',
    method: 'post',
    data: data
  })
}
//角色查询 /sysRole/select
export function insert(data) {
  return request({
    url: '/sysRole/insert',
    method: 'post',
    data: data
  })
}
//角色修改 /sysRole/update
export function update(data) {
  return request({
    url: '/sysRole/update',
    method: 'post',
    data: data
  })
}
//角色删除 /sysRole/delete
export function deleteRole(data) {
  return request({
    url: '/sysRole/delete',
    method: 'post',
    data: data
  })
}
//查询角色配置菜单 /sysRole/selectMenuTree
export function selectMenuTree(data) {
  return request({
    url: '/sysRole/selectMenuTree',
    method: 'post',
    data: data
  })
}
