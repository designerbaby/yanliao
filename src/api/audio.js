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
const editorSynthStatus = (paramId) => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/synth/editor_synth_status',
    data: {
      param_id: paramId
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

export {
  editorSynth,
  editorSynthStatus,
  editorSynthResult,
  getF0Data
}