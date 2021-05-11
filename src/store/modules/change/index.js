import actions from './actions.js'
import getters from './getters.js'
import mutations from './mutations.js'
import changeState from './changeState.js'

const state = changeState

export default {
  state,
  getters,
  mutations,
  actions
}
