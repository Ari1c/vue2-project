import request from '@/utils/request'
// 菜单添加 /sysMenu/insert
// 菜单修改 /sysMenu/update
// 菜单删除 /sysMenu/delete
// 菜单查询 /sysMenu/select


// 菜单查询 /sysMenu/select
export function selectPage(data) {
    return request({
        url: '/sysMenu/select',
        method: 'post',
        data: data
    })
}

// 菜单添加 /sysMenu/insert
export function insert(data) {
    return request({
        url: '/sysMenu/insert',
        method: 'post',
        data: data
    })
}

// 菜单修改 /sysMenu/update
export function update(data) {
    return request({
        url: '/sysMenu/update',
        method: 'post',
        data: data
    })
}

// 菜单删除 /sysMenu/delete
export function deleteMenu(data) {
    return request({
        url: '/sysMenu/delete',
        method: 'post',
        data: data
    })
}