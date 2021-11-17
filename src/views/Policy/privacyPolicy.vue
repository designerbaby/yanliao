<template>
  <div>xxxx</div>
</template>

<script>
// @ is an alias to /src
import { reportEvent } from '@/common/utils/helper';

export default {
  name: 'PrivacyPolicy',
  mounted() {
    document.title = "盐料视频隐私政策";
  }
};
</script>

<style lang="less" scoped>
.privacyPolicy {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px;
  li {
    font-size: 20px;
  }
  strong {
    font-weight: 600;
  }
}
</style>
