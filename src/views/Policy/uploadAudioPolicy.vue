<template>
  <div>xxx</div>
</template>

<script>
// @ is an alias to /src
import { reportEvent } from '@/common/utils/helper'

export default {
  name: 'UploadAudioPolicy',
  mounted() {
    document.title = "上传音源须知"
  }
};
</script>

<style lang="less" scoped>
.uploadAudioPolicy {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px;
  a {
    color: #3072f6;
  }
}
.sj2 {
  text-indent: 2em;
}
.sj4 {
  text-indent: 4em;
}
.red {
  color: #ec3a2c;
}

</style>
