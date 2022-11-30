import request from '@/utils/request';

export function getBranchThresholdList(data) {
  return request({
    url: '/pdu/outlet/threshold/query',
    method: 'post',
    data
  })
}

export function detailBranchThreshold(id) {
  return request({
    url: '/pdu/'+ id + '/outlet/threshold/list',
    method: 'post'
  })
}

export function updateBranchThreshold(data) {
  return request({
    url: '/pdu/outlet/current/threshold/update',
    method: 'post',
    data
  })
}
