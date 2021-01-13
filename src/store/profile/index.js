const state = {
  showBindKugou: false // 标志有没绑定酷狗账号，true的话就是绑定，false的话就是没有绑定
}

const mutations = {
  updateShowBindKugou(state, showBindKugou) {
    console.log('updateShowBindKugou:', showBindKugou)
    state.showBindKugou = showBindKugou
  }
}

const actions = {
  updateShowBindKugou(context, showBindKugou) {
    context.commit('updateShowBindKugou', showBindKugou)
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
