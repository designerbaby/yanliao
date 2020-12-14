import service from './main'

const axios = service

const bindKugou = (code) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/kugou/bind',
    data: {
      code: code
    }
  })
}

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