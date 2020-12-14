// 草稿功能相关api
import service from './main'

const axios = service

const addDraft = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/modify_audio_draft',
    data,
  })
}

const deleteDraft = (draftId) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/del_audio_draft',
    data: {
      draft_id: draftId,
    },
  })
}

const fetchDraftDetailById = (draftId) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/get_audio_draft_detail',
    data: {
      draft_id: draftId,
    },
  })
}

export {
  addDraft,
  deleteDraft,
  fetchDraftDetailById,
}