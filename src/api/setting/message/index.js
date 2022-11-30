import request from '@/utils/request';

/**
 * @param {*} data
 * @returns
 */

export function getMsgList(data) {
  return request({
    url: '/contact/query',
    method: 'post',
    data
  })
}

export function addContactPreson(data) {
  return request({
    url: '/contact/add',
    method: 'post',
    data
  })
}

export function modifyContact(id, data) {
  return request({
    url: '/contact/' + id + '/update',
    method: 'post',
    data
  })
}

export function viewContactRecords(receiverId, data) {
  return request({
    url: '/contact/'+ receiverId +'/op/query',
    method: 'post',
    data
  })
}

export function deleteContact(receiverId) {
  return request({
    url: '/contact/'+ receiverId +'/delete',
    method: 'post'
  })
}
