<template>
  <div :class="$style.PitchLine">
    <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 80 Q 52.5 10, 95 80 T 180 80" stroke="black" fill="transparent"/>
    </svg>
  </div>
</template>

<script>
import { f0Data } from '@/common/utils/mock'

export default {
  name: 'PitchLine',
  data() {
    return {}
  },
  mounted() {
    console.log(`f0Data:${f0Data}`)
  }
}
</script>

<style lang="less" module>
.PitchLine{
  position: absolute;
  top: 0;
  left: 0;
}
</style>
