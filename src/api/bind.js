import service from './main'

const axios = service

// 绑定酷狗
const bindKugou = (code) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/kugou/bind',
    data: {
      code: code
    }
  })
}

// 检查是否已经绑定酷狗
const showBindKuGou = () => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/kugou/show'
  })
}
export {
  bindKugou,
  showBindKuGou
}