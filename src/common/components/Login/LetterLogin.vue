<template>
  <div :class="$style.LetterLogin">
    <Form :model="loginForm" ref="loginForm" :rules="rules">
      <FormItem prop="phone">
        <Input :class="$style.phoneInput" placeholder="请输入手机号" v-model="loginForm.phone"></Input>
      </FormItem>
      <FormItem prop="authCode">
        <div :class="$style.inputBox">
          <Input :class="$style.codeInput" placeholder="请输入验证码" v-model="loginForm.authCode"></Input>
          <div v-if="timeLeft === 60" :class="$style.codeButton" @click="getAuthCode">{{ sendAuthCodeText }}</div>
          <div v-if="timeLeft <= 59" :class="$style.codeButton">{{sendAuthCodeText}}({{timeLeft}}s)</div>
        </div>
      </FormItem>
    </Form>
    <button :class="$style.confirmButton" @click="confirmLoginButtonClick">登录/注册</button>
    <LoginTips></LoginTips>
  </div>
</template>

<script>
import { validatePhone, validatorAuthCode } from '@/common/utils/validate'
import { Form, FormItem, Input, Message } from 'element-ui'
import { fetchAuthCode, login } from '@/api/login'
import LoginTips from './LoginTips'

export default {
  name: 'LetterLogin',
  components: {
    LoginTips,
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
          { required: true, message: '请输入正确的手机号码',
            trigger: 'blur', validator: validatePhone }
        ],
        authCode: [
          { required: true, message: '请输入正确的验证码',
            trigger: 'blur', validator: validatorAuthCode }
        ],
      }
    }
  },
  methods: {
    getAuthCode() {
      this.$refs.loginForm.validateField('phone', (s) => {
        if (s === '') {
          // 校验通过
          const phone = this.loginForm.phone
          fetchAuthCode(phone).then((response) => {
            console.log('fetchAuthCode', response)
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
        if (valid) {
          const f = {
            phone: this.loginForm.phone,
            code: this.loginForm.authCode,
          }
          login(f).then((response) => {
            const { data } = response.data
            const { code, msg } = data
            if (code !== 0) {
              // callback('请输入正确的验证码')
              Message.error(`[${code}]: ${msg}`)
            } else {
              Message.success('登录成功')
              setTimeout(() => {
                // callback()
                location.reload()
              }, 500)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" module>
.LetterLogin{
  margin: 10px 0 0 0;
}
.phoneInput {
  width: 320px;
  height: 56px;
  font-size: 14px;
  &::placeholder {
    color: #BBBBBB;
  }
}

.inputBox {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.codeInput {
  font-size: 14px;
  width: 184px;
  height: 56px;
  margin-right: 16px;
  &::placeholder {
    color: #BBBBBB;
  }
}

.codeButton {
  line-height: 56px;
  display: inline-block;
  width: 120px;
  height: 56px;
  border: 2px solid #2CABFF;
  border-radius: 12px;
  background: #fff;
  color: #2cabff;
  cursor: pointer;
}

.confirmButton {
  width: 320px;
  color: #fff;
  font-size: 16px;
  height: 56px;
  line-height: 56px;
  background-image: linear-gradient(270deg, #44B5FF 0%, #79D2FF 100%);
  border-radius: 12px;
  margin-top: 8px;
  margin-bottom: 16px;
}
</style>
