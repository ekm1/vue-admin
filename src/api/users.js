import request from '@/utils/request'

export function getLatestUsers(limit) {
  return request({
    url: '/api/users/latestUsers?userLimit=' + limit,
    method: 'get'
  })
}

export function getAllUsers(data) {
  return request({
    url: '/api/users/getUsers/pagination',
    method: 'post',
    data
  })
}

export function deleteSubCategory(data) {
  return request({
    url: '/api/users/update/profile',
    method: 'post',
    data
  })
}
export function searchByName(name, page, limit, active) {
  return request({
    url:
      '/api/users/searchByName?name=' +
      name +
      '&page=' +
      page +
      '&limit=' +
      limit +
      '&status=' +
      active,
    method: 'get'
  })
}
