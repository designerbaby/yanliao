<template>
  <Dialog
    :visible.sync="loginDialogShow"
    width="400px"
    custom-class="login-dialog"
    top="15%"
    @open="loginDialogOpen"
    :before-close="loginDialogBeforeClose"
  >
    <div :class="$style.title" v-if="!showSettingPwd">
      <div :class="[$style.text, loginType === 0 ? $style.active : '']" @click="changeType(0)">短信登录</div>
      <div :class="[$style.text, loginType === 1 ? $style.active : '']" @click="changeType(1)">密码登录</div>
    </div>
    <LetterLogin v-if="loginType === 0 && !showSettingPwd"></LetterLogin>
    <PwdLogin v-else-if="loginType === 1 && !showSettingPwd" @show="showSetPwd"></PwdLogin>
    <transition name="slide-fade">
      <SettingPwd v-if="showSettingPwd" @closeSetPwd="closeSettingPwd"></SettingPwd>
    </transition>
  </Dialog>
</template>

<script>
import { Dialog } from 'element-ui'
import { reportEvent } from '@/common/utils/helper'
import LetterLogin from '@/common/components/Login/LetterLogin.vue'
import PwdLogin from '@/common/components/Login/PwdLogin.vue'
import SettingPwd from '@/common/components/Login/SettingPwd.vue'

export default {
  name: 'LoginDialog',
  props: {
    loginDialogShow: Boolean,
    closeLoginDialog: Function,
  },
  components: {
    Dialog,
    LetterLogin,
    PwdLogin,
    SettingPwd
  },
  data() {
    return {
      loginType: 0,
      showSettingPwd: false
    }
  },
  methods: {
    loginDialogOpen() {
      reportEvent('login-page-exposure')
    },
    loginDialogBeforeClose() {
      this.closeLoginDialog()
    },
    changeType(type) {
      this.loginType = type
    },
    showSetPwd() {
      this.showSettingPwd = true
    },
    closeSettingPwd() {
      this.showSettingPwd = false
      this.loginType = 1
    }
  }
}
</script>
<style lang="less" module>
.title {
  display: flex;
  flex-direction: row;
  margin-left: 20px;
  height: 40px;
  // border: 1px solid red;
}
.text {
  font-size: 18px;
  color: #999;
  font-weight: 600;
  margin-right: 24px;
  position: relative;
  &.active {
    color: #333;
    &::after {
      position: absolute;
      bottom: 8px;
      left: 40%;
      content: '';
      width: 16px;
      height: 4px;
      background-image: linear-gradient(270deg, #44B5FF 0%, #79D2FF 100%);
      border-radius: 12px;
    }
  }
}

</style>
<style lang="less">
.login-dialog {
  text-align: center;
  border-radius: 24px !important;
  position: relative;
  .el-dialog__body {
    padding: 6px 20px 30px 20px;
  }
  .el-form-item__error {
    left: 25px;
  }
  .el-input__inner {
    border: 2px solid rgba(0, 0, 0, 0.15);
    height: 56px;
    border-radius: 12px !important;
  }
  .el-form-item {
    margin-bottom: 16px;
  }
}

.slide-fade-enter-active {
  transition: opacity .5s ease;
}
// .slide-fade-leave-active {
//   transition: opacity .5s ease;
// }
.slide-fade-enter, .slide-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
