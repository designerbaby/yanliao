<template>
  <div :class="$style.container">
    <div :class="$style.holder" v-if="isFixed"></div>
    <div
      :class="[$style.main, isFixed ? $style.fixed : '']">
      <Beat></Beat>
      <BeatTop></BeatTop>
    </div>
  </div>
</template>

<script>
// :class="[$style.main, isFixed && !showArrange ? $style.fixed : '', isFixed && showArrange ? $style.openFixed : '']">
import { mapState } from 'vuex'
import Beat from './Beat.vue'
import BeatTop from './BeatTop.vue'
export default {
  name: 'StatusBar',
  components: { Beat, BeatTop },
  computed: {
    ...mapState({
      isFixed: 'isExceedHeader'
    }),
    showArrange() {
      return this.$store.state.showArrange
    }
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
  z-index: 2000;
}
.fixed {
  position: fixed;
  top: 78px;
  // top: 110px;
}

.openFixed {
  position: fixed;
  top: 237px;
}
</style>
