import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      auth: 'noLogin'
    },
    component: Home
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/search',
    name: 'Search',
    meta: {
      rank: 2,
    },
    component: () => import('../views/search.vue')
  },
  {
    path: '/edit/:musicId/:arrangeId?',
    name: 'Edit',
    meta: {
      rank: 3,
    },
    component: () => import('../views/edit.vue')
  },
  {
    path: '/edit2',
    name: 'Edit2',
    meta: {
      rank: 4,
    },
    component: () => import('../views/edit2.vue')
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
    component: () => import('../views/exception.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {
      rank: 1,
    },
    component: () => import('../views/profile.vue')
  },
  {
    path: '/audio/:arrangeId',
    name: 'Audio',
    meta: {
      rank: 2,
    },
    component: () => import('../views/audio.vue')
  },
  {
    path: '/activityPage',
    name: 'ActivityPage',
    meta: {
      auth: 'noLogin',
    },
    component: () => import('../views/activityPage.vue')
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
