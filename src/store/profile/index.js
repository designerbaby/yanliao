const state = {
  showBindKugou: false, // 标志有没绑定酷狗账号，true的话就是绑定，false的话就是没有绑定
  userInfo: {} // 用户信息
}

const mutations = {
  // updateShowBindKugou(state, showBindKugou) {
  //   console.log('updateShowBindKugou:', showBindKugou)
  //   state.showBindKugou = showBindKugou
  // },
  changeStoreState(state, props) {
    Object.keys(props).forEach(k => {
      console.log(`profile mudule changeStoreState`, k, props[k])
      state[k] = props[k]
    })
  }
}

const actions = {
  // updateShowBindKugou(context, showBindKugou) {
  //   context.commit('updateShowBindKugou', showBindKugou)
  // },
  changeStoreState({ commit }, props) {
    commit('changeStoreState', props)
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
