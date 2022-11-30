import request from '@/utils/request'
// 组织添加 /sysOrganization/insert
// 组织修改 /sysOrganization/update
// 组织删除 /sysOrganization/delete
// 组织查询 /sysOrganization/select

// 组织查询 /sysOrganization/select
export function selectPage(data) {
    return request({
        url: '/sysOrganization/select',
        method: 'post',
        data: data
    })
}

// 组织添加 /sysOrganization/insert
export function insert(data) {
    return request({
        url: '/sysOrganization/insert',
        method: 'post',
        data: data
    })
}

// 组织修改 /sysOrganization/update
export function update(id, data) {
    return request({
        url: '/sysOrganization/update/' + id,
        method: 'post',
        data: data
    })
}

// 组织删除 /sysOrganization/delete
export function deleteOrganization(id) {
    return request({
        url: '/sysOrganization/delete/' + id,
        method: 'post'
    })
}