<template>
  <div class="activityPage">
    <img src="@/assets/activity-text.jpg" alt="">
  </div>
</template>

<script>
// @ is an alias to /src
import { reportEvent } from '@/common/utils/helper'

export default {
  name: 'Home',
  components: {
  },
  mounted() {
    reportEvent('activity-page-exposure')
    this.$emit('changeBg', 2)
    document.title = '“点到为止”盐料爆款视频悬赏令'
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
  .activityPage {
    text-align: center;
    overflow: auto;
    img {
      margin-top: -80px;
      height: 1920px;
      width: 1080px;
    }
  }
</style>
