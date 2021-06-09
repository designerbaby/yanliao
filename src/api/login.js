// 登录功能相关api

import service from './main'

const axios = service

// 获取验证码
const fetchAuthCode = (phone, busType) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/user/send_captcha',
    data: {
      phone,
      bus_type: busType || 0
    },
  })
}

// 手机登录
const login = (data) => {
  const defaultValue = {
    src: 68,
    opentype: 0,
    openid: '',
    appid: 1,
  }
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/user/phone_login',
    data: Object.assign({}, defaultValue, data)
  })
}

// 登出
const logout = () => {
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/user/logout',
  })
}

// 获取用户个人信息
const userInfo = () => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/user/get_personal_info',
  })
}
// 密码登陆
const pwdLogin = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/user/pwd_login',
    data,
  })
}

// 设置密码
const setPwd = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/user/set_pwd',
    data
  })
}

export {
  fetchAuthCode,
  login,
  logout,
  userInfo,
  pwdLogin,
  setPwd
}
