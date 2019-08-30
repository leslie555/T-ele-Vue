import request from '@/utils/request'
export function login(username, password) {
  return request({
    url: '/SystemMethod/Login',
    method: 'post',
    data: {
      LoginCode: username,
      LoginPwd: password
    }
  })
}

export function logout(data) {
  return request({
    url: '/SystemMethod/ExitLogin',
    method: 'post',
    data
  })
}
