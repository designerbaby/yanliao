import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    beatForm: { // 存储节拍
      fenzi: 4,
      fenmu: 4
    },
    lineLeft: 0, // 播放线的左边距
    matter: 10 // 总共有多少个小节
  },
  getters: {},
  mutations: {
    updateBeatForm(state, form) {
      state.beatForm = {
        ...state.beatForm,
        ...form
      }
    },
    updateLineLeft(state, left) {
      state.lineLeft = left
    }
  },
  actions: {
    updateBeatForm (context, form) {
      context.commit('updateBeatForm', form)
    },
    updateLineLeft (context, left) {
      context.commit('updateLineLeft', left)
    }
  },
  modules: {}
})

export default store