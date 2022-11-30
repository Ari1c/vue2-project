import request from '@/utils/request';

export function getControlRecords(data) {
  return request({
    url: '/pdu/outlet/op/query',
    method: 'post',
    data
  })
}
