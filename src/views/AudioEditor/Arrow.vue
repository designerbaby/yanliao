<template>
  <Dragger :class="[$style.arrow, $style[direction], isActive ? $style.isActive : '']"
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
import Dragger from './Components/Dragger.vue'

export default {
  name: 'Arrow',
  components: { Message, Dragger },
  props: ['direction', 'pitch'],
  data() {
    return {
      isActive: false,
      moveArrowStart: null,
      moveArrowEnd: null
    }
  },
  computed: {
    playState() {
      return this.$store.state.playState
    }
  },
  methods: {
    onStart(event) { // 鼠标按下事件
      if (this.$store.state.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }

      this.isActive = true
      this.moveArrowStart = {
        width: this.pitch.width,
        left: this.pitch.left,
        top: this.pitch.top,
        clientX: event.clientX
      }

    },
    onMove(event) {
      if (this.moveArrowStart) {
        const parentNode = this.$el.parentNode

        const movePx = event.clientX - this.moveArrowStart.clientX
        const newTop = this.moveArrowStart.top

        let newWidth = 0
        let newLeft = 0
        if (this.direction === 'right') {
          newLeft = this.moveArrowStart.left
          newWidth = Math.max(20, this.moveArrowStart.width + movePx)
        } else if (this.direction === 'left') {
          newLeft = this.moveArrowStart.left + movePx // 这里要加是因为往左话，movePx是负的
          newWidth = Math.max(20, this.moveArrowStart.width - movePx)
          // console.log(`newLeft: ${newLeft}, newWidth: ${newWidth}`)
          if (newWidth <= 20) {
            return
          }
        }
        if (newLeft < 0) {
          newLeft = 0
        }
        parentNode.style.width = `${newWidth}px`
        parentNode.style.transform = `translate(${newLeft}px, ${newTop}px)`
        this.moveArrowEnd = {
          width: newWidth,
          left: newLeft,
          top: newTop,
          target: parentNode,
          direction: this.direction
        }
        // console.log(`onArrowMouseMove:`, JSON.stringify(this.moveArrowEnd))
      }
    },
    onEnd(event) {
      // console.log(`onArrowLeave`)
      if (this.moveArrowStart) {
        this.moveArrowStart = null
        this.isActive = false

        // let moveArrowEnd = this.moveArrowEnd
        if (!this.moveArrowEnd) {
          this.moveArrowEnd = {
            width: this.pitch.width,
            left: this.pitch.left,
            top: this.pitch.top,
            target: this.$el.parentNode,
            direction: this.direction
          }
        }
        this.$emit('move-end', {
          ...this.moveArrowEnd
        })
      }
    },
  }
}
</script>

<style lang="less" module>
.arrow{
  position: absolute;
  height: 25px;
  width: 7px;
  top: 0;
  opacity: 0;
  background: #0D7821;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  img {
    width: 100%;
    height: 100%;
  }
  &:hover {
    opacity: 1;
  }
}

.right {
  right: 0px;
}

.left {
  transform: scale(-1);
  left: 0px;
}

.isActive {
  opacity: 0.7;
}

</style>
