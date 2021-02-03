<template>
  <div class="header">
    <div class="main" @click="openHomePage">
      <img src="@/assets/logo.png" alt="">
      <div class="header-text">盐料视频 - 百万调音合成工具</div>
      <div class="beta-icon">Beta</div>
    </div>
    <a href="/springFestival" class="subhead" target="_blank">
      <div class="subhead-text">万元悬赏拜年视频！</div>
      <img src="@/assets/icon-act.png" alt="">
    </a>
    <div class="user-info">
      <div class="audio-edit" @click="toAudioEditor">
        <img src="@/assets/audioEditor/music.png" alt="">音频编辑器
      </div>
      <template v-if="mxIsLogin || nickName">
        <img class="user-ava" :src="userLogo" alt="" @click="openProfilePage('im')">
        <div class="user-name" @click="openProfilePage('name')">{{ nickName }}</div>
        <button class="user-info-button" @click="bindKugou" v-if="!showBind && currentPath === '/profile'">绑定酷狗账号</button>
        <button v-if="currentPath === '/profile'" class="user-info-button" @click="logoutButtonClick">退出登录</button>
      </template>
    </div>
    <button v-if="!mxIsLogin" class="login-button" @click="loginButtonClick">登录</button>
    <LogoutDialog ref="LogoutDialog"></LogoutDialog>
    <KugouDialog ref="KugouDialog" @showBindKugou="toShowBindKugou" @getUserInfo="toGetUserInfo"></KugouDialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { reportEvent, isTestEnv, getParam, getCookie } from '@/common/utils/helper'
import { fetchAuthCode, login, logout, userInfo } from '@/api/login'
import { bindKugou, showBindKuGou } from '@/api/bind'
import LogoutDialog from '@/common/components/LogoutDialog.vue'
import KugouDialog from '@/common/components/KugouDialog.vue'

export default {
  props: {
    currentPath: String,
    openLoginDialog: Function
  },
  components: {
    LogoutDialog,
    KugouDialog
  },
  data() {
    return {
      nickName: '',
      userLogo: '',
      mxIsLogin: getCookie('mx_is_login'),
      showBind: 1
    }
  },
  mounted() {
    this.toGetUserInfo()
    this.toShowBindKugou()
  },
  methods: {
    toGetUserInfo() {
      userInfo().then((response) => {
        const { data, ret_code } = response.data
        if (ret_code !== 100000) {
          if (data !== null) {
            sessionStorage.setItem('userInfo', JSON.stringify(data))
            this.nickName = data.nick_name
            this.userLogo = data.user_logo
          }
        }
      })
    },
    openHomePage() {
      this.$router.push('/')
    },
    openProfilePage(origin) {
      const path = this.$router.history.current.path
      reportEvent(`user_${origin}_click`, `user_${origin}_click`, { path })
      this.$router.push(`/profile`)
    },
    loginButtonClick() {
      this.openLoginDialog()
    },
    logoutButtonClick() {
      reportEvent('logout-button')
      this.$refs.LogoutDialog.showLogoutDialog()
    },
    bindKugou() {
      reportEvent('person-page-userconnect_button')
      // 测试环境酷狗链接https://voo.kugou.com/1559c530-3925-11eb-b63e-b5551d784bc1/index.html
      const testJumpUrl = `https://h5.kugou.com/apps/vo-activity/1559c530-3925-11eb-b63e-b5551d784bc1/index.html?openappid=10073&url=${encodeURIComponent('https://test-yan.qq.com')}&scpoe=${encodeURIComponent('userinfo|upload')}`
      const jumpUrl = `https://h5.kugou.com/apps/vo-activity/1559c530-3925-11eb-b63e-b5551d784bc1/index.html?openappid=10076&url=${encodeURIComponent('https://yan.qq.com')}&scpoe=${encodeURIComponent('userinfo|upload')}`
      if (!isTestEnv) {
        location.href = jumpUrl
      } else {
        location.href = testJumpUrl
      }
      console.log('location.href:', location.href)
    },
    toShowBindKugou() {
      showBindKuGou().then((res) => {
        const { data, ret_code } = res.data
        if (ret_code === 0) {
          if (data !== null) {
            this.showBind = data.show_bind
            this.$store.dispatch('profileChangeStoreState', { showBindKugou: this.showBind })
          } 
        }
      })
    },
    toAudioEditor() {
      const userInfo = sessionStorage.getItem('userInfo')
      if (this.mxIsLogin || userInfo) {
        this.$router.push(`/audioEditor`)
      } else {
        this.openLoginDialog()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  padding: 0px 93px;
  margin-bottom: 10px;
  .main {
    padding: 40px 0px 40px 0px;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #000;
    position: relative;
    img {
      margin-right: 20px;
      cursor: pointer;
    }
    .header-text {
      cursor: pointer;
      font-size: 24px;
      margin-right: 40px;
    }
    .beta-icon {
      font-size: 14px;
      cursor: pointer;
      color: #fff;
      background: #6ccbff;
      border-radius: 8px;
      padding: 5px;
      height: 20px;
      display: flex;
      align-items: center;
      position: absolute;
      top: 35px;
      right: 10px;
    }
  }
  .subhead {
    text-decoration: none;
    display: flex;
    align-items: center;
    img {
      animation-name: shaking;
      animation-duration: 0.4s;
      animation-iteration-count: infinite;
      animation-fill-mode: forwards;
      animation-direction: alternate;
    }
    .subhead-text {
      font-size: 24px;
      color: #ff7c0b;
      border-left: 1px solid #ccc;
      padding-left: 40px;
      margin-right: 0px;
      font-family: PingFangSC-Regular, sans-serif;
    }
  }
  .login-button {
    width: 120px;
    height: 40px;
    background-image: linear-gradient(90deg, #79d2ff 0%,#44b5ff 100%);
    border-radius: 31px;
    color: #fff;
    font-size: 18px;
  }

  .user-info {
    display: flex;
    align-items: center;
    margin-left: auto;
    .user-ava {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
    }
    .user-name {
      cursor: pointer;
      color: #000;
      font-size: 18px;
      margin-left: 8px;
    }
    .user-info-button {
      height: 30px;
      border-radius: 20px;
      border: solid 1px #2cabff;
      background: #fff;
      color: #2cabff;
      font-size: 16px;
      padding: 0 17px;
      margin-left: 19px;
    }
  }

  .audio-edit {
    height: 33px;
    border-right: 1px solid #CCC;
    display: flex;
    align-items: center;
    margin-left: auto;
    font-size: 18px;
    color: #2CACFF;
    text-align: center;
    line-height: 24px;
    padding: 0 30px 0 0;
    margin: 0 30px 0 0;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
      margin: 0 6px;
    }
  }
}

@keyframes shaking {
  0% {
    transform: translateX(0);
  }
  100%{
    transform: translateX(10px);
  }
}
</style>