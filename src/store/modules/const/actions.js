const actions = {
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
  resetState({ commit }) {
    const state = deepAssign({}, constState)
    commit('changeState', state)
  },
  changeState({ commit }, props) {
    commit('changeState', props)
  },
}

export default actions
