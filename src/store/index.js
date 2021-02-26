import Vue from 'vue'
import Vuex from 'vuex'
import profile from './profile'
import { pitchList, playState } from '@/common/utils/const'
import { getF0Data } from '@/api/audio'
import { pxToTime } from '@/common/utils/helper'
import { Message } from 'element-ui'
import deepAssign from 'object-assign-deep'

Vue.use(Vuex)

const defaultState = {
  beatForm: {   // 存储节拍
    fenzi: 4,
    fenmu: 4
  },
  lineLeft: 6,   // 播放线的左边距
  matter: 15,    // 总共有多少个小节
  noteWidth: 20, // 32分音符占据的最小像素单位
  noteHeight: 25, // 32分音符的占据的最小高度
  bpm: 90,       // 音调
  toneId: 1, // 选择的toneId
  auditUrl: '', // 选择的播放的url
  taskId: 0, // 正在编辑的taskId
  toneName: 'luoxiang', // 选择的toneName
  isSynthetizing: false, // 是否在合成音频中
  isGetF0Data: false, // 正在获取f0中
  stage: {
    width: 0, // 舞台容器宽度
    height: 0, // 舞台容器高度
    scrollLeft: 0, // 水平滚动条位置
    scrollTop: 0 // 垂直滚动条位置
  },
  maxPitchRight: 0, // 音块最右边的位置
  mode: 0, // 0 代表音符模式, 1代表音高线模式
  typeMode: -1, // 附加模式类型: 0 代表响度, 1 代表张力
  playState: playState.StateNone, // 播放状态
  stagePitches: [], // 舞台音块
  isStagePitchesChanged: false, // 舞台音块是否有改变
  isPitchLineChanged: false, // 音高线是否有改变
  isVolumeChanged: false, // 响度是否有改变
  isTensionChanged: false, // 张力是否有改变
  f0AI: [], // 音高线虚线部分
  f0Draw: [], // 音高线实线部分
  volumeMap: [], // 响度原始map数据
  tensionMap: [], // 张力原始map数据
  changedLineMap: {},
  pinyinList: [],
  onlineUrl: '', // 在线播放的音频
  downUrl: '', // 下载的音频
  isExceedHeader: false, // 滚动是否超过头部
  appScrollTop: 0, // 页面垂直滚动条的位置
  typeContainerHeight: 250
}

const store = new Vuex.Store({
  state: {
    ...deepAssign({}, defaultState)
  },
  getters: {
    stageWidth: state => {
      return state.noteWidth * (32 / state.beatForm.fenmu) * state.beatForm.fenzi * state.matter
    },
    stageHeight: state => {
      return pitchList.length * state.noteHeight
    },
    beatWidth: state => {
      return state.noteWidth * (32 / state.beatForm.fenmu) * state.beatForm.fenzi
    },
    firstPitch: state => {
      return pitchList[0].pitch
    },
    pitchWidth: state => { // 音高线2个数据之间的px值
      // 10是因为数据的每一项间隔10ms
      return (10 * 8 * state.bpm * state.noteWidth) / (60 * 1000)
    },
    pitchList: (state, getters) =>  {
      const stagePitches = state.stagePitches
      // console.log('stagePitches:', stagePitches)
      const pitches = []
      stagePitches.forEach(item => {
        const duration = pxToTime(item.width, state.noteWidth, state.bpm)
        const pitch = getters.firstPitch - (item.top / item.height)
        const startTime = pxToTime(item.left, state.noteWidth, state.bpm)
        const pitchItem = {
          duration: duration,
          pitch: pitch,
          singer: state.toneName,
          startTime: startTime,
          endTime: startTime + duration,
          pinyin: item.pinyin,
          hanzi: item.hanzi,
          toneId: state.toneId,
          bpm: state.bpm,
          pinyinList: item.pinyinList,
          select: item.select
        }
        pitches.push(pitchItem)
      })
      return pitches
    },
    audioDuration: (state, getters) => {
      let startTime = -1
      let endTime = -1
      for (const pitch of getters.pitchList) {
        if (startTime < 0 || pitch.startTime < startTime) {
          startTime = pitch.startTime
        }
        if (endTime < 0 || pitch.endTime > endTime) {
          endTime = pitch.endTime
        }
      }

      const duration = endTime - startTime
      // SDK还补了500
      return duration > 0 ? duration + 500 : 0
    }
  },
  mutations: {
    updateBeatForm(state, form) {
      state.beatForm = {
        ...state.beatForm,
        ...form
      }
    },
    updateMatter(state, matter) {
      state.matter += matter
    },
    // 通用改成state方法
    changeStoreState(state, props) {
      Object.keys(props).forEach(k => {
        // console.log(`changeStoreState`, k, props[k])
        state[k] = props[k]
      })
    },
    changeF0(state, { index, value }) {
      const f0 = state.f0Draw
      f0[index] = value
      state.f0Draw = [...f0]
    },
    changeStagePitches(state, { index, key, value }) {
      // console.log(`changeStagePitches, index: ${index}, k: ${key}, value: ${value}`,)
      const stagePitches = state.stagePitches
      stagePitches[index][key] = value
      state.stagePitches = [...stagePitches]
    }
  },
  actions: {
    resetState({ commit }) {
      const state = deepAssign({}, defaultState)
      commit('changeStoreState', state)
    },
    updateBeatForm (context, form) {
      context.commit('updateBeatForm', form)
    },
    updateMatter(context, matter) {
      context.commit('updateMatter', matter)
    },
    // 通用改方法
    changeStoreState({ commit }, props) {
      commit('changeStoreState', props)
    },
    changeF0({ commit, state, getters }, { values }){
      const changedLineMap = { ...state.changedLineMap }
      const f0Draw = [...state.f0Draw]
      for(const [x, v] of values) {
        const index = Math.round(x / getters.pitchWidth)
        changedLineMap[x] = v
        f0Draw[index] = v
      }
      commit('changeStoreState', { f0Draw, changedLineMap, isPitchLineChanged: true })
    },
    changeVolumeMap({ commit, state }, { values }) {
      const volumeMap = [...state.volumeMap]
      for (const [x, v] of values) {
        volumeMap[x] = v
      }
      // console.log('volumeMap:', volumeMap)
      commit('changeStoreState', { volumeMap, isVolumeChanged: true })
    },
    changeTensionMap({ commit, state }, { values }) {
      const tensionMap = [...state.tensionMap]
      for (const [x, v] of values) {
        tensionMap[x] = v
      }
      commit('changeStoreState', { tensionMap, isTensionChanged: true })
    },
    changeStagePitches({ commit }, { index, key, value }) {
      commit('changeStagePitches', { index, key, value })
    },
    async getPitchLine({ commit, state, getters }) {
      if (getters.pitchList.length <= 0) {
        // Message.error('没有画音块，所以没音高线')
        return
      }
      for (let i = 0; i < state.stagePitches.length; i += 1) {
        if (state.stagePitches[i].red) {
          Message.error('音符存在重叠, 请调整好~')
          return
        }
      }
      commit('changeStoreState', { isGetF0Data: true })
      const { data } = await getF0Data({ pitchList: getters.pitchList })
      if (data.ret_code !== 0) {
        // Message.error(`请求音高线数据错误,错误信息:${data.err_msg}`)
        return
      }
      const f0Data = data.data.f0_data
      commit('changeStoreState', { f0AI: f0Data })

      const f0Draw = []
      const changed = state.changedLineMap
      for (const [index, value] of f0Data.entries()) {      
        const x = Math.round(getters.pitchWidth * index)
        if (x in changed) {
          f0Draw[index] = changed[x]
        } else {
          f0Draw[index] = value
        }
      }
      commit('changeStoreState', { f0Draw, isPitchLineChanged: false, isGetF0Data: false })
    },
    updateStageSize({ commit, state }) {
      const windowWidth = window.innerWidth
      // console.log('windowWidth:', windowWidth)
      const width = windowWidth - 50
      commit('changeStoreState', {
        stage: {
          ...state.stage,
          width
        } 
      })
    }
  },
  modules: {
    profile: profile
  }
})

store.dispatch('updateStageSize')
window.addEventListener('resize', () => {
  store.dispatch('updateStageSize')
})
export default store