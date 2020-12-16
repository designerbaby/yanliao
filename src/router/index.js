import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      auth: 'noLogin'
    },
    component: () => import('../views/Main/Home.vue')
  },
  {
    path: '/search',
    name: 'Search',
    meta: {
      rank: 2,
    },
    component: () => import('../views/Main/search.vue')
  },
  {
    path: '/edit/:musicId/:arrangeId?', // 编辑歌曲页面
    name: 'Edit',
    meta: {
      rank: 3,
    },
    component: () => import('../views/Main/edit.vue')
  },
  {
    path: '/rectify', // 矫正歌曲页面
    name: 'Rectify',
    meta: {
      rank: 4,
    },
    component: () => import('../views/Main/rectify.vue')
  },
  // {
  //   path: '/result/:arrangeId',
  //   name: 'Result',
  //   meta: {
  //     rank: 4,
  //   },
  //   component: () => import('../views/result.vue')
  // },
  {
    path: '/exception',
    name: 'Exception',
    meta: {
      rank: 2,
    },
    component: () => import('../views/Main/exception.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {
      rank: 1,
    },
    component: () => import('../views/Main/profile.vue')
  },
  {
    path: '/audio/:arrangeId',
    name: 'Audio',
    meta: {
      rank: 2,
    },
    component: () => import('../views/Main/audio.vue')
  },
  {
    path: '/videoUpload',
    name: 'VideoUpload',
    meta: {
    },
    component: () => import('../views/Main/videoUpload.vue')
  },
  {
    path: '/activityPage',
    name: 'ActivityPage',
    meta: {
      auth: 'noLogin',
    },
    component: () => import('../views/Activity/activityPage.vue')
  },
  {
    path: '/privacyPolicy',
    name: 'PrivacyPolicy',
    meta: {
      auth: 'noLogin',
    },
    component: () => import('../views/Policy/privacyPolicy.vue')
  },
  {
    path: '/userAgreement',
    name: 'UserAgreement',
    meta: {
      auth: 'noLogin',
    },
    component: () => import('../views/Policy/userAgreement.vue')
  },
  {
    path: '/playIncentives',
    name: 'PlayIncentives',
    meta: {
      auth: 'noLogin',
    },
    component: () => import('../views/Policy/playIncentives.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
