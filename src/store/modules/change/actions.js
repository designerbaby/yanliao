const actions = {
  resetState({ commit }) {
    const state = deepAssign({}, changeState)
    commit('changeStoreState', state)
  },
  changeState({ commit }, props) {
    commit('changeState', props)
  }
}

export default actions
