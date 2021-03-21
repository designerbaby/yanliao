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
const musicxml2Json = (data) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/xml2json',
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
  musicxml2Json
}
