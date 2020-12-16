import service from '@/api/main'

const axios = service

const search = (param) => {
  return axios({
    method: 'get',
    url: '/cgi-bin/musicx/kuwa/search_music',
    params: param,
  })
}

const editInfo = (arrangeId) => {
  return axios({
    method: 'get',
    url: '/cgi-bin/musicx/kuwa/get_music_edit_detail',
    params: {
      'arrange_id': arrangeId,
    },
  })
}

const songDetail = (musicId) => {
  return axios({
    method: 'get',
    url: '/cgi-bin/musicx/kuwa/get_music_info',
    params: {
      'music_id': musicId,
    },
  })
}

const songOtherDetail = (musicId) => {
  return axios({
    method: 'get',
    url: '/cgi-bin/musicx/kuwa/get_music_ext_info',
    params: {
      'music_id': musicId,
    },
  })
}

const preSubmit = (form) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/kuwa/pre_arrange_music',
    data: form,
  })
}

const submit = (form) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/kuwa/arrange_music',
    data: form,
  })
}

const downloadStatus = (arrangeId) => {
  return axios({
    method: 'get',
    url: '/cgi-bin/musicx/kuwa/get_music_arrange_info',
    params: {
      'arrange_id': arrangeId,
    },
  })
}

const melodyConfig = (musicId, singer) => {
  return axios({
    method: 'get',
    url: '/cgi-bin/musicx/kuwa/tone',
    params: {
      'music_id': musicId,
      'singer': singer,
    },
  })
}

export {
  search,
  editInfo,
  songDetail,
  songOtherDetail,
  preSubmit,
  submit,
  downloadStatus,
  melodyConfig,
}