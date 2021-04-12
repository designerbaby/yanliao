<template>
  <div :class="[$style.breath, it.selected ? $style.isActive : '']"
    :style="getStyle(it)"
  >
    {{ it.breath.pinyin }}
    <ArrowBreath
      :pitch="it"
      :index="index"
      :canMove="canMove"
      @move="onArrowBreathMove($event, index)"
      @move-end="onArrowBreathMoveEnd($event, index)"
    />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import ArrowBreath from './ArrowBreath.vue'

export default {
  name: 'Breath',
  components: {
    ArrowBreath,
    Message
  },
  props: ['it', 'index'],
  data() {
    return {
    }
  },
  computed: {
    stagePitches() {
      return this.$store.state.stagePitches
    }
  },
  methods: {
    getStyle(it) {
      return {
        width: `${it.breath.width}px`,
        height: `${it.height}px`,
        left: `${it.breath.left - it.left}px`
      }
    },
    onArrowBreathMove({ left, width, target }, index) {
      const pitch = this.stagePitches[index]
      pitch.breath.left = left
      pitch.breath.width = width
      const styles = this.getStyle(pitch)
      Object.keys(styles).forEach(k => {
        target.style[k] = styles[k]
      })
    },
    onArrowBreathMoveEnd({ left, width }, index) {
      console.log(`onArrowBreathMoveEnd: ${index}, left: ${left}, width: ${width}`)
      const pitch = this.stagePitches[index]
      pitch.breath.left = left
      pitch.breath.width = width
    },
    canMove(newLeft) {
      if (newLeft > (this.it.left - this.$store.state.noteWidth)) { // 最小只能移动到剩下1个32分音符
        return false
      }
      const before = this.stagePitches[this.index - 1]
      const beforeEnd = before.left + before.width
      if (newLeft <= beforeEnd) {
        return false
      }
      return true
    }
  }
}
</script>

<style lang="less" module>
.breath{
  position: absolute;
  height: 25px;
  width: 5px;
  background: #0f6d23;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  top: 0;
  left: 0;
  padding-left: 5px;
  &.isActive {
    background: #159430;
  }
}
</style>
