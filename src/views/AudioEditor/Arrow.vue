<template>
  <div :class="[$style.arrow, $style[direction], isActive ? $style.isActive : '']"
    @mouseup.stop="onArrowLeave"
    @mousedown.prevent="onArrowMouseDown">
      <img src="@/assets/right.png"/>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { playState } from '@/common/utils/const'

export default {
  name: 'Arrow',
  props: ['direction', 'pitch'],
  data() {
    return {
      isActive: false,
      moveArrowStart: null,
      moveArrowEnd: null
    }
  },
  components: {
    Message
  },
  computed: {
    isSynthetizing() {
      return this.$store.state.isSynthetizing
    },
    playState() {
      return this.$store.state.playState
    }
  },
  methods: {
    onArrowMouseDown(event) { // 鼠标按下事件
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      document.addEventListener('mousemove', this.onArrowMouseMove)
      document.addEventListener('mouseleave', this.onArrowLeave)
      const target = event.target
      this.isActive = true
      this.moveArrowStart = {
        width: this.pitch.width,
        left: this.pitch.left,
        top: this.pitch.top,        
        clientX: event.clientX
      }

      console.log('moveArrowStart:', JSON.stringify(this.moveArrowStart))
    },
    onArrowMouseMove(event) {
      // console.log(`onArrowMouseMove:`, this.direction)
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
      }
    },
    onArrowLeave(event) {
      console.log(`onArrowLeave`)
      if (this.moveArrowStart) {
        this.moveArrowStart = null
        document.removeEventListener('mousemove', this.onArrowMouseMove)
        document.removeEventListener('mouseleave', this.onArrowLeave)
        this.isActive = false

        this.$emit('move-end', {
          ...this.moveArrowEnd
        })
      }
    },
  }
}
</script>

<style lang="less" module>
.container{
  position: relative;
}

.arrow{
  position: absolute;
  height: 25px;
  width: 30px;
  top: 0;
  opacity: 0;
  img {
     width: 100%;
     height: 100%;
  }
  &:hover {
    opacity: 1;
  }
}

.right {
  right: -27px;
}

.left {
  transform: scale(-1);
  left: -27px;
}

.isActive {
  opacity: 0.7;
}

</style>
