const state = {
  showBindKugou: false // 标志有没绑定酷狗账号，true的话就是绑定，false的话就是没有绑定
}

const mutations = {
  profileChangeStoreState(state, props) {
    Object.keys(props).forEach(k => {
      console.log(`profile mudule changeStoreState`, k, props[k])
      state[k] = props[k]
    })
  }
}

const actions = {
  profileChangeStoreState({ commit }, props) {
    commit('profileChangeStoreState', props)
  }
}

const getters = {

}

export default {
  state,
  mutations,
  actions,
  getters
}
