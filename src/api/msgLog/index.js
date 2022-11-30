import request from '@/utils/request';

/**
 * @param {*} data
 * @returns
 */

export function getMsgLog(data) {
  return request({
    url: '/msg/send/log/query',
    method: 'post',
    data
  })
}
