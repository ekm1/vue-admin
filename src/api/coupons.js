import request from '@/utils/request'

export function getAllCoupons(page, limit) {
  return request({
    url: '/api/coupons/coupons/?page=' + page + '&limit=' + limit,
    method: 'get'
  })
}

export function createCoupon(data) {
  return request({
    url: '/api/coupons/create',
    method: 'post',
    data
  })
}

export function updateCoupon(data, id) {
  console.log(data)
  return request({
    url: '/api/coupons/update?id=' + id,
    method: 'post',
    data
  })
}
