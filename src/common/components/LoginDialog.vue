<template>
  <Dialog
    :visible.sync="loginDialogShow"
    width="400px"
    custom-class="login-dialog"
    top="15%"
    @open="loginDialogOpen"
    :before-close="loginDialogBeforeClose"
  >
    <div class="login-dialog-title">账号登录</div>
    <Form :model="loginForm" ref="loginForm" :rules="rules">
      <FormItem prop="phone">
        <Input class="phone-number-input" placeholder="请输入手机号" v-model="loginForm.phone"></Input>
      </FormItem>
      <FormItem prop="authCode">
        <div class="auth-code-input-box">
          <Input class="auth-code-input" placeholder="请输入验证码" v-model="loginForm.authCode"></Input>
          <div v-if="timeLeft === 60" class="get-auth-code-button" @click="getAuthCode">{{ sendAuthCodeText }}</div>
          <div v-if="timeLeft <= 59" class="get-auth-code-button">{{sendAuthCodeText}}({{timeLeft}}s)</div>
        </div>
      </FormItem>
    </Form>
    <button class="login-confirm-button" @click="confirmLoginButtonClick">登录</button>
    <div class="login-tips">
      <div>未注册的手机号将帮您注册新账号，登录即代表</div>
      <div>您同意 <a href="/userAgreement" target="_blank">用户协议</a> 和 <a href="/privacyPolicy" target="_blank">隐私政策</a></div>
    </div>
  </Dialog>
</template>

<script>
import { Dialog, Form, FormItem, Input, Message } from 'element-ui'
import { fetchAuthCode, login } from '@/api/login'
import { reportEvent } from '@/common/utils/helper'

export default {
  name: 'LoginDialog',
  props: {
    loginDialogShow: Boolean,
    closeLoginDialog: Function,
  },
  components: {
    Dialog,
    Input,
    Form,
    FormItem
  },
  data() {
    return {
      sendAuthCodeText: '获取验证码',
      timeLeft: 60,
      loginForm: {
        phone: '',
        authCode: '',
      },
      rules: {
        phone: [
          { required: true, message: '请输入正确的手机号码', pattern: /^1[3-9]\d{9}$/, trigger: 'submit' }
        ],
        authCode: [
          { required: true, message: '请输入正确的验证码', pattern: /^\d{4}$/, trigger: 'submit' },
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
  methods: {
    loginDialogOpen() {
      reportEvent('login-page-exposure')
    },
    loginDialogBeforeClose() {
      this.closeLoginDialog()
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
    }
  }
}
</script>

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

</style>
