import request from '@/utils/request';

export function loginByUsername(username, password) {
  const data = {
    email: username,
    password: password
  };

  return request({
    url: 'http://192.168.37.225:3000/api/users/login',
    method: 'post',
    data
  });
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  });
}

export function getUserInfo(token) {
  const params = {
    token: token
  };

  return request({
    url: 'http://192.168.37.225:3000/api/users/verify',
    method: 'post',
    params
  });
}
