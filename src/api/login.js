import service from './main'

const axios = service

const fetchAuthCode = (phone) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/user/send_captcha',
    data: {
      phone,
    },
  })
}

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

const logout = () => {
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/user/logout',
  })
}

const userInfo = () => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/user/get_personal_info',
  })
}

export {
  fetchAuthCode,
  login,
  logout,
  userInfo,
}