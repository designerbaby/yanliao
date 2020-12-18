import service from '@/api/main'

const axios = service

// 搜索歌曲列表
const search = (param) => {
  return axios({
    method: 'get',
    url: '/cgi-bin/musicx/kuwa/search_music',
    params: param,
  })
}

// 查询歌曲的编辑信息
const editInfo = (arrangeId) => {
  return axios({
    method: 'get',
    url: '/cgi-bin/musicx/kuwa/get_music_edit_detail',
    params: {
      'arrange_id': arrangeId,
    },
  })
}

// 查询歌曲的合成状态
const songDetail = (musicId) => {
  return axios({
    method: 'get',
    url: '/cgi-bin/musicx/kuwa/get_music_info',
    params: {
      'music_id': musicId,
    },
  })
}

// 查询歌曲的其他信息
const songOtherDetail = (musicId) => { 
  return axios({
    method: 'get',
    url: '/cgi-bin/musicx/kuwa/get_music_ext_info',
    params: {
      'music_id': musicId,
    },
  })
}

// 预提交改编歌曲
const preSubmit = (form) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/kuwa/pre_arrange_music',
    data: form,
  })
}

// 提交改编歌曲
const submit = (form) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/musicx/kuwa/arrange_music',
    data: form,
  })
}

// 查询歌曲合成的任务状态
const downloadStatus = (arrangeId) => {
  return axios({
    method: 'get',
    url: '/cgi-bin/musicx/kuwa/get_music_arrange_info',
    params: {
      'arrange_id': arrangeId,
    },
  })
}

// 获取音源曲调
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