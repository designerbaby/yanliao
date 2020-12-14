<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="400px"
    custom-class="login-dialog"
    top="15%"
    @open="loginDialogOpen"
  >
    <div class="login-dialog-title">账号登录</div>
    <el-form :model="loginForm" ref="loginForm">
      <el-form-item prop="phone" :rules="{required: true, message: '请输入正确的手机号码', pattern: /^1[3-9]\d{9}$/, trigger: 'blur'}">
        <el-input class="phone-number-input" placeholder="请输入手机号" v-model="loginForm.phone"></el-input>
      </el-form-item>
      <el-form-item prop="authCode" :rules="{required: true, pattern: /^\d{6}$/, message: '请输入正确的验证码', trigger: 'blur'}">
        <div class="auth-code-input-box">
          <el-input class="auth-code-input" placeholder="请输入验证码" v-model="loginForm.authCode"></el-input>
          <div v-if="timeLeft === 60" class="get-auth-code-button" @click="getAuthCode">获取验证码</div>
          <div v-if="timeLeft <= 59" class="get-auth-code-button">已发送({{timeLeft}}s)</div>
          <!-- <div v-if="timeLeft === 60" class="get-auth-code-button" @click="getAuthCode">重新发送</div> -->
        </div>
      </el-form-item>
    </el-form>
    <button class="login-confirm-button" @click="confirmLoginButtonClick">登录</button>
    <div class="login-tips">
      <div>未注册的手机号将帮您注册新账号，登录即代表</div>
      <div>您同意 <a href="">用户协议</a> 和 <a href="">隐私政策</a></div>
    </div>
  </el-dialog>
</template>

<script>
import { 
  Dialog,
} from 'element-ui'

export default {
  components: {
    'el-dialog': Dialog,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    titleText: {
      type: String,
      default: '确认?',
    },
    confirmButtonText: {
      type: String,
      default: '确认',
    },
    cancelButtonText: {
      type: String,
      default: '取消',
    },
    confirmButtonEvent: {
      type: Function,
    },
    cancelButtonEvent: {
      type: Function,
    },
  },
  data() {
    return {
    }
  },
  methods: {
    beforeClose() {
      this.cancelButtonEvent()
    },
  },
}
</script>

<style lang="less" scope>
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