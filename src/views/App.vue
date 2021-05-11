<template>
  <div id="app" :style="{ backgroundImage: 'url(' + pageBg + ')' }" @click="clickApp">
    <EditAudioHeader v-if="$router.history.current.path === '/audioEditor'" :openLoginDialog="openLoginDialog"></EditAudioHeader>
    <Header v-else-if="$router.history.current.meta.auth !== 'noLogin' || $router.history.current.path === '/'"
      ref="header" :currentPath="$router.history.current.path"
      :openLoginDialog="openLoginDialog"
    />
    <router-view @changeBg="changeBg" @openLoginDialog="openLoginDialog" />
    <template v-if="$router.history.current.path === '/audioEditor'" class="audioFooter"></template>
    <Footer v-else-if="$router.history.current.meta.auth !== 'noLogin' || $router.history.current.path === '/'" />
    <LoginDialog :loginDialogShow="loginDialogShow" :closeLoginDialog="closeLoginDialog"></LoginDialog>
  </div>
</template>

<script>
// @ is an alias to /src
import EditAudioHeader from '@/common/components/EditAudioHeader.vue'
import LoginDialog from '@/common/components/LoginDialog.vue'
import Header from '@/common/components/Header.vue'
import Footer from '@/common/components/Footer.vue'
import HomeBg from '@/assets/bg-home.png'
import normalBg from '@/assets/bg.png'
import activityBg from '@/assets/activity-bg.jpg'
import springBg from '@/assets/active/bg.jpg'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    EditAudioHeader,
    LoginDialog
  },
  data() {
    return {
      pageBg: '',
      loginDialogShow: false,
    }
  },
  mounted() {
    const app = document.querySelector('#app')
    app.addEventListener('scroll', (event) => {
      const appScrollTop = app.scrollTop
      const isExceedHeader = appScrollTop > 48
      this.$store.dispatch("const/changeState", {
        appScrollTop,
        isExceedHeader
      })
      const audioStage = document.querySelector('#audioStage')
      if (audioStage) {
        const rect = audioStage.getBoundingClientRect()
        this.$store.dispatch("const/changeState", {
        stage: {
          ...this.$store.state.const.stage,
          rectLeft: rect.left,
          rectTop: rect.top
        }
      })
      }
    })
  },
  methods: {
    changeBg(data) {
      if (data === 0) {
        this.pageBg = HomeBg
      } else if (data === 1) {
        this.pageBg = normalBg
      } else if (data === 2) {
        this.pageBg = activityBg
      } else {
        this.pageBg = springBg
      }
    },
    openLoginDialog() {
      this.loginDialogShow = true
    },
    closeLoginDialog() {
      this.loginDialogShow = false
    },
    clickApp() {
      this.$store.dispatch('const/changeState', { showMenuList: false, showStageList: false })
    }
  }
}
</script>

<style lang="less">
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    button {
      border: none;
      outline: none;
      cursor: pointer;
    }
  }
  #app {
    height: 100vh;
    // overflow-y: auto;
    overflow-y: overlay;
    overflow-x: hidden;
    background-size: cover;
    font-family: "Source Han Sans CN", Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    .el-dialog {
      border-radius: 10px;
    }
    .el-input__inner {
      border-radius: 6px;
      line-height: normal;
    }
    .input {
      line-height: normal;
    }
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-track-piece {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.5);
      // background:#b4b4b4;
      border-radius: 20px;
      margin-right: 4px;
      width: 6px;
    }
  }
  .audioFooter {
    height: 0px;
    width: 0px
  }
</style>
