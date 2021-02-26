<template>
  <div :class="$style.EditAudioHeader">
    <div :class="$style.left" @click="openHomePage">
      <img src="@/assets/logo.png" alt="" :class="$style.logo">
      <div :class="$style.text">百万填词创作工具</div>
    </div>
    <div :class="$style.right" @click="openProfilePage" v-if="userInfo">
      <div :class="$style.nick">{{ userInfo.nick_name || `用户${uid}` }}</div>
      <img :src="userInfo.user_logo || defaultAvatar" :class="$style.avatar">
    </div>
    <div :class="$style.right" v-else>
      <div :class="$style.login" @click.stop="openLogin">登录</div>
    </div>
  </div>
</template>

<script>
import { safeParse, getCookie } from '@/common/utils/helper'

export default {
  name: 'EditAudioHeader',
  props: {
    openLoginDialog: Function
  },
  data() {
    return {
      defaultAvatar: 'https://musicx-1253428821.cos.ap-guangzhou.myqcloud.com/image/profile_default.png',
      userInfo: safeParse(sessionStorage.getItem('userInfo')),
      uid: getCookie('mx_uid')
    }
  },
  mounted() {
    // console.log('mx_uid:', this.uid)
  },
  methods: {
    openHomePage() {
      this.$router.push('/')
    },
    openProfilePage() {
      this.$router.push('/profile')
    },
    openLogin() {
      this.openLoginDialog()
    }
  }
}
</script>

<style lang="less" module>
.EditAudioHeader{
  height: 48px;
  background: #373736;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #fff;
  line-height: 14px;
  width: 100%;
  line-height: 48px;
}

.left {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo {
  width: 24px;
  height: 24px;
  margin: 0 8px 0 20px;
}

.right {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nick {
  font-size: 12px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin: 0 20px 0 8px;
}

.login {
  width: 56px;
  height: 24px;
  background: #179B30;
  border-radius: 12px;
  margin: 0 24px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover, &:active {
    opacity: 0.8;
  }
}
</style>
