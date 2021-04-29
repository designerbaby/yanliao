import actions from './actions'

const initState = () => ({
  mousePos: {} // 鼠标位置
})

const state = initState

const getters = {}

const mutations = {
  UPDATE_MOUSEPOS(state, data) {
    state.mousePos = data
  },
  // 重置
  RESET_STATE(state) {
    Object.assign(state, initState())
  },
  
}

export default {
  state,
  getters,
  mutations,
  actions
}
