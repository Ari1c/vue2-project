import request from '@/utils/request'
// 查询所有数据字典
export function selectAll() {
  return request({
    url: '/sysDict/select/all',
    method: 'post'
  })
}
// 数据字典查询
export function select(data) {
  return request({
    url: '/sysDict/select',
    method: 'post',
    data: data
  })
}
// 数据字典新增
export function insert(data) {
  return request({
    url: '/sysDict/insert',
    method: 'post',
    data: data
  })
}
// 数据字典修改
export function update(id, data) {
  return request({
    url: `/sysDict/update/${id}`,
    method: 'post',
    data: data
  })
}
// 数据字典删除
export function remove(id) {
  return request({
    url: `/sysDict/delete/${id}`,
    method: 'post'
  })
}
// 字典数据查询
export function dataSelect(data) {
  return request({
    url: '/sysDict/item/select',
    method: 'post',
    data
  })
}
// 字典数据新增
export function dataInsert(data) {
  return request({
    url: '/sysDict/item/insert',
    method: 'post',
    data
  })
}
// 字典数据编辑
export function dataUpdate(id, data) {
  return request({
    url: `/sysDict/item/update/${id}`,
    method: 'post',
    data
  })
}
// 字典数据删除
export function dataRemove(id, data) {
  return request({
    url: `/sysDict/item/delete/${id}`,
    method: 'post',
    data
  })
}
// 字典数据删除
export function getDataMapFromCode(dictCode) {
  return request({
    url: '/sysDict/item/selectByDictCode',
    method: 'post',
    data: {
      dictCode
    }
  })
}
