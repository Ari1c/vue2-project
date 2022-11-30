import request from '@/utils/request'
// 全局配置添加 /sysGlobalConfig/insert
// 全局配置修改 /sysGlobalConfig/update
// 全局配置删除 /sysGlobalConfig/delete
// 全局配置查询 /sysGlobalConfig/select

// 全局配置查询 /sysGlobalConfig/select
export function selectPage(data) {
    return request({
        url: '/sysGlobalConfig/select',
        method: 'post',
        data: data
    })
}

// 全局配置添加 /sysGlobalConfig/insert
export function insert(data) {
    return request({
        url: '/sysGlobalConfig/insert',
        method: 'post',
        data: data
    })
}

// 全局配置修改 /sysGlobalConfig/update
export function update(id, data) {
    return request({
        url: '/sysGlobalConfig/update/' + id,
        method: 'post',
        data: data
    })
}

// 全局配置删除 /sysGlobalConfig/delete
export function deleteGlobalConfig(id) {
    return request({
        url: '/sysGlobalConfig/delete/' + id,
        method: 'post'
    })
}