import request from '@/utils/request'

// 日志查询 /sysLog/select
// 异常日志查询 /sysLog/selectErrorLog
// 异常日志详情查询 /sysLog/selectErrorLogDetail

// 日志查询 /sysLog/select
export function selectPage(data) {
    return request({
        url: '/sysLog/select',
        method: 'post',
        data: data
    })
}
// 异常日志查询 /sysLog/selectErrorLog
export function selectErrorLog(data) {
    return request({
        url: '/sysLog/selectErrorLog',
        method: 'post',
        data: data
    })
}
// 登录日志查询
export function selectLoginLog(data) {
    return request({
        url: '/sysLog/login/select',
        method: 'post',
        data: data
    })
}
// 异常日志详情查询 /sysLog/selectErrorLogDetail
export function selectErrorLogDetail(data) {
    return request({
        url: '/sysLog/selectErrorLogDetail',
        method: 'post',
        data: data
    })
}