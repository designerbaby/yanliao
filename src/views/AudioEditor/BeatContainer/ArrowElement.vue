<template>
  <Dragger :class="[$style.ArrowElement, isActive ? $style.isActive : '']"
    @on-start="onStart"
    @on-move="onMove"
    @on-end="onEnd"
    >
    <img src="@/assets/audioEditor/arrow-right.png">
  </Dragger>
</template>

<script>
import { Message } from 'element-ui'
import { PlayState } from '@/common/utils/const'
import { pxToTime } from '@/common/utils/helper'
import Dragger from '@/views/AudioEditor/Components/Dragger.vue'

export default {
  name: 'ArrowElement',
  components: { Dragger, Message },
  props: ['pitch', 'index', 'canMove'],
  data() {
    return {
      isActive: false,
      moveArrowEleStart: null,
      moveArrowEleEnd: null
    }
  },
  computed: {
    playState() {
      return this.$store.state.const.playState
    },
    stagePitches() {
      return this.$store.state.change.stagePitches
    }
  },
  methods: {
    onStart(event) {
      if (this.$store.state.const.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.playState === PlayState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      // 操作存储
      // this.$store.dispatch('done/push')
      this.isActive = true
      // console.log('onArrowEleMouseDown this.pitch:', this.pitch)
      const preTime = this.pitch.preTime
      this.moveArrowEleStart = {
        preTime,
        clientX: event.clientX
      }
      console.log('moveArrowEleStart:', JSON.stringify(this.moveArrowEleStart))
    },
    onMove(event) {
      if (this.moveArrowEleStart) {
        // const parentNode = this.$el.parentNode
        const startX = this.moveArrowEleStart.clientX
        const endX = event.clientX
        const movePx = startX - endX

        const moveTime = pxToTime(movePx, this.$store.state.const.noteWidth, this.$store.state.const.bpm)
        const newPreTime = this.moveArrowEleStart.preTime + moveTime

        const move = this.canMove(this.moveArrowEleStart.preTime, newPreTime, this.index)
        if (!move) {
          return
        }
        this.moveArrowEleEnd = {
          preTime: newPreTime
        }

        this.$emit('move',  {
          ...this.moveArrowEleEnd
        })
      }
    },
    onEnd(event) {
      console.log('onArrowEleLeave')
      if (this.moveArrowEleStart) {
        this.moveArrowEleStart = null
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
