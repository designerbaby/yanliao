import Vue from 'vue'
import Vuex from 'vuex'
import { pitchList } from '@/common/utils/const'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    beatForm: { // 存储节拍
      fenzi: 4,
      fenmu: 4
    },
    lineLeft: 0, // 播放线的左边距
    matter: 10, // 总共有多少个小节
    noteWidth: 20, // 32分音符占据的最小像素单位
    bpm: 90, // 音调
    isSynthetizing: false // 是否在合成音频中
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
    }
  },
  modules: {}
})

export default store