import request from '@/utils/request';

/**
 *
 * @param {*} data
 * @returns
 */

export function getDeviceList(data) {
  const res = request({
    url: '/pdu/query',
    method: 'post',
    data
  });

  return res;
}

export function addDevice(data) {
  const res = request({
    url: '/pdu/add',
    method: 'post',
    data
  });

  return res;
}

export function updateDevice(id, data) {
  const res = request({
    url: '/pdu/update/' + id,
    method: 'post',
    data
  })

  return res;
}

export function viewRecord(data) {
  return request({
    url: '/pdu/op/query',
    method: 'post',
    data
  })
}

export function deleteDevice(id) {
  const res = request({
    url: '/pdu/delete/' + id,
    method: 'post'
  });

  return res;
}
