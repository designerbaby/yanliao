import deepAssign from 'object-assign-deep'
import constState from './constState.js'

const actions = {
  resetState({ commit }) {
    const state = deepAssign({}, constState)
    commit('changeState', state)
  },
  changeState({ commit }, props) {
    commit('changeState', props)
  },
  updateMatter(context, matter) {
    context.commit('updateMatter', matter)
  },
  updateBeatForm (context, form) {
    context.commit('updateBeatForm', form)
  },
  updateStageSize({ commit, state }) {
    const windowWidth = window.innerWidth
    const width = windowWidth - 50
    const arrangeStageWidth = windowWidth - 216
    commit('changeState', {
      stage: {
        ...state.stage,
        width
      },
      arrangeStage: {
        ...state.arrangeStage,
        width: arrangeStageWidth
      }
    })
  },
  adjustStageWidth({ state, getters, dispatch, rootState, rootGetters }) {
    let maxPitchRight = 0
    rootState.change.stagePitches.forEach((item) => {
      const right = item.left + item.width
      maxPitchRight = Math.max(maxPitchRight, right)
    })
    const banEndX = rootState.change.trackList[1].offset * 10 + rootState.change.waveWidth * 10 // 伴奏的最尾端
    while (maxPitchRight > getters.stageWidth) {
      dispatch('updateMatter', 15)
    }
    while (banEndX > getters.stageWidth) {
      dispatch('updateMatter', 15)
    }
  }
}

export default actions
