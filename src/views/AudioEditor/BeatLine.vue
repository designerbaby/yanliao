<template>
  <div 
      :class="[$style.line, lineActive ? $style.isActive : '']"
      :style="{
        transform: `translateX(${lineLeft}px)`,
        height: `${stageHeight}px`
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
import { Message } from 'element-ui'

export default {
  name: 'BeatLine',
  data() {
    return {
      isLineMouseDown: false,
      // lineActive: false,
      left: 0,
      startLeft: 0,
      startX: 0,
      // isToStop: false,
      eventListener: null
    }
  },
  mounted() {
    // Bus.$on('toMoveLine', this.toMove)
    // Bus.$on('toBeginLine', this.toBegin)
    // Bus.$on('toStopLine', this.toStop)
    // this.$refs.audioEditorLine.addEventListener('transitionend', this.onTransitionEnd)
  },
  computed: {
    isSynthetizing() {
      return this.$store.state.isSynthetizing
    },
    stageHeight() {
      return this.$store.getters.stageHeight
    },
    lineLeft() {
      return this.$store.state.lineLeft
    }
  },
  methods: {
    // onTransitionEnd() {
    //   console.log('transitionEnd')
    //   if (!this.isToStop) {
    //     this.toBegin()
    //   }
    //   Bus.$emit('moveEnd')
    // },
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
        // if (left < 0) { // 小于0 不向左移动
        //   return
        // }
        // this.left = left
        // console.log(`this.left: ${this.left}`)

        this.$store.dispatch('updateLineLeft', left)
      }
    },
    onLineMouseUp(event) {
      console.log(`onLineMouseUp`)
      document.removeEventListener('mousemove', this.onLineMouseMove)
      document.removeEventListener('mouseleave', this.onLineMouseUp)
      if (this.isLineMouseDown) {
        this.isLineMouseDown = false

        const movePx = event.clientX - this.startX
        const left = this.startLeft + movePx

        // 移动好线之后先存起来
        this.$store.dispatch('updateLineLeft', left)
        Bus.$emit('pitchChange')
      }
    }
    // toMove(minLeft, maxLeft, playTime) {
    //   this.isToStop = false
    //   this.lineActive = true
    //   this.$refs.audioEditorLine.style.left = `${minLeft}px`
    //   this.$refs.audioEditorLine.style.transitionDuration = `${(playTime / 1000).toFixed(1)}s`
    //   this.$refs.audioEditorLine.style.left = `${maxLeft}px`
    // },
    // toBegin() {
    //   this.$refs.audioEditorLine.removeEventListener('transitionend', this.onTransitionEnd)
    //   this.lineActive = false
    //   this.$refs.audioEditorLine.style.transitionDuration = '0.3s'
    //   this.$refs.audioEditorLine.style.left = '0px'
    // },
    // toStop() {
    //   this.isToStop = true
    //   this.lineActive = false
    //   const audioEditorLine = this.$refs.audioEditorLine
    //   const computedStyle = window.getComputedStyle(audioEditorLine)
    //   const left = computedStyle.getPropertyValue('left')
    //   audioEditorLine.style.left = left
    // }
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
