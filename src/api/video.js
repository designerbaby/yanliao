import service from './main'

const axios = service

const fetchSign = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/vod/sign',
    data,
  })
}

const fetchList = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/vod/list',
    data,
  })
}

const deleteVideo = (videoId) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/vod/del',
    data: {
      file_id: videoId,
    },
  })
}

const updateVideo = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/vod/update',
    data: data
  })
}

export {
  fetchSign,
  fetchList,
  deleteVideo,
  updateVideo
}
