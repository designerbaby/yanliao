<template>
  <div :class="$style.audioHeader">
    <div :class="$style.left" @click="openHomePage">
      <img src="@/assets/logo.png" alt="" :class="$style.logo">
      <div :class="$style.text">百万填词创作工具</div>
    </div>
    <div :class="$style.right" @click="openProfilePage">
      <div :class="$style.nick">{{ userInfo.nick_name}}</div>
      <img :src="userInfo.user_logo" :class="$style.avatar">
    </div>
  </div>
</template>

<script>
export default {
  name: 'audioHeader',
  data() {
    return {}
  },
  computed: {
    userInfo() {
      return JSON.parse(this.$store.state.userInfo) || sessionStorage.getItem('userInfo')
    }
  },
  methods: {

    openHomePage() {
      this.$router.push('/')
    },
    openProfilePage() {
      this.$router.push('/profile')
    }
  }
}
</script>

<style lang="less" module>
.audioHeader{
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
</style>
