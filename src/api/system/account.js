import request from '@/utils/request'
// 账号查询 /sysAccount/selectPage 
export function selectPage(data) {
    return request({
        url: '/sysAccount/selectPage',
        method: 'post',
        data: data
    })
}
// 账号添加 /sysAccount/insert
export function insert(data) {
    return request({
        url: '/sysAccount/insert',
        method: 'post',
        data: data
    })
}
// 账号修改 /sysAccount/update
export function update(data) {
    return request({
        url: '/sysAccount/update',
        method: 'post',
        data: data
    })
}
// 账号重复检查 /sysAccount/checkAccount
export function checkAccount(data) {
    return request({
        url: '/sysAccount/checkAccount',
        method: 'post',
        data: data
    })
}
// 账号删除 /sysAccount/delete
export function deleteAccount(data) {
    return request({
        url: '/sysAccount/delete',
        method: 'post',
        data: data
    })
}
// 账号重置密码 /sysAccount/resetPwd
export function resetPwd(data) {
    return request({
        url: '/sysAccount/resetPwd',
        method: 'post',
        data: data
    })
}
// 账号页面组织查询
export function selectSysOrganization(data) {
    return request({
        url: '/sysAccount/selectSysOrganization',
        method: 'post',
        data: data
    })
}
// 账号页面角色查询
export function selectSysRole(data) {
    return request({
        url: '/sysAccount/selectSysRole',
        method: 'post',
        data: data
    })
}
// 查询状态列表
export function queryStateList(data) {
    return request({
        url: '/sysAccount/queryState',
        method: 'get',
        data: data
    })
}