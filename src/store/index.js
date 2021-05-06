import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  mutations: {},
  actions: {
    resetState({ dispatch }) {
      dispatch('change/resetState')
      dispatch('const/resetState')
    }
  },
  modules
})

store.dispatch('const/updateStageSize')
window.addEventListener('resize', () => {
  store.dispatch('const/updateStageSize')
})

export default store
