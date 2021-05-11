
const mutations = {
  // 通用改成state方法
  changeState(state, props) {
    Object.keys(props).forEach(k => {
      // console.log(`changeStoreState`, k, props[k])
      state[k] = props[k]
    })
  },
  updateMatter(state, matter) {
    state.matter += matter
  },
  updateBeatForm(state, form) {
    state.beatForm = {
      ...state.beatForm,
      ...form
    }
  }
}

export default mutations
