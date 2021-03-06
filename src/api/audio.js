import service from './main'

const axios = service

// 歌词合成接口
const editorSynth = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/editor_synth',
    data: data
  })
}

// 合成状态查询接口
const editorSynthStatus = (paramId, taskId) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/editor_synth_status',
    data: {
      param_id: paramId,
      task_id: taskId
    }
  })
}

// 合成结果接口
const editorSynthResult = (taskId) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/editor_synth_result',
    data: {
      task_id: taskId
    }
  })
}

// 获取音高线接口
const getF0Data = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/sdk_client/get_f0_data',
    data: data
  })
}

// 汉字转拼音接口
const Hanzi2Pinyin = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/h2p',
    data: data
  })
}

// 拉取编辑器详情接口
const editorDetail = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/editor_detail',
    data: data
  })
}

// 获取元辅音的接口
const getYinsu = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/yinsu',
    data: data
  })
}

// xml转json的接口
const musicXml2Json = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/xml2json',
    data: data
  })
}

// 曲谱共享状态
const shareMusicScore = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/share_music_score',
    data: data
  })
}

// 获取曲调范围
const getToneInfo = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/sdk_client/get_tone_info',
    data: data
  })
}

// 获取midi文件信息
const mid2json = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/sdk_client/mid2json',
    data: data
  })
}

export {
  editorSynth,
  editorSynthStatus,
  editorSynthResult,
  getF0Data,
  Hanzi2Pinyin,
  editorDetail,
  getYinsu,
  musicXml2Json,
  shareMusicScore,
  getToneInfo,
  mid2json
}
