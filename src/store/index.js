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
    stageSize: {},
    showBindKugou: false, // 标志有没绑定酷狗账号，true的话就是绑定，false的话就是没有绑定
    pitchHasChange: false, // 音块是否有改变
    maxPitchRight: 0, // 音块最右边的位置
    lineMove: false  // 音高线是否已经被移动了
  },
  getters: {
    stageWidth: state => {
      return state.noteWidth * (32 / state.beatForm.fenmu) * state.beatForm.fenzi * state.matter
    },
    stageHeight: state => {
      return pitchList.length * 25
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
    },
    updateShowBindKugou(state, showBindKugou) {
      state.showBindKugou = showBindKugou
    },
    updatePitchHasChange(state, pitchHasChange) {
      state.pitchHasChange = pitchHasChange
    },
    updateMaxPitchRight(state, maxPitchRight) {
      state.maxPitchRight = maxPitchRight
    },
    updateLineMove(state, lineMove) {
      state.lineMove = lineMove
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
    },
    updateShowBindKugou(context, showBindKugou) {
      context.commit('updateShowBindKugou', showBindKugou)
    },
    updatePitchHasChange(context, pitchHasChange) {
      context.commit('updatePitchHasChange', pitchHasChange)
    },
    updateMaxPitchRight(context, maxPitchRight) {
      context.commit('updateMaxPitchRight', maxPitchRight)
    },
    updateLineMove(context, lineMove) {
      context.commit('updateLineMove', lineMove)
    }
  },
  modules: {}
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