import Vue from 'vue'
import App from './views/App.vue'
import router from './router'
import moment from 'moment'
import smoothscroll from 'smoothscroll-polyfill'
import '@/common/utils/permission'

smoothscroll.polyfill()
Vue.prototype.$moment = moment
Vue.config.productionTip = false

Vue.mixin({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const toFullPath = to.fullPath
      if (toFullPath == '/') {
        vm.$emit('changeBg', 0)
      } else {
        vm.$emit('changeBg', 1)
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    if (from.name === 'Edit' || from.name === 'Rectify') {
      const isModified = this.comparisonFormData()
      if (isModified === true) {
        if (this.submitSuccess === false) {
          this.submitDraft()
        }
      }
    }
    next()
  },
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
