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
import { pxToTime, timeToPx } from '@/common/utils/helper'

export default {
  name: 'ArrowElement',
  props: ['pitch', 'index'],
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
    },
    stagePitches() {
      return this.$store.state.stagePitches
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
      console.log('onArrowEleMouseDown this.pitch:', this.pitch)
      const preTime = this.pitch.preTime
      this.moveArrowEleStart = {
        preTime,
        clientX: event.clientX
      }
      console.log('moveArrowEleStart:', JSON.stringify(this.moveArrowEleStart))
    },
    onArrowEleMouseMove(event) {
      if (this.moveArrowEleStart) {
        // const parentNode = this.$el.parentNode
        const startX = this.moveArrowEleStart.clientX
        const endX = event.clientX
        const movePx = startX - endX

        const moveTime = pxToTime(movePx, this.$store.state.noteWidth, this.$store.state.bpm)
        const newPreTime = this.moveArrowEleStart.preTime + moveTime

        const before = this.index - 1 > -1 ? this.stagePitches[this.index - 1] : {}
        let newLeft = this.pitch.left - movePx
        console.log(`movePx: ${movePx}, preTime: ${this.moveArrowEleStart.preTime}, moveTime: ${moveTime}, newPreTime: ${newPreTime}, newLeft:${newLeft}`)
        if (this.index === 0) { // 第一个只能拉到最左边
          if (newLeft < 10) {
            newLeft = 10
          }
        }
        // if (before.yuanEnd < this.moveArrowEleStart.left) { // 上一个的元音结尾比当前的辅音开头小，说明两个有空格
        //   if (newLeft < before.yuanEnd) { // 如果移动到的新的left比上一个元音的前面，那就只能是上一个元音的结尾
        //     newLeft = before.yuanEnd
        //   }
        // } else { // 当前辅音在上一个元音之间
        //   if (newLeft < (before.yuanLeft + this.$store.state.noteWidth)) { // 只能移动到上一个元音的最左边+1个32分音符的单位
        //     newLeft = before.yuanLeft + this.$store.state.noteWidth
        //   }
        //   newYuanEnd = newLeft
        // }
        this.moveArrowEleEnd = {
          preTime: newPreTime
        }

        this.$emit('move', {
          ...this.moveArrowEleEnd
        })
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
    pointer-events: none;
  }
  &:hover {
    opacity: 1;
  }
}

.isActive {
  opacity: 0.7;
}
</style>
