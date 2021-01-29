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
  stageSize: {},
  maxPitchRight: 0, // 音块最右边的位置
  mode: 0, // 0 代表音符模式, 1代表音高线模式
  playState: playState.StateNone, // 播放状态
  stagePitches: [], // 舞台音块
  isStagePitchesChanged: false, // 舞台音块是否有改变
  isPitchLineChanged: false, // 音高线是否有改变
  f0AI: [],
  f0Draw: [],
  selectRadio: 0,
  onlineUrl: '', // 在线播放的音频
  downUrl: '', // 下载的音频
  isExceedHeader: false // 滚动是否超过头部
}

const store = new Vuex.Store({
  state: {
    f0IndexSet: new Set(),
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
          tone_id: state.toneId,
          bpm: state.bpm
        }
        pitches.push(pitchItem)
      })
      return pitches
    },
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
        console.log(`changeStoreState`, k, props[k])
        state[k] = props[k]
      })
    },
    changeF0(state, { index, value }) {
      const f0 = state.f0Draw
      f0[index] = value
      state.f0Draw = [...f0]
    },
    changeStagePitches(state, { index, key, value }) {
      const stagePitches = state.stagePitches
      stagePitches[index][key] = value
      state.stagePitches = [...stagePitches]
    }
  },
  actions: {
    resetState({ commit }) {
      const state = deepAssign({}, defaultState)
      commit('changeStoreState', state, {
        f0IndexSet: new Set()
      })
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
    changeF0({ commit, state }, { index, value }){
      commit('changeF0', { index, value})
      commit('changeStoreState', { isPitchLineChanged: true })
      state.f0IndexSet.add(index)
    },
    changeStagePitches({ commit }, { index, key, value }) {
      commit('changeStagePitches', { index, key, value })
    },
    async getPitchLine({ commit, state, getters }) {
      if (getters.pitchList.length <= 0) {
        Message.error('没有画音块，所以没音高线')
        return
      }
      for (let i = 0; i < state.stagePitches.length; i += 1) {
        if (state.stagePitches[i].red) {
          Message.error('音符存在重叠, 请调整好~')
          return
        }
      }

      const { data } = await getF0Data({ pitchList: getters.pitchList })
      if (data.ret_code !== 0) {
        // Message.error(`请求音高线数据错误,错误信息:${data.err_msg}`)
        return
      }

      const f0Data = data.data.f0_data
      commit('changeStoreState', { f0AI: f0Data })

      const draw = state.f0Draw
      const f0Draw = [...f0Data]

      draw.forEach((v, index) => {
        if (state.f0IndexSet.has(index)) {
          f0Draw[index] = v
        }
      })
      
      commit('changeStoreState', { f0Draw , isPitchLineChanged: false })
    }
  },
  modules: {
    profile: profile
  }
})

const updateStageSize = () => {
  const windowWidth = window.innerWidth
  const stageConWidth = windowWidth - 50
  store.state.stageSize = {
    width: stageConWidth
  }
}
updateStageSize()
window.addEventListener('resize', () => {
  updateStageSize()
})
export default store