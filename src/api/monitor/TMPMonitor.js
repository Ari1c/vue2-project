import request from '@/utils/request';

export function getTMPMonitorList(data) {
  const res = request({
    url: '/pdu/sensor/query',
    method: 'post',
    data
  })

  return res;
}
