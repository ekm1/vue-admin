import request from '@/utils/request'

export function loginByUsername(email, password) {
  const data = {
    email: email,
    password: password
  }

  return request({
    url: '/api/users/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  const params = {
    token: token
  }

  return request({
    url: '/api/users/verify',
    method: 'post',
    params
  })
}
