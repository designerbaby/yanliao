import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    beatForm: { // 存储节拍
      fenzi: 4,
      fenmu: 4
    },
    lineLeft: 0 // 播放线的左边距
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {}
})

export default store