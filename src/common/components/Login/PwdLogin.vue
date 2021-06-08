<template>
  <div :class="$style.PwdLogin">
    <Form :model="pwdForm" ref="pwdForm" :rules="rules">
      <FormItem prop="phone">
        <Input :class="$style.phoneInput" placeholder="请输入手机号" v-model="pwdForm.phone"></Input>
      </FormItem>
      <FormItem prop="password">
        <Input :class="$style.phoneInput" placeholder="请输入密码" v-model="pwdForm.password"></Input>
      </FormItem>
    </Form>
    <div :class="$style.tips">
      <div :class="$style.forget" @click="toSetPwd">忘记密码?</div>
      <div :class="$style.setting" @click="toSetPwd">设置密码</div>
    </div>
    <button :class="$style.confirmButton" @click="toPwdLogin">登录</button>
    <LoginTips></LoginTips>
  </div>
</template>

<script>
import { Form, FormItem, Input, Message } from 'element-ui'
import { validatePhone, validatePassword } from '@/common/utils/validate'
import LoginTips from './LoginTips'
import { pwdLogin } from '@/api/login'

export default {
  name: 'PwdLogin',
  components: {
    LoginTips,
    Form,
    FormItem,
    Input,
    Message
  },
  data() {
    return {
      pwdForm: {
        phone: '',
        password: '',
        src: 68 // 客户端类型: 65-android, 66-iOS, 67-小程序, 68-web
      },
      rules: {
        phone: [
          { required: true, message: '请输入正确的手机号码',
            trigger: 'blur', validator: validatePhone }
        ],
        password: [
          { required: true, message: '请输入正确的六位数密码',
            trigger: 'blur', validator: validatePassword }
        ]
      }
    }
  },
  methods: {
    toPwdLogin() {
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          this.doPwdLogin()
        } else {
          Message.error('请全部填写正确再提交')
        }
      })
    },
    async doPwdLogin() {
      const res = await pwdLogin(this.pwdForm)
      console.log('pwdLogin:', res)
      const { data } = res.data
      const { code, msg } = data
      if (code !== 0) {
        Message.error(`[${code}]: ${msg}`)
      } else {
        Message.success('登录成功')
        setTimeout(() => {
          location.reload()
        }, 500)
      }
    },
    toSetPwd() {
      this.$emit('showSetPwd')
    }
  }
}
</script>

<style lang="less" module>
.PwdLogin{
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

.tips {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 320px;
  height: 16px;
  font-size: 12px;
  color: #2CABFF;
  font-weight: 400;
  margin: -4px auto 0 auto;
}

.forget {
  cursor: pointer;
}

.setting {
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
}
</style>
