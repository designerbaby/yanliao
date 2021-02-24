import service from './main'

const axios = service

// 添加音源接口
const addAudioSource = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/audio_src/add',
    data: data
  })
}

// 拉取音源列表
const getAudioSourceList = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/audio_src/list',
    data: data
  })
}

// 获取临时密钥
const getUserCredential = () => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/user/get_user_credential',
  })
}

export {
  addAudioSource,
  getAudioSourceList,
  getUserCredential
}