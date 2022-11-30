import request from '@/utils/request';

export function getStepList(data) {
  return request({
    url: '/fetch/interval/query',
    method: 'post',
    data
  })
}

export function updateStep(id, data) {
  return request({
    url: '/fetch/interval/'+ id  +'/update',
    method: 'post',
    data
  })
}
