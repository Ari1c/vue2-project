import request from '@/utils/request';

export function getTemHumThresholdList(data) {
  return request({
    url: '/pdu/sensor/threshold/query',
    method: 'post',
    data
  })
}

export function updateTemHumThreshold(data) {
  return request({
    url: '/pdu/sensor/threshold/update',
    method: 'post',
    data
  })
}
