import request from '@/utils/request';

export function getBranchMonitorList(data) {
  const res = request({
    url: '/pdu/outlet/query',
    method: 'post',
    data
  })

  return res;
}

export function openBranch(outlet) {
  return request({
    url: '/pdu/outlet/'+ outlet +'/open',
    method: 'post'
  })
}

export function closeBranch(outlet) {
  return request({
    url: '/pdu/outlet/'+ outlet +'/close',
    method: 'post'
  })
}
