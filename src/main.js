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
    // 修复改变跳转不同页面的时候，改变背景图
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
    // 每次离开编辑页和拼音校正页，都去保存下草稿
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
