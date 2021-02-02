<template>
  <div id="app" :style="{ backgroundImage: 'url(' + pageBg + ')' }">
    <AudioHeader v-if="$router.history.current.path === '/audioEditor'" :openLoginDialog="openLoginDialog"></AudioHeader>
    <Header v-else-if="$router.history.current.meta.auth !== 'noLogin' || $router.history.current.path === '/'" 
      ref="header" :currentPath="$router.history.current.path" 
      :openLoginDialog="openLoginDialog" 
    />
    <router-view @changeBg="changeBg" @openLoginDialog="openLoginDialog" />
    <div v-if="$router.history.current.path === '/audioEditor'" class="footer"></div>
    <Footer v-else-if="$router.history.current.meta.auth !== 'noLogin' || $router.history.current.path === '/'" />
    <LoginDialog :loginDialogShow="loginDialogShow" :closeLoginDialog="closeLoginDialog"></LoginDialog>
  </div>
</template>

<script>
// @ is an alias to /src
import AudioHeader from '@/common/components/AudioHeader.vue'
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
    AudioHeader,
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
      const scrollTop = app.scrollTop
      // console.log('scrollTop:', scrollTop)
      if (scrollTop > 48) {
        this.$store.dispatch("changeStoreState", { isExceedHeader: true })
      } else {
        this.$store.dispatch("changeStoreState", { isExceedHeader: false })
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
    // overflow: auto;
    overflow-y: auto;
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
  }
  .footer {
    height: 0px;
  }
</style>
