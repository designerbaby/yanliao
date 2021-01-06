import Vue from 'vue'
import Vuex from 'vuex'
import { pitchList } from '@/common/utils/const'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    beatForm: {   // 存储节拍
      fenzi: 4,
      fenmu: 4
    },
    lineLeft: 0,   // 播放线的左边距
    matter: 15,    // 总共有多少个小节
    noteWidth: 20, // 32分音符占据的最小像素单位
    bpm: 90,       // 音调
    isSynthetizing: false, // 是否在合成音频中
    pitchList: [],  // 音块列表
    stageConWidth: 0, // 舞台最外面的宽度
    stageSize: {}
  },
  getters: {
    stageWidth: state => {
      return state.noteWidth * (32 / state.beatForm.fenmu) * state.beatForm.fenzi * state.matter
    },
    stageHeight: state => {
      return pitchList.length * 25
    },
    noteWidth: state => {
      return state.noteWidth
    },
    bpm: state => {
      return state.bpm
    },
    matter: state => {
      return state.matter
    },
    beatForm: state => {
      return state.beatForm
    },
    isSynthetizing: state => {
      return state.isSynthetizing
    },
    pitchList: state => {
      return state.pitchList
    }
  },
  mutations: {
    updateBeatForm(state, form) {
      state.beatForm = {
        ...state.beatForm,
        ...form
      }
    },
    updateLineLeft(state, left) {
      state.lineLeft = left
    },
    updateIsSynthetizing(state, isSynthetizing) {
      state.isSynthetizing = isSynthetizing
    },
    updatePitchList(state, pitchList) {
      state.pitchList = pitchList
    },
    updateMatter(state, matter) {
      state.matter += matter
    }
  },
  actions: {
    updateBeatForm (context, form) {
      context.commit('updateBeatForm', form)
    },
    updateLineLeft (context, left) {
      context.commit('updateLineLeft', left)
    },
    updateIsSynthetizing(context, isSynthetizing) {
      context.commit('updateIsSynthetizing', isSynthetizing)
    },
    updatePitchList(context, pitchList) {
      context.commit('updatePitchList', pitchList)
    },
    updateMatter(context, matter) {
      context.commit('updateMatter', matter)
    }
  },
  modules: {}
})

const updateStageSize = () => {
  const windowWidth = window.innerWidth
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