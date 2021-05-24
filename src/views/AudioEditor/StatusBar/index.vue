<template>
  <div :class="$style.container">
    <div :class="$style.holder" v-if="isExceedHeader"></div>
    <div
      :class="[$style.main, isExceedHeader && !showArrange ? $style.fixed : '', isExceedHeader && showArrange ? $style.openFixed : '']">
      <Beat></Beat>
      <BeatTop></BeatTop>
      <!-- 颤音提示 -->
      <Shake  v-if="mode === ModeState.StateLine && lineMode === StateLineMode.Shake"></Shake>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Beat from './Beat.vue'
import BeatTop from './BeatTop.vue'
import Shake from './Components/StateLine/Shake.vue'
import { ModeState, StateLineMode } from "@/common/utils/const"

export default {
  name: 'StatusBar',
  data() {
    return {
      StateLineMode,
      ModeState: ModeState,
    }
  },
  components: { Beat, BeatTop, Shake },
  computed: {
    ...mapState('const', ['lineMode', 'mode', 'showArrange', 'isExceedHeader'])
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
  position: relative;
  background-color: #373736;
  width: 100%;
  display: flex;
  z-index: 2000;
}
.fixed {
  position: fixed;
  // top: 78px;
  top: 110px;
}

.openFixed {
  position: fixed;
  top: 237px;
}
</style>
