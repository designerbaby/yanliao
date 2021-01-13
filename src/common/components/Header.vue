<template>
  <div class="header">
    <div class="main">
      <img src="@/assets/logo.png" alt="" @click="openHomePage">
      <div class="header-text" @click="openHomePage">盐料视频 - 百万调音合成工具</div>
      <div class="beta-icon" @click="openHomePage">Beta</div>
    </div>
    <a href="/activityPage" class="subhead" target="_blank">
      <div class="subhead-text">爆款视频悬赏活动</div>
      <img src="@/assets/icon-act.png" alt="">
    </a>
    <!-- <div class="audio-edit" @click="toAudioEditor">音频编辑器</div> -->
    <div class="user-info" v-if="mxIsLogin || nickName">
      <img class="user-ava" :src="userLogo" alt="" @click="openProfilePage('im')">
      <div class="user-name" @click="openProfilePage('name')">{{ nickName }}</div>
      <button class="user-info-button" @click="bindKugou" v-if="!showBind && currentPath === '/profile'">绑定酷狗账号</button>
      <button v-if="currentPath === '/profile'" class="user-info-button" @click="logoutButtonClick">退出登录</button>
    </div>
    <button v-else class="login-button" @click="loginButtonClick">登录</button>
    
    <el-dialog
      :visible.sync="loginDialogShow"
      width="400px"
      custom-class="login-dialog"
      top="15%"
      @open="loginDialogOpen"
      :before-close="loginDialogBeforeClose"
    >
      <div class="login-dialog-title">账号登录</div>
      <el-form :model="loginForm" ref="loginForm" :rules="rules">
        <el-form-item prop="phone">
          <el-input class="phone-number-input" placeholder="请输入手机号" v-model="loginForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="authCode">
          <div class="auth-code-input-box">
            <el-input class="auth-code-input" placeholder="请输入验证码" v-model="loginForm.authCode"></el-input>
            <div v-if="timeLeft === 60" class="get-auth-code-button" @click="getAuthCode">{{ sendAuthCodeText }}</div>
            <div v-if="timeLeft <= 59" class="get-auth-code-button">{{sendAuthCodeText}}({{timeLeft}}s)</div>
            <!-- <div v-if="timeLeft === 60" class="get-auth-code-button" @click="getAuthCode">重新发送</div> -->
          </div>
        </el-form-item>
      </el-form>
      <button class="login-confirm-button" @click="confirmLoginButtonClick">登录</button>
      <div class="login-tips">
        <div>未注册的手机号将帮您注册新账号，登录即代表</div>
        <div>您同意 <a href="/userAgreement" target="_blank">用户协议</a> 和 <a href="/privacyPolicy" target="_blank">隐私政策</a></div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="logoutDialogShow"
      width="400px"
      custom-class="logout-dialog"
      top="15%"
    >
      <div class="logout-dialog-title">确定退出登录吗?</div>
      <div class="logout-footer">
        <button class="logout-confirm-button logout-button" @click="confirmLogoutButtonClick">确定</button>
        <button class="logout-cancel-button logout-button" @click="logoutDialogShow = false">取消</button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="kugouBindShow"
      width="400px"
      custom-class="logout-dialog"
      top="15%"
    >
      <img src="@/assets/icon-complete.png" alt="success-icon" class="success-icon"/>
      <div class="bind-success__title">绑定成功</div>
      <div class="bind-success__kugou">您已经绑定酷狗音乐账号</div>
      <div class="bind-success__nickname">{{ kugouNickName }}</div>
      <div>绑定有效期为3个月, 超过有效期重新绑定</div>
      <div class="bind-success__validity">在个人主页发布视频同步到酷狗可获得<a href="/playIncentives" target="_blank" title="播放激励">播放激励</a></div>
    </el-dialog>
  </div>
</template>

<script>
import { Input, Dialog, FormItem, Form, Message } from 'element-ui'
import { reportEvent, isTestEnv, getUrlParameters, getCookie } from '@/common/utils/helper'
import { fetchAuthCode, login, logout, userInfo } from '@/api/login'
import { bindKugou, showBindKuGou } from '@/api/bind' 

export default {
  props: {
    currentPath: String,
    loginDialogShow: Boolean,
    openLoginDialog: Function,
    closeLoginDialog: Function,
  },
  components: {
    'el-dialog': Dialog,
    'el-input': Input,
    'el-form': Form,
    'el-form-item': FormItem,
  },
  data() {
    return {
      sendAuthCodeText: '获取验证码',
      validatePass: '',
      nickName: '',
      kugouNickName: '',
      userLogo: '',
      timeLeft: 60,
      logoutDialogShow: false,
      loginForm: {
        phone: '',
        authCode: '',
      },
      mxIsLogin: getCookie('mx_is_login'),
      showBind: 1,
      kugouBindShow: false,
      code: getUrlParameters().code,  // 从酷狗登录回调之后拿到的code
      rules: {
        phone: [
          {required: true, message: '请输入正确的手机号码', pattern: /^1[3-9]\d{9}$/, trigger: 'submit'}
        ],
        authCode: [
          {required: true, message: '请输入正确的验证码', pattern: /^\d{6}$/, trigger: 'submit'},
          {validator: (rule, value, callback) => {
            const f = {
              phone: this.loginForm.phone,
              code: this.loginForm.authCode,
            }
            login(f).then((response) => {
              const { data } = response.data
              const { code, msg } = data
              if (code !== 0) {
                callback('请输入正确的验证码')
              } else {
                Message.success('登录成功')
                setTimeout(() => {
                  callback()
                }, 500)
              }
            })
          }, trigger: 'submit'}
        ],
      }
    }
  },
  mounted() {
    this.toGetUserInfo()
    this.toShowBindKugou()
    this.toBindKugouAccrossCode()
  },
  methods: {
    toGetUserInfo() {
      userInfo().then((response) => {
        const { data, ret_code } = response.data
        if (ret_code === 100000) {
          this.openLoginDialog()
        } else if (ret_code !== 100000) {
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
    loginDialogBeforeClose() {
      this.closeLoginDialog()
    },
    openProfilePage(origin) {
      const path = this.$router.history.current.path
      reportEvent(`user_${origin}_click`, `user_${origin}_click`, { path })
      this.$router.push(`/profile`)
    },
    loginDialogOpen() {
      reportEvent('login-page-exposure')
    },
    loginButtonClick() {
      this.openLoginDialog()
    },
    logoutButtonClick() {
      reportEvent('logout-button')
      this.logoutDialogShow = true
    },
    getAuthCode() {
      log('getAuthCode')
      this.$refs.loginForm.validateField('phone', (s) => {
        if (s === '') {
          // 校验通过
          const phone = this.loginForm.phone
          fetchAuthCode(phone).then((response) => {
            log('fetchAuthCode', response)
            const { data } = response.data
            const { code, msg } = data
            if (code === 0) {
              // 验证码已发送
              this.sendAuthCodeText = '重新发送'
              Message.success('验证码发送成功 !')
              this.timeLeft = 59
              const countId = setInterval(() => {
                if (this.timeLeft > 0) {
                  this.timeLeft--
                } else {
                  this.timeLeft = 60
                  clearInterval(countId)
                }
              }, 1000)
            } else {
              Message.error(`[${code}]: ${msg}`)
            }
          })
        }
      })
    },
    confirmLoginButtonClick() {
      this.$refs.loginForm.validate((valid) => {
        if (valid === true) {
          location.reload()
        }
      })
    },
    confirmLogoutButtonClick() {
      logout().then((response) => {
        const { data, ret_code } = response.data
        if (ret_code === 100000) {
          location.href = location.origin
          return
        }
        const { code, msg } = data
        if (code === 0) {
          // 退出登录成功
          location.href = location.origin
          // location.reload()
        } else {
          Message.error(`[${code}]: ${msg}`)
        }
      })
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
    toBindKugouAccrossCode() {
      if (this.code) { // url带有code才发起请求
        this.kugouBindShow = true
        bindKugou(this.code).then(res => {
          const { data, ret_code } = res.data
          console.log('bindKugou:', res)
          if (ret_code === 0) { // 和酷狗账号绑定成功
            this.kugouNickName = data.nickname
            // this.userLogo = data.profile_photo
            this.toShowBindKugou() // 绑定成功后再去查下不显示绑定的按钮
          } else { // 绑定不成功的话，就再去请求下账号
            this.toGetUserInfo()
          }
        })
      }
    },
    toShowBindKugou() {
      showBindKuGou().then((res) => {
        const { data, ret_code } = res.data
        if (ret_code === 0) {
          if (data !== null) {
            this.showBind = data.show_bind
            this.$store.dispatch('updateShowBindKugou', this.showBind)
          } 
        }
      })
    },
    toAudioEditor() {
      this.$router.push(`/audioEditor`)
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
    margin-left: auto;
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
    border-right: 2px solid #2cabff;
    color: #000;
    // font-size: 30px;
    font-weight: bold;
    text-decoration: underline;
    display: flex;
    align-items: center;
    margin-left: auto;
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

<style lang="less">
  .login-dialog {
    text-align: center;
    .login-dialog-title {
      font-size: 24px;
      color: #000;
      margin-bottom: 32px;
    }
    .phone-number-input {
      width: 320px;
      height: 44px;
      border-radius: 6px;
      font-size: 16px;
      .el-input__inner {
        height: 44px;
      }
    }
    .auth-code-input-box {
      // margin: 18px 0 32px 0;
      display: flex;
      align-items: center;
      padding-left: 20px;
      .auth-code-input {
        font-size: 16px;
        width: 184px;
        height: 44px;
        border-radius: 6px;
        margin-right: 12px;
        .el-input__inner {
          height: 44px;
        }
      }
      .get-auth-code-button {
        line-height: 44px;
        display: inline-block;
        width: 124px;
        height: 44px;
        border-radius: 6px;
        border: solid 1px #2cabff !important;
        background: #fff;
        color: #2cabff;
        cursor: pointer;
      }
    }
    .login-confirm-button {
      width: 320px;
      height: 44px;
      background-image: linear-gradient(90deg, #79d2ff 0%,#44b5ff 100%);
      border-radius: 25px;
      color: #fff;
      font-size: 18px;
    }
    .login-tips {
      font-size: 12px;
      color: #b2b2b2;
      margin-top: 24px;
      a {
        color: #4fb9ff;
        text-decoration: none;
      }
    }
    .el-form-item__error {
      left: 25px;
    }
  }
  .logout-dialog {
    line-height: 1;
    text-align: center;
    .logout-dialog-title {
      font-size: 22px;
      color: #000000;
      margin-bottom: 30px;
    }
    .logout-button {
      width: 150px;
      height: 40px;
    }
    .logout-button + .logout-button {
      margin-left: 20px;
    }
    .logout-confirm-button {
      border-radius: 31px;
      border: solid 2px #2cabff;
      font-size: 18px;
      color: #2cabff;
      background: #fff;
    }
    .logout-cancel-button {
      border-radius: 31px;
      font-size: 18px;
      color: #fff;
      background-image: linear-gradient(90deg, #79d2ff 0%, #44b5ff 100%);
	    border-radius: 31px;
    }
  }

.success-icon {
  width: 100px;
  height: 100px;
}
.bind-success {
  &__title {
    font-size: 38px;
    line-height: 40px;
    margin: 30px auto;
    color: #000;
    font-weight: bold;
  }
  &__kugou {
    color: #000;
    font-size: 24px;
  }
  &__nickname {
    color: #000;
    font-size: 28px;
    margin: 20px auto
  }
  &__validity {
    margin: 80px auto 0 auto;
    a {
      color: #2cabff;
      text-decoration: none;
    }
  }
}
</style>