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
    path: '/search', // 搜索页
    name: 'Search',
    meta: {
      rank: 2,
    },
    component: () => import('../views/Main/search.vue')
  },
  {
    path: '/edit/:musicId/:arrangeId?/:toneId?', // 编辑歌曲页面
    name: 'Edit',
    meta: {
      rank: 3,
    },
    component: () => import('../views/Main/Edit/index.vue')
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
    path: '/exception', // 音源下架
    name: 'Exception',
    meta: {
      rank: 2,
    },
    component: () => import('../views/Main/exception.vue')
  },
  {
    path: '/profile', // 个人主页
    name: 'Profile',
    meta: {
      rank: 1,
    },
    component: () => import('../views/Main/Profile/index.vue')
  },
  {
    path: '/audio/:arrangeId', // 作品详情
    name: 'Audio',
    meta: {
      rank: 2,
    },
    component: () => import('../views/Main/audio.vue')
  },
  {
    path: '/videoUpload', // 视频上传
    name: 'VideoUpload',
    meta: {
    },
    component: () => import('../views/Main/videoUpload.vue')
  },
  {
    path: '/matterUpload', // 素材上传
    name: 'MatterUpload',
    meta: {
    },
    component: () => import('../views/Main/matterUpload.vue')
  },
  {
    path: '/audioUpload', // 音源上传
    name: 'AudioUpload',
    component: () => import('../views/Main/audioUpload.vue')
  },
  {
    path: '/activityPage', // 活动
    name: 'ActivityPage',
    meta: {
      auth: 'noLogin',
    },
    component: () => import('../views/Activity/activityPage.vue')
  },
  {
    path: '/springFestival', // 春节活动
    name: 'SpringFestival',
    meta: {
      auth: 'noLogin',
    },
    component: () => import('../views/Activity/springFestival.vue')
  },
  {
    path: '/privacyPolicy', // 隐私协议
    name: 'PrivacyPolicy',
    meta: {
      auth: 'noLogin',
    },
    component: () => import('../views/Policy/privacyPolicy.vue')
  },
  {
    path: '/userAgreement', // 用户协议
    name: 'UserAgreement',
    meta: {
      auth: 'noLogin',
    },
    component: () => import('../views/Policy/userAgreement.vue')
  },
  {
    path: '/playIncentives', // 播放激励
    name: 'PlayIncentives',
    meta: {
      auth: 'noLogin',
    },
    component: () => import('../views/Policy/playIncentives.vue')
  },
  {
    path: '/uploadAudioPolicy', // 上传音源须知
    name: 'UploadAudioPolicy',
    meta: {
      auth: 'noLogin',
    },
    component: () => import('../views/Policy/uploadAudioPolicy.vue')
  },
  {
    path: '/audioEditor', // 音频编辑器页面
    name: 'AudioEditor',
    meta: {},
    component: () => import('../views/AudioEditor/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
