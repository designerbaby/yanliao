<template>
  <div class="footer">
    <div class="footer-link">
      <a href="https://support.qq.com/product/295341" class="footer-link-box" title="用户反馈论坛" target="_blank">用户反馈论坛</a>
      <a href="https://www.tencentmusic.com/zh-cn/contact.html" target="_blank" class="footer-link-box" title="联系我们">联系我们</a>
      <a href="/userAgreement" target="_blank" class="footer-link-box" title="服务协议">服务协议</a>
      <a href="/privacypolicy" target="_blank" class="footer-link-box" title="隐私政策">隐私政策</a>
      <a href="https://www.tencentmusic.com/zh-cn/right.html" class="footer-link-box" title="权利声明" target="_blank">权利声明</a>
      <a href="https://www.tencentmusic.com/zh-cn/whistleblower.html" class="footer-link-box" title="监督举报" target="_blank">监督举报</a>
      <a href="https://beian.miit.gov.cn" class="footer-link-box" target="_blank" rel="nofollow" title="粤ICP备17078037号">粤ICP备17078037号</a>
      <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=291243638&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:291243638:51" alt="点击这里给我发消息" title="点击这里给我发消息"/></a>
    </div>
    <div class="footer-copyright">© 2016 - 2020 腾讯音乐娱乐（深圳）有限公司 版权所有</div>
    <div class="footer-copyright">创作工具交流QQ：291243638</div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
.footer {
  border-top: 1px solid rgba(216, 216, 216, 0.3);
  text-align: center;
  font-size: 14px;
  color: #b2b2b2;
  margin: 70px auto 0px;
  padding-bottom: 34px;
  width: 80%;
  .footer-link {
    margin-top: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      text-decoration: none;
      color: #b2b2b2;
    }
    a + a {
      margin-left: 32px;
    }
  }
  .footer-copyright {
    margin-top: 16px;
  }
}
</style>