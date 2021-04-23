<template>
  <Dragger :class="[$style.breath, isActive ? $style.isActive : '']"
    @on-start="onStart"
    @on-move="onMove"
    @on-end="onEnd"
  >
    <img src="@/assets/audioEditor/arrow-right.png">
  </Dragger>
</template>

<script>
import { Message } from 'element-ui'
import { playState } from '@/common/utils/const'
import Dragger from '@/views/AudioEditor/Components/Dragger.vue'

export default {
  name: 'Breath',
  components: {
    Dragger,
    Message
  },
  props: ['pitch', 'index', 'canMove'],
  data() {
    return {
      isActive: false,
      moveArrowBreathStart: null,
      moveArrowBreathEnd: null
    }
  },
  computed: {
    playState() {
      return this.$store.state.playState
    }
  },
  methods: {
    onStart(event) {
      if (this.$store.state.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      this.isActive = true
      this.moveArrowBreathStart = {
        left: this.pitch.breath.left,
        width: this.pitch.breath.width,
        clientX: event.clientX
      }
      // console.log('moveArrowBreathStart:', JSON.stringify(this.moveArrowBreathStart))
    },
    onMove(event) {
      if (this.moveArrowBreathStart) {
        const parentNode = this.$el.parentNode
        const startX = this.moveArrowBreathStart.clientX
        const endX = event.clientX

        const movePx = startX - endX
        const newLeft = this.moveArrowBreathStart.left - movePx
        const newWidth = this.moveArrowBreathStart.width + movePx
        const move = this.canMove(newLeft)
        if (!move) {
          return
        }
        this.moveArrowBreathEnd = {
          left: newLeft,
          width: newWidth,
          target: parentNode
        }
        // console.log('moveArrowBreathEnd:', JSON.stringify(this.moveArrowBreathEnd))
        this.$emit('move', {
          ...this.moveArrowBreathEnd
        })
      }
    },
    onEnd(event) {
      if (this.moveArrowBreathStart) {
        this.moveArrowBreathStart = null
        this.isActive = false

        this.$emit('move-end', {
          ...this.moveArrowBreathEnd
        })
      }
    }
  }
}
</script>

<style lang="less" module>
.breath{
  position: absolute;
  height: 25px;
  width: 7px;
  opacity: 0;
  background: #0a601a;
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
