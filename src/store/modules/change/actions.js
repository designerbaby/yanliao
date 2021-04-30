import Vue from 'vue'
import { createWaveSurfer } from '@/common/utils/waveSurfer.js'
import { getF0Data, getYinsu } from '@/api/audio'
import { Message } from 'element-ui'
import { timeToPx, checkPitchDuplicated } from '@/common/utils/helper'
import deepAssign from 'object-assign-deep'
import changeState from './changeState.js'

const actions = {
  changeState({ commit }, props) {
    commit('changeState', props)
  },
  resetState({ commit }) {
    const state = deepAssign({}, changeState)
    commit('changeState', state)
  },
  showWaveSurfer({ commit, state, dispatch, rootState, rootDispatch }, { file, type, bpm }) {
    // type 'blob'加载blob文件 'url'加载url文件
    const waveSurfer = createWaveSurfer(file, type)
    waveSurfer.on('ready', () => {
      // 初始化伴奏的宽度、音波、位移、音量
      const duration = waveSurfer.getDuration()
      const waveWidth = timeToPx(duration * 1000, rootState.const.noteWidth / 10, bpm || rootState.const.bpm)
      commit('changeState', { waveWidth })
      state.trackList[1].offset = state.stageMousePos.x
      waveSurfer.zoom(waveWidth / duration)
      waveSurfer.setVolume(state.trackList[1].volume / 100)
      rootDispatch('const/adjustStageWidth', { root: true })
    })
    commit('const/changeState', { isObbligatoChanged: true }, { root: true })
  },
  async getPitchLine({ commit, state, getters, rootGetters }, { beforeRequest, afterRequest } = {}) {
    console.log(`[action] getPitchLine called`)
    if (getters.pitchList.length <= 0) {
      // Message.error('没有画音块，所以没音高线')
      commit('changeState', { f0AI: [], f0Draw: [] })
      return
    }
    for (let i = 0; i < state.stagePitches.length; i += 1) {
      if (state.stagePitches[i].red) {
        Message.error('音符存在重叠, 请调整好~')
        return
      }
    }
    commit('const/changeState', { isGetF0Data: true }, { root: true })
    // 请求参数先深复制一份
    const reqData = deepAssign({}, { pitchList: getters.pitchList })
    if (beforeRequest) {
      await beforeRequest()
    }
    const { data } = await getF0Data(reqData)
    if (afterRequest) {
      await afterRequest()
    }

    if (data.ret_code !== 0) {
      // Message.error(`请求音高线数据错误,错误信息:${data.err_msg}`)
      return
    }
    const f0Data = data.data.f0_data
    commit('changeState', { f0AI: f0Data })

    const f0Draw = []
    const changed = state.changedLineMap
    // 修正音高线
    for (const [index, value] of f0Data.entries()) {
      const x = Math.round(rootGetters['const/pitchWidth'] * index)
      // const preX = Math.round(getters.pitchWidth * (index - 1))
      const nextX = Math.round(rootGetters['const/pitchWidth'] * (index + 1))
      const changedValue = null
      for (let j = x; j <= nextX; j +=1) {
        if (j in changed) {
          changedValue = changed[j]
          // console.log(`${j} in changed, value:${changedValue}`)
          break
        }
      }

      if (changedValue) {
        f0Draw[index] = changedValue
      } else {
        f0Draw[index] = value
      }
    }

    const pitchList = data.data.pitchList
    const stagePitches = [ ...state.stagePitches]
    // 辅音合并数据
    for (let i = 0; i < pitchList.length; i += 1) {
      const item = stagePitches[i]
      const isExist = item.hasOwnProperty('preTime')
      if (state.pitchChanged || item.pitchChanged || !isExist) {
        Vue.set(item, 'preTime', pitchList[i].preTime)
      }
      item.pitchChanged = false
    }
    commit('changeState', { f0Draw, stagePitches })
    commit('const/changeState', { isPitchLineChanged: false, isGetF0Data: false, pitchChanged: false }, { root: true })
  },
  changeVolumeMap({ commit, state }, { values }) {
    const volumeMap = [...state.volumeMap]
    for (const [x, v] of values) {
      volumeMap[x] = v
    }
    commit('const/changeState', { isVolumeChanged: true }, { root: true })
    commit('changeState', { volumeMap })
  },
  changeTensionMap({ commit, state }, { values }) {
    const tensionMap = [...state.tensionMap]
    for (const [x, v] of values) {
      tensionMap[x] = v
    }
    commit('const/changeState', { isTensionChanged: true }, { root: true })
    commit('changeState', { tensionMap })
  },
  afterChangePitchAndHandle({ commit, state, dispatch }) {
    state.stagePitches.sort((a, b) => a.left - b.left) // 排序
    const stagePitches = checkPitchDuplicated(state.stagePitches)
    commit('changeState', { stagePitches })
    dispatch('getPitchLine')
  },
  resetStagePitchesSelect({ commit, state }) { // 重置舞台音块的每个选择
    const stagePitches = [...state.stagePitches]
    stagePitches.forEach(item => {
      item.selected = false
    })
    commit('changeState', { stagePitches })
  },
  async saveFuYuan({ commit, state }) {
    const stagePitches = state.stagePitches
    let pinyin = stagePitches.map(v => v.pinyin)
    const res = await getYinsu({pin_yin: pinyin})
    const yinsu = res.data.data.yin_su
    for (let i = 0; i < stagePitches.length; i += 1) {
      const item = stagePitches[i]
      const py = yinsu[item.pinyin] || {}
      const f = py.f || '-'
      const y = py.y || '-'
      Vue.set(item, 'fu', f)
      Vue.set(item, 'yuan', y)
    }
    commit('changeState', { stagePitches })
  },
  changeF0({ commit, state, getters, rootState, rootGetters }, { values }){
    const changedLineMap = { ...state.changedLineMap }
    const f0Draw = [...state.f0Draw]
    for(const [x, v] of values) {
      const index = Math.round(x / rootGetters['const/pitchWidth'])
      changedLineMap[x] = v
      f0Draw[index] = v
    }
    commit('const/changeState', { isPitchLineChanged: true }, { root: true })
    commit('changeState', { f0Draw, changedLineMap })
  }
}


export default actions
