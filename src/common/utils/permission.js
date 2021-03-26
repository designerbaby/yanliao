import router from '../../router'
import {
  userInfo,
} from '@/api/login'

const getUserInfo = () => {
  userInfo().then((response) => {
    const { data, ret_code } = response.data
    if (ret_code !== 100000) {
      if (data !== null) {
        sessionStorage.setItem('userInfo', JSON.stringify(data))
      }
    } else {
      sessionStorage.setItem('userInfo', '')
    }
  })
}

router.beforeEach((to, from, next) => {
  document.querySelector('#app').scrollTo(0, 0)
  getUserInfo()
  const userInfo = sessionStorage.getItem('userInfo')
  if (userInfo === '') {
    if (to.path === '/audioEditor') {
      next()
    } else if (to.meta.auth !== 'noLogin') {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})
