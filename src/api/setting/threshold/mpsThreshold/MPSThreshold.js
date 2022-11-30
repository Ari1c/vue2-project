import request from '@/utils/request';

export function getMPSThresholdList(data) {
  return request({
    url: '/pdu/threshold/query',
    method: 'post',
    data
  })
}

export function updateMPSThreshold(data) {
  return request({
    url: '/pdu/threshold/update',
    method: 'post',
    data: data.applyAll ? Object.assign(data, {
      pduDeviceId: '11'
    }) : data
  })
}


export function getAllUsable(data) {
  return request({
    url: '/pdu/list',
    method: 'post',
    data
  })
}
