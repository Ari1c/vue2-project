import request from '@/utils/request';

export function getPOList(data) {
  return request({
    url: '/pdu/outlet/threshold/query',
    method: 'post',
    data
  })
}

export function detailPOThreshold(id) {
  return request({
    url: '/pdu/'+ id + '/outlet/threshold/list',
    method: 'post'
  })
}

export function updatePOThreshold(data) {
  return request({
    url: '/pdu/outlet/current/threshold/update',
    method: 'post',
    data
  })
}
