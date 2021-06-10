<template>
  <div :class="[$style.SettingPwd]">
    <div :class="$style.title">
      <div :class="$style.back" @click="back"></div>
      设置密码
    </div>
    <Form :model="setForm" ref="setForm" :rules="rules">
      <FormItem prop="phone">
        <Input :class="$style.commonInput" placeholder="请输入手机号" v-model="setForm.phone"></Input>
      </FormItem>
      <FormItem prop="code">
        <div :class="$style.inputBox">
          <Input :class="$style.codeInput" placeholder="请输入验证码" v-model="setForm.code"></Input>
          <div v-if="timeLeft === 60" :class="$style.codeButton" @click="getAuthCode">{{ sendAuthCodeText }}</div>
          <div v-if="timeLeft <= 59" :class="$style.codeButton">{{sendAuthCodeText}}({{timeLeft}}s)</div>
        </div>
      </FormItem>
      <FormItem prop="password">
        <Input :class="$style.commonInput" placeholder="请输入6位数字或字母密码" v-model="setForm.password" show-password></Input>
      </FormItem>
    </Form>
    <button :class="$style.confirmButton" @click="confirm">确定</button>
  </div>
</template>

<script>
import { Form, FormItem, Input, Message } from 'element-ui'
import { validatePhone, validatePassword, validatorAuthCode } from '@/common/utils/validate'
import { setPwd, fetchAuthCode } from '@/api/login'

export default {
  name: 'SettingPwd',
  components: {
    Form,
    FormItem,
    Input,
    Message
  },
  data() {
    return {
      timeLeft: 60,
      sendAuthCodeText: '获取验证码',
      setForm: {
        phone: '',
        code: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入正确的手机号码',
            trigger: 'blur', validator: validatePhone }
        ],
        code: [
          { required: true, message: '请输入正确的验证码',
            trigger: 'blur', validator: validatorAuthCode }
        ],
        password: [
          { required: true, message: '请输入正确的六位数密码',
            trigger: 'blur', validator: validatePassword }
        ]
      }
    }
  },
  methods: {
    async getAuthCode() {
      this.$refs.setForm.validateField('phone', async (valid) => {
        if (valid === '') {
          const res = await fetchAuthCode(this.setForm.phone, 2)
          console.log('fetchAuthCode:', res)
          const { data } = res.data
          const { code, msg } = data
          if (code !== 0) {
            Message.error(`[${code}]: ${msg}`)
          } else {
            Message.success('验证码发送成功 !')
            clearInterval(this.timer)
            this.sendAuthCodeText = '重新发送'
            this.timeLeft = 59
            this.timer = setInterval(() => {
              if (this.timeLeft > 0) {
                this.timeLeft--
              } else {
                this.timeLeft = 60
                clearInterval(this.timer)
              }
            }, 1000)
          }
        }
      })
    },
    async confirm() {
      this.$refs.setForm.validate(async (valid) => {
        if (valid) {
          const req = Object.assign({}, this.setForm, {
            src: 68
          })
          const res = await setPwd(req)
          console.log('setPwd', res)
          const { data } = res.data
          const { code, msg } = data
          if (code !== 0) {
            Message.error(`[${code}]: ${msg}`)
          } else {
            Message.success('密码设置成功,快去登录吧～')
            this.$emit('closeSetPwd')
          }
        }
      })
    },
    back() {
      this.$emit('closeSetPwd')
    }
  }
}
</script>

<style lang="less" module>
.SettingPwd{
  // transition: all 1s linear;
  // position: absolute;
}
.title {
  display: flex;
  font-size: 18px;
  color: #333;
  font-weight: 600;
  align-items: center;
  margin: 0 0 26px 20px;
}

.back {
  background-image: url('~@/assets/back.png');
  background-repeat: no-repeat;
  background-size: 100%;
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.commonInput {
  width: 320px;
  height: 56px;
  font-size: 14px;
  // margin-left: 20px;
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
