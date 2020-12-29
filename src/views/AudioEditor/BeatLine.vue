<template>
  <div 
      :class="['audioEditor__line', lineActive ? 'is-active' : '']"
      :style="{
        transform: `translateX(${left}px)`
      }" 
      ref="audioEditorLine"
      @mousedown.stop="onLineMouseDown"
      @mouseup.stop="onLineMouseUp"
    >
    <span></span>
    <div class="audioEditor__line"></div>
  </div>
</template>

<script>
export default {
  name: 'BeatLine',
  data() {
    return {
      isLineMouseDown: false,
      lineActive: false,
      linex: 0,
      left: 55, // 这里要基于0来做
      endLeft: 0,
      startLeft: 0,
      startX: 0,
      leaveTimer: 0
    }
  },
  methods: {
    onLineMouseDown(event) {
      this.isLineMouseDown = true
      // console.log(`onLineMouseDown`, event)

      this.startLeft = this.left
      this.startX = event.clientX
      console.log(`down event.clientX`, event.clientX)

      document.addEventListener('mousemove', this.onLineMouseMove)
      document.addEventListener('mouseleave', this.onLineMouseUp)
    },
    onLineMouseMove(event) {
      // console.log(`onLineMouseMove`, event)
      if (this.isLineMouseDown) {
        const movePx = event.clientX - this.startX
        const left = this.startLeft + movePx
        console.log(`move event.clientX`, this.startX, event.clientX, movePx, left)
        this.left = left
      }
    },
    onLineMouseUp(event) {
      document.removeEventListener('onMouseMove', this.onLineMouseMove)
      document.removeEventListener('onMouseUp', this.onLineMouseUp)
      if (this.isLineMouseDown) {
        this.isLineMouseDown = false
        this.$emit('saveLeft', this.left)
      }
    },
    toMove(maxLeft) {
      this.lineActive = true
      this.linex = maxLeft + 55
      this.$refs.audioEditorLine.style.left = `${this.linex}px`
    },
    toRestart() {
      this.lineActive = false
      this.$refs.audioEditorLine.style.left = '55px'
    }
  }
}
</script>

<style lang="less" scoped>
.audioEditor__line {
  position: absolute;
  top: 0px;
  left: 0;
  z-index: 100;
  span {
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    border-top: 8px solid #b8b8b8;
    border-bottom: 8px solid transparent;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }
  div {
    width: 3px;
    height: 100%;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    z-index: 1;
    background: #b8b8b8;
  }
  width: 16px;
  height: 2100px;

  &:active {
    opacity: 0.5;
  }
 
  &.is-active {
    transition: left 0.3s linear;
  }
}
</style>
