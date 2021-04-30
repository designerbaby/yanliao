const mutations = {
  updateBeatForm(state, form) {
    state.beatForm = {
      ...state.beatForm,
      ...form
    }
  },
  updateMatter(state, matter) {
    state.matter += matter
  },
  // 通用改成state方法
  changeStoreState(state, props) {
    Object.keys(props).forEach(k => {
      // console.log(`changeStoreState`, k, props[k])
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
