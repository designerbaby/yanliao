<template>
  <Dialog
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
  </Dialog>
</template>

<script>
import { Dialog, Message } from 'element-ui'
import { logout } from '@/api/login'
export default {
  name: 'LogouDialog',
  data() {
    return {
      logoutDialogShow: false
    }
  },
  components: {
    Dialog
  },
  methods: {
    showLogoutDialog() {
      this.logoutDialogShow = true
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
        } else {
          Message.error(`[${code}]: ${msg}`)
        }
      })
    }
  }
}
</script>

<style lang="less">
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
</style>
