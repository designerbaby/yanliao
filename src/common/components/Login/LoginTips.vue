<template>
  <div :class="$style.tips">
    <div>未注册的手机号将帮您注册新账号，登录即代表</div>
    <div>您同意 <a href="/userAgreement" target="_blank">用户协议</a> 和 <a href="/privacyPolicy" target="_blank">隐私政策</a></div>
  </div>
</template>

<script>
export default {
  name: 'bottomTip',
  data() {
    return {}
  }
}
</script>

<style lang="less" module>
.tips{
  font-size: 12px;
  color: #bbbbbb;
  margin-top: 24px;
  a {
    color: #2CABFF;
    text-decoration: none;
  }
}
</style>
