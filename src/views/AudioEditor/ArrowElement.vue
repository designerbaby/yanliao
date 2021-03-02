<template>
  <div :class="[$style.ArrowElement, isActive ? $style.isActive : '']"
    @mouseup.stop="onArrowEleLeave"
    @mousedown.prevent="onArrowEleMouseDown"
  >
    <img src="@/assets/audioEditor/arrow-right.png">
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { playState } from '@/common/utils/const'

export default {
  name: 'ArrowElement',
  props: ['pitch'],
  data() {
    return {
      isActive: false,
      moveArrowEleStart: null,
      moveArrowEleEnd: null
    }
  },
  computed: {
    playState() {
      return this.$store.state.playState
    }
  },
  methods: {
    onArrowEleMouseDown(event) {
      if (this.$store.state.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      document.addEventListener('mousemove', this.onArrowEleMouseMove)
      document.addEventListener('mouseleave', this.onArrowEleLeave)
      const target = event.target
      this.isActive = true
      this.moveArrowEleStart = {
        width: this.pitch.fuwidth,   // 辅音宽度
        left: this.pitch.fuleft, // 辅音left
        clientX: event.clientX
      }
      console.log('moveArrowEleStart:', JSON.stringify(this.moveArrowEleStart))
    },
    onArrowEleMouseMove(event) {
      if (this.moveArrowEleStart) {
        const parentNode = this.$el.parentNode

        const movePx = event.clientX - this.moveArrowEleStart.clientX
        let newLeft = newLeft = this.moveArrowEleStart.left + movePx
        let newWidth = this.moveArrowEleStart.width - movePx
        
        if (newLeft < 0) {
          newLeft = 0
        }

        parentNode.style.width = `${newWidth}px`
        parentNode.style.transform = `translate(${newLeft}px)`
        this.moveArrowEleEnd = {
          width: newWidth,
          left: newLeft,
          target: parentNode
        }
      }
    },
    onArrowEleLeave(event) {
      console.log('onArrowEleLeave')
      if (this.moveArrowEleStart) {
        this.moveArrowEleStart = null
        document.removeEventListener('mousemove', this.onArrowEleMouseMove)
        document.removeEventListener('mouseleave', this.onArrowEleLeave)
        this.isActive = false

        this.$emit('move-end', {
          ...this.moveArrowEleEnd
        })
      }
    }
  }
}
</script>

<style lang="less" module>
.ArrowElement{
  position: absolute;
  height: 25px;
  width: 7px;
  opacity: 0;
  background: #33735c;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  top: 0;
  left: 0;
  img {
    width: 100%;
    height: 100%;
    transform: scale(-1);
  }
  &:hover {
    opacity: 1;
  }
}

.isActive {
  opacity: 0.7;
}
</style>
