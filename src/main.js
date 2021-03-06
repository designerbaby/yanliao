import Vue from 'vue'
import App from './views/App.vue'
import router from './router'
import store from './store'
import Editor from '@/common/editor'
import smoothscroll from 'smoothscroll-polyfill'
import '@/common/utils/permission'
import '@/common/utils/filter'
import '@/common/css/index.less'

smoothscroll.polyfill()
Vue.config.productionTip = false

Vue.prototype.$execute = (cmd) => {
  Editor.getInstance().execute(cmd)
}
Vue.prototype.$editor = () => {
  return Editor.getInstance()
}

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
      console.log('beforeRouteLeave this.wantAddDraft:', this.wantAddDraft)
      if (isModified === true && this.wantAddDraft) {
        if (this.submitSuccess === false) {
          this.submitDraft()
        }
      }
    }
    next()
  },
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
