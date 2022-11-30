import request from '@/utils/request';

/**
 * @param {*} data
 * @returns
 */

export function getAlarmLog(data) {
  return request({
    url: '/msg/warn/query',
    method: 'post',
    data
  })
}
