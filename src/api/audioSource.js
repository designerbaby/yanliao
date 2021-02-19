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

export {
  addAudioSource,
  getAudioSourceList
}