<template>
  <div id="app" :style="{ backgroundImage: 'url(' + pageBg + ')' }">
    <Header v-if="$router.history.current.meta.auth !== 'noLogin' || $router.history.current.path === '/'" ref="header" :currentPath="$router.history.current.path" :loginDialogShow="loginDialogShow" :openLoginDialog="openLoginDialog" :closeLoginDialog="closeLoginDialog" />
    <router-view @changeBg="changeBg" @openLoginDialog="openLoginDialog" />
    <Footer v-if="$router.history.current.meta.auth !== 'noLogin' || $router.history.current.path === '/'" />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HomeBg from '@/assets/bg-home.png'
import normalBg from '@/assets/bg.png'
import activityBg from '@/assets/activity-bg.jpg'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      pageBg: '',
      loginDialogShow: false,
    }
  },
  mounted() {
  },
  methods: {
    changeBg(data) {
      if (data === 0) {
        this.pageBg = HomeBg
      } else if (data === 1) {
        this.pageBg = normalBg
      } else {
        this.pageBg = activityBg
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
    overflow: auto;
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
</style>
