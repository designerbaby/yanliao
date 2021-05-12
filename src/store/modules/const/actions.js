import deepAssign from 'object-assign-deep'
import constState from './constState.js'

const actions = {
  resetState({ commit }) {
    const state = deepAssign({}, constState())
    commit('changeState', state)
  },
  changeState({ commit }, props) {
    commit('changeState', props)
  },
  updateMatter(context, matter) {
    console.log('updateMatter', matter)
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
    console.log('adjustStageWidth')
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
  },
  toUpdateStage({ state, getters, dispatch, rootState, rootGetters }) {
    const stageConWidth = state.stage.width
    const arrangeStageConWidth = state.arrangeStage.width
    const stageWidth = getters.stageWidth
    console.log(`stageConWidth: ${stageConWidth}, stageWidth: ${stageWidth}, arrangeStageConWidth: ${arrangeStageConWidth}`)
    while (stageConWidth > stageWidth) { // 外框比里框更大
      dispatch('updateMatter', 15)
    }
    while (arrangeStageConWidth > stageWidth / 10) { // 音轨页面的宽高比里面舞台需要的大
      dispatch('updateMatter', 15)
    }
    dispatch('adjustStageWidth')
    // stageConWidth: 1870, stageWidth: 1200, arrangeStageConWidth: 1704
  }
}

export default actions
