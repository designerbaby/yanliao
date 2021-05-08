const mutations = {
  // 通用改成state方法
  changeState(state, props) {
    Object.keys(props).forEach(k => {
      state[k] = props[k]
    })
  },
  changeF0(state, { index, value }) {
    const f0 = state.f0Draw
    f0[index] = value
    state.f0Draw = [...f0]
  }
}

export default mutations
