import Vue from 'vue'
import Vuex from 'vuex'
import profile from './profile'
import { pitchList, playState } from '@/common/utils/const'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    beatForm: {   // 存储节拍
      fenzi: 4,
      fenmu: 4
    },
    lineLeft: 6,   // 播放线的左边距
    matter: 15,    // 总共有多少个小节
    noteWidth: 20, // 32分音符占据的最小像素单位
    noteHeight: 25, // 32分音符的占据的最小高度
    bpm: 90,       // 音调
    isSynthetizing: false, // 是否在合成音频中
    stageSize: {},
    maxPitchRight: 0, // 音块最右边的位置
    mode: 0, // 0 代表音符模式, 1代表音高线模式
    playState: playState.StateNone, // 播放状态
    stagePitches: [], // 舞台音块
    isStagePitchesChanged: false, // 舞台音块是否有改变
    f0AI: [],
    f0Draw: []
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
        console.log(`changeStoreState`, k, props[k])
        state[k] = props[k]
      })
    },
    changeF0(state, { index, value }) {
      const f0 = state.f0Draw
      f0[index] = value
      state.f0Draw = [...f0]
    }
  },
  actions: {
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
    changeF0({ commit }, { index, value }){
      commit('changeF0', { index, value})
    }
  },
  modules: {
    profile: profile
  }
})

const updateStageSize = () => {
  const windowWidth = window.innerWidth
  // TODO 这里如果外框的margin值改变了，93这个值也要改
  const stageConWidth = windowWidth - 93*2 - 50
  // console.log('windowWidth:', windowWidth)
  store.state.stageSize = {
    width: stageConWidth
  }
}
updateStageSize()
window.addEventListener('resize', () => {
  updateStageSize()
})
export default store