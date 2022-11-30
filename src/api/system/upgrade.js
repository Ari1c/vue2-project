import request from '@/utils/request'
// 查询应用
export function select(data) {
  return request({
    url: '/app/select',
    method: 'post',
    data
  })
}
// 新增应用
export function insert(data) {
  return request({
    url: '/app/insert',
    method: 'post',
    data
  })
}
// 修改应用
export function update(id, data) {
  return request({
    url: '/app/update/' + id,
    method: 'post',
    data
  })
}
// 删除应用
export function remove(id) {
  return request({
    url: '/app/delete/' + id,
    method: 'post'
  })
}
// 查询应用版本
export function versionSelect(data) {
  return request({
    url: '/app/version/select',
    method: 'post',
    data
  })
}
// 新增应用版本
export function versionInsert(data) {
  return request({
    url: '/app/version/insert',
    method: 'post',
    data
  })
}
// 修改应用版本
export function versionUpdate(id, data) {
  return request({
    url: '/app/version/update/' + id,
    method: 'post',
    data
  })
}
// 删除应用版本
export function versionChangeStatus(id, online) {
  return request({
    url: `/app/version/delete/${id}/${online}`,
    method: 'post'
  })
}