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

// const subscribeMutations = ['changeState', 'changeF0']
// store.subscribe(({ type, payload }) => {
//   if (subscribeMutations.includes(type)) {
//     console.log('subscribe', type, payload)
//     // store.dispatch('done/push')
//   }
// });

export default store
