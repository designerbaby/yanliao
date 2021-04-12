<template>
  <div :class="[$style.breath, it.selected ? $style.isActive : '']"
    :style="{
      width: `${it.breath.width}px`,
      height: `${it.height}px`
    }"
  >
    {{ it.breath.pinyin }}
    <ArrowBreath
      :pitch="it"
      :index="index"
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
    onArrowBreathMove({ left, width }, index) {
      console.log('onArrowBreathMove:', index)
    },
    onArrowBreathMoveEnd({ left, width }, index) {
      console.log('onArrowBreathMoveEnd:', index)
      const pitch = this.stagePitches[index]
      pitch.breath.left = left
      pitch.breath.width = width
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
  left: -20px;
  padding-left: 5px;
  &.isActive {
    background: #159430;
  }
}
</style>
