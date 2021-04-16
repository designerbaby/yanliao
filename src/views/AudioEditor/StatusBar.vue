<template>
  <div :class="$style.container">
    <div :class="$style.holder" v-if="isFixed"></div>
    <div :class="[$style.main, {[$style.fixed]: isFixed}]">
      <Beat></Beat>
      <BeatTop></BeatTop>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Beat from './Beat.vue'
import BeatTop from './BeatTop.vue'
export default {
  name: 'StatusBar',
  components: { Beat, BeatTop },
  computed: {
    ...mapState({
      isFixed: 'isExceedHeader'
    })
  }
}
</script>

<style module lang="less">
.container {
  height: 25px;
}
.holder {
  height: 100%;
  width: 100%;
  flex: 1;
}
.main {
  background-color: #373736;
  width: 100%;
  display: flex;
}
.fixed {
  position: fixed;
  top: 78px;
  // top: 222px;
  z-index: 2000;
}
</style>
