// 登录功能相关api

import service from './main'

const axios = service

// 获取验证码
const fetchAuthCode = (phone) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/user/send_captcha',
    data: {
      phone,
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
const pwdLogin = () => {
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/user/pwd_login'
  })
}

// 设置密码
const setPwd = () => {
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/user/set_pwd'
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
