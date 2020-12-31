<template>
  <div 
      :class="[$style.line, lineActive ? $style.isActive : '']"
      :style="{
        transform: `translateX(${left}px)`
      }" 
      ref="audioEditorLine"
      @mousedown.stop="onLineMouseDown"
      @mouseup.stop="onLineMouseUp"
    >
    <span :class="$style.innerSpan"></span>
    <div :class="$style.inner"></div>
  </div>
</template>

<script>
import Bus from '@/common/utils/bus'

export default {
  name: 'BeatLine',
  data() {
    return {
      isLineMouseDown: false,
      lineActive: false,
      left: 0,
      startLeft: 0,
      startX: 0
    }
  },
  mounted() {
    Bus.$on('toMoveLinePos', this.toMove)
    Bus.$on('toRestartLinePos', this.toRestart)
  },
  computed: {
    isSynthetizing() {
      return this.$store.getters.isSynthetizing
    }
  },
  methods: {
    onLineMouseDown(event) {
      console.log(`onLineMouseDown`)
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      this.isLineMouseDown = true
      this.startLeft = this.left
      this.startX = event.clientX
      // console.log(`down event.clientX`, event.clientX)

      document.addEventListener('mousemove', this.onLineMouseMove)
      document.addEventListener('mouseleave', this.onLineMouseUp)
    },
    onLineMouseMove(event) {
      if (this.isLineMouseDown) {
        const movePx = event.clientX - this.startX
        const left = this.startLeft + movePx
        // console.log(`move event.clientX`, this.startX, event.clientX, movePx, left)
        if (left < 0) { // 小于0 不向左移动
          return
        }
        this.left = left
      }
    },
    onLineMouseUp(event) {
      console.log(`onLineMouseUp`)
      document.removeEventListener('mousemove', this.onLineMouseMove)
      document.removeEventListener('mouseleave', this.onLineMouseUp)
      if (this.isLineMouseDown) {
        this.isLineMouseDown = false
        // 移动好线之后先存起来
        this.$store.dispatch('updateLineLeft', this.left)
        Bus.$emit('pitchChange')
      }
    },
    toMove(maxLeft, playTime) {
      this.lineActive = true
      const linex = maxLeft
      this.$refs.audioEditorLine.style.left = `${linex}px`
      this.$refs.audioEditorLine.style.transitionDuration = `${(playTime / 1000).toFixed(1)}s`
    },
    toRestart() {
      this.lineActive = false
      this.$refs.audioEditorLine.style.left = '0px'
    }
  }
}
</script>

<style lang="less" module>
.line {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1000;
  width: 16px;
  height: 2100px;

  &:active {
    opacity: 0.5;
  }
 
  &.isActive {
    transition: left 0.3s linear;
  }
}
.innerSpan{
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
  border-top: 8px solid #b8b8b8;
  border-bottom: 8px solid transparent;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}
.inner {
  width: 3px;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 1;
  background: #b8b8b8;
}
</style>
