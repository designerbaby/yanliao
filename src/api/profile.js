import service from './main'

const axios = service

const fetchArrangeList = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/get_arrange_list',
    data,
  })
}

const fetchDraftList = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/get_audio_draft_list',
    data,
  })
}

const audioDetail = (arrangeId) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/get_arrange_detail',
    data: {
      arrange_id: arrangeId,
    },
  })
}

const deleteAudio = (arrangeId) => {
  return axios({
    method: 'post',
    url: ' /cgi-bin/v1/yan/synth/del_arrange_info',
    data: {
      arrange_id: arrangeId,
    },
  })
}

const deleteDraft = (draftId) => {
  return axios({
    method: 'post',
    url: ' /cgi-bin/v1/yan/synth/del_audio_draft',
    data: {
      draft_id: draftId,
    },
  })
}

export {
  fetchArrangeList,
  fetchDraftList,
  audioDetail,
  deleteAudio,
  deleteDraft,
}