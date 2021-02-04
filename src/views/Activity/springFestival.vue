<template>
  <div :class="$style.springFestival">
    <div :style="{ backgroundImage: 'url(' + springBg + ')' }" :class="$style.head">
      <div :class="$style.contain">
        <img src="@/assets/active/head-title.png" :class="$style.title" />
        <img src="@/assets/active/head-people.png" :class="$style.people" />
      </div>
      <div :class="$style.contain">
        <img src="@/assets/active/content-1.png" :class="$style.content1" />
        <img src="@/assets/active/content-2.png" :class="$style.content2" />
        <img src="@/assets/active/content-3.png" :class="$style.content3" />
        <img src="@/assets/active/content-4.png" :class="$style.content4" />
        <img src="@/assets/active/content-5.png" :class="$style.content5" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { reportEvent } from '@/common/utils/helper'
import springBg from '@/assets/active/head-bg.jpg'

export default {
  name: 'Home',
  data() {
    return {
      springBg: springBg
    }
  },
  mounted() {
    reportEvent('activity-page-exposure')
    this.$emit('changeBg', 3)
    document.title = '鬼畜明星大拜年 集千赞得万年'
  }
}
</script>

<style lang="less" scoped module>
.springFestival {
  text-align: center;
}
.head {
  background-size: 100% 100%;
  width: 100%;
  height: 1200px;
}
.contain {
  width: 1080px;
  margin: 0 auto;
  // border: 1px solid yellow;
}
.title {
  width: 1080px;
  height: 360px;
  margin: 136px 0 0 0;
}
.people {
  width: 1080px;
  height: 499px;
}
.content1 {
  width: 1080px;
  height: 1700px;
}
.content2 {
  width: 1080px;
  height: 1199px;
}
.content3 {
  width: 1080px;
  height: 669px;
}
.content4 {
  width: 1080px;
  height: 2922px;
}
.content5 {
  width: 1080px;
  height: 1201px;
}
</style>
